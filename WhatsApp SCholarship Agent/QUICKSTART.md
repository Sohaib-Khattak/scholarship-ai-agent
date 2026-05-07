# 🚀 Quick Start Guide

Get your WhatsApp Scholarship Agent running in 10 minutes!

## ⚡ Super Quick Setup

### 1. Install Dependencies (2 minutes)

```bash
npm install
```

### 2. Configure Environment (3 minutes)

```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env
```

**Minimum required:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/scholarship_db
OPENAI_API_KEY=sk-your-openai-key-here
```

### 3. Setup Database (2 minutes)

```bash
# Create database
createdb scholarship_db

# Run schema
psql scholarship_db < database/schema.sql
```

**Or use Supabase:**
1. Go to supabase.com
2. Create project
3. Copy connection string
4. Run schema in SQL Editor

### 4. Start System (1 minute)

```bash
npm start
```

### 5. Connect WhatsApp (2 minutes)

1. Scan QR code with WhatsApp
2. Wait for "✅ WhatsApp client is ready!"
3. Done! 🎉

## 🎯 What Happens Next?

The system will automatically:
- ✅ Scrape scholarships every 6 hours
- ✅ Validate with AI
- ✅ Format messages
- ✅ Post to WhatsApp (max 3/day)

## 📱 Get WhatsApp Group ID

```bash
# While system is running, in another terminal:
curl http://localhost:3000/api/whatsapp/groups
```

Copy your group ID and add to `.env`:
```env
WHATSAPP_GROUP_ID=123456789@g.us
```

Restart: `npm start`

## 🧪 Test It

```bash
# Check health
curl http://localhost:3000/health

# Get statistics
curl http://localhost:3000/api/stats

# Manual hunt
curl -X POST http://localhost:3000/api/hunt

# Manual publish
curl -X POST http://localhost:3000/api/publish
```

## 🔧 Troubleshooting

### "Database connection failed"
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql $DATABASE_URL
```

### "WhatsApp QR not showing"
```bash
# Clear session and retry
rm -rf whatsapp-session/
npm start
```

### "OpenAI API error"
- Check API key is correct
- Verify you have credits at platform.openai.com

## 📚 Need More Help?

- **Full Setup Guide**: See [SETUP.md](./SETUP.md)
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **API Reference**: See [API.md](./API.md)
- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🎉 You're Done!

Your scholarship agent is now running and will automatically:
- Collect scholarships every 6 hours
- Validate them with AI
- Post to WhatsApp/Telegram
- Help students find opportunities! 🎓

---

**Questions? Check the documentation or create an issue!**
