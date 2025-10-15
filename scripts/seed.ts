import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User';
import Transaction from '../models/Transaction';
import MonthlySummary from '../models/MonthlySummary';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await MonthlySummary.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123456', 12);
    const admin = await User.create({
      email: 'admin@financeapp.com',
      password: adminPassword,
      name: 'Admin User',
      profession: 'Administrator',
      role: 'admin',
      settings: {
        monthlyGoal: 50000 * 100, // 50,000 BDT in paisa
        currency: 'BDT',
      },
    });
    console.log('✓ Created admin user: admin@financeapp.com / admin123456');

    // Create regular users
    const userPassword = await bcrypt.hash('password123', 12);
    const users = await User.create([
      {
        email: 'john@example.com',
        password: userPassword,
        name: 'John Doe',
        profession: 'Software Engineer',
        settings: { currency: 'BDT', monthlyGoal: 30000 * 100 },
      },
      {
        email: 'jane@example.com',
        password: userPassword,
        name: 'Jane Smith',
        profession: 'Teacher',
        settings: { currency: 'BDT', monthlyGoal: 25000 * 100 },
      },
      {
        email: 'alice@example.com',
        password: userPassword,
        name: 'Alice Rahman',
        profession: 'Doctor',
        settings: { currency: 'BDT', monthlyGoal: 60000 * 100 },
      },
    ]);
    console.log('✓ Created 3 regular users (password: password123)');

    // Create sample transactions for current month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const categories = {
      income: ['Salary', 'Freelance', 'Investment', 'Bonus'],
      expense: ['Food', 'Rent', 'Transport', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping'],
    };

    const transactions = [];

    for (const user of [admin, ...users]) {
      // Income transactions (1-3 per user)
      const incomeCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < incomeCount; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        transactions.push({
          userId: user._id,
          type: 'income',
          amount: (Math.floor(Math.random() * 50000) + 10000) * 100, // 10k-60k BDT
          category: categories.income[Math.floor(Math.random() * categories.income.length)],
          note: 'Sample income transaction',
          occurredAt: new Date(currentYear, currentMonth, day),
        });
      }

      // Expense transactions (5-15 per user)
      const expenseCount = Math.floor(Math.random() * 11) + 5;
      for (let i = 0; i < expenseCount; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        transactions.push({
          userId: user._id,
          type: 'expense',
          amount: (Math.floor(Math.random() * 5000) + 500) * 100, // 500-5500 BDT
          category: categories.expense[Math.floor(Math.random() * categories.expense.length)],
          note: 'Sample expense transaction',
          occurredAt: new Date(currentYear, currentMonth, day),
          tags: ['sample'],
        });
      }
    }

    await Transaction.insertMany(transactions);
    console.log(`✓ Created ${transactions.length} sample transactions for current month`);

    // Generate monthly summaries
    console.log('Generating monthly summaries...');
    const allUsers = [admin, ...users];
    
    for (const user of allUsers) {
      const userTransactions = await Transaction.find({
        userId: user._id,
        occurredAt: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lte: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59),
        },
      });

      let totalIncome = 0;
      let totalExpense = 0;
      const breakdown: Record<string, number> = {};

      userTransactions.forEach((txn) => {
        if (txn.type === 'income') {
          totalIncome += txn.amount;
        } else if (txn.type === 'expense') {
          totalExpense += txn.amount;
        }

        if (txn.category) {
          breakdown[txn.category] = (breakdown[txn.category] || 0) + txn.amount;
        }
      });

      await MonthlySummary.create({
        userId: user._id,
        year: currentYear,
        month: currentMonth + 1,
        totalIncome,
        totalExpense,
        netSavings: totalIncome - totalExpense,
        breakdown,
      });
    }
    console.log('✓ Generated monthly summaries for all users');

    console.log('\n🎉 Seed completed successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@financeapp.com / admin123456');
    console.log('User 1: john@example.com / password123');
    console.log('User 2: jane@example.com / password123');
    console.log('User 3: alice@example.com / password123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();

