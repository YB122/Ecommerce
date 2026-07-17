/** Joi validation schemas for cart endpoints */
import Joi from "joi";
import detectInjection from "../../common/middleware/detectInjection.js";
import { COLOR_MAP } from "../product/product.validate.js";
const ALLOWED_SIZES = ["xs", "s", "m", "l", "xl", "xxl"];
/** Schema for adding to cart: productId, color, size, quantity */
export const addCartValidate = Joi.object({
    productId: Joi.string().required().custom(detectInjection),
    color: Joi.string().valid(...Object.keys(COLOR_MAP)).required(),
    size: Joi.string().valid(...ALLOWED_SIZES).required(),
    quantity: Joi.number().integer().min(1).required().custom(detectInjection),
});
/** Schema for updating cart item quantity: quantity (min 1) */
export const updateCartQuantityValidate = Joi.object({
    quantity: Joi.number().integer().min(1).required().custom(detectInjection),
});
//# sourceMappingURL=cart.validate.js.map