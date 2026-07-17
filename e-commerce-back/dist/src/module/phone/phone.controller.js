/** Phone routes: send OTP and verify OTP */
import { Router } from "express";
import { auth } from "../../common/middleware/auth.js";
import { validateInput } from "../../common/utils/validate.js";
import { sendOtpHandler, verifyOtpHandler } from "./phone.service.js";
import { sendOtpValidate, verifyOtpValidate } from "./phone.validate.js";
const router = Router();
/**
 * @route POST /v1/phone/send-otp
 * @desc Send a 6-digit OTP to the user's phone via WhatsApp
 * @access User
 * @body { phone: string }
 * @returns { 200 } { message } - OTP sent to WhatsApp
 * @throws { 500 } Failed to send OTP
 */
router.post("/send-otp", auth, validateInput(sendOtpValidate), sendOtpHandler);
/**
 * @route POST /v1/phone/verify-otp
 * @desc Verify OTP and save phone number to user profile
 * @access User
 * @body { phone: string, otp: string }
 * @returns { 200 } { message } - Phone verified and saved
 * @throws { 400 } OTP expired or invalid
 * @throws { 401 } Authentication required
 * @throws { 404 } User not found
 */
router.post("/verify-otp", auth, validateInput(verifyOtpValidate), verifyOtpHandler);
export default router;
//# sourceMappingURL=phone.controller.js.map