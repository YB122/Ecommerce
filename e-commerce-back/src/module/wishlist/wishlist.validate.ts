/** Joi validation schemas for wishlist endpoints */
import Joi from "joi";
import detectInjection from "../../common/middleware/detectInjection.js";

/** Schema for adding to wishlist: productId (positive integer) */
export const addWishlistValidate = Joi.object({
  productId: Joi.number()
    .integer()
    .positive()
    .required()
    .custom(detectInjection),
});
