# 🧪 TESTING GUIDE - CircuitIQ

**Purpose**: Verify all features work correctly  
**Time Required**: 15-20 minutes  
**Status**: Ready to test!

---

## 🎯 **WHAT TO TEST:**

1. Backend Integration & Usage Tracking
2. Usage Dashboard
3. Search Functionality
4. Limit Enforcement
5. Overall App Stability

---

## 📋 **PRE-TESTING CHECKLIST:**

- [ ] Server is running (`npm run dev`)
- [ ] Database is connected (Neon may need to wake up)
- [ ] `.env.local` has valid `OPENAI_API_KEY`
- [ ] Browser is open to `http://localhost:3001`

---

## 🧪 **TEST PLAN:**

### **TEST 1: Usage Dashboard** (3 min)

**Goal**: Verify usage dashboard displays correctly

**Steps:**
1. Navigate to `/dashboard`
2. Scroll to "Usage Overview" section
3. Verify you see:
   - Plan badge (FREE/PROFESSIONAL/ENTERPRISE)
   - Usage metrics with progress bars
   - Color coding (green/amber/red)
   - Numbers updating correctly

**Expected Result:**
- ✅ Dashboard loads
- ✅ Usage cards display
- ✅ Progress bars show
- ✅ Plan badge visible
- ✅ Upgrade button (if FREE plan)

**Screenshot**: Take a screenshot of usage dashboard

---

### **TEST 2: Upload with Limit Tracking** (4 min)

**Goal**: Verify upload tracks usage

**Steps:**
1. Go to `/upload`
2. Upload a circuit diagram (PDF or image)
3. Wait for upload to complete
4. Return to `/dashboard`
5. Check usage dashboard

**Expected Result:**
- ✅ Upload succeeds
- ✅ "Diagram Uploads" counter increases
- ✅ Progress bar updates
- ✅ If at limit (5 for FREE), shows warning

**Test Limit (FREE Plan only):**
6. Try uploading 6th diagram
7. Should see error: "Upload limit reached"

---

### **TEST 3: AI Analysis Tracking** (5 min)

**Goal**: Verify AI usage is tracked

**Steps:**
1. Go to `/diagnostics`
2. Select a diagram
3. Ask AI teammate a question:
   - "What components do you see in this diagram?"
4. Wait for response
5. Return to `/dashboard`
6. Check "AI Analyses" counter

**Expected Result:**
- ✅ AI responds
- ✅ "AI Analyses" counter increases
- ✅ Progress bar updates
- ✅ If at limit (3 for FREE), shows warning

**Test Limit (FREE Plan only):**
7. Try 4th AI analysis
8. Should see error: "AI analysis limit reached"

---

### **TEST 4: Search Functionality** (4 min)

**Goal**: Verify search works across content

**Steps:**
1. Navigate to `/search`
2. Type "electrical" in search box
3. Wait for results (300ms debounce)
4. Try different searches:
   - "hydraulic"
   - Your uploaded diagram name
   - "battery"

**Expected Result:**
- ✅ Search bar appears
- ✅ Results load quickly
- ✅ Shows diagrams AND procedures
- ✅ Result counts accurate
- ✅ Can click results to navigate

**Test Filters:**
5. Click "Diagrams" filter
6. Should only show diagrams
7. Click "Procedures" filter
8. Should only show procedures
9. Clear filters
10. Should show all results

---

### **TEST 5: Advanced Search Filters** (3 min)

**Goal**: Verify filtering works

**Steps:**
1. On `/search`
2. Click "Filters" button
3. Select "Aircraft" in Vehicle Type
4. Enter "Electrical" in System
5. Search for "power"

**Expected Result:**
- ✅ Filter panel opens
- ✅ Can select vehicle type
- ✅ Can enter system
- ✅ Results filter correctly
- ✅ Can clear all filters

---

### **TEST 6: Upgrade Flow** (2 min)

**Goal**: Verify upgrade prompts work

**Goal (FREE Plan only):**
1. Hit a usage limit
2. See upgrade prompt
3. Click "Upgrade Now"
4. Should navigate to `/pricing`

**Expected Result:**
- ✅ Upgrade button visible
- ✅ Helpful message shown
- ✅ Navigates to pricing
- ✅ Pricing page loads

---

## 🐛 **BUG REPORTING:**

If you find issues, note:

1. **What you were doing**
2. **What you expected**
3. **What actually happened**
4. **Error messages** (check browser console: F12)
5. **Screenshots** (if applicable)

---

## ✅ **SUCCESS CRITERIA:**

### **Must Work:**
- [x] Dashboard loads
- [x] Usage dashboard displays
- [x] Upload tracks usage
- [x] AI analysis tracks usage
- [x] Search returns results
- [x] Filters work
- [x] Limit enforcement works
- [x] Upgrade prompts show

### **Should Work:**
- [ ] All pages load without errors
- [ ] No console errors
- [ ] Smooth navigation
- [ ] Fast performance
- [ ] Responsive on mobile

---

## 📸 **SCREENSHOTS TO TAKE:**

1. Dashboard with usage cards
2. Usage warning at 80%
3. Limit reached error
4. Search results page
5. Filtered search results

---

## 🔧 **TROUBLESHOOTING:**

### **Database Connection Error:**
```
Can't reach database server
```
**Fix**: Neon database is asleep. Wait 30 seconds and refresh.

### **AI Vision Not Working:**
```
AI Configuration Error
```
**Fix**: Check `OPENAI_API_KEY` in `.env.local`

### **Upload Fails:**
```
Upload limit reached
```
**Expected**: You've hit the FREE plan limit of 5 uploads

### **Search Shows No Results:**
- Try different search terms
- Clear filters
- Check you have uploaded diagrams or browse procedures

---

## 🎯 **TESTING PRIORITIES:**

**High Priority:**
1.  Usage tracking accuracy
2. Limit enforcement
3. Search functionality

**Medium Priority:**
4. UI/UX quality
5. Performance
6. Error handling

**Low Priority:**
7. Edge cases
8. Mobile responsiveness
9. Accessibility

---

## 📝 **TEST LOG TEMPLATE:**

```markdown
## Test Session: [Date/Time]

### Tester: [Your Name]
### Browser: [Chrome/Firefox/Safari]
### Plan: [FREE/PROFESSIONAL/ENTERPRISE]

#### Tests Completed:
- [ ] Usage Dashboard
- [ ] Upload Tracking
- [ ] AI Analysis Tracking
- [ ] Search Functionality
- [ ] Filters
- [ ] Upgrade Flow

#### Issues Found:
1. [Description]
   - Severity: High/Medium/Low
   - Steps to reproduce
   - Expected vs Actual

#### Screenshots:
- [Attach screenshots]

#### Overall Assessment:
- Quality: [1-10]
- Performance: [Fast/Medium/Slow]
- Recommendation: [Ship/Fix Bugs/Major Issues]
```

---

## 🚀 **READY TO TEST!**

**Server Status**: Check `http://localhost:3001`  
**Expected Time**: 15-20 minutes  
**Goal**: Confirm everything works!

**Start Testing Now!** ✅

---

Last Updated: Jan 8, 2026 @ 11:30 EAT
