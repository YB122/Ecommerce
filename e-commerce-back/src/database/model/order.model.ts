/** Order model: items JSON, totalAmount, shippingCost, payment info, order status, shippingAddress JSON. */
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: string;
  totalAmount: number;
  shippingCost: number;
  paymentMethod: "cod" | "card";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
}

const orderSchema = new Schema<IOrder>(
  {
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
  },
  { timestamps: true },
);

export const orderModel = mongoose.model<IOrder>("Order", orderSchema);
