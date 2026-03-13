# Scholarship AI Agent System

🎓 An intelligent AI-powered system that automatically discovers, validates, and publishes scholarship opportunities to WhatsApp groups with manual approval control.

## Features

✨ **Smart Discovery**
- GPT-powered web scraping from multiple scholarship sources
- Intelligent opportunity validation with deadline checking
- Relevance scoring (1-10) for each opportunity

🎯 **Manual Approval System**
- Review all discovered scholarships before publishing
- Approve, reject, or publish directly from dashboard
- Bulk approval for multiple scholarships

📱 **WhatsApp Integration**
- Automatic message formatting with emojis and hashtags
- Agent introduction with Sohaib Khattak branding
- Secure API key management (no access to personal chats)

📊 **Beautiful Dashboard**
- Real-time statistics and analytics
- Pending approval queue
- Manual scrape trigger
- Responsive design (mobile-friendly)

🔄 **Automated Workflow**
- Scheduled scraping every 6 hours
- 3 scholarships + 3 internships per day
- Duplicate prevention
- Comprehensive logging

## Tech Stack

**Backend:**
- Node.js + Express
- OpenAI GPT-4 API
- Supabase (PostgreSQL)
- WhatsApp Business API

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- Zustand (state management)

**Deployment:**
- Vercel (Frontend)
- Railway/Render (Backend)
- Supabase (Database)

## Quick Start

### Prerequisites
- Node.js 18+
- OpenAI API key
- Supabase account
- WhatsApp Business API credentials

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your API keys in .env
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` for the dashboard.

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
WHATSAPP_API_KEY=your_key
WHATSAPP_PHONE_NUMBER_ID=your_id
WHATSAPP_GROUP_ID=your_group_id
AGENT_NAME=Sohaib Khattak
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Endpoints

### Scholarships
- `GET /api/scholarships` - Get all scholarships
- `GET /api/scholarships/:id` - Get single scholarship
- `GET /api/scholarships/stats/overview` - Get statistics

### Approvals
- `GET /api/approvals/pending` - Get pending scholarships
- `POST /api/approvals/approve/:id` - Approve scholarship
- `POST /api/approvals/reject/:id` - Reject scholarship
- `POST /api/approvals/approve-publish/:id` - Approve and publish

### Agents
- `POST /api/agents/scrape` - Trigger manual scrape
- `GET /api/agents/status` - Get agent status
- `POST /api/agents/introduce` - Send introduction message

## Deployment

### Deploy Backend to Railway

1. Push code to GitHub
2. Connect Railway to GitHub repo
3. Set environment variables in Railway dashboard
4. Deploy

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set `NEXT_PUBLIC_API_URL` to your Railway backend URL
4. Deploy

## Security Features

✅ **API Key Protection**
- Keys stored in environment variables only
- Never exposed in frontend code
- Server-side only execution

✅ **WhatsApp Security**
- Separate business account (not personal)
- Scoped permissions (authorized groups only)
- Audit logs for all messages

✅ **Data Privacy**
- No personal chat access
- Encrypted database connections
- Rate limiting on API endpoints

## Workflow

```
1. Every 6 hours: Scheduler triggers scraping
2. GPT analyzes scholarship websites
3. Opportunities stored with "pending_approval" status
4. You review in dashboard
5. Approve/Reject/Publish each opportunity
6. Approved posts go to WhatsApp group
7. Posted scholarships marked as "posted"
```

## Message Format

Each scholarship is formatted as:

```
🎓 NEW SCHOLARSHIP ALERT
Scholarship: [Title]
Country: [Country]
Degree Level: [Level]
Funding: [Type]
Deadline: [Date]
Apply Here: [Link]

#Scholarship #StudyAbroad #[Country]

Approved by Sohaib Khattak 🤝
```

## Support

For issues or questions, check the logs:
```bash
# Backend logs
tail -f backend/combined.log

# Frontend console
npm run dev
```

## License

MIT

---

**Built with ❤️ by Sohaib Khattak**
