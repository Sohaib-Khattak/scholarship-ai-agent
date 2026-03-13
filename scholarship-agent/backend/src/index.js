require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cron = require('node-cron');
const logger = require('./utils/logger');
const { initializeDatabase } = require('./database/db');
const scholarshipRoutes = require('./routes/scholarships');
const agentRoutes = require('./routes/agents');
const approvalRoutes = require('./routes/approvals');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/approvals', approvalRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Agent is running ✅', timestamp: new Date() });
});

// Initialize
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initializeDatabase();
    logger.info('Database initialized');

    app.listen(PORT, () => {
      logger.info(`🚀 Scholarship Agent running on port ${PORT}`);
    });

    // Schedule scraping every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      logger.info('⏰ Starting scheduled scrape...');
      // Scraping logic will be triggered here
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
