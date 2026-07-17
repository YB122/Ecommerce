/** Passport.js Google OAuth strategy configuration for signup and login */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Request } from "express";
import { env } from "../../../config/env.service.js";
import { userModel } from "../../database/model/user.model.js";

const getHighQualityPhoto = (url: string | null | undefined): string | null => {
  if (!url) return null;
  return url
    .replace(/=s\d+-c/, "=s1024-c")
    .replace(/\/s\d+-c\//, "/s1024-c/")
    .replace(/=s\d+$/, "=s1024-c");
};

let initialized = false;

export const initPassport = () => {
  if (initialized) return;
  initialized = true;

  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  passport.use(
    "google-signup",
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${env.base_url}/v1/auth/google/signup/callback`,
        passReqToCallback: true,
      },
      async (
        req: Request,
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
      ) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(null, false, {
              message: "No email found from Google account",
            });
          }

          const existingUser = await userModel.findOne({ email });
          if (existingUser) {
            return done(null, false, {
              message:
                "An account with this email already exists. Please login instead.",
            });
          }

          let role = "user";
          try {
            const state = req.query.state as string;
            if (state) {
              const parsed = JSON.parse(state);
              role = parsed.role || "user";
            }
          } catch {}

          const name = email.split("@")[0] || `user_${profile.id}`;

          const user = await userModel.create({
            name,
            email,
            googleId: profile.id,
            imageURL: getHighQualityPhoto(profile.photos?.[0]?.value),
            isActive: true,
            role: role as "admin" | "user" | "superAdmin",
          });

          return done(null, { _id: String(user._id), role: user.role });
        } catch (error: any) {
          console.error("Google signup error:", error?.errors || error.message);
          return done(error, false);
        }
      },
    ),
  );

  passport.use(
    "google-login",
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${env.base_url}/v1/auth/google/login/callback`,
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
      ) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(null, false, {
              message: "No email found from Google account",
            });
          }

          const user = await userModel.findOne({ email });
          if (!user) {
            return done(null, false, {
              message: "No account found with this email. Please signup first.",
            });
          }

          if (!user.isActive) {
            return done(null, false, {
              message: "Please verify your email first.",
            });
          }

          if (!user.googleId) {
            user.googleId = profile.id;
            const hqPhoto = getHighQualityPhoto(profile.photos?.[0]?.value);
            if (hqPhoto && !user.imageURL) {
              user.imageURL = hqPhoto;
            }
          }
          await user.save();

          return done(null, { _id: String(user._id), role: user.role });
        } catch (error) {
          return done(error as Error, false);
        }
      },
    ),
  );
};
