/** Joi validation schemas for order endpoints */
import Joi from "joi";
/** Schema for creating an order: items[], paymentMethod, shippingAddress */
export declare const createOrderValidate: Joi.ObjectSchema<any>;
/** Schema for updating order status: orderStatus (required), paymentStatus (optional) */
export declare const updateOrderStatusValidate: Joi.ObjectSchema<any>;
//# sourceMappingURL=order.validate.d.ts.map