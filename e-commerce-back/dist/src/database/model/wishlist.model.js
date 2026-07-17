/** Wishlist model: userId + productId, belongsTo Product. */
import mongoose, { Schema } from "mongoose";
const wishlistSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
}, { timestamps: true });
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });
export const wishlistModel = mongoose.model("Wishlist", wishlistSchema);
//# sourceMappingURL=wishlist.model.js.map