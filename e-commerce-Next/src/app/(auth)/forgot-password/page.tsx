"use client";

import { useState } from "react";
import axios from "axios";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/base/button";
import { Input } from "@/components/base/input";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await axios.post("http://localhost:3007/v1/auth/forgot-password", { email });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-md border border-muted bg-background px-6 py-8 shadow-md">
          {sent ? (
            <div className="text-center">
              <Mail className="mx-auto mb-4 size-12 text-primary" />
              <h1 className="mb-2 text-xl font-semibold">{t("checkEmail")}</h1>
              <p className="text-sm text-muted-foreground">
                {t.rich("verificationSent", { email: () => <strong>{email}</strong> })}
              </p>
              <Button variant="outline" className="mt-6" render={<Link href="/login" />} nativeButton={false}>
                {t("backToLogin")}
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" /> {t("backToLogin")}
              </Link>
              <h1 className="mb-2 text-xl font-semibold">{t("forgotPasswordTitle")}</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                {t("forgotPasswordDesc")}
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                  {submitting ? "Sending..." : t("sendResetLink")}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
