# UptimeRobot Setup - Step-by-Step Guide

**Objective:** Monitor CircuitIQ's health endpoint and get instant email alerts if the site goes down

**Time Required:** 5 minutes  
**Cost:** FREE (50 monitors, 5-minute intervals)

---

## 📋 What UptimeRobot Will Monitor

- **Health Endpoint:** `https://circuit-iq.vercel.app/api/health`
- **Check Frequency:** Every 5 minutes
- **Alerts:** Email notification if site is down for 2 consecutive checks
- **Dashboard:** View uptime history and response times

---

## 🚀 Setup Instructions

### Step 1: Create Account (2 minutes)

1. **Go to:** https://uptimerobot.com
2. **Click:** "Register for FREE" (top-right corner)
3. **Choose Registration Method:**
   - **Option A:** Sign up with Google (fastest)
   - **Option B:** Sign up with GitHub
   - **Option C:** Enter email + password

4. **Free Plan Includes:**
   - ✅ 50 monitors
   - ✅ 5-minute check intervals
   - ✅ Email alerts
   - ✅ Unlimited SMS credits ($0.10/SMS)
   - ✅ Public status pages
   - ✅ No credit card required

### Step 2: Add CircuitIQ Monitor (2 minutes)

1. **After login**, you'll see the dashboard
2. **Click:** "+ New Monitor" button (top-right or top-left)

3. **Fill in Monitor Details:**
   ```
   Monitor Type: HTTP(s)
   Friendly Name: CircuitIQ Health Check
   URL (or IP): https://circuit-iq.vercel.app/api/health
   Monitoring Interval: 5 minutes
   ```

4. **Click** "Create Monitor"

### Step 3: Configure Alert Contacts (1 minute)

1. **In the dashboard**, UptimeRobot will ask to verify your email
2. **Check your email** and click the verification link
3. **Go to:** My Settings → Alert Contacts
4. **Confirm** your email is set to receive alerts

5. **Optional:** Add additional alert contacts
   - SMS number (pay per use)
   - Slack webhook
   - Discord webhook
   - Microsoft Teams
   - PagerDuty

### Step 4: Test the Monitor (30 seconds)

1. **Back in the dashboard**, find your "CircuitIQ Health Check" monitor
2. **Status should show:** 🟢 **Up** (green checkmark)
3. **Response Time should be:** ~200-500ms
4. **Click** on the monitor name to see detailed stats:
   - Uptime percentage (should be 100%)
   - Response time graph
   - Incident history

---

## 🔔 What Happens When Site Goes Down?

### Alert Trigger Conditions:
- Site returns non-200 status code
- Site doesn't respond within 30 seconds
- Database check fails (returns `"unhealthy"`)
- 2 consecutive failed checks (10 minutes total)

### You'll Receive:
1. **Email Alert** with details:
   - What went down: `CircuitIQ Health Check`
   - When: Timestamp
   - Status code: e.g., `503 Service Unavailable`
   - Response time: `timeout` or `0ms`

2. **Dashboard Update:**
   - Status changes to 🔴 **Down** (red X)
   - Incident logged in history
   - Downtime counter starts

### When Site Recovers:
1. **Email Recovery Notice**:
   - "CircuitIQ Health Check is back UP"
   - Downtime duration: e.g., "15 minutes"
   
2. **Dashboard Update:**
   - Status returns to 🟢 **Up**
   - Incident marked as resolved
   - Uptime % recalculated

---

## 📊 Understanding Your Monitor

### Dashboard Metrics:

1. **Uptime Percentage:**
   - **99.9%+** = Excellent (industry standard)
   - **99.5%+** = Good
   - **<99%** = Needs attention

2. **Response Time:**
   - **<500ms** = Excellent (your API should be here)
   - **500ms-1s** = Good
   - **>1s** = Slow (investigate)

3. **Incident History:**
   - Shows all downtime events
   - Click to see details:
     - Start time
     - End time
     - Duration
     - Error code/message

---

## 🎯 Monitor Configuration (Advanced)

### Optional Settings:

1. **Custom HTTP Request:**
   ```
   POST Method: GET (default for health check)
   Custom HTTP Headers: (not needed)
   Response Must Contain: "healthy"
   Response Must NOT Contain: "unhealthy"
   ```

2. **Alert Timing:**
   ```
   Send alerts when: Down for 2 consecutive checks (default)
   Resend alerts: Every 30 minutes (if still down)
   Alert contacts: Your email ✅
   ```

3. **Advanced Options:**
   ```
   Enable/Disable: ✅ Enabled
   Timeout: 30 seconds (default)
   SSL Certificate Check: ✅ Enabled (Vercel uses valid SSL)
   Confirmation Tries: 2 (checks from 2 different locations)
   ```

---

## 📈 Creating a Public Status Page (Optional)

1. **Go to:** Status Pages → + New Status Page
2. **Add your monitors:**
   - Select "CircuitIQ Health Check"
3. **Customize:**
   - Page name: "CircuitIQ Status"
   - Custom domain: status.circuitiq.com (optional)
   - Show uptime stats: ✅
   - Show incident history: ✅
4. **Share the URL** with users or embed on your site

**Example:** `https://stats.uptimerobot.com/xyz123`

---

## 🔧 Troubleshooting

### Monitor Shows "Down" But Site Works

**Possible Causes:**
1. **Health endpoint not deployed yet**
   - Wait 2-3 minutes for Vercel deployment
   - Visit https://circuit-iq.vercel.app/api/health manually
   - Should return: `{"status":"healthy"...}`

2. **Database connection issue**
   - Check Neon database is running
   - Verify DATABASE_URL in Vercel environment variables

3. **UptimeRobot IP blocked**
   - Check Vercel firewall settings
   - UptimeRobot uses multiple IPs (shouldn't be blocked)

**Fix:**
```bash
# Test health endpoint manually
curl https://circuit-iq.vercel.app/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-12-30T09:22:14.123Z",
  "checks": {
    "database": "connected",
    "api": "operational"
  }
}
```

### Not Receiving Alerts

1. **Check email verification:**
   - My Settings → Alert Contacts
   - Status should be "Verified" ✅

2. **Check spam folder:**
   - Add `@uptimerobot.com` to safe senders

3. **Test alerts:**
   - Click monitor → Edit
   - Change URL to invalid URL temporarily
   - Wait 10 minutes
   - Should receive "Down" alert
   - Change URL back to correct endpoint
   - Should receive "Up" alert

---

## 💰 Upgrade Options (Optional)

| Feature | Free | Pro ($7/mo) | Enterprise ($69/mo) |
|---------|------|-------------|---------------------|
| **Monitors** | 50 | 50 | Unlimited |
| **Interval** | 5 min | 1 min | 1 min |
| **SMS Credits** | Pay per use | 500/mo | 5000/mo |
| **Status Pages** | 1 | Unlimited | Unlimited |
| **Custom Domain** | ❌ | ✅ | ✅ |
| **Multi-Location** | ❌ | ✅ | ✅ |
| **White Label** | ❌ | ❌ | ✅ |

**Recommendation:** Free plan is perfect for CircuitIQ!

---

## 📊 Integration with Other Tools

### Slack Integration:
1. Create Slack webhook: https://api.slack.com/messaging/webhooks
2. My Settings → Alert Contacts → Add Alert Contact
3. Type: Webhook
4. URL: Your Slack webhook URL
5. Now get Slack notifications on downtime!

### Discord Integration:
1. Create Discord webhook in your server settings
2. Same process as Slack above
3. Get Discord notifications

### Email Forwarding:
- Forward UptimeRobot alerts to team email
- Create email rules for critical alerts
- Integrate with ticketing system

---

## ✅ Setup Checklist

After completing setup, verify:

- [ ] Account created and email verified
- [ ] Monitor created for `https://circuit-iq.vercel.app/api/health`
- [ ] Monitor status shows 🟢 **Up**
- [ ] Response time is <500ms
- [ ] Email alerts are configured
- [ ] Test alert received (optional)
- [ ] Dashboard shows uptime % (should be 100%)

---

## 🎯 What You Get

### Immediate Benefits:
1. **Peace of Mind**
   - Know instantly if CircuitIQ goes down
   - Get alerts before users complain

2. **Performance Monitoring**
   - Track API response times
   - Identify slowdowns early

3. **Uptime Reports**
   - Show clients/stakeholders uptime stats
   - Professional SLA tracking

4. **Incident History**
   - Detailed downtime logs
   - Root cause analysis data

---

## 📞 UptimeRobot Resources

- **Dashboard:** https://dashboard.uptimerobot.com
- **Help Center:** https://help.uptimerobot.com
- **API Docs:** https://uptimerobot.com/api/
- **Status:** https://uptimerobot.statuspage.io/
- **Support:** support@uptimerobot.com

---

## 🎉 You're Done!

Your CircuitIQ health endpoint is now being monitored every 5 minutes. You'll receive instant email alerts if anything goes wrong.

**Next Steps:**
1. Check dashboard daily for uptime stats
2. Respond to any downtime alerts immediately
3. Use incident history to improve reliability

**Monitoring is now LIVE!** 🚀
