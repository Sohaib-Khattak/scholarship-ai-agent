/**
 * Logger utility for the Scholarship Agent System
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor() {
    this.level = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] || LOG_LEVELS.INFO;
  }

  /**
   * Format log message with timestamp
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {any} data - Additional data
   * @returns {string} Formatted message
   */
  format(level, message, data) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  /**
   * Log error message
   * @param {string} message - Error message
   * @param {any} data - Additional data
   */
  error(message, data = null) {
    if (this.level >= LOG_LEVELS.ERROR) {
      console.error(this.format('ERROR', message, data));
    }
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {any} data - Additional data
   */
  warn(message, data = null) {
    if (this.level >= LOG_LEVELS.WARN) {
      console.warn(this.format('WARN', message, data));
    }
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {any} data - Additional data
   */
  info(message, data = null) {
    if (this.level >= LOG_LEVELS.INFO) {
      console.log(this.format('INFO', message, data));
    }
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   * @param {any} data - Additional data
   */
  debug(message, data = null) {
    if (this.level >= LOG_LEVELS.DEBUG) {
      console.log(this.format('DEBUG', message, data));
    }
  }
}

export default new Logger();
