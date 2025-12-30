# CircuitIQ Monitoring & Analytics Setup Guide

**Objective:** Set up production monitoring, error tracking, and analytics for CircuitIQ

---

## 🎯 Recommended Monitoring Stack

### 1. **Error Tracking: Sentry** ⭐ PRIORITY 1

#### Why Sentry?
- Captures JavaScript errors in real-time
- Server-side error tracking (API routes)
- Performance monitoring
- Free tier: 5,000 events/month

#### Setup Instructions

**Step 1: Create Sentry Account**
```bash
# Visit: https://sentry.io/signup/
```

**Step 2: Install Sentry SDK**
```bash
cd /Users/dradrigapatrick/Desktop/CircuitIQ
npm install @sentry/nextjs --save
```

**Step 3: Initialize Sentry**
```bash
npx @sentry/wizard@latest -i nextjs
```

This will create:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

**Step 4: Add Environment Variable to Vercel**
```bash
# In Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=your-auth-token
```

**Step 5: Test Error Tracking**
Create a test error to verify:
```typescript
// Add to any page temporarily
throw new Error("Sentry test error");
```

---

### 2. **Analytics: PostHog** ⭐ PRIORITY 2

#### Why PostHog?
- Open-source analytics
- Privacy-friendly (GDPR compliant)
- Event tracking + session recording
- Free tier: 1M events/month

#### Setup Instructions

**Step 1: Create PostHog Account**
```bash
# Visit: https://app.posthog.com/signup
# Or self-host: https://posthog.com/docs/self-host
```

**Step 2: Install PostHog**
```bash
npm install posthog-js --save
```

**Step 3: Create PostHog Provider**
Create `src/lib/posthog.ts`:
```typescript
import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      },
    })
  }
}
```

**Step 4: Add to Root Layout**
Update `src/app/layout.tsx`:
```typescript
'use client'
import { useEffect } from 'react'
import { initPostHog } from '@/lib/posthog'

export default function RootLayout({ children }) {
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

**Step 5: Add Environment Variables**
```bash
# In Vercel → Environment Variables
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Step 6: Track Custom Events**
Example: Track diagram uploads:
```typescript
import posthog from 'posthog-js'

// In upload success handler
posthog.capture('diagram_uploaded', {
  vehicleType: selectedVehicleType,
  fileSize: file.size,
  fileType: file.type,
})
```

---

### 3. **Uptime Monitoring: UptimeRobot** ⭐ PRIORITY 3

#### Why UptimeRobot?
- Free monitoring (50 monitors)
- 5-minute check intervals
- Email/SMS alerts
- Status page generation

#### Setup Instructions

**Step 1: Create Account**
```bash
# Visit: https://uptimerobot.com/signUp
```

**Step 2: Add Monitor**
1. Dashboard → "Add New Monitor"
2. **Monitor Type:** HTTP(s)
3. **URL:** `https://circuit-iq.vercel.app`
4. **Monitoring Interval:** 5 minutes
5. **Alert Contacts:** Your email

**Step 3: Add API Health Check**
Create `/src/app/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
```

**Step 4: Monitor the Health Endpoint**
Add second monitor for: `https://circuit-iq.vercel.app/api/health`

---

### 4. **Performance: Vercel Analytics** ⭐ BUILT-IN

#### Enable Vercel Analytics

**Step 1: Enable in Vercel Dashboard**
1. Go to Project Settings
2. Click "Analytics" tab
3. Toggle "Enable Analytics"

**Step 2: Add to Package**
```bash
npm install @vercel/analytics --save
```

**Step 3: Update Root Layout**
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Metrics Tracked:**
- Core Web Vitals (LCP, FID, CLS)
- Page load times
- Geographic distribution
- Device types

---

### 5. **Logging: Logtail (BetterStack)** ⭐ OPTIONAL

#### Why Logtail?
- Centralized log aggregation
- Search and filter logs
- Real-time log streaming
- Free tier: 1GB/month

#### Setup Instructions

**Step 1: Create Account**
```bash
# Visit: https://betterstack.com/logtail
```

**Step 2: Install SDK**
```bash
npm install @logtail/node --save
```

**Step 3: Create Logger Utility**
Create `src/lib/logger.ts`:
```typescript
import { Logtail } from '@logtail/node'

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN!)

export const logger = {
  info: (message: string, context?: object) => {
    logtail.info(message, context)
  },
  error: (message: string, error?: Error, context?: object) => {
    logtail.error(message, { error: error?.stack, ...context })
  },
  warn: (message: string, context?: object) => {
    logtail.warn(message, context)
  },
}

// Flush logs before process exit
process.on('beforeExit', async () => {
  await logtail.flush()
})
```

