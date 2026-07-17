/** Security routes: superAdmin log viewer */
import { Router } from "express";
import { auth } from "../../common/middleware/auth.js";
import { allowRoles } from "../../common/utils/allowRoles.js";
import { getSecurityLogs } from "./security.service.js";

const router = Router();

/**
 * @route GET /security/logs
 * @desc Retrieve security logs
 * @access SuperAdmin
 * @returns { 200 } { message, data: Array<Object> }
 * @throws { 401 } Unauthorized
 * @throws { 403 } Forbidden
 * @throws { 500 } Internal server error
 */
router.get("/logs", auth, allowRoles("superAdmin"), getSecurityLogs);

export default router;
