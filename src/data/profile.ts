export const profile = {
  name: "Nomena Nisiah",
  handle: "nomena-nisiah",
  location: "Antananarivo, MG",
  experienceYears: 10,
  email: "nix.nomena@gmail.com",
  phone: "+261 34 80 203 62",
  whatsappHref: "https://wa.me/261348020362",
  cvPath: "/Nomena-Nisiah-CV.pdf",
  socials: {
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/nambinintsoa-nomena-nisiah",
    linkedinLabel: "linkedin/nambinintsoa-nomena-nisiah",
  },
  languages: "Malagasy · Français · English (B2)",
  education: "M.Sc. Computer Science — ISSMI",
} as const;

/** Lines rendered in the "developer.ts" code card of the snapshot section. */
export type CodeEntry = { key: string; value: string; num?: boolean };

export const codeCard: { file: string; entries: CodeEntry[] } = {
  file: "developer.ts",
  entries: [
    { key: "name", value: '"Nomena Nisiah"' },
    { key: "role", value: '"Senior Fullstack Engineer"' },
    { key: "experience", value: "10", num: true },
    { key: "stack", value: '["Symfony", "Next.js", "TypeScript"]' },
    { key: "based", value: '"Antananarivo, MG"' },
    { key: "remote", value: "true", num: true },
    { key: "available", value: "true", num: true },
  ],
};
