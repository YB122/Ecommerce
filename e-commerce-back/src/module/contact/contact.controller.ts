import { Router } from "express";
import { validateInput } from "../../common/utils/validate.js";
import { contactFormValidate } from "./contact.validate.js";
import { submitContactForm } from "./contact.service.js";

const router = Router();

router.post("/", validateInput(contactFormValidate), submitContactForm);

export default router;
