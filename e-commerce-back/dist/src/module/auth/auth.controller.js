/** Auth routes: email/password signup & login, Google OAuth, email verification, password reset */
import { Router } from "express";
import passport from "passport";
import { initPassport } from "./passport.config.js";
import { googleSignupHandler, googleLoginHandler, signupHandler, loginHandler, verifyEmail, resendVerifyEmail, forgotPasswordHandler, resetPasswordHandler, refreshAccessToken, } from "./auth.service.js";
import { validateInput } from "../../common/utils/validate.js";
import { rateLimiter } from "../../common/utils/rateLimit.js";
import { softAuth } from "../../common/middleware/auth.js";
import { signupValidate, loginValidate, resetPasswordValidate, } from "./auth.validate.js";
const router = Router();
const validRoles = ["admin", "user", "superAdmin"];
const ensurePassport = (req, res, next) => {
    initPassport();
    next();
};
/**
 * @route GET /v1/auth/google/signup
 * @desc Redirect to Google OAuth consent screen for signup
 * @access Public
 * @query { role } - Optional role to assign to new user (admin|user|superAdmin)
 * @returns { Redirect } 302 Redirect to Google
 */
router.get("/google/signup", ensurePassport, (req, res, next) => {
    const role = req.query.role || "user";
    if (!validRoles.includes(role)) {
        return res
            .status(400)
            .json({ message: `Role must be one of: ${validRoles.join(", ")}` });
    }
    const state = JSON.stringify({ role });
    passport.authenticate("google-signup", {
        state,
        scope: ["profile", "email"],
        session: false,
    })(req, res, next);
});
/**
 * @route GET /v1/auth/google/signup/callback
 * @desc Google OAuth signup callback — creates user if new email
 * @access Public
 * @returns { 200 } { message, data: { accessToken, refreshToken, user } }
 * @throws { 400 } Google signup failed / Account already exists
 */
router.get("/google/signup/callback", ensurePassport, (req, res, next) => {
    passport.authenticate("google-signup", { session: false }, (err, user, info) => {
        if (err)
            return next(err);
        if (!user)
            return res
                .status(400)
                .json({ message: info?.message || "Google signup failed" });
        req.user = user;
        next();
    })(req, res, next);
}, googleSignupHandler);
/**
 * @route GET /v1/auth/google/login
 * @desc Redirect to Google OAuth consent screen for login
 * @access Public
 * @returns { Redirect } 302 Redirect to Google
 */
router.get("/google/login", ensurePassport, passport.authenticate("google-login", {
    scope: ["profile", "email"],
    session: false,
}));
/**
 * @route GET /v1/auth/google/login/callback
 * @desc Google OAuth login callback — authenticates existing user
 * @access Public
 * @returns { 200 } { message, data: { accessToken, refreshToken, user } }
 * @throws { 400 } Google login failed / No account found
 */
router.get("/google/login/callback", ensurePassport, (req, res, next) => {
    passport.authenticate("google-login", { session: false }, (err, user, info) => {
        if (err)
            return next(err);
        if (!user)
            return res
                .status(400)
                .json({ message: info?.message || "Google login failed" });
        req.user = user;
        next();
    })(req, res, next);
}, googleLoginHandler);
/**
 * @route POST /v1/auth/signup
 * @desc Register a new user with email and password
 * @access Public
 * @body { email: string, password: string, confirmPassword: string, role?: string, phone?: string }
 * @returns { 201 } { message } - Signup successful, verification email sent
 * @throws { 400 } Email already exists / Passwords do not match
 * @throws { 500 } Internal server error
 */
router.post("/signup", softAuth, validateInput(signupValidate), signupHandler);
/**
 * @route POST /auth/login
 * @desc Email/password login
 * @access Public
 * @body { email, password }
 * @returns { token, user }
 * @example { token: "abc123", user: { id: 1, email: "user@example.com" } }
 * @throws { 400 } Invalid credentials
 * @throws { 401 } Account not verified
 * @throws { 404 } User not found
 * @throws { 500 } Internal server error
 * @success { 200 } Login successful
 */
router.post("/login", validateInput(loginValidate), loginHandler);
/**
 * @route GET /v1/auth/verify-email/:token
 * @desc Verify user email address using JWT token
 * @access Public
 * @param { string } token - Email verification token
 * @returns { 200 } { message } - Email verified successfully / already verified
 * @throws { 400 } Invalid or expired token
 */
router.get("/verify-email/:token", verifyEmail);
/**
 * @route POST /v1/auth/resend-verify-email
 * @desc Resend verification email to user
 * @access Public
 * @body { email: string }
 * @returns { 200 } { message } - Verification email resent
 * @throws { 400 } User not found
 * @throws { 500 } Internal server error
 */
router.post("/resend-verify-email", rateLimiter(60), resendVerifyEmail);
/**
 * @route POST /v1/auth/forgot-password
 * @desc Send password reset link to user email
 * @access Public
 * @body { email: string }
 * @returns { 200 } { message } - Reset link sent if email exists
 * @throws { 500 } Internal server error
 */
router.post("/forgot-password", rateLimiter(60), forgotPasswordHandler);
/**
 * @route POST /v1/auth/reset-password/:token
 * @desc Reset password using token received via email
 * @access Public
 * @param { string } token - Password reset token
 * @body { password: string, confirmPassword: string }
 * @returns { 200 } { message } - Password reset successful
 * @throws { 400 } Passwords do not match / Invalid or expired token
 */
router.post("/reset-password/:token", validateInput(resetPasswordValidate), rateLimiter(60), resetPasswordHandler);
router.post('/access-token', refreshAccessToken);
export default router;
//# sourceMappingURL=auth.controller.js.map