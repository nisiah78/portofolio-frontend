import type { Locale } from "@/i18n/config";

export const profile = {
  name: "Nomena Nisiah",
  handle: "nomena-nisiah",
  location: "Antananarivo, Madagascar",
  experienceYears: 9,
  email: "nix.nomena@gmail.com",
  phone: "+261 34 80 203 62",
  whatsappHref: "https://wa.me/261348020362",
  socials: {
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/nambinintsoa-nomena-nisiah",
    linkedinLabel: "linkedin/nambinintsoa-nomena-nisiah",
  },
} as const;

/** Localized profile facts rendered in the about section. */
export const languagesByLocale: Record<Locale, string> = {
  en: "Malagasy · French · English (B2)",
  fr: "Malgache · Français · Anglais (B2)",
  de: "Malagasy · Französisch · Englisch (B2)",
};

export const educationByLocale: Record<Locale, string> = {
  en: "M.Sc. Computer Science — ISSMI",
  fr: "Master en informatique — ISSMI",
  de: "M.Sc. Informatik — ISSMI",
};

/** Lines rendered in the "developer.ts" code card of the snapshot section. */
export type CodeEntry = { key: string; value: string; num?: boolean };

export const codeCard: { file: string; entries: CodeEntry[] } = {
  file: "developer.ts",
  entries: [
    { key: "name", value: '"Nomena Nisiah"' },
    { key: "role", value: '"Senior Fullstack PHP/Symfony Developer, AI-Driven"' },
    { key: "experience", value: "9", num: true },
    { key: "stack", value: '["Symfony", "Next.js", "TypeScript"]' },
    { key: "ia", value: '["claude", "cursor", "openAI"]' },
    { key: "aiFluent", value: "true", num: true },
    { key: "based", value: '"Antananarivo, Madagascar"' },
    { key: "remote", value: "true", num: true },
    { key: "available", value: "true", num: true },
  ],
};
