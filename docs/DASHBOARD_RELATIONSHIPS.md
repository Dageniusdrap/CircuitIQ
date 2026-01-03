# CircuitIQ Dashboard Page Relationships & Data Flow

A comprehensive guide to understanding how the core dashboard pages interact with each other, the database, and external storage systems.

---

## 🎯 Overview

CircuitIQ has **four core workflows** that interconnect to provide a seamless diagnostic experience:

1. **Upload Circuit Diagrams** → Store files and metadata
2. **Analyze with AI** → Process diagrams through AI
3. **Diagnose Issues** → Interactive AI chat troubleshooting
4. **Access Procedures** → Reference documentation and guides

Each workflow involves specific pages, database operations, and storage interactions. This document explains these relationships in detail.

---

## 🔄 The Complete Data Flow Cycle

### High-Level Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    COMPLETE WORKFLOW                          │
└──────────────────────────────────────────────────────────────┘

1. UPLOAD        2. LIBRARY       3. ANALYZE       4. DIAGNOSE
   ↓                ↓                ↓                ↓
[/upload] → [/diagrams] → [/diagrams/[id]] → [/diagnostics]
   ↓                ↓                ↓                ↓
   └────────────────┴────────────────┴────────────────┘
                         ↓
                   [Dashboard]
                (Shows all stats)
```

---

## 📊 Workflow 1: Upload Circuit Diagrams

### Page: `/upload`

### Purpose
Allow users to upload wiring diagrams and store them with metadata for future analysis.

### User Actions
1. Drag/drop or select file (PDF, PNG, JPG)
2. Select vehicle type (Aircraft, Automotive, Marine, Electric Vehicle)
3. Enter metadata:
   - Manufacturer (e.g., "Boeing", "Tesla")
   - Model (e.g., "737-800", "Model S")
   - Year (optional)
   - System (e.g., "Electrical", "Hydraulic")
4. Click "Upload"

### Data Flow Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                    UPLOAD WORKFLOW                              │
└─────────────────────────────────────────────────────────────────┘

Step 1: Client-Side Validation
┌──────────────────────┐
│  Upload Page         │
│  /upload             │
└──────┬───────────────┘
       │
       ├─ Validate file type (PDF, PNG, JPG)
       ├─ Check file size (< 10MB)
       └─ Validate required fields
       │
       ▼
Step 2: File Upload to Cloud Storage
┌──────────────────────┐
│  UploadThing API     │
│  /api/uploadthing    │
└──────┬───────────────┘
       │
       ├─ Upload file to S3-compatible storage
       ├─ Generate unique filename
       ├─ Apply CDN distribution
       └─ Return public URL
       │
       │ Returns: { fileUrl: "https://..." }
       ▼
Step 3: Save Metadata to Database
┌──────────────────────────────────────┐
│  Prisma Database Write               │
│  prisma.diagram.create()             │
└──────┬───────────────────────────────┘
       │
       │ INSERT INTO diagram:
       │  - title: "2023 Tesla Model S Wiring"
       │  - fileUrl: "https://uploadthing.com/..."
       │  - vehicleType: "ELECTRIC_VEHICLE"
       │  - manufacturer: "Tesla"
       │  - model: "Model S"
       │  - year: 2023
       │  - system: "Electrical"
       │  - status: "PENDING"
       │  - uploadedById: [current user ID]
       │  - createdAt: [timestamp]
       ▼
Step 4: UI Updates
┌──────────────────────────────────────┐
│  Multiple Pages Updated              │
└──────────────────────────────────────┘
       │
       ├─► /upload → Show in "Recent Uploads" (last 5)
       ├─► /diagrams → Appears in library
       ├─► /dashboard → Stats increment (Total Diagrams +1)
       └─► Browser → Success notification
```

### Database Operations

**Table:** `Diagram`

**Operation:** INSERT (Create)

