const express = require('express');
const router = express.Router();
const { huntScholarships } = require('../agents/scholarshipHunter');
const { formatIntroductionMessage } = require('../agents/contentFormatter');
const { sendWhatsAppMessage, checkAndReAnnounceActiveScholarships } = require('../agents/publisherBot');
const { formatMessage } = require('../agents/contentFormatter');
const logger = require('../utils/logger');

// Trigger manual scrape
router.post('/scrape', async (req, res) => {
  try {
    logger.info('🔍 Manual scrape triggered');

    // Run in background
    huntScholarships().catch(err => logger.error('Scrape error:', err));

    res.json({ success: true, message: 'Scraping started in background' });
  } catch (error) {
    logger.error('Scrape trigger error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Trigger re-announcement of active scholarships
router.post('/reannounce', async (req, res) => {
  try {
    logger.info('🔄 Re-announcement triggered');

    const toReAnnounce = await checkAndReAnnounceActiveScholarships();

    if (toReAnnounce.length === 0) {
      return res.json({ success: true, message: 'No scholarships to re-announce' });
    }

    // Format and send messages
    for (const scholarship of toReAnnounce) {
      try {
        const message = await formatMessage(scholarship);
        await sendWhatsAppMessage(message);

        // Update re-announce count
        const { supabase } = require('../database/db');
        await supabase
          .from('scholarships')
          .update({
            last_posted_at: new Date(),
            reannounce_count: scholarship.reannounce_count + 1
          })
          .eq('id', scholarship.id);

        logger.info(`✅ Re-announced: ${scholarship.title}`);
      } catch (error) {
        logger.error(`Failed to re-announce ${scholarship.title}:`, error.message);
      }
    }

    res.json({
      success: true,
      message: `Re-announced ${toReAnnounce.length} scholarships`,
      count: toReAnnounce.length
    });
  } catch (error) {
    logger.error('Re-announce error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get agent status
router.get('/status', async (req, res) => {
  try {
    res.json({
      success: true,
      status: {
        agent_name: process.env.AGENT_NAME || 'Sohaib Khattak',
        running: true,
        last_scrape: new Date(),
        scrape_interval: process.env.SCRAPE_INTERVAL || '6h',
        posts_per_day: 3,
        internships_per_day: 3,
        reannounce_enabled: true,
        reannounce_interval: '7 days'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send introduction message
router.post('/introduce', async (req, res) => {
  try {
    const intro = await formatIntroductionMessage();
    await sendWhatsAppMessage(intro);

    logger.info('✅ Introduction message sent');
    res.json({ success: true, message: 'Introduction sent to WhatsApp' });
  } catch (error) {
    logger.error('Introduction error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
