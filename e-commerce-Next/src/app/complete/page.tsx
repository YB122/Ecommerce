"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Loading } from "@/app/loading";

function CompleteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      router.replace(`/order?session_id=${sessionId}`);
    } else {
      router.replace("/order");
    }
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <p className="text-muted-foreground">Processing your payment...</p>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={<Loading />}>
      <CompleteInner />
    </Suspense>
  );
}