**SQL Equivalent:**
```sql
INSERT INTO diagram (
  id,
  title,
  fileUrl,
  vehicleType,
  manufacturer,
  model,
  year,
  system,
  status,
  uploadedById,
  createdAt,
  updatedAt
) VALUES (
  'cm123abc...',
  '2023 Tesla Model S Wiring',
  'https://uploadthing.com/f/abc123.pdf',
  'ELECTRIC_VEHICLE',
  'Tesla',
  'Model S',
  2023,
  'Electrical',
  'PENDING',
  'user_abc123',
  NOW(),
  NOW()
);
```

### Storage Operations

**Service:** UploadThing (AWS S3)

**Operation:** PUT (Upload)

**What Gets Stored:**
- Original file (PDF/Image)
- Stored at: `https://uploadthing.com/f/[unique-id].[ext]`
- Publicly accessible via CDN
- No authentication required to view file

### Impact on Other Pages

| Page | What Changes | How It Updates |
|------|--------------|----------------|
| **Dashboard** | "Total Diagrams" count increases | Server component re-fetches on next visit |
| **Upload Page** | New item in "Recent Uploads" | Appears immediately in recent 5 list |
| **Diagrams Library** | New diagram appears | Available for selection and analysis |
| **Diagnostics** | Diagram available for chat | Can be selected for AI diagnostics |

---

## 🔍 Workflow 2: Analyze Diagrams with AI

### Page: `/diagrams/[id]`

### Purpose
View individual diagram details and trigger AI analysis to extract information or identify issues.

### User Actions
1. Navigate to `/diagrams` (library)
2. Click on a specific diagram
3. View diagram image and metadata
4. Click "Analyze Now" or "Start AI Analysis"

### Data Flow Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANALYZE WORKFLOW                             │
└─────────────────────────────────────────────────────────────────┘

Step 1: Fetch Diagram Details
┌──────────────────────┐
│  Diagram Detail Page │
│  /diagrams/[id]      │
└──────┬───────────────┘
       │
       │ READ request
       ▼
┌──────────────────────────────────────┐
│  Prisma Database Read                │
│  prisma.diagram.findUnique()         │
└──────┬───────────────────────────────┘
       │
       │ SELECT * FROM diagram WHERE id = '[id]'
       │ Returns:
       │  - fileUrl (for display)
       │  - all metadata
       │  - uploadedById
       ▼
Step 2: Display Diagram
┌──────────────────────┐
│  UI Renders          │
└──────┬───────────────┘
       │
       ├─ Show diagram image (from CDN)
       ├─ Display metadata
       └─ Show "Analyze" button
       │
       │ User clicks "Analyze Now"
       ▼
Step 3: Send to AI for Analysis
┌──────────────────────────────────────┐
│  API Request                         │
│  POST /api/analyze                   │
└──────┬───────────────────────────────┘
       │
       │ Body: {
       │   diagramId: "cm123...",
       │   analysisType: "general"
       │ }
       ▼
┌──────────────────────────────────────┐
│  Server: Prepare AI Request          │
└──────┬───────────────────────────────┘
       │
       ├─ Fetch diagram from database
       ├─ Build AI prompt with context
       └─ Include diagram URL
       │
       ▼
┌──────────────────────────────────────┐
│  External AI Service                 │
│  OpenAI / Google Gemini              │
└──────┬───────────────────────────────┘
       │
       │ POST to AI API:
       │  - Prompt: "Analyze this wiring diagram..."
       │  - Image URL: diagram.fileUrl
       │  - Model: GPT-4 Vision / Gemini Pro Vision
       │
       │ AI processes diagram and returns:
       │  - Identified components
       │  - Potential issues
       │  - Recommendations
       ▼
