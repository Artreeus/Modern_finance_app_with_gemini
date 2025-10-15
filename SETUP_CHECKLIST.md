# Setup Checklist

Use this checklist to ensure your Finance App is properly configured.

## Pre-Installation

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Code editor ready (VS Code recommended)

## Installation

- [ ] Navigate to project directory: `cd Finance`
- [ ] Install dependencies: `npm install`
- [ ] Verify installation: Check for `node_modules/` folder

## Environment Setup

### MongoDB Atlas

- [ ] Created MongoDB Atlas account
- [ ] Created cluster (M0 free tier)
- [ ] Created database user with read/write access
- [ ] Added IP whitelist (0.0.0.0/0 for development)
- [ ] Copied connection string
- [ ] Added connection string to `.env` as `MONGODB_URI`
- [ ] Tested connection (will verify after running seed)

### Cloudinary

- [ ] Created Cloudinary account
- [ ] Copied Cloud Name from dashboard
- [ ] Copied API Key from dashboard
- [ ] Copied API Secret from dashboard
- [ ] Added all three to `.env`

### Google Gemini API

- [ ] Visited https://ai.google.dev
- [ ] Created/logged into Google account
- [ ] Generated API key in Google AI Studio
- [ ] Copied API key
- [ ] Added to `.env` as `GEMINI_API_KEY`

### NextAuth Configuration

- [ ] Generated NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Added secret to `.env`
- [ ] Set NEXTAUTH_URL to `http://localhost:3000`

### Cron Secret

- [ ] Generated CRON_SECRET: `openssl rand -base64 32`
- [ ] Added to `.env`

### Final .env Check

- [ ] All required variables present
- [ ] No quotes around values
- [ ] No spaces around `=` signs
- [ ] No commented variables you need
- [ ] File is named `.env` (not `.env.txt` or `.env.example`)

## Database Seeding

- [ ] Run seed script: `npm run seed`
- [ ] Verify success message
- [ ] Note test account credentials:
  - Admin: admin@financeapp.com / admin123456
  - User: john@example.com / password123

## Development Server

- [ ] Start server: `npm run dev`
- [ ] Server starts without errors
- [ ] Visit http://localhost:3000
- [ ] Landing page loads correctly

## Functionality Tests

### Authentication

- [ ] Click "Sign In"
- [ ] Enter: admin@financeapp.com / admin123456
- [ ] Successfully logs in
- [ ] Dashboard loads
- [ ] User name displays correctly
- [ ] Logout works

### Transactions

- [ ] Click "+ Add Transaction"
- [ ] Fill out form (expense/income)
- [ ] Submit successfully
- [ ] Transaction appears in list
- [ ] Delete transaction works

### Monthly Summary

- [ ] Summary card displays on dashboard
- [ ] Shows total income/expense/savings
- [ ] Numbers match transactions

### AI Advice

- [ ] Click "Get AI Advice" button
- [ ] Wait for generation (may take 5-10 seconds)
- [ ] Advice appears
- [ ] Text is relevant to financial data

### PDF Generation

- [ ] Click "Download PDF Report"
- [ ] PDF downloads successfully
- [ ] PDF opens and shows correct data
- [ ] Formatting looks good

### Admin Dashboard (Admin Account Only)

- [ ] Visit `/admin` or click "Admin" link
- [ ] Statistics load correctly
- [ ] User count shows
- [ ] Charts/metrics display

## Testing

- [ ] Run test suite: `npm test`
- [ ] All tests pass
- [ ] No critical errors in console

## Code Quality

- [ ] Run linter: `npm run lint`
- [ ] No critical linting errors
- [ ] TypeScript compiles without errors

## Git Setup (Optional)

- [ ] Initialize git: `git init`
- [ ] Add files: `git add .`
- [ ] Create initial commit: `git commit -m "Initial commit"`
- [ ] Create GitHub repository
- [ ] Add remote: `git remote add origin <url>`
- [ ] Push: `git push -u origin main`

## Deployment Preparation

- [ ] Read DEPLOYMENT.md thoroughly
- [ ] Prepare MongoDB Atlas for production (IP whitelist)
- [ ] Prepare Vercel account
- [ ] Environment variables documented
- [ ] Test accounts documented

## Common Issues Resolution

### "Cannot connect to MongoDB"
- [ ] Check network access in MongoDB Atlas
- [ ] Verify connection string format
- [ ] Ensure database user exists
- [ ] Try connection in MongoDB Compass

### "Module not found" errors
- [ ] Delete node_modules: `rm -rf node_modules`
- [ ] Delete package-lock.json
- [ ] Reinstall: `npm install`

### "NextAuth error"
- [ ] Verify NEXTAUTH_SECRET is 32+ characters
- [ ] Check NEXTAUTH_URL matches your local URL
- [ ] Clear browser cookies

### "Gemini API error"
- [ ] Verify API key is correct
- [ ] Check Google AI Studio quotas
- [ ] Ensure no rate limiting

### Port already in use
- [ ] Kill process on port 3000
- [ ] Or use different port: `npm run dev -- -p 3001`

## VS Code Setup (Recommended)

- [ ] Install recommended extensions (prompted on open)
- [ ] Enable format on save
- [ ] Enable ESLint auto-fix
- [ ] Tailwind CSS IntelliSense working

## Documentation Review

- [ ] Read README.md for full features
- [ ] Review ARCHITECTURE.md for system design
- [ ] Check QUICKSTART.md for tips
- [ ] Bookmark DEPLOYMENT.md for later

## Optional Enhancements

- [ ] Add custom MongoDB indexes
- [ ] Set up error tracking (Sentry)
- [ ] Configure email service (future)
- [ ] Add more test users
- [ ] Customize Tailwind theme

## Production Readiness

- [ ] All tests passing
- [ ] No console errors
- [ ] Security review completed
- [ ] Environment variables secured
- [ ] Database backups configured (Atlas)
- [ ] Monitoring plan in place

## Final Verification

- [ ] Create new user account
- [ ] Add 5-10 transactions
- [ ] Generate monthly summary
- [ ] Download PDF
- [ ] Get AI advice
- [ ] Everything works smoothly

---

## Checklist Complete? 🎉

If all items are checked:
- ✅ Your development environment is ready
- ✅ All features are working
- ✅ Ready for local development
- ✅ Ready to deploy (see DEPLOYMENT.md)

## Need Help?

If you're stuck on any item:
1. Check the relevant documentation file
2. Review error messages carefully
3. Search the issue in GitHub Issues
4. Check environment variables again
5. Try the common issues section above

## Next Steps

1. Start building features
2. Customize for your needs
3. Deploy to production
4. Share with users

---

**Congratulations!** Your Finance App is ready to use! 🚀

