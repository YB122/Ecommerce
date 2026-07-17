import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("privacy");
  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">Last updated: June 21, 2026</p>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          {t("content")}
        </div>
      </div>
    </section>
  );
}
