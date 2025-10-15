import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import MonthlySummary from '@/models/MonthlySummary';
import User from '@/models/User';
import { parseMonthParam, getMonthName, paisaToBdt } from '@/lib/utils';

// Simple HTML to PDF fallback - works everywhere
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

    // Generate simple HTML report
    const html = generateHTMLReport({
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
        date: txn.occurredAt.toLocaleDateString(),
        type: txn.type,
        category: txn.category,
        amount: paisaToBdt(txn.amount),
        note: txn.note,
      })),
    });

    // Return HTML that can be printed as PDF
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Failed to generate report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

function generateHTMLReport(data: any) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Finance Report - ${data.month} ${data.year}</title>
    <style>
        @media print {
            .no-print { display: none; }
        }
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
        }
        h1 {
            color: #22c55e;
            border-bottom: 3px solid #22c55e;
            padding-bottom: 10px;
        }
        .summary-box {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 16px;
        }
        .summary-label {
            color: #666;
        }
        .summary-value {
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background: #22c55e;
            color: white;
        }
        tr:nth-child(even) {
            background: #f9f9f9;
        }
        .print-btn {
            background: #22c55e;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 20px 0;
        }
        .print-btn:hover {
            background: #16a34a;
        }
        .income { color: #22c55e; }
        .expense { color: #ef4444; }
    </style>
</head>
<body>
    <button class="print-btn no-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
    
    <h1>Monthly Finance Report</h1>
    <p style="color: #666; font-size: 14px;">${data.month} ${data.year} - ${data.user.name}</p>

    ${data.summary ? `
    <div class="summary-box">
        <h2>Summary</h2>
        <div class="summary-row">
            <span class="summary-label">Total Income:</span>
            <span class="summary-value income">৳${data.summary.totalIncome.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Total Expense:</span>
            <span class="summary-value expense">৳${data.summary.totalExpense.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Net Savings:</span>
            <span class="summary-value ${data.summary.netSavings >= 0 ? 'income' : 'expense'}">
                ৳${data.summary.netSavings.toFixed(2)}
            </span>
        </div>
    </div>

    ${data.summary.breakdown.length > 0 ? `
    <h2>Category Breakdown</h2>
    <table>
        <tr>
            <th>Category</th>
            <th>Amount</th>
        </tr>
        ${data.summary.breakdown.map((item: any) => `
        <tr>
            <td>${item.category}</td>
            <td>৳${item.amount.toFixed(2)}</td>
        </tr>
        `).join('')}
    </table>
    ` : ''}
    ` : '<p>No summary available for this month.</p>'}

    <h2>Transactions (${data.transactions.length})</h2>
    <table>
        <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Note</th>
        </tr>
        ${data.transactions.map((txn: any) => `
        <tr>
            <td>${txn.date}</td>
            <td>${txn.type}</td>
            <td>${txn.category}</td>
            <td class="${txn.type}">৳${txn.amount.toFixed(2)}</td>
            <td>${txn.note || '-'}</td>
        </tr>
        `).join('')}
    </table>

    <p style="text-align: center; color: #999; margin-top: 40px; font-size: 12px;">
        Generated on ${new Date().toLocaleDateString()} - Finance App (BDT)
    </p>

    <button class="print-btn no-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
</body>
</html>
  `;
}

