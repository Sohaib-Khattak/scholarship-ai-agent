#!/bin/bash

# Scholarship Agent Setup Script

echo "🎓 Scholarship Agent - Setup Script"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env in backend folder"
echo "2. Fill in your API keys"
echo "3. Run: npm run dev"
echo ""
echo "For detailed setup instructions, see SETUP.md"
