import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    targetAmount: number; // in dollars
    currentAmount: number; // in dollars
    category: 'savings' | 'investment' | 'debt' | 'emergency' | 'vacation' | 'education' | 'home' | 'retirement' | 'other';
    priority: 'low' | 'medium' | 'high';
    targetDate?: Date;
    status: 'active' | 'completed' | 'paused' | 'cancelled';
    milestones: {
        percentage: number;
        amount: number;
        achieved: boolean;
        achievedAt?: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>(
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
        targetAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        currentAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        category: {
            type: String,
            enum: ['savings', 'investment', 'debt', 'emergency', 'vacation', 'education', 'home', 'retirement', 'other'],
            default: 'savings',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        targetDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'paused', 'cancelled'],
            default: 'active',
        },
        milestones: [
            {
                percentage: { type: Number, required: true },
                amount: { type: Number, required: true },
                achieved: { type: Boolean, default: false },
                achievedAt: { type: Date },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes for performance
GoalSchema.index({ userId: 1, status: 1 });
GoalSchema.index({ userId: 1, category: 1 });

// Calculate progress percentage
GoalSchema.virtual('progress').get(function () {
    if (this.targetAmount === 0) return 0;
    return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
});

// Check and update milestones
GoalSchema.methods.updateMilestones = function () {
    const progress = (this.currentAmount / this.targetAmount) * 100;
    
    this.milestones.forEach((milestone) => {
        if (!milestone.achieved && progress >= milestone.percentage) {
            milestone.achieved = true;
            milestone.achievedAt = new Date();
        }
    });
};

export default mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);
