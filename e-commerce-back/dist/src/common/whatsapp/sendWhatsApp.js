/** Infobip WhatsApp API wrapper for sending OTP messages. */
import axios from "axios";
import { env } from "../../../config/env.service.js";
/**
 * @desc Sends an OTP message via Infobip WhatsApp API
 * @param {string} phone - recipient phone number
 * @param {string} otp - one-time password to send
 * @returns {Promise<void>}
 * @throws {AxiosError} if Infobip API call fails
 */
export const sendWhatsAppOtp = async (phone, otp) => {
    const url = `${env.INFOBIP_BASE_URL}/whatsapp/1/message/text`;
    const payload = {
        from: env.INFOBIP_WHATSAPP_SENDER,
        to: phone,
        content: {
            text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
        },
    };
    await axios.post(url, payload, {
        headers: {
            Authorization: `App ${env.INFOBIP_API_KEY}`,
            "Content-Type": "application/json",
        },
    });
};
//# sourceMappingURL=sendWhatsApp.js.map