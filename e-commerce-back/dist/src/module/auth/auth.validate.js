/** Joi validation schemas for auth endpoints (signup, login, reset password) */
import Joi from "joi";
import detectInjection from "../../common/middleware/detectInjection.js";
/** Validation schema for user signup — email, password, confirmPassword, role, phone (name auto-derived from email) */
export const signupValidate = Joi.object({
    email: Joi.string().email().required().custom(detectInjection),
    password: Joi.string().min(6).max(20).required(),
    confirmPassword: Joi.string()
        .min(6)
        .max(20)
        .required()
        .valid(Joi.ref("password"))
        .custom(detectInjection),
    role: Joi.string()
        .valid("admin", "user", "superAdmin")
        .optional()
        .custom(detectInjection),
    phone: Joi.string().optional().custom(detectInjection),
});
/** Validation schema for email/password login */
export const loginValidate = Joi.object({
    email: Joi.string().email().required().custom(detectInjection),
    password: Joi.string().required().custom(detectInjection),
});
/** Validation schema for password reset — password and confirmPassword */
export const resetPasswordValidate = Joi.object({
    password: Joi.string().min(6).max(20).required().custom(detectInjection),
    confirmPassword: Joi.string()
        .min(6)
        .max(20)
        .required()
        .valid(Joi.ref("password"))
        .custom(detectInjection),
});
//# sourceMappingURL=auth.validate.js.map