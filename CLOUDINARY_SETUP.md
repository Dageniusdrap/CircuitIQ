# 🎨 CLOUDINARY SETUP GUIDE

**Date**: Jan 10, 2026  
**Purpose**: PDF to Image conversion for AI analysis

---

## 📋 **QUICK SETUP (5 minutes)**

### **1. Create Cloudinary Account**

Visit: https://cloudinary.com/users/register_free

**Fill out:**
- Email
- Password
- Cloud name (remember this!)

**No credit card needed!**

---

### **2. Get Your Credentials**

After signing up:

1. Go to **Dashboard**
2. Find these values:
   - **Cloud Name**: (e.g., "your-cloud-name")
   - **API Key**: (e.g., "123456789012345")
   - **API Secret**: (e.g., "abcdefghijklmnopqrstuvwxyz")

---

### **3. Add to `.env.local`**

Add these three lines:

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME="circuitiq-cloud"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefGHIJKLmnopQRST"
```

---

### **4. Restart Server**

```bash
# Kill current server
Ctrl+C

# Restart
npm run dev
```

---

## ✅ **VERIFICATION**

After setup, Cloudinary will:

1. **Convert PDFs automatically**
   - Upload PDF → Cloudinary converts to JPG
   - Returns image URL

2. **Serve via CDN**
   - Fast delivery worldwide
   - No server load

3. **Free tier includes:**
   - 25,000 transformations/month
   - Perfect for CircuitIQ!

---

## 🔗 **DASHBOARD ACCESS**

View your uploads:
https://console.cloudinary.com/

---

## 🎯 **READY?**

Once you've added the credentials to `.env.local`, tell me and I'll finish the integration!
