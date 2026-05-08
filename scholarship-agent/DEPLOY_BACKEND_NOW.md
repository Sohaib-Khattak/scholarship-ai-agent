# 🚀 DEPLOY BACKEND TO RAILWAY NOW - STEP-BY-STEP

## ⚡ BACKEND DEPLOYMENT (5 MINUTES)

**Your GitHub Repo:** https://github.com/Sohaib-Khattak/scholarship-ai-agent-

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### STEP 1: Go to Railway (30 seconds)

1. Open your browser
2. Go to: **https://railway.app**
3. You'll see the Railway homepage

---

### STEP 2: Login with GitHub (30 seconds)

1. Click **"Login"** (top right corner)
2. Click **"Login with GitHub"** (black button with GitHub logo)
3. If prompted, enter your GitHub credentials
4. Click **"Authorize Railway"** (green button)
5. Wait for redirect to Railway dashboard

---

### STEP 3: Create New Project (1 minute)

1. You're now on Railway dashboard
2. Click **"New Project"** button (center or top right)
3. Select **"Deploy from GitHub repo"**
4. You'll see a list of your GitHub repositories
5. Find: **"scholarship-ai-agent-"**
6. Click on it to select

---

### STEP 4: Configure Root Directory (1 minute) ⚠️ CRITICAL

1. Railway will start analyzing your repo
2. Click on the service/deployment card
3. Go to **"Settings"** tab (top navigation)
4. Scroll down to find **"Root Directory"**
5. Click in the input field
6. Type: **`backend`**
7. Press Enter or click outside to save
8. ✅ Verify it shows: `backend`

---

### STEP 5: Add Environment Variables (2 minutes) ⚠️ IMPORTANT

1. Click **"Variables"** tab (top navigation)
2. Click **"New Variable"** button
3. Add these 9 variables ONE BY ONE:

**Variable 1:**
```
Name: OPENAI_API_KEY
Value: [Your OpenAI API key from https://platform.openai.com/api-keys]
```

**Variable 2:**
```
Name: SUPABASE_URL
Value: [Your Supabase URL - we'll add this after Supabase setup]
```

**Variable 3:**
```
Name: SUPABASE_KEY
Value: [Your Supabase key - we'll add this after Supabase setup]
```

**Variable 4:**
```
Name: WHATSAPP_API_KEY
Value: [Your WhatsApp token - optional for now]
```

**Variable 5:**
```
Name: WHATSAPP_PHONE_NUMBER_ID
Value: [Your WhatsApp phone ID - optional for now]
```

**Variable 6:**
```
Name: WHATSAPP_GROUP_ID
Value: [Your WhatsApp group ID - optional for now]
```

**Variable 7:**
```
Name: AGENT_NAME
Value: Sohaib Khattak
```

**Variable 8:**
```
Name: PORT
Value: 5000
```

**Variable 9:**
```
Name: NODE_ENV
Value: production
```

**For now, you can use placeholder values for Supabase and WhatsApp:**
- SUPABASE_URL: `https://placeholder.supabase.co`
- SUPABASE_KEY: `placeholder-key`
- WHATSAPP_API_KEY: `placeholder`
- WHATSAPP_PHONE_NUMBER_ID: `placeholder`
- WHATSAPP_GROUP_ID: `placeholder`

We'll update these later!

---

### STEP 6: Deploy Backend (2 minutes)

1. Railway will automatically start deploying
2. Go to **"Deployments"** tab
3. You'll see build logs streaming
4. Wait 2-3 minutes for deployment to complete

**You'll see:**
```
Installing dependencies...
npm install
Starting application...
Server running on port 5000
Deployment successful!
```

---

### STEP 7: Get Your Backend URL (30 seconds)

1. After deployment succeeds, go to **"Settings"** tab
2. Scroll down to **"Domains"** section
3. Click **"Generate Domain"** button
4. Railway will create a URL like: `https://scholarship-agent-production.up.railway.app`
5. **COPY THIS URL** - you'll need it!

