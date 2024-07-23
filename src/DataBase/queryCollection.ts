
import dbConnect from './dbConnect'; // Correct import path
import mongoose from 'mongoose';

export async function getAllCollectionNames(): Promise<string[]> {
  try {
    await dbConnect(); // Ensure the database connection is established

    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.map((collection: { name: string }) => collection.name);
  } catch (error) {
    console.error('Error fetching collection names:', error);
    return [];
  }
}
