/** Joi validation middleware that validates req.body against a schema. */
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
/**
 * @desc Express middleware that validates req.body against the provided Joi schema
 * @param {Joi.ObjectSchema} schema - Joi schema to validate against
 * @returns {import("express").RequestHandler} Middleware that returns 400 on validation failure
 * @throws { 400 } Validation error with details from Joi
 * @success { 200 } Proceeds to next middleware on valid input
 */
export declare const validateInput: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map