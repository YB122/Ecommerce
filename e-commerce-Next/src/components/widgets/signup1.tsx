"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
import { cn } from "@/lib/utils";
import { User } from "@/contexts/UserContext";

const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .max(255, "Email is too long"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must not exceed 20 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

interface Signup1Props {
  className?: string;
}

const Signup1 = ({ className }: Signup1Props) => {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const router = useRouter();
  const { setUserToken, setUserData, setUserRole } = useContext(User)!;

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const handleResend = async () => {
    setResending(true);
    setResendMsg(null);
    try {
      await axios.post("http://localhost:3007/v1/auth/resend-verify-email", {
        email: form.getValues("email"),
      });
      setResendMsg("Verification email resent!");
    } catch {
      setResendMsg("Failed to resend. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  const onGoogleSignup = () => {
    window.location.href = "http://localhost:3007/v1/auth/google/signup";
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await axios.post("http://localhost:3007/v1/auth/signup", {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      console.log("signup res", res.data);

      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
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
          {isSuccess ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <svg className="size-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="mb-2 text-lg font-semibold">{t("checkEmail")}</h2>
              <p className="text-sm text-muted-foreground">
                {t.rich("verificationSent", { email: () => <strong>{form.getValues("email")}</strong> })}
              </p>
              {resendMsg && (
                <p className={`mt-3 text-xs ${resendMsg.includes("Failed") ? "text-destructive" : "text-emerald-600"}`}>
                  {resendMsg}
                </p>
              )}
              <Button
                variant="link"
                size="sm"
                className="mt-2 h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                disabled={resending}
                onClick={handleResend}
              >
                {resending ? "Sending..." : "Resend verification email"}
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">{t("redirecting")}</p>
            </div>
          ) : (
          <>
          <h1 className="mb-6 text-center text-xl font-semibold">{t("signupTitle")}</h1>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-normal" htmlFor="signup-email">
                      {t("email")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-email"
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
                    <FieldLabel className="text-sm font-normal" htmlFor="signup-password">
                      {t("password")}
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 6 chars, upper + lower + number"
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
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-normal" htmlFor="signup-confirm">
                      {t("confirmPassword")}
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="signup-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repeat your password"
                        aria-invalid={fieldState.invalid}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                {isSubmitting ? t("creatingAccount") : t("signupTitle")}
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
            onClick={onGoogleSignup}
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t("google")}
          </Button>
        </>
      )}
        </div>
        <motion.p
          className="mt-4 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {t("hasAccount")}{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t("loginLink")}
          </Link>
        </motion.p>
      </motion.div>
    </motion.section>
  );
};

export { Signup1 };
