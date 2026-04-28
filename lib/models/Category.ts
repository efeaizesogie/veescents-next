import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  order: number;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
