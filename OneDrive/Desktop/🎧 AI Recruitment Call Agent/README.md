# AI Recruitment Call Agent Dashboard

A Next.js dashboard for managing and visualizing AI-powered recruitment call data.

## Features

- 📊 **Dashboard Overview** - Key metrics and recent candidates
- 👥 **Candidates Management** - View, filter, and search candidates
- 📈 **Analytics** - Trends, skills distribution, and country preferences
- ⚙️ **Settings** - Configure AI assistant and webhook integration
- 🔒 **Secure** - Encrypted API keys and webhook signature verification

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Neon (Serverless PostgreSQL)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Neon database account
- AI voice assistant with webhook support

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

1. Navigate to Settings page
2. Click "Initialize Database" to create tables
3. Configure your assistant ID and API key

### Webhook Configuration

After saving settings, copy the webhook URL and configure it in your AI assistant platform.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── candidates/       # Candidates pages
│   ├── analytics/        # Analytics page
│   ├── settings/         # Settings page
│   ├── layout.js         # Root layout
│   └── page.js           # Dashboard home
├── components/
│   ├── layout/           # Layout components
│   ├── ui/               # UI components
│   └── dashboard/        # Dashboard components
├── lib/
│   ├── api.js            # API client
│   ├── db.js             # Database functions
│   ├── crypto.js         # Encryption utilities
│   └── notifications.js  # Email notifications
└── hooks/                # Custom React hooks

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT
