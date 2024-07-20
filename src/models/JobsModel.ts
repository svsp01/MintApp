import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  url: String,
  postedAt: Date,
  keywords: String,
  scrapedAt: Date
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);