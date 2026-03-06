-- CreateTable
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
);

-- CreateTable
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    assistant_id VARCHAR(255),
    api_key_encrypted TEXT,
    webhook_secret VARCHAR(255),
    connection_status VARCHAR(50) DEFAULT 'DISCONNECTED',
    environment_mode VARCHAR(50) DEFAULT 'sandbox',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id),
    type VARCHAR(50),
    status VARCHAR(50),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX idx_evaluation_result ON candidates(evaluation_result);
CREATE INDEX idx_call_timestamp ON candidates(call_timestamp);
CREATE INDEX idx_call_id ON candidates(call_id);
