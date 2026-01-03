# CircuitIQ Technical Specification

A comprehensive technical reference for the CircuitIQ application architecture, technology stack, and implementation details.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication & Authorization](#authentication--authorization)
7. [File Upload System](#file-upload-system)
8. [AI Integration](#ai-integration)
9. [Deployment](#deployment)
10. [Environment Configuration](#environment-configuration)
11. [Performance Optimization](#performance-optimization)
12. [Security](#security)

---

## 🎯 Overview

**CircuitIQ** is an AI-powered diagnostic platform for analyzing and troubleshooting circuit diagrams across various vehicle types (Aircraft, Automotive, Marine, Electric Vehicles).

### Core Features
- ✅ Circuit diagram upload and management
- ✅ AI-powered diagnostic chat assistant
- ✅ Real-time troubleshooting with context awareness
- ✅ User authentication and session management
- ✅ Dashboard analytics and statistics
- ✅ Multi-vehicle type support

### Key Metrics
- **Users:** Multi-tenant with role-based access
- **File Support:** PDF, PNG, JPG circuit diagrams
- **Max Upload Size:** 10MB per file
- **AI Response Time:** ~2-5 seconds (streaming)
- **Database:** PostgreSQL (Neon serverless)

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.1.3 | React framework with App Router |
| **React** | 19.0.0 | UI library |
| **TypeScript** | 5.0+ | Type safety |
| **TailwindCSS** | 3.4.1 | Styling framework |
| **shadcn/ui** | Latest | Component library |
| **Radix UI** | Latest | Accessible primitives |
| **Lucide React** | Latest | Icon system |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 15.1.3 | RESTful API endpoints |
| **NextAuth.js** | 5.0.0-beta.25 | Authentication |
| **Prisma** | 5.22.0 | Database ORM |
| **Zod** | 3.24.1 | Schema validation |
| **bcrypt** | 5.1.1 | Password hashing |

### AI & External Services
| Service | Purpose | Provider |
|---------|---------|----------|
| **AI SDK** | Vercel AI SDK | Streaming AI responses |
| **LLM** | OpenAI/Google Gemini | Diagnostic intelligence |
| **UploadThing** | File uploads | Cloud storage + CDN |
| **Email** | Transactional emails | Resend/SendGrid |
| **Payments** | Subscriptions | Stripe |

### Database
| Component | Details |
|-----------|---------|
| **Database** | PostgreSQL 16 |
| **Provider** | Neon (Serverless) |
| **ORM** | Prisma |
| **Connection** | Pooled connection |
| **Migrations** | Prisma Migrate |

### DevOps & Monitoring
| Tool | Purpose |
|------|---------|
| **Vercel** | Hosting & deployment |
| **GitHub** | Version control & CI/CD |
| **Sentry** | Error tracking |
| **PostHog** | Product analytics |
| **Uptime Robot** | Monitoring |

---

## 🏗️ Architecture

### Application Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client Browser                 │
│              (React + Next.js SSR)              │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│              Next.js App Router                  │
│  ┌───────────────────────────────────────────┐  │
│  │  Server Components (RSC)                  │  │
│  │  - Data fetching                          │  │
│  │  - SEO optimization                       │  │
│  │  - Direct DB queries                      │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │  Client Components                        │  │
│  │  - Interactive UI                         │  │
│  │  - State management                       │  │
│  │  - Event handlers                         │  │
│  └───────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│              Middleware Layer                    │
│  - Authentication checks                         │
│  - Route protection                             │
│  - Request/Response modification                │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │  API   │ │  Auth  │ │  DB    │
   │ Routes │ │NextAuth│ │Prisma  │
   └────────┘ └────────┘ └────────┘
        │          │          │
        └──────────┼──────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │  Neon  │ │OpenAI/ │ │Upload  │
   │   DB   │ │ Gemini │ │ Thing  │
   └────────┘ └────────┘ └────────┘
```

### Routing Structure

**Next.js App Router** with route groups:

```
src/app/
├── (auth)/          # Authentication pages (public)
│   ├── login/
│   ├── register/
│   └── forgot-password/
│
├── (dashboard)/     # Protected dashboard pages
│   ├── dashboard/
│   ├── upload/
│   ├── diagnostics/
│   └── diagrams/
│
├── (marketing)/     # Public marketing pages
│   ├── about/
│   ├── pricing/
│   └── docs/
│
└── api/            # API endpoints
    ├── auth/       # NextAuth handlers
    ├── analyze/    # AI analysis
    └── teammate/   # Chat API
```

**Middleware:** `src/middleware.ts`
- Protects dashboard routes
- Redirects unauthenticated users
- Injects session data

---

## 💾 Database Schema

### Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐
│     User     │         │  Diagram     │
├──────────────┤         ├──────────────┤
│ id           │────┬───<│ uploadedById │
│ name         │    │    │ id           │
│ email        │    │    │ title        │
│ password     │    │    │ fileUrl      │
│ emailVerified│    │    │ vehicleType  │
│ image        │    │    │ manufacturer │
└──────────────┘    │    │ model        │
                    │    │ year         │
                    │    │ system       │
                    │    │ status       │
                    │    └──────────────┘
                    │           │
                    │           │
                    │    ┌──────────────┐
                    │    │  Analysis    │
                    │    ├──────────────┤
                    └───<│ userId       │
                         │ diagramId    │───┐
                         │ query        │   │
                         │ response     │   │
                         │ successful   │   │
                         └──────────────┘   │
                                            │
┌──────────────┐                            │
│ Subscription │                            │
├──────────────┤                            │
│ id           │                            │
│ userId       │───<────────────────────────┘
│ plan         │
│ status       │
│ periodEnd    │
└──────────────┘
```

### Prisma Schema Highlights

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String?
  image         String?
  diagrams      Diagram[]
  analyses      Analysis[]
  subscription  Subscription?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Diagram {
  id            String   @id @default(cuid())
  title         String
  fileUrl       String
  vehicleType   VehicleType
  manufacturer  String
  model         String
  year          Int?
  system        String?
  status        DiagramStatus @default(PENDING)
  uploadedById  String
  uploadedBy    User     @relation(fields: [uploadedById], references: [id])
  analyses      Analysis[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Analysis {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  diagramId  String
  diagram    Diagram  @relation(fields: [diagramId], references: [id])
  query      String   @db.Text
  response   String   @db.Text
  successful Boolean  @default(true)
  createdAt  DateTime @default(now())
}

enum VehicleType {
  AIRCRAFT
  AUTOMOTIVE
  MARINE
  ELECTRIC_VEHICLE
}

enum DiagramStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

---

## 🔌 API Endpoints

### Authentication Endpoints

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/auth/signin` | POST | User login | No |
| `/api/auth/signup` | POST | User registration | No |
| `/api/auth/signout` | POST | User logout | Yes |
| `/api/auth/session` | GET | Get current session | No |

**Provider:** NextAuth.js v5

### Diagram Endpoints

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/diagrams` | GET | List user diagrams | Yes |
| `/api/diagrams` | POST | Create diagram | Yes |
| `/api/diagrams/[id]` | GET | Get diagram details | Yes |
| `/api/diagrams/[id]` | PUT | Update diagram | Yes |
| `/api/diagrams/[id]` | DELETE | Delete diagram | Yes |

### AI/Analysis Endpoints

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/analyze` | POST | Trigger AI analysis | Yes |
| `/api/teammate` | POST | Chat with AI assistant | Yes |

**Request Body (AI Chat):**
```typescript
{
  message: string;
  diagramId: string;
  vehicleInfo: {
    make: string;
    model: string;
    type: "aircraft" | "automotive" | "marine";
  };
}
```

**Response:** Server-Sent Events (SSE) stream

### File Upload Endpoints

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/uploadthing` | POST | Upload file | Yes |

**Handled by:** UploadThing SDK

### Health & Monitoring

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/health` | GET | Health check | No |
| `/api/feedback` | POST | Submit feedback | Yes |

---

## 🔐 Authentication & Authorization

### NextAuth.js Configuration

**Provider:** Credentials Provider (email/password)

**Session Strategy:** JWT

**Session Duration:** 30 days

### Authentication Flow

1. **Registration:**
   - User submits email + password
   - Password hashed with bcrypt (10 rounds)
   - User created in database
   - Verification email sent
   - Auto sign-in after registration

2. **Login:**
   - User submits credentials
   - Password verified with bcrypt
   - JWT token generated
   - Session cookie set (HTTP-only, secure)
   - Redirect to dashboard

3. **Session Management:**
   - JWT stored in HTTP-only cookie
   - Token contains: `userId`, `email`, `name`, `image`
   - Middleware validates on protected routes
   - Auto-redirect if expired

### Protected Routes

**Middleware:** `src/middleware.ts`

```typescript
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/upload/:path*',
    '/diagnostics/:path*',
    '/diagrams/:path*',
    // ... all dashboard routes
  ]
}
```

**Protection Logic:**
- Check session existence
- Verify JWT validity
- Redirect to `/login` if unauthorized

---

## 📤 File Upload System

### UploadThing Integration

**Service:** UploadThing (built on AWS S3)

**Configuration:**
```typescript
const uploadthingConfig = {
  maxFileSize: "10MB",
  acceptedFileTypes: ["image/*", "application/pdf"],
  maxFileCount: 1
}
```

### Upload Flow

1. User selects file in `/upload` page
2. Client-side validation (size, type)
3. POST to UploadThing API
4. File uploaded to cloud storage
5. CDN URL returned
6. Metadata + URL saved to database

**Storage:**
- Files: UploadThing CDN
- Metadata: PostgreSQL (Diagram table)

**Access Control:**
- Files: Public CDN URLs
- Metadata: Database enforces ownership

---

## 🤖 AI Integration

### LLM Provider

**Primary:** OpenAI GPT-4 / Google Gemini Pro

**SDK:** Vercel AI SDK

### Diagnostic Chat Implementation

```typescript
// Simplified AI chat flow
const stream = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [
    {
      role: "system",
      content: "You are an expert vehicle diagnostician..."
    },
    {
      role: "user",
      content: userQuery
    }
  ],
  stream: true
});

// Stream to client
return new StreamingTextResponse(stream);
```

### Context Injection

**Provided to AI:**
- Vehicle type (aircraft/automotive/marine)
- Manufacturer & model
- Diagram URL (for vision models)
- Previous conversation history
- System/component being diagnosed

### Response Handling

- **Streaming:** Server-Sent Events (SSE)
- **Storage:** Save to Analysis table after completion
- **UI:** Real-time typing animation

---

## 🚀 Deployment

### Hosting Platform

**Provider:** Vercel

**Region:** Auto (global CDN)

**Plan:** Pro (for production features)

### Build Configuration

```javascript
// next.config.ts
export default {
  experimental: {
    serverActions: true
  },
  images: {
    domains: ['uploadthing.com']
  }
}
```

### Build Process

```json
{
  "scripts": {
    "build": "prisma migrate deploy && next build",
    "postinstall": "prisma generate"
  }
}
```

**Key Steps:**
1. Install dependencies
2. Generate Prisma client
3. Run database migrations
4. Build Next.js application
5. Deploy to Vercel edge network

### CI/CD Pipeline

**Trigger:** Push to `main` branch

**Process:**
1. GitHub detects push
2. Webhook to Vercel
3. Vercel clones repository
4. Runs `npm install`
5. Runs `prisma migrate deploy`
6. Runs `next build`
7. Deploys to production
8. Updates DNS

**Deployment URL:** https://circuit-iq.vercel.app

---

## ⚙️ Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="random-secret-string"
NEXTAUTH_URL="https://your-domain.com"

# AI Service
OPENAI_API_KEY="sk-..."
# OR
GOOGLE_API_KEY="..."

# File Upload
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."

# Email (Optional)
RESEND_API_KEY="..."

# Payments (Optional)
STRIPE_SECRET_KEY="..."
STRIPE_PUBLISHABLE_KEY="..."

# Monitoring (Optional)
SENTRY_DSN="..."
NEXT_PUBLIC_POSTHOG_KEY="..."
```

### Environment-Specific Config

| Environment | Database | Auth URL | AI Provider |
|-------------|----------|----------|-------------|
| **Development** | Local PostgreSQL | http://localhost:3000 | OpenAI |
| **Preview** | Neon (staging) | https://preview-*.vercel.app | OpenAI |
| **Production** | Neon (production) | https://circuit-iq.vercel.app | OpenAI/Gemini |

---

## ⚡ Performance Optimization

### Next.js Optimizations

1. **Server Components (RSC):**
   - Fetch data server-side
   - Reduce client JavaScript
   - Parallel data fetching

2. **Image Optimization:**
   - Next.js Image component
   - WebP conversion
   - Lazy loading

3. **Code Splitting:**
   - Automatic route-based splitting
   - Dynamic imports for heavy components

4. **Caching Strategy:**
   ```typescript
   // Static pages - cache 1 hour
   export const revalidate = 3600;
   
   // Dynamic pages - no cache
   export const dynamic = "force-dynamic";
   ```

### Database Optimizations

1. **Connection Pooling:**
   - Neon provides automatic pooling
   - Max connections: 100

2. **Query Optimization:**
   - Use `select` to limit fields
   - Parallel queries with `Promise.all()`
   - Indexed columns: `email`, `uploadedById`

3. **Pagination:**
   - Limit results with `take`
   - Cursor-based pagination for large datasets

### Frontend Optimizations

- **Bundle Size:** < 300KB (gzipped)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** 90+

---

## 🔒 Security

### Authentication Security

✅ **Password Hashing:** bcrypt with 10 salt rounds  
✅ **Session Tokens:** JWT with HTTP-only cookies  
✅ **CSRF Protection:** Built into NextAuth  
✅ **Secure Cookies:** Secure flag on HTTPS  

### API Security

✅ **Rate Limiting:** Vercel edge functions (1000 req/10s)  
✅ **Input Validation:** Zod schemas on all inputs  
✅ **SQL Injection:** Prevented by Prisma ORM  
✅ **XSS Protection:** React automatic escaping  

### Data Security

✅ **Encryption in Transit:** HTTPS/TLS 1.3  
✅ **Encryption at Rest:** Neon database encryption  
✅ **File Access:** Public CDN URLs (no sensitive data in files)  
✅ **Environment Secrets:** Vercel encrypted variables  

### Compliance

- **GDPR:** User data deletion available
- **Privacy Policy:** Available at `/privacy`
- **Terms of Service:** Available at `/terms`

---

## 📊 Monitoring & Analytics

### Error Tracking

**Sentry Integration:**
- Frontend errors
- API errors
- Performance monitoring
- User context tracking

### Product Analytics

**PostHog Integration:**
- Page views
- Feature usage
- User journeys
- A/B testing

### Uptime Monitoring

**Uptime Robot:**
- HTTP(S) monitoring
- API endpoint checks
- 5-minute intervals
- Email/SMS alerts

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| **1.0.0** | Dec 2025 | Initial release |
| **1.1.0** | Jan 2026 | Added automatic migrations |

---

## 📞 Support & Maintenance

**Technical Debt:** None currently identified  
**Known Limitations:**
- Single file upload (no batch yet)
- English language only
- Max 10MB file size

**Roadmap:**
- [ ] Batch upload support
- [ ] Multi-language AI responses
- [ ] Offline diagram viewing
- [ ] Mobile app (React Native)

---

**Last Updated:** January 3, 2026  
**Maintained by:** CircuitIQ Development Team  
**License:** Proprietary
