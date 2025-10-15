import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/summary/[month]/route';
import Transaction from '@/models/Transaction';
import MonthlySummary from '@/models/MonthlySummary';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import bcrypt from 'bcrypt';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

import { getServerSession } from 'next-auth';

describe('Summary API', () => {
  let testUser: any;
  let mockSession: any;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await MonthlySummary.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('password123', 12);
    testUser = await User.create({
      email: 'summary-test@example.com',
      password: hashedPassword,
      name: 'Summary Test User',
    });

    mockSession = {
      user: {
        id: testUser._id.toString(),
        email: testUser.email,
        name: testUser.name,
      },
    };

    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await MonthlySummary.deleteMany({});
    jest.clearAllMocks();
  });

  it('should generate summary from transactions on-the-fly', async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Create transactions for current month
    await Transaction.create([
      {
        userId: testUser._id,
        type: 'income',
        amount: 5000000, // 50,000 BDT
        category: 'Salary',
        occurredAt: new Date(year, month - 1, 5),
      },
      {
        userId: testUser._id,
        type: 'expense',
        amount: 200000, // 2,000 BDT
        category: 'Food',
        occurredAt: new Date(year, month - 1, 10),
      },
      {
        userId: testUser._id,
        type: 'expense',
        amount: 1500000, // 15,000 BDT
        category: 'Rent',
        occurredAt: new Date(year, month - 1, 1),
      },
    ]);

    const monthParam = `${year}-${String(month).padStart(2, '0')}`;
    const request = new NextRequest(
      `http://localhost:3000/api/summary/${monthParam}`,
      { method: 'GET' }
    );

    const response = await GET(request, { params: { month: monthParam } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.summary).toBeTruthy();
    expect(data.summary.totalIncome).toBe(5000000);
    expect(data.summary.totalExpense).toBe(1700000);
    expect(data.summary.netSavings).toBe(3300000);
    expect(data.summary.breakdown).toHaveProperty('Food');
    expect(data.summary.breakdown).toHaveProperty('Rent');
    expect(data.summary.breakdown).toHaveProperty('Salary');
  });

  it('should require authentication', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/summary/2024-01', {
      method: 'GET',
    });

    const response = await GET(request, { params: { month: '2024-01' } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should validate month format', async () => {
    const request = new NextRequest('http://localhost:3000/api/summary/invalid', {
      method: 'GET',
    });

    const response = await GET(request, { params: { month: 'invalid' } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid month format');
  });

  it('should use existing summary if available', async () => {
    const year = 2024;
    const month = 6;

    // Create a pre-computed summary
    await MonthlySummary.create({
      userId: testUser._id,
      year,
      month,
      totalIncome: 5000000,
      totalExpense: 2000000,
      netSavings: 3000000,
      breakdown: { Salary: 5000000, Food: 2000000 },
    });

    const request = new NextRequest('http://localhost:3000/api/summary/2024-06', {
      method: 'GET',
    });

    const response = await GET(request, { params: { month: '2024-06' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.summary.totalIncome).toBe(5000000);
    expect(data.summary.totalExpense).toBe(2000000);
  });
});

