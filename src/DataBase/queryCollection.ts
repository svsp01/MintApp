
import dbConnect from './dbConnect'; 
import mongoose from 'mongoose';

export async function getAllCollectionNames() {
  try {
    const collections = Object.keys(mongoose.models);
    console.log("Collections from mongoose.models:", collections);
    return collections;
  } catch (error) {
    console.error('Error getting collection names:', error);
    throw error;
  }
}
