# 🔴 Database Connection Issue - Quick Fix Guide

**Current Error:**
```
Can't reach database server at ep-raspy-sound-ad2qijow-pooler.us-east-1.aws.neon.tech:5432
```

## 🎯 **What You Need to Do**

### **Step 1: Check Your Neon Database**

1. **Go to Neon Console:** https://console.neon.tech
2. **Log in** to your account
3. **Find your CircuitIQ project**

### **Step 2: Check Database Status**

Your database might be:
- ⏸️ **Paused** (Neon free tier auto-pauses after inactivity)
- 🗑️ **Deleted** (check if project still exists)
- 🔄 **Changed** (connection string might have been regenerated)

**If paused:** It should auto-resume when you try to connect, but may need a moment

**If deleted/changed:** You'll need to create a new database or get the updated connection string

### **Step 3: Get the Correct Connection String**

1. In Neon Console, select your CircuitIQ project
2. Click on the **"Connection string"** button/tab
3. Make sure **"Prisma"** is selected (format selector)
4. Click **"Copy"** to copy the full connection string

It should look like:
```
postgresql://[username]:[password]@[host].neon.tech/[database]?sslmode=require
```

### **Step 4: Update Your `.env.local` File**

1. **Open** `/Users/dradrigapatrick/Desktop/CircuitIQ/.env.local` in your editor
2. **Find** the line starting with `DATABASE_URL=`
3. **Replace** it with your new connection string from Neon
4. **Save** the file

Example:
```bash
DATABASE_URL="postgresql://neondb_owner:npg_abc123xyz@ep-raspy-sound-ad2qijow-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### **Step 5: Test the Connection**

```bash
# Test if Prisma can connect
npx prisma db push

# If successful, seed the demo accounts
npx prisma db seed
```

## 🆕 **Alternative: Create a New Neon Database**

If your original database is gone or you want to start fresh:

### **Create New Database:**

1. Go to https://console.neon.tech
2. Click **"New Project"**
3. Name it **"CircuitIQ"**
4. Select region (closest to you)
5. Click **"Create Project"**

### **Get Connection String:**

1. Once created, copy the **Prisma connection string**
2. Update your `.env.local` with this new string

### **Initialize:**

```bash
# Push the schema to create tables
npx prisma db push

# Seed demo accounts
npx prisma db seed

# Restart dev server
npm run dev
```

## ✅ **Success Checklist**

After fixing, you should be able to:
- [ ] Run `npx prisma db push` without errors
- [ ] Run `npx prisma db seed` successfully
- [ ] See demo accounts created
- [ ] Click "Demo User" on login page
- [ ] Get redirected to dashboard

## 🚨 **Still Having Issues?**

### Check These:

1. **Internet Connection:** Can you access neon.tech in browser?
2. **Firewall:** Is PostgreSQL port 5432 blocked?
3. **VPN:** Try disabling VPN if you're using one
4. **Neon Status:** Check https://neon.tech/status

### Get More Info:

```bash
# Check what environment variables are loaded
npx prisma -v

# This shows which DATABASE_URL Prisma is using
```

## 📋 **What I've Created for You**

- ✅ `/docs/ENVIRONMENT_SETUP.md` - Complete environment setup guide
- ✅ This troubleshooting guide
- ✅ All documentation is ready

**Next:** Once your DATABASE_URL is updated, we can seed the database and the demo login will work! 🎉
