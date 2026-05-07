# 📖 Setup Guide - WhatsApp Scholarship Agent

Complete step-by-step guide to set up the Scholarship Agent System.

## 🎯 Quick Start (5 Minutes)

### 1. Prerequisites Check

Make sure you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ PostgreSQL 12+ (`psql --version`)
- ✅ Git (`git --version`)

### 2. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd "WhatsApp SCholarship Agent"

# Install dependencies
npm install
```

### 3. Database Setup

**Option A: Local PostgreSQL**

```bash
# Create database
createdb scholarship_db

# Run schema
psql scholarship_db < database/schema.sql

# Verify tables
psql scholarship_db -c "\dt"
```

**Option B: Supabase (Cloud)**

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Copy contents of `database/schema.sql`
5. Execute the SQL
6. Copy connection string from Settings > Database

### 4. Get API Keys

**OpenAI API Key:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up / Login
3. Go to API Keys
4. Create new secret key
5. Copy the key (starts with `sk-`)

**Telegram Bot Token (Optional):**
1. Open Telegram
2. Search for `@BotFather`
3. Send `/newbot`
4. Follow instructions
5. Copy the token

### 5. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit with your credentials
nano .env
```

**Minimum required configuration:**

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/scholarship_db

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# WhatsApp (will be configured after first run)
WHATSAPP_GROUP_ID=
```

### 6. First Run

```bash
# Start the system
npm start
```

**You should see:**
```
🚀 Initializing Scholarship Agent System...
🔄 Testing database connection...
✅ Database connected
🔄 Initializing Publisher Bot...
📱 Scan this QR code with WhatsApp:
```

### 7. Connect WhatsApp

1. Open WhatsApp on your phone
2. Go to Settings > Linked Devices
3. Tap "Link a Device"
4. Scan the QR code shown in terminal
5. Wait for "✅ WhatsApp client is ready!"

### 8. Get WhatsApp Group ID

```bash
# In another terminal, while system is running
curl http://localhost:3000/api/whatsapp/groups
```

Copy your group ID (format: `123456789@g.us`)

Update `.env`:
```env
WHATSAPP_GROUP_ID=123456789@g.us
```

Restart the system:
```bash
# Press Ctrl+C to stop
npm start
```

## 🔧 Detailed Configuration

### Database Configuration

**PostgreSQL Connection String Format:**
```
postgresql://username:password@host:port/database
```

**Examples:**

Local:
```env
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/scholarship_db
```

Supabase:
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### OpenAI Configuration

```env
# API Key (required)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Model selection (optional)
OPENAI_MODEL=gpt-4  # or gpt-3.5-turbo for lower cost
```

**Cost Estimation:**
- GPT-4: ~$0.03 per scholarship
- GPT-3.5-turbo: ~$0.002 per scholarship
- Daily cost (3 scholarships): $0.09 (GPT-4) or $0.006 (GPT-3.5)

### Scraping Configuration

```env
# How often to scrape (in hours)
SCRAPE_INTERVAL_HOURS=6

# Maximum scholarships to post per day
MAX_SCHOLARSHIPS_PER_DAY=3

# Maximum internships to post per day
MAX_INTERNSHIPS_PER_DAY=1
```

### Telegram Configuration (Optional)

```env
# Bot token from @BotFather
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Your chat/group ID
TELEGRAM_CHAT_ID=-1001234567890
```

**Get Telegram Chat ID:**
1. Add bot to your group
2. Send a message in the group
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for `"chat":{"id":-1001234567890}`

## 🧪 Testing

### Test Database Connection

```bash
npm run test:db
```

Or manually:
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM scholarships;"
```

### Test Scholarship Hunter

```bash
curl -X POST http://localhost:3000/api/hunt
```

### Test Publishing

```bash
curl -X POST http://localhost:3000/api/publish
```

### View Statistics

```bash
curl http://localhost:3000/api/stats
```

### View Logs

```bash
curl http://localhost:3000/api/logs
```

## 📱 WhatsApp Setup (Detailed)

### Method 1: Personal WhatsApp Account

**Pros:**
- Free
- Easy setup
- Good for testing

**Cons:**
- Against WhatsApp ToS for automation
- Risk of account ban
- Limited to personal account

**Setup:**
1. Run the system
2. Scan QR code
3. Session saved in `whatsapp-session/`

### Method 2: WhatsApp Business API

**Pros:**
- Official API
- No ban risk
- Better for production

**Cons:**
- Requires business verification
- Costs money
- More complex setup

**Setup:**
1. Apply at [business.whatsapp.com](https://business.whatsapp.com)
2. Get API credentials
3. Update code to use official API

## 🔍 Scholarship Sources

Default sources configured:

1. **Opportunities Circle** - opportunitiescircle.com
2. **Scholarship Portal** - scholarshipportal.com
3. **EURAXESS** - euraxess.ec.europa.eu
4. **DAAD** - daad.de

### Add Custom Sources

Edit `src/agents/scholarshipHunter.js`:

```javascript
this.sources = [
  // ... existing sources
  {
    name: 'Your Custom Source',
    url: 'https://example.com/scholarships',
    type: 'static', // or 'dynamic'
    selectors: {
      container: '.scholarship-item',
      title: 'h2',
      country: '.country',
      deadline: '.deadline',
      link: 'a'
    }
  }
];
```

## 🎛️ Advanced Configuration

### Custom Posting Schedule

Edit `src/index.js`:

```javascript
// Post at 9 AM and 6 PM daily
scheduler.schedule(
  'morning-post',
  '0 9 * * *',
  async () => await this.runPublishWorkflow()
);

scheduler.schedule(
  'evening-post',
  '0 18 * * *',
  async () => await this.runPublishWorkflow()
);
```

### Custom Message Templates

Edit `src/agents/contentFormatter.js`:

```javascript
formatWithTemplate(scholarship) {
  return `
🎓 SCHOLARSHIP OPPORTUNITY

${scholarship.title}

📍 Location: ${scholarship.country}
🎯 Level: ${scholarship.degree_level}
💰 Funding: ${scholarship.funding_type}
⏰ Deadline: ${scholarship.deadline}

Apply: ${scholarship.source_url}

#Scholarship #Education
  `.trim();
}
```

## 🐛 Common Issues

### Issue: "Database connection failed"

**Solution:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Test connection
psql $DATABASE_URL
```

### Issue: "OpenAI API error"

**Solution:**
- Check API key is correct
- Verify you have credits: [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
- Check rate limits

### Issue: "WhatsApp QR code not showing"

**Solution:**
```bash
# Delete session and retry
rm -rf whatsapp-session/
npm start
```

### Issue: "No scholarships found"

**Solution:**
- Check internet connection
- Verify scholarship websites are accessible
- Check logs: `curl http://localhost:3000/api/logs`

## 📚 Next Steps

1. ✅ Complete setup
2. 📖 Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
3. 🎨 Customize message templates
4. 🌐 Add more scholarship sources
5. 📊 Monitor system performance
6. 🚀 Scale to multiple groups

## 🆘 Getting Help

- **Documentation**: Check README.md
- **Logs**: `curl http://localhost:3000/api/logs`
- **Health**: `curl http://localhost:3000/health`
- **Issues**: Create GitHub issue

---

**🎉 Setup Complete! Your scholarship agent is ready to help students find opportunities!**