**Alternative way to get URL:**
1. Look for the deployment card
2. Click **"View Logs"** or the deployment
3. You'll see the URL displayed

---

### STEP 8: Test Backend Health (30 seconds)

1. Copy your Railway URL
2. Add `/health` to the end
3. Visit: `https://your-railway-url.railway.app/health`
4. You should see: `{"status":"Agent is running ✅","timestamp":"..."}`

✅ If you see this, backend is working!

---

## ✅ SUCCESS INDICATORS

You'll know it worked when:
- ✅ Deployment shows "Success" status
- ✅ You have a live Railway URL
- ✅ Visiting `/health` returns success message
- ✅ No errors in deployment logs

---

## 🎯 WHAT YOU'LL SEE

**During Build:**
```
Cloning repository...
Installing dependencies...
npm install
Starting server...
Listening on port 5000
Deployment ready!
```

**After Success:**
```
✅ Deployment successful
URL: https://scholarship-agent-production.up.railway.app
Status: Running
```

---

## ⚠️ COMMON ISSUES & FIXES

### Issue 1: "Build Failed"
**Fix:** Check if Root Directory is set to `backend`

### Issue 2: "Port already in use"
**Fix:** Make sure PORT variable is set to `5000`

### Issue 3: "Module not found"
**Fix:** Verify Root Directory is `backend`, not root

### Issue 4: "Environment variable missing"
**Fix:** Add all 9 environment variables listed above

---

## 📝 ENVIRONMENT VARIABLES CHECKLIST

Make sure you added all these:
- ☐ OPENAI_API_KEY (required - get from OpenAI)
- ☐ SUPABASE_URL (placeholder for now)
- ☐ SUPABASE_KEY (placeholder for now)
- ☐ WHATSAPP_API_KEY (placeholder for now)
- ☐ WHATSAPP_PHONE_NUMBER_ID (placeholder for now)
- ☐ WHATSAPP_GROUP_ID (placeholder for now)
- ☐ AGENT_NAME (Sohaib Khattak)
- ☐ PORT (5000)
- ☐ NODE_ENV (production)

---

## 🔑 WHERE TO GET API KEYS

**OpenAI API Key (Required Now):**
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Add to Railway as OPENAI_API_KEY

**Supabase (We'll do this next):**
- We'll set up Supabase database next
- Then update these variables

**WhatsApp (Optional - can add later):**
- Go to: https://developers.facebook.com
- Set up WhatsApp Business API
- Get credentials

---

## 📋 DEPLOYMENT CHECKLIST

- ☐ Go to https://railway.app
- ☐ Login with GitHub
- ☐ Create new project
- ☐ Deploy from GitHub repo
- ☐ Select scholarship-ai-agent-
- ☐ Set Root Directory to "backend" ⚠️ CRITICAL
- ☐ Add all 9 environment variables
- ☐ Wait for deployment
- ☐ Generate domain
- ☐ Copy Railway URL
- ☐ Test /health endpoint
- ☐ Verify success message

---

## 🎉 AFTER BACKEND DEPLOYMENT

Once you have your Railway URL:

1. **Copy the URL**
   - Example: `https://scholarship-agent-production.up.railway.app`

2. **Test it**
   - Visit: `https://your-url.railway.app/health`
   - Should see: `{"status":"Agent is running ✅"}`

3. **Next Steps:**
   - Update Vercel frontend with this backend URL
   - Setup Supabase database
   - Connect everything together

---

## 🚀 START NOW!

**Railway Website:**
```
https://railway.app
```

**Your GitHub Repo:**
```
https://github.com/Sohaib-Khattak/scholarship-ai-agent-
```

**Time needed:** 5 minutes

**Go deploy now and come back with your Railway URL!** 🎉

---

## 🔗 NEXT STEP AFTER THIS

After backend is deployed:
1. We'll update Vercel frontend to use this backend URL
2. We'll setup Supabase database
3. We'll connect everything together
4. System will be fully live!

---

**Built with ❤️ by Sohaib Khattak**
**Powered by Railway & Node.js**

================================================================================
