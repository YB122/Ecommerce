/** Phone OTP logic: generate OTP, store in Redis, send via WhatsApp, verify */
import { Request, Response } from "express";
/**
 * @desc Generate 6-digit OTP, store in Redis with 5-min TTL, send via WhatsApp
 * @param {Request} req - Express request with body { phone }
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 * @throws {Error} Failed to send OTP via WhatsApp
 */
export declare const sendOtpHandler: (req: Request, res: Response) => Promise<void>;
/**
 * @desc Verify OTP from Redis, delete it on success, save phone to user profile
 * @param {Request} req - Express request with body { phone, otp }
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 * @throws {Error} OTP expired, invalid, or user not found
 */
export declare const verifyOtpHandler: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=phone.service.d.ts.map