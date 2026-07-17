/** Subcategory model: name, belongsTo Category, soft delete, hasMany Products. */
import mongoose, { Schema } from "mongoose";
const subcategorySchema = new Schema({
    en_name: { type: String, required: true },
    ar_name: { type: String, default: null },
    fr_name: { type: String, default: null },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    addedByEmail: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
subcategorySchema.virtual("products", {
    ref: "Product",
    localField: "_id",
    foreignField: "subcategoryId",
});
export const subcategoryModel = mongoose.model("Subcategory", subcategorySchema);
//# sourceMappingURL=subcategory.model.js.map