/** Order model: items JSON, totalAmount, shippingCost, payment info, order status, shippingAddress JSON. */
import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ["cod", "card"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    orderStatus: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    shippingAddress: { type: String, required: true },
}, { timestamps: true });
export const orderModel = mongoose.model("Order", orderSchema);
//# sourceMappingURL=order.model.js.map