import dotenv from 'dotenv';
import express from 'express';
import logger from './utils/logger.js';
import scheduler from './utils/scheduler.js';
import db from './database/db.js';

// Import AI Agents
import ScholarshipHunter from './agents/scholarshipHunter.js';
import OpportunityValidator from './agents/opportunityValidator.js';
import ContentFormatter from './agents/contentFormatter.js';
import PublisherBot from './agents/publisherBot.js';

dotenv.config();

/**
 * Main Scholarship Agent System
 */
class ScholarshipAgentSystem {
  constructor() {
    this.scholarshipHunter = new ScholarshipHunter();
    this.opportunityValidator = new OpportunityValidator();
    this.contentFormatter = new ContentFormatter();
    this.publisherBot = new PublisherBot();
    this.app = express();
    this.port = process.env.PORT || 3000;
  }

  /**
   * Initialize the system
   */
  async initialize() {
    try {
      logger.info('🚀 Initializing Scholarship Agent System...');

      // Test database connection
      await this.testDatabase();

      // Initialize Publisher Bot (WhatsApp & Telegram)
      await this.initializePublisher();

      // Setup Express API
      this.setupAPI();

      // Schedule automated tasks
      this.scheduleJobs();

      logger.info('✅ System initialized successfully!');
      logger.info(`🌐 API Server running on port ${this.port}`);

    } catch (error) {
      logger.error('❌ System initialization failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Test database connection
   */
  async testDatabase() {
    try {
      logger.info('🔄 Testing database connection...');
      const stats = await db.getStatistics();
      logger.info('✅ Database connected:', stats);
    } catch (error) {
      logger.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  /**
   * Initialize Publisher Bot
   */
  async initializePublisher() {
    try {
      logger.info('🔄 Initializing Publisher Bot...');

      // Initialize WhatsApp
      if (process.env.WHATSAPP_GROUP_ID) {
        await this.publisherBot.initWhatsApp();
      } else {
        logger.warn('⚠️ WhatsApp group ID not configured');
      }

      // Initialize Telegram
      if (process.env.TELEGRAM_BOT_TOKEN) {
        await this.publisherBot.initTelegram();
      } else {
        logger.warn('⚠️ Telegram bot token not configured');
      }

      logger.info('✅ Publisher Bot initialized');
    } catch (error) {
      logger.error('❌ Publisher Bot initialization failed:', error.message);
      // Don't exit, system can still collect scholarships
    }
  }

  /**
   * Setup Express API
   */
  setupAPI() {
    this.app.use(express.json());

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        publisher: this.publisherBot.getStats()
      });
    });

    // Statistics endpoint
    this.app.get('/api/stats', async (req, res) => {
      try {
        const stats = await db.getStatistics();
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get unposted scholarships
    this.app.get('/api/scholarships/pending', async (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 10;
        const scholarships = await db.getUnpostedScholarships(limit);
        res.json(scholarships);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Manual trigger for scholarship hunt
    this.app.post('/api/hunt', async (req, res) => {
      try {
        logger.info('🔍 Manual hunt triggered via API');
        const scholarships = await this.scholarshipHunter.hunt();
        res.json({
          success: true,
          count: scholarships.length,
          scholarships
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Manual trigger for publishing
    this.app.post('/api/publish', async (req, res) => {
      try {
        logger.info('📢 Manual publish triggered via API');
        await this.runPublishWorkflow();
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get agent logs
    this.app.get('/api/logs', async (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 50;
        const result = await db.query(
          'SELECT * FROM agent_logs ORDER BY created_at DESC LIMIT $1',
          [limit]
        );
        res.json(result.rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.listen(this.port, () => {
      logger.info(`✅ API Server listening on port ${this.port}`);
    });
  }

  /**
   * Schedule automated jobs
   */
  scheduleJobs() {
    const scrapeInterval = process.env.SCRAPE_INTERVAL_HOURS || '6';

    // Main workflow: Hunt, Validate, Format, Publish
    // Runs every 6 hours by default
    scheduler.schedule(
      'main-workflow',
      `0 */${scrapeInterval} * * *`,
      async () => {
        await this.runMainWorkflow();
      }
    );

    // Reset daily counter at midnight
    scheduler.schedule(
      'reset-daily-counter',
      '0 0 * * *',
      () => {
        this.publisherBot.resetDailyCounter();
      }
    );

    // Weekly digest on Sunday at 9 AM
    scheduler.schedule(
      'weekly-digest',
      '0 9 * * 0',
      async () => {
        await this.sendWeeklyDigest();
      }
    );

    logger.info('✅ Scheduled jobs configured');
  }

  /**
   * Run main workflow
   */
  async runMainWorkflow() {
    try {
      logger.info('🔄 Starting main workflow...');

      // Step 1: Hunt for scholarships
      logger.info('📍 Step 1: Hunting for scholarships...');
      await this.scholarshipHunter.hunt();

      // Step 2: Validate and publish
      await this.runPublishWorkflow();

      logger.info('✅ Main workflow completed');

      await db.logAgentActivity(
        'System',
        'Main workflow completed',
        'success',
        null
      );

    } catch (error) {
      logger.error('❌ Main workflow failed:', error.message);
      await db.logAgentActivity(
        'System',
        'Main workflow failed',
        'error',
        { error: error.message }
      );
    }
  }

  /**
   * Run publish workflow
   */
  async runPublishWorkflow() {
    try {
      // Get unposted scholarships
      const maxToPublish = parseInt(process.env.MAX_SCHOLARSHIPS_PER_DAY || '3');
      const scholarships = await db.getUnpostedScholarships(maxToPublish);

      if (scholarships.length === 0) {
        logger.info('ℹ️ No scholarships to publish');
        return;
      }

      logger.info(`📍 Step 2: Validating ${scholarships.length} scholarships...`);
      const validations = await this.opportunityValidator.validateBatch(scholarships);

      // Filter approved scholarships
      const approved = validations
        .filter(v => v.validation.recommendation === 'post')
        .map(v => v.scholarship);

      if (approved.length === 0) {
        logger.info('ℹ️ No scholarships approved for posting');
        return;
      }

      logger.info(`📍 Step 3: Formatting ${approved.length} messages...`);
      const formatted = await this.contentFormatter.formatBatch(approved);

      logger.info(`📍 Step 4: Publishing ${formatted.length} messages...`);
      await this.publisherBot.publishBatch(formatted);

      logger.info('✅ Publish workflow completed');

    } catch (error) {
      logger.error('❌ Publish workflow failed:', error.message);
      throw error;
    }
  }

  /**
   * Send weekly digest
   */
  async sendWeeklyDigest() {
    try {
      logger.info('📧 Generating weekly digest...');

      // Get top scholarships from the past week
      const result = await db.query(`
        SELECT * FROM scholarships
        WHERE date_found > NOW() - INTERVAL '7 days'
        AND status = 'active'
        ORDER BY deadline ASC
        LIMIT 10
      `);

      if (result.rows.length === 0) {
        logger.info('ℹ️ No scholarships for weekly digest');
        return;
      }

      const digest = await this.contentFormatter.formatDigest(result.rows);

      // Publish digest
      await this.publisherBot.publishToWhatsApp(digest);
      await this.publisherBot.publishToTelegram(digest);

      logger.info('✅ Weekly digest sent');

    } catch (error) {
      logger.error('❌ Weekly digest failed:', error.message);
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    logger.info('🔄 Shutting down system...');

    scheduler.stopAll();
    await this.publisherBot.shutdown();

    logger.info('✅ System shutdown complete');
    process.exit(0);
  }
}

// Initialize and start the system
const system = new ScholarshipAgentSystem();

// Handle shutdown signals
process.on('SIGINT', () => system.shutdown());
process.on('SIGTERM', () => system.shutdown());

// Start the system
system.initialize().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});

export default ScholarshipAgentSystem;