Step 4: Save Analysis Results
┌──────────────────────────────────────┐
│  Prisma Database Write               │
│  prisma.analysis.create()            │
└──────┬───────────────────────────────┘
       │
       │ INSERT INTO analysis:
       │  - userId: [current user]
       │  - diagramId: [diagram ID]
       │  - query: "Initial diagram analysis"
       │  - response: [AI's analysis text]
       │  - successful: true
       │  - createdAt: [timestamp]
       ▼
Step 5: Update UI
┌──────────────────────────────────────┐
│  Multiple Pages Updated              │
└──────────────────────────────────────┘
       │
       ├─► /diagrams/[id] → Show analysis results
       ├─► /dashboard → "Diagnostics Run" count +1
       └─► Browser → Display analysis
```

### Database Operations

**Read Operation:**

**Table:** `Diagram`

```typescript
const diagram = await prisma.diagram.findUnique({
  where: { id: diagramId },
  include: {
    uploadedBy: true,  // Include user info
    analyses: true      // Include previous analyses
  }
});
```

**Write Operation:**

**Table:** `Analysis`

```sql
INSERT INTO analysis (
  id,
  userId,
  diagramId,
  query,
  response,
  successful,
  createdAt
) VALUES (
  'ana_123abc...',
  'user_abc123',
  'diagram_xyz789',
  'Initial diagram analysis',
  'This is a Tesla Model S electrical wiring diagram showing...',
  true,
  NOW()
);
```

### External API Calls

**Service:** OpenAI GPT-4 Vision or Google Gemini Pro Vision

**Request:**
```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4-vision-preview",
  messages: [
    {
      role: "system",
      content: "You are an expert in analyzing vehicle wiring diagrams..."
    },
    {
      role: "user",
      content: [
        { 
          type: "text", 
          text: "Analyze this diagram and identify components" 
        },
        {
          type: "image_url",
          image_url: diagram.fileUrl
        }
      ]
    }
  ]
});
```

### Impact on Other Pages

| Page | What Changes | How It Updates |
|------|--------------|----------------|
| **Dashboard** | "Diagnostics Run" count +1 | Next visit re-fetches stats |
| **Dashboard** | Shows in "Recent Analyses" | Query updates on refresh |
| **Diagram Detail** | Analysis results appear | Immediately after completion |
| **Diagnostics** | Can reference this analysis | Chat can use previous insights |

---

## 💬 Workflow 3: Diagnose Issues Through AI Chat

### Page: `/diagnostics`

### Purpose
Interactive real-time troubleshooting with AI assistant based on specific circuit diagrams.

### User Actions
1. Navigate to `/diagnostics`
2. Select a diagram from dropdown/widget
3. Type diagnostic question (e.g., "Why is circuit B not working?")
4. Receive AI response in real-time (streaming)
5. Continue conversation with follow-up questions

### Data Flow Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                    DIAGNOSE WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

Step 1: Page Load - Fetch Available Diagrams
┌──────────────────────┐
│  Diagnostics Page    │
│  /diagnostics        │
└──────┬───────────────┘
       │
       │ Server Component
       ▼
┌──────────────────────────────────────┐
│  Prisma Database Read                │
│  prisma.diagram.findMany()           │
└──────┬───────────────────────────────┘
       │
       │ SELECT * FROM diagram
       │ WHERE uploadedById = [userId]
       │ ORDER BY createdAt DESC
       │ LIMIT 50
       │
       │ Returns: Array of diagrams for selection
       ▼
Step 2: User Selects Diagram
┌──────────────────────┐
│  Diagram Selected    │
└──────┬───────────────┘
       │
       │ URL updates: /diagnostics?diagramId=cm123...
       ▼
┌──────────────────────────────────────┐
│  Fetch Diagram Context               │
│  prisma.diagram.findUnique()         │
└──────┬───────────────────────────────┘
       │
       │ SELECT * FROM diagram WHERE id = '[id]'
       │
       │ Returns:
       │  - Diagram metadata (make, model, system)
       │  - File URL for AI reference
       ▼
┌──────────────────────────────────────┐
│  Fetch Chat History                  │
│  prisma.analysis.findMany()          │
└──────┬───────────────────────────────┘
       │
       │ SELECT * FROM analysis
       │ WHERE diagramId = '[id]'
       │ ORDER BY createdAt ASC
       │
       │ Returns: Previous conversation history
       ▼
Step 3: User Types Question
┌──────────────────────┐
│  Chat Input          │
└──────┬───────────────┘
       │
       │ User: "Why would relay R5 fail to energize?"
       │
       │ Client sends POST request
       ▼
┌──────────────────────────────────────┐
│  API Endpoint                        │
│  POST /api/teammate                  │
└──────┬───────────────────────────────┘
       │
       │ Body: {
       │   message: "Why would relay R5 fail...",
       │   diagramId: "cm123...",
       │   vehicleInfo: {
       │     make: "Tesla",
       │     model: "Model S",
       │     type: "electric_vehicle"
       │   }
       │ }
       ▼
Step 4: Build AI Context
┌──────────────────────────────────────┐
│  Server: Prepare AI Prompt           │
└──────┬───────────────────────────────┘
       │
       │ Construct prompt with:
       │  ┌────────────────────────────┐
       │  │ System Instructions        │
       │  │ "You are an expert Tesla   │
       │  │  technician..."            │
       │  └────────────────────────────┘
       │  ┌────────────────────────────┐
       │  │ Vehicle Context:           │
       │  │ - Make: Tesla              │
       │  │ - Model: Model S           │
       │  │ - System: Electrical       │
       │  │ - Diagram URL: [link]      │
       │  └────────────────────────────┘
       │  ┌────────────────────────────┐
       │  │ Conversation History:      │
       │  │ - Previous 10 Q&A pairs    │
       │  └────────────────────────────┘
       │  ┌────────────────────────────┐
       │  │ Current Question:          │
       │  │ "Why would relay R5..."    │
       │  └────────────────────────────┘
       ▼
Step 5: Stream AI Response
┌──────────────────────────────────────┐
│  AI Service (OpenAI/Gemini)          │
└──────┬───────────────────────────────┘
       │
       │ Stream: true
       │
       │ Response chunks:
       │ "Relay"..."R5"..."could"..."fail"...
       │
       │ Each chunk sent to client via SSE
       ▼
┌──────────────────────────────────────┐
│  Client: Real-Time Display           │
└──────┬───────────────────────────────┘
       │
       │ User sees typing animation:
       │ "Relay R5 could fail to energize due to..."
       │ [text appears word by word]
       ▼
Step 6: Save Complete Conversation
┌──────────────────────────────────────┐
│  Prisma Database Write               │
│  prisma.analysis.create()            │
└──────┬───────────────────────────────┘
       │
       │ INSERT INTO analysis:
       │  - userId: [user ID]
       │  - diagramId: [diagram ID]
       │  - query: "Why would relay R5 fail..."
       │  - response: [complete AI response]
       │  - successful: true
       │  - createdAt: NOW()
       ▼
Step 7: Update Statistics
┌──────────────────────────────────────┐
│  Dashboard Stats Update              │
└──────────────────────────────────────┘
       │
       ├─► Diagnostics Run count +1
       └─► Recent Analyses list updated
```

