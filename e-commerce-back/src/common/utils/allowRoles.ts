/** Middleware that restricts route access by user role (admin, user, superAdmin). */
import { Request, Response, NextFunction } from "express";

/**
 * @desc Middleware factory that restricts route access to specified user roles
 * @param {...string[]} roles - One or more allowed role names (e.g. "admin", "user", "superAdmin")
 * @returns {import("express").RequestHandler} Express middleware that returns 403 if req.bearer is not in roles
 * @throws { 403 } Access denied if role is not permitted
 */
export const allowRoles =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.bearer || !roles.includes(req.bearer)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    next();
  };
