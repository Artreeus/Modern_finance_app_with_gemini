# Finance App (BDT) - Production Ready

A production-ready finance management application built for Bangladesh, featuring AI-powered financial advice, automated monthly reports, PDF generation, and secure cloud storage.

## 🚀 Features

- **Authentication & Authorization**
  - Email/password authentication with NextAuth.js
  - Secure password hashing with bcrypt
  - JWT session management
  - Role-based access control (user/admin)

- **Transaction Management**
  - Track income, expenses, and transfers in BDT
  - Category-based organization
  - Tag support for better filtering
  - Receipt upload via Cloudinary
  - Full CRUD operations

- **Financial Intelligence**
  - AI-powered financial advice using Gemini 2.0 Flash
  - Automated monthly summaries
  - Category breakdown and analytics
  - Savings tracking

- **Reports & Export**
  - PDF report generation for any month
  - Monthly summary aggregation
  - Category-wise spending analysis

- **Admin Dashboard**
  - User statistics and analytics
  - Profession distribution insights
  - Top expense category analysis
  - Active user tracking

## 🛠 Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router) with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js (Credentials Provider)
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.0 Flash API
- **PDF Generation**: @react-pdf/renderer
- **Image Storage**: Cloudinary
- **Testing**: Jest + Supertest
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Google AI Studio account (for Gemini API key)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Finance
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/financeapp?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars-long
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Gemini AI API Key
GEMINI_API_KEY=your-gemini-api-key

# Cron Secret (for Vercel Cron)
CRON_SECRET=your-cron-secret-key

# Environment
NODE_ENV=development
```

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 5. Get API Keys

**MongoDB Atlas:**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string from "Connect" → "Connect your application"

**Cloudinary:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard

**Gemini API:**
1. Visit [ai.google.dev](https://ai.google.dev)
2. Get API key from Google AI Studio

### 6. Seed the Database

```bash
npm run seed
```

This creates:
- Admin user: `admin@financeapp.com` / `admin123456`
- Regular users with sample transactions

### 7. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The test suite includes:
- Authentication API tests
- Transaction CRUD tests
- Monthly summary generation tests
- Utility function tests

## 📦 Project Structure

```
Finance/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── transactions/    # Transaction CRUD
│   │   ├── summary/         # Monthly summaries
│   │   ├── advice/          # AI advice
│   │   ├── pdf/             # PDF generation
│   │   ├── upload/          # Cloudinary upload
│   │   ├── admin/           # Admin endpoints
│   │   └── cron/            # Scheduled jobs
│   ├── auth/                # Auth pages (signin, register)
│   ├── dashboard/           # User dashboard
│   ├── admin/               # Admin dashboard
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── dashboard/           # Dashboard components
│   ├── admin/               # Admin components
│   ├── pdf/                 # PDF templates
│   └── Providers.tsx        # Context providers
├── lib/                     # Utilities
│   ├── mongodb.ts           # Database connection
│   └── utils.ts             # Helper functions
├── models/                  # Mongoose models
│   ├── User.ts
│   ├── Transaction.ts
│   ├── MonthlySummary.ts
│   └── Advice.ts
├── scripts/                 # Utility scripts
│   └── seed.ts              # Database seeding
├── __tests__/               # Test files
│   ├── api/                 # API tests
│   └── lib/                 # Utility tests
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Test setup
├── next.config.js           # Next.js config
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
├── vercel.json              # Vercel deployment config
└── package.json             # Dependencies
```

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (copy from `.env`)
5. Deploy!

### 3. Set Up Cron Job

The `vercel.json` file already configures a monthly cron job to aggregate summaries.
Vercel will automatically run `/api/cron/aggregate` on the 1st of each month at 2 AM UTC.

**Important:** Add `CRON_SECRET` to Vercel environment variables for security.

### 4. Configure MongoDB Atlas

1. In MongoDB Atlas, whitelist Vercel's IP addresses or use `0.0.0.0/0` (all IPs)
2. Update connection string if needed

### 5. Verify Deployment

- Test authentication
- Create a transaction
- Generate AI advice
- Download PDF report
- Check admin dashboard (if admin user)

## 📊 Data Models

### User
```typescript
{
  email: string (unique)
  password: string (hashed)
  name: string
  profession: string
  profileImage?: string
  role: 'user' | 'admin'
  settings: {
    monthlyGoal?: number
    currency: string
  }
}
```

### Transaction
```typescript
{
  userId: ObjectId
  type: 'income' | 'expense' | 'transfer'
  amount: number (in paisa, BDT * 100)
  category: string
  tags: string[]
  note: string
  receiptUrl?: string
  occurredAt: Date
  meta?: object
}
```

### MonthlySummary
```typescript
{
  userId: ObjectId
  year: number
  month: number (1-12)
  totalIncome: number
  totalExpense: number
  netSavings: number
  breakdown: Record<string, number>
}
```

### Advice
```typescript
{
  userId: ObjectId
  prompt: string
  response: string
  createdAt: Date
}
```

## 🔐 Security Best Practices

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens with secure secret
- ✅ Environment variables for sensitive data
- ✅ MongoDB connection with authentication
- ✅ Cloudinary signed uploads
- ✅ CORS and API route protection
- ✅ Input validation with Zod
- ✅ SQL injection prevention (NoSQL queries)
- ✅ XSS protection (React sanitization)

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (login, session)

### Transactions
- `GET /api/transactions` - List transactions (filters: month, type, category)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get single transaction
- `PATCH /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Summaries
- `GET /api/summary/:month` - Get monthly summary (format: YYYY-MM)

