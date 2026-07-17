import { client } from "../../database/redis.connection.js";
import { userModel } from "../../database/model/user.model.js";
import { sendWhatsAppOtp } from "../../common/whatsapp/sendWhatsApp.js";
const OTP_EXPIRY = 300;
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
/**
 * @desc Generate 6-digit OTP, store in Redis with 5-min TTL, send via WhatsApp
 * @param {Request} req - Express request with body { phone }
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 * @throws {Error} Failed to send OTP via WhatsApp
 */
export const sendOtpHandler = async (req, res) => {
    try {
        const { phone } = req.body;
        const normalizedPhone = phone.startsWith("+") ? phone : `+${phone}`;
        const otp = generateOtp();
        await client.set(`otp:${normalizedPhone}`, otp, { EX: OTP_EXPIRY });
        await sendWhatsAppOtp(normalizedPhone, otp);
        res.status(200).json({ message: "OTP sent to your WhatsApp" });
    }
    catch (error) {
        console.error("Send OTP error:", error?.message);
        res.status(500).json({ message: error?.message || "Failed to send OTP" });
    }
};
/**
 * @desc Verify OTP from Redis, delete it on success, save phone to user profile
 * @param {Request} req - Express request with body { phone, otp }
 * @param {Response} res - Express response
 * @returns {Promise<void>}
 * @throws {Error} OTP expired, invalid, or user not found
 */
export const verifyOtpHandler = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const normalizedPhone = phone.startsWith("+") ? phone : `+${phone}`;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const storedOtp = await client.get(`otp:${normalizedPhone}`);
        if (!storedOtp) {
            res
                .status(400)
                .json({ message: "OTP expired or not found. Request a new one." });
            return;
        }
        if (storedOtp !== otp) {
            res.status(400).json({ message: "Invalid OTP" });
            return;
        }
        await client.del(`otp:${normalizedPhone}`);
        const user = await userModel.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        await user.update({ phone: normalizedPhone });
        res
            .status(200)
            .json({ message: "Phone number verified and saved successfully" });
    }
    catch (error) {
        console.error("Verify OTP error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=phone.service.js.map