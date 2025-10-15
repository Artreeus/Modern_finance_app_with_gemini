import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/transactions/route';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import bcrypt from 'bcrypt';

// Mock NextAuth session
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

import { getServerSession } from 'next-auth';

describe('Transactions API', () => {
  let testUser: any;
  let mockSession: any;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    testUser = await User.create({
      email: 'testuser@example.com',
      password: hashedPassword,
      name: 'Test User',
      profession: 'Tester',
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
    jest.clearAllMocks();
  });

  describe('POST /api/transactions', () => {
    it('should create a new transaction', async () => {
      const requestBody = {
        type: 'expense',
        amount: 150000, // 1500 BDT in paisa
        category: 'Food',
        note: 'Lunch at restaurant',
        tags: ['food', 'lunch'],
      };

      const request = new NextRequest('http://localhost:3000/api/transactions', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe('Transaction created');
      expect(data.transaction.type).toBe('expense');
      expect(data.transaction.amount).toBe(150000);
      expect(data.transaction.category).toBe('Food');

      // Verify in database
      const transaction = await Transaction.findById(data.transaction._id);
      expect(transaction).toBeTruthy();
      expect(transaction?.userId.toString()).toBe(testUser._id.toString());
    });

    it('should require authentication', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const requestBody = {
        type: 'income',
        amount: 5000000,
        category: 'Salary',
      };

      const request = new NextRequest('http://localhost:3000/api/transactions', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should validate transaction type', async () => {
      const requestBody = {
        type: 'invalid-type',
        amount: 1000,
        category: 'Test',
      };

      const request = new NextRequest('http://localhost:3000/api/transactions', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });
  });

  describe('GET /api/transactions', () => {
    beforeEach(async () => {
      // Create sample transactions
      const now = new Date();
      await Transaction.create([
        {
          userId: testUser._id,
          type: 'income',
          amount: 5000000,
          category: 'Salary',
          occurredAt: new Date(now.getFullYear(), now.getMonth(), 5),
        },
        {
          userId: testUser._id,
          type: 'expense',
          amount: 50000,
          category: 'Food',
          occurredAt: new Date(now.getFullYear(), now.getMonth(), 10),
        },
        {
          userId: testUser._id,
          type: 'expense',
          amount: 2000000,
          category: 'Rent',
          occurredAt: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      ]);
    });

    it('should fetch user transactions', async () => {
      const request = new NextRequest('http://localhost:3000/api/transactions', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.transactions).toHaveLength(3);
      expect(data.pagination.total).toBe(3);
    });

    it('should filter transactions by month', async () => {
      const now = new Date();
      const monthParam = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const request = new NextRequest(
        `http://localhost:3000/api/transactions?month=${monthParam}`,
        { method: 'GET' }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.transactions.length).toBeGreaterThan(0);
    });

    it('should filter transactions by type', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/transactions?type=expense',
        { method: 'GET' }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.transactions.every((t: any) => t.type === 'expense')).toBe(true);
    });
  });
});

