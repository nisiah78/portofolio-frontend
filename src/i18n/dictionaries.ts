import type { Locale } from "./config";
import en from "./en.json";

/** The dictionary shape is derived from the English source of truth. */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => Promise.resolve(en),
  de: () => import("./de.json").then((m) => m.default),
  fr: () => import("./fr.json").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
