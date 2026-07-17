/** Joi custom validator that detects SQL/NoSQL injection attempts in string inputs. */
import Joi from "joi";
/**
 * @desc Custom Joi validator that scans string inputs for SQL/NoSQL injection patterns.
 *       On detection, logs a security alert and permanently blocks the source IP via Redis.
 * @param {string} value - The string value to validate
 * @param {Joi.CustomHelpers} helpers - Joi helpers providing access to context (ipAddress)
 * @returns {string} The original value if safe
 * @throws {Joi.ValidationError} Error code "string.injection" if suspicious patterns are found
 */
declare const detectInjection: (value: string, helpers: Joi.CustomHelpers) => string;
export default detectInjection;
//# sourceMappingURL=detectInjection.d.ts.map