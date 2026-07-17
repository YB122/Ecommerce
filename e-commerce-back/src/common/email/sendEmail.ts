/** Nodemailer email sender utility. */
import nodemailer from "nodemailer";
import { env } from "../../../config/env.service.js";

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
export const sendEmail = async ({
  email,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: env.email as string,
      pass: env.password as string,
    },
  });

  await transporter.sendMail({
    from: `"E-commerce" <${env.email}>`,
    to: email,
    subject,
    text,
    html,
  });
};
