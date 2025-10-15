# Architecture Documentation

This document describes the architecture and design decisions of the Finance App.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   React UI   │  │  NextAuth    │  │  Cloudinary   │  │
│  │  Components  │  │   Session    │  │    Widget     │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │
                      HTTPS/REST
                           │
┌──────────────────────────┴──────────────────────────────┐
│              Next.js App Router (Vercel)                │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │   API Routes │  │    Server    │  │   Middleware  │ │
│  │  /api/*      │  │  Components  │  │  (Auth Check) │ │
│  └─────────────┘  └──────────────┘  └───────────────┘ │
└──────────────────────────┬──────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
    ┌─────────▼──┐  ┌─────▼────┐  ┌───▼──────┐
    │  MongoDB   │  │ Gemini   │  │Cloudinary│
    │   Atlas    │  │   API    │  │   CDN    │
    └────────────┘  └──────────┘  └──────────┘
```

## Layer Architecture

### 1. Presentation Layer (Client)

**Technology**: React + Next.js App Router

**Components**:
- `app/` - Pages and layouts
- `components/` - Reusable UI components
  - `dashboard/` - Dashboard-specific components
  - `admin/` - Admin panel components
  - `pdf/` - PDF generation templates

**State Management**:
- NextAuth session for authentication state
- React hooks (useState, useEffect) for local state
- No global state management (simple app)

**Styling**:
- Tailwind CSS for utility-first styling
- Custom color scheme (primary green for BDT theme)

### 2. API Layer (Server)

**Technology**: Next.js API Routes (serverless functions)

**Structure**:
```
app/api/
├── auth/
│   ├── [...nextauth]/route.ts  # NextAuth endpoints
│   └── register/route.ts       # User registration
├── transactions/
│   ├── route.ts                # List & create
│   └── [id]/route.ts           # Get, update, delete
├── summary/
│   └── [month]/route.ts        # Monthly summary
├── advice/
│   └── route.ts                # AI advice
├── pdf/
│   └── [month]/route.ts        # PDF generation
├── upload/
│   └── sign/route.ts           # Cloudinary signature
├── admin/
│   └── stats/route.ts          # Admin statistics
└── cron/
    └── aggregate/route.ts      # Monthly aggregation
```

**API Design Principles**:
- RESTful conventions
- Consistent error responses
- Input validation with Zod
- Authentication checks on all protected routes
- Proper HTTP status codes

### 3. Business Logic Layer

**Location**: Embedded in API routes and utilities

**Key Utilities** (`lib/utils.ts`):
- Currency conversion (BDT ↔ paisa)
- Date parsing and formatting
- Month parameter validation

**Business Rules**:
- All amounts stored as integers (paisa)
- Transactions linked to users
- Summaries auto-generated on first access
- AI advice based on current month data

### 4. Data Access Layer

**Technology**: Mongoose ODM

**Models**:
```
models/
├── User.ts              # User accounts
├── Transaction.ts       # Financial transactions
├── MonthlySummary.ts    # Aggregated summaries
└── Advice.ts            # AI-generated advice
```

**Database Design**:
- Normalized schema
- Indexes on frequently queried fields
- Timestamps on all documents
- Soft deletes (if needed, via status field)

### 5. External Services Layer

**Services**:
- **MongoDB Atlas**: Primary database
- **Gemini API**: AI financial advice
- **Cloudinary**: Image storage
- **NextAuth**: Authentication

## Data Flow

### Example: Creating a Transaction

```
1. User fills form in AddTransactionModal.tsx
   ↓
2. Client sends POST /api/transactions
   ↓
3. API route validates input (Zod schema)
   ↓
4. API route checks authentication (NextAuth)
   ↓
5. Transaction.create() saves to MongoDB
   ↓
6. Response sent back to client
   ↓
7. Client refreshes transaction list
```

### Example: Generating Monthly Summary

```
1. User visits dashboard
   ↓
2. MonthlySummary.tsx fetches /api/summary/2024-10
   ↓
3. API checks for existing summary in DB
   ↓
4. If not found, aggregates from Transaction collection
   ↓
5. Creates new MonthlySummary document
   ↓
6. Returns summary to client
   ↓
7. Component displays formatted data
```

## Security Architecture

### Authentication Flow

```
1. User submits credentials
   ↓
2. NextAuth Credentials Provider
   ↓
3. bcrypt.compare() checks password
   ↓
4. JWT token issued (or session created)
   ↓
5. Token stored in HTTP-only cookie
   ↓
6. Subsequent requests include token
   ↓
7. getServerSession() validates on each request
```

### Authorization

- **User Role**: Access own data only
- **Admin Role**: Access all user data + admin endpoints
- **Middleware**: Checks role before granting access

### Security Measures

1. **Input Validation**: Zod schemas on all API inputs
2. **SQL Injection**: MongoDB prevents SQL injection
3. **XSS**: React auto-escapes output
4. **CSRF**: NextAuth handles CSRF tokens
5. **Rate Limiting**: Vercel provides DDoS protection
6. **Secrets**: All sensitive data in environment variables
7. **HTTPS**: Enforced by Vercel

## Database Schema

### User Collection

```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  password: string (hashed),
  name: string,
  profession: string,
  role: 'user' | 'admin',
  profileImage?: string,
  settings: {
    monthlyGoal?: number,
    currency: string
  },
  createdAt: Date (indexed),
  updatedAt: Date
}
```

**Indexes**:
- `email` (unique)
- `createdAt` (for recent users query)

### Transaction Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  type: 'income' | 'expense' | 'transfer',
  amount: number (paisa),
  currency: string,
  category: string (indexed),
  tags: string[],
  note: string,
  receiptUrl?: string,
  occurredAt: Date (indexed),
  meta?: object,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `userId + occurredAt` (compound, for monthly queries)
- `userId + type + occurredAt` (for filtering)
- `userId + category` (for category analysis)

### MonthlySummary Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  year: number,
  month: number,
  totalIncome: number (paisa),
  totalExpense: number (paisa),
  netSavings: number (paisa),
  breakdown: {
    [category]: number (paisa)
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `userId + year + month` (unique, compound)
- `year + month` (for all users in a month)

### Advice Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  prompt: string,
  response: string,
  createdAt: Date (indexed),
  updatedAt: Date
}
```

**Indexes**:
- `userId + createdAt` (for recent advice)

## Deployment Architecture

### Vercel Deployment

```
Git Push
   ↓
GitHub Repository
   ↓
Vercel Build (automatic)
   ↓
Deploy to Edge Network
   ↓
Production URL
```

**Build Process**:
1. Install dependencies
2. Run `next build`
3. Generate static pages
4. Deploy serverless functions
5. Deploy to CDN

**Environment**:
- Node.js 18 runtime
- Serverless functions (250MB memory)
- Edge network (global CDN)
- Automatic HTTPS

### Cron Jobs (Vercel Cron)

```
vercel.json config
   ↓
Vercel Cron Scheduler
   ↓
/api/cron/aggregate (1st of month, 2 AM)
   ↓
Aggregate all user summaries
```

## Performance Optimizations

### 1. Database Indexing

All frequently queried fields are indexed:
- User email lookup: O(log n)
- Transaction queries by user + date: O(log n)
- Summary lookups: O(1) with unique index

### 2. Connection Pooling

MongoDB connection is cached globally:

```typescript
let cached = global.mongoose;
if (cached.conn) return cached.conn;
```

### 3. Lazy Summary Generation

Summaries generated on-demand, then cached in DB.

### 4. Static Pages

Landing page and auth pages are statically generated.

### 5. Image Optimization

- Cloudinary handles image optimization
- Next.js Image component for responsive images

## Scalability Considerations

### Horizontal Scaling

- Vercel automatically scales serverless functions
- MongoDB Atlas handles replica sets
- Cloudinary CDN scales globally

### Vertical Scaling

- Upgrade MongoDB cluster tier (M0 → M2 → M5...)
- Upgrade Vercel plan for more resources

### Bottlenecks

- **MongoDB M0**: Limited to 512MB (upgrade needed at ~10k users)
- **Gemini API**: Free tier rate limits (use caching)
- **Cloudinary**: Free tier bandwidth (25GB/month)

### Solutions

1. **Caching**: Add Redis for frequently accessed summaries
2. **Pagination**: Already implemented for transactions
3. **Background Jobs**: Use Vercel Cron for heavy tasks
4. **Database Sharding**: MongoDB Atlas supports automatic sharding

## Testing Strategy

### Unit Tests

- Utility functions (`lib/utils.test.ts`)
- Model validation
- Pure business logic

### Integration Tests

- API routes with mocked authentication
- Database operations with test DB
- End-to-end API flows

### Manual Testing

- User flows (register → login → add transaction)
- PDF generation
- AI advice
- Admin dashboard

## Monitoring & Observability

### Logging

- API routes log errors to console
- Vercel captures all logs
- MongoDB Atlas logs database operations

### Metrics

- Vercel Analytics for page views
- MongoDB Atlas for database metrics
- API response times in Vercel logs

### Alerts

- Vercel deployment notifications
- MongoDB Atlas threshold alerts
- Custom cron job failure alerts

## Future Improvements

### Short-term

1. Add Redis caching
2. Implement email notifications
3. Add more AI features (budget recommendations)
4. Mobile app (React Native)

### Long-term

1. Microservices architecture
2. Real-time collaboration
3. Bank integration APIs
4. Machine learning for expense prediction

---

This architecture supports production deployment with room for scaling to 10,000+ users.

