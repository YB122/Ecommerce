/** Joi validation schemas for category endpoints */
import Joi from "joi";
import detectInjection from "../../common/middleware/detectInjection.js";
/** Validation schema for creating a category */
export const createCategoryValidate = Joi.object({
    en_name: Joi.string().required().custom(detectInjection),
    ar_name: Joi.string().optional().custom(detectInjection).allow(""),
    fr_name: Joi.string().optional().custom(detectInjection).allow(""),
});
/** Validation schema for updating a category */
export const updateCategoryValidate = Joi.object({
    en_name: Joi.string().optional().custom(detectInjection),
    ar_name: Joi.string().optional().custom(detectInjection).allow(""),
    fr_name: Joi.string().optional().custom(detectInjection).allow(""),
    imageURL: Joi.string().optional().custom(detectInjection),
    addedByEmail: Joi.string().email().optional().custom(detectInjection),
});
//# sourceMappingURL=category.validate.js.map