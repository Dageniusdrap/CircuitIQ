# PostHog Setup for CircuitIQ - Complete Guide

**Objective:** Add product analytics, feature flags, and session recording

**Time Required:** 15 minutes  
**Cost:** FREE (1M events/month)

---

## 🎯 What PostHog Does

PostHog is an all-in-one product analytics platform:
- **Event Tracking:** Track every user action (uploads, analyses, clicks)
- **Session Recording:** Watch user sessions like a movie
- **Funnels:** See where users drop off
- **Feature Flags:** Roll out features gradually
- **A/B Testing:** Test different UX variations
- **User Profiles:** See individual user journeys
- **Heatmaps:** Visualize where users click

---

## 📋 Setup Instructions

### Step 1: Create PostHog Account (3 minutes)

1. **Go to:** https://app.posthog.com/signup
2. **Sign up with:**
   - Email + password OR
   - Google account OR
   - GitHub account

3. **Choose Deployment:**
   - **PostHog Cloud** (recommended, free tier)
   - Self-hosted (for full data control)

4. **Create Organization:**
   ```
   Organization Name: CircuitIQ
   What will you use PostHog for?: Product Analytics
   Company Size: Startup / Small Business
   ```

5. **Free Plan Includes:**
   - ✅ 1M events/month
   - ✅ Unlimited users
   - ✅ 90-day data retention
   - ✅ Session recordings (5,000/month)
   - ✅ Feature flags
   - ✅ All analytics features

### Step 2: Create Project (2 minutes)

1. **After signup**, PostHog creates a default project
2. **Rename it:**
   ```
   Project Name: CircuitIQ Production
   Website URL: https://circuit-iq.vercel.app
   ```

3. **Save your API key:**
   - Go to: Settings → Project → API Keys
   - Copy: **Project API Key** (starts with `phc_`)
   ```env
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

### Step 3: Install PostHog SDK (5 minutes)

**Run in CircuitIQ directory:**

```bash
# Install PostHog JavaScript SDK
npm install posthog-js --save
```

**Create PostHog provider:** `/src/lib/posthog.ts`

```typescript
import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      
      // Features
      autocapture: true, // Auto-track clicks, page views
      capture_pageview: true, // Track page navigation
      capture_pageleave: true, // Track when users leave pages
      
      // Session Recording
      enable_recording_console_log: true, // Include console logs
      session_recording: {
        maskAllInputs: true, // Hide passwords/sensitive inputs
        maskTextSelector: '.sensitive', // Hide elements with this class
      },
      
      // Privacy
      opt_out_capturing_by_default: false,
      respect_dnt: true, // Respect "Do Not Track" browser setting
      
      // Performance
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          posthog.debug() // See events in console during dev
        }
      },
    })
  }
}

// Enable for authenticated users
export const identifyUser = (userId: string, email?: string, name?: string) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, {
      email,
      name,
    })
  }
}

// Clear user on logout
export const resetUser = () => {
  if (typeof window !== 'undefined') {
    posthog.reset()
  }
}
```

**Update root layout:** `/src/app/layout.tsx`

```typescript
"use client"

import { useEffect } from 'react'
import { initPostHog } from '@/lib/posthog'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog()
  }, [])

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Add user identification:** `/src/components/providers/auth-provider.tsx`

```typescript
"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { identifyUser, resetUser } from "@/lib/posthog"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      identifyUser(
        session.user.id,
        session.user.email || undefined,
        session.user.name || undefined
      )
    } else {
      resetUser()
    }
  }, [session])

  return <>{children}</>
}
```

### Step 4: Add Environment Variables (2 minutes)

1. **Local Development** - Add to `.env.local`:
   ```env
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

2. **Vercel Production**:
   ```bash
   # Vercel Dashboard → Settings → Environment Variables
   # Add for Production, Preview, Development:
   
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

### Step 5: Track Custom Events (3 minutes)

**Add event tracking to key user actions:**

**1. Track Diagram Upload:**
`/src/app/(dashboard)/upload/page.tsx`
```typescript
import posthog from 'posthog-js'

// After successful upload
posthog.capture('diagram_uploaded', {
  vehicleType: selectedVehicleType,
  fileSize: file.size,
  fileType: file.type,
  fileName: file.name,
})
```

**2. Track AI Analysis:**
`/src/actions/diagram.ts`
```typescript
// After analysis completes
posthog.capture('ai_analysis_completed', {
  diagramId: diagram.id,
  vehicleType: diagram.vehicleType,
  confidence: analysisResult.confidence,
  processingTime: Date.now() - startTime,
})
```

**3. Track Diagnostics Session:**
`/src/app/(dashboard)/diagnostics/page.tsx`
```typescript
// When user starts diagnostic session
posthog.capture('diagnostic_session_started', {
  diagramId: selectedDiagram.id,
  vehicleType: selectedDiagram.vehicleType,
})

// When user sends message
posthog.capture('diagnostic_message_sent', {
  messageLength: message.length,
  sessionId: sessionId,
})
```

