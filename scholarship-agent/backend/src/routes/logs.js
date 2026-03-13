const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Get all logs
router.get('/', async (req, res) => {
  try {
    const { limit = 100, level = 'all' } = req.query;

    // In production, fetch from database
    // For now, return mock data
    const logs = [
      {
        timestamp: new Date(),
        level: 'info',
        message: '✅ Scholarship Hunter Agent started',
        agent: 'scholarshipHunter'
      },
      {
        timestamp: new Date(),
        level: 'info',
        message: '🔍 Scraping opportunitiescircle.com',
        agent: 'scholarshipHunter'
      }
    ];

    res.json({ success: true, data: logs });
  } catch (error) {
    logger.error('Get logs error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
