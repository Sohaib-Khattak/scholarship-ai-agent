# 🚀 VERCEL DEPLOYMENT GUIDE - Web-Based

## Complete Step-by-Step Guide to Deploy on Vercel

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ GitHub account with your code pushed
- ✅ Vercel account (free) - Sign up at https://vercel.com
- ✅ Backend deployed somewhere (Railway, Render, or Heroku)
- ✅ All API keys ready (OpenAI, Supabase, WhatsApp)

---

## 🎯 PART 1: Deploy Frontend to Vercel

### Step 1: Push Code to GitHub (If not done)

```bash
cd "/mnt/c/Users/MA LAPTOP/OneDrive/Desktop/scholarship-agent"
git add .
git commit -m "Ready for Vercel deployment"
git push origin master
```

**Your GitHub Repo:** https://github.com/Sohaib-Khattak/scholarship-ai-agent-

---

### Step 2: Login to Vercel

1. Go to: **https://vercel.com**
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

---

### Step 3: Import Your Project

1. Once logged in, click **"Add New..."** button (top right)
2. Select **"Project"**
3. You'll see "Import Git Repository" page
4. Find your repository: **scholarship-ai-agent-**
5. Click **"Import"** next to it

---

### Step 4: Configure Project Settings

On the "Configure Project" page:

#### **Framework Preset:**
- Vercel should auto-detect: **Next.js**
- If not, select **Next.js** from dropdown

#### **Root Directory:**
- Click **"Edit"** next to Root Directory
- Select: **`frontend`**
- This is CRITICAL - tells Vercel where your Next.js app is

#### **Build and Output Settings:**
- Build Command: `npm run build` (auto-filled)
- Output Directory: `.next` (auto-filled)
- Install Command: `npm install` (auto-filled)

---

### Step 5: Add Environment Variables

Click **"Environment Variables"** section and add:

**Variable 1:**
```
Name: NEXT_PUBLIC_API_URL
Value: https://your-backend-url.railway.app/api
```

**Important Notes:**
- Replace `your-backend-url.railway.app` with your actual backend URL
- If backend not deployed yet, use: `http://localhost:5000/api` (temporary)
- You can update this later in Vercel dashboard

---

### Step 6: Deploy

1. Click **"Deploy"** button
2. Wait 2-3 minutes for deployment
3. You'll see build logs in real-time
4. Once complete, you'll see: **"Congratulations! 🎉"**

---

### Step 7: Get Your Live URL

After deployment:
1. You'll see your live URL: `https://your-project.vercel.app`
2. Click on it to visit your dashboard
3. Copy this URL - you'll need it

**Example URL:** `https://scholarship-ai-agent.vercel.app`

---

## 🎯 PART 2: Deploy Backend to Railway

### Step 1: Create Railway Account

1. Go to: **https://railway.app**
2. Click **"Login"**
3. Choose **"Login with GitHub"**
4. Authorize Railway

---

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **scholarship-ai-agent-**
4. Railway will detect your repository

---

### Step 3: Configure Backend

1. Railway will show detected services
2. Click **"Add variables"** or **"Variables"** tab
3. Add these environment variables:

```
OPENAI_API_KEY=your_openai_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
WHATSAPP_API_KEY=your_whatsapp_key_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_id_here
WHATSAPP_GROUP_ID=your_group_id_here
AGENT_NAME=Sohaib Khattak
PORT=5000
NODE_ENV=production
```

---

### Step 4: Set Root Directory

1. Go to **"Settings"** tab
2. Find **"Root Directory"**
3. Set to: **`backend`**
4. Click **"Save"**

---

### Step 5: Deploy Backend

1. Click **"Deploy"** or it will auto-deploy
2. Wait 2-3 minutes
3. Once deployed, you'll get a URL like: `https://scholarship-agent-production.up.railway.app`
4. Copy this URL

---

### Step 6: Update Frontend Environment Variable

1. Go back to **Vercel Dashboard**
2. Select your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Find `NEXT_PUBLIC_API_URL`
5. Click **"Edit"**
6. Update value to: `https://your-railway-url.railway.app/api`
7. Click **"Save"**
8. Go to **"Deployments"** tab
9. Click **"Redeploy"** on latest deployment

---

## 🎯 PART 3: Setup Database (Supabase)

### Step 1: Create Supabase Project

1. Go to: **https://supabase.com**
2. Click **"Start your project"**
3. Login with GitHub
4. Click **"New Project"**
5. Fill in:
   - Name: `scholarship-agent`
   - Database Password: (create strong password)
   - Region: Choose closest to you
6. Click **"Create new project"**
7. Wait 2-3 minutes for setup

---

### Step 2: Run Database Schema

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Copy the entire content from `backend/schema.sql`
4. Paste into SQL editor
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see: "Success. No rows returned"

---

### Step 3: Get Database Credentials

1. Click **"Settings"** (gear icon, bottom left)
2. Click **"API"**
3. Copy these values:
   - **Project URL** → This is your `SUPABASE_URL`
   - **Project API keys** → **anon/public** → This is your `SUPABASE_KEY`

---

### Step 4: Update Backend Environment Variables

