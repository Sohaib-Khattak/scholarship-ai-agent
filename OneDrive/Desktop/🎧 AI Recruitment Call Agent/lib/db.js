import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS candidates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        qualification VARCHAR(255),
        skills TEXT,
        experience VARCHAR(255),
        preferred_country VARCHAR(100),
        expected_salary VARCHAR(100),
        evaluation_result VARCHAR(20) NOT NULL,
        confidence_score DECIMAL(5,2),
        summary_text TEXT,
        call_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        call_id VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        assistant_id VARCHAR(255),
        api_key_encrypted TEXT,
        webhook_secret VARCHAR(255),
        connection_status VARCHAR(50) DEFAULT 'DISCONNECTED',
        environment_mode VARCHAR(50) DEFAULT 'sandbox',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        candidate_id INTEGER REFERENCES candidates(id),
        type VARCHAR(50),
        status VARCHAR(50),
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_evaluation_result ON candidates(evaluation_result)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_call_timestamp ON candidates(call_timestamp)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_call_id ON candidates(call_id)`;

    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error: error.message };
  }
}

export async function getCandidates(filter = {}) {
  const { evaluation_result, limit = 100, offset = 0 } = filter;

  if (evaluation_result) {
    return await sql`
      SELECT * FROM candidates
      WHERE evaluation_result = ${evaluation_result}
      ORDER BY call_timestamp DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  }

  return await sql`
    SELECT * FROM candidates
    ORDER BY call_timestamp DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
}

export async function getCandidateById(id) {
  const result = await sql`SELECT * FROM candidates WHERE id = ${id}`;
  return result[0];
}

export async function createCandidate(data) {
  const {
    name, age, qualification, skills, experience,
    preferred_country, expected_salary, evaluation_result,
    confidence_score, summary_text, call_id
  } = data;

  return await sql`
    INSERT INTO candidates (
      name, age, qualification, skills, experience,
      preferred_country, expected_salary, evaluation_result,
      confidence_score, summary_text, call_id
    ) VALUES (
      ${name}, ${age}, ${qualification}, ${skills}, ${experience},
      ${preferred_country}, ${expected_salary}, ${evaluation_result},
      ${confidence_score}, ${summary_text}, ${call_id}
    )
    RETURNING *
  `;
}

export async function getSettings() {
  const result = await sql`SELECT * FROM settings ORDER BY id DESC LIMIT 1`;
  return result[0];
}

export async function updateSettings(data) {
  const { assistant_id, api_key_encrypted, webhook_secret, connection_status, environment_mode } = data;

  const existing = await getSettings();

  if (existing) {
    return await sql`
      UPDATE settings SET
        assistant_id = ${assistant_id},
        api_key_encrypted = ${api_key_encrypted},
        webhook_secret = ${webhook_secret},
        connection_status = ${connection_status},
        environment_mode = ${environment_mode},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${existing.id}
      RETURNING *
    `;
  } else {
    return await sql`
      INSERT INTO settings (
        assistant_id, api_key_encrypted, webhook_secret,
        connection_status, environment_mode
      ) VALUES (
        ${assistant_id}, ${api_key_encrypted}, ${webhook_secret},
        ${connection_status}, ${environment_mode}
      )
      RETURNING *
    `;
  }
}

export async function getStats() {
  const total = await sql`SELECT COUNT(*) as count FROM candidates`;
  const agree = await sql`SELECT COUNT(*) as count FROM candidates WHERE evaluation_result = 'AGREE'`;
  const disagree = await sql`SELECT COUNT(*) as count FROM candidates WHERE evaluation_result = 'DISAGREE'`;

  return {
    total: parseInt(total[0].count),
    agree: parseInt(agree[0].count),
    disagree: parseInt(disagree[0].count),
    successRate: total[0].count > 0
      ? ((agree[0].count / total[0].count) * 100).toFixed(2)
      : 0
  };
}
