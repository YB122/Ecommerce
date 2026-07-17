interface SendEmailOptions {
    email: string;
    subject: string;
    text?: string;
    html?: string;
}
/**
 * @desc Sends an email via Nodemailer transporter using Gmail SMTP
 * @param {Object} options - email options
 * @param {string} options.email - recipient email address
 * @param {string} options.subject - email subject line
 * @param {string} [options.text] - plain text body
 * @param {string} [options.html] - HTML body
 * @returns {Promise<void>}
 */
export declare const sendEmail: ({ email, subject, text, html, }: SendEmailOptions) => Promise<void>;
export {};
//# sourceMappingURL=sendEmail.d.ts.map