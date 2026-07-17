/** Joi validation schemas for user endpoints */
import Joi from "joi";
import detectInjection from "../../common/middleware/detectInjection.js";
/** Validation schema for profile update — optional phone in international format */
export const updateProfileValidate = Joi.object({
    phone: Joi.string()
        .pattern(/^\+?[1-9]\d{6,14}$/)
        .optional()
        .messages({
        "string.pattern.base": "Phone number must be in international format (e.g. +2126xxxxxxxx)",
    })
        .custom(detectInjection),
});
//# sourceMappingURL=user.validate.js.map