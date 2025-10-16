import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import MonthlySummary from '@/models/MonthlySummary';
import User from '@/models/User';
import { parseMonthParam, getMonthName, paisaToBdt } from '@/lib/utils';
import React from 'react';

// Dynamic import for React-PDF to avoid SSR issues
const renderPDF = async (data: any) => {
  const ReactPDF = await import('@react-pdf/renderer');
  const { MonthlyReportPDF } = await import('@/components/pdf/MonthlyReportPDF');
  
  const doc = React.createElement(MonthlyReportPDF, { data }) as React.ReactElement;
  const stream = await ReactPDF.renderToStream(doc);
  
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

// GET /api/pdf/:month - Generate PDF for a specific month
export async function GET(
  req: NextRequest,
  { params }: { params: { month: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = parseMonthParam(params.month);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid month format. Use YYYY-MM' },
        { status: 400 }
      );
    }

    await connectDB();

    const userId = (session.user as any).id;
    const { year, month } = parsed;

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get summary
    const summary = await MonthlySummary.findOne({ userId, year, month });

    // Get transactions
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const transactions = await Transaction.find({
      userId,
      occurredAt: { $gte: startDate, $lte: endDate },
    }).sort({ occurredAt: -1 });

    // Prepare data
    const data = {
      user: {
        name: user.name,
        email: user.email,
      },
      month: getMonthName(month),
      year,
      summary: summary
        ? {
            totalIncome: paisaToBdt(summary.totalIncome),
            totalExpense: paisaToBdt(summary.totalExpense),
            netSavings: paisaToBdt(summary.netSavings),
            breakdown: Object.entries(summary.breakdown).map(([cat, amt]) => ({
              category: cat,
              amount: paisaToBdt(amt as number),
            })),
          }
        : null,
      transactions: transactions.map((txn) => ({
        date: txn.occurredAt.toISOString(),
        type: txn.type,
        category: txn.category,
        amount: paisaToBdt(txn.amount),
        note: txn.note,
      })),
    };

    try {
      // Generate PDF
      const pdfBuffer = await renderPDF(data);

      // Return PDF
      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="finance-report-${year}-${String(month).padStart(2, '0')}.pdf"`,
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      return NextResponse.json(
        { error: 'Failed to generate PDF', details: (pdfError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

