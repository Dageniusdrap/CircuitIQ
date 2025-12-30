# 🔧 Database Connection Fix

## ⚠️ **CURRENT ISSUE**

Your application is trying to connect to a **PostgreSQL database** at `localhost:5432`, but the database server is **not running**.

**Error Message:**
```
Can't reach database server at `localhost:5432`
Please make sure your database server is running at `localhost:5432`.
```

---

## ✅ **SOLUTIONS** (Choose ONE)

### **Option 1: Start Your Local PostgreSQL Database** 🐘

If you have PostgreSQL installed locally:

```bash
# On macOS (using Homebrew):
brew services start postgresql@15

# Or manually:
pg_ctl -D /usr/local/var/postgres start

# Verify it's running:
psql -h localhost -p 5432 -U postgres
```

Then restart your Next.js app:
```bash
npm run dev
```

---

### **Option 2: Use Your Production Database** 🌐

If you want to use your **Vercel production database** instead:

1. **Get your production database URL:**
   - Go to https://vercel.com/dradrigas-projects/circuit-iq/settings/environment-variables
   - Copy the `DATABASE_URL` variable

2. **Update your local `.env` file:**
```bash
# Open .env file
nano .env.local

# Replace the DATABASE_URL with your production URL:
DATABASE_URL="your-production-database-url-here"
```

3. **Restart the dev server:**
```bash
npm run dev
```

---

### **Option 3: Set Up a New Database** 🆕

If you don't have a database set up yet:

#### **Using Supabase (Free, Recommended):**

1. **Go to Supabase:** https://supabase.com
2. **Create a new project:**
   - Name: `CircuitIQ`
   - Database password: (create a strong password)
   - Region: Choose closest to you
   
3. **Get your connection string:**
   - Go to Project Settings → Database
   - Copy the "Connection string" (choose "Session pooling")
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres`

4. **Update `.env.local`:**
```bash
DATABASE_URL="your-supabase-connection-string-here"
```

5. **Run migrations:**
```bash
npx prisma migrate deploy
npx prisma generate
```

6. **Restart:**
```bash
npm run dev
```

---

#### **Using Railway (Free Tier):**

1. **Go to Railway:** https://railway.app
2. **Create a new project** → Add PostgreSQL
3. **Copy the connection string:**
   - Click on PostgreSQL service
   - Go to "Connect" tab
   - Copy "Postgres Connection URL"

4. **Update `.env.local`:**
```bash
DATABASE_URL="your-railway-connection-string-here"
```

5. **Run migrations:**
```bash
npx prisma migrate deploy
npx prisma generate
```

6. **Restart:**
```bash
npm run dev
```

---

## 🔍 **Check Your Current Database URL**

Run this to see what your app is trying to connect to:

```bash
# Look at your .env files
cat .env.local
cat .env
```

Look for the `DATABASE_URL` line.

---

## ✅ **After Fixing**

Once you have a running database:

1. **Restart the dev server:**
```bash
npm run dev
```

2. **Test the pages:**
   - Dashboard: http://localhost:3000/dashboard
   - Upload: http://localhost:3000/upload
   - Diagnostics: http://localhost:3000/diagnostics

3. **All new features will work:**
   - ✨ Upload progress tracking
   - 📚 Document widgets
   - 🎯 Diagram selectors
   - 🎨 Beautiful animations

---

## 📧 **Need Help?**

If you're unsure which option to choose:

- **For Development:** Option 3 (Supabase) - Free and easy
- **For Production:** Option 2 (Use your existing Vercel database)
- **For Local Development:** Option 1 (If you already have PostgreSQL)

---

## 🎯 **Quick Start (Recommended)**

**The fastest way to get running:**

1. Go to https://supabase.com/dashboard
2. Create new project
3. Get connection string
4. Update `.env.local`:
   ```bash
   DATABASE_URL="your-supabase-url"
   ```
5. Run:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npm run dev
   ```

**Done!** 🎉

---

## 🔗 Resources

- **Supabase Documentation:** https://supabase.com/docs/guides/database
- **Railway Documentation:** https://docs.railway.app/databases/postgresql
- **Prisma Documentation:** https://www.prisma.io/docs/getting-started

---

**Once your database is connected, all the new upload progress features will work perfectly!** ✨
