# Architecture Overview

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Scholarship Agent System                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      Frontend (Vercel)                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Next.js Dashboard                                      │ │
│  │  - Pending Approvals                                    │ │
│  │  - Statistics & Analytics                               │ │
│  │  - Settings Management                                  │ │
│  │  - Manual Scrape Trigger                                │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                            ↓ (API Calls)
┌──────────────────────────────────────────────────────────────┐
│                    Backend API (Railway)                      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Express.js Server                                      │ │
│  │  - REST API Endpoints                                   │ │
│  │  - Request Validation                                   │ │
│  │  - Error Handling                                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                            ↓                                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  AI Agents                                              │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ 1. Scholarship Hunter                            │  │ │
│  │  │    - Scrapes websites                            │  │ │
│  │  │    - Uses GPT-4 for analysis                     │  │ │
│  │  │    - Extracts opportunity data                   │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ 2. Opportunity Validator                         │  │ │
│  │  │    - Checks deadline validity                    │  │ │
│  │  │    - Validates with GPT                          │  │ │
│  │  │    - Scores relevance (1-10)                     │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ 3. Content Formatter                             │  │ │
│  │  │    - Formats messages with emojis                │  │ │
│  │  │    - Adds agent branding                         │  │ │
│  │  │    - Creates engaging posts                      │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ 4. Publisher Bot                                 │  │ │
│  │  │    - Sends to WhatsApp API                       │  │ │
│  │  │    - Tracks delivery                             │  │ │
│  │  │    - Logs all actions                            │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
    ┌─────────┐         ┌──────────┐        ┌──────────────┐
    │ Supabase│         │ OpenAI   │        │ WhatsApp API │
    │Database │         │ GPT-4    │        │              │
    └─────────┘         └──────────┘        └──────────────┘
```

## Data Flow

### 1. Discovery Phase
```
Scheduler (every 6h)
    ↓
Scholarship Hunter Agent
    ↓
Scrape Websites (axios)
    ↓
GPT-4 Analysis
    ↓
Extract Opportunities
    ↓
Store in Database (pending_approval)
```

### 2. Review Phase
```
Dashboard Shows Pending
    ↓
User Reviews Scholarship
    ↓
User Clicks Approve/Reject/Publish
    ↓
API Updates Database Status
```

### 3. Publishing Phase
```
Approved Scholarship
    ↓
Content Formatter (GPT)
    ↓
Format Message with Emojis
    ↓
Add "Approved by Sohaib Khattak"
    ↓
Send to WhatsApp API
    ↓
Mark as Posted
```

## Database Schema

```sql
scholarships
├── id (UUID)
├── title (TEXT)
├── country (TEXT)
├── degree_level (TEXT)
├── funding_type (TEXT)
├── deadline (DATE)
├── source_url (TEXT)
├── status (pending_approval|approved|rejected|posted)
├── date_found (TIMESTAMP)
├── posted (BOOLEAN)
├── description (TEXT)
├── eligibility (TEXT)
├── relevance_score (INTEGER 1-10)
└── created_at, updated_at (TIMESTAMP)

agent_logs
├── id (UUID)
├── agent_name (TEXT)
├── action (TEXT)
├── details (JSONB)
└── timestamp (TIMESTAMP)

settings
├── key (TEXT PRIMARY KEY)
├── value (JSONB)
└── updated_at (TIMESTAMP)
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│         API Key Management              │
├─────────────────────────────────────────┤
│ Environment Variables (Server-side)     │
│ ├── OPENAI_API_KEY                      │
│ ├── SUPABASE_KEY                        │
│ ├── WHATSAPP_API_KEY                    │
│ └── Never exposed to frontend           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      WhatsApp Security Isolation        │
├─────────────────────────────────────────┤
│ ✓ Separate Business Account             │
│ ✓ Scoped Permissions (authorized groups)│
│ ✓ No access to personal chats           │
│ ✓ Audit logs for all messages           │
│ ✓ Rate limiting enabled                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      Database Security                  │
├─────────────────────────────────────────┤
│ ✓ Encrypted connections (SSL/TLS)       │
│ ✓ Row-level security policies           │
│ ✓ Automatic backups                     │
│ ✓ Access logs                           │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
GitHub Repository
    ↓
    ├─→ Vercel (Frontend)
    │   ├── Auto-deploy on push
    │   ├── CDN distribution
    │   └── URL: https://your-app.vercel.app
    │
    └─→ Railway (Backend)
        ├── Auto-deploy on push
        ├── 24/7 uptime
        └── URL: https://your-app.railway.app
```

## Scalability Considerations

### Current Capacity
- 500MB database (Supabase free)
- ~5,000 scholarships
- 500 hours/month compute (Railway)

### Scaling Path
1. **Phase 1:** Increase scraping sources
2. **Phase 2:** Upgrade to Supabase Pro ($25/mo)
3. **Phase 3:** Add more AI agents
4. **Phase 4:** Implement caching layer
5. **Phase 5:** Multi-region deployment
