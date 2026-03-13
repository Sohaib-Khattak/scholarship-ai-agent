-- Create scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  country TEXT,
  degree_level TEXT,
  funding_type TEXT,
  deadline DATE,
  source_url TEXT,
  status TEXT DEFAULT 'pending_approval',
  date_found TIMESTAMP DEFAULT NOW(),
  posted BOOLEAN DEFAULT FALSE,
  description TEXT,
  eligibility TEXT,
  relevance_score INTEGER DEFAULT 5,
  last_posted_at TIMESTAMP,
  reannounce_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_posted ON scholarships(posted);
CREATE INDEX IF NOT EXISTS idx_date_found ON scholarships(date_found DESC);

-- Create logs table
CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT,
  action TEXT,
  details JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('posts_per_day', '3'),
  ('internships_per_day', '3'),
  ('scrape_interval', '"6h"'),
  ('agent_name', '"Sohaib Khattak"')
ON CONFLICT (key) DO NOTHING;
