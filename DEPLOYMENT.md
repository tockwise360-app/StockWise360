# StockWise360 Deployment Guide

## Quick Deploy

1. Push to main: `git push origin main`
2. Antigravity auto-deploys
3. Monitor at: https://app.antigravity.dev/projects/stockwise360
4. Access app at: https://app.stockwise360.in

---

## Pre-Deployment Checklist

### Step 1: Code Quality Checks

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Build production bundle
npm run build
```

**Expected:**
- ✅ No lint errors
- ✅ Build artifact created (.next folder)
- ✅ No critical build warnings

---

### Step 2: Environment Variables

Create `.env.production` with these variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/stockwise360_prod
DB_POOL_SIZE=20
DB_SSL=true

# Authentication
JWT_SECRET=your-secure-jwt-secret-key-min-32-chars
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=https://app.stockwise360.in

# API
NEXT_PUBLIC_APP_URL=https://app.stockwise360.in
NEXT_PUBLIC_API_URL=https://api.stockwise360.in

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@stockwise360.in
SMTP_PASS=your-app-specific-password

# PDF Generation
PDF_TIMEOUT=10000
PDF_QUALITY=high

# Feature Flags
ENABLE_EMAIL_INTEGRATION=true
ENABLE_PDF_EXPORT=true
DEMO_MODE=false
```

> ⚠️ **Never commit `.env.production` to git!**

---

### Step 3: Antigravity Setup

1. Log in to [Antigravity Dashboard](https://app.antigravity.dev)
2. Create New Project → **StockWise360-MVP-Production**
3. Connect GitHub repository
4. Configure build settings:
   - Framework: **Next.js**
   - Node version: **18.x**
   - Build command: `npm run build`
   - Start command: `npm start`
   - Output directory: `.next`

---

### Step 4: Database Setup

**Option A: Antigravity Built-in**
- Dashboard → Add-ons → PostgreSQL → Add

**Option B: External (Recommended)**
- Use AWS RDS, DigitalOcean, Render, or Supabase
- Get connection string and add to `DATABASE_URL`

**Run migrations:**
```bash
npx prisma migrate deploy
# OR
npx knex migrate:latest --env production
```

---

### Step 5: Deploy

```bash
# In Antigravity Dashboard:
# 1. Go to Deployments
# 2. Select branch: main
# 3. Click "Deploy to Production"
# 4. Wait 5-10 minutes
```

**Post-deployment verification:**
```bash
curl https://app.stockwise360.in/api/health
# Expected: {"status":"healthy"}
```

---

## Rollback Procedure

If issues occur after deployment:

1. Go to Antigravity → Deployments
2. Find previous successful deployment
3. Click "Rollback"
4. Confirm rollback
5. Wait 2-5 minutes

**When to rollback:**
- ❌ Database corruption
- ❌ Security breach
- ❌ Uptime < 95%
- ❌ Error rate > 5%

**Don't rollback for:**
- ✅ Minor UI bugs (fix forward)
- ✅ Single feature failure (use feature flags)

---

## Monitoring

### Key Metrics to Watch

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Uptime | > 99.5% | < 99% |
| Response Time | < 500ms | > 1s |
| Error Rate | < 0.1% | > 1% |
| Database CPU | < 50% | > 80% |

### First 24-48 Hours

- [ ] App loads without errors
- [ ] Can create and save invoices
- [ ] PDF export works
- [ ] No critical errors in logs
- [ ] Memory usage stable
- [ ] Response times consistent

---

## Troubleshooting

### Build fails with npm error
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Database connection timeout
1. Verify `DATABASE_URL` is correct
2. Check database server is running
3. Test: `psql $DATABASE_URL`

### PDF generation fails
1. Increase `PDF_TIMEOUT=30000`
2. Check html2pdf library
3. Verify fonts are embedded

### High memory usage
1. Check for memory leaks
2. Add `NODE_OPTIONS=--max-old-space-size=1024`
3. Implement caching

---

## Support

- **Antigravity Docs**: https://docs.antigravity.dev
- **Support**: support@antigravity.dev
- **Status**: https://status.antigravity.dev
