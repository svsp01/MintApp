import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  password: String,
  phoneNumber: String,
  monthlyIncome: Number,
  profileImageUrl: String,
  bio: String,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
