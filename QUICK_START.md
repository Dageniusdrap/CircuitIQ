# 🚀 CircuitIQ Quick Start - Get Demo Login Working

**Goal:** Get the demo login buttons working so you can test CircuitIQ

**Time Needed:** ~5 minutes

---

## 🎯 **The Issue**

When you click "Demo User" on the login page, you get "Invalid credentials" because:
- The demo user accounts don't exist in your database yet
- They need to be "seeded" (created automatically)

## ✅ **The Fix (3 Steps)**

### **Step 1: Update Database Connection**

Your database connection might be outdated or the database might be paused.

**Action:**
1. Open https://console.neon.tech
2. Find your CircuitIQ project
3. Copy the **Prisma connection string**
4. Open `.env.local` in CircuitIQ folder
5. Update the `DATABASE_URL=` line with your connection string
6. Save the file

### **Step 2: Push Database Schema**

This creates all the tables in your database.

```bash
cd /Users/dradrigapatrick/Desktop/CircuitIQ
npx prisma db push
```

**Expected output:** ✅ "The database is now in sync with your Prisma schema"

### **Step 3: Seed Demo Accounts**

This creates the three demo user accounts.

```bash
npx prisma db seed
```

**Expected output:**
```
✅ Created demo user: demo@circuitiq.com
✅ Created test user: test@circuitiq.com
✅ Created admin user: admin@circuitiq.com
```

---

## 🎉 **Test It**

1. Go to http://localhost:3000/login
2. Click the **"Demo User"** button
3. You should be redirected to the dashboard!

---

## 🐛 **Troubleshooting**

### "Can't reach database server"
→ See `DATABASE_CONNECTION_FIX.md` for detailed fix

### "Invalid credentials" after seeding
→ Try restarting the dev server:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Need help?
→ Check these guides:
- `/docs/ENVIRONMENT_SETUP.md` - Full environment setup
- `DATABASE_CONNECTION_FIX.md` - Database connection troubleshooting
- `CRITICAL_BUGS.md` - Known issues and fixes

---

## 📝 **Demo Account Credentials**

After seeding, you'll have:

| Button | Email | Password | Plan |
|--------|-------|----------|------|
| Demo User | demo@circuitiq.com | Demo123! | FREE |
| Test Engineer | test@circuitiq.com | TestUser123! | PROFESSIONAL |
| Admin User | admin@circuitiq.com | Admin123! | ENTERPRISE |

---

**That's it!** Once you complete these 3 steps, the demo login will work and you can start testing CircuitIQ. 🚀
