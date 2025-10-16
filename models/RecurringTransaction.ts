import mongoose, { Document, Schema } from 'mongoose';

export interface IRecurringTransaction extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    amount: number; // in paisa
    category: string;
    type: 'expense' | 'income';
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
    startDate: Date;
    endDate?: Date;
    nextDueDate: Date;
    dayOfMonth?: number; // for monthly (1-31)
    dayOfWeek?: number; // for weekly (0-6, 0 = Sunday)
    reminderDays: number; // days before due date to send reminder
    autoCreate: boolean; // automatically create transaction on due date
    status: 'active' | 'paused' | 'cancelled' | 'completed';
    lastCreatedAt?: Date;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const RecurringTransactionSchema = new Schema<IRecurringTransaction>(
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
        description: {
            type: String,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['expense', 'income'],
            default: 'expense',
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'],
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
        nextDueDate: {
            type: Date,
            required: true,
            index: true,
        },
        dayOfMonth: {
            type: Number,
            min: 1,
            max: 31,
        },
        dayOfWeek: {
            type: Number,
            min: 0,
            max: 6,
        },
        reminderDays: {
            type: Number,
            default: 3,
            min: 0,
        },
        autoCreate: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['active', 'paused', 'cancelled', 'completed'],
            default: 'active',
        },
        lastCreatedAt: {
            type: Date,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes
RecurringTransactionSchema.index({ userId: 1, status: 1 });
RecurringTransactionSchema.index({ userId: 1, frequency: 1 });
RecurringTransactionSchema.index({ nextDueDate: 1, status: 1 });

// Calculate next due date based on frequency
RecurringTransactionSchema.methods.calculateNextDueDate = function () {
    const current = new Date(this.nextDueDate);
    
    switch (this.frequency) {
        case 'daily':
            current.setDate(current.getDate() + 1);
            break;
        case 'weekly':
            current.setDate(current.getDate() + 7);
            break;
        case 'biweekly':
            current.setDate(current.getDate() + 14);
            break;
        case 'monthly':
            current.setMonth(current.getMonth() + 1);
            break;
        case 'quarterly':
            current.setMonth(current.getMonth() + 3);
            break;
        case 'yearly':
            current.setFullYear(current.getFullYear() + 1);
            break;
    }
    
    return current;
};

// Check if reminder should be sent
RecurringTransactionSchema.methods.shouldSendReminder = function () {
    const now = new Date();
    const dueDate = new Date(this.nextDueDate);
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - this.reminderDays);
    
    return now >= reminderDate && now < dueDate && this.status === 'active';
};

export default mongoose.models.RecurringTransaction || 
    mongoose.model<IRecurringTransaction>('RecurringTransaction', RecurringTransactionSchema);