### Database Operations

**Read Operations:**

1. **Get user's diagrams for selection:**
```typescript
const diagrams = await prisma.diagram.findMany({
  where: { uploadedById: session.user.id },
  orderBy: { createdAt: 'desc' },
  take: 50
});
```

2. **Get selected diagram details:**
```typescript
const diagram = await prisma.diagram.findUnique({
  where: { id: diagramId }
});
```

3. **Get conversation history:**
```typescript
const chatHistory = await prisma.analysis.findMany({
  where: { diagramId: diagramId },
  orderBy: { createdAt: 'asc' },
  take: 20  // Last 20 messages for context
});
```

**Write Operation:**

```sql
INSERT INTO analysis (
  id,
  userId,
  diagramId,
  query,
  response,
  successful,
  createdAt
) VALUES (
  'ana_456def...',
  'user_abc123',
  'diagram_xyz789',
  'Why would relay R5 fail to energize?',
  'Relay R5 could fail to energize due to several reasons: 1) Open circuit in coil control wire (reference wire 142 in diagram)...',
  true,
  NOW()
);
```

### Real-Time Streaming

**Technology:** Server-Sent Events (SSE) via Vercel AI SDK

**Flow:**
```typescript
// Server streaming response
const stream = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: conversationMessages,
  stream: true  // Enable streaming
});

// Return streaming response
return new StreamingTextResponse(stream);

// Client receives chunks in real-time
```

