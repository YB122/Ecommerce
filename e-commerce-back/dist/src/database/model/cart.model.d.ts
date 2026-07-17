/** Cart model: userId + productId + color + size + quantity, belongsTo Product. */
import mongoose, { Document, Types } from "mongoose";
export interface ICart extends Document {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    color: string;
    size: string;
    quantity: number;
}
export declare const cartModel: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart, {}, mongoose.DefaultSchemaOptions> & ICart & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICart>;
//# sourceMappingURL=cart.model.d.ts.map