1. Go to **Railway Dashboard**
2. Select your backend project
3. Go to **"Variables"** tab
4. Update:
   - `SUPABASE_URL` = (paste Project URL)
   - `SUPABASE_KEY` = (paste anon key)
5. Backend will auto-redeploy

---

## 🎯 PART 4: Setup WhatsApp Business API

### Step 1: Create Meta Developer Account

1. Go to: **https://developers.facebook.com**
2. Click **"Get Started"**
3. Login with Facebook account
4. Complete verification

---

### Step 2: Create Business App

1. Click **"My Apps"** → **"Create App"**
2. Select **"Business"** type
3. Fill in:
   - App Name: `Scholarship Agent`
   - Contact Email: your email
4. Click **"Create App"**

---

### Step 3: Add WhatsApp Product

1. In app dashboard, find **"WhatsApp"**
2. Click **"Set up"**
3. Follow setup wizard
4. You'll get:
   - **Phone Number ID**
   - **WhatsApp Business Account ID**
   - **Access Token**

---

### Step 4: Get Test Phone Number

1. In WhatsApp setup, you'll see a test phone number
2. Add your personal WhatsApp number to test
3. Send a test message to verify

---

### Step 5: Update Backend Variables

1. Go to **Railway Dashboard**
2. Update variables:
   - `WHATSAPP_API_KEY` = (Access Token)
   - `WHATSAPP_PHONE_NUMBER_ID` = (Phone Number ID)
   - `WHATSAPP_GROUP_ID` = (Your WhatsApp group ID)

---

## 🎯 PART 5: Final Testing

### Step 1: Test Backend Health

1. Open browser
2. Go to: `https://your-railway-url.railway.app/health`
3. You should see: `{"status":"Agent is running ✅","timestamp":"..."}`

---

### Step 2: Test Frontend

1. Go to your Vercel URL: `https://your-project.vercel.app`
2. You should see the dashboard
3. Check if statistics load

---

### Step 3: Test Manual Scrape

1. In dashboard, click **"Manual Scrape"** button
2. Wait 2-3 minutes
3. Check if pending scholarships appear
4. If they appear, system is working! ✅

---

### Step 4: Test Approval & Publishing

1. Click **"Approve"** on a scholarship
2. Then click **"Publish"**
3. Check your WhatsApp group
4. You should receive the message! 🎉

---

## 📊 Your Live URLs

After deployment, you'll have:

- **Frontend Dashboard:** `https://scholarship-ai-agent.vercel.app`
- **Backend API:** `https://scholarship-agent-production.railway.app`
- **Database:** Supabase dashboard
- **GitHub Repo:** https://github.com/Sohaib-Khattak/scholarship-ai-agent-

---

## 🔧 Common Issues & Solutions

### Issue 1: "API Connection Error" in Frontend

**Solution:**
1. Check `NEXT_PUBLIC_API_URL` in Vercel
2. Make sure it ends with `/api`
3. Verify backend is running: visit `/health` endpoint
4. Redeploy frontend after fixing

---

### Issue 2: Backend Not Starting

**Solution:**
1. Check Railway logs: Click "View Logs"
2. Verify all environment variables are set
3. Check if `PORT=5000` is set
4. Make sure root directory is `backend`

---

### Issue 3: Database Connection Failed

**Solution:**
1. Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
2. Check if schema.sql was executed successfully
3. Go to Supabase → Table Editor → verify tables exist

---

### Issue 4: WhatsApp Messages Not Sending

**Solution:**
1. Verify WhatsApp API credentials
2. Check if phone number is verified
3. Make sure group ID is correct
4. Check Railway logs for errors

---

## 🎯 Post-Deployment Checklist

- [ ] Frontend loads at Vercel URL
- [ ] Backend health check returns success
- [ ] Database tables created in Supabase
- [ ] Manual scrape finds scholarships
- [ ] Can approve/reject scholarships
- [ ] WhatsApp messages send successfully
- [ ] Dashboard updates in real-time
- [ ] All environment variables set correctly

---

## 🚀 Next Steps After Deployment

1. **Test thoroughly** - Try all features
2. **Invite users** to WhatsApp group
3. **Monitor dashboard** for new opportunities
4. **Check logs** regularly in Railway
5. **Set up custom domain** (optional) in Vercel
6. **Enable automatic deployments** - Already enabled via GitHub

---

## 💡 Pro Tips

- **Custom Domain:** Go to Vercel → Settings → Domains → Add your domain
- **Analytics:** Vercel provides free analytics - enable in dashboard
- **Monitoring:** Use Railway logs to monitor backend activity
- **Backups:** Supabase auto-backups your database
- **Updates:** Push to GitHub → Auto-deploys to Vercel & Railway

---

## 📞 Need Help?

If you encounter issues:
1. Check Railway logs for backend errors
2. Check Vercel deployment logs for frontend errors
3. Verify all environment variables are correct
4. Test each API endpoint individually
5. Check Supabase logs for database errors

---

## 🎉 Congratulations!

Your Scholarship AI Agent is now live and running 24/7! 🚀

**Built with ❤️ by Sohaib Khattak**
**Powered by GPT-4, Supabase & WhatsApp Business API**

🎓 Happy Scholarship Hunting! ✨
