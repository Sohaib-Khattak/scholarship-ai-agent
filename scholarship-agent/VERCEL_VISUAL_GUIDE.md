# 📸 VERCEL DEPLOYMENT - VISUAL STEP-BY-STEP GUIDE

## Complete Visual Walkthrough with Screenshots Descriptions

---

## 🎯 PART 1: VERCEL FRONTEND DEPLOYMENT

### Step 1: Go to Vercel Website

**URL:** https://vercel.com

**What you'll see:**
- Black/dark website
- "Develop. Preview. Ship." headline
- "Sign Up" button (top right)
- "Login" button

**Action:** Click **"Sign Up"** or **"Login"**

---

### Step 2: Login with GitHub

**What you'll see:**
- Login options page
- "Continue with GitHub" button (black button with GitHub logo)
- "Continue with GitLab" option
- "Continue with Bitbucket" option
- "Continue with Email" option

**Action:** Click **"Continue with GitHub"**

---

### Step 3: Authorize Vercel

**What you'll see:**
- GitHub authorization page
- "Authorize Vercel" button (green)
- List of permissions Vercel is requesting
- Your GitHub profile picture

**Action:** Click **"Authorize Vercel"**

---

### Step 4: Vercel Dashboard

**What you'll see:**
- Clean dashboard with sidebar
- "Add New..." button (top right, black button)
- "Overview" tab selected
- Empty state or existing projects

**Action:** Click **"Add New..."** button

---

### Step 5: Select Project Type

**What you'll see:**
- Dropdown menu with options:
  - "Project" ← Select this
  - "Team"
  - "Domain"

**Action:** Click **"Project"**

---

### Step 6: Import Git Repository

**What you'll see:**
- "Import Git Repository" page
- Search bar at top
- List of your GitHub repositories
- Each repo has "Import" button on the right

**What to find:**
- Look for: **"scholarship-ai-agent-"**
- You'll see: Repository name, last updated time

**Action:** Click **"Import"** next to scholarship-ai-agent-

---

### Step 7: Configure Project (MOST IMPORTANT!)

**What you'll see:**
- "Configure Project" page with several sections

#### Section 1: Project Name
- Auto-filled: `scholarship-ai-agent`
- **Action:** Leave as is or rename

#### Section 2: Framework Preset
- Dropdown showing: **"Next.js"** (should be auto-detected)
- **Action:** Verify it says "Next.js"

#### Section 3: Root Directory ⚠️ CRITICAL!
- Shows: `./` (default)
- **Action:**
  1. Click **"Edit"** button
  2. A folder browser appears
  3. Click on **"frontend"** folder
  4. Click **"Continue"**
  5. Now it should show: `frontend`

#### Section 4: Build and Output Settings
- Build Command: `npm run build` ✅
- Output Directory: `.next` ✅
- Install Command: `npm install` ✅
- **Action:** Leave these as default

#### Section 5: Environment Variables
- Click **"Add"** or expand section
- You'll see:
  - Name field (left)
  - Value field (right)
  - "Add" button

