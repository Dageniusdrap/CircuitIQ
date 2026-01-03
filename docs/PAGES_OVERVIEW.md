# CircuitIQ Application Pages Overview

This document provides a comprehensive overview of all pages in the CircuitIQ application, organized by their functional groups.

---

## 🏠 Root Pages

### **Homepage** (`/`)
**Route:** `src/app/page.tsx`

**Purpose:** Landing page for new visitors and marketing

**Features:**
- Marketing header with navigation
- Hero section with main value proposition
- Features showcase section
- Customer testimonials
- Call-to-action section
- Footer with links and information

**User Type:** Public (unauthenticated users)

---

## 🔐 Authentication Pages (`(auth)` route group)

These pages handle user authentication and account management.

### 1. **Login** (`/login`)
**Route:** `src/app/(auth)/login/page.tsx`

**Purpose:** User sign-in

**Features:**
- Email/password login form
- Redirect to dashboard after successful authentication
- Links to registration and password reset

**User Type:** Unauthenticated

---

### 2. **Register** (`/register`)
**Route:** `src/app/(auth)/register/page.tsx`

**Purpose:** New user account creation

**Features:**
- Registration form with user details
- Account creation flow
- Automatic sign-in after registration

**User Type:** Unauthenticated

---

### 3. **Forgot Password** (`/forgot-password`)
**Route:** `src/app/(auth)/forgot-password/page.tsx`

**Purpose:** Password recovery initiation

**Features:**
- Email input for password reset request
- Sends reset link to user's email

**User Type:** Unauthenticated

---

### 4. **Reset Password** (`/reset-password`)
**Route:** `src/app/(auth)/reset-password/page.tsx`

**Purpose:** Set new password after reset request

**Features:**
- New password form
- Token validation
- Password strength requirements

**User Type:** Unauthenticated (with reset token)

---

### 5. **Verify Email** (`/verify-email`)
**Route:** `src/app/(auth)/verify-email/page.tsx`

**Purpose:** Email verification after registration

**Features:**
- Email verification confirmation
- Token validation
- Redirect to dashboard after verification

**User Type:** Authenticated (pending email verification)

---

## 📊 Dashboard Pages (`(dashboard)` route group)

These pages are the core application features for authenticated users.

### 1. **Dashboard** (`/dashboard`)
**Route:** `src/app/(dashboard)/dashboard/page.tsx`

**Purpose:** Main overview and analytics hub

**Features:**
- **Statistics Cards:**
  - Total Diagrams uploaded
  - Diagnostics Run count
  - Issues Resolved count
  - Average Resolution Time
- **Recent Analyses:** List of recent diagnostic sessions
- **Quick Actions:** Shortcuts to common tasks
- **Recent Documents Widget:** Last 8 uploaded diagrams

**Key Functionality:**
- Personalized welcome message
- Real-time statistics from database
- Quick navigation to other features

**User Type:** Authenticated

**Database Queries:**
- Diagram count by user
- Analysis count by user
- Successful analysis count
- Recent diagrams (last 10)

---

### 2. **Upload** (`/upload`)
**Route:** `src/app/(dashboard)/upload/page.tsx`

**Purpose:** Upload and manage circuit diagrams

**Features:**
- **Upload Zone:**
  - Drag-and-drop file upload
  - File type validation
  - Vehicle type selection (Aircraft, Automotive, Marine, Electric Vehicle)
  - Metadata input (manufacturer, model, year, system)
  
- **Recent Uploads Section:**
  - Last 5 uploaded diagrams
  - Vehicle type indicators with icons
  - Status badges (Pending, Processing, Completed)
  - Quick "Analyze Now" action
  - Delete functionality
  - Link to full diagram library

**Supported Actions:**
- Upload new diagrams
- View upload status
- Quick access to analysis
- Delete uploads

**User Type:** Authenticated

---

### 3. **Diagnostics** (`/diagnostics`)
**Route:** `src/app/(dashboard)/diagnostics/page.tsx`

**Purpose:** AI-powered diagnostic troubleshooting interface

**Features:**
- **Diagram Selection:**
  - Shows diagram selector if no diagram is selected
  - Dropdown to switch between diagrams
  
