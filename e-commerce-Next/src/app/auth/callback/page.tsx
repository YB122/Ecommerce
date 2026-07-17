"use client";

import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect } from "react";

import api, { setAuth } from "@/lib/api";
import { User } from "@/contexts/UserContext";
import { Skeleton } from "@/components/base/skeleton";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserToken, setUserData, setUserRole } = useContext(User)!;

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      Cookies.set("refreshToken", refreshToken, { expires: 365, sameSite: "lax" });
      localStorage.setItem("refreshToken", refreshToken);

      const decoded: { role?: string } = jwtDecode(accessToken);
      const role = decoded.role || "user";

      setUserToken(accessToken);
      setUserRole(role);
      setAuth(role, accessToken);

      api
        .get("/user/profile")
        .then((res) => {
          setUserData(res.data.data);
          router.push("/");
        })
        .catch(() => {
          router.push("/");
        });
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <p className="text-muted-foreground">Completing authentication...</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Skeleton className="h-6 w-56" />
      </div>
    }>
      <CallbackInner />
    </Suspense>
  );
}
