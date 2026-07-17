/** Product model: name, price, discount, variants (color/size/stock), images, belongsTo Subcategory, soft delete. */
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  en_name: string;
  ar_name?: string | null;
  fr_name?: string | null;
  en_description: string;
  ar_description?: string | null;
  fr_description?: string | null;
  price: number;
  discount: number;
  imageURLs?: string | null;
  colorImages?: string | null;
  variants?: string | null;
  subcategoryId: Types.ObjectId;
  addedByEmail: string;
  isActive: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    en_name: { type: String, required: true },
    ar_name: { type: String, default: null },
    fr_name: { type: String, default: null },
    en_description: { type: String, required: true },
    ar_description: { type: String, default: null },
    fr_description: { type: String, default: null },
    price: { type: Number, required: true, min: 1 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    imageURLs: { type: String, default: null },
    colorImages: { type: String, default: null },
    variants: { type: String, default: null },
    subcategoryId: { type: Schema.Types.ObjectId, ref: "Subcategory", required: true },
    addedByEmail: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const productModel = mongoose.model<IProduct>("Product", productSchema);
