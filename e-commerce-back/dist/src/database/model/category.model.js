/** Category model: name, image, soft delete, hasMany Subcategories. */
import mongoose, { Schema } from "mongoose";
const categorySchema = new Schema({
    en_name: { type: String, required: true },
    ar_name: { type: String, default: null },
    fr_name: { type: String, default: null },
    imageURL: { type: String, default: null },
    addedByEmail: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
categorySchema.virtual("subcategories", {
    ref: "Subcategory",
    localField: "_id",
    foreignField: "categoryId",
});
export const categoryModel = mongoose.model("Category", categorySchema);
//# sourceMappingURL=category.model.js.map