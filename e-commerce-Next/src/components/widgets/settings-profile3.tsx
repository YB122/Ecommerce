"use client";

import { Globe, LogOut, Mail, Pencil, ShieldCheck, User as UserIcon } from "lucide-react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { showToast } from "nextjs-toast-notify";
import api from "@/lib/api";
import { ProfileSkeleton } from "@/components/widgets/skeletons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/base/avatar";
import { Badge } from "@/components/base/badge";
import { Button } from "@/components/base/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card";
import { Input } from "@/components/base/input";
import { Separator } from "@/components/base/separator";
import { cn } from "@/lib/utils";
import { User } from "@/contexts/UserContext";

interface SettingsProfile3Props {
  className?: string;
}

const SettingsProfile3 = ({ className }: SettingsProfile3Props) => {
  const t = useTranslations("profile");
  const { userData, setUserData, setUserToken, setUserRole } = useContext(User)!;
  const router = useRouter();

  const [phoneValue, setPhoneValue] = useState((userData?.phone as string) ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/user/profile");
        const profile = res.data?.data || res.data;
        if (profile) {
          setUserData(profile);
          setPhoneValue((profile.phone as string) ?? "");
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const initials = useMemo(
    () =>
      (userData?.name ?? "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    [userData?.name],
  );

  const role = userData?.role as string | undefined;
  const createdAt = userData?.createdAt as string | undefined;
  const googleId = userData?.googleId as string | null | undefined;
  const isActive = userData?.isActive as boolean | undefined;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await api.post("/user/upload-avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newUrl = res.data?.data?.imageURL || res.data?.imageURL;
      if (newUrl && userData) {
        setUserData({ ...userData, imageURL: newUrl });
      }
    } catch {
      // silent
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSavePhone = async () => {
    setSaving(true);
    try {
      await api.put("/user/profile", { phone: phoneValue || null });
      if (userData) {
        setUserData({ ...userData, phone: phoneValue || null });
      }
      showToast.success("Phone number saved successfully", {
        position: "top-center",
        duration: 3000,
      });
    } catch {
      showToast.error("Failed to save phone number", {
        position: "top-center",
        duration: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setUserToken(null);
    setUserData(null);
    setUserRole(null);
    const Cookies = (await import("js-cookie")).default;
    Cookies.remove("refreshToken");
    router.push("/login");
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className={cn("mx-auto max-w-2xl space-y-8 py-8", className)}>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <Avatar className="size-32 ring-4 ring-border sm:size-40">
            <AvatarImage
              src={userData?.imageURL as string | undefined}
              alt={userData?.name ?? ""}
              className="object-cover"
            />
            <AvatarFallback className="text-3xl">{initials || "U"}</AvatarFallback>
          </Avatar>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {uploading ? (
              <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Pencil className="size-4" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <div>
            <h1 className="text-2xl font-bold">{userData?.name}</h1>
            <div className="mt-1.5 flex items-center gap-2">
              <Badge variant={role === "admin" || role === "superAdmin" ? "default" : "secondary"}>
                {role === "superAdmin" ? t("superAdmin") : role === "admin" ? t("admin") : t("user")}
              </Badge>
              {!isActive && <Badge variant="destructive">{t("unverified")}</Badge>}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{userData?.email}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserIcon className="size-4" />
              {t("personalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t("email")}</p>
              <p className="mt-0.5 text-sm">{userData?.email}</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t("phone")}</p>
              <div className="mt-1 flex gap-2">
                <Input
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(e.target.value)}
                  placeholder={t("phonePlaceholder")}
                  className="h-9 text-sm"
                />
                <Button size="sm" onClick={handleSavePhone} disabled={saving}>
                  {saving ? t("saving") : t("save")}
                </Button>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t("memberSince")}</p>
              <p className="mt-0.5 text-sm">
                {createdAt
                  ? new Date(createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })
                  : "\u2014"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4" />
                {t("account")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="text-sm">{t("emailVerified")}</span>
                </div>
                <Badge variant={isActive ? "default" : "secondary"}>
                  {isActive ? t("yes") : t("no")}
                </Badge>
              </div>
              {googleId && (
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Globe className="size-4 text-muted-foreground" />
                    <span className="text-sm">{t("googleConnected")}</span>
                  </div>
                  <Badge variant="default">{t("yes")}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive" onClick={handleLogout}>
            <LogOut className="size-4" />
            {t("logout")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { SettingsProfile3 };
