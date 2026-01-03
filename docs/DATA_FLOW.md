# CircuitIQ Data Flow Documentation

This document explains how data flows through the CircuitIQ application, from user input to database storage and AI processing.

---

## 🗂️ Database Schema Overview

### Core Tables

```prisma
User
├── id (Primary Key)
├── name
├── email
├── password (hashed)
├── emailVerified
├── image
├── createdAt
└── updatedAt

Diagram
├── id (Primary Key)
├── title
├── fileUrl (UploadThing CDN)
├── vehicleType (AIRCRAFT | AUTOMOTIVE | MARINE | ELECTRIC_VEHICLE)
├── manufacturer
├── model
├── year
├── system
├── status (PENDING | PROCESSING | COMPLETED | FAILED)
├── uploadedById (FK → User)
├── createdAt
└── updatedAt

Analysis
├── id (Primary Key)
├── userId (FK → User)
├── diagramId (FK → Diagram)
├── query (User's diagnostic question)
├── response (AI's answer)
├── successful (Boolean)
├── createdAt
└── updatedAt

Subscription
├── id (Primary Key)
├── userId (FK → User)
├── plan (FREE | PRO | ENTERPRISE)
├── status (ACTIVE | CANCELED | EXPIRED)
├── currentPeriodEnd
└── createdAt
```

---

## 🔄 Core Data Flows

### 1. User Registration Flow

```
┌─────────────────┐
│  User Input     │
│  /register      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  POST /api/auth/register        │
│  - Validate input               │
│  - Hash password (bcrypt)       │
│  - Check email uniqueness       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Database (Prisma)              │
│  User.create()                  │
│  - Store: name, email, hashedPw │
│  - emailVerified: null          │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Send Verification Email        │
│  - Generate token               │
│  - Send via email service       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Auto Sign-In                   │
│  - Create session (NextAuth)    │
│  - Redirect to /dashboard       │
└─────────────────────────────────┘
```

**Technologies:**
- **NextAuth.js** - Authentication
- **Prisma** - Database ORM
- **bcrypt** - Password hashing
- **Email Service** - Verification emails

---

### 2. Diagram Upload Flow

```
┌─────────────────────────────────┐
│  User Action: /upload           │
│  - Drop file in upload zone     │
│  - Enter metadata               │
│    • Vehicle type               │
│    • Manufacturer               │
│    • Model                      │
│    • Year                       │
│    • System                     │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Frontend Validation            │
│  - File type: PDF/Images        │
│  - File size: Max 10MB          │
│  - Required fields check        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  UploadThing Upload             │
│  POST /api/uploadthing/core     │
│  - Upload to cloud storage      │
│  - Generate CDN URL             │
│  - Return fileUrl               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Database Write                 │
│  Diagram.create()               │
│  ┌───────────────────────────┐  │
│  │ title: user input         │  │
│  │ fileUrl: CDN URL          │  │
│  │ vehicleType: selection    │  │
│  │ manufacturer: input       │  │
│  │ model: input              │  │
│  │ year: input               │  │
│  │ system: input             │  │
│  │ status: PENDING           │  │
│  │ uploadedById: session.id  │  │
│  └───────────────────────────┘  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Background Processing (Future) │
│  - OCR text extraction          │
│  - Image analysis               │
│  - Update status: COMPLETED     │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  UI Update                      │
│  - Show in recent uploads       │
│  - Enable "Analyze Now" button  │
└─────────────────────────────────┘
```

**Technologies:**
- **UploadThing** - File upload service
- **Prisma** - Database writes
- **Next.js Server Actions** - Form handling
- **React Hook Form** - Client-side validation

**Data Storage:**
- Files → UploadThing CDN
- Metadata → PostgreSQL (Neon)

---

### 3. AI Diagnostics Flow

