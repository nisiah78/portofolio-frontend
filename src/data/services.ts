import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

export type Service = {
  key: keyof Dictionary["services"];
  fn: string;
  mini: string;
  description: Record<Locale, string>;
  image: string;
  alt: string;
};

/** Titles come from the dictionary (`services[key]`); descriptions are localized here. */
export const services: Service[] = [
  {
    key: "fullstack",
    fn: "fullstack()",
    mini: "fullstack",
    description: {
      en: "End-to-end delivery: from data model and API to a polished, accessible interface.",
      fr: "Livraison de bout en bout : du modèle de données et de l'API à une interface soignée et accessible.",
      de: "End-to-End-Umsetzung: vom Datenmodell und der API bis zu einer ausgefeilten, barrierefreien Oberfläche.",
    },
    image: "/images/service-fullstack.jpg",
    alt: "Fullstack web development — code editor",
  },
  {
    key: "backend",
    fn: "backend()",
    mini: "backend",
    description: {
      en: "Modular Symfony services, typed REST APIs, async job orchestration and clean domain design.",
      fr: "Services Symfony modulaires, API REST typées, orchestration de tâches asynchrones et conception de domaine propre.",
      de: "Modulare Symfony-Services, typisierte REST-APIs, asynchrone Job-Orchestrierung und sauberes Domain-Design.",
    },
    image: "/images/service-backend.jpg",
    alt: "Backend architecture — servers",
  },
  {
    key: "frontend",
    fn: "frontend()",
    mini: "frontend",
    description: {
      en: "Fast, accessible React & Next.js interfaces with TypeScript and thoughtful motion.",
      fr: "Interfaces React & Next.js rapides et accessibles, en TypeScript, avec des animations soignées.",
      de: "Schnelle, barrierefreie React- & Next.js-Oberflächen mit TypeScript und durchdachten Animationen.",
    },
    image: "/images/service-frontend.jpg",
    alt: "Frontend engineering — code on screen",
  },
  {
    key: "devops",
    fn: "devops()",
    mini: "devops",
    description: {
      en: "Dockerized services, CI, Nginx, and deploys on Vercel, DigitalOcean and beyond.",
      fr: "Services conteneurisés avec Docker, CI, Nginx, et déploiements sur Vercel, DigitalOcean et au-delà.",
      de: "Containerisierte Services mit Docker, CI, Nginx und Deployments auf Vercel, DigitalOcean und darüber hinaus.",
    },
    image: "/images/service-devops.jpg",
    alt: "DevOps and deployment — network",
  },
  {
    key: "ai",
    fn: "ai()",
    mini: "ai",
    description: {
      en: "Practical LLM features — agents, automations and content tools wired into real products.",
      fr: "Fonctionnalités LLM concrètes — agents, automatisations et outils de contenu intégrés à de vrais produits.",
      de: "Praxisnahe LLM-Funktionen — Agenten, Automatisierungen und Content-Tools, integriert in echte Produkte.",
    },
    image: "/images/service-ai.jpg",
    alt: "AI integration — neural network",
  },
];
