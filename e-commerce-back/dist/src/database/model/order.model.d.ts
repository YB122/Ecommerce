/** Order model: items JSON, totalAmount, shippingCost, payment info, order status, shippingAddress JSON. */
import mongoose, { Document, Types } from "mongoose";
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
export declare const orderModel: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, mongoose.DefaultSchemaOptions> & IOrder & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOrder>;
//# sourceMappingURL=order.model.d.ts.map