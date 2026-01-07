# AI Vision Troubleshooting Guide

## Current Status
The AI Teammate is unable to see wiring diagrams. Error message: "Having trouble loading that photo"

## Root Cause Analysis

The issue is likely one of these:

### 1. **Image URL Format Issue**
Vercel Blob URLs might not be directly compatible with OpenAI's vision API.
- Blob URLs: `https://[random].public.blob.vercel-storage.com/filename`
- These URLs may have access restrictions or format issues

### 2. **PDF vs Image**
If diagrams are uploaded as PDF files, OpenAI vision cannot read PDFs directly.
- Solution: Convert PDF to image OR extract first page as image

### 3. **API Key Permissions**
The OpenAI API key might not have vision access enabled.

## Quick Tests

### Test 1: Check what file type is being uploaded
```bash
# In browser console on diagnostics page:
const iframe = document.querySelector('iframe');
console.log('Diagram URL:', iframe?.src);
```

### Test 2: Test vision API directly
```bash
# Use the new test endpoint:
curl -X POST http://localhost:3000/api/test-vision \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "YOUR_DIAGRAM_URL_HERE"}'
```

## Solutions

### Solution 1: If Files are PDFs
Update upload to convert PDF to image on upload:
1. Install pdf-to-image package
2. Convert first page to PNG on upload
3. Store both PDF (for download) and PNG (for vision)

### Solution 2: Force Image Uploads Only
Update upload validation to only accept PNG/JPG:
```typescript
const validTypes = ['image/png', 'image/jpeg', 'image/jpg']; // Remove PDF
```

### Solution 3: Use Base64 Encoding
Instead of URL, encode image as base64:
```typescript
// Fetch image and convert to base64
const response = await fetch(imageUrl);
const buffer = await response.arrayBuffer();
const base64 = Buffer.from(buffer).toString('base64');
const dataUrl = `data:image/png;base64,${base64}`;

// Pass dataUrl to vision API
```

## Testing Steps

1. **Check Current File Types**
   - Go to /diagrams
   - Check what file types you've uploaded
   - If PDFs: They won't work with vision

2. **Upload a PNG/JPG Test**
   - Upload a screenshot of a wiring diagram (PNG)
   - Try AI vision with that
   - If it works: PDF is the problem

3. **Check API Console**
   - Restart dev server
   - Try asking AI about diagram
   - Check terminal for errors
   - Look for "Vision API Error:" logs

## Next Steps for User

Please do this:
1. Check what file type your diagrams are (PDF or image?)
2. If PDF: Upload a PNG/JPG screenshot of a diagram
3. Test if AI can see the PNG/JPG version
4. Report back what you find

This will help us identify the exact issue!