**4. Track Feature Usage:**
```typescript
// Search
posthog.capture('search_performed', {
  query: searchQuery,
  resultsCount: results.length,
})

// Filter
posthog.capture('category_filtered', {
  category: selectedCategory,
})

// Feedback
posthog.capture('feedback_submitted', {
  type: feedbackType, // bug, feature, improvement
  rating: rating,
})
```

---

## 📊 Creating Insights & Dashboards

### 1. User Engagement Dashboard

**PostHog Dashboard → New Dashboard → "User Engagement"**

**Add these insights:**

**A. Active Users**
```
Metric: Unique Users
Event: $pageview
Date Range: Last 30 days
Breakdown: By day
```

**B. Top Features**
```
Metric: Total Events
Events: diagram_uploaded, ai_analysis_completed, diagnostic_session_started
Date Range: Last 7 days
Visualization: Bar chart
```

**C. Upload Funnel**
```
Metric: Funnel
Steps:
  1. Visit /upload
  2. File selected (custom event: file_selected)
  3. Upload started (custom event: upload_started)
  4. Upload completed (diagram_uploaded)
Conversion window: 10 minutes
```

**D. Session Recording**
```
Filter: Users who had errors OR completed diagnostic session
Criteria: Contains event "ai_analysis_completed"
Limit: 100 recordings
```

### 2. Product Performance Dashboard

**New Dashboard → "Performance Metrics"**

**Add these insights:**

**A. Upload Success Rate**
```
Metric: Ratio
Numerator: diagram_uploaded
Denominator: upload_started
Date Range: Last 30 days
Goal: > 95%
```

**B. AI Analysis Time**
```
Metric: Average Property Value
Event: ai_analysis_completed
Property: processingTime
Date Range: Last 7 days
Visualization: Line chart
```

**C. User Retention**
```
Metric: Retention
Event: $pageview
Returning event: Any event
Date Range: Last 8 weeks
Cohort by: Week
```

**D. Feature Adoption**
```
Metric: Total Events by Unique Users
Events: 
  - feedback_submitted
  - search_performed
  - diagnostic_session_started
Date Range: Last 30 days
Breakdown: By event
```

---

## 🎥 Session Recording

### Enable Session Recording

**Auto-record for specific users:**

```typescript
// In your PostHog init
posthog.init(apiKey, {
  // ... other config
  
  session_recording: {
    // Record 10% of all sessions
    sampleRate: 0.1,
    
    // Record 100% of sessions with errors
    recordCrossOriginIframes: true,
    
    // Privacy: Mask sensitive data
    maskAllInputs: true,
    maskTextSelector: '.sensitive, .password-field',
    
    // Include console logs in recordings
    recordConsole: true,
  },
})
```

**Manually start recording for specific users:**

```typescript
// Record session for users who give feedback
if (userSubmittedFeedback) {
  posthog.startSessionRecording()
}

// Or record for specific user roles
if (session?.user?.role === 'ADMIN') {
  posthog.startSessionRecording()
}
```

### Watching Session Replays

1. **PostHog Dashboard → Session Recordings**
2. **Filter by:**
   - Errors occurred
   - Specific events (e.g., "upload failed")
   - User properties (email, plan)
   - Duration (>5 minutes = engaged users)
3. **Watch recordings:**
   - See exactly what user saw
   - View console logs
   - See network requests
   - Identify UX issues

---

## 🚩 Feature Flags

### Create a Feature Flag

**Use Case:** Gradually roll out new AI model

1. **PostHog → Feature Flags → New Feature Flag**
   ```
   Flag Key: new-ai-model
   Name: GPT-4 Turbo Analysis
   Description: Roll out new AI model gradually
   ```

2. **Set Rollout Strategy:**
   ```
   Release Conditions:
   - 10% of users (random)
   - OR user email contains "@circuitiq.com" (team testing)
   - OR user plan = ENTERPRISE
   ```

3. **Use in code:**
   ```typescript
   import posthog from 'posthog-js'
   
   // Check if feature is enabled
   const useNewAIModel = posthog.isFeatureEnabled('new-ai-model')
   
   if (useNewAIModel) {
     // Use GPT-4 Turbo
     result = await analyzeWithGPT4Turbo(diagram)
   } else {
     // Use standard GPT-4
     result = await analyzeWithGPT4(diagram)
   }
   
   // Track which model was used
   posthog.capture('ai_model_used', {
     model: useNewAIModel ? 'gpt-4-turbo' : 'gpt-4',
     diagramId: diagram.id,
   })
   ```

4. **Monitor Results:**
   - Track conversion rates for each variant
   - Compare error rates
   - Measure performance (processing time)