**Action:** Add this variable:
```
Name: NEXT_PUBLIC_API_URL
Value: http://localhost:5000/api
```
(We'll update this later with real backend URL)

---

### Step 8: Deploy!

**What you'll see:**
- Big **"Deploy"** button at bottom (black button)

**Action:** Click **"Deploy"**

---

### Step 9: Deployment Progress

**What you'll see:**
- Build logs streaming in real-time
- Progress indicators:
  - "Building..." (with spinner)
  - "Queued"
  - "Building"
  - "Deploying"
- Black terminal-like interface with logs

**Wait:** 2-3 minutes

**What logs show:**
```
Installing dependencies...
npm install
Building application...
npm run build
Uploading build outputs...
Deployment ready!
```

---

### Step 10: Success! 🎉

**What you'll see:**
- **"Congratulations!"** message with confetti animation
- Your live URL displayed prominently
- Example: `https://scholarship-ai-agent.vercel.app`
- "Visit" button
- "Continue to Dashboard" button

**Action:**
1. Copy your URL
2. Click **"Visit"** to see your live site

---

## 🎯 PART 2: RAILWAY BACKEND DEPLOYMENT

### Step 1: Go to Railway

**URL:** https://railway.app

**What you'll see:**
- Purple/dark website
- "Bring your code, we'll handle the rest" headline
- "Start a New Project" button
- "Login" button (top right)

**Action:** Click **"Login"**

---

### Step 2: Login with GitHub

**What you'll see:**
- Login options
- "Login with GitHub" button (black with GitHub logo)
- "Login with Email" option

**Action:** Click **"Login with GitHub"**

---

### Step 3: Authorize Railway

**What you'll see:**
- GitHub authorization page
- "Authorize Railway" button (green)
- List of permissions

**Action:** Click **"Authorize Railway"**

---

### Step 4: Railway Dashboard

**What you'll see:**
- Clean purple-themed dashboard
- "New Project" button (center or top right)
- Sidebar with navigation
- Empty state or existing projects

**Action:** Click **"New Project"**

---

### Step 5: Select Deployment Method

**What you'll see:**
- Modal/popup with options:
  - "Deploy from GitHub repo" ← Select this
  - "Deploy from template"
  - "Empty project"
  - "Database"

**Action:** Click **"Deploy from GitHub repo"**

---

### Step 6: Select Repository

**What you'll see:**
- List of your GitHub repositories
- Search bar at top
- Each repo has a card/button

**What to find:**
- Look for: **"scholarship-ai-agent-"**

**Action:** Click on **"scholarship-ai-agent-"**

---

### Step 7: Railway Detects Your App

**What you'll see:**
- Railway analyzing your repository
- "Detected: Node.js" or similar
- Automatic configuration happening

**Wait:** 10-20 seconds

---

### Step 8: Configure Root Directory ⚠️ CRITICAL!

**What you'll see:**
- Project dashboard with tabs:
  - "Deployments"
  - "Variables"
  - "Settings" ← Click this
  - "Metrics"

**Action:**
1. Click **"Settings"** tab
2. Scroll down to find **"Root Directory"**
3. You'll see an input field (default is empty or `/`)
4. Type: **`backend`**
5. Click **"Save"** or it auto-saves

---

### Step 9: Add Environment Variables

**What you'll see:**
- Click **"Variables"** tab
- "New Variable" button or "Add Variable"
- List of variables (empty initially)

**Action:** Click **"New Variable"** and add each one:

```
Variable 1:
Name: OPENAI_API_KEY
Value: sk-your-openai-key-here

Variable 2:
Name: SUPABASE_URL
Value: https://your-project.supabase.co

Variable 3:
Name: SUPABASE_KEY
Value: your-supabase-anon-key

Variable 4:
Name: WHATSAPP_API_KEY
Value: your-whatsapp-token

Variable 5:
Name: WHATSAPP_PHONE_NUMBER_ID
Value: your-phone-number-id

Variable 6:
Name: WHATSAPP_GROUP_ID
Value: your-group-id

Variable 7:
Name: AGENT_NAME
Value: Sohaib Khattak

Variable 8:
Name: PORT
Value: 5000

Variable 9:
Name: NODE_ENV
Value: production
```

**How to add each:**
1. Click **"New Variable"**
2. Type name in left field
3. Type value in right field
4. Click **"Add"** or press Enter
5. Repeat for all variables

---

### Step 10: Deploy Backend

**What you'll see:**
- Railway automatically starts deploying
- "Deployments" tab shows:
  - "Building..." status
  - Build logs streaming
  - Progress bar

**Wait:** 2-3 minutes

**What logs show:**
```
Installing dependencies...
npm install
Starting application...
Server running on port 5000
```

---

### Step 11: Get Backend URL

**What you'll see:**
- After successful deployment:
- "Deployment successful" message
- Your backend URL displayed
- Example: `https://scholarship-agent-production.up.railway.app`
- "Open App" button

**Action:**
1. Copy this URL
2. Click **"Open App"** to test
3. Add `/health` to URL and visit
4. Should see: `{"status":"Agent is running ✅"}`

---

## 🎯 PART 3: CONNECT FRONTEND TO BACKEND

### Step 1: Go Back to Vercel

**URL:** https://vercel.com/dashboard

**What you'll see:**
- Your projects list
- Find: **scholarship-ai-agent**

**Action:** Click on your project

---

### Step 2: Open Settings

**What you'll see:**
- Project dashboard with tabs:
  - "Deployments"
  - "Analytics"
  - "Settings" ← Click this
  - "Domains"

**Action:** Click **"Settings"** tab

---

### Step 3: Environment Variables

**What you'll see:**
- Settings page with sidebar menu
- Click **"Environment Variables"** in sidebar
- List of your variables
- You'll see: `NEXT_PUBLIC_API_URL` with old value

**Action:**
1. Find `NEXT_PUBLIC_API_URL`
2. Click **"Edit"** button (pencil icon)
3. Update value to: `https://your-railway-url.railway.app/api`
4. Click **"Save"**

---

### Step 4: Redeploy Frontend

**What you'll see:**
- Go to **"Deployments"** tab
- List of deployments
- Latest deployment at top

**Action:**
1. Click **"..."** (three dots) on latest deployment
2. Click **"Redeploy"**
3. Confirm redeploy
4. Wait 2 minutes

---

### Step 5: Test Connection

**What you'll see:**
- Visit your Vercel URL
- Dashboard should load
- Statistics should show numbers (not errors)

**Action:**
1. Open: `https://your-project.vercel.app`
2. Check if stats load
3. Click **"Manual Scrape"** button
4. Wait 2-3 minutes
5. Pending scholarships should appear

---

## 🎯 PART 4: SETUP SUPABASE DATABASE

### Step 1: Go to Supabase

**URL:** https://supabase.com

**What you'll see:**
- Green-themed website
- "Start your project" button
- "Sign in" button (top right)

**Action:** Click **"Sign in"** or **"Start your project"**

---

### Step 2: Login with GitHub

**What you'll see:**
- Login options
- "Continue with GitHub" button

**Action:** Click **"Continue with GitHub"**

---

### Step 3: Create New Project

**What you'll see:**
- Dashboard with "New project" button
- List of organizations (if any)

**Action:** Click **"New project"**

---

### Step 4: Configure Project

**What you'll see:**
- Form with fields:

**Fill in:**
```
Name: scholarship-agent
Database Password: [Create strong password - SAVE THIS!]
Region: [Choose closest to you]
Pricing Plan: Free (selected by default)
```

**Action:** Click **"Create new project"**

**Wait:** 2-3 minutes for database setup

---

### Step 5: Run Database Schema

**What you'll see:**
- Project dashboard with sidebar
- Icons for: Table Editor, SQL Editor, Database, etc.

**Action:**
1. Click **"SQL Editor"** (icon looks like </> )
2. Click **"New query"** button
3. You'll see empty SQL editor

**What to do:**
1. Open your local file: `backend/schema.sql`
2. Copy ALL content (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL editor (Ctrl+V)
4. Click **"Run"** button (or press Ctrl+Enter)

**What you'll see:**
- "Success. No rows returned" message
- Green checkmark

---

### Step 6: Verify Tables Created

**What you'll see:**
- Click **"Table Editor"** in sidebar
- You should see 3 tables:
  - `scholarships` ✅
  - `agent_logs` ✅
  - `settings` ✅

**Action:** Click on each table to verify they exist

---

### Step 7: Get API Credentials

**What you'll see:**
- Click **"Settings"** (gear icon, bottom left)
- Click **"API"** in settings menu
- Page shows:
  - Project URL
  - API Keys section with:
    - `anon` `public` key (visible)
    - `service_role` key (hidden)

**Action:**
1. Copy **"Project URL"** (looks like: `https://abcdefgh.supabase.co`)
2. Copy **"anon public"** key (long string starting with `eyJ...`)

---

### Step 8: Update Railway Variables

**What you'll see:**
- Go back to Railway dashboard
- Your backend project
- Click **"Variables"** tab

**Action:**
1. Find `SUPABASE_URL` variable
2. Click **"Edit"**
3. Paste Project URL
4. Find `SUPABASE_KEY` variable
5. Click **"Edit"**
6. Paste anon key
7. Backend will auto-redeploy

---

## ✅ FINAL TESTING CHECKLIST

### Test 1: Backend Health ✅
```
Visit: https://your-railway-url.railway.app/health
Expected: {"status":"Agent is running ✅","timestamp":"..."}
```

### Test 2: Frontend Loads ✅
```
Visit: https://your-vercel-url.vercel.app
Expected: Beautiful dashboard with statistics
```

### Test 3: Database Connection ✅
```
Dashboard should show:
- Total: 0
- Pending: 0
- Approved: 0
- Posted: 0
```

### Test 4: Manual Scrape ✅
```
1. Click "Manual Scrape" button
2. Wait 2-3 minutes
3. Pending scholarships appear
4. Each shows: title, country, deadline, score
```

### Test 5: Approval Workflow ✅
```
1. Click "Approve" on a scholarship
2. Status changes to "approved"
3. Click "Publish"
4. Check WhatsApp group for message
```

---

## 🎉 SUCCESS INDICATORS

You'll know everything works when:

✅ Frontend URL loads without errors
✅ Backend /health returns success
✅ Dashboard shows statistics (even if 0)
✅ Manual scrape finds scholarships
✅ Can approve/reject scholarships
✅ Database tables visible in Supabase
✅ No errors in Railway logs
✅ No errors in Vercel logs

---

## 🚀 YOUR LIVE SYSTEM

**Frontend Dashboard:**
```
https://scholarship-ai-agent.vercel.app
```

**Backend API:**
```
https://scholarship-agent-production.railway.app
```

**Database:**
```
https://supabase.com/dashboard/project/your-project-id
```

**GitHub Repository:**
```
https://github.com/Sohaib-Khattak/scholarship-ai-agent-
```

---

## 📱 BONUS: WhatsApp Setup (Optional)

### Quick WhatsApp Setup

1. **Go to:** https://developers.facebook.com
2. **Create App** → Business type
3. **Add WhatsApp** product
4. **Get credentials:**
   - Phone Number ID
   - Access Token
5. **Update Railway variables:**
   - `WHATSAPP_API_KEY`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_GROUP_ID`
6. **Test:** Publish a scholarship from dashboard

---

## 🎯 COMMON VISUAL INDICATORS

### ✅ Success Indicators:
- Green checkmarks
- "Success" messages
- "Deployment ready" status
- URLs are clickable and work
- No red error messages

### ❌ Error Indicators:
- Red X marks
- "Failed" status
- "Error" messages in logs
- 404 or 500 errors when visiting URLs
- Missing environment variables warnings

---

## 💡 PRO TIPS

1. **Bookmark your URLs** - Save all 3 URLs for quick access
2. **Check logs regularly** - Railway and Vercel have great log viewers
3. **Test incrementally** - Test each step before moving to next
4. **Save credentials** - Keep API keys in password manager
5. **Monitor usage** - Check Railway/Vercel usage to stay in free tier

---

## 🎉 CONGRATULATIONS!

You've successfully deployed a full-stack AI application! 🚀

**What you built:**
- ✅ AI-powered scholarship discovery system
- ✅ Beautiful Next.js dashboard
- ✅ Express.js backend with GPT-4
- ✅ PostgreSQL database
- ✅ WhatsApp integration
- ✅ Automated scraping & re-announcement
- ✅ Manual approval workflow

**All running 24/7 on the cloud!** ☁️

---

**Built with ❤️ by Sohaib Khattak**
**Powered by Vercel, Railway, Supabase & GPT-4**

🎓 Happy Scholarship Hunting! ✨
