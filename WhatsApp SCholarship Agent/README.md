# 🎓 WhatsApp Scholarship Agent System

An AI-powered automation system that collects scholarships, internships, and research opportunities from multiple sources and publishes them automatically to WhatsApp or Telegram.

## 🌟 Features

- **Automated Scholarship Collection**: Scans multiple scholarship websites every 6 hours
- **AI-Powered Filtering**: Uses OpenAI to validate active opportunities and filter expired ones
- **Smart Duplicate Prevention**: Database-backed system prevents duplicate postings
- **Multi-Platform Support**: Publish to WhatsApp, Telegram, or both
- **Intelligent Formatting**: AI formats scholarships into clean, readable messages
- **Deadline Tracking**: Monitors and alerts for approaching deadlines
- **Scalable Architecture**: Built with 4 specialized AI agents

## 🏗️ System Architecture

```
Scholarship Sources
        ↓
Data Collection Agent (Scholarship Hunter)
        ↓
AI Filtering Agent (Opportunity Validator)
        ↓
Database Storage (PostgreSQL/Supabase)
        ↓
Content Formatter
        ↓
Distribution Agent (WhatsApp/Telegram)
```

## 🤖 AI Agents

1. **Scholarship Hunter** - Scrapes scholarship websites and extracts opportunities
2. **Opportunity Validator** - AI validates deadlines and eligibility criteria
3. **Content Formatter** - Transforms raw data into formatted messages
4. **Publisher Bot** - Automatically posts to messaging platforms

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL or Supabase account
- OpenAI API key
- WhatsApp Business API or Telegram Bot Token

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd WhatsApp\ SCholarship\ Agent

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 2. Configuration

Edit `.env` file with your credentials:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/scholarship_db
OPENAI_API_KEY=sk-your-openai-api-key
WHATSAPP_GROUP_ID=your-group-id@g.us
```

### 3. Database Setup

```bash
# Create database and tables
psql -U postgres -d scholarship_db -f database/schema.sql
```

### 4. Run the System

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### 5. WhatsApp Authentication

On first run, scan the QR code with WhatsApp to authenticate.

## 📊 Database Schema

```sql
scholarships (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500),
  country VARCHAR(100),
  degree_level VARCHAR(100),
  funding_type VARCHAR(100),
  deadline DATE,
  source_url TEXT,
  status VARCHAR(50),
  date_found TIMESTAMP,
  posted BOOLEAN
)
```

## 🎯 Scholarship Sources

- opportunitiescircle.com
- scholarshipportal.com
- euraxess.ec.europa.eu
- daad.de
- University scholarship pages
- Research internship portals

## 📱 Message Format

```
🎓 NEW SCHOLARSHIP ALERT

Scholarship: DAAD Scholarship Program
Country: Germany
Degree Level: Masters / PhD
Funding: Fully Funded
Deadline: 30 September 2026

Apply Here:
https://example.com

#Scholarship #StudyAbroad #Masters #PhD
```

## ⚙️ Configuration Options

### Posting Strategy

```env
MAX_SCHOLARSHIPS_PER_DAY=3
MAX_INTERNSHIPS_PER_DAY=1
SCRAPE_INTERVAL_HOURS=6
```

### Advanced Features

- Smart filtering by country/degree level
- Deadline alerts for closing scholarships
- Weekly digest summaries
- Multi-platform publishing

## 🛠️ Technology Stack

- **Automation**: Node.js + Cron Jobs
- **AI Processing**: OpenAI GPT-4
- **Web Scraping**: Puppeteer + Cheerio
- **Database**: PostgreSQL / Supabase
- **Messaging**: WhatsApp Web.js / Telegraf
- **Hosting**: DigitalOcean / AWS / Vercel

## 📁 Project Structure

```
WhatsApp SCholarship Agent/
├── src/
│   ├── agents/
│   │   ├── scholarshipHunter.js
│   │   ├── opportunityValidator.js
│   │   ├── contentFormatter.js
│   │   └── publisherBot.js
│   ├── database/
│   │   └── db.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── scheduler.js
│   └── index.js
├── database/
│   └── schema.sql
├── .env.example
├── package.json
└── README.md
```

## 🚀 Deployment

### Option 1: DigitalOcean

```bash
# Deploy to DigitalOcean App Platform
doctl apps create --spec .do/app.yaml
```

### Option 2: AWS EC2

```bash
# SSH into EC2 instance
ssh -i key.pem ubuntu@your-ec2-ip

# Clone and setup
git clone <repo>
npm install
npm start
```

### Option 3: Vercel (API Routes)

```bash
vercel deploy
```

## 🔮 Future Expansion

- Public scholarship discovery website
- AI-powered personalized search
- Mobile app for iOS/Android
- Email newsletter integration
- LinkedIn auto-posting
- Global student community platform

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**Sohaib Khattak**

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📞 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ for students worldwide seeking educational opportunities**
