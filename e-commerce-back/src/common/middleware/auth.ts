/** JWT authentication middleware — verifies token and attaches req.user. */
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "./../../../config/env.service.js";

interface UserSearch {
  _id?: string;
  email?: string;
  role?: string;
}

interface TokenPayload extends JwtPayload {
  _id?: string;
}

declare global {
  namespace Express {
    interface User {
      _id?: string;
      role?: string;
    }
    interface Request {
      bearer?: string;
    }
  }
}

/**
 * @desc Selects the JWT secret based on the bearer role
 * @param {string} bearer - Role identifier (admin, user, superAdmin)
 * @returns {string|undefined} The JWT secret for the given role, or undefined if invalid
 */
export const getSignature = (bearer: string): string | undefined => {
  switch (bearer) {
    case "admin":
      return env.signatureAdmin;
    case "user":
      return env.signatureUser;
    case "superAdmin":
      return env.SIGNATURE_SUPER_ADMIN;
    default:
      return undefined;
      return undefined;
  }
};

/**
 * @desc Optional auth — tries to decode token but does NOT reject if missing/invalid.
 *       Sets req.user if valid token found, otherwise silently continues.
 */
export const softAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const { authorization } = req.headers;
  if (!authorization) return next();
  const [bearer, token] = authorization.split(" ");
  if (!bearer || !token) return next();
  const signature = getSignature(bearer);
  if (!signature) return next();
  try {
    const decode = jwt.verify(token, signature);
    if (decode) {
      req.user = decode as Express.User;
      req.bearer = bearer;
    }
  } catch {
    // ignore — no user attached
  }
  next();
};

/**
 * @route Any
 * @desc Verifies JWT from Authorization header, attaches user info to req
 * @access Public
 * @throws { 401 } Missing or invalid token
 * @success { 200 } Proceeds to next middleware on valid token
 */
export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ message: "Login required" });
    return;
  }
  const [bearer, token] = authorization.split(" ");
  if (!bearer || !token) {
    res.status(401).json({ message: "Invalid token format" });
    return;
  }

  const signature = getSignature(bearer);
  if (!signature) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  try {
    const decode = jwt.verify(token, signature);
    if (decode) {
      req.user = decode as Express.User;
      req.bearer = bearer;
    } else {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
  } catch (e) {
    console.error("Token verification failed:", e);
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  next();
};

/**
 * @desc Creates a short-lived JWT access token for the given user
 * @param {UserSearch} userSearch - Object containing user id and role
 * @returns {string|undefined} Signed JWT access token, or undefined if role is invalid
 */
export const generateAccessToken = (
  userSearch: UserSearch,
): string | undefined => {
  const role = userSearch.role || "user";
  const signature = getSignature(role);
  if (!signature) return undefined;
  return jwt.sign({ _id: userSearch._id }, signature, {
    expiresIn: env.accessToken as any,
  });
};

/**
 * @desc Creates a long-lived JWT refresh token for the given user
 * @param {UserSearch} userSearch - Object containing user id and role
 * @returns {string|undefined} Signed JWT refresh token (suffixed with _refresh), or undefined if role is invalid
 */
export const generateRefreshToken = (
  userSearch: UserSearch,
): string | undefined => {
  const role = userSearch.role || "user";
  const signature = getSignature(role);
  if (!signature) return undefined;
  return jwt.sign({ _id: userSearch._id }, signature + "_refresh", {
    expiresIn: env.refreshToken as any,
  });
};
