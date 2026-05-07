import OpenAI from 'openai';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import db from '../database/db.js';

dotenv.config();

/**
 * Content Formatter Agent
 * Transforms raw scholarship data into formatted WhatsApp/Telegram messages
 */
class ContentFormatter {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
  }

  /**
   * Format scholarship into a message
   * @param {Object} scholarship - Scholarship data
   * @returns {Promise<string>} Formatted message
   */
  async format(scholarship) {
    try {
      logger.info(`📝 Formatting: ${scholarship.title}`);

      // Use AI to create engaging message
      const message = await this.formatWithAI(scholarship);

      // Log activity
      await db.logAgentActivity(
        'ContentFormatter',
        `Formatted ${scholarship.title}`,
        'success',
        { message_length: message.length }
      );

      logger.info('✅ Message formatted successfully');
      return message;

    } catch (error) {
      logger.error('Formatting error:', error.message);

      // Fallback to template-based formatting
      return this.formatWithTemplate(scholarship);
    }
  }

  /**
   * Format using AI for more engaging content
   * @param {Object} scholarship - Scholarship data
   * @returns {Promise<string>} Formatted message
   */
  async formatWithAI(scholarship) {
    const prompt = `Create an engaging WhatsApp message for this scholarship opportunity:

Title: ${scholarship.title}
Country: ${scholarship.country || 'Various'}
Degree Level: ${scholarship.degree_level || 'Various'}
Funding Type: ${scholarship.funding_type || 'Various'}
Deadline: ${scholarship.deadline || 'Check website'}
URL: ${scholarship.source_url}
Description: ${scholarship.description || ''}

Requirements:
1. Start with an eye-catching emoji (🎓, 🌟, 💡, 🚀, etc.)
2. Use "NEW SCHOLARSHIP ALERT" or similar heading
3. Keep it concise and scannable
4. Include all key details
5. Add relevant hashtags at the end
6. Make it exciting and motivational
7. Maximum 300 characters
8. Use emojis strategically but don't overdo it

Format exactly like this structure:
[Emoji] NEW SCHOLARSHIP ALERT

Scholarship: [Name]
Country: [Country]
Degree Level: [Level]
Funding: [Type]
Deadline: [Date]

Apply Here:
[URL]

[Relevant hashtags]`;

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating engaging, concise scholarship announcements for WhatsApp groups. Make them exciting and actionable while keeping all important information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content.trim();
  }

  /**
   * Format using template (fallback method)
   * @param {Object} scholarship - Scholarship data
   * @returns {string} Formatted message
   */
  formatWithTemplate(scholarship) {
    const emoji = this.getEmoji(scholarship.degree_level);
    const deadline = scholarship.deadline
      ? new Date(scholarship.deadline).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'Check website';

    const hashtags = this.generateHashtags(scholarship);

    return `${emoji} NEW SCHOLARSHIP ALERT

Scholarship: ${scholarship.title}
Country: ${scholarship.country || 'Various'}
Degree Level: ${scholarship.degree_level || 'Various'}
Funding: ${scholarship.funding_type || 'Various'}
Deadline: ${deadline}

Apply Here:
${scholarship.source_url}

${hashtags}`;
  }

  /**
   * Format multiple scholarships as a digest
   * @param {Array} scholarships - Array of scholarships
   * @returns {Promise<string>} Formatted digest message
   */
  async formatDigest(scholarships) {
    logger.info(`📝 Creating digest for ${scholarships.length} scholarships`);

    const intro = `🌟 WEEKLY SCHOLARSHIP DIGEST 🌟

Here are the top ${scholarships.length} opportunities this week:

`;

    const items = scholarships.map((s, index) => {
      const deadline = s.deadline
        ? new Date(s.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'TBD';

      return `${index + 1}. ${s.title}
   📍 ${s.country} | 🎓 ${s.degree_level}
   💰 ${s.funding_type} | ⏰ ${deadline}
   🔗 ${s.source_url}
`;
    }).join('\n');

    const outro = `
Don't miss these opportunities! Apply early for better chances.

#WeeklyDigest #Scholarships #StudyAbroad`;

    return intro + items + outro;
  }

  /**
   * Format deadline reminder
   * @param {Object} scholarship - Scholarship data
   * @param {number} daysLeft - Days until deadline
   * @returns {string} Reminder message
   */
  formatDeadlineReminder(scholarship, daysLeft) {
    const urgencyEmoji = daysLeft <= 3 ? '🚨' : '⏰';
    const urgencyText = daysLeft <= 3 ? 'URGENT' : 'REMINDER';

    return `${urgencyEmoji} ${urgencyText}: DEADLINE APPROACHING

Scholarship: ${scholarship.title}
Deadline: ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left!

Don't miss out! Apply now:
${scholarship.source_url}

#DeadlineAlert #ApplyNow`;
  }

  /**
   * Get appropriate emoji for degree level
   * @param {string} degreeLevel - Degree level
   * @returns {string} Emoji
   */
  getEmoji(degreeLevel) {
    const emojiMap = {
      'Bachelors': '🎓',
      'Masters': '📚',
      'PhD': '🔬',
      'Postdoctoral': '🧪',
      'Various': '🌟'
    };
    return emojiMap[degreeLevel] || '🎓';
  }

  /**
   * Generate relevant hashtags
   * @param {Object} scholarship - Scholarship data
   * @returns {string} Hashtags string
   */
  generateHashtags(scholarship) {
    const tags = ['#Scholarship', '#StudyAbroad'];

    // Add degree level tag
    if (scholarship.degree_level && scholarship.degree_level !== 'Various') {
      tags.push(`#${scholarship.degree_level.replace(/\s+/g, '')}`);
    }

    // Add country tag
    if (scholarship.country && scholarship.country !== 'Various') {
      const countryTag = scholarship.country.replace(/\s+/g, '');
      tags.push(`#${countryTag}`);
    }

    // Add funding tag
    if (scholarship.funding_type && scholarship.funding_type.includes('Fully')) {
      tags.push('#FullyFunded');
    }

    return tags.join(' ');
  }

  /**
   * Format batch of scholarships
   * @param {Array} scholarships - Array of scholarships
   * @returns {Promise<Array>} Array of formatted messages
   */
  async formatBatch(scholarships) {
    logger.info(`📝 Formatting ${scholarships.length} scholarships...`);
    const formatted = [];

    for (const scholarship of scholarships) {
      try {
        const message = await this.format(scholarship);
        formatted.push({
          scholarship_id: scholarship.id,
          message,
          formatted_at: new Date().toISOString()
        });

        // Small delay to respect API rate limits
        await this.delay(500);
      } catch (error) {
        logger.error(`Error formatting scholarship ${scholarship.id}:`, error.message);
      }
    }

    logger.info(`✅ Formatted ${formatted.length} messages`);
    return formatted;
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

export default ContentFormatter;
