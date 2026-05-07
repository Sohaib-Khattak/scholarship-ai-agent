# 🏗️ Architecture - WhatsApp Scholarship Agent System

## System Overview

The WhatsApp Scholarship Agent is an AI-powered automation system that collects, validates, formats, and publishes scholarship opportunities to messaging platforms.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Scholarship Sources                       │
│  (opportunitiescircle.com, scholarshipportal.com, etc.)     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Agent 1: Scholarship Hunter                     │
│  • Web scraping (Puppeteer + Cheerio)                       │
│  • Data extraction                                           │
│  • Duplicate detection                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Agent 2: Opportunity Validator                  │
│  • AI validation (OpenAI GPT-4)                             │
│  • Deadline checking                                         │
│  • Legitimacy verification                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                         │
│  • Scholarship storage                                       │
│  • Duplicate prevention                                      │
│  • Activity logging                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Agent 3: Content Formatter                      │
│  • AI-powered formatting (OpenAI GPT-4)                     │
│  • Message templates                                         │
│  • Emoji and hashtag generation                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Agent 4: Publisher Bot                          │
│  • WhatsApp integration (whatsapp-web.js)                   │
│  • Telegram integration (Telegraf)                          │
│  • Rate limiting                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Scholarship Hunter Agent

**Purpose**: Collect scholarship data from multiple sources

**Technologies**:
- Puppeteer (dynamic websites)
- Cheerio (static websites)
- Axios (HTTP requests)

**Process**:
1. Iterate through configured sources
2. Scrape scholarship listings
3. Extract: title, country, deadline, URL
4. Parse and normalize data
5. Check for duplicates
6. Save to database

**Key Features**:
- Supports both static and dynamic websites
- Configurable selectors per source
- Rate limiting to avoid blocking
- Error handling and retry logic

### 2. Opportunity Validator Agent

**Purpose**: Validate scholarships using AI

**Technologies**:
- OpenAI GPT-4 API
- JSON response parsing

**Validation Criteria**:
- Deadline is in the future
- Scholarship is legitimate
- Information is complete
- Proper categorization

**Output**:
```json
{
  "is_active": true,
  "is_legitimate": true,
  "confidence_score": 95,
  "recommendation": "post",
  "reason": "Valid scholarship with clear deadline"
}
```

### 3. Content Formatter Agent

**Purpose**: Transform raw data into engaging messages

**Technologies**:
- OpenAI GPT-4 API
- Template engine

**Features**:
- AI-generated engaging content
- Fallback to template-based formatting
- Emoji selection based on degree level
- Hashtag generation
- Weekly digest formatting
- Deadline reminder formatting

**Message Structure**:
```
[Emoji] NEW SCHOLARSHIP ALERT

Scholarship: [Title]
Country: [Country]
Degree Level: [Level]
Funding: [Type]
Deadline: [Date]

Apply Here:
[URL]

[Hashtags]
```

### 4. Publisher Bot Agent

**Purpose**: Distribute messages to platforms

**Technologies**:
- whatsapp-web.js (WhatsApp)
- Telegraf (Telegram)
- QR code authentication

**Features**:
- Multi-platform support
- Daily posting limits
- Rate limiting (5 seconds between messages)
- Session persistence
- Graceful error handling

## Database Schema

### scholarships Table

```sql
CREATE TABLE scholarships (
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
```

### agent_logs Table

```sql
CREATE TABLE agent_logs (
    id SERIAL PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    action VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL,
    details TEXT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### system_settings Table

```sql
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Workflow Orchestration

### Main Workflow (Every 6 Hours)

```
1. Trigger (Cron: 0 */6 * * *)
   ↓
2. Scholarship Hunter
   - Scrape all sources
   - Extract data
   - Save to database
   ↓
3. Opportunity Validator
   - Get unposted scholarships
   - Validate each with AI
   - Update status
   ↓
4. Content Formatter
   - Format approved scholarships
   - Generate messages
   ↓
5. Publisher Bot
   - Publish to WhatsApp
   - Publish to Telegram
   - Mark as posted
   - Update counter
```

### Daily Reset (Midnight)

```
Trigger (Cron: 0 0 * * *)
   ↓
Reset daily posting counter
```

### Weekly Digest (Sunday 9 AM)

```
Trigger (Cron: 0 9 * * 0)
   ↓
Get top 10 scholarships from past week
   ↓
Format as digest
   ↓
Publish to all platforms
```

## API Endpoints

### Health Check
```
GET /health
Response: { status, timestamp, publisher }
```

### Statistics
```
GET /api/stats
Response: { total, posted, active, pending }
```

### Pending Scholarships
```
GET /api/scholarships/pending?limit=10
Response: [scholarships]
```

### Manual Hunt
```
POST /api/hunt
Response: { success, count, scholarships }
```

### Manual Publish
```
POST /api/publish
Response: { success }
```

### Agent Logs
```
GET /api/logs?limit=50
Response: [logs]
```

## Data Flow

### Scholarship Collection Flow

```
Website → HTTP Request → HTML Response → Parser
   ↓
Extract Data (title, country, deadline, URL)
   ↓
Normalize & Validate
   ↓
Check Duplicate (by URL)
   ↓
Insert to Database
```

### Publishing Flow

```
Database → Get Unposted Scholarships
   ↓
AI Validation → Filter Approved
   ↓
AI Formatting → Generate Messages
   ↓
Rate Limiting → Check Daily Limit
   ↓
Publish to Platforms
   ↓
Mark as Posted → Update Database
```

## Error Handling

### Scraping Errors
- Retry with exponential backoff
- Skip source on repeated failures
- Log error details
- Continue with other sources

### AI API Errors
- Fallback to template-based formatting
- Use cached validation results
- Log API errors
- Continue workflow

### Publishing Errors
- Retry once after 10 seconds
- Log failure details
- Don't mark as posted
- Retry in next cycle

### Database Errors
- Connection pooling with retry
- Transaction rollback on failure
- Detailed error logging
- Graceful degradation

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- Separate worker processes
- Load balancer support

### Performance Optimization
- Database indexing on frequently queried fields
- Caching of AI responses
- Batch processing of scholarships
- Async/await for concurrent operations

### Rate Limiting
- OpenAI API: 3 requests/minute (free tier)
- WhatsApp: 5 seconds between messages
- Web scraping: 2 seconds between sources
- Daily posting limit: configurable

## Security

### API Keys
- Stored in environment variables
- Never committed to repository
- Rotated regularly

### Database
- SSL connections in production
- Strong passwords
- Regular backups
- Access control

### WhatsApp
- Session data encrypted
- QR code authentication
- No password storage

## Monitoring & Logging

### Application Logs
- Structured logging with timestamps
- Log levels: ERROR, WARN, INFO, DEBUG
- Rotation and archival

### Database Logs
- Agent activity tracking
- Error logging with stack traces
- Performance metrics

### Health Monitoring
- API health endpoint
- Database connection status
- Publisher bot status
- Daily statistics

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic scraping
- ✅ AI validation
- ✅ WhatsApp/Telegram publishing
- ✅ Database storage

### Phase 2 (Planned)
- [ ] Web dashboard
- [ ] User preferences
- [ ] Advanced filtering
- [ ] Email notifications

### Phase 3 (Future)
- [ ] Mobile app
- [ ] Personalized recommendations
- [ ] Multi-language support
- [ ] Community features

---

**Built with modern technologies for reliability, scalability, and maintainability.**
