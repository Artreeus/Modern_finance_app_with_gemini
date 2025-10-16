import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    period: 'monthly' | 'weekly' | 'yearly';
    startDate: Date;
    endDate: Date;
    categories: {
        name: string;
        allocated: number; // in paisa
        spent: number; // in paisa
        rollover: boolean;
    }[];
    totalBudget: number; // in paisa
    totalSpent: number; // in paisa
    status: 'active' | 'completed' | 'archived';
    notifications: {
        threshold: number; // percentage (e.g., 80 for 80%)
        sent: boolean;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        period: {
            type: String,
            enum: ['monthly', 'weekly', 'yearly'],
            default: 'monthly',
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        categories: [
            {
                name: { type: String, required: true },
                allocated: { type: Number, required: true, min: 0 },
                spent: { type: Number, default: 0, min: 0 },
                rollover: { type: Boolean, default: false },
            },
        ],
        totalBudget: {
            type: Number,
            required: true,
            min: 0,
        },
        totalSpent: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'archived'],
            default: 'active',
        },
        notifications: [
            {
                threshold: { type: Number, required: true },
                sent: { type: Boolean, default: false },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes
BudgetSchema.index({ userId: 1, status: 1 });
BudgetSchema.index({ userId: 1, period: 1 });
BudgetSchema.index({ startDate: 1, endDate: 1 });

// Calculate remaining budget
BudgetSchema.virtual('remaining').get(function () {
    return this.totalBudget - this.totalSpent;
});

// Calculate usage percentage
BudgetSchema.virtual('usagePercentage').get(function () {
    if (this.totalBudget === 0) return 0;
    return Math.min((this.totalSpent / this.totalBudget) * 100, 100);
});

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
