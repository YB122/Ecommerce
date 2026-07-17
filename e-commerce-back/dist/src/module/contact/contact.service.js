import { sendEmail } from "../../common/email/sendEmail.js";
export const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        await sendEmail({
            email: "youssefbenyamineiti2025@gmail.com",
            subject: `[Contact Form] ${subject}`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
        });
        res.status(200).json({ message: "Message sent successfully" });
    }
    catch (error) {
        console.error("Contact form error:", error?.message);
        res.status(500).json({ message: "Failed to send message" });
    }
};
//# sourceMappingURL=contact.service.js.map