import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import db from '../database/db.js';
import logger from '../utils/logger.js';

/**
 * Scholarship Hunter Agent
 * Scans scholarship websites and extracts opportunities
 */
class ScholarshipHunter {
  constructor() {
    this.sources = [
      {
        name: 'Opportunities Circle',
        url: 'https://opportunitiescircle.com',
        type: 'dynamic',
        selectors: {
          container: '.opportunity-card',
          title: '.opportunity-title',
          country: '.country',
          deadline: '.deadline',
          link: 'a',
        },
      },
      {
        name: 'Scholarship Portal',
        url: 'https://www.scholarshipportal.com/scholarships',
        type: 'static',
        selectors: {
          container: '.scholarship-item',
          title: 'h3',
          country: '.country-name',
          deadline: '.deadline-date',
          link: 'a',
        },
      },
      {
        name: 'EURAXESS',
        url: 'https://euraxess.ec.europa.eu/jobs/search',
        type: 'static',
        selectors: {
          container: '.job-item',
          title: '.job-title',
          country: '.country',
          deadline: '.closing-date',
          link: 'a',
        },
      },
      {
        name: 'DAAD',
        url: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
        type: 'static',
        selectors: {
          container: '.scholarship-result',
          title: 'h3',
          country: '.country',
          deadline: '.deadline',
          link: 'a',
        },
      },
    ];
  }

  /**
   * Start hunting for scholarships
   * @returns {Promise<Array>} Array of found scholarships
   */
  async hunt() {
    logger.info('🔍 Scholarship Hunter: Starting hunt...');
    const allScholarships = [];

    try {
      for (const source of this.sources) {
        try {
          logger.info(`Scraping ${source.name}...`);

          let scholarships;
          if (source.type === 'dynamic') {
            scholarships = await this.scrapeDynamic(source);
          } else {
            scholarships = await this.scrapeStatic(source);
          }

          logger.info(`Found ${scholarships.length} scholarships from ${source.name}`);
          allScholarships.push(...scholarships);

          // Log activity
          await db.logAgentActivity(
            'ScholarshipHunter',
            `Scraped ${source.name}`,
            'success',
            { count: scholarships.length }
          );

          // Delay between requests to avoid rate limiting
          await this.delay(2000);
        } catch (error) {
          logger.error(`Error scraping ${source.name}:`, error.message);
          await db.logAgentActivity(
            'ScholarshipHunter',
            `Scraped ${source.name}`,
            'error',
            { error: error.message }
          );
        }
      }

      // Save to database
      const savedCount = await this.saveScholarships(allScholarships);
      logger.info(`✅ Scholarship Hunter: Saved ${savedCount} new scholarships`);

      return allScholarships;
    } catch (error) {
      logger.error('Scholarship Hunter error:', error);
      throw error;
    }
  }

  /**
   * Scrape static websites using Cheerio
   * @param {Object} source - Source configuration
   * @returns {Promise<Array>} Scholarships
   */
  async scrapeStatic(source) {
    try {
      const response = await axios.get(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      const scholarships = [];

      $(source.selectors.container).each((index, element) => {
        try {
          const title = $(element).find(source.selectors.title).text().trim();
          const country = $(element).find(source.selectors.country).text().trim();
          const deadline = $(element).find(source.selectors.deadline).text().trim();
          const link = $(element).find(source.selectors.link).attr('href');

          if (title && link) {
            scholarships.push({
              title,
              country: country || 'Various',
              deadline: this.parseDeadline(deadline),
              source_url: this.normalizeUrl(link, source.url),
              source_name: source.name,
              degree_level: this.extractDegreeLevel(title),
              funding_type: this.extractFundingType(title),
            });
          }
        } catch (err) {
          logger.error('Error parsing scholarship item:', err.message);
        }
      });

      return scholarships;
    } catch (error) {
      logger.error(`Static scraping error for ${source.name}:`, error.message);
      return [];
    }
  }

  /**
   * Scrape dynamic websites using Puppeteer
   * @param {Object} source - Source configuration
   * @returns {Promise<Array>} Scholarships
   */
  async scrapeDynamic(source) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.goto(source.url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Wait for content to load
      await page.waitForSelector(source.selectors.container, { timeout: 10000 });

      const scholarships = await page.evaluate((selectors) => {
        const items = [];
        const containers = document.querySelectorAll(selectors.container);

        containers.forEach((container) => {
          const title = container.querySelector(selectors.title)?.textContent.trim();
          const country = container.querySelector(selectors.country)?.textContent.trim();
          const deadline = container.querySelector(selectors.deadline)?.textContent.trim();
          const link = container.querySelector(selectors.link)?.href;

          if (title && link) {
            items.push({ title, country, deadline, link });
          }
        });

        return items;
      }, source.selectors);

      return scholarships.map((s) => ({
        ...s,
        country: s.country || 'Various',
        deadline: this.parseDeadline(s.deadline),
        source_url: s.link,
        source_name: source.name,
        degree_level: this.extractDegreeLevel(s.title),
        funding_type: this.extractFundingType(s.title),
      }));
    } catch (error) {
      logger.error(`Dynamic scraping error for ${source.name}:`, error.message);
      return [];
    } finally {
      if (browser) await browser.close();
    }
  }

  /**
   * Parse deadline string to Date
   * @param {string} deadlineStr - Deadline string
   * @returns {Date|null} Parsed date
   */
  parseDeadline(deadlineStr) {
    if (!deadlineStr) return null;

    try {
      // Remove common words
      const cleaned = deadlineStr.replace(/deadline|apply by|closes on|:/gi, '').trim();
      const date = new Date(cleaned);

      if (date && !isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (error) {
      logger.error('Error parsing deadline:', deadlineStr);
    }

    return null;
  }

  /**
   * Extract degree level from title
   * @param {string} title - Scholarship title
   * @returns {string} Degree level
   */
  extractDegreeLevel(title) {
    const lower = title.toLowerCase();
    if (lower.includes('phd') || lower.includes('doctoral')) return 'PhD';
    if (lower.includes('postdoc')) return 'Postdoctoral';
    if (lower.includes('master') || lower.includes('msc')) return 'Masters';
    if (lower.includes('bachelor') || lower.includes('undergraduate')) return 'Bachelors';
    return 'Various';
  }

  /**
   * Extract funding type from title
   * @param {string} title - Scholarship title
   * @returns {string} Funding type
   */
  extractFundingType(title) {
    const lower = title.toLowerCase();
    if (lower.includes('fully funded') || lower.includes('full scholarship')) return 'Fully Funded';
    if (lower.includes('partial')) return 'Partially Funded';
    if (lower.includes('tuition')) return 'Tuition Waiver';
    return 'Various';
  }

  /**
   * Normalize URL
   * @param {string} url - URL to normalize
   * @param {string} baseUrl - Base URL
   * @returns {string} Normalized URL
   */
  normalizeUrl(url, baseUrl) {
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return new URL(url, baseUrl).href;
    return new URL(url, baseUrl).href;
  }

  /**
   * Save scholarships to database
   * @param {Array} scholarships - Scholarships to save
   * @returns {Promise<number>} Number of saved scholarships
   */
  async saveScholarships(scholarships) {
    let savedCount = 0;

    for (const scholarship of scholarships) {
      try {
        // Check if already exists
        const exists = await db.scholarshipExists(scholarship.source_url);
        if (!exists) {
          await db.insertScholarship(scholarship);
          savedCount++;
        }
      } catch (error) {
        logger.error('Error saving scholarship:', error.message);
      }
    }

    return savedCount;
  }

  /**
   * Delay helper
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default ScholarshipHunter;
