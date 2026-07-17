/** Joi validation schemas for cart endpoints */
import Joi from "joi";
/** Schema for adding to cart: productId, color, size, quantity */
export declare const addCartValidate: Joi.ObjectSchema<any>;
/** Schema for updating cart item quantity: quantity (min 1) */
export declare const updateCartQuantityValidate: Joi.ObjectSchema<any>;
//# sourceMappingURL=cart.validate.d.ts.map