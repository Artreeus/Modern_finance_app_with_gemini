import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Advice from '@/models/Advice';
import MonthlySummary from '@/models/MonthlySummary';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCurrentYearMonth, paisaToBdt } from '@/lib/utils';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// POST /api/advice - Get AI financial advice
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'AI feature is not configured. Please add GEMINI_API_KEY to your .env file.',
          details: 'Get your free API key from https://makersuite.google.com/app/apikey'
        },
        { status: 503 }
      );
    }

    await connectDB();

    const userId = (session.user as any).id;
    const { year, month } = getCurrentYearMonth();

    // Get current month summary
    const summary = await MonthlySummary.findOne({ userId, year, month });

    if (!summary) {
      return NextResponse.json(
        { error: 'No financial data available for current month. Add some transactions first!' },
        { status: 404 }
      );
    }

    // Build context for AI
    const income = paisaToBdt(summary.totalIncome);
    const expense = paisaToBdt(summary.totalExpense);
    const savings = paisaToBdt(summary.netSavings);

    const breakdownText = Object.entries(summary.breakdown)
      .map(([cat, amt]) => `${cat}: ৳${paisaToBdt(amt as number).toFixed(2)}`)
      .join(', ');

    const prompt = `You are a financial advisor for users in Bangladesh. Analyze this monthly financial data and provide personalized advice:

Income: ৳${income.toFixed(2)} BDT
Expenses: ৳${expense.toFixed(2)} BDT
Net Savings: ৳${savings.toFixed(2)} BDT
Category Breakdown: ${breakdownText}

Provide concise, actionable financial advice (3-5 bullet points) considering Bangladesh's economic context.`;

    try {
      // Call Gemini API with timeout
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      // Store advice
      const advice = await Advice.create({
        userId,
        prompt,
        response,
      });

      return NextResponse.json({
        message: 'Advice generated',
        advice: {
          id: advice._id,
          response: advice.response,
          createdAt: advice.createdAt,
        },
      });
    } catch (aiError: any) {
      console.error('Gemini API error:', aiError);
      return NextResponse.json(
        { 
          error: 'Failed to generate AI advice. Please try again later.',
          details: aiError.message || 'AI service temporarily unavailable'
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Failed to generate advice:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate advice',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// GET /api/advice - Get recent advice
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    const advices = await Advice.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-prompt')
      .lean();

    return NextResponse.json({ advices });
  } catch (error) {
    console.error('Failed to fetch advice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advice' },
      { status: 500 }
    );
  }
}

