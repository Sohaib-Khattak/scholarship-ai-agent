const express = require('express');
const router = express.Router();
const { getPendingApprovals, approveScholarship, rejectScholarship } = require('../database/db');
const { formatMessage } = require('../agents/contentFormatter');
const { publishScholarship } = require('../agents/publisherBot');
const logger = require('../utils/logger');

// Get all pending approvals
router.get('/pending', async (req, res) => {
  try {
    const pending = await getPendingApprovals();
    res.json({ success: true, data: pending });
  } catch (error) {
    logger.error('Get pending error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Approve scholarship
router.post('/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await approveScholarship(id);

    logger.info(`✅ Scholarship ${id} approved`);
    res.json({ success: true, message: 'Scholarship approved' });
  } catch (error) {
    logger.error('Approval error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reject scholarship
router.post('/reject/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await rejectScholarship(id);

    logger.info(`❌ Scholarship ${id} rejected`);
    res.json({ success: true, message: 'Scholarship rejected' });
  } catch (error) {
    logger.error('Rejection error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Approve and publish immediately
router.post('/approve-publish/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { supabase } = require('../database/db');

    // Get scholarship details
    const { data: scholarship } = await supabase
      .from('scholarships')
      .select('*')
      .eq('id', id)
      .single();

    if (!scholarship) {
      return res.status(404).json({ success: false, error: 'Scholarship not found' });
    }

    // Format message
    const message = await formatMessage(scholarship);

    // Approve
    await approveScholarship(id);

    // Publish to WhatsApp
    await publishScholarship(id, message);

    logger.info(`🎓 Scholarship ${id} approved and published`);
    res.json({ success: true, message: 'Scholarship approved and published' });
  } catch (error) {
    logger.error('Approve-publish error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bulk approve
router.post('/bulk-approve', async (req, res) => {
  try {
    const { ids } = req.body;

    for (const id of ids) {
      await approveScholarship(id);
    }

    logger.info(`✅ Bulk approved ${ids.length} scholarships`);
    res.json({ success: true, message: `${ids.length} scholarships approved` });
  } catch (error) {
    logger.error('Bulk approval error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
