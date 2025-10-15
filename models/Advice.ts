import mongoose, { Document, Schema } from 'mongoose';

export interface IAdvice extends Document {
  userId: mongoose.Types.ObjectId;
  prompt: string;
  response: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdviceSchema = new Schema<IAdvice>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for recent advice queries
AdviceSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Advice || mongoose.model<IAdvice>('Advice', AdviceSchema);

