import Joi from "joi";
export const contactFormValidate = Joi.object({
    name: Joi.string().required().min(1).max(200),
    email: Joi.string().email().required(),
    subject: Joi.string().required().min(1).max(500),
    message: Joi.string().required().min(1).max(5000),
});
//# sourceMappingURL=contact.validate.js.map