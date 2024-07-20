import mongoose, { Schema, Document } from 'mongoose';

// Define the PlanSchema
const PlanSchema = new Schema({
  userID: { type: String, required: true },
  plan: {
    category: { type: String, required: true },
    emoji: { type: String, required: true },
    defaultPrice: { type: Number, required: true } 
  },
  date: { type: Date, required: true }
});

interface Plan extends Document {
  userID: string;
  plan: {
    category: string;
    emoji: string;
    defaultPrice: number; 
  };
  date: Date;
}

// Export the Plan model
const PlanModel = mongoose.models.Plan || mongoose.model<Plan>('Plan', PlanSchema);

export default PlanModel;
