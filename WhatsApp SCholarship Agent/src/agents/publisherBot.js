import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import db from '../database/db.js';

dotenv.config();

/**
 * Publisher Bot Agent
 * Publishes formatted messages to WhatsApp and Telegram
 */
class PublisherBot {
  constructor() {
    this.whatsappClient = null;
    this.telegramBot = null;
    this.isWhatsAppReady = false;
    this.isTelegramReady = false;
    this.publishedToday = 0;
    this.maxPerDay = parseInt(process.env.MAX_SCHOLARSHIPS_PER_DAY || '3');
  }

  /**
   * Initialize WhatsApp client
   * @returns {Promise<void>}
   */
  async initWhatsApp() {
    try {
      logger.info('🔄 Initializing WhatsApp client...');

      this.whatsappClient = new Client({
        authStrategy: new LocalAuth({
          dataPath: process.env.WHATSAPP_SESSION_PATH || './whatsapp-session'
        }),
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      // QR Code event
      this.whatsappClient.on('qr', (qr) => {
        logger.info('📱 Scan this QR code with WhatsApp:');
        qrcode.generate(qr, { small: true });
      });

      // Ready event
      this.whatsappClient.on('ready', () => {
        logger.info('✅ WhatsApp client is ready!');
        this.isWhatsAppReady = true;
      });

      // Authentication event
      this.whatsappClient.on('authenticated', () => {
        logger.info('✅ WhatsApp authenticated successfully');
      });

      // Disconnected event
      this.whatsappClient.on('disconnected', (reason) => {
        logger.warn('⚠️ WhatsApp disconnected:', reason);
        this.isWhatsAppReady = false;
      });

      // Error event
      this.whatsappClient.on('auth_failure', (msg) => {
        logger.error('❌ WhatsApp authentication failed:', msg);
        this.isWhatsAppReady = false;
      });

      await this.whatsappClient.initialize();

      // Wait for ready state
      await this.waitForWhatsAppReady();

    } catch (error) {
      logger.error('WhatsApp initialization error:', error.message);
      throw error;
    }
  }

  /**
   * Initialize Telegram bot
   * @returns {Promise<void>}
   */
  async initTelegram() {
    try {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      if (!token) {
        logger.warn('⚠️ Telegram bot token not provided, skipping Telegram initialization');
        return;
      }

      logger.info('🔄 Initializing Telegram bot...');

      this.telegramBot = new Telegraf(token);

      // Test connection
      const botInfo = await this.telegramBot.telegram.getMe();
      logger.info(`✅ Telegram bot connected: @${botInfo.username}`);
      this.isTelegramReady = true;

      // Set up basic commands
      this.telegramBot.command('start', (ctx) => {
        ctx.reply('🎓 Scholarship Bot is active! You will receive scholarship updates here.');
      });

      this.telegramBot.command('stats', async (ctx) => {
        const stats = await db.getStatistics();
        ctx.reply(`📊 Statistics:
Total Scholarships: ${stats.total}
Posted: ${stats.posted}
Active: ${stats.active}
Pending: ${stats.pending}`);
      });

    } catch (error) {
      logger.error('Telegram initialization error:', error.message);
      this.isTelegramReady = false;
    }
  }

  /**
   * Wait for WhatsApp to be ready
   * @returns {Promise<void>}
   */
  async waitForWhatsAppReady() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('WhatsApp initialization timeout'));
      }, 60000); // 60 second timeout

      const checkReady = setInterval(() => {
        if (this.isWhatsAppReady) {
          clearInterval(checkReady);
          clearTimeout(timeout);
          resolve();
        }
      }, 1000);
    });
  }

  /**
   * Publish message to WhatsApp
   * @param {string} message - Message to publish
   * @param {string} groupId - WhatsApp group ID
   * @returns {Promise<boolean>} Success status
   */
  async publishToWhatsApp(message, groupId = null) {
    try {
      if (!this.isWhatsAppReady) {
        throw new Error('WhatsApp client is not ready');
      }

      const targetGroupId = groupId || process.env.WHATSAPP_GROUP_ID;
      if (!targetGroupId) {
        throw new Error('WhatsApp group ID not configured');
      }

      logger.info(`📤 Publishing to WhatsApp group: ${targetGroupId}`);

      await this.whatsappClient.sendMessage(targetGroupId, message);

      logger.info('✅ Message published to WhatsApp successfully');
      return true;

    } catch (error) {
      logger.error('WhatsApp publishing error:', error.message);
      await db.logAgentActivity(
        'PublisherBot',
        'WhatsApp publish failed',
        'error',
        { error: error.message }
      );
      return false;
    }
  }

  /**
   * Publish message to Telegram
   * @param {string} message - Message to publish
   * @param {string} chatId - Telegram chat ID
   * @returns {Promise<boolean>} Success status
   */
  async publishToTelegram(message, chatId = null) {
    try {
      if (!this.isTelegramReady) {
        throw new Error('Telegram bot is not ready');
      }

      const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID;
      if (!targetChatId) {
        throw new Error('Telegram chat ID not configured');
      }

      logger.info(`📤 Publishing to Telegram chat: ${targetChatId}`);

      await this.telegramBot.telegram.sendMessage(targetChatId, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: false
      });

      logger.info('✅ Message published to Telegram successfully');
      return true;

    } catch (error) {
      logger.error('Telegram publishing error:', error.message);
      await db.logAgentActivity(
        'PublisherBot',
        'Telegram publish failed',
        'error',
        { error: error.message }
      );
      return false;
    }
  }

  /**
   * Publish to all configured platforms
   * @param {string} message - Message to publish
   * @param {number} scholarshipId - Scholarship ID
   * @returns {Promise<Object>} Publishing results
   */
  async publish(message, scholarshipId) {
    logger.info(`📢 Publishing scholarship ID: ${scholarshipId}`);

    const results = {
      whatsapp: false,
      telegram: false,
      success: false
    };

    // Check daily limit
    if (this.publishedToday >= this.maxPerDay) {
      logger.warn(`⚠️ Daily publishing limit reached (${this.maxPerDay})`);
      return results;
    }

    // Publish to WhatsApp
    if (this.isWhatsAppReady) {
      results.whatsapp = await this.publishToWhatsApp(message);
    }

    // Publish to Telegram
    if (this.isTelegramReady) {
      results.telegram = await this.publishToTelegram(message);
    }

    // Mark as successful if published to at least one platform
    results.success = results.whatsapp || results.telegram;

    if (results.success) {
      // Mark scholarship as posted in database
      await db.markAsPosted(scholarshipId);
      this.publishedToday++;

      // Log activity
      await db.logAgentActivity(
        'PublisherBot',
        `Published scholarship ${scholarshipId}`,
        'success',
        { platforms: results }
      );

      logger.info(`✅ Published successfully (${this.publishedToday}/${this.maxPerDay} today)`);
    }

    return results;
  }

  /**
   * Publish batch of messages
   * @param {Array} messages - Array of {message, scholarshipId}
   * @returns {Promise<Array>} Publishing results
   */
  async publishBatch(messages) {
    logger.info(`📢 Publishing batch of ${messages.length} messages...`);
    const results = [];

    for (const item of messages) {
      try {
        // Check daily limit
        if (this.publishedToday >= this.maxPerDay) {
          logger.warn('⚠️ Daily limit reached, stopping batch publish');
          break;
        }

        const result = await this.publish(item.message, item.scholarship_id);
        results.push({
          scholarship_id: item.scholarship_id,
          ...result
        });

        // Delay between messages to avoid spam detection
        await this.delay(5000); // 5 seconds between messages

      } catch (error) {
        logger.error(`Error publishing scholarship ${item.scholarship_id}:`, error.message);
      }
    }

    logger.info(`✅ Batch publish complete: ${results.filter(r => r.success).length}/${messages.length} successful`);
    return results;
  }

  /**
   * Reset daily counter (call at midnight)
   */
  resetDailyCounter() {
    logger.info('🔄 Resetting daily publish counter');
    this.publishedToday = 0;
  }

  /**
   * Get publishing statistics
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      publishedToday: this.publishedToday,
      maxPerDay: this.maxPerDay,
      whatsappReady: this.isWhatsAppReady,
      telegramReady: this.isTelegramReady
    };
  }

  /**
   * Shutdown gracefully
   */
  async shutdown() {
    logger.info('🔄 Shutting down Publisher Bot...');

    if (this.whatsappClient) {
      await this.whatsappClient.destroy();
    }

    if (this.telegramBot) {
      await this.telegramBot.stop();
    }

    logger.info('✅ Publisher Bot shutdown complete');
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

export default PublisherBot;
