import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
}

const SectionSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const existingModel = mongoose.models.Section as mongoose.Model<ISection> | undefined;

if (existingModel && !existingModel.schema.path('image')) {
  existingModel.schema.add({ image: { type: String, default: '' } });
}

export default existingModel || mongoose.model<ISection>('Section', SectionSchema);
