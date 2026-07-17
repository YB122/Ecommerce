/** Cart model: userId + productId + color + size + quantity, belongsTo Product. */
import mongoose, { Schema } from "mongoose";
const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
}, { timestamps: true });
cartSchema.index({ userId: 1, productId: 1, color: 1, size: 1 }, { unique: true });
export const cartModel = mongoose.model("Cart", cartSchema);
//# sourceMappingURL=cart.model.js.map