- **AI Teammate Chat:**
  - Real-time chat with AI diagnostic assistant
  - Context-aware based on selected diagram
  - Vehicle-specific troubleshooting (aircraft/automotive/marine)
  - Access to diagram image during chat
  
- **Sidebar:**
  - Diagram switcher widget
  - Shows up to 8 recent diagrams
  - Current diagram highlighting

**Key Functionality:**
- Interactive diagnostic conversations
- Diagram-specific context
- Multi-diagram support
- Persistent chat history

**User Type:** Authenticated

**Database Queries:**
- Fetch all user diagrams (last 50)
- Fetch selected diagram details

---

### 4. **Diagrams Library** (`/diagrams`)
**Route:** `src/app/(dashboard)/diagrams/page.tsx`

**Purpose:** Browse and manage all uploaded diagrams

**Features:**
- Full library view of all diagrams
- Search and filter capabilities
- Sorting options
- Grid/List view toggle
- Quick access to individual diagrams

**User Type:** Authenticated

---

### 5. **Diagram Detail** (`/diagrams/[id]`)
**Route:** `src/app/(dashboard)/diagrams/[id]/page.tsx`

**Purpose:** View individual diagram with detailed analysis

**Features:**
- Full diagram image viewer
- Diagram metadata (manufacturer, model, year, system)
- Analysis history for this diagram
- Download options
- Edit/Delete actions
- Quick start diagnostic session

**User Type:** Authenticated

**URL Parameter:** `id` - Diagram ID

---

### 6. **Procedures** (`/procedures`)
**Route:** `src/app/(dashboard)/procedures/page.tsx`

**Purpose:** Access maintenance and repair procedures

**Features:**
- Library of standard repair procedures
- Vehicle-specific procedures
- Step-by-step guides
- Related diagrams linking

**User Type:** Authenticated

---

### 7. **Search** (`/search`)
**Route:** `src/app/(dashboard)/search/page.tsx`

**Purpose:** Global search across diagrams and diagnostics

**Features:**
- Search across all content
- Filters by vehicle type, date, status
- Results categorized by type
- Quick navigation to results

**User Type:** Authenticated

---

### 8. **Profile** (`/profile`)
**Route:** `src/app/(dashboard)/profile/page.tsx`

**Purpose:** User profile and account information

**Features:**
- User information display
- Profile picture
- Account details
- Activity summary
- Edit profile functionality

**User Type:** Authenticated

---

### 9. **Settings** (`/settings`)
**Route:** `src/app/(dashboard)/settings/page.tsx`

**Purpose:** Application preferences and configuration

**Features:**
- General settings
- Notification preferences
- Display options
- Data export options

**User Type:** Authenticated

---

### 10. **Security Settings** (`/settings/security`)
**Route:** `src/app/(dashboard)/settings/security/page.tsx`

**Purpose:** Security and privacy settings

**Features:**
- Password change
- Two-factor authentication
- Active sessions management
- Delete account option

**User Type:** Authenticated

---

## 📄 Marketing/Info Pages (`(marketing)` route group)

These pages provide information and support for users and visitors.

### 1. **About** (`/about`)
**Purpose:** Company and product information

### 2. **Pricing** (`/pricing`)
**Purpose:** Subscription plans and pricing

### 3. **Documentation** (`/docs`)
**Purpose:** User documentation and guides

### 4. **API Documentation** (`/api-docs`)
**Purpose:** Developer API reference

### 5. **Blog** (`/blog`)
**Purpose:** Articles and updates

### 6. **Community** (`/community`)
**Purpose:** User community and forums

### 7. **Careers** (`/careers`)
**Purpose:** Job openings and recruitment

### 8. **Contact** (`/contact`)
**Purpose:** Contact form and support

### 9. **Help** (`/help`)
**Purpose:** Help center and FAQs

### 10. **Status** (`/status`)
**Purpose:** System status and uptime

### 11. **Security** (`/security`)
**Purpose:** Security practices and compliance

### 12. **Privacy** (`/privacy`)
**Purpose:** Privacy policy

### 13. **Terms** (`/terms`)
**Purpose:** Terms of service

**User Type:** Public (accessible to all)

---

## 🔌 API Endpoints

### 1. **Analyze API** (`/api/analyze`)
**Purpose:** Trigger diagram analysis using AI

### 2. **Auth API** (`/api/auth`)
**Purpose:** Authentication endpoints (NextAuth.js)

### 3. **Checkout API** (`/api/checkout`)
**Purpose:** Handle subscription payments

### 4. **Diagrams API** (`/api/diagrams`)
**Purpose:** CRUD operations for diagrams

### 5. **Feedback API** (`/api/feedback`)
**Purpose:** Submit user feedback

### 6. **Health API** (`/api/health`)
**Purpose:** System health check endpoint

### 7. **Teammate API** (`/api/teammate`)
**Purpose:** AI chat/diagnostic assistant endpoints

### 8. **UploadThing API** (`/api/uploadthing`)
**Purpose:** File upload handling

### 9. **Webhooks API** (`/api/webhooks`)
**Purpose:** Handle external webhooks (payments, etc.)

---

## 📱 Page Flow Diagram

```
┌─────────────────────────────────────────────┐
│           Homepage (/)                      │
│           - Landing page                    │
└──────────┬──────────────────────────────────┘
           │
           ├─► Login (/login) ──────┐
           │                         │
           └─► Register (/register) ─┤
                                     │
                                     ▼
           ┌─────────────────────────────────────┐
           │    Dashboard (/dashboard)           │
           │    - Main hub after authentication  │
           └─────────────────────────────────────┘
                     │
                     ├─► Upload (/upload)
                     │   - Upload diagrams
                     │
                     ├─► Diagrams (/diagrams)
                     │   - Browse library
                     │   └─► Detail (/diagrams/[id])
                     │
                     ├─► Diagnostics (/diagnostics)
                     │   - AI chat troubleshooting
                     │
                     ├─► Procedures (/procedures)
                     │   - Repair guides
                     │
                     ├─► Search (/search)
                     │   - Global search
                     │
                     ├─► Profile (/profile)
                     │   - User account
                     │
                     └─► Settings (/settings)
                         - Preferences
                         └─► Security (/settings/security)
```

---

## 🎯 Core User Journeys

### **New User Journey**
1. **Homepage** → Learn about CircuitIQ
2. **Register** → Create account
3. **Verify Email** → Confirm email address
4. **Dashboard** → See empty state with onboarding
5. **Upload** → Upload first diagram
6. **Diagnostics** → Start first diagnostic session

### **Returning User Journey**
1. **Login** → Sign in
2. **Dashboard** → View statistics and recent activity
3. **Diagrams** → Access diagram library
4. **Diagnostics** → Continue/start diagnostic session

### **Diagnostic Workflow**
1. **Upload** → Upload circuit diagram
2. **Dashboard** → See diagram in recent uploads
3. **Diagnostics** → Select diagram and start chat
4. **Teammate Chat** → Get AI-powered troubleshooting help
5. **Procedures** → Reference standard procedures

---

## 🗄️ Database Integration

Pages that query the database:

| Page | Data Fetched |
|------|-------------|
| **Dashboard** | User diagrams count, analyses count, resolved issues, recent diagrams |
| **Upload** | Recent 5 uploads |
| **Diagnostics** | All diagrams (last 50), selected diagram details |
| **Diagrams** | All user diagrams with filtering |
| **Diagram Detail** | Specific diagram with full metadata |

---

## 🔒 Authentication Requirements

| Route Group | Auth Required | Redirect |
|-------------|---------------|----------|
| `(auth)` | No | Dashboard (if already logged in) |
| `(dashboard)` | Yes | Login (if not logged in) |
| `(marketing)` | No | - |
| Root `/` | No | - |

---

## 📊 Page Statistics Summary

- **Total Pages:** 30+
- **Authentication Pages:** 5
- **Dashboard Pages:** 10
- **Marketing Pages:** 13
- **API Endpoints:** 9
- **Database-Connected Pages:** 5

---

**Last Updated:** January 3, 2026  
**Version:** 1.0  
**Maintained by:** CircuitIQ Development Team
