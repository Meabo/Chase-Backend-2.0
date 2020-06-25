import mongoose, { Schema, Document } from 'mongoose';
export const BrandsCollection = "Brands";

export interface IBrand extends Document {
  _id: Schema.Types.ObjectId;
  brandName: string;
  brandLogoUrl: String;
}

const brandsSchema: Schema = new Schema(
  { 
    _id: { type: Schema.Types.ObjectId, auto: true },
    brandName: { type: String, required: true },
    brandLogoUrl: { type: String, required: true },
  },
  {collection: BrandsCollection}
);

export const Brands = mongoose.model<IBrand>(BrandsCollection, brandsSchema);