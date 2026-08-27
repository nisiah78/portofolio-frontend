import type { Locale } from "@/i18n/config";

export type PersonalProject = {
  slug: string;
  name: string;
  status: string;
  description: string;
  stack: string[];
  image: string;
  alt: string;
  github: string;
};

/** Side projects, outside of paid work — per locale. */
export const personalProjects: Record<Locale, PersonalProject[]> = {
  en: [
    {
      slug: "moozika",
      name: "Moozika",
      status: "In progress",
      description:
        "A tool for musicians to digitize sheet music — import a PDF or photo of a score in solfège or solfa notation, convert between the two systems, and play it back with a realistic piano sound. Saved scores are organized in a personal library, exportable to PDF at any time.",
      stack: ["Next.js", "Symfony", "Python", "Audiveris (OMR)", "MusicXML", "PostgreSQL", "MinIO"],
      image: "/images/project-moozika.png",
      github: "https://github.com/nisiah78/moozika",
      alt: "Moozika — sheet music editor screenshot",
    },
  ],
  fr: [
    {
      slug: "moozika",
      name: "Moozika",
      status: "En cours",
      description:
        "Un outil pour numériser des partitions musicales — importer un PDF ou une photo de partition en solfège ou en solfa, convertir entre les deux systèmes de notation, et la rejouer avec un son de piano réaliste. Les partitions enregistrées sont organisées dans une bibliothèque personnelle, exportable en PDF à tout moment.",
      stack: ["Next.js", "Symfony", "Python", "Audiveris (OMR)", "MusicXML", "PostgreSQL", "MinIO"],
      image: "/images/project-moozika.png",
      github: "https://github.com/nisiah78/moozika",
      alt: "Moozika — capture d'écran de l'éditeur de partitions",
    },
  ],
  de: [
    {
      slug: "moozika",
      name: "Moozika",
      status: "In Bearbeitung",
      description:
        "Ein Werkzeug zur Digitalisierung von Notenblättern — ein PDF oder Foto einer Partitur in Solfège- oder Solfa-Notation importieren, zwischen beiden Systemen konvertieren und mit einem realistischen Klavierklang abspielen. Gespeicherte Partituren werden in einer persönlichen Bibliothek organisiert und können jederzeit als PDF exportiert werden.",
      stack: ["Next.js", "Symfony", "Python", "Audiveris (OMR)", "MusicXML", "PostgreSQL", "MinIO"],
      image: "/images/project-moozika.png",
      github: "https://github.com/nisiah78/moozika",
      alt: "Moozika — Screenshot des Partitur-Editors",
    },
  ],
};
