/** Auth business logic: user creation, token generation, email verification, password reset */
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../../common/middleware/auth.js";
import { userModel } from "../../database/model/user.model.js";
import { getClient } from "../../database/redis.connection.js";
import { sendEmail } from "../../common/email/sendEmail.js";
import { env } from "../../../config/env.service.js";
import { getSignature } from "../../common/middleware/auth.js";
interface GoogleUser {
  _id: string;
  role: string;
}

export const googleSignupHandler = (req: Request, res: Response): void => {
  const user = req.user as GoogleUser;
  if (!user) {
    res.status(400).json({ message: "Google signup failed" });
    return;
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  if (!accessToken || !refreshToken) {
    res.status(500).json({ message: "Token generation failed" });
    return;
  }
  res.status(200).json({
    message: "Google signup successful",
    data: {
      accessToken,
      refreshToken,
      user: { _id: user._id, role: user.role },
    },
  });
};

export const googleLoginHandler = (req: Request, res: Response): void => {
  const user = req.user as GoogleUser;
  if (!user) {
    res.status(400).json({ message: "Google login failed" });
    return;
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  if (!accessToken || !refreshToken) {
    res.status(500).json({ message: "Token generation failed" });
    return;
  }
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  res.redirect(`${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
};

export const signupHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, confirmPassword, role, phone } = req.body;

    const targetRole = role || "user";
    if (targetRole === "admin" || targetRole === "superAdmin") {
      const requester = req.user;
      if (!requester || requester.role !== "superAdmin") {
        res.status(403).json({ message: "Only super admins can create admin accounts" });
        return;
      }
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, Number(env.hash) || 10);

    const name = email.split("@")[0];

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      isActive: role === "admin" || role === "superAdmin" ? true : false,
      phone,
    });
    if (!user) {
      res.status(400).json({ message: "User creation failed" });
      return;
    }

    const verifyToken = jwt.sign({ _id: String(user._id) }, env.verifySignature || "my", {
      expiresIn: "1h",
    });
    const verifyLink = `${env.base_url}/v1/auth/verify-email/${verifyToken}`;

    await sendEmail({
      email: user.email,
      subject: "Verify your email",
      text: `Click this link to verify your email: ${verifyLink}`,
      html: `<p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`,
    });

    res.status(201).json({ message: "Signup successful — verification email sent" });
  } catch (error: any) {
    console.error("Signup error:", error?.errors || error.message);
    res.status(500).json({
      message: error?.message || error?.errors || "Internal server error",
    });
  }
};

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({ message: "Please verify your email first" });
      return;
    }

    if (!user.password) {
      res.status(400).json({ message: "This account uses Google login" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const accessToken = generateAccessToken({ _id: String(user._id), role: user.role });
    const refreshToken = generateRefreshToken({ _id: String(user._id), role: user.role });

    res.status(200).json({
      message: "Login successful",
      data: { accessToken, refreshToken, role: user.role, user: { _id: user._id, name: user.name, email: user.email, imageURL: user.imageURL } },
    });
  } catch (error: any) {
    console.error("Login error:", error?.errors || error.message);
    res.status(500).json({ message: error?.message || "Internal server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.params.token as string;
    const decoded = jwt.verify(token, env.verifySignature || "my") as jwt.JwtPayload;

    const user = await userModel.findById(decoded._id);
    if (!user) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    if (user.isActive) {
      res.status(200).json({ message: "Email already verified" });
      return;
    }

    user.isActive = true;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error: any) {
    console.error("Verify email error:", error?.message);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const resendVerifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    if (user.isActive) {
      res.status(200).json({ message: "Email already verified" });
      return;
    }

    const verifyToken = jwt.sign({ _id: String(user._id) }, env.verifySignature || "my", {
      expiresIn: "1h",
    });
    const verifyLink = `${env.base_url}/v1/auth/verify-email/${verifyToken}`;

    await sendEmail({
      email: user.email,
      subject: "Verify your email",
      text: `Click this link to verify your email: ${verifyLink}`,
      html: `<p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`,
    });

    res.status(200).json({ message: "Verification email resent" });
  } catch (error: any) {
    console.error("Resend verify error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPasswordHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(200).json({ message: "If the email exists, a reset link has been sent" });
      return;
    }

    const resetToken = jwt.sign({ _id: String(user._id) }, env.verifySignature || "my", {
      expiresIn: "15m",
    });
    const redis = await getClient().catch(() => null);
    if (redis) await redis.set(`reset:${resetToken}`, String(user._id), { EX: 900 });
    const resetLink = `${env.base_url}/v1/auth/reset-password/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: "Reset your password",
      text: `Click this link to reset your password: ${resetLink}`,
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.status(200).json({ message: "If the email exists, a reset link has been sent" });
  } catch (error: any) {
    console.error("Forgot password error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPasswordHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.params.token as string;
    const { password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }
    const decoded = jwt.verify(token, env.verifySignature || "my") as jwt.JwtPayload;
    const redis = await getClient().catch(() => null);
    const redisId = redis ? await redis.get(`reset:${token}`) : null;
    if (!redisId || String(redisId) !== String(decoded._id)) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    const user = await userModel.findById(decoded._id);
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, Number(env.hash) || 10);
    user.password = hashedPassword;
    await user.save();
    const redisDel = await getClient().catch(() => null);
    if (redisDel) await redisDel.del(`reset:${token}`);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error: any) {
    console.error("Reset password error:", error?.message);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ message: "Login required" });
    return;
  }

  const parts = authorization.split(" ");
  const token = parts.length === 1 ? parts[0] : parts[1];

  if (!token) {
    res.status(401).json({ message: "Invalid token format" });
    return;
  }

  const validRoles = ["user", "admin", "superAdmin"];
  let decoded: { _id: string } | null = null;

  for (const role of validRoles) {
    const sig = getSignature(role);
    if (!sig) continue;
    try {
      decoded = jwt.verify(token, sig + "_refresh") as { _id: string };
      break;
    } catch {}
  }

  if (!decoded) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
    return;
  }

  try {
    const user = await userModel.findById(decoded._id);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const accessToken = generateAccessToken({ _id: String(user._id), role: user.role });
    if (!accessToken) {
      res.status(500).json({ message: "Token generation failed" });
      return;
    }

    res.status(200).json({
      message: "Access token refreshed successfully",
      data: { accessToken },
    });
  } catch {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};
