/** Joi validation schemas for phone endpoints (send OTP, verify OTP) */
import Joi from "joi";
import detectInjection from "../../common/middleware/detectInjection.js";
/** Validation schema for sending OTP — required phone in international format */
export const sendOtpValidate = Joi.object({
    phone: Joi.string()
        .pattern(/^\+?[1-9]\d{6,14}$/)
        .required()
        .messages({
        "string.pattern.base": "Phone number must be in international format (e.g. +2126xxxxxxxx)",
        "any.required": "Phone number is required",
    })
        .custom(detectInjection),
});
/** Validation schema for OTP verification — required phone and 6-digit OTP */
export const verifyOtpValidate = Joi.object({
    phone: Joi.string()
        .pattern(/^\+?[1-9]\d{6,14}$/)
        .required()
        .messages({
        "string.pattern.base": "Phone number must be in international format (e.g. +2126xxxxxxxx)",
        "any.required": "Phone number is required",
    })
        .custom(detectInjection),
    otp: Joi.string()
        .length(6)
        .pattern(/^\d{6}$/)
        .required()
        .messages({
        "string.length": "OTP must be exactly 6 digits",
        "string.pattern.base": "OTP must be numeric",
        "any.required": "OTP is required",
    })
        .custom(detectInjection),
});
//# sourceMappingURL=phone.validate.js.map