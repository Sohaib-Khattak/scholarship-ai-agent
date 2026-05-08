const axios = require('axios');
const logger = require('../utils/logger');
const { supabase } = require('../database/db');

const WHATSAPP_API_URL = `https://graph.instagram.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

async function sendWhatsAppMessage(message, groupId = null) {
  try {
    const targetId = groupId || process.env.WHATSAPP_GROUP_ID;

    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: targetId,
        type: 'text',
        text: {
          preview_url: true,
          body: message
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    logger.info(`✅ Message sent to WhatsApp: ${response.data.messages[0].id}`);
    return response.data;
  } catch (error) {
    logger.error('WhatsApp send error:', error.response?.data || error.message);
    throw error;
  }
}

async function publishScholarship(scholarshipId, formattedMessage) {
  try {
    // Send to WhatsApp
    await sendWhatsAppMessage(formattedMessage);

    // Mark as posted in database
    await supabase
      .from('scholarships')
      .update({
        posted: true,
        status: 'posted',
        last_posted_at: new Date()
      })
      .eq('id', scholarshipId);

    logger.info(`🎓 Scholarship ${scholarshipId} published successfully`);
    return { success: true, scholarshipId };
  } catch (error) {
    logger.error('Publishing failed:', error.message);
    throw error;
  }
}

async function checkAndReAnnounceActiveScholarships() {
  try {
    logger.info('🔄 Checking for active scholarships to re-announce...');

    // Get all scholarships that are still active (deadline in future)
    const today = new Date().toISOString().split('T')[0];

    const { data: activeScholarships, error } = await supabase
      .from('scholarships')
      .select('*')
      .gt('deadline', today)
      .eq('status', 'posted')
      .order('last_posted_at', { ascending: true });

    if (error) throw error;

    logger.info(`Found ${activeScholarships.length} active scholarships`);

    // Re-announce scholarships that haven't been posted in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const toReAnnounce = activeScholarships.filter(s => {
      const lastPosted = new Date(s.last_posted_at);
      return lastPosted < sevenDaysAgo;
    });

    logger.info(`Re-announcing ${toReAnnounce.length} scholarships`);

    return toReAnnounce;
  } catch (error) {
    logger.error('Re-announce check failed:', error.message);
    return [];
  }
}

async function sendBulkMessages(messages) {
  const results = [];

  for (const msg of messages) {
    try {
      await sendWhatsAppMessage(msg);
      results.push({ success: true });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }

  return results;
}

module.exports = {
  sendWhatsAppMessage,
  publishScholarship,
  checkAndReAnnounceActiveScholarships,
  sendBulkMessages
};
