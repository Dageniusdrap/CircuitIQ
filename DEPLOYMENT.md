# CircuitIQ Deployment Checklist

## Pre-Deployment Verification

### Code Quality
- [x] All linting errors resolved (0 errors, 0 warnings)
- [x] TypeScript strict mode enabled
- [x] Production build successful (`npm run build`)
- [x] All tests passing (if applicable)
- [x] No console.logs in production code
- [x] Error boundaries implemented
- [x] Performance optimized (lazy loading, code splitting)

### Environment Setup
- [ ] Production DATABASE_URL configured
- [ ] NEXTAUTH_URL set to production domain
- [ ] NEXTAUTH_SECRET generated (min 32 characters)
- [ ] OPENAI_API_KEY set (for AI features)
- [ ] UPLOADTHING_SECRET and UPLOADTHING_APP_ID configured
- [ ] Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
- [ ] GitHub OAuth credentials (GITHUB_ID, GITHUB_SECRET)

### Database
- [ ] Production database provisioned (PostgreSQL)
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Database seeded with initial data (if needed)
- [ ] Database connection pooling configured
- [ ] Backup strategy in place

### Security
- [x] Authentication flow tested and secure
- [x] CORS policies configured
- [x] Rate limiting considered
- [ ] SSL/TLS certificates configured
- [ ] Security headers implemented
- [ ] SQL injection protection verified (Prisma handles this)
- [ ] XSS protection enabled
- [x] Password hashing verified (bcrypt)

### Performance
- [x] Images optimized (Next.js Image component)
- [x] Code splitting implemented
- [x] Bundle size analyzed
- [ ] CDN configured for static assets
- [ ] Caching strategy implemented
- [x] Database queries optimized

### Monitoring & Analytics
- [ ] Error tracking setup (Sentry recommended)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] User analytics (PostHog/Plausible)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Log aggregation (Logtail/Papertrail)

### Platform-Specific (Vercel Recommended)

#### Vercel Settings
- [ ] Project created on Vercel
- [ ] GitHub repository connected
- [ ] Environment variables added to Vercel dashboard
- [ ] Domain configured (custom domain)
- [ ] Build settings verified:
  - Build Command: `npm run build`
  - Output Directory: `.next`
  - Install Command: `npm install`
- [ ] Auto-deployment from main branch enabled

### Database Hosting (Choose One)

#### Neon (Recommended for Serverless)
- [ ] Neon project created
- [ ] Connection string copied to DATABASE_URL
- [ ] Connection pooling enabled

#### Supabase
- [ ] Supabase project created
- [ ] PostgreSQL connection string configured
- [ ] Row Level Security policies reviewed

#### Railway
- [ ] Railway PostgreSQL service provisioned
- [ ] Environment variables linked

### Post-Deployment
- [ ] DNS records updated (if custom domain)
- [ ] Production site tested end-to-end
- [ ] User authentication tested
- [ ] File upload tested
- [ ] AI diagnostics tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Lighthouse audit run (aim for 90+ scores)
- [ ] Performance testing under load

### Documentation
- [x] README.md updated with deployment instructions
- [ ] API documentation (if applicable)
- [ ] User guide created
- [ ] Admin documentation
- [ ] Changelog maintained

## Quick Deploy Commands

### 1. Vercel CLI (Fastest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 2. Manual Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Add environment variables
4. Click "Deploy"

### 3. Database Setup (Neon Example)
```bash
# Get connection string from Neon dashboard
# Add to .env.production
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## Environment Variables Template

Create `.env.production` with:

```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

# OAuth (Optional but recommended)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_ID="..."
GITHUB_SECRET="..."

# OpenAI
OPENAI_API_KEY="sk-..."

# UploadThing
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
```

## Common Issues & Solutions

### Issue: Build fails with "Cannot find module '@prisma/client'"
**Solution:** Run `npx prisma generate` before building

### Issue: Database connection fails
**Solution:** Ensure DATABASE_URL includes `?sslmode=require` for production DBs

### Issue: OAuth not working
**Solution:** Add production URL to OAuth app callback URLs

### Issue: Images not loading
**Solution:** Check `next.config.ts` remote patterns for allowed domains

## Performance Targets
- ✅ Lighthouse Performance: 90+
- ✅ First Contentful Paint: < 1.8s
- ✅ Time to Interactive: < 3.8s
- ✅ Cumulative Layout Shift: < 0.1

## Rollback Plan
If deployment fails:
1. Revert to previous commit: `git revert HEAD`
2. Redeploy previous working version
3. Investigate issues in development
4. Fix and redeploy

---

**Created:** 2025-12-25
**Last Updated:** 2025-12-25
**Status:** Production Ready ✅
