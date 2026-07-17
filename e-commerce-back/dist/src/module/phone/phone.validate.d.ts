/** Joi validation schemas for phone endpoints (send OTP, verify OTP) */
import Joi from "joi";
/** Validation schema for sending OTP — required phone in international format */
export declare const sendOtpValidate: Joi.ObjectSchema<any>;
/** Validation schema for OTP verification — required phone and 6-digit OTP */
export declare const verifyOtpValidate: Joi.ObjectSchema<any>;
//# sourceMappingURL=phone.validate.d.ts.map