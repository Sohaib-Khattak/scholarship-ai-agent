const { OpenAI } = require('openai');
const axios = require('axios');
const logger = require('../utils/logger');
const { addScholarship, supabase } = require('../database/db');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return response.data;
  } catch (error) {
    logger.error(`Failed to scrape ${url}:`, error.message);
    return null;
  }
}

async function checkIfScholarshipExists(title, country, deadline) {
  try {
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .eq('title', title)
      .eq('country', country)
      .eq('deadline', deadline)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    logger.error('Check scholarship error:', error.message);
    return null;
  }
}

async function analyzePageWithGPT(pageContent, sourceUrl) {
  try {
    const prompt = `
    Analyze this scholarship/internship webpage and extract ALL opportunities found.

    Page Content:
    ${pageContent.substring(0, 3000)}

    For each opportunity found, extract:
    - Title (exact name)
    - Country
    - Degree Level (Bachelors/Masters/PhD/Postdoc)
    - Funding Type (Fully Funded/Partial/Stipend)
    - Deadline (in YYYY-MM-DD format)
    - Brief Description
    - Eligibility Requirements
    - Application Link

    Return as JSON array. Only include ACTIVE opportunities with future deadlines.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert scholarship researcher. Extract scholarship data accurately and return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      const opportunities = JSON.parse(jsonMatch[0]);
      return opportunities.map(opp => ({
        ...opp,
        source_url: sourceUrl,
        relevance_score: calculateRelevance(opp)
      }));
    }
    return [];
  } catch (error) {
    logger.error('GPT analysis failed:', error.message);
    return [];
  }
}

function calculateRelevance(opportunity) {
  let score = 5;

  if (opportunity.funding_type === 'Fully Funded') score += 3;
  if (opportunity.degree_level === 'Masters' || opportunity.degree_level === 'PhD') score += 2;
  if (opportunity.country === 'Germany' || opportunity.country === 'UK' || opportunity.country === 'USA') score += 1;

  return Math.min(score, 10);
}

async function huntScholarships() {
  logger.info('🔍 Starting Scholarship Hunter Agent...');

  const sources = [
    'https://www.opportunitiescircle.com',
    'https://www.scholarshipportal.com',
    'https://euraxess.ec.europa.eu',
    'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
    'https://www.chevening.org/scholarships/'
  ];

  const allOpportunities = [];
  const newOpportunities = [];

  for (const source of sources) {
    logger.info(`Scraping: ${source}`);
    const pageContent = await scrapeWebsite(source);

    if (pageContent) {
      const opportunities = await analyzePageWithGPT(pageContent, source);

      for (const opp of opportunities) {
        // Check if scholarship already exists
        const existing = await checkIfScholarshipExists(opp.title, opp.country, opp.deadline);

        if (existing) {
          // Scholarship exists - check if it's still active
          if (existing.is_active && !existing.posted) {
            logger.info(`📌 Scholarship still active (not yet posted): ${opp.title}`);
          } else if (existing.is_active && existing.posted) {
            logger.info(`🔄 Scholarship still active (will re-announce): ${opp.title}`);
          }
        } else {
          // New scholarship - add it
          allOpportunities.push(opp);
          newOpportunities.push(opp);
        }
      }

      logger.info(`Found ${opportunities.length} opportunities from ${source}`);
    }
  }

  // Save new scholarships to database with pending_approval status
  for (const opp of newOpportunities) {
    try {
      await addScholarship(opp);
      logger.info(`✅ Added new: ${opp.title}`);
    } catch (error) {
      logger.error(`Failed to add scholarship: ${error.message}`);
    }
  }

  logger.info(`🎓 Hunter Agent completed. Found ${newOpportunities.length} NEW opportunities`);
  return {
    total: allOpportunities.length,
    new: newOpportunities.length,
    opportunities: newOpportunities
  };
}

module.exports = {
  huntScholarships,
  analyzePageWithGPT,
  scrapeWebsite,
  checkIfScholarshipExists
};
