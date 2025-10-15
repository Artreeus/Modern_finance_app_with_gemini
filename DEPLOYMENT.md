# Deployment Guide - Vercel + MongoDB Atlas

This guide walks you through deploying the Finance App to Vercel with MongoDB Atlas.

## Prerequisites

- GitHub account
- Vercel account
- MongoDB Atlas account
- Cloudinary account
- Google AI Studio API key

## Step 1: Prepare MongoDB Atlas

### 1.1 Create MongoDB Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project: "FinanceApp"
4. Build a cluster:
   - Cloud Provider: AWS (recommended)
   - Region: Choose closest to your users
   - Cluster Tier: M0 (Free tier for development)
   - Cluster Name: `finance-cluster`

### 1.2 Configure Database Access

1. Go to "Database Access" in left sidebar
2. Add new database user:
   - Username: `financeapp-user`
   - Password: Generate a strong password (save this!)
   - Database User Privileges: "Read and write to any database"

### 1.3 Configure Network Access

1. Go to "Network Access" in left sidebar
2. Add IP Address:
   - For Vercel: Add `0.0.0.0/0` (allows all IPs)
   - Note: This is required for serverless functions

### 1.4 Get Connection String

1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://financeapp-user:<password>@finance-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name: `/financeapp` after `.net`
   ```
   mongodb+srv://financeapp-user:PASSWORD@finance-cluster.xxxxx.mongodb.net/financeapp?retryWrites=true&w=majority
   ```

## Step 2: Prepare Cloudinary

### 2.1 Create Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account

### 2.2 Get Credentials

1. Go to Dashboard
2. Copy these values:
   - Cloud Name: `your-cloud-name`
   - API Key: `123456789012345`
   - API Secret: `your-api-secret`

## Step 3: Get Gemini API Key

### 3.1 Get API Key

1. Visit [ai.google.dev](https://ai.google.dev)
2. Click "Get API key in Google AI Studio"
3. Create new API key
4. Copy and save the key

## Step 4: Prepare GitHub Repository

### 4.1 Initialize Git (if not done)

```bash
git init
git add .
git commit -m "Initial commit: Finance App"
```

### 4.2 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "+" → "New repository"
3. Name: `finance-app-bdt`
4. Make it private or public
5. Don't initialize with README (we have one)
6. Create repository

### 4.3 Push Code

```bash
git remote add origin https://github.com/YOUR-USERNAME/finance-app-bdt.git
git branch -M main
git push -u origin main
```

## Step 5: Deploy to Vercel

### 5.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in (use GitHub login)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Click "Import"

### 5.2 Configure Project

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `./` (default)
3. **Build Command**: `next build` (default)
4. **Output Directory**: `.next` (default)

### 5.3 Add Environment Variables

Click "Environment Variables" and add all of these:

```env
MONGODB_URI=mongodb+srv://financeapp-user:PASSWORD@finance-cluster.xxxxx.mongodb.net/financeapp?retryWrites=true&w=majority

NEXTAUTH_SECRET=your-generated-secret-min-32-chars
NEXTAUTH_URL=https://your-app-name.vercel.app

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

GEMINI_API_KEY=your-gemini-api-key

CRON_SECRET=your-cron-secret-for-security

NODE_ENV=production
```

**Generate secrets:**

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# CRON_SECRET
openssl rand -base64 32
```

**Important Notes:**
- `NEXTAUTH_URL` will be your Vercel deployment URL
- After first deployment, update `NEXTAUTH_URL` with actual domain
- All secrets should be strong and unique

### 5.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. You'll get a URL like: `https://finance-app-bdt.vercel.app`

### 5.5 Update NextAuth URL

1. Go to your Vercel project settings
2. Environment Variables
3. Edit `NEXTAUTH_URL` to match your deployment URL
4. Click "Save"
5. Redeploy (Vercel will auto-redeploy)

## Step 6: Seed the Production Database

### Option A: From Local Machine

```bash
# Set production MONGODB_URI temporarily
MONGODB_URI="your-production-mongodb-uri" npm run seed
```

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Run seed script
vercel env pull .env.local
npm run seed
```

### Option C: Manual via MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MongoDB URI
3. Create admin user manually:
   - Email: `admin@financeapp.com`
   - Password: bcrypt hash of `admin123456`
   - Role: `admin`

## Step 7: Configure Vercel Cron

Vercel Cron is automatically configured via `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/aggregate",
      "schedule": "0 2 1 * *"
    }
  ]
}
```

This runs on the 1st of every month at 2 AM UTC.

**Verify Cron Setup:**

1. Go to Vercel Dashboard → Your Project
2. Click "Cron Jobs" tab
3. Verify the schedule is active

**Manually Trigger Cron (for testing):**

```bash
curl -X GET https://your-app.vercel.app/api/cron/aggregate \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Step 8: Verify Deployment

