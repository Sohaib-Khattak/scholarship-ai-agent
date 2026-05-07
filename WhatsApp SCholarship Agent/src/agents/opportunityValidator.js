import OpenAI from 'openai';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import db from '../database/db.js';

dotenv.config();

/**
 * Opportunity Validator Agent
 * Uses AI to validate if scholarships are active and eligible
 */
class OpportunityValidator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
  }

  /**
   * Validate a scholarship opportunity
   * @param {Object} scholarship - Scholarship to validate
   * @returns {Promise<Object>} Validation result
   */
  async validate(scholarship) {
    try {
      logger.info(`🔍 Validating: ${scholarship.title}`);

      const prompt = this.buildValidationPrompt(scholarship);

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert scholarship validator. Analyze scholarship opportunities and determine if they are:
1. Currently active (deadline not passed)
2. Legitimate and credible
3. Properly categorized (degree level, funding type)
4. Worth sharing with students

Respond in JSON format with: {
  "is_active": boolean,
  "is_legitimate": boolean,
  "confidence_score": number (0-100),
  "deadline_valid": boolean,
  "degree_level": string,
  "funding_type": string,
  "country": string,
  "recommendation": "post" | "skip" | "review",
  "reason": string
}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const validation = JSON.parse(response.choices[0].message.content);

      // Log validation result
      await db.logAgentActivity(
        'OpportunityValidator',
        `Validated ${scholarship.title}`,
        validation.recommendation === 'post' ? 'success' : 'skipped',
        { validation }
      );

      logger.info(`✅ Validation complete: ${validation.recommendation} (${validation.confidence_score}% confidence)`);

      return {
        ...validation,
        scholarship_id: scholarship.id,
        validated_at: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Validation error:', error.message);
      await db.logAgentActivity(
        'OpportunityValidator',
        `Validation failed for ${scholarship.title}`,
        'error',
        { error: error.message }
      );

      // Return default validation on error
      return {
        is_active: true,
        is_legitimate: true,
        confidence_score: 50,
        recommendation: 'review',
        reason: 'Validation error occurred'
      };
    }
  }

  /**
   * Validate multiple scholarships in batch
   * @param {Array} scholarships - Array of scholarships
   * @returns {Promise<Array>} Validation results
   */
  async validateBatch(scholarships) {
    logger.info(`🔍 Validating ${scholarships.length} scholarships...`);
    const results = [];

    for (const scholarship of scholarships) {
      try {
        const validation = await this.validate(scholarship);
        results.push({
          scholarship,
          validation
        });

        // Update scholarship status in database
        if (validation.recommendation === 'skip') {
          await db.query(
            'UPDATE scholarships SET status = $1 WHERE id = $2',
            ['inactive', scholarship.id]
          );
        }

        // Delay to respect API rate limits
        await this.delay(1000);
      } catch (error) {
        logger.error(`Error validating scholarship ${scholarship.id}:`, error.message);
      }
    }

    const approved = results.filter(r => r.validation.recommendation === 'post').length;
    logger.info(`✅ Validation complete: ${approved}/${scholarships.length} approved for posting`);

    return results;
  }

  /**
   * Build validation prompt
   * @param {Object} scholarship - Scholarship data
   * @returns {string} Validation prompt
   */
  buildValidationPrompt(scholarship) {
    const today = new Date().toISOString().split('T')[0];

    return `Analyze this scholarship opportunity:

Title: ${scholarship.title}
Country: ${scholarship.country || 'Not specified'}
Degree Level: ${scholarship.degree_level || 'Not specified'}
Funding Type: ${scholarship.funding_type || 'Not specified'}
Deadline: ${scholarship.deadline || 'Not specified'}
Source URL: ${scholarship.source_url}
Description: ${scholarship.description || 'Not provided'}
Date Found: ${scholarship.date_found}

Today's Date: ${today}

Please validate this opportunity and provide your assessment in JSON format.`;
  }

  /**
   * Check if deadline is valid (in the future)
   * @param {string} deadline - Deadline date
   * @returns {boolean} True if valid
   */
  isDeadlineValid(deadline) {
    if (!deadline) return false;

    try {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return deadlineDate >= today;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract and enhance scholarship details using AI
   * @param {Object} scholarship - Scholarship with minimal data
   * @returns {Promise<Object>} Enhanced scholarship data
   */
  async enhanceDetails(scholarship) {
    try {
      const prompt = `Extract and structure information from this scholarship:

Title: ${scholarship.title}
URL: ${scholarship.source_url}

Please provide:
1. Proper degree level (Bachelors/Masters/PhD/Postdoctoral)
2. Funding type (Fully Funded/Partially Funded/Tuition Waiver)
3. Target country
4. Brief description (2-3 sentences)
5. Eligibility criteria

Respond in JSON format.`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a scholarship information extraction expert. Extract and structure scholarship details accurately.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const enhanced = JSON.parse(response.choices[0].message.content);

      return {
        ...scholarship,
        ...enhanced
      };

    } catch (error) {
      logger.error('Enhancement error:', error.message);
      return scholarship;
    }
  }

  /**
   * Delay helper
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default OpportunityValidator;
