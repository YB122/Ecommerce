/**
 * @desc Sends an OTP message via Infobip WhatsApp API
 * @param {string} phone - recipient phone number
 * @param {string} otp - one-time password to send
 * @returns {Promise<void>}
 * @throws {AxiosError} if Infobip API call fails
 */
export declare const sendWhatsAppOtp: (phone: string, otp: string) => Promise<void>;
//# sourceMappingURL=sendWhatsApp.d.ts.map