### 8.1 Test Authentication

1. Visit `https://your-app.vercel.app`
2. Click "Register"
3. Create a new account
4. Verify email/password work

### 8.2 Test Transactions

1. Log in to your account
2. Click "+ Add Transaction"
3. Create an expense/income
4. Verify it appears in the list

### 8.3 Test AI Advice

1. Click "Get AI Advice"
2. Wait for response
3. Verify Gemini API works

### 8.4 Test PDF Generation

1. Click "Download PDF Report"
2. Verify PDF downloads with transactions

### 8.5 Test Admin Dashboard (if admin)

1. Log in with admin account
2. Visit `/admin`
3. Verify statistics load

## Step 9: Custom Domain (Optional)

### 9.1 Add Domain in Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 9.2 Update Environment Variables

1. Update `NEXTAUTH_URL` to your custom domain
2. Redeploy

## Step 10: Monitoring & Maintenance

### 10.1 Monitor Logs

1. Go to Vercel Dashboard → Your Project
2. Click "Logs" tab
3. Monitor for errors

### 10.2 Set Up Alerts

1. Vercel → Project Settings → Integrations
2. Add Slack/Discord for notifications

### 10.3 Database Monitoring

1. MongoDB Atlas → Metrics
2. Monitor connections, operations, storage

### 10.4 Regular Backups

1. MongoDB Atlas → Backup
2. Enable automated backups
3. Or export manually via MongoDB Compass

## Troubleshooting

### Issue: "Invalid environment variable: MONGODB_URI"

**Solution:**
- Verify MONGODB_URI is added in Vercel
- Check for typos
- Ensure password doesn't have special characters (URL encode if needed)

### Issue: "NextAuth URL mismatch"

**Solution:**
- Update `NEXTAUTH_URL` to match deployment URL
- Redeploy
- Clear browser cookies

### Issue: Cloudinary upload fails

**Solution:**
- Check API credentials
- Verify unsigned upload is disabled
- Test signature endpoint: `/api/upload/sign`

### Issue: Gemini API errors

**Solution:**
- Verify API key is valid
- Check Google AI Studio quotas
- Monitor rate limits

### Issue: Cron job not running

**Solution:**
- Verify `CRON_SECRET` is set
- Check Vercel logs for cron execution
- Manually trigger to test

### Issue: Database connection timeout

**Solution:**
- Check MongoDB Atlas network access (0.0.0.0/0)
- Verify cluster is running
- Check connection string format

## Performance Optimization

### Enable Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Edge Runtime (Optional)

For faster API routes, use Edge Runtime:

```typescript
export const runtime = 'edge';
```

### Database Indexing

Ensure indexes are created (already done in models):

```typescript
UserSchema.index({ email: 1 });
TransactionSchema.index({ userId: 1, occurredAt: -1 });
MonthlySummarySchema.index({ userId: 1, year: 1, month: 1 });
```

## Security Checklist

- ✅ All environment variables set
- ✅ NEXTAUTH_SECRET is strong (32+ chars)
- ✅ MongoDB user has minimal permissions
- ✅ CRON_SECRET is set for cron protection
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Vercel authentication tokens secured
- ✅ API routes have authentication checks
- ✅ Input validation with Zod

## Cost Estimation

**Free Tier Usage:**
- Vercel: Free (hobby plan)
- MongoDB Atlas: Free (M0 cluster, 512MB)
- Cloudinary: Free (25GB storage, 25GB bandwidth)
- Gemini API: Free tier available

**Estimated costs for 1000 users:**
- Vercel Pro: $20/month
- MongoDB M2: $9/month
- Cloudinary: ~$0-10/month
- Gemini API: Free (within limits)

**Total: $29-39/month**

## Next Steps

1. Set up continuous deployment (auto on git push)
2. Configure monitoring and alerts
3. Set up database backups
4. Add custom domain
5. Enable Vercel Analytics
6. Set up error tracking (Sentry)
7. Configure staging environment

---

🎉 **Deployment Complete!** Your Finance App is now live on Vercel.

For support, check the [README.md](./README.md) or open an issue on GitHub.

