# Quick Start Guide

Get the Finance App running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Code editor (VS Code recommended)

## Step 1: Clone & Install (2 min)

```bash
# Navigate to the project
cd Finance

# Install dependencies
npm install
```

## Step 2: Set Up Environment (2 min)

1. Copy the example env file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:

```env
# Get from MongoDB Atlas (https://cloud.mongodb.com)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/financeapp

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here

# Keep as is for local development
NEXTAUTH_URL=http://localhost:3000

# Get from Cloudinary (https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Get from Google AI Studio (https://ai.google.dev)
GEMINI_API_KEY=your-gemini-key

# Generate with: openssl rand -base64 32
CRON_SECRET=your-cron-secret

NODE_ENV=development
```

### Quick Setup Links:

**MongoDB Atlas** (2 min):
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Create database user
4. Allow all IPs (0.0.0.0/0)
5. Get connection string

**Cloudinary** (1 min):
1. Go to https://cloudinary.com
2. Sign up free
3. Copy credentials from dashboard

**Gemini API** (1 min):
1. Go to https://ai.google.dev
2. Get API key from Google AI Studio

## Step 3: Seed Database (30 sec)

```bash
npm run seed
```

This creates test accounts:
- Admin: `admin@financeapp.com` / `admin123456`
- User: `john@example.com` / `password123`

## Step 4: Run Development Server (10 sec)

```bash
npm run dev
```

## Step 5: Test the App (1 min)

1. Open http://localhost:3000
2. Click "Sign In"
3. Use: `admin@financeapp.com` / `admin123456`
4. Explore the dashboard!

## What to Try

### User Features
- ✅ Add a transaction (income/expense)
- ✅ View monthly summary
- ✅ Generate AI advice
- ✅ Download PDF report
- ✅ Filter transactions

### Admin Features
- ✅ Visit `/admin` for statistics
- ✅ View user metrics
- ✅ Check top categories

## Common Issues

### "Cannot connect to MongoDB"
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Verify connection string in .env
- Ensure database user exists

### "Invalid environment variable"
- Make sure all required vars are in .env
- No quotes around values
- No spaces around `=`

### "NextAuth session error"
- Generate a proper NEXTAUTH_SECRET:
  ```bash
  openssl rand -base64 32
  ```

## Development Commands

```bash
# Run development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Seed database
npm run seed

# Build for production
npm run build
```

## Project Structure

```
Finance/
├── app/              # Next.js pages & API routes
├── components/       # React components
├── lib/              # Utilities
├── models/           # Mongoose models
├── scripts/          # Seed & utility scripts
├── __tests__/        # Jest tests
└── public/           # Static assets
```

## Next Steps

1. **Read the full README**: `README.md`
2. **Deploy to Vercel**: Follow `DEPLOYMENT.md`
3. **Learn architecture**: Check `ARCHITECTURE.md`
4. **Contribute**: See `CONTRIBUTING.md`

## Need Help?

- Check `README.md` for detailed docs
- Review `DEPLOYMENT.md` for Vercel setup
- Open GitHub issue for bugs
- Read `ARCHITECTURE.md` for system design

---

Happy coding! 🚀

