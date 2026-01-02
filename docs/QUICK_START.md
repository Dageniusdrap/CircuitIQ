# 🎯 Quick Start - Neon Database Configuration

## ✅ Database Setup Completed!

Your **Neon PostgreSQL database** has been successfully configured and the schema has been pushed to the database.

---

## 🔑 What's Been Done

1. ✅ **Prisma Client Generated** - Your ORM is ready to use
2. ✅ **Database Schema Pushed** - All tables created in Neon
3. ✅ **Connection Verified** - Successfully connected to Neon database

### Database Tables Created:
- User, Account, Session, VerificationToken
- Subscription, PasswordResetToken
- Diagram, Component, ComponentConnection
- Analysis, Measurement
- FailureMode, TestProcedure
- SystemIntegration, ActivityLog
- ConfirmedFix, TSB, PartSource
- Feedback

---

## 📝 Next Steps

### 1. **Configure Environment Variables Locally**

You need to create a `.env.local` file with the following content:

```bash
# Neon Database
DATABASE_URL="postgresql://neondb_owner:npg_yYJWmB3bMrG4@ep-quiet-water-ad5lxodr-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# UploadThing (for file uploads)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# AI Services (Choose one or both)
OPENAI_API_KEY="your-openai-api-key"
# OR
GEMINI_API_KEY="your-gemini-api-key"
```

**Quick Setup Option:**
```bash
./setup-database.sh
```

---

### 2. **Configure Vercel Environment**

Add the DATABASE_URL to your Vercel project:

**Go to:** https://vercel.com/dradrigas-projects/circuit-iq/settings/environment-variables

**Add variable:**
```
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_yYJWmB3bMrG4@ep-quiet-water-ad5lxodr-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

Apply to:
- ✅ Production
- ✅ Preview  
- ✅ Development

Then **redeploy** your application.

---

### 3. **Generate NextAuth Secret**

Generate a secure secret for NextAuth:

```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and use it as your `NEXTAUTH_SECRET` value.

---

### 4. **Get API Keys**

#### **UploadThing (File Uploads)**
1. Go to: https://uploadthing.com
2. Create an account / Sign in
3. Create a new app
4. Copy your `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`

#### **OpenAI (AI Analysis)**
1. Go to: https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it as your `OPENAI_API_KEY`

#### **OR Google Gemini (Alternative AI)**
1. Go to: https://makersuite.google.com/app/apikey
2. Create API key
3. Copy it as your `GEMINI_API_KEY`

---

### 5. **Start Development Server**

```bash
npm run dev
```

Then visit:
- Dashboard: http://localhost:3000/dashboard
- Upload: http://localhost:3000/upload
- Register: http://localhost:3000/register

---

## 🛠️ Useful Commands

### **View Database in Browser**
```bash
npx prisma studio
```
Opens at: http://localhost:5555

### **Connect to Database via psql**
```bash
psql 'postgresql://neondb_owner:npg_yYJWmB3bMrG4@ep-quiet-water-ad5lxodr-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
```

### **Regenerate Prisma Client**
```bash
npx prisma generate
```

### **View Database Schema**
```bash
npx prisma db pull
```

### **Reset Database (CAUTION)**
```bash
npx prisma db push --force-reset
```

---

## 🔒 Security Notes

### ✅ Already Secure:
- Connection pooling enabled (`-pooler`)
- SSL/TLS encryption (`sslmode=require`)
- Channel binding for extra security

### 🚨 Important:
1. **Never commit `.env.local`** to version control
2. **Regularly rotate** your database password
3. **Use different databases** for dev/staging/production
4. **Keep API keys secret** and rotate them periodically

---

## 📊 Database Connection Info

- **Provider:** Neon PostgreSQL
- **Region:** US East (N. Virginia) - `c-2.us-east-1`
- **Connection Type:** Pooled (Serverless-optimized)
- **Database Name:** `neondb`
- **SSL:** Required ✅

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"
```bash
# Test connection
npx prisma db pull

# Verify DATABASE_URL in your environment
echo $DATABASE_URL
```

### Error: "Schema sync failed"
```bash
npx prisma generate
npx prisma db push
```

### Error: "SSL connection error"
Make sure your DATABASE_URL includes:
```
?sslmode=require
```

---

## 📚 Resources

- **Neon Docs:** https://neon.tech/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth Docs:** https://next-auth.js.org
- **UploadThing Docs:** https://uploadthing.com/docs

---

## ✨ You're All Set!

Your CircuitIQ application is now connected to your Neon database and ready for development! 🎉

**Next:** Set up your environment variables and start the dev server!
