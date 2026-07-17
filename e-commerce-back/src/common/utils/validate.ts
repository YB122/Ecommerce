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
export const validateInput = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body || typeof req.body !== "object") {
      res.status(400).json({
        message: "Request body is required. Use Content-Type: application/json",
      });
      return;
    }
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      context: { ipAddress: req.ip },
    });
    if (error) {
      res
        .status(400)
        .json({ message: "validation error", error: error.details });
      return;
    }
    next();
  };
};
