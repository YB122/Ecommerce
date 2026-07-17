/** Joi validation schemas for subcategory endpoints */
import Joi from "joi";
import detectInjection from "../../common/middleware/detectInjection.js";
/** Validation schema for creating a subcategory */
export const createSubcategoryValidate = Joi.object({
    en_name: Joi.string().required().custom(detectInjection),
    ar_name: Joi.string().optional().custom(detectInjection).allow(""),
    fr_name: Joi.string().optional().custom(detectInjection).allow(""),
    categoryId: Joi.string().required().custom(detectInjection)
});
/** Validation schema for updating a subcategory */
export const updateSubcategoryValidate = Joi.object({
    en_name: Joi.string().optional().custom(detectInjection),
    ar_name: Joi.string().optional().custom(detectInjection).allow(""),
    fr_name: Joi.string().optional().custom(detectInjection).allow(""),
    categoryId: Joi.string().optional().custom(detectInjection),
    addedByEmail: Joi.string().email().optional().custom(detectInjection),
    isActive: Joi.boolean().optional(),
});
//# sourceMappingURL=subcategory.validate.js.map