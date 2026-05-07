-- Scholarship AI Agent System Database Schema
-- PostgreSQL Database

-- Create scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    country VARCHAR(100),
    degree_level VARCHAR(100),
    funding_type VARCHAR(100),
    deadline DATE,
    source_url TEXT UNIQUE NOT NULL,
    description TEXT,
    eligibility TEXT,
    status VARCHAR(50) DEFAULT 'active',
    date_found TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    posted BOOLEAN DEFAULT FALSE,
    posted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on deadline for faster queries
CREATE INDEX idx_scholarships_deadline ON scholarships(deadline);

-- Create index on posted status
CREATE INDEX idx_scholarships_posted ON scholarships(posted);

-- Create index on status
CREATE INDEX idx_scholarships_status ON scholarships(status);

-- Create index on source_url for duplicate checking
CREATE INDEX idx_scholarships_source_url ON scholarships(source_url);

-- Create logs table for tracking agent activities
CREATE TABLE IF NOT EXISTS agent_logs (
    id SERIAL PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    action VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL,
    details TEXT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on agent logs
CREATE INDEX idx_agent_logs_created_at ON agent_logs(created_at);
CREATE INDEX idx_agent_logs_agent_name ON agent_logs(agent_name);

-- Create settings table for system configuration
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
    ('max_scholarships_per_day', '3', 'Maximum scholarships to post per day'),
    ('max_internships_per_day', '1', 'Maximum internships to post per day'),
    ('scrape_interval_hours', '6', 'Hours between scraping runs'),
    ('last_scrape_time', NULL, 'Timestamp of last scraping run'),
    ('posting_enabled', 'true', 'Enable/disable automatic posting')
ON CONFLICT (setting_key) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for scholarships table
CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON scholarships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for system_settings table
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
