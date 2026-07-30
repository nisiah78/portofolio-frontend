import type { Locale } from "@/i18n/config";

/** Locale-specific CV PDFs served from /public/cv (static, Vercel-safe). */
const cvByLocale: Record<Locale, string> = {
  en: "/cv/nomena-en.pdf",
  fr: "/cv/nomena-fr.pdf",
  de: "/cv/nomena-de.pdf",
};

const downloadNameByLocale: Record<Locale, string> = {
  en: "Nomena-Nisiah-CV-EN.pdf",
  fr: "Nomena-Nisiah-CV-FR.pdf",
  de: "Nomena-Nisiah-CV-DE.pdf",
};

export function getCvHref(locale: Locale): string {
  return cvByLocale[locale];
}

export function getCvDownloadName(locale: Locale): string {
  return downloadNameByLocale[locale];
}
