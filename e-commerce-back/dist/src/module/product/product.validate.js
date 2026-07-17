/** Joi validation schemas for product endpoints */
import Joi from "joi";
import detectInjection from "../../common/middleware/detectInjection.js";
/** Allowed sizes for clothing products */
const ALLOWED_SIZES = ["xs", "s", "m", "l", "xl", "xxl"];
/** Allowed color names mapped to hex codes */
export const COLOR_MAP = {
    Blue: "#1B2BFF",
    Green: "#1AFF12",
    Yellow: "#F3FF12",
    Orange: "#FF7512",
    Red: "#FF1212",
    Pink: "#FF1BDD",
    Navy: "#1A2B48",
    White: "#FBFBFB",
    Purple: "#991BFF",
    Black: "#0E0E0E",
};
/** Schema for a single variant: color + size + stock */
const variantSchema = Joi.object({
    color: Joi.string().valid(...Object.keys(COLOR_MAP)).required(),
    size: Joi.string().valid(...ALLOWED_SIZES).required(),
    stock: Joi.number().integer().min(0).required(),
});
/** Schema for a color-image mapping */
const colorImageSchema = Joi.object({
    color: Joi.string().valid(...Object.keys(COLOR_MAP)).required(),
    imageURL: Joi.string().optional().allow(""),
});
/** Validation schema for creating a product */
export const createProductValidate = Joi.object({
    en_name: Joi.string().required().custom(detectInjection),
    ar_name: Joi.string().optional().custom(detectInjection).allow(""),
    fr_name: Joi.string().optional().custom(detectInjection).allow(""),
    en_description: Joi.string().required().custom(detectInjection),
    ar_description: Joi.string().optional().custom(detectInjection).allow(""),
    fr_description: Joi.string().optional().custom(detectInjection).allow(""),
    price: Joi.number().min(1).required().custom(detectInjection),
    discount: Joi.number().min(0).max(100).optional().custom(detectInjection),
    subcategoryId: Joi.string().required().custom(detectInjection),
    variants: Joi.array().items(variantSchema).min(1).required(),
    colorImages: Joi.array().items(colorImageSchema).optional(),
});
/** Validation schema for updating a product */
export const updateProductValidate = Joi.object({
    en_name: Joi.string().optional().custom(detectInjection),
    ar_name: Joi.string().optional().custom(detectInjection).allow(""),
    fr_name: Joi.string().optional().custom(detectInjection).allow(""),
    en_description: Joi.string().optional().custom(detectInjection),
    ar_description: Joi.string().optional().custom(detectInjection).allow(""),
    fr_description: Joi.string().optional().custom(detectInjection).allow(""),
    price: Joi.number().min(1).optional().custom(detectInjection),
    discount: Joi.number().min(0).max(100).optional().custom(detectInjection),
    subcategoryId: Joi.string().optional().custom(detectInjection),
    imageURLs: Joi.string().optional().custom(detectInjection),
    addedByEmail: Joi.string().email().optional().custom(detectInjection),
    variants: Joi.array().items(variantSchema).min(1).optional(),
    colorImages: Joi.array().items(colorImageSchema).optional(),
});
//# sourceMappingURL=product.validate.js.map