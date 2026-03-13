const { OpenAI } = require('openai');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function validateOpportunity(opportunity) {
  try {
    const prompt = `
    Validate this scholarship/internship opportunity:

    Title: ${opportunity.title}
    Country: ${opportunity.country}
    Deadline: ${opportunity.deadline}
    Funding: ${opportunity.funding_type}
    Description: ${opportunity.description}

    Check:
    1. Is the deadline in the future? (Today is ${new Date().toISOString().split('T')[0]})
    2. Is it a legitimate opportunity?
    3. Rate relevance 1-10
    4. Any red flags?

    Return JSON: { is_active: boolean, relevance: number, reason: string, red_flags: string[] }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a scholarship validation expert. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { is_active: false, reason: 'Validation failed' };
  } catch (error) {
    logger.error('Validation error:', error.message);
    return { is_active: false, reason: 'Error during validation' };
  }
}

module.exports = {
  validateOpportunity
};
