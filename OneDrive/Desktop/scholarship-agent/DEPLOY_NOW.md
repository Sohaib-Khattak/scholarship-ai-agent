# ⚡ QUICK ACTION CHECKLIST - DEPLOY NOW

## 🎯 DO THIS RIGHT NOW (5 Minutes)

### Step 1: Push Updated Files (2 min)
```bash
cd "/mnt/c/Users/MA LAPTOP/OneDrive/Desktop/scholarship-agent"

git add .
git commit -m "Fix Vercel deployment - add vercel.json and build script"
git push origin main
```

### Step 2: Delete Old Vercel Project (1 min)
1. Go to https://vercel.com/dashboard
2. Find your project
3. Click **Settings** → Scroll down → **Delete Project**
4. Confirm

### Step 3: Redeploy to Vercel (2 min)
1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select `scholarship-ai-agent`
5. **IMPORTANT SETTINGS:**
   - Framework: **Next.js**
   - Root Directory: **frontend** ← CRITICAL!
   - Build Command: **npm run build**
   - Output Directory: **.next**
6. Add Environment Variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: (leave empty)
7. Click **"Deploy"**
8. ✅ Wait for deployment to complete

---

## 📋 AFTER VERCEL DEPLOYS (Next 10 Minutes)

### Step 4: Deploy Backend to Railway (5 min)

1. Go to https://railway.app
2. Click **"New Project"**
3. Click **"Deploy from GitHub repo"**
4. Select `scholarship-ai-agent`
5. Click **"Add variables"** and paste:

```env
OPENAI_API_KEY=sk-your-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-key-here
WHATSAPP_API_KEY=your-key-here
WHATSAPP_PHONE_NUMBER_ID=your-id-here
WHATSAPP_GROUP_ID=your-group-id-here
AGENT_NAME=Sohaib Khattak
PORT=5000
NODE_ENV=production
SCRAPE_INTERVAL=6h
POSTS_PER_DAY=3
INTERNSHIPS_PER_DAY=3
```

6. Click **"Settings"** → **"Service"**
7. Root Directory: `backend`
8. Start Command: `npm start`
9. Click **"Deploy"**
10. ✅ Wait for deployment (3-5 min)
11. Copy your Railway URL (e.g., `https://scholarship-ai-agent-production.up.railway.app`)

### Step 5: Connect Frontend to Backend (2 min)

1. Go to Vercel Dashboard
2. Select your project
3. Click **"Settings"** → **"Environment Variables"**
4. Update `NEXT_PUBLIC_API_URL`:
   ```
   https://your-railway-url.railway.app/api
   ```
5. Click **"Save"**
6. Go to **"Deployments"**
7. Click **"Redeploy"** on latest
8. ✅ Wait for redeploy (1-2 min)

---

## ✅ VERIFY EVERYTHING WORKS

### Test 1: Frontend Loads
```
Open: https://your-vercel-url.vercel.app
Should see: Dashboard with statistics
```

### Test 2: Backend Health
```bash
curl https://your-railway-url.railway.app/health
Should see: {"status":"Agent is running ✅",...}
```

### Test 3: Manual Scrape
```
1. Click "Manual Scrape" button
2. Wait 2-3 minutes
3. Check "Pending Approval" section
4. Should see scholarships
```

### Test 4: Approve & Publish
```
1. Approve a scholarship
2. Click "Publish"
3. Check WhatsApp group
4. Should see message
```

---

## 🎉 YOU'RE LIVE!

Once all tests pass:

**Frontend URL:** `https://your-vercel-url.vercel.app`
**Backend URL:** `https://your-railway-url.railway.app`
**Database:** Supabase (already configured)

---

## 📞 IF SOMETHING GOES WRONG

### Vercel Build Error
```
→ Delete project and redeploy
→ Make sure Root Directory is: frontend
→ Check vercel.json exists in root
```

### Backend Won't Start
```
→ Check Railway logs
→ Verify all environment variables
→ Check SUPABASE credentials
```

### API Connection Error
```
→ Check NEXT_PUBLIC_API_URL in Vercel
→ Should end with: /api
→ Redeploy Vercel after updating
```

### WhatsApp Not Sending
```
→ Verify WHATSAPP_API_KEY
→ Check WHATSAPP_GROUP_ID
→ Ensure phone is verified
```

---

## 📊 DEPLOYMENT SUMMARY

| Component | Platform | Status |
|-----------|----------|--------|
| Frontend | Vercel | Ready to Deploy |
| Backend | Railway | Ready to Deploy |
| Database | Supabase | Ready to Use |
| Total Cost | - | ~$5-10/month |
| Setup Time | - | ~20 minutes |

---

## 🚀 START NOW!

**Step 1:** Push to GitHub (2 min)
**Step 2:** Delete old Vercel project (1 min)
**Step 3:** Redeploy to Vercel (5 min)
**Step 4:** Deploy to Railway (5 min)
**Step 5:** Connect frontend to backend (2 min)
**Step 6:** Test everything (5 min)

**TOTAL TIME: ~20 minutes**

---

## 💡 KEY REMINDERS

✅ Root Directory for Vercel: **frontend**
✅ Root Directory for Railway: **backend**
✅ NEXT_PUBLIC_API_URL must end with: **/api**
✅ All environment variables must be set
✅ Database schema must be executed in Supabase

---

**You've got this! 🎓 Let's go live! 🚀**

Built with ❤️ by Sohaib Khattak
