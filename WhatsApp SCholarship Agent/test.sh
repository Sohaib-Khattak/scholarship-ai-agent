#!/bin/bash

# Test Script for WhatsApp Scholarship Agent
# Run this to verify the system is working correctly

echo "🧪 WhatsApp Scholarship Agent - Test Suite"
echo "==========================================="
echo ""

# Check if npm packages are installed
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found. Run: npm install"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check .env file
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copy from .env.example"
    echo "Run: cp .env.example .env"
    exit 1
fi

echo "✅ .env file exists"
echo ""

# Test database connection (if configured)
if grep -q "DATABASE_URL=" .env; then
    source .env
    if [ ! -z "$DATABASE_URL" ]; then
        echo "Testing database connection..."
        if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
            echo "✅ Database connection successful"
        else
            echo "⚠️  Cannot connect to database"
        fi
    fi
fi

echo ""
echo "📝 Project Files Check:"
echo "======================="

FILES=(
    "src/index.js"
    "src/agents/scholarshipHunter.js"
    "src/agents/opportunityValidator.js"
    "src/agents/contentFormatter.js"
    "src/agents/publisherBot.js"
    "src/database/db.js"
    "src/utils/logger.js"
    "src/utils/scheduler.js"
    "database/schema.sql"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        LINES=$(wc -l < "$file")
        echo "✅ $file ($LINES lines)"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "📚 Documentation Check:"
echo "======================="

DOCS=(
    "README.md"
    "QUICKSTART.md"
    "SETUP.md"
    "DEPLOYMENT.md"
    "ARCHITECTURE.md"
    "API.md"
    "CONTRIBUTING.md"
    "PROJECT_COMPLETE.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ $doc"
    else
        echo "❌ $doc missing"
    fi
done

echo ""
echo "🎉 Test Complete!"
echo ""
echo "Next steps:"
echo "1. Configure .env with your API keys"
echo "2. Setup database: psql scholarship_db < database/schema.sql"
echo "3. Run: npm start"
echo ""
