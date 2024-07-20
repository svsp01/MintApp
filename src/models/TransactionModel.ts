import mongoose, { Document, Schema } from 'mongoose';

interface Transaction extends Document {
  category: string;
  itemName: string;
  amount: number;
  emoji: string;
  userId: string;
  date: Date;
}

const TransactionSchema = new Schema<Transaction>({
  category: { type: String, required: true },
  itemName: { type: String, required: true },
  amount: { type: Number, required: true },
  emoji: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction || mongoose.model<Transaction>('Transaction', TransactionSchema);
