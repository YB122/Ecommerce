/** Product model: name, price, discount, variants (color/size/stock), images, belongsTo Subcategory, soft delete. */
import mongoose, { Document, Types } from "mongoose";
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
export declare const productModel: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, mongoose.DefaultSchemaOptions> & IProduct & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProduct>;
//# sourceMappingURL=product.model.d.ts.map