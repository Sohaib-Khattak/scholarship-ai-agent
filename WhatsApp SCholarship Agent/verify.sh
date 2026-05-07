#!/bin/bash

# Verification Script for WhatsApp Scholarship Agent
# This script checks if all components are properly set up

echo "🔍 WhatsApp Scholarship Agent - Verification Script"
echo "===================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Check Node.js
echo "📋 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check npm
echo ""
echo "📋 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check PostgreSQL
echo ""
echo "📋 Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    echo -e "${GREEN}✅ PostgreSQL installed: $PSQL_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL not found (you can use Supabase instead)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check project files
echo ""
echo "📁 Checking project files..."

FILES=(
    "package.json"
    ".env.example"
    ".gitignore"
    "README.md"
    "SETUP.md"
    "DEPLOYMENT.md"
    "ARCHITECTURE.md"
    "database/schema.sql"
    "src/index.js"
    "src/agents/scholarshipHunter.js"
    "src/agents/opportunityValidator.js"
    "src/agents/contentFormatter.js"
    "src/agents/publisherBot.js"
    "src/database/db.js"
    "src/utils/logger.js"
    "src/utils/scheduler.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check .env file
echo ""
echo "🔑 Checking environment configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file exists${NC}"

    # Check required variables
    if grep -q "DATABASE_URL=" .env; then
        echo -e "${GREEN}  ✅ DATABASE_URL configured${NC}"
    else
        echo -e "${YELLOW}  ⚠️  DATABASE_URL not set${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi

    if grep -q "OPENAI_API_KEY=" .env; then
        echo -e "${GREEN}  ✅ OPENAI_API_KEY configured${NC}"
    else
        echo -e "${YELLOW}  ⚠️  OPENAI_API_KEY not set${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  .env file not found (copy from .env.example)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check node_modules
echo ""
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules exists${NC}"

    # Check key dependencies
    DEPS=("axios" "cheerio" "express" "openai" "pg" "puppeteer" "whatsapp-web.js" "telegraf")
    for dep in "${DEPS[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            echo -e "${GREEN}  ✅ $dep installed${NC}"
        else
            echo -e "${RED}  ❌ $dep missing${NC}"
            ERRORS=$((ERRORS + 1))
        fi
    done
else
    echo -e "${YELLOW}⚠️  node_modules not found (run: npm install)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check database connection (if .env exists)
echo ""
echo "🗄️  Checking database connection..."
if [ -f ".env" ] && grep -q "DATABASE_URL=" .env; then
    source .env
    if [ ! -z "$DATABASE_URL" ]; then
        if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
            echo -e "${GREEN}✅ Database connection successful${NC}"

            # Check if tables exist
            TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs)
            if [ "$TABLE_COUNT" -gt 0 ]; then
                echo -e "${GREEN}  ✅ Database tables exist ($TABLE_COUNT tables)${NC}"
            else
                echo -e "${YELLOW}  ⚠️  No tables found (run: psql \$DATABASE_URL -f database/schema.sql)${NC}"
                WARNINGS=$((WARNINGS + 1))
            fi
        else
            echo -e "${YELLOW}⚠️  Cannot connect to database${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "${YELLOW}⚠️  DATABASE_URL is empty${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  Skipping database check (DATABASE_URL not configured)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Summary
echo ""
echo "=================================================="
echo "📊 Verification Summary"
echo "=================================================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! System is ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure .env file with your API keys"
    echo "2. Run: npm start"
    echo "3. Scan WhatsApp QR code"
    echo "4. Start collecting scholarships!"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
    echo "Please review the warnings above."
    echo "The system may still work, but some features might be limited."
else
    echo -e "${RED}❌ $ERRORS error(s) and $WARNINGS warning(s) found${NC}"
    echo "Please fix the errors before running the system."
fi

echo ""
echo "For detailed setup instructions, see: SETUP.md"
echo ""

exit $ERRORS
