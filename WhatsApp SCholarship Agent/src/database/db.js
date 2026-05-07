import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

/**
 * Execute a query
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise} Database client
 */
export const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);

  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args) => {
    client.lastQuery = args;
    return query(...args);
  };

  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release();
  };

  return client;
};

/**
 * Insert a new scholarship
 * @param {Object} scholarship - Scholarship data
 * @returns {Promise} Inserted scholarship
 */
export const insertScholarship = async (scholarship) => {
  const {
    title,
    country,
    degree_level,
    funding_type,
    deadline,
    source_url,
    description,
    eligibility,
  } = scholarship;

  const text = `
    INSERT INTO scholarships (title, country, degree_level, funding_type, deadline, source_url, description, eligibility)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (source_url) DO NOTHING
    RETURNING *
  `;

  const values = [title, country, degree_level, funding_type, deadline, source_url, description, eligibility];
  const result = await query(text, values);
  return result.rows[0];
};

/**
 * Get unposted scholarships
 * @param {number} limit - Maximum number of scholarships to retrieve
 * @returns {Promise} Array of scholarships
 */
export const getUnpostedScholarships = async (limit = 10) => {
  const text = `
    SELECT * FROM scholarships
    WHERE posted = FALSE AND status = 'active' AND deadline > CURRENT_DATE
    ORDER BY deadline ASC
    LIMIT $1
  `;
  const result = await query(text, [limit]);
  return result.rows;
};

/**
 * Mark scholarship as posted
 * @param {number} id - Scholarship ID
 * @returns {Promise} Updated scholarship
 */
export const markAsPosted = async (id) => {
  const text = `
    UPDATE scholarships
    SET posted = TRUE, posted_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  const result = await query(text, [id]);
  return result.rows[0];
};

/**
 * Check if scholarship exists by URL
 * @param {string} url - Scholarship URL
 * @returns {Promise<boolean>} True if exists
 */
export const scholarshipExists = async (url) => {
  const text = 'SELECT id FROM scholarships WHERE source_url = $1';
  const result = await query(text, [url]);
  return result.rows.length > 0;
};

/**
 * Log agent activity
 * @param {string} agentName - Name of the agent
 * @param {string} action - Action performed
 * @param {string} status - Status (success/error)
 * @param {Object} details - Additional details
 * @returns {Promise} Log entry
 */
export const logAgentActivity = async (agentName, action, status, details = null) => {
  const text = `
    INSERT INTO agent_logs (agent_name, action, status, details, error_message)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [
    agentName,
    action,
    status,
    details ? JSON.stringify(details) : null,
    details?.error || null,
  ];
  const result = await query(text, values);
  return result.rows[0];
};

/**
 * Get system setting
 * @param {string} key - Setting key
 * @returns {Promise} Setting value
 */
export const getSetting = async (key) => {
  const text = 'SELECT setting_value FROM system_settings WHERE setting_key = $1';
  const result = await query(text, [key]);
  return result.rows[0]?.setting_value;
};

/**
 * Update system setting
 * @param {string} key - Setting key
 * @param {string} value - Setting value
 * @returns {Promise} Updated setting
 */
export const updateSetting = async (key, value) => {
  const text = `
    UPDATE system_settings
    SET setting_value = $1
    WHERE setting_key = $2
    RETURNING *
  `;
  const result = await query(text, [value, key]);
  return result.rows[0];
};

/**
 * Get statistics
 * @returns {Promise} Statistics object
 */
export const getStatistics = async () => {
  const totalQuery = 'SELECT COUNT(*) as total FROM scholarships';
  const postedQuery = 'SELECT COUNT(*) as posted FROM scholarships WHERE posted = TRUE';
  const activeQuery = 'SELECT COUNT(*) as active FROM scholarships WHERE status = \'active\' AND deadline > CURRENT_DATE';

  const [total, posted, active] = await Promise.all([
    query(totalQuery),
    query(postedQuery),
    query(activeQuery),
  ]);

  return {
    total: parseInt(total.rows[0].total),
    posted: parseInt(posted.rows[0].posted),
    active: parseInt(active.rows[0].active),
    pending: parseInt(active.rows[0].active) - parseInt(posted.rows[0].posted),
  };
};

export default {
  query,
  getClient,
  insertScholarship,
  getUnpostedScholarships,
  markAsPosted,
  scholarshipExists,
  logAgentActivity,
  getSetting,
  updateSetting,
  getStatistics,
};
