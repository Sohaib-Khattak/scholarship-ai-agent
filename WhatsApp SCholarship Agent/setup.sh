#!/bin/bash

# WhatsApp Scholarship Agent - Setup Script
# This script automates the initial setup process

set -e

echo "🎓 WhatsApp Scholarship Agent - Setup Script"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL not found locally${NC}"
    echo "You can use Supabase instead or install PostgreSQL"
else
    echo -e "${GREEN}✅ PostgreSQL detected${NC}"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env file with your credentials${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
fi

# Create necessary directories
echo ""
echo "📁 Creating directories..."
mkdir -p whatsapp-session
mkdir -p logs
echo -e "${GREEN}✅ Directories created${NC}"

# Database setup
echo ""
echo "🗄️  Database Setup"
echo "=================="
read -p "Do you want to setup the database now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter database name (default: scholarship_db): " DB_NAME
    DB_NAME=${DB_NAME:-scholarship_db}

    read -p "Enter PostgreSQL username (default: postgres): " DB_USER
    DB_USER=${DB_USER:-postgres}

    # Create database
    echo "Creating database..."
    createdb -U "$DB_USER" "$DB_NAME" 2>/dev/null || echo "Database may already exist"

    # Run schema
    echo "Running schema..."
    psql -U "$DB_USER" -d "$DB_NAME" -f database/schema.sql

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database setup complete${NC}"
    else
        echo -e "${RED}❌ Database setup failed${NC}"
        echo "You can run the schema manually: psql -U $DB_USER -d $DB_NAME -f database/schema.sql"
    fi
fi

# API Keys setup
echo ""
echo "🔑 API Keys Configuration"
echo "========================="
echo "You need the following API keys:"
echo "1. OpenAI API Key (required) - Get from https://platform.openai.com"
echo "2. Telegram Bot Token (optional) - Get from @BotFather on Telegram"
echo ""
echo -e "${YELLOW}Please update your .env file with these credentials${NC}"

# Summary
echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your credentials"
echo "2. Run 'npm start' to start the system"
echo "3. Scan WhatsApp QR code when prompted"
echo "4. Get your WhatsApp group ID"
echo "5. Update .env with WHATSAPP_GROUP_ID"
echo "6. Restart the system"
echo ""
echo "For detailed instructions, see SETUP.md"
echo ""
echo "🎉 Happy scholarship hunting!"
