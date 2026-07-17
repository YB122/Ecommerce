<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## i18n / Localization (next-intl v4)

- **Locales**: `en`, `fr`, `ar` — defined in `src/i18n/routing.ts` with `localePrefix: 'never'` (no URL prefix).
- **Middleware/Proxy**: `src/proxy.ts` detects locale from `NEXT_LOCALE` cookie or `Accept-Language` header, sets cookie on first visit.
- **Request Config**: `src/i18n/request.ts` loads messages from `messages/{locale}.json`.
- **Messages**: JSON files at project root `messages/{en,fr,ar}.json`.
- **Layout**: Root layout calls `getLocale()` + `getMessages()` server-side, passes to `NextIntlClientProvider`, sets `dir="rtl"` on `<html>` for Arabic.
- **Translations**: Use `useTranslations("namespace")` hook (client components). All static UI text should be in message files.
- **API localized fields**: Backend returns `en_name`/`fr_name`/`ar_name` and `en_description`/`fr_description`/`ar_description`. Use `getLocalizedField(obj, "name", locale)` from `@/lib/locale` to pick the right field.
- **Images**: Products have `imageURLs` as JSON string. Use `parseImageURLs(product)` from `@/lib/locale`.
- **Price formatting**: Use `useFormatPrice(locale)` from `@/lib/locale`.
- **Locale switcher**: `<LocaleSwitcher />` component available at `@/components/widgets/locale-switcher` — sets `NEXT_LOCALE` cookie and calls `router.refresh()`.
