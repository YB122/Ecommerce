/** Joi validation schemas for auth endpoints (signup, login, reset password) */
import Joi from "joi";
/** Validation schema for user signup — email, password, confirmPassword, role, phone (name auto-derived from email) */
export declare const signupValidate: Joi.ObjectSchema<any>;
/** Validation schema for email/password login */
export declare const loginValidate: Joi.ObjectSchema<any>;
/** Validation schema for password reset — password and confirmPassword */
export declare const resetPasswordValidate: Joi.ObjectSchema<any>;
//# sourceMappingURL=auth.validate.d.ts.map