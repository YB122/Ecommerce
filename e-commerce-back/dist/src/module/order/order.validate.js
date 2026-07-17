/** Joi validation schemas for order endpoints */
import Joi from "joi";
import detectInjection from "../../common/middleware/detectInjection.js";
import { COLOR_MAP } from "../product/product.validate.js";
const ALLOWED_SIZES = ["xs", "s", "m", "l", "xl", "xxl"];
const itemSchema = Joi.object({
    productId: Joi.string().required().custom(detectInjection),
    color: Joi.string().valid(...Object.keys(COLOR_MAP)).required(),
    size: Joi.string().valid(...ALLOWED_SIZES).required(),
    quantity: Joi.number().integer().min(1).required().custom(detectInjection),
    price: Joi.number().min(0).optional().custom(detectInjection),
});
/** Schema for creating an order: items[], paymentMethod, shippingAddress */
export const createOrderValidate = Joi.object({
    items: Joi.array()
        .items(itemSchema)
        .min(1)
        .required()
        .custom(detectInjection),
    paymentMethod: Joi.string()
        .valid("cod", "card")
        .required()
        .custom(detectInjection),
    shippingAddress: Joi.object({
        fullName: Joi.string().required().custom(detectInjection),
        phone: Joi.string().required().custom(detectInjection),
        street: Joi.string().required().custom(detectInjection),
        city: Joi.string().required().custom(detectInjection),
        state: Joi.string().required().custom(detectInjection),
        zipCode: Joi.string().required().custom(detectInjection),
        country: Joi.string().required().custom(detectInjection),
    })
        .required()
        .custom(detectInjection),
});
/** Schema for updating order status: orderStatus (required), paymentStatus (optional) */
export const updateOrderStatusValidate = Joi.object({
    orderStatus: Joi.string()
        .valid("pending", "processing", "shipped", "delivered", "cancelled")
        .required()
        .custom(detectInjection),
    paymentStatus: Joi.string()
        .valid("pending", "paid", "failed")
        .optional()
        .custom(detectInjection),
});
//# sourceMappingURL=order.validate.js.map