"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/base/button";
import { Input } from "@/components/base/input";

export function ResetPasswordPageContent({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const t = useTranslations("auth");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await axios.post(`http://localhost:3007/v1/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      setDone(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted px-4">
        <div className="w-full max-w-sm text-center">
          <div className="rounded-md border border-muted bg-background px-6 py-8 shadow-md">
            <h1 className="text-xl font-semibold">{t("resetPasswordTitle")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You can now log in with your new password.
            </p>
            <Button className="mt-6" render={<Link href="/login" />} nativeButton={false}>
              {t("backToLogin")}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-md border border-muted bg-background px-6 py-8 shadow-md">
          <h1 className="mb-2 text-xl font-semibold">{t("resetPasswordTitle")}</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter your new password below.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t("newPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                maxLength={20}
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
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={t("confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {submitting ? t("resetting") : t("resetPassword")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