**What the user sees:**
```
[Typing animation...]
"Relay" → "Relay R5" → "Relay R5 could" → "Relay R5 could fail..."
```

### Impact on Other Pages

| Page | What Changes | How It Updates |
|------|--------------|----------------|
| **Dashboard** | "Diagnostics Run" count increases | Increments with each Q&A |
| **Dashboard** | "Recent Analyses" shows new items | Latest conversations appear |
| **Diagnostics** | Chat history persists | Can scroll up to see previous messages |
| **Diagram Detail** | Shows diagnostic activity | "Last diagnosed: 2 minutes ago" |

---

## 📚 Workflow 4: Access Procedures and Documentation

### Page: `/procedures`

### Purpose
Provide reference documentation, standard procedures, and troubleshooting guides that complement the AI diagnostic system.

### User Actions
1. Navigate to `/procedures`
2. Browse available procedures by:
   - Vehicle type
   - System (Electrical, Hydraulic, etc.)
   - Component
3. View step-by-step guides
4. See related diagrams linked to each procedure

### Data Flow Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROCEDURES WORKFLOW                          │
└─────────────────────────────────────────────────────────────────┘

Step 1: Page Load
┌──────────────────────┐
│  Procedures Page     │
│  /procedures         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Prisma Database Read                │
│  prisma.procedure.findMany()         │
└──────┬───────────────────────────────┘
       │
       │ SELECT * FROM procedure
       │ WHERE vehicleType IN (user's uploaded types)
       │ ORDER BY category, title
       │
       │ Returns: List of relevant procedures
       ▼
Step 2: Display Procedures
┌──────────────────────┐
│  UI Renders          │
└──────┬───────────────┘
       │
       ├─ Group by category
       ├─ Show titles and descriptions
       └─ Display related diagrams count
       │
       │ User clicks on procedure
       ▼
Step 3: Fetch Procedure Details
┌──────────────────────────────────────┐
│  Prisma Database Read                │
│  prisma.procedure.findUnique()       │
└──────┬───────────────────────────────┘
       │
       │ SELECT * FROM procedure
       │ WHERE id = '[procedureId]'
       │ INCLUDE related diagrams
       │
       │ Returns:
       │  - Step-by-step instructions
       │  - Tools required
       │  - Safety warnings
       │  - Related diagram IDs
       ▼
Step 4: Cross-Reference Diagrams
┌──────────────────────────────────────┐
│  Prisma Database Read                │
│  prisma.diagram.findMany()           │
└──────┬───────────────────────────────┘
       │
       │ SELECT * FROM diagram
       │ WHERE id IN ([related IDs])
       │
       │ Returns: User's diagrams that relate to this procedure
       ▼
Step 5: Display Complete View
┌──────────────────────┐
│  UI Shows            │
└──────┬───────────────┘
       │
       ├─ Procedure steps
       ├─ Related diagrams (clickable)
       ├─ "Open in Diagnostics" button
       └─ "Download PDF" option
```

### Database Schema (Hypothetical - Procedures Feature)

```prisma
model Procedure {
  id          String   @id @default(cuid())
  title       String
  category    String   // "Electrical", "Mechanical", etc.
  vehicleType VehicleType[]
  steps       Json     // Array of procedure steps
  tools       String[]
  warnings    String[]
  diagrams    Diagram[] @relation("ProcedureDiagrams")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Cross-Page Integration

**Example:** User follows procedure and needs to diagnose

```
User on /procedures
  → Viewing "Testing Relay Circuits"
  → Sees related diagram: "2023 Tesla Model S Wiring"
  → Clicks "Open in Diagnostics"
    → Redirects to /diagnostics?diagramId=cm123...
    → AI chat opens with context pre-loaded
    → User can ask: "I'm following relay testing procedure, step 3 shows no continuity"
```

### Impact on Other Pages

| Page | What Changes | Integration Point |
|------|--------------|-------------------|
| **Diagnostics** | Can reference procedures in chat | AI mentions relevant procedures |
| **Diagram Detail** | Shows related procedures | "View procedures" link |
| **Dashboard** | Shows procedure usage stats | "Procedures Accessed" metric |
| **Upload** | Suggests procedures for diagram type | "Recommended procedures" section |

---

## 🔗 Cross-Page Relationships Summary

### How Pages Connect

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAGE RELATIONSHIP MAP                        │
└─────────────────────────────────────────────────────────────────┘

                         ┌─────────────┐
                         │  DASHBOARD  │
                         │  (Hub/Stats)│
                         └──────┬──────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
             ┌──────────┐ ┌──────────┐ ┌──────────┐
             │  UPLOAD  │ │ DIAGRAMS │ │PROCEDURES│
             └────┬─────┘ └────┬─────┘ └────┬─────┘
                  │            │            │
                  │            ▼            │
                  │      ┌──────────┐       │
                  │      │ DETAIL   │       │
                  │      │[id] Page │       │
                  │      └────┬─────┘       │
                  │           │             │
                  │           ▼             │
                  │    ┌────────────┐       │
                  └────┤DIAGNOSTICS │───────┘
                       │ (AI Chat)  │
                       └────────────┘
```

### Data Sharing Between Pages

| Data Type | Source Page | Used By Pages | Database Table |
|-----------|-------------|---------------|----------------|
| **Diagram File** | Upload | Diagrams, Detail, Diagnostics | `Diagram.fileUrl` |
| **Diagram Metadata** | Upload | All pages | `Diagram` table |
| **Chat History** | Diagnostics | Dashboard, Detail | `Analysis` table |
| **Analysis Results** | Detail (Analyze) | Dashboard, Diagnostics | `Analysis` table |
| **User Session** | Login | All protected pages | JWT cookie |
| **Statistics** | All pages | Dashboard | Aggregated queries |

---

## 💾 Complete Database Interaction Matrix

### Read Operations by Page

| Page | Tables Read | Purpose |
|------|-------------|---------|
| **Dashboard** | `Diagram`, `Analysis`, `User` | Show counts and recent activity |
| **Upload** | `Diagram` | Display recent uploads (5 most recent) |
| **Diagrams** | `Diagram` | List all user's diagrams |
| **Diagram Detail** | `Diagram`, `Analysis` | Show diagram + analysis history |
| **Diagnostics** | `Diagram`, `Analysis` | Load context + chat history |
| **Procedures** | `Procedure`, `Diagram` | Show procedures + related diagrams |

### Write Operations by Page

| Page | Tables Written | Operation | Trigger |
|------|----------------|-----------|---------|
| **Upload** | `Diagram` | INSERT | User uploads file |
| **Diagram Detail** | `Analysis` | INSERT | User clicks "Analyze" |
| **Diagnostics** | `Analysis` | INSERT | Each AI chat message |
| **Register** | `User` | INSERT | User creates account |
| **Settings** | `User` | UPDATE | User updates profile |

---

## 🔄 Real-Time Data Synchronization

### How Pages Stay in Sync

**Next.js Strategy:**

1. **Server Components (Default):**
   - Data fetched on server
   - Always up-to-date on page load/navigation
   - No client-side caching issues

2. **Client Components with Actions:**
   - POST request updates database
   - `router.refresh()` re-fetches server data
   - UI updates immediately

**Example: Upload → Dashboard sync**

```typescript
// Upload page (after successful upload)
await prisma.diagram.create({ ... });
router.push('/dashboard');  // Navigate to dashboard
// Dashboard automatically fetches fresh data on mount
```

### Optimistic Updates

**Example: Diagnostics chat**

```typescript
// 1. Add message to UI immediately (optimistic)
setMessages([...messages, userMessage]);

// 2. Send to server in background
const response = await fetch('/api/teammate', { ... });

// 3. Stream AI response and append
// UI updates in real-time

// 4. Database save happens server-side (automatic)
```

---

## 📊 Database Query Examples

### Dashboard Statistics Query

```typescript
// Parallel queries for dashboard stats
const [diagramCount, analysisCount, resolvedCount] = await Promise.all([
  // Total diagrams
  prisma.diagram.count({
    where: { uploadedById: userId }
  }),
  
  // Total diagnostics run
  prisma.analysis.count({
    where: { userId: userId }
  }),
  
  // Successfully resolved issues
  prisma.analysis.count({
    where: { 
      userId: userId,
      successful: true 
    }
  })
]);
```

### Diagnostics Chat History Query

```typescript
// Get conversation for specific diagram
const chatHistory = await prisma.analysis.findMany({
  where: {
    diagramId: selectedDiagramId,
    userId: currentUserId
  },
  orderBy: { createdAt: 'asc' },
  take: 20,  // Last 20 messages for context
  select: {
    query: true,
    response: true,
    createdAt: true
  }
});
```

### Upload Page Recent Diagrams

```typescript
// Get 5 most recent uploads
const recentUploads = await prisma.diagram.findMany({
  where: { uploadedById: userId },
  orderBy: { createdAt: 'desc' },
  take: 5,
  include: {
    _count: {
      select: { analyses: true }  // Count how many times analyzed
    }
  }
});
```

---

## 🎯 Key Takeaways

### 1. **Centralized Database = Single Source of Truth**
- All pages read from same PostgreSQL database
- No data duplication or sync issues
- Prisma ORM ensures type safety

### 2. **File Storage Separate from Metadata**
- Files stored in UploadThing (cloud CDN)
- Metadata and relationships stored in database
- Database only stores URL reference to files

### 3. **AI Generates Data, Database Persists It**
- AI (OpenAI/Gemini) processes and analyzes
- Results saved to `Analysis` table
- Chat history enables context-aware conversations

### 4. **Pages Are Views, Database Is State**
- Each page is a different view of the same data
- Upload creates data, other pages consume it
- Dashboard aggregates data from all sources

### 5. **Real-Time Updates via Server Components**
- Next.js App Router Server Components
- Fresh data on every navigation
- No stale cache issues

---

## 📈 Performance Considerations

### Database Optimization
- **Indexes** on frequently queried fields (`uploadedById`, `diagramId`)
- **Connection pooling** via Neon
- **Parallel queries** with `Promise.all()`
- **Limited results** with `take` and pagination

### Storage Optimization
- **CDN delivery** for fast file access
- **Lazy loading** images on page
- **Compressed** files when possible

### API Optimization
- **Streaming responses** for AI chat (SSE)
- **Debounced** search inputs
- **Cached** static content

---

## 🔐 Security & Access Control

### Data Access Rules

```typescript
// Users can only access their own diagrams
const diagram = await prisma.diagram.findFirst({
  where: {
    id: diagramId,
    uploadedById: session.user.id  // ← Security check
  }
});

// Users can only see their own analyses
const analyses = await prisma.analysis.findMany({
  where: {
    userId: session.user.id  // ← Security check
  }
});
```

### File Access
- Files stored on public CDN (UploadThing)
- No authentication required to view file
- **Security through obscurity:** URLs are long and random
- Database controls who can see which diagrams

---

## 🚀 Future Enhancements

### Potential Improvements

1. **Real-Time Collaboration:**
   - WebSockets for multi-user diagnostics
   - Share diagnostic sessions with team

2. **Offline Support:**
   - Progressive Web App (PWA)
   - Cache diagrams for offline viewing

3. **Batch Operations:**
   - Upload multiple diagrams at once
   - Bulk analyze all diagrams

4. **Advanced Search:**
   - Full-text search across diagrams and analyses
   - Filter by component, issue type, date range

5. **Export Capabilities:**
   - Export chat history as PDF
   - Generate diagnostic reports

---

**Last Updated:** January 3, 2026  
**Maintained by:** CircuitIQ Development Team
