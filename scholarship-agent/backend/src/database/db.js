const { supabase } = require('../database/db');
const logger = require('../utils/logger');

async function addScholarship(scholarshipData) {
  const { data, error } = await supabase
    .from('scholarships')
    .insert([{
      title: scholarshipData.title,
      country: scholarshipData.country,
      degree_level: scholarshipData.degree_level,
      funding_type: scholarshipData.funding_type,
      deadline: scholarshipData.deadline,
      source_url: scholarshipData.source_url,
      status: 'pending_approval',
      date_found: new Date(),
      posted: false,
      description: scholarshipData.description,
      eligibility: scholarshipData.eligibility,
      relevance_score: scholarshipData.relevance_score || 5,
      is_active: true,
      reannounce_count: 0
    }]);

  if (error) throw error;
  return data;
}

async function getPendingApprovals() {
  const { data, error } = await supabase
    .from('scholarships')
    .select('*')
    .eq('status', 'pending_approval')
    .eq('is_active', true)
    .order('date_found', { ascending: false });

  if (error) throw error;
  return data;
}

async function approveScholarship(id) {
  const { data, error } = await supabase
    .from('scholarships')
    .update({ status: 'approved' })
    .eq('id', id);

  if (error) throw error;
  return data;
}

async function rejectScholarship(id) {
  const { data, error } = await supabase
    .from('scholarships')
    .update({ status: 'rejected', is_active: false })
    .eq('id', id);

  if (error) throw error;
  return data;
}

async function markAsPosted(id) {
  const { data, error } = await supabase
    .from('scholarships')
    .update({
      posted: true,
      status: 'posted',
      last_posted_at: new Date(),
      is_active: true
    })
    .eq('id', id);

  if (error) throw error;
  return data;
}

async function markAsInactive(id) {
  const { data, error } = await supabase
    .from('scholarships')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
  return data;
}

async function getActiveScholarships() {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('scholarships')
    .select('*')
    .gt('deadline', today)
    .eq('is_active', true)
    .eq('posted', true)
    .order('last_posted_at', { ascending: true });

  if (error) throw error;
  return data;
}

module.exports = {
  supabase,
  addScholarship,
  getPendingApprovals,
  approveScholarship,
  rejectScholarship,
  markAsPosted,
  markAsInactive,
  getActiveScholarships
};
