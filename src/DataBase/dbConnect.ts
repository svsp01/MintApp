import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect('mongodb+srv://VantaVerseSakthiSvsp:WfeDMZ$CYkThZm2@vantaverselovegame.cjjckqh.mongodb.net/Mint?retryWrites=true&w=majority', opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

let isConnected = false; 

export const db = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(`mongodb+srv://VantaVerseSakthiSvsp:WfeDMZ$CYkThZm2@vantaverselovegame.cjjckqh.mongodb.net/Mint?retryWrites=true&w=majority` as string);
    isConnected = true;
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new Error('Database connection failed');
  }
};


export default dbConnect;
