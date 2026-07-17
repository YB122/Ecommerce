/** Category model: name, image, soft delete, hasMany Subcategories. */
import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  en_name: string;
  ar_name?: string | null;
  fr_name?: string | null;
  imageURL?: string | null;
  addedByEmail: string;
  isActive: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    en_name: { type: String, required: true },
    ar_name: { type: String, default: null },
    fr_name: { type: String, default: null },
    imageURL: { type: String, default: null },
    addedByEmail: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

categorySchema.virtual("subcategories", {
  ref: "Subcategory",
  localField: "_id",
  foreignField: "categoryId",
});

export const categoryModel = mongoose.model<ICategory>("Category", categorySchema);