```
┌─────────────────────────────────┐
│  User: /diagnostics             │
│  - Select diagram               │
│  - Type diagnostic question     │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Frontend                       │
│  TeammateChat Component         │
│  - Display chat UI              │
│  - Send message via POST        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  POST /api/teammate             │
│  Request Body:                  │
│  {                              │
│    message: "Why is the...",    │
│    diagramId: "abc123",         │
│    vehicleInfo: {...}           │
│  }                              │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Server: Fetch Context          │
│  1. Get diagram from DB         │
│     Diagram.findUnique()        │
│  2. Get chat history            │
│     Analysis.findMany()         │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Build AI Prompt                │
│  ┌───────────────────────────┐  │
│  │ System: "You are an       │  │
│  │   expert technician..."   │  │
│  │                           │  │
│  │ Context:                  │  │
│  │ - Vehicle: Model/Make     │  │
│  │ - System: Electrical      │  │
│  │ - Diagram URL: [link]     │  │
│  │                           │  │
│  │ History: Previous Q&A     │  │
│  │                           │  │
│  │ User Query: Current msg   │  │
│  └───────────────────────────┘  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  AI Service (OpenAI/Gemini)     │
│  - Send prompt to LLM           │
│  - Stream response              │
│  - Parse technical answer       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Database: Save Analysis        │
│  Analysis.create()              │
│  ┌───────────────────────────┐  │
│  │ userId: session.id        │  │
│  │ diagramId: diagram.id     │  │
│  │ query: user question      │  │
│  │ response: AI answer       │  │
│  │ successful: true/false    │  │
│  └───────────────────────────┘  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Stream Response to Client      │
│  - Real-time SSE/WebSocket      │
│  - Display typing animation     │
│  - Show complete response       │
└─────────────────────────────────┘
```

**Technologies:**
- **AI SDK** (Vercel AI SDK) - Streaming responses
- **OpenAI/Google Gemini** - LLM provider
- **Prisma** - Save chat history
- **React** - Real-time UI updates

**Data Flow:**
1. User message → Backend API
2. API → Fetch context from database
3. API → Send to AI service
4. AI response → Stream to client
5. Complete response → Save to database

---

### 4. Dashboard Statistics Flow

```
┌─────────────────────────────────┐
│  User: Visit /dashboard         │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Server Component               │
│  dashboard/page.tsx             │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Authentication Check           │
│  auth() from NextAuth           │
│  - Verify session               │
│  - Get user ID                  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│  Parallel Database Queries (Promise.all)        │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ 1. Diagram Count                           │ │
│  │    prisma.diagram.count({                  │ │
│  │      where: { uploadedById: userId }       │ │
│  │    })                                      │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ 2. Total Analyses                          │ │
│  │    prisma.analysis.count({                 │ │
│  │      where: { userId }                     │ │
│  │    })                                      │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ 3. Resolved Issues                         │ │
│  │    prisma.analysis.count({                 │ │
│  │      where: { userId, successful: true }   │ │
│  │    })                                      │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ 4. Recent Diagrams                         │ │
│  │    prisma.diagram.findMany({               │ │
│  │      where: { uploadedById: userId },      │ │
│  │      orderBy: { createdAt: 'desc' },       │ │
│  │      take: 10                              │ │
│  │    })                                      │ │
│  └────────────────────────────────────────────┘ │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Render Dashboard               │
│  - StatCards with data          │
│  - Recent analyses list         │
│  - Recent documents widget      │
│  - Quick actions                │
└─────────────────────────────────┘
```

**Performance Optimization:**
- **Parallel Queries:** Uses `Promise.all()` to fetch data simultaneously
- **Efficient Counting:** Database-level `count()` operations
- **Limited Results:** `take: 10` to avoid overwhelming queries
- **Server Components:** No client-side hydration needed

---

## 🔐 Authentication Data Flow

### Session Management (NextAuth.js)

```
┌─────────────────────────────────┐
│  User Login                     │
│  POST /api/auth/signin          │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Credentials Verification       │
│  1. Find user by email          │
│  2. Compare password hash       │
│  3. Verify account status       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Create Session                 │
│  NextAuth Session Object:       │
│  {                              │
│    user: {                      │
│      id: "user_id",             │
│      name: "John Doe",          │
│      email: "john@example.com", │
│      image: "avatar_url"        │
│    },                           │
│    expires: "2026-02-03..."     │
│  }                              │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Store Session                  │
│  - JWT token (encrypted)        │
│  - HTTP-only cookie             │
│  - Secure flag (HTTPS)          │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Redirect to /dashboard         │
└─────────────────────────────────┘
```

### Protected Route Access

```
┌─────────────────────────────────┐
│  User requests                  │
│  /dashboard (protected)         │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Middleware Check               │
│  src/middleware.ts              │
│  - Read session cookie          │
│  - Verify JWT token             │
└────────┬────────────────────────┘
         │
         ├─ No Session ───────────────┐
         │                            │
         │                            ▼
         │              ┌──────────────────────┐
         │              │  Redirect to /login  │
         │              └──────────────────────┘
         │
         ├─ Valid Session ────────────┐
         │                            │
         │                            ▼
         │              ┌──────────────────────┐
         │              │  Allow Access        │
         │              │  Inject session data │
         │              └──────────────────────┘
         │
         └─ Expired Session ──────────┐
                                      │
                                      ▼
                        ┌──────────────────────┐
                        │  Refresh or logout   │
                        │  Redirect to /login  │
                        └──────────────────────┘
```

---

## 📊 Real-Time Features & WebSockets

### AI Chat Streaming

```
Client                          Server                      AI Service
  │                               │                             │
  │ POST /api/teammate            │                             │
  ├──────────────────────────────>│                             │
  │                               │ Build prompt with context   │
  │                               │                             │
  │                               │ POST to OpenAI/Gemini       │
  │                               ├────────────────────────────>│
  │                               │                             │
  │                               │ <── Stream chunk 1 ─────────┤
  │ <── Stream chunk 1 ───────────┤                             │
  │ (Display: "Hello...")         │                             │
  │                               │                             │
  │                               │ <── Stream chunk 2 ─────────┤
  │ <── Stream chunk 2 ───────────┤                             │
  │ (Display: "Hello, I can...")  │                             │
  │                               │                             │
  │                               │ <── Stream chunk N ─────────┤
  │ <── Stream chunk N ───────────┤                             │
  │ (Complete response)           │                             │
  │                               │                             │
  │                               │ Save to database            │
  │                               │ Analysis.create()           │
  │                               │                             │
  │ <── [DONE] ───────────────────┤                             │
  │                               │                             │
```

**Technology:** Server-Sent Events (SSE) via Vercel AI SDK

---

## 💾 File Storage Architecture

```
User Upload
    │
    ▼
┌─────────────────────────────────┐
│  UploadThing                    │
│  - Receives file                │
│  - Validates file type/size     │
│  - Generates unique filename    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Cloud Storage (S3-compatible)  │
│  - Stores original file         │
│  - CDN distribution             │
│  - Returns public URL           │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Database (Diagram table)       │
│  - Store fileUrl (CDN link)     │
│  - Store metadata               │
│  - Link to user                 │
└─────────────────────────────────┘
```

**File Access:**
- Public CDN URLs (no auth required for file access)
- Database controls who can see which diagrams
- Middleware ensures only authorized users access diagram pages

---

## 🔄 Data Sync & Caching Strategy

### Server-Side Caching

```typescript
// Dashboard page - uncached (always fresh data)
export const dynamic = "force-dynamic"

// Static pages - cached at build time
export const revalidate = 3600 // 1 hour

// Upload page - fresh data needed
export const dynamic = "force-dynamic"
```

### Client-Side State

```
React Components
    │
    ├─ Server Components (RSC)
    │  - Fetch data directly in component
    │  - No client-side state
    │  - Automatic deduplication
    │
    └─ Client Components
       - useState for UI state
       - React Query/SWR for data fetching (if needed)
       - Optimistic updates
```

---

## 📈 Data Analytics Flow

### Monitoring & Observability

```
Application Events
    │
    ├─> PostHog (Analytics)
    │   - User actions
    │   - Page views
    │   - Feature usage
    │
    ├─> Sentry (Error Tracking)
    │   - Runtime errors
    │   - API failures
    │   - Performance issues
    │
    └─> Uptime Robot (Monitoring)
        - Endpoint health
        - Response times
        - Downtime alerts
```

---

## 🔍 Search & Query Optimization

### Diagram Search Flow

```
/search page
    │
    ▼
User types query
    │
    ▼
┌─────────────────────────────────┐
│  Database Query                 │
│  prisma.diagram.findMany({      │
│    where: {                     │
│      OR: [                      │
│        { title: { contains } }, │
│        { manufacturer: { ... }},│
│        { model: { contains } }, │
│      ]                          │
│    }                            │
│  })                             │
└────────┬────────────────────────┘
         │
         ▼
Return filtered results
```

**Future Optimization:**
- Full-text search (PostgreSQL)
- Elasticsearch integration
- Fuzzy matching

---

## 📊 Summary: Key Data Flows

| Flow | Start | End | Key Tech |
|------|-------|-----|----------|
| **Authentication** | Login form | Dashboard | NextAuth, Prisma |
| **Upload** | Upload form | Database + CDN | UploadThing, Prisma |
| **AI Diagnostics** | Chat input | Streamed response | AI SDK, OpenAI/Gemini |
| **Dashboard Stats** | Page load | Rendered stats | Prisma parallel queries |
| **Search** | Search input | Filtered results | Prisma queries |

---

**Last Updated:** January 3, 2026  
**Maintained by:** CircuitIQ Development Team
