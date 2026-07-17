"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/base/button";
import { Skeleton } from "@/components/base/skeleton";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:3007/v1/auth/verify-email/${token}`);
        setMessage(res.data?.message || "Email verified successfully");
        setStatus("success");
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage("Verification failed. The link may be invalid or expired.");
        }
        setStatus("error");
      }
    })();
  }, [token]);

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm text-center">
        <div className="rounded-md border border-muted bg-background px-6 py-8 shadow-md">
          {status === "loading" && (
            <div className="space-y-4">
              <Skeleton className="mx-auto size-12 rounded-full" />
              <Skeleton className="mx-auto h-6 w-48" />
            </div>
          )}
          {status === "success" && (
            <>
              <CheckCircle2 className="mx-auto mb-4 size-12 text-emerald-500" />
              <h1 className="mb-2 text-xl font-semibold">{message}</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                You can now log in to your account.
              </p>
              <Button render={<Link href="/login" />} nativeButton={false}>
                Go to Login
              </Button>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="mx-auto mb-4 size-12 text-destructive" />
              <h1 className="mb-2 text-xl font-semibold">Verification failed</h1>
              <p className="mb-6 text-sm text-muted-foreground">{message}</p>
              <Button variant="outline" render={<Link href="/login" />} nativeButton={false}>
                Back to Login
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
