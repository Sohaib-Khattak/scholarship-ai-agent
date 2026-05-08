const express = require('express');
const router = express.Router();
const { supabase } = require('../database/db');
const logger = require('../utils/logger');

// Get all scholarships
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;

    let query = supabase
      .from('scholarships')
      .select('*')
      .order('date_found', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Get scholarships error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single scholarship
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Get scholarship error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const { data: total } = await supabase
      .from('scholarships')
      .select('id', { count: 'exact' });

    const { data: pending } = await supabase
      .from('scholarships')
      .select('id', { count: 'exact' })
      .eq('status', 'pending_approval');

    const { data: approved } = await supabase
      .from('scholarships')
      .select('id', { count: 'exact' })
      .eq('status', 'approved');

    const { data: posted } = await supabase
      .from('scholarships')
      .select('id', { count: 'exact' })
      .eq('posted', true);

    res.json({
      success: true,
      stats: {
        total: total?.length || 0,
        pending: pending?.length || 0,
        approved: approved?.length || 0,
        posted: posted?.length || 0
      }
    });
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
