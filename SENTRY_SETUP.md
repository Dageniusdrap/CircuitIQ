# Sentry Setup for CircuitIQ - Complete Guide

**Objective:** Add production-grade error tracking and performance monitoring

**Time Required:** 20 minutes  
**Cost:** FREE (5,000 errors/month)

---

## 🎯 What Sentry Does

Sentry automatically catches and reports:
- **Frontend Errors:** React errors, JavaScript exceptions
- **API Errors:** Server-side crashes, database failures  
- **Performance Issues:** Slow API responses, memory leaks
- **User Context:** What the user was doing when error occurred
- **Stack Traces:** Exact line of code that failed
- **Release Tracking:** Track errors by deployment version

---

## 📋 Setup Instructions

### Step 1: Create Sentry Account (3 minutes)

1. **Go to:** https://sentry.io/signup/
2. **Sign up with:**
   - GitHub account (recommended) OR
   - Email + password

3. **Create Organization:**
   ```
   Organization Name: CircuitIQ
   Team Members: (add later)
   ```

4. **Select Plan:**
   - Choose **"Developer"** (FREE)
   - 5,000 errors/month
   - 10,000 performance transactions/month
   - 30-day event retention

### Step 2: Create Project (2 minutes)

1. **After signup**, Sentry will ask you to create a project
2. **Select Platform:** Next.js
3. **Project Details:**
   ```
   Project Name: circuitiq-production
   Team: #general (default)
   Alert Settings: Enable default alerts
   ```

4. **Click:** "Create Project"

5. **Save these values** (shown on next screen):
   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://[key]@[org].ingest.us.sentry.io/[project-id]
   SENTRY_AUTH_TOKEN=[your-auth-token]
   SENTRY_ORG=[your-org-name]
   SENTRY_PROJECT=circuitiq-production
   ```

### Step 3: Install Sentry SDK (5 minutes)

**Run these commands in CircuitIQ directory:**

```bash
# 1. Install Sentry packages
npm install @sentry/nextjs --save

# 2. Generate configuration files automatically
npx @sentry/wizard@latest -i nextjs

# Follow the prompts:
# - Login to Sentry? Yes
# - Select project: circuitiq-production
# - Enable Performance Monitoring? Yes (recommended)
# - Enable Session Replay? Yes (optional, shows user interactions)
# - Sample Rate: 10% (start conservatively)
```

**What the wizard creates:**
- `sentry.client.config.ts` - Frontend error tracking
- `sentry.server.config.ts` - API error tracking
- `sentry.edge.config.ts` - Edge function tracking
- `instrumentation.ts` - Initialization file
- Updates `next.config.ts` - Adds Sentry plugin

### Step 4: Add Environment Variables (3 minutes)

1. **Local Development** - Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   SENTRY_AUTH_TOKEN=your-auth-token
   SENTRY_ORG=your-org-name
   SENTRY_PROJECT=circuitiq-production
   ```

2. **Vercel Production** - Add to Vercel Dashboard:
   ```bash
   # Go to: Vercel Dashboard → CircuitIQ → Settings → Environment Variables
   
   # Add these variables for Production, Preview, Development:
   NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   SENTRY_AUTH_TOKEN=your-auth-token
   SENTRY_ORG=your-org-name
   SENTRY_PROJECT=circuitiq-production
   ```

3. **Important:** Mark `SENTRY_AUTH_TOKEN` as **Sensitive** in Vercel

### Step 5: Test Error Tracking (2 minutes)

**Create a test error button:**

Add to `/src/app/dashboard/page.tsx` temporarily:

```tsx
export default function DashboardPage() {
  return (
    <div>
      {/* Your existing dashboard content */}
      
      {/* TEMPORARY TEST BUTTON - Remove after testing */}
      <button 
        onClick={() => {
          throw new Error("Sentry Test Error - Please work!");
        }}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Test Sentry Error
      </button>
    </div>
  )
}
```

**Test it:**
1. Go to https://circuit-iq.vercel.app/dashboard
2. Click "Test Sentry Error" button
3. Check Sentry Dashboard (https://sentry.io/)
4. You should see the error appear within 30 seconds
5. **Remove the test button** after confirmation

### Step 6: Configure Error Alerts (3 minutes)

1. **Go to:** Sentry Dashboard → Alerts
2. **Create Alert Rule:**
   ```
   Alert Name: Critical Frontend Errors
   When: An event occurs
   Conditions:
     - Event Type: Error
     - Level: Error OR Fatal
     - Frequency: >= 5 events in 1 minute
   Then: Send notification to:
     - Email: your-email@example.com
     - Slack: (optional, set up webhook)
   ```

3. **Create Second Alert:**
   ```
   Alert Name: API Errors
   When: An event occurs
   Conditions:
     - Event Type: Error
     - Tag: environment = production
     - Component: API
   Then: Send email immediately
   ```

### Step 7: Set Up Releases (Optional, 5 minutes)

**Track which errors belong to which deployment:**

Update `package.json` scripts:
```json
{
  "scripts": {
    "build": "next build",
    "sentry:upload": "npx @sentry/cli releases new \"$npm_package_version\" && npx @sentry/cli releases set-commits \"$npm_package_version\" --auto && npx @sentry/cli releases finalize \"$npm_package_version\"",
    "deploy": "npm run build && npm run sentry:upload"
  }
}
```

**In Vercel, update build command:**
```bash
# Vercel Dashboard → Settings → Build & Development
Build Command: npm run build
```

---

## 📊 Sentry Configuration

### Performance Monitoring Settings

Edit `sentry.client.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.npm_package_version,
  
  // Ignore known errors
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
  ],
  
  // Custom tags
  initialScope: {
    tags: {
      app: "circuitiq",
      component: "frontend",
    },
  },
});
```

Edit `sentry.server.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: 0.2, // 20% for server (critical)
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.npm_package_version,
  
  // Custom tags
  initialScope: {
    tags: {
      app: "circuitiq",
      component: "api",
    },
  },
});
```

### Error Filtering

**Reduce noise by filtering out non-critical errors:**

```typescript
Sentry.init({
  // ... other config
  
  beforeSend(event, hint) {
    // Don't send development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    
    // Filter out known browser extension errors
    if (event.exception?.values?.[0]?.value?.includes('chrome-extension')) {
      return null;
    }
    
    // Add custom context
    event.tags = {
      ...event.tags,
      userId: getCurrentUserId(), // Your function
    };
    
    return event;
  },
});
```

---

## 🔍 Using Sentry in Your Code

### Manual Error Capture

```typescript
import * as Sentry from "@sentry/nextjs";

// Capture an error
try {
  await analyzeCircuit(diagram);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      diagramId: diagram.id,
      vehicleType: diagram.vehicleType,
    },
    level: "error",
  });
  throw error; // Re-throw if needed
}
```

### Custom Messages

```typescript
// Log a message
Sentry.captureMessage("User uploaded invalid file format", "warning");

// Track breadcrumb (user action)
Sentry.addBreadcrumb({
  category: "user-action",
  message: "User clicked analyze button",
  level: "info",
  data: {
    diagramId: "abc123",
  },
});
```

### User Context

```typescript
// Set user context (do this in layout or auth provider)
import { useSession } from "next-auth/react";
import * as Sentry from "@sentry/nextjs";

useEffect(() => {
  if (session?.user) {
    Sentry.setUser({
      id: session.user.id,
      email: session.user.email,
      username: session.user.name,
    });
  } else {
    Sentry.setUser(null);
  }
}, [session]);
```

---

## 📈 Monitoring Best Practices

### 1. Set Up Issue Ownership

**Assign errors to team members:**
```yaml
# Create file: .github/CODEOWNERS or in Sentry
# API errors → Backend team
/src/app/api/** @backend-team

# Frontend errors → Frontend team
/src/components/** @frontend-team
/src/app/** @frontend-team
```

### 2. Create Custom Dashboards

**Sentry Dashboard → Custom Dashboards:**
- **Critical Errors:** Errors affecting >10 users
- **API Performance:** P95 response times
- **User Impact:** Unique users affected
- **Error Trends:** Week-over-week comparison

### 3. Weekly Review Routine

**Every Monday:**
1. Review new unresolved errors
2. Triage by impact (users affected)
3. Assign to developers
4. Mark resolved issues
5. Update ignore rules for noise

### 4. Set SLOs (Service Level Objectives)

**Example targets:**
- **Error Rate:** <0.1% of requests
- **API Response Time:** <500ms (P95)
- **Critical Errors:** 0 per day
- **Resolution Time:** <24 hours

---

## 🚨 Alert Configuration

### Recommended Alerts

| Alert Name | Condition | Action |
|-----------|-----------|--------|
| **Critical Error Spike** | 10+ errors in 5 min | Email + Slack immediately |
| **API Down** | 5+ 500 errors in 1 min | Email + SMS |
| **Performance Degradation** | P95 > 2s for 10 min | Email only |
| **High Error Rate** | Error rate > 1% | Email (hourly digest) |

### Alert Channels

1. **Email:** Always enabled
2. **Slack:** High priority errors
3. **PagerDuty:** Critical production issues
4. **Discord:** Team notifications

---

## 💰 Cost Management

### Free Tier Limits:
- **5,000 errors/month**
- **10,000 performance units/month**
- **30-day retention**

### If You Hit Limits:

**Option 1: Optimize Sample Rates**
```javascript
tracesSampleRate: 0.05, // Reduce from 10% to 5%
replaysSessionSampleRate: 0.05, // Reduce replay rate
```

**Option 2: Filter Aggressively**
- Ignore non-critical errors
- Filter out bot traffic
- Remove duplicate errors

**Option 3: Upgrade to Team Plan**
- **$29/month** base
- **50,000 errors/month**
- **+$0.00045 per additional error**
- **90-day retention**

---

## 📊 What You'll See in Sentry

### Error Dashboard Shows:
1. **Error Count:** Total errors today/week/month
2. **Affected Users:** How many users hit errors
3. **Error Types:** Top 10 error messages
4. **Error Locations:** Which files/functions fail most
5. **Browser/OS:** User environment data
6. **Stack Traces:** Exact code line and context

### Performance Dashboard Shows:
1. **Transaction Timing:** API endpoint response times
2. **Database Queries:** Slow queries identified
3. **External Calls:** OpenAI API latency
4. **Frontend Metrics:** Page load, LCP, FID, CLS
5. **User Flow:** Where users experience slowness

---

## ✅ Setup Checklist

After completing setup:

- [ ] Sentry account created
- [ ] CircuitIQ production project created
- [ ] SDK installed (`@sentry/nextjs`)
- [ ] Configuration files generated
- [ ] Environment variables added (local + Vercel)
- [ ] Test error confirmed in Sentry dashboard
- [ ] Email alerts configured
- [ ] Performance monitoring enabled
- [ ] User context set up
- [ ] Release tracking configured (optional)

---

## 🎯 Expected Benefits

### Week 1:
- 🐛 Catch first production error before user reports it
- 📊 See real performance data

### Week 2-4:
- 🔍 Identify patterns in errors
- ⚡ Fix performance bottlenecks
- 📈 Reduce error rate by 50%

### Month 2+:
- ✅ Near-zero unhandled errors
- 📉 Faster debugging (stack traces)
- 🎯 Data-driven optimization

---

## 📞 Sentry Resources

- **Dashboard:** https://sentry.io/
- **Documentation:** https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Discord Community:** https://discord.gg/sentry
- **Support:** support@sentry.io

---

## 🎉 Next Steps

1. **Complete installation** using wizard
2. **Add environment variables** to Vercel
3. **Deploy to production**
4. **Test with sample error**
5. **Configure alerts**
6. **Monitor dashboard weekly**

**Sentry will transform your debugging experience!** 🚀
