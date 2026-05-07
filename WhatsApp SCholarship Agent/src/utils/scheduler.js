import cron from 'node-cron';
import logger from './logger.js';
import db from '../database/db.js';

/**
 * Scheduler utility for managing cron jobs
 */
class Scheduler {
  constructor() {
    this.jobs = new Map();
  }

  /**
   * Schedule a job
   * @param {string} name - Job name
   * @param {string} cronExpression - Cron expression
   * @param {Function} task - Task function to execute
   * @returns {Object} Scheduled job
   */
  schedule(name, cronExpression, task) {
    logger.info(`📅 Scheduling job: ${name} (${cronExpression})`);

    const job = cron.schedule(cronExpression, async () => {
      logger.info(`⏰ Running scheduled job: ${name}`);
      const startTime = Date.now();

      try {
        await task();
        const duration = Date.now() - startTime;
        logger.info(`✅ Job completed: ${name} (${duration}ms)`);

        await db.logAgentActivity(
          'Scheduler',
          `Job ${name} completed`,
          'success',
          { duration }
        );
      } catch (error) {
        logger.error(`❌ Job failed: ${name}`, error.message);

        await db.logAgentActivity(
          'Scheduler',
          `Job ${name} failed`,
          'error',
          { error: error.message }
        );
      }
    });

    this.jobs.set(name, job);
    logger.info(`✅ Job scheduled: ${name}`);

    return job;
  }

  /**
   * Stop a scheduled job
   * @param {string} name - Job name
   */
  stop(name) {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      this.jobs.delete(name);
      logger.info(`🛑 Job stopped: ${name}`);
    }
  }

  /**
   * Stop all scheduled jobs
   */
  stopAll() {
    logger.info('🛑 Stopping all scheduled jobs...');
    for (const [name, job] of this.jobs) {
      job.stop();
      logger.info(`🛑 Stopped: ${name}`);
    }
    this.jobs.clear();
  }

  /**
   * Get all active jobs
   * @returns {Array} Array of job names
   */
  getActiveJobs() {
    return Array.from(this.jobs.keys());
  }

  /**
   * Check if a job is running
   * @param {string} name - Job name
   * @returns {boolean} True if running
   */
  isRunning(name) {
    return this.jobs.has(name);
  }
}

export default new Scheduler();
