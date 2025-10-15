import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/register/route';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

describe('Auth API - Registration', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user successfully', async () => {
    const requestBody = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      profession: 'Tester',
    };

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe('User registered successfully');
    expect(data.user.email).toBe('test@example.com');

    // Verify user in database
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).toBeTruthy();
    expect(user?.name).toBe('Test User');
    expect(user?.password).not.toBe('password123'); // Password should be hashed
  });

  it('should reject duplicate email registration', async () => {
    // Create first user
    const requestBody = {
      email: 'duplicate@example.com',
      password: 'password123',
      name: 'First User',
    };

    const request1 = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
    });

    await POST(request1);

    // Try to create duplicate
    const request2 = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request2);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toContain('already exists');
  });

  it('should validate email format', async () => {
    const requestBody = {
      email: 'invalid-email',
      password: 'password123',
      name: 'Test User',
    };

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
  });

  it('should reject short passwords', async () => {
    const requestBody = {
      email: 'test@example.com',
      password: 'short',
      name: 'Test User',
    };

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
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

