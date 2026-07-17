"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/base/select";
import { localeNames, localeFlags } from "@/lib/locale";
import type { Locale } from "@/lib/locale";

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();

  const handleChange = (newLocale: "en" | "fr" | "ar" | null) => {
    if (!newLocale) return;
    Cookies.set("NEXT_LOCALE", newLocale, { path: "/", expires: 365 });
    router.refresh();
  };

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-32">
        <SelectValue>
          <span className="flex items-center gap-2">
            <span>{localeFlags[locale]}</span>
            <span>{localeNames[locale]}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(localeNames) as Locale[]).map((loc) => (
          <SelectItem key={loc} value={loc}>
            <span className="flex items-center gap-2">
              <span>{localeFlags[loc]}</span>
              <span>{localeNames[loc]}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
