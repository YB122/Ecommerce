"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { z } from "zod";

import { Button } from "@/components/base/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/base/field";
import { Input } from "@/components/base/input";
import api, { setAuth } from "@/lib/api";
import { cn } from "@/lib/utils";
import { User } from "@/contexts/UserContext";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface Login1Props {
  className?: string;
}

const Login1 = ({ className }: Login1Props) => {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const { setUserToken, setUserData, setUserRole } = useContext(User)!;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onGoogleLogin = () => {
    window.location.href = "http://localhost:3007/v1/auth/google/login";
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await axios.post("http://localhost:3007/v1/auth/login", data);
      const { accessToken, refreshToken } = res.data.data;

      Cookies.set("refreshToken", refreshToken, { expires: 365, sameSite: "lax" });
      localStorage.setItem("refreshToken", refreshToken);

      const decoded: { role?: string } = jwtDecode(accessToken);
      const role = decoded.role || "user";

      setUserToken(accessToken);
      setUserRole(role);
      setAuth(role, accessToken);

      const profileRes = await api.get("/user/profile");
      setUserData(profileRes.data.data);

      router.push("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      className={cn("flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted px-4", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      >
        <div className="rounded-md border border-muted bg-background px-6 py-8 shadow-md">
          <motion.h1
            className="mb-6 text-center text-xl font-semibold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {t("login")}
          </motion.h1>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-normal" htmlFor="login-email">
                      {t("email")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-normal" htmlFor="login-password">
                      {t("password")}
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        aria-invalid={fieldState.invalid}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}
              <div className="text-right">
                <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
                  {t("forgotPassword")}
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                {isSubmitting ? t("loggingIn") : t("login")}
              </Button>
            </FieldGroup>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t("or")}</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={onGoogleLogin}
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t("google")}
          </Button>
        </div>
        <motion.p
          className="mt-4 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {t("noAccount")}{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            {t("signupLink")}
          </Link>
        </motion.p>
      </motion.div>
    </motion.section>
  );
};

export { Login1 };
