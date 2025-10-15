import mongoose, { Document, Schema } from 'mongoose';

export interface IMonthlySummary extends Document {
  userId: mongoose.Types.ObjectId;
  year: number;
  month: number; // 1-12
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  breakdown: Record<string, number>; // category -> total amount
  createdAt: Date;
  updatedAt: Date;
}

const MonthlySummarySchema = new Schema<IMonthlySummary>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    totalIncome: {
      type: Number,
      default: 0,
    },
    totalExpense: {
      type: Number,
      default: 0,
    },
    netSavings: {
      type: Number,
      default: 0,
    },
    breakdown: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint: one summary per user per month
MonthlySummarySchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });
MonthlySummarySchema.index({ year: -1, month: -1 });

export default mongoose.models.MonthlySummary || mongoose.model<IMonthlySummary>('MonthlySummary', MonthlySummarySchema);

