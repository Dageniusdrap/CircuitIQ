# Environment Setup Guide

This guide helps you configure the environment variables needed for CircuitIQ.

## 🔧 Required Setup

### 1. **Database Connection** (CRITICAL)

Your `.env.local` file needs the Neon database connection string.

**Get your connection string:**
1. Go to [Neon Console](https://console.neon.tech)
2. Select your CircuitIQ project
3. Click "Connection string" 
4. Copy the connection string

**Add to `.env.local`:**
```bash
DATABASE_URL="postgresql://[user]:[password]@ep-raspy-sound-ad2qijow-pooler.us-east-1.aws.neon.tech/[database]?sslmode=require"
```

### 2. **NextAuth Configuration** (CRITICAL)

Generate a secret for authentication:

```bash
# Generate a random secret
openssl rand -base64 32
```

**Add to `.env.local`:**
```bash
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. **OpenAI API Key** (Required for AI features)

Get from: https://platform.openai.com/api-keys

**Add to `.env.local`:**
```bash
OPENAI_API_KEY="sk-..."
```

### 4. **UploadThing** (Required for file uploads)

Get from: https://uploadthing.com/dashboard

**Add to `.env.local`:**
```bash
UPLOADTHING_SECRET="sk_..."
UPLOADTHING_APP_ID="..."
```

## 📋 Complete `.env.local` Template

Your `.env.local` file should look like this:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="sk-..."

# UploadThing
UPLOADTHING_SECRET="sk_..."
UPLOADTHING_APP_ID="..."
```

## 🚀 After Configuration

Once your `.env.local` is configured, run:

```bash
# 1. Push the database schema
npx prisma db push

# 2. Seed the demo accounts
npx prisma db seed

# 3. Restart the dev server
npm run dev
```

## 🎯 Demo Accounts

After seeding, you'll have these test accounts:

| Account | Email | Password | Plan |
|---------|-------|----------|------|
| Demo User | demo@circuitiq.com | Demo123! | FREE |
| Test Engineer | test@circuitiq.com | TestUser123! | PROFESSIONAL |
| Admin User | admin@circuitiq.com | Admin123! | ENTERPRISE |

## ✅ Verification

Test the setup:
1. Navigate to http://localhost:3000/login
2. Click "Demo User" button
3. Should redirect to dashboard

## 🐛 Troubleshooting

### "Can't reach database server"
- Check your DATABASE_URL is correct
- Verify your Neon database is running
- Check your internet connection

### "Invalid credentials" on demo login
- Database hasn't been seeded yet
- Run `npx prisma db seed`

### "PrismaClientInitializationError"
- DATABASE_URL is missing or incorrect
- Check `.env.local` exists and has the DATABASE_URL

## 📝 Notes

- Never commit `.env.local` to git (it's in .gitignore)
- Use different DATABASE_URL for production (set in Vercel)
- Rotate NEXTAUTH_SECRET for production
