import { Request, Response, NextFunction } from "express";
interface UserSearch {
    _id?: string;
    email?: string;
    role?: string;
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
export declare const getSignature: (bearer: string) => string | undefined;
/**
 * @desc Optional auth — tries to decode token but does NOT reject if missing/invalid.
 *       Sets req.user if valid token found, otherwise silently continues.
 */
export declare const softAuth: (req: Request, _res: Response, next: NextFunction) => void;
/**
 * @route Any
 * @desc Verifies JWT from Authorization header, attaches user info to req
 * @access Public
 * @throws { 401 } Missing or invalid token
 * @success { 200 } Proceeds to next middleware on valid token
 */
export declare const auth: (req: Request, res: Response, next: NextFunction) => void;
/**
 * @desc Creates a short-lived JWT access token for the given user
 * @param {UserSearch} userSearch - Object containing user id and role
 * @returns {string|undefined} Signed JWT access token, or undefined if role is invalid
 */
export declare const generateAccessToken: (userSearch: UserSearch) => string | undefined;
/**
 * @desc Creates a long-lived JWT refresh token for the given user
 * @param {UserSearch} userSearch - Object containing user id and role
 * @returns {string|undefined} Signed JWT refresh token (suffixed with _refresh), or undefined if role is invalid
 */
export declare const generateRefreshToken: (userSearch: UserSearch) => string | undefined;
export {};
//# sourceMappingURL=auth.d.ts.map