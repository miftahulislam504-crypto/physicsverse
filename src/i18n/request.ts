// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export type Locale = "en" | "bn";
export const locales: Locale[] = ["en", "bn"];
export const defaultLocale: Locale = "en";

export default getRequestConfig(async () => {
  // Read locale from cookie (set by LocaleSwitcher component)
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value as Locale | undefined;
  const locale: Locale =
    cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`./\${locale}/common.json`)).default,
  };
});
