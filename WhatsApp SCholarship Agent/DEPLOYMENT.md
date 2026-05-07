# 🚀 Deployment Guide - WhatsApp Scholarship Agent

This guide covers deployment options for the WhatsApp Scholarship Agent System.

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 18+ installed
- ✅ PostgreSQL database (or Supabase account)
- ✅ OpenAI API key
- ✅ WhatsApp Business API access or personal WhatsApp account
- ✅ Telegram Bot Token (optional)
- ✅ Domain name (optional, for production)

## 🎯 Deployment Options

### Option 1: Local Development

Perfect for testing and development.

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd "WhatsApp SCholarship Agent"

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# 4. Setup database
psql -U postgres -d scholarship_db -f database/schema.sql

# 5. Run the system
npm run dev
```

### Option 2: DigitalOcean App Platform

Deploy with one click to DigitalOcean.

**Step 1: Prepare your repository**
```bash
git add .
git commit -m "Ready for deployment"
git push origin master
```

**Step 2: Create App on DigitalOcean**

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository
4. Configure:
   - **Name**: whatsapp-scholarship-agent
   - **Region**: Choose closest to your users
   - **Plan**: Basic ($5/month)

**Step 3: Configure Environment Variables**

Add these in the App Platform dashboard:

```env
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=sk-your-openai-key
WHATSAPP_GROUP_ID=your-group-id@g.us
TELEGRAM_BOT_TOKEN=your-telegram-token
TELEGRAM_CHAT_ID=your-chat-id
NODE_ENV=production
```

**Step 4: Add Database**

1. Create a managed PostgreSQL database
2. Copy the connection string
3. Run schema.sql on the database

**Step 5: Deploy**

Click "Deploy" and wait for the build to complete.

### Option 3: AWS EC2

Deploy on AWS for full control.

**Step 1: Launch EC2 Instance**

```bash
# Choose Ubuntu 22.04 LTS
# Instance type: t2.small or larger
# Configure security group: Allow ports 22, 80, 443, 3000
```

**Step 2: Connect and Setup**

```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2
```

**Step 3: Setup Application**

```bash
# Clone repository
git clone <your-repo-url>
cd "WhatsApp SCholarship Agent"

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit with your credentials

# Setup database
sudo -u postgres psql
CREATE DATABASE scholarship_db;
\q
psql -U postgres -d scholarship_db -f database/schema.sql
```

**Step 4: Start with PM2**

```bash
# Start the application
pm2 start src/index.js --name scholarship-agent

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

**Step 5: Setup Nginx (Optional)**

```bash
# Install Nginx
sudo apt install -y nginx

# Configure reverse proxy
sudo nano /etc/nginx/sites-available/scholarship-agent

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/scholarship-agent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 4: Heroku

Quick deployment to Heroku.

**Step 1: Install Heroku CLI**

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login
```

**Step 2: Create Heroku App**

```bash
# Create app
heroku create whatsapp-scholarship-agent

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set OPENAI_API_KEY=sk-your-key
heroku config:set WHATSAPP_GROUP_ID=your-group-id
heroku config:set TELEGRAM_BOT_TOKEN=your-token
heroku config:set NODE_ENV=production
```

**Step 3: Create Procfile**

```bash
echo "web: node src/index.js" > Procfile
```

**Step 4: Deploy**

```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku master

# Run database migrations
heroku pg:psql < database/schema.sql
```

### Option 5: Docker Deployment

Containerized deployment for any platform.

**Step 1: Create Dockerfile**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
```

**Step 2: Create docker-compose.yml**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/scholarship_db
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - WHATSAPP_GROUP_ID=${WHATSAPP_GROUP_ID}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=scholarship_db
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    restart: unless-stopped

volumes:
  postgres_data:
```

**Step 3: Deploy**

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 🔐 Security Checklist

Before going to production:

- [ ] Use strong database passwords
- [ ] Enable SSL for database connections
- [ ] Store API keys in environment variables (never commit)
- [ ] Enable firewall on your server
- [ ] Use HTTPS for API endpoints
- [ ] Regularly update dependencies
- [ ] Setup monitoring and alerts
- [ ] Backup database regularly
- [ ] Limit API rate limits
- [ ] Use WhatsApp Business API (not personal account) for production

## 📊 Monitoring

### Health Check

```bash
curl http://your-domain.com/health
```

### View Logs

```bash
# PM2
pm2 logs scholarship-agent

# Docker
docker-compose logs -f app

# Heroku
heroku logs --tail
```

### Database Monitoring

```bash
# Check statistics
curl http://your-domain.com/api/stats

# View recent logs
curl http://your-domain.com/api/logs
```

## 🔄 Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin master

# Install dependencies
npm install

# Restart application
pm2 restart scholarship-agent
```

### Database Backup

```bash
# Backup database
pg_dump scholarship_db > backup_$(date +%Y%m%d).sql

# Restore database
psql scholarship_db < backup_20260504.sql
```

### Clear Old Logs

```bash
# Delete logs older than 30 days
psql scholarship_db -c "DELETE FROM agent_logs WHERE created_at < NOW() - INTERVAL '30 days'"
```

## 🆘 Troubleshooting

### WhatsApp Not Connecting

1. Delete `whatsapp-session` folder
2. Restart application
3. Scan QR code again

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check if tables exist
\dt
```

### API Rate Limits

- OpenAI: 3 requests per minute (free tier)
- Adjust `SCRAPE_INTERVAL_HOURS` to avoid limits

### Memory Issues

- Increase server RAM
- Reduce `MAX_SCHOLARSHIPS_PER_DAY`
- Use smaller OpenAI model (gpt-3.5-turbo)

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Email: support@example.com

---

**🎉 Congratulations! Your Scholarship Agent is now deployed!**
