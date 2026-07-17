export type Locale = "en" | "fr" | "ar";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLocalizedField(obj: any, field: string, locale: Locale): string {
  const localized = obj[`${locale}_${field}`];
  if (typeof localized === "string" && localized.trim()) return localized;
  const en = obj[`en_${field}`];
  if (typeof en === "string") return en;
  const fr = obj[`fr_${field}`];
  if (typeof fr === "string") return fr;
  const ar = obj[`ar_${field}`];
  if (typeof ar === "string") return ar;
  return "";
}

export function parseImageURLs(product: {
  imageURLs?: string;
  images?: string[];
}): string[] {
  try {
    const parsed = JSON.parse(product.imageURLs || "[]");
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  if (Array.isArray(product.images) && product.images.length > 0)
    return product.images;
  return ["/placeholder.svg"];
}

export const localeFlags: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export const dir = (locale: string): "ltr" | "rtl" =>
  locale === "ar" ? "rtl" : "ltr";

export function useFormatPrice(locale: string): (price: number) => string {
  const intlLocale = locale === "ar" ? "ar-AR" : locale === "fr" ? "fr-FR" : "en-US";
  const currency = locale === "ar" ? "SAR" : "USD";
  return (price: number) =>
    new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency,
    }).format(price);
}
