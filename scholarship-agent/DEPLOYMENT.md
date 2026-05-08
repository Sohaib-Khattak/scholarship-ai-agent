# Deployment Guide

## Step-by-Step Deployment Instructions

### Phase 1: Prepare Your Accounts

#### 1. OpenAI API
1. Go to https://platform.openai.com/api/keys
2. Create new API key
3. Copy and save securely

#### 2. Supabase Setup
1. Go to https://supabase.com
2. Create new project
3. Go to SQL Editor
4. Run the schema.sql file from backend folder
5. Copy your Project URL and API Key

#### 3. WhatsApp Business API
1. Go to https://developers.facebook.com
2. Create Business App
3. Add WhatsApp product
4. Get your Phone Number ID and API Key
5. Create/use a WhatsApp group for testing
6. Copy Group ID

### Phase 2: Deploy Backend to Railway

#### Option A: Using Railway CLI

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Create new project
cd backend
railway init

# 4. Set environment variables
railway variables set OPENAI_API_KEY=your_key
railway variables set SUPABASE_URL=your_url
railway variables set SUPABASE_KEY=your_key
railway variables set WHATSAPP_API_KEY=your_key
railway variables set WHATSAPP_PHONE_NUMBER_ID=your_id
railway variables set WHATSAPP_GROUP_ID=your_group_id
railway variables set AGENT_NAME="Sohaib Khattak"
railway variables set PORT=5000

# 5. Deploy
railway up
```

#### Option B: Using Railway Dashboard

1. Go to https://railway.app
2. Create new project
3. Connect GitHub repo
4. Select backend folder
5. Add environment variables
6. Deploy

**Your backend URL will be:** `https://your-project.railway.app`

### Phase 3: Deploy Frontend to Vercel

#### Option A: Using Vercel CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd frontend
vercel

# 4. Set environment variable
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-project.railway.app/api
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com
2. Import GitHub repo
3. Select frontend folder as root
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-project.railway.app/api`
5. Deploy

**Your frontend URL will be:** `https://your-project.vercel.app`

### Phase 4: Test the System

1. Open your Vercel dashboard URL
2. Click "Manual Scrape" button
3. Wait 2-3 minutes for scraping to complete
4. Check pending scholarships
5. Approve and publish a test scholarship
6. Check your WhatsApp group for the message

### Phase 5: Configure Automation

#### Set up scheduled scraping (every 6 hours)

**Option A: Using Railway Cron**

```bash
railway variables set CRON_SCHEDULE="0 */6 * * *"
```

**Option B: Using External Service**

Use https://cron-job.org or https://easycron.com

Create a cron job that hits:
```
POST https://your-project.railway.app/api/agents/scrape
```

Every 6 hours.

## Troubleshooting

### Backend won't start
```bash
# Check logs
railway logs

# Common issues:
# - Missing environment variables
# - Invalid API keys
# - Database connection failed
```

### Frontend shows "API connection error"
```
- Check NEXT_PUBLIC_API_URL is correct
- Verify backend is running
- Check CORS settings in backend
```

### WhatsApp messages not sending
```
- Verify WHATSAPP_API_KEY is correct
- Check WHATSAPP_GROUP_ID is valid
- Ensure phone number is verified
- Check WhatsApp Business account status
```

### GPT not analyzing pages correctly
```
- Verify OPENAI_API_KEY is valid
- Check OpenAI account has credits
- Review GPT prompt in scholarshipHunter.js
```

## Monitoring

### Check Backend Health
```bash
curl https://your-project.railway.app/health
```

### View Logs
- Railway: Dashboard → Logs
- Vercel: Dashboard → Deployments → Logs

### Database Queries
- Supabase: SQL Editor
- Check scholarships table for new entries

## Scaling Tips

1. **Increase scraping frequency:** Modify cron schedule
2. **Add more sources:** Edit scholarshipHunter.js sources array
3. **Adjust posting strategy:** Change POSTS_PER_DAY in .env
4. **Upgrade database:** Supabase Pro plan for more storage

## Security Checklist

- [ ] All API keys in environment variables (not in code)
- [ ] GitHub repo is private
- [ ] WhatsApp Business account verified
- [ ] Database backups enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured

## Support

For issues:
1. Check logs in Railway/Vercel
2. Verify all environment variables
3. Test API endpoints manually
4. Check OpenAI/Supabase status pages
