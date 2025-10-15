import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'income' | 'expense' | 'transfer';
  amount: number; // stored as integer paisa (BDT * 100)
  currency: string;
  category: string;
  tags: string[];
  note: string;
  receiptUrl?: string;
  occurredAt: Date;
  meta?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense', 'transfer'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'BDT',
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    note: {
      type: String,
      default: '',
    },
    receiptUrl: {
      type: String,
      default: '',
    },
    occurredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
TransactionSchema.index({ userId: 1, occurredAt: -1 });
TransactionSchema.index({ userId: 1, type: 1, occurredAt: -1 });
TransactionSchema.index({ userId: 1, category: 1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