5. **Full Rollout:**
   - If successful, increase to 50%, then 100%
   - If unsuccessful, rollback instantly

---

## 📈 Key Metrics to Track

### User Acquisition
- **New Sign-ups:** Count of `user_registered` events
- **Activation Rate:** % who upload first diagram
- **Traffic Sources:** UTM parameters

### User Engagement  
- **DAU/MAU:** Daily/Monthly active users
- **Session Duration:** Average time on site
- **Feature Usage:** Which features are most used
- **Return Rate:** How often users come back

### Product Performance
- **Upload Success Rate:** % of successful uploads
- **AI Analysis Time:** Average processing time
- **Error Rate:** % of sessions with errors
- **Support Tickets:** Correlation with app events

### Business Metrics
- **Conversion Funnel:**
  1. Visit homepage
  2. Sign up
  3. Upload diagram
  4. Complete analysis
  5. Upgrade to paid

- **Revenue Metrics:**
  - Free → Paid conversion rate
  - Trial → Subscription rate
  - Churn rate

---

## 🎯 Advanced Analytics

### Cohort Analysis

**Compare different user groups:**

```
Cohort 1: Users who signed up in December
Cohort 2: Users who signed up in January

Compare:
- Retention rates
- Feature adoption
- Upgrade rates
```

### Path Analysis

**See user journeys:**

```
Start Event: user_logged_in
End Event: diagnostic_session_started

PostHog will show:
- Most common paths users take
- Where users drop off
- Unexpected detours
```

### Correlation Analysis

**Find patterns:**

```
Target Event: subscription_upgraded

PostHog finds:
- Users who upgraded used diagnostics 5+ times
- Users who upgraded uploaded >10 diagrams
- Users who invited team members = 3x more likely to upgrade
```

---

## 💰 Cost Management

### Free Tier (Generous!)
- **1M events/month** (enough for ~10,000 active users)
- **5,000 session recordings/month**
- **Unlimited feature flags**
- **90-day retention**

### If You Exceed Limits

**Check usage:**
```
PostHog → Settings → Billing
See breakdown by event type
```

**Reduce events:**
```typescript
// Sample page views (track 50% instead of 100%)
posthog.init(apiKey, {
  capture_pageview: false,
})

// Manually track important pages only
posthog.capture('$pageview', { 
  $current_url: window.location.href 
})

// Only track specific user actions (not all clicks)
autocapture: false,
```

**Upgrade if needed:**
- **$0.00031 per event** after 1M/month
- **$0.005 per session recording** after 5,000/month
- Typically $50-200/month for fast-growing startups

---

## 🔒 Privacy & GDPR Compliance

### User Opt-Out

```typescript
// Let users opt out of tracking
posthog.opt_out_capturing()

// Check if user opted out
posthog.has_opted_out_capturing()

// Add opt-out link in settings
<button onClick={() => posthog.opt_out_capturing()}>
  Disable Analytics
</button>
```

### GDPR Data Deletion

```typescript
// Delete user data (GDPR right to be forgotten)
// In your API when user deletes account:

fetch('https://app.posthog.com/api/person/' + userId + '/delete', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer ' + POSTHOG_PERSONAL_API_KEY,
  },
})
```

### Cookie Consent

```typescript
// Don't init PostHog until user accepts cookies
if (userAcceptedCookies) {
  initPostHog()
}
```

---

## ✅ Setup Checklist

- [ ] PostHog account created
- [ ] CircuitIQ project created
- [ ] API key saved
- [ ] `posthog-js` installed
- [ ] PostHog initialized in layout
- [ ] User identification set up
- [ ] Environment variables added (local + Vercel)
- [ ] Custom events tracked (upload, analysis, diagnostics)
- [ ] Dashboard created with key metrics
- [ ] Session recording enabled
- [ ] Privacy settings configured

---

## 📊 Expected Results

### Week 1:
- 📈 See real user behavior patterns
- 🎥 Watch first session recordings
- 📊 Track daily active users

### Week 2-4:
- 🔍 Identify drop-off points in funnels
- ⚡ Find slow/confusing features
- 🎯 Optimize based on data

### Month 2+:
- 📈 Data-driven feature decisions
- 🚀 Improved conversion rates
- 💡 Deep user insights

---

## 📞 PostHog Resources

- **Dashboard:** https://app.posthog.com
- **Docs:** https://posthog.com/docs
- **Community:** https://posthog.com/community
- **Support:** support@posthog.com

---

## 🎉 PostHog + Sentry = Complete Observability

**Use both together:**
- **PostHog:** What users are doing (analytics)
- **Sentry:** What's breaking (errors)

**Workflow:**
1. PostHog shows users dropping off at upload page
2. Check Sentry for upload errors
3. Fix error, deploy
4. PostHog confirms funnel improved

**You'll have complete visibility into your product!** 🚀
