#!/bin/bash

# CircuitIQ Database Setup Script
# This script helps you configure your Neon database connection

echo "🚀 CircuitIQ Database Setup"
echo "============================"
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled. No changes made."
        exit 1
    fi
fi

echo "📝 Creating .env.local file..."

# Create .env.local with Neon database URL
cat > .env.local << 'EOF'
# ============================================
# DATABASE (Neon PostgreSQL)
# ============================================
DATABASE_URL="postgresql://neondb_owner:npg_yYJWmB3bMrG4@ep-quiet-water-ad5lxodr-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# ============================================
# NEXTAUTH (Authentication)
# ============================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="CHANGE_THIS_TO_A_RANDOM_SECRET"

# ============================================
# UPLOADTHING (File Uploads)
# ============================================
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# ============================================
# AI SERVICES
# ============================================
# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# OR Google Gemini
GEMINI_API_KEY="your-gemini-api-key"
EOF

echo "✅ .env.local file created!"
echo ""
echo "⚠️  IMPORTANT: You need to update the following values:"
echo "   - NEXTAUTH_SECRET (generate a random secret)"
echo "   - UPLOADTHING_SECRET and UPLOADTHING_APP_ID"
echo "   - OPENAI_API_KEY or GEMINI_API_KEY"
echo ""
echo "📊 Setting up database schema..."

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

echo ""
echo "✅ Database setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Update .env.local with your API keys"
echo "   2. Run: npm run dev"
echo "   3. Visit: http://localhost:3000"
echo ""
echo "🔗 For Vercel deployment:"
echo "   - Go to: https://vercel.com/dradrigas-projects/circuit-iq/settings/environment-variables"
echo "   - Add DATABASE_URL with the same Neon connection string"
echo ""
