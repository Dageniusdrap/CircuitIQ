# 🔧 UPLOAD SYSTEM - DIAGNOSIS & FIX PLAN

**Date**: Jan 9, 2026  
**Status**: Investigating and fixing  
**Priority**: CRITICAL 🔥

---

## 🔍 **DIAGNOSIS**

### **Known Issues:**
1. Upload API returns HTML error pages instead of JSON
2. "Unexpected token '<', '<!DOCTYPE'..." error in frontend
3. PDF conversion may be failing silently

### **Possible Causes:**
1. ❓ PDF.js legacy build not working in production
2. ❓ Vercel Blob token invalid or expired
3. ❓ Database connection issues
4. ❓ Memory limits for PDF conversion
5. ❓ Missing dependencies

---

## ✅ **VERIFIED WORKING:**

- [x] Environment variables set correctly
  - OPENAI_API_KEY: ✅ Present
  - BLOB_READ_WRITE_TOKEN: ✅ Present
- [x] PDF converter code updated to legacy build
- [x] Error handling added for usage limits
- [x] Canvas integration fixed

---

## 🧪 **TESTING STRATEGY:**

### **Phase 1: Isolate the Problem**

**Test 1: Simple Upload** (`/api/test-upload`)
- Created minimal upload endpoint
- No PDF conversion
- No database writes
- Just upload to Blob

**Expected**: Should work ✅  
**If Fails**: Vercel Blob issue

**Test 2: Database Write**
- Upload + Save to database
- No PDF conversion
- Test with image file

**Expected**: Should work ✅  
**If Fails**: Database issue

**Test 3: PDF Conversion**
- Test PDF.js separately
- Convert local PDF file
- Check for errors

**Expected**: May fail  
**If Fails**: PDF.js legacy build issue

### **Phase 2: Fix Each Issue**

**Fix 1: Vercel Blob**
```typescript
// Verify token is valid
// Test upload with simple file
// Check Vercel dashboard for errors
```

**Fix 2: PDF Conversion**
```typescript
// Option A: Use PDF.js legacy correctly
// Option B: Use external service (PDF.co)
// Option C: Skip conversion, use original PDF
```

**Fix 3: Database**
```typescript
// Verify Prisma client generated
// Check connection string
// Test direct query
```

---

## 🛠️ **FIX IMPLEMENTATION:**

### **Option A: Simplify Upload (Recommended)**

**Remove complexity, get it working:**

1. Upload file directly to Vercel Blob ✅
2. Save to database ✅
3. Skip PDF conversion for now
4. Add conversion as background job later

**Pros:**
- Faster uploads
- More reliable
- Easier to debug
- Can add features later

**Cons:**
- AI can't analyze PDFs immediately
- Need to add background processing

### **Option B: Fix PDF Conversion**

**Deep dive into PDF.js:**

1. Test PDF.js in isolation
2. Try different builds
3. Add more error logging
4. Increase memory limits

**Pros:**
- Feature-complete solution
- PDFs work immediately

**Cons:**
- More complex
- Harder to debug
- May have performance issues

### **Option C: Hybrid Approach** (BEST)

**Upload works immediately, conversion happens async:**

1. Upload file ✅
2. Save to database ✅
3. Return success immediately
4. Queue PDF conversion job
5. Update database when done

**Pros:**
- Fast user experience
- Reliable uploads
- Full features eventually
- Scalable

**Cons:**
- Requires job queue
- Slightly more complex

---

## 🎯 **RECOMMENDED APPROACH:**

### **Immediate Fix** (Option A):

1. **Simplify upload endpoint**
   - Remove PDF conversion from main upload
   - Just upload + save to database
   - Return success immediately

2. **Test thoroughly**
   - Upload image files
   - Upload PDF files
   - Verify database records

3 **Add background processing later**
   - Implement job queue
   - Process PDFs asynchronously
   - Update records when complete

---

## 📝 **ACTION PLAN:**

### **Step 1: Create Simple Upload Version** ✅
```typescript
// POST /api/upload
// - Authenticate
// - Upload to Blob
// - Save to database
// - Return success
// NO PDF conversion
```

### **Step 2: Test With Real Files**
- Upload PNG/JPG
- Upload PDF
- Verify in database
- Check Blob storage

### **Step 3: Add PDF Conversion Later**
```typescript
// POST /api/ convert-pdf
// - Get diagram ID
// - Download PDF from Blob
// - Convert to PNG
// - Upload PNG
// - Update database
```

###Step 4: Verify All Features**
- Wire tracing (needs image URL)
- AI analysis (needs image URL)
- Diagnostics (needs diagram)

---

## 🚀 **LET'S FIX IT NOW:**

### **Immediate Actions:**

1. Create simplified upload endpoint
2. Remove PDF conversion temporarily
3. Test with simple files
4. Verify database saves
5. Confirm frontend works

### **Testing Checklist:**

- [ ] Upload image file (PNG/JPG)
- [ ] Upload PDF file
- [ ] Check database for records
- [ ] Verify Blob storage
- [ ] Test frontend shows upload
- [ ] Try diagnostics with diagram
- [ ] Test wire tracing

---

## 💡 **DECISION:**

**I recommend Option C (Hybrid)**:

**Now**: Simple, reliable uploads  
**Later**: Background PDF conversion  
**Result**: Best of both worlds

---

**Ready to implement?** Let's build the simplified upload first!