### AI Advice
- `POST /api/advice` - Generate AI advice
- `GET /api/advice` - Get recent advice

### PDF Export
- `GET /api/pdf/:month` - Download monthly PDF report

### Upload
- `POST /api/upload/sign` - Get Cloudinary signature

### Admin
- `GET /api/admin/stats` - Admin dashboard statistics

### Cron
- `GET /api/cron/aggregate` - Monthly aggregation (Vercel Cron)

## 🧩 Key Features Implementation

### Currency Handling

All amounts are stored as integers in **paisa** (BDT × 100) to avoid floating-point issues:

```typescript
// Store 1,234.56 BDT as 123456 paisa
const paisa = bdtToPaisa(1234.56); // 123456

// Display as formatted BDT
const formatted = formatBDT(123456); // "৳1,234.56"
```

### AI Financial Advice

Uses Gemini 2.0 Flash API with context from user's monthly summary:

```typescript
// Generate advice based on spending patterns
POST /api/advice

// Returns personalized recommendations
{
  "advice": {
    "response": "Based on your spending...",
    "createdAt": "2024-..."
  }
}
```

### PDF Generation

Server-side PDF generation using React components:

```typescript
// Download monthly report
GET /api/pdf/2024-10

// Returns PDF file with transactions and summary
```

### Automated Aggregation

Vercel Cron runs monthly to pre-compute summaries:

```json
{
  "crons": [{
    "path": "/api/cron/aggregate",
    "schedule": "0 2 1 * *"
  }]
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Ensure network access is configured

### Cloudinary Upload Fails
- Verify API credentials
- Check CORS settings in Cloudinary dashboard
- Ensure cloud name is correct

### Gemini API Errors
- Verify API key is valid
- Check rate limits
- Ensure `GEMINI_API_KEY` is set

### NextAuth Session Issues
- Verify `NEXTAUTH_SECRET` is at least 32 characters
- Check `NEXTAUTH_URL` matches deployment URL
- Clear browser cookies and try again

## 📝 Development Tips

1. **Hot Reload**: Next.js auto-refreshes on file changes
2. **Database Viewer**: Use MongoDB Compass for local development
3. **API Testing**: Use Postman or Thunder Client
4. **Logs**: Check Vercel logs for production debugging
5. **TypeScript**: Enable strict mode for better type safety

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for reliable database
- Google for Gemini AI API
- Cloudinary for image hosting
- Vercel for seamless deployment

## 📧 Support

For issues and questions:
- Open a GitHub issue
- Email: support@financeapp.com (configure your own)

---

**Built with ❤️ for Bangladesh** 🇧🇩

"# Modern_finance_app_with_gemini" 
