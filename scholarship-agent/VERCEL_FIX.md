# 🔧 VERCEL DEPLOYMENT FIX GUIDE

## ❌ Problem You Encountered

```
npm error Missing script: "build"
npm error Command "npm run build" exited with 1
```

**Cause:** Vercel was trying to build the entire project (including backend) instead of just the frontend.

---

## ✅ SOLUTION APPLIED

### 1. Added `vercel.json` Configuration
Created file: `vercel.json` in root directory
- Tells Vercel to only build the frontend folder
- Routes all requests to frontend

### 2. Added Build Script to Backend
Updated: `backend/package.json`
- Added: `"build": "echo 'Backend does not require build step'"`
- Prevents build errors if backend is accidentally selected

---

## 🚀 STEP-BY-STEP FIX

### Step 1: Push Updated Files to GitHub

```bash
cd "/mnt/c/Users/MA LAPTOP/OneDrive/Desktop/scholarship-agent"

# Add the new files
git add vercel.json backend/package.json

# Commit
git commit -m "Fix Vercel deployment configuration"

# Push
git push origin main
```

### Step 2: Delete Old Vercel Deployment

1. Go to https://vercel.com/dashboard
2. Find your project
3. Click **Settings** (gear icon)
4. Scroll to bottom
5. Click **"Delete Project"**
6. Confirm deletion

### Step 3: Redeploy to Vercel

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select `scholarship-ai-agent` repo
5. **CRITICAL SETTINGS:**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```
6. Click **"Environment Variables"**
7. Add:
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: (leave empty for now)
   ```
8. Click **"Deploy"**
9. Wait 3-5 minutes

### Step 4: Get Your Vercel URL

Once deployed, you'll see:
```
✅ Production: https://scholarship-ai-agent.vercel.app
```

Copy this URL.

### Step 5: Deploy Backend to Railway

1. Go to https://railway.app
2. Click **"New Project"**
3. Click **"Deploy from GitHub repo"**
4. Select `scholarship-ai-agent`
5. Add environment variables (see below)
6. Set Root Directory: `backend`
7. Click **"Deploy"**
8. Wait 3-5 minutes
9. Get your Railway URL (looks like: `https://scholarship-ai-agent-production.up.railway.app`)

### Step 6: Connect Frontend to Backend

1. Go back to Vercel Dashboard
2. Select your project
3. Click **"Settings"** → **"Environment Variables"**
4. Find `NEXT_PUBLIC_API_URL`
5. Update value to:
   ```
   https://your-railway-url.railway.app/api
   ```
   Example:
   ```
   https://scholarship-ai-agent-production.up.railway.app/api
   ```
6. Click **"Save"**
7. Go to **"Deployments"**
8. Click **"Redeploy"** on the latest deployment

---

## 🔑 RAILWAY ENVIRONMENT VARIABLES

When deploying to Railway, add these variables:

```env
OPENAI_API_KEY=sk-your-openai-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key-here
WHATSAPP_API_KEY=your-whatsapp-api-key
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_GROUP_ID=your-group-id
AGENT_NAME=Sohaib Khattak
PORT=5000
NODE_ENV=production
SCRAPE_INTERVAL=6h
POSTS_PER_DAY=3
INTERNSHIPS_PER_DAY=3
```

---

## ✅ VERIFICATION CHECKLIST

After deployment:

- [ ] Vercel deployment successful (no build errors)
- [ ] Railway deployment successful
- [ ] Frontend URL loads without errors
- [ ] Dashboard displays correctly
- [ ] Statistics cards show data
- [ ] "Manual Scrape" button is clickable
- [ ] Backend health check passes:
  ```bash
  curl https://your-railway-url.railway.app/health
  ```
- [ ] Frontend can reach backend (no API errors)

---

## 🧪 TEST YOUR DEPLOYMENT

### Test 1: Frontend Loads
```
Open: https://your-vercel-url.vercel.app
Expected: Dashboard loads with statistics
```

### Test 2: Backend Health
```bash
curl https://your-railway-url.railway.app/health
Expected: {"status":"Agent is running ✅","timestamp":"..."}
```

### Test 3: Manual Scrape
```
1. Open dashboard
2. Click "Manual Scrape"
3. Wait 2-3 minutes
4. Check "Pending Approval" section
5. Expected: Scholarships appear
```

### Test 4: Full Flow
```
1. Approve a scholarship
2. Click "Publish"
3. Check WhatsApp group
4. Expected: Message appears
```

---

## 🐛 TROUBLESHOOTING

### Issue: "API connection error" on dashboard

**Solution:**
```
1. Check NEXT_PUBLIC_API_URL in Vercel
2. Should be: https://your-railway-url.railway.app/api
3. NOT: https://your-railway-url.railway.app (missing /api)
4. Redeploy Vercel after updating
```

### Issue: Vercel still shows build error

**Solution:**
```
1. Delete project from Vercel
2. Push latest code to GitHub
3. Redeploy from scratch
4. Make sure Root Directory is set to: frontend
```

### Issue: Backend won't start on Railway

**Solution:**
```
1. Check Railway logs
2. Verify all environment variables are set
3. Check SUPABASE_URL and SUPABASE_KEY are correct
4. Ensure schema.sql was executed in Supabase
```

### Issue: WhatsApp messages not sending

**Solution:**
```
1. Verify WHATSAPP_API_KEY is correct
2. Check WHATSAPP_GROUP_ID is valid
3. Ensure phone number is verified with WhatsApp
4. Check WhatsApp Business account status
```

---

## 📋 FILES UPDATED

✅ Created: `vercel.json`
- Configures Vercel to deploy only frontend

✅ Updated: `backend/package.json`
- Added build script to prevent errors

✅ Existing: `frontend/` folder
- Ready to deploy as-is

---

## 🎯 NEXT STEPS

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment"
   git push origin main
   ```

2. **Delete old Vercel project**

3. **Redeploy to Vercel** (with correct settings)

4. **Deploy to Railway**

5. **Connect frontend to backend**

6. **Test everything**

---

## 💡 KEY POINTS

✅ **Vercel deploys ONLY frontend** (from `frontend/` folder)
✅ **Railway deploys ONLY backend** (from `backend/` folder)
✅ **They communicate via API** (NEXT_PUBLIC_API_URL)
✅ **Database is Supabase** (separate service)

---

## 🎉 YOU'RE READY!

The deployment should now work perfectly. Follow the steps above and you'll be live in 15-20 minutes!

**Questions?** Check the troubleshooting section or review the deployment logs.

---

**Built with ❤️ by Sohaib Khattak**
🎓 Happy Scholarship Hunting! 🚀
