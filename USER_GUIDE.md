# CircuitIQ User Guide

**Welcome to CircuitIQ** - Your AI-Powered Wiring Diagram Analysis Platform

---

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [Uploading Diagrams](#uploading-diagrams)
3. [Analyzing Diagrams](#analyzing-diagrams)
4. [AI Diagnostics](#ai-diagnostics)
5. [Managing Your Library](#managing-your-library)
6. [Search & Navigation](#search--navigation)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Accessing CircuitIQ
1. Navigate to **https://circuit-iq.vercel.app**
2. Choose one of the following login methods:
   - **Email/Password** (Standard registration)
   - **Google Account** (OAuth)
   - **GitHub Account** (OAuth)
   - **Demo User** (Quick preview without registration)

### First Login - Dashboard Overview
After logging in, you'll see your **Dashboard** with:
- **Analysis Power**: Your AI usage statistics
- **Total Diagrams**: Number of uploaded files
- **Quick Actions**: Shortcuts to common tasks
- **Recent Analyses**: Your latest diagnostic sessions

---

## 📤 Uploading Diagrams

### Step-by-Step Upload Process

#### 1. Navigate to Upload Page
- Click **"Upload"** in the left sidebar
- Or use the **"Upload Diagram"** button on the dashboard

#### 2. Select Vehicle Type
Before uploading, choose the correct category:
- **✈️ Aviation (ATA)** - Aircraft systems with ATA chapter codes
- **🚗 Automotive** - Cars and trucks
- **🚢 Marine** - Boats and ships
- **⚡ Electric Cars** - EV-specific systems

**Why this matters:** CircuitIQ applies industry-specific standards based on your selection.

#### 3. Upload Your Files
**Supported Formats:**
- PDF (up to 32MB)
- PNG/JPG (up to 16MB)
- DWG (up to 64MB)

**Two Upload Methods:**
- **Drag & Drop:** Drag files directly into the upload zone
- **File Browser:** Click "Choose Files" to browse your computer

**Batch Upload:**
- Upload up to **20 files at once**
- Each file is processed independently

#### 4. What Happens Next?
Once uploaded, CircuitIQ automatically:
1. ✅ **Saves** your file to secure cloud storage
2. 🤖 **Analyzes** with GPT-4 Vision AI
3. 📊 **Extracts** components, connections, and metadata
4. ✨ **Displays** in "Your Recent Uploads" below

**Processing Time:** 
- Simple diagrams: 10-30 seconds
- Complex schematics: 1-3 minutes

#### 5. Recent Uploads Section
Scroll down to see your files displayed as **large cards** with:
- **Vehicle Icon** (color-coded by type)
- **File Name** and upload time
- **Status Badge:**
  - 🔵 "Analyzing..." - AI is processing
  - ✅ "Ready" - Analysis complete
- **Actions:**
  - **"Analyze Now"** - Open the diagram viewer
  - **🗑️ Delete** - Remove the file permanently

---

## 🔍 Analyzing Diagrams

### Opening a Diagram
From any list (Dashboard, Library, Recent Uploads):
1. Click the **"Analyze Now"** or **"View"** button
2. The diagram opens in the **Interactive Viewer**

### Diagram Viewer Features

#### Left Panel - Diagram Information
- **Title & Description**
- **Vehicle Details:**
  - Manufacturer
  - Model
  - Year
  - System Name
  - ATA/System Code
- **Metadata:**
  - Upload date
  - Processing status
  - AI confidence score

#### Center Panel - Visual Display
- **Image Viewer** showing your diagram
- **Zoom Controls** (pinch or scroll)
- **Component Highlights** (coming soon)

#### Right Panel - Extracted Data
**Components Tab:**
- List of all detected electronic components
- Part numbers, locations, functions
- Click any component to highlight it on the diagram

**Connections Tab:**
- Wire-to-wire connections
- Color codes, gauge sizes
- Signal types (power, ground, data)

**Analysis Tab:**
- AI interpretation summary
- System integration notes
- Potential fault points

---

## 🩺 AI Diagnostics

### Starting a Diagnostic Session
1. From the **Diagrams** page, click **"Diagnose"** on any file
2. Or navigate to **"Diagnostics"** in the sidebar

### Using the AI Teammate

#### Ask a Question
**Examples:**
- "What would cause the landing gear warning light to stay on?"
- "Test procedure for relay K5?"
- "Show me the power distribution for the APU system"

#### Conversation Flow
1. **You describe the symptom**
2. **AI Teammate analyzes** the diagram and wiring
3. **Receives:**
   - Probable causes (ranked by likelihood)
   - Suggested test procedures
   - Component-specific checks
4. **Follow-up questions** refine the diagnosis

#### Advanced Features
- **Multi-turn conversations** - Ask clarifying questions
- **Reference specific components** - "What about relay R12?"
- **Request procedures** - "How do I test this circuit?"

### Example Diagnostic Session

```
You: "Fuel pump is not running on startup"

AI: Based on the wiring diagram, here are the probable causes:

1. **Fuel Pump Relay (K7)** [High Probability]
   - Location: E3 Equipment Bay, Panel P6
   - Test: Check for 28V DC on Pin 30 during start
   - Expected: Coil should energize

2. **Circuit Breaker CB-24** [Medium Probability]
   - Check if tripped
   - Location: Main Panel

3. **Wiring Harness W415** [Low Probability]
   - Inspect for chafing near firewall
   - Test continuity

Would you like detailed test procedures for any of these?
```

---

## 📚 Managing Your Library

### The Diagrams Page
Access via **"Diagrams"** in the sidebar.

#### Filtering by Vehicle Type
Click the category buttons at the top:
- **Aviation (ATA)** - Shows only aircraft diagrams
- **Automotive** - Cars and trucks
- **Marine** - Marine vessels
- **Electric Cars** - EV systems

**URL-Based Filters:**
Links are shareable! For example:
- `/diagrams?category=aircraft` - Direct link to aircraft diagrams
- `/diagrams?category=marine&search=hydraulic` - Marine hydraulic systems

#### Search Bar
- Type keywords to search:
  - File names
  - Manufacturers
  - System names
  - Part numbers (if extracted)

**Search is scoped** to the currently selected category.

#### Grouped Display
Diagrams are automatically organized by:
- **Aviation:** ATA chapters (e.g., "24 - Electrical Power")
- **Other types:** System names (e.g., "Engine Management")

#### Quick Actions on Each Card
- **View** - Open the diagram
- **Diagnose** - Start AI assistant
- **Delete** - Remove (with confirmation)

---

## 🔎 Search & Navigation

### Global Search
1. Click **"Search"** in the sidebar
2. Type your query (minimum 2 characters)
3. Results show:
   - **Diagrams** - Matching files
   - **Components** - Specific parts you've uploaded

**Search Shortcuts:**
- Searches across ALL your diagrams
- Shows preview with system info
- Click any result to open directly

### Command Palette (Power Users)
Press **`Cmd+K`** (Mac) or **`Ctrl+K`** (Windows) for quick navigation:
- Jump to any page
- Search diagrams
- Execute actions

---

## 🛠 Troubleshooting

### "File not appearing in Recent Uploads"
**Solution:**
- Refresh the page (Cmd/Ctrl + R)
- If using Safari, try Chrome/Firefox
- Check your internet connection during upload

### "AI Analysis Failed"
**Common Causes:**
1. **File is not a wiring diagram** - AI only processes electrical schematics
2. **Image quality too low** - Use high-resolution scans (min 1200px)
3. **File corrupted** - Re-upload from original source

**What to do:**
- Delete the file and re-upload
- Ensure file is a clear, readable wiring diagram
- Contact support if issue persists

### "Slow AI Processing"
**Normal Times:**
- Simple diagrams: 30 seconds
- Complex multi-system diagrams: 2-3 minutes

**If taking longer than 5 minutes:**
- Check the status badge
- Refresh the page
- If still "Analyzing", contact support with diagram ID

### "Can't Delete a Diagram"
**Requirements:**
- You must be the uploader OR an Admin
- Deleting requires confirmation

**If Delete button is not working:**
- Ensure you're logged in
- Try refreshing the page
- Clear browser cache

### "OAuth Login Not Working"
**For Google/GitHub:**
1. Ensure pop-ups are enabled
2. Check if you're already logged into Google/GitHub
3. Try incognito mode
4. Contact support if domain is blocked by your organization

---

## 📊 Understanding AI Confidence Scores

### What is the Confidence Score?
After analysis, CircuitIQ shows a **confidence percentage** (0-100%) indicating:
- How well AI could read the diagram
- Completeness of extracted data

### Score Ranges
- **90-100%** - Excellent quality, high data accuracy
- **70-89%** - Good quality, minor interpretation issues
- **50-69%** - Fair quality, manual verification recommended
- **Below 50%** - Poor quality, consider re-uploading higher resolution

### How to Improve Scores
1. Upload **high-resolution images** (minimum 1200px width)
2. Ensure **text is readable** when zoomed
3. Use **single-page diagrams** (not multi-page PDFs)
4. Avoid **hand-drawn sketches** (use CAD exports if possible)

---

## 🎓 Best Practices

### Organizing Your Diagrams
1. **Use Descriptive Names:**
   - ❌ Bad: `diagram1.pdf`
   - ✅ Good: `Boeing 737 APU Start Circuit.pdf`

2. **Select Correct Vehicle Type:**
   - Ensures proper ATA code application
   - Enables industry-specific analysis

3. **Upload System-by-System:**
   - Group related diagrams together
   - Use consistent naming conventions

### Getting the Most from AI Analysis
1. **Ask Specific Questions:**
   - ❌ "Why isn't it working?"
   - ✅ "What would cause the fuel pump relay to not energize during engine start?"

2. **Provide Context:**
   - Mention symptoms observed
   - Include recent maintenance performed
   - Note environmental conditions if relevant

3. **Use Follow-ups:**
   - AI remembers the conversation
   - Ask for clarifications
   - Request step-by-step procedures

---

## 🔐 Security & Privacy

### Data Protection
- All files are **encrypted** in transit and at rest
- Access restricted to **your account only**
- Diagrams are **never shared** with other users

### Account Security
- Use a **strong password** (min 8 characters)
- Enable **2-Factor Authentication** in Settings
- Review **login activity** in Security tab

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- **`Cmd/Ctrl + K`** - Command palette
- **`Cmd/Ctrl + /`** - Toggle sidebar
- **`Esc`** - Close modals

### Mobile Usage
CircuitIQ works on tablets and phones:
- Upload from mobile camera roll
- View diagrams on-site
- Use AI diagnostics in the field

### Sharing Diagrams
Currently, diagrams are **private to your account**. Team sharing is coming in the **Professional Plan**.

---

## 📞 Support & Resources

### Need Help?
- **Email:** support@circuitiq.app
- **Documentation:** https://docs.circuitiq.app
- **Status Page:** https://circuit-iq.vercel.app/status

### Feature Requests
We'd love to hear your ideas! Email feature suggestions to:
**features@circuitiq.app**

---

**Version:** 1.0  
**Last Updated:** December 30, 2025  
**Production URL:** https://circuit-iq.vercel.app
