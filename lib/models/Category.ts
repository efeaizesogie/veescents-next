import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const existingModel = mongoose.models.Category as mongoose.Model<ICategory> | undefined;

if (existingModel && !existingModel.schema.path('image')) {
  existingModel.schema.add({ image: { type: String, default: '' } });
}

export default existingModel || mongoose.model<ICategory>('Category', CategorySchema);
