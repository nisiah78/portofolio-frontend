export const locales = ["en", "de", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  fr: "FR",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
