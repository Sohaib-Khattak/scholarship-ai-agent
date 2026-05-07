# 🚀 START HERE - WhatsApp Scholarship Agent

Welcome! This is your complete WhatsApp Scholarship Agent System.

## 📖 What is This?

An AI-powered automation system that:
- 🔍 Automatically collects scholarships from multiple websites
- 🤖 Validates opportunities using AI (OpenAI GPT-4)
- ✍️ Formats engaging messages
- 📱 Posts to WhatsApp and Telegram automatically
- 🎯 Helps students find educational opportunities worldwide

## ⚡ Quick Start (Choose Your Path)

### 🏃 Fast Track (10 minutes)
**For those who want to get started immediately:**

1. Read: [QUICKSTART.md](./QUICKSTART.md)
2. Run: `npm install`
3. Configure: `cp .env.example .env` (add your API keys)
4. Setup database: `psql scholarship_db < database/schema.sql`
5. Start: `npm start`

### 📚 Detailed Setup (30 minutes)
**For those who want to understand everything:**

1. Read: [SETUP.md](./SETUP.md) - Complete setup guide
2. Read: [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
3. Follow the detailed instructions

### 🚀 Deploy to Production
**Ready to deploy?**

1. Read: [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Choose your platform (DigitalOcean, AWS, Heroku, Docker)
3. Follow deployment instructions

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ Node.js 18+ installed
- ✅ PostgreSQL (or Supabase account)
- ✅ OpenAI API key
- ✅ WhatsApp account (for QR code authentication)
- ✅ Telegram bot token (optional)

## 🎯 What You'll Get

### 4 AI Agents
1. **Scholarship Hunter** - Scrapes scholarship websites
2. **Opportunity Validator** - AI validates opportunities
3. **Content Formatter** - Creates engaging messages
4. **Publisher Bot** - Posts to WhatsApp/Telegram

### Features
- ✅ Automated scraping every 6 hours
- ✅ AI-powered validation
- ✅ Duplicate prevention
- ✅ Daily posting limits
- ✅ Weekly digests
- ✅ REST API for management
- ✅ Comprehensive logging

## 📁 Project Structure

```
WhatsApp SCholarship Agent/
├── src/                    # Source code
│   ├── agents/            # 4 AI agents
│   ├── database/          # Database layer
│   ├── utils/             # Utilities
│   └── index.js           # Main entry point
├── database/              # Database schema
├── Documentation/         # All guides
└── Configuration files
```

## 📚 Documentation Guide

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **START_HERE.md** | You are here! | First |
| **QUICKSTART.md** | 10-minute setup | Want to start fast |
| **SETUP.md** | Detailed setup | Need full instructions |
| **DEPLOYMENT.md** | Deploy to production | Ready to deploy |
| **ARCHITECTURE.md** | System design | Want to understand |
| **API.md** | API reference | Building integrations |
| **CONTRIBUTING.md** | Contribution guide | Want to contribute |
| **PROJECT_COMPLETE.md** | Project summary | Overview |

## 🔑 Required API Keys

### 1. OpenAI API Key (Required)
- Go to: https://platform.openai.com
- Sign up / Login
- Create API key
- Cost: ~$0.09/day (3 scholarships)

### 2. PostgreSQL Database (Required)
- **Option A**: Local PostgreSQL
- **Option B**: Supabase (free tier available)

### 3. Telegram Bot (Optional)
- Open Telegram
- Search: @BotFather
- Create bot
- Get token

## 🧪 Verify Installation

Run the verification script:
```bash
./verify.sh
```

Or test manually:
```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check PostgreSQL
psql --version

# Install dependencies
npm install

# Verify files
ls -la src/agents/
```

## 🎯 First Run

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
nano .env  # Add your API keys

# 3. Setup database
createdb scholarship_db
psql scholarship_db < database/schema.sql

# 4. Start the system
npm start

# 5. Scan WhatsApp QR code when prompted
```

## 📱 Expected Output

When you run `npm start`, you should see:

```
🚀 Initializing Scholarship Agent System...
🔄 Testing database connection...
✅ Database connected: { total: 0, posted: 0, active: 0, pending: 0 }
🔄 Initializing Publisher Bot...
📱 Scan this QR code with WhatsApp:
[QR CODE APPEARS HERE]
✅ WhatsApp authenticated successfully
✅ WhatsApp client is ready!
✅ System initialized successfully!
🌐 API Server running on port 3000
✅ Scheduled jobs configured
```

## 🧪 Test the System

Once running, test in another terminal:

```bash
# Health check
curl http://localhost:3000/health

# Get statistics
curl http://localhost:3000/api/stats

# Manual hunt (trigger scraping)
curl -X POST http://localhost:3000/api/hunt

# View logs
curl http://localhost:3000/api/logs
```

## 🔧 Configuration

Edit `.env` file to customize:

```env
# How often to scrape (hours)
SCRAPE_INTERVAL_HOURS=6

# Max posts per day
MAX_SCHOLARSHIPS_PER_DAY=3
MAX_INTERNSHIPS_PER_DAY=1

# AI model
OPENAI_MODEL=gpt-4  # or gpt-3.5-turbo for lower cost

# API port
PORT=3000
```

## 🌐 Scholarship Sources

Pre-configured sources:
1. Opportunities Circle
2. Scholarship Portal
3. EURAXESS
4. DAAD

Add more in `src/agents/scholarshipHunter.js`

## 📊 Monitoring

### View Statistics
```bash
curl http://localhost:3000/api/stats
```

### View Logs
```bash
curl http://localhost:3000/api/logs?limit=20
```

### Check Health
```bash
curl http://localhost:3000/health
```

## 🐛 Troubleshooting

### "Database connection failed"
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql $DATABASE_URL
```

### "WhatsApp QR not showing"
```bash
# Clear session
rm -rf whatsapp-session/
npm start
```

### "OpenAI API error"
- Check API key is correct
- Verify credits at platform.openai.com/account/billing

### "No scholarships found"
- Check internet connection
- Verify websites are accessible
- Check logs: `curl http://localhost:3000/api/logs`

## 🎓 How It Works

1. **Every 6 hours** (configurable):
   - Scholarship Hunter scrapes websites
   - Finds new opportunities
   - Saves to database

2. **AI Validation**:
   - Checks if deadline is valid
   - Verifies legitimacy
   - Scores confidence

3. **Formatting**:
   - AI creates engaging message
   - Adds emojis and hashtags
   - Formats for WhatsApp/Telegram

4. **Publishing**:
   - Posts to WhatsApp group
   - Posts to Telegram channel
   - Respects daily limits
   - Prevents duplicates

## 💡 Tips

- Start with `gpt-3.5-turbo` to save costs while testing
- Use Supabase free tier for database
- Test locally before deploying
- Monitor logs regularly
- Adjust posting limits as needed

## 🚀 Next Steps

1. ✅ Complete setup (follow QUICKSTART.md)
2. ✅ Test locally
3. ✅ Customize sources and messages
4. ✅ Deploy to production (see DEPLOYMENT.md)
5. ✅ Monitor and optimize

## 📞 Need Help?

- **Quick Setup**: QUICKSTART.md
- **Detailed Guide**: SETUP.md
- **API Reference**: API.md
- **Architecture**: ARCHITECTURE.md
- **Deployment**: DEPLOYMENT.md

## 🎉 You're Ready!

Everything is set up and ready to go. Follow the Quick Start guide above and you'll have your scholarship agent running in 10 minutes!

**Built with ❤️ for students seeking educational opportunities worldwide 🌍**

---

**Questions? Check the documentation or create an issue!**
