import mongoose from 'mongoose';

const ScrapingTaskSchema = new mongoose.Schema({
  keyword: String,
  userId: String,
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.ScrapingTask || mongoose.model('ScrapingTask', ScrapingTaskSchema);