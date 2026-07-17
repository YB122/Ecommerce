/** Wishlist model: userId + productId, belongsTo Product. */
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWishlist extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true },
);

wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const wishlistModel = mongoose.model<IWishlist>("Wishlist", wishlistSchema);
