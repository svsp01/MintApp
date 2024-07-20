import mongoose, { Document, Schema } from 'mongoose';

interface Item {
  emoji: string;
  label: string;
  defaultPrice: number;
}

interface Category extends Document {
  name: string;
  items: Item[];
  isDefault: boolean;
}

const ItemSchema = new Schema<Item>({
  emoji: { type: String, required: true },
  label: { type: String, required: true },
  defaultPrice: { type: Number, required: true }
});

const CategorySchema = new Schema<Category>({
  name: { type: String, required: true },
  items: { type: [ItemSchema], required: true },
  isDefault: { type: Boolean, default: false }
});

export default mongoose.models.Category || mongoose.model<Category>('Category', CategorySchema);
