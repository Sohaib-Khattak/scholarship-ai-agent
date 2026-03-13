# Setup Guide

## Quick Setup (5 minutes)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd scholarship-agent

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend (.env)**
```bash
cd backend
cp .env.example .env
# Edit .env with your API keys
```

**Frontend (.env.local)**
```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
```

### 3. Setup Database

1. Create Supabase project
2. Run schema.sql in SQL Editor
3. Copy credentials to backend .env

### 4. Run Locally

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000`

## Getting API Keys

### OpenAI
1. https://platform.openai.com/api/keys
2. Create new secret key
3. Copy to OPENAI_API_KEY

### Supabase
1. https://supabase.com → Create project
2. Settings → API → Copy URL and Key
3. SQL Editor → Run schema.sql

### WhatsApp Business API
1. https://developers.facebook.com
2. Create Business App
3. Add WhatsApp product
4. Get Phone Number ID and API Key
5. Create test group and get Group ID

## First Run Checklist

- [ ] All environment variables set
- [ ] Database schema created
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access dashboard at localhost:3000
- [ ] Manual scrape button works
- [ ] Can approve/reject scholarships
- [ ] WhatsApp message sends successfully

## Common Issues

**"Cannot find module"**
```bash
npm install
```

**"API connection error"**
- Check backend is running
- Verify NEXT_PUBLIC_API_URL

**"Database connection failed"**
- Check Supabase credentials
- Verify schema.sql was run

**"WhatsApp API error"**
- Verify API key is correct
- Check group ID is valid
- Ensure phone number is verified

## Next Steps

1. Deploy to production (see DEPLOYMENT.md)
2. Set up scheduled scraping
3. Invite users to WhatsApp group
4. Monitor dashboard for new scholarships
5. Customize message templates
