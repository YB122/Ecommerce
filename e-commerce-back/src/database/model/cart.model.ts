/** Cart model: userId + productId + color + size + quantity, belongsTo Product. */
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICart extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  color: string;
  size: string;
  quantity: number;
}

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true },
);

cartSchema.index({ userId: 1, productId: 1, color: 1, size: 1 }, { unique: true });

export const cartModel = mongoose.model<ICart>("Cart", cartSchema);