**Step 4: Use in API Routes**
```typescript
import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  try {
    logger.info('Diagram analysis started', { diagramId })
    // ... your code
  } catch (error) {
    logger.error('Analysis failed', error as Error, { diagramId })
    throw error
  }
}
```

**Step 5: Add Environment Variable**
```bash
LOGTAIL_SOURCE_TOKEN=your_source_token_here
```

---

## 📊 Monitoring Dashboard Setup

### Create a Unified Dashboard

**Option 1: Grafana (Advanced)**
- Aggregate all metrics in one place
- Custom visualizations
- Self-hosted or cloud

**Option 2: Simple Status Page**
Create `src/app/status/page.tsx`:
```typescript
import { prisma } from '@/lib/db'

export default async function StatusPage() {
  const checks = {
    database: false,
    openai: false,
    uploadthing: false,
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = true
  } catch {}

  // Add other health checks

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">System Status</h1>
      
      <div className="space-y-4">
        <StatusItem name="Database" status={checks.database} />
        <StatusItem name="OpenAI API" status={checks.openai} />
        <StatusItem name="File Storage" status={checks.uploadthing} />
      </div>
    </div>
  )
}
```

---

## 🚨 Alert Configuration

### Critical Alerts (Immediate Notification)

**Set up alerts for:**
1. **API Error Rate > 5%**
   - Configure in Sentry: Alerts → Create Alert Rule
   - Trigger: Error count > 10 in 1 minute

2. **Site Down**
   - UptimeRobot sends automatic email/SMS

3. **Database Connection Lost**
   - Monitor `/api/health` endpoint
   - Alert if 3 consecutive failures

### Warning Alerts (Review Daily)

**Set up for:**
1. **Slow Response Times**
   - Vercel Analytics: Page load > 3 seconds
   
2. **High OpenAI Costs**
   - OpenAI Dashboard: Usage > $50/day

3. **Storage Quota**
   - UploadThing Dashboard: 80% quota used

---

## 📈 Key Metrics to Track

### Business Metrics
- **Daily Active Users (DAU)**
- **Diagrams Uploaded per Day**
- **AI Analyses Completed**
- **Average Session Duration**

### Technical Metrics
- **API Response Time** (target: <500ms)
- **Error Rate** (target: <1%)
- **Database Query Time** (target: <100ms)
- **OpenAI API Latency** (typical: 2-5s)

### User Experience Metrics
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

---

## 🔧 Implementation Priority

### Week 1: Essential Monitoring
1. ✅ Enable Vercel Analytics (5 min)
2. ✅ Set up UptimeRobot (10 min)
3. ✅ Create `/api/health` endpoint (15 min)

### Week 2: Error Tracking
1. ✅ Install Sentry (30 min)
2. ✅ Configure error boundaries (20 min)
3. ✅ Test error reporting (10 min)

### Week 3: User Analytics
1. ✅ Install PostHog (20 min)
2. ✅ Add custom events (30 min)
3. ✅ Set up funnels (10 min)

### Future: Advanced Logging
1. ⏳ Install Logtail (optional)
2. ⏳ Create custom logging utility
3. ⏳ Set up log-based alerts

---

## 💰 Cost Estimate

| Service | Free Tier | Estimated Cost (with growth) |
|---------|-----------|------------------------------|
| **Vercel** | Hobbyanalysis included | $0/month (included in hosting) |
| **Sentry** | 5K events/month | $0-26/month (Team plan if needed) |
| **PostHog** | 1M events/month | $0-50/month (Scale plan if needed) |
| **UptimeRobot** | 50 monitors | $0/month (free forever) |
| **Logtail** | 1GB/month | $0-15/month (optional) |
| **TOTAL** | **$0/month initially** | **$0-91/month at scale** |

---

## 📋 Post-Setup Checklist

After setting up monitoring:
- [ ] Verify Sentry is catching errors (create test error)
- [ ] Check Vercel Analytics shows real visitors
- [ ] Confirm UptimeRobot sends test alert
- [ ] Test PostHog event tracking
- [ ] Review all metric dashboards
- [ ] Set up email notifications
- [ ] Document incident response procedures

---

## 📞 Support Resources

- **Sentry Docs:** https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **PostHog Docs:** https://posthog.com/docs
- **Vercel Analytics:** https://vercel.com/docs/analytics
- **UptimeRobot API:** https://uptimerobot.com/api/

---

**Next Steps:** Start with Vercel Analytics and UptimeRobot (both take <15 minutes total), then add Sentry for error tracking.
