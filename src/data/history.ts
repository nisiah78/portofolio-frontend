import type { Locale } from "@/i18n/config";

export type HistoryEntry = {
  period: string;
  role: string;
  org: string;
  /** Shown in the bubble that opens on hover/click. */
  summary: string;
  highlights: string[];
  stack: string[];
};

/** Experience timeline, per locale — facts sourced from resume.md. */
export const history: Record<Locale, HistoryEntry[]> = {
  en: [
    {
      period: "2025 — now",
      role: "Senior PHP Engineer",
      org: "Novity",
      summary:
        "Online platform to run the full operations of organizations and associations — CRM, accounting, website and more.",
      highlights: [
        "Led code-base migration and optimization",
        "Designed and built new features",
        "Async task maintenance & monitoring, plus several SDKs",
        "Set up agentic development rules for AI IDEs & tools",
      ],
      stack: ["Symfony", "MySQL", "Redis", "Docker", "AWS S3", "Azure"],
    },
    {
      period: "2023 — 2025",
      role: "Senior PHP Engineer",
      org: "Ubiweb · Canada",
      summary:
        "Digital-marketing solution on a multi-tenant platform for SMEs and investors.",
      highlights: [
        "Micro-services and REST APIs",
        "AI micro-service for automated review & email responses",
        "Orchestration of async, long-running and scheduled tasks with forecasting",
        "Real-time sync with Google My Business, Meta, Yext, Kraken, AWS",
        "Internal SDKs published on Packagist",
      ],
      stack: ["Symfony", "MySQL", "MongoDB", "Temporal.io", "RoadRunner", "OpenAI"],
    },
    {
      period: "2022 — 2023",
      role: "Fullstack Engineer",
      org: "Unlocked / Meta BV · Netherlands",
      summary:
        "E-sports game-hosting platform (League of Legends, Rainbow Six, Clash Royale, FIFA) with digital marketing — formerly Meta BV.",
      highlights: [
        "Tournament micro-service using regression & classification",
        "React front-end",
        "E-marketplace with online payments",
        "Streaming donation pots and a web-scraping micro-service",
      ],
      stack: ["React", "TypeScript", "Redux", "Symfony", "Node.js", "Stripe"],
    },
    {
      period: "2020 — 2025",
      role: "Technical Lead",
      org: "Kleap · Switzerland",
      summary:
        "AI-powered website builder and content-creation tools.",
      highlights: [
        "Migrated the builder from headless WordPress to Next.js + Symfony",
        "Flexible data model for page rendering",
        "Micro-services: accounting, marketplace, workspace, layout, admin",
        "In-house multilingual translation micro-service",
        "Team planning, unblocking, CEO reporting and server OPS",
      ],
      stack: ["Next.js", "React", "TypeScript", "Symfony", "Mercure", "OpenAI", "Replicate"],
    },
    {
      period: "2018 — 2022",
      role: "Fullstack Engineer",
      org: "Pulse · Axian Group · Madagascar",
      summary:
        "Local software house building web & mobile apps across Madagascar and abroad (Togo, Réunion, Comoros).",
      highlights: [
        "Selfcare, Mbalik, Parasol, SimS across Symfony 2 → 4",
        "Parasol with REST API + PostGIS",
        "Selfcare Togo & a Payment Gateway in Java Spring Boot + WSO2",
        "Technical study, design and documentation with the team",
      ],
      stack: ["Symfony", "Java / Spring Boot", "WSO2", "PostGIS", "SOAP", "Phalcon"],
    },
    {
      period: "2018 — 2019",
      role: "Symfony / React Developer",
      org: "Levea · France — Remote",
      summary: "Online restaurant platform (France), fully remote.",
      highlights: [
        "Maintained and built React restaurant sites",
        "Migrated the backend from Symfony 2.4 to 4",
        "Stripe payments + real-time async order tracking via Urbantz",
      ],
      stack: ["Symfony", "React", "Stripe"],
    },
    {
      period: "2017 — 2018",
      role: "PHP Developer",
      org: "Ingenosya · Madagascar",
      summary:
        "Web development and SEO for WordPress and CodeIgniter sites (Nounous2Paris, Nounous2Nantes, Henri Fraise).",
      highlights: [
        "Development, maintenance and SEO optimization",
        "WordPress and CodeIgniter",
      ],
      stack: ["PHP", "WordPress", "CodeIgniter"],
    },
  ],
  fr: [
    {
      period: "2025 — en cours",
      role: "Développeur PHP Senior",
      org: "Novity",
      summary:
        "Plateforme en ligne pour piloter l'ensemble des opérations des organisations et associations — CRM, comptabilité, site web et plus encore.",
      highlights: [
        "Migration et optimisation de la base de code",
        "Conception et développement de nouvelles fonctionnalités",
        "Maintenance et monitoring de tâches asynchrones, plus plusieurs SDKs",
        "Mise en place de règles de développement agentiques pour IDE et outils IA",
      ],
      stack: ["Symfony", "MySQL", "Redis", "Docker", "AWS S3", "Azure"],
    },
    {
      period: "2023 — 2025",
      role: "Développeur PHP Senior",
      org: "Ubiweb · Canada",
      summary:
        "Solution de marketing digital sur une plateforme multi-tenant destinée aux PME et investisseurs.",
      highlights: [
        "Micro-services et API REST",
        "Micro-service IA pour l'analyse et la réponse automatique aux avis et emails clients",
        "Orchestration de tâches asynchrones, longues ou programmées, avec prévision",
        "Synchronisation temps réel avec Google My Business, Meta, Yext, Kraken, AWS",
        "SDKs internes publiés sur Packagist",
      ],
      stack: ["Symfony", "MySQL", "MongoDB", "Temporal.io", "RoadRunner", "OpenAI"],
    },
    {
      period: "2022 — 2023",
      role: "Développeur Fullstack",
      org: "Unlocked / Meta BV · Pays-Bas",
      summary:
        "Plateforme d'hébergement de jeux e-sport (League of Legends, Rainbow Six, Clash Royale, FIFA) avec marketing digital — anciennement Meta BV.",
      highlights: [
        "Micro-service de tournois utilisant régression et classification",
        "Front-end React",
        "E-marketplace avec paiement en ligne",
        "Cagnottes en ligne pour le streaming et micro-service de web scraping",
      ],
      stack: ["React", "TypeScript", "Redux", "Symfony", "Node.js", "Stripe"],
    },
    {
      period: "2020 — 2025",
      role: "Lead Technique",
      org: "Kleap · Suisse",
      summary:
        "Website builder et outils de création de contenu intégrant des fonctionnalités IA.",
      highlights: [
        "Migration du website builder d'un WordPress headless vers Next.js et Symfony",
        "Conception d'une structure de données flexible pour le rendu des pages",
        "Micro-services : comptabilité, marketplace, workspace, layout, admin",
        "Micro-service de traduction multilingue en interne",
        "Planification d'équipe, déblocage des collaborateurs, reporting au CEO et OPS serveurs",
      ],
      stack: ["Next.js", "React", "TypeScript", "Symfony", "Mercure", "OpenAI", "Replicate"],
    },
    {
      period: "2018 — 2022",
      role: "Développeur Fullstack",
      org: "Pulse · Axian Group · Madagascar",
      summary:
        "Société de développement locale réalisant des applications web et mobile à Madagascar et à l'étranger (Togo, La Réunion, Comores).",
      highlights: [
        "Selfcare, Mbalik, Parasol, SimS sous Symfony 2 → 4",
        "Parasol avec API REST + PostGIS",
        "Selfcare Togo et une Payment Gateway en Java Spring Boot + WSO2",
        "Étude technique, conception et documentation en équipe",
      ],
      stack: ["Symfony", "Java / Spring Boot", "WSO2", "PostGIS", "SOAP", "Phalcon"],
    },
    {
      period: "2018 — 2019",
      role: "Développeur Symfony / React",
      org: "Levea · France — Télétravail",
      summary: "Plateforme de restauration en ligne (France), en télétravail complet.",
      highlights: [
        "Maintenance et développement de sites de restauration en React",
        "Migration du backend de Symfony 2.4 vers Symfony 4",
        "Paiements Stripe et suivi asynchrone des commandes en temps réel via Urbantz",
      ],
      stack: ["Symfony", "React", "Stripe"],
    },
    {
      period: "2017 — 2018",
      role: "Développeur PHP",
      org: "Ingenosya · Madagascar",
      summary:
        "Développement web et optimisation SEO de sites WordPress et CodeIgniter (Nounous2Paris, Nounous2Nantes, Henri Fraise).",
      highlights: [
        "Développement, maintenance et optimisation SEO",
        "WordPress et CodeIgniter",
      ],
      stack: ["PHP", "WordPress", "CodeIgniter"],
    },
  ],
  de: [
    {
      period: "2025 — heute",
      role: "Senior PHP-Entwickler",
      org: "Novity",
      summary:
        "Online-Plattform zur Steuerung sämtlicher Abläufe von Organisationen und Vereinen — CRM, Buchhaltung, Website und mehr.",
      highlights: [
        "Leitung der Migration und Optimierung der Codebasis",
        "Konzeption und Entwicklung neuer Funktionen",
        "Wartung und Monitoring asynchroner Aufgaben sowie mehrerer SDKs",
        "Einführung agentischer Entwicklungsregeln für KI-IDEs und -Tools",
      ],
      stack: ["Symfony", "MySQL", "Redis", "Docker", "AWS S3", "Azure"],
    },
    {
      period: "2023 — 2025",
      role: "Senior PHP-Entwickler",
      org: "Ubiweb · Kanada",
      summary:
        "Digitale Marketinglösung auf einer Multi-Tenant-Plattform für KMUs und Investoren.",
      highlights: [
        "Microservices und REST-APIs",
        "KI-Microservice für automatisierte Bewertungs- und E-Mail-Antworten",
        "Orchestrierung asynchroner, lang laufender und geplanter Aufgaben mit Prognose",
        "Echtzeit-Synchronisation mit Google My Business, Meta, Yext, Kraken, AWS",
        "Interne SDKs veröffentlicht auf Packagist",
      ],
      stack: ["Symfony", "MySQL", "MongoDB", "Temporal.io", "RoadRunner", "OpenAI"],
    },
    {
      period: "2022 — 2023",
      role: "Fullstack-Entwickler",
      org: "Unlocked / Meta BV · Niederlande",
      summary:
        "E-Sport-Hosting-Plattform (League of Legends, Rainbow Six, Clash Royale, FIFA) mit digitalem Marketing — vormals Meta BV.",
      highlights: [
        "Turnier-Microservice mit Regressions- und Klassifikationsalgorithmen",
        "React-Frontend",
        "E-Marketplace mit Online-Zahlungen",
        "Streaming-Spendentöpfe und ein Web-Scraping-Microservice",
      ],
      stack: ["React", "TypeScript", "Redux", "Symfony", "Node.js", "Stripe"],
    },
    {
      period: "2020 — 2025",
      role: "Technical Lead",
      org: "Kleap · Schweiz",
      summary:
        "KI-gestützter Website-Builder und Content-Erstellungstools.",
      highlights: [
        "Migration des Builders von headless WordPress zu Next.js + Symfony",
        "Flexibles Datenmodell für das Seiten-Rendering",
        "Microservices: Buchhaltung, Marketplace, Workspace, Layout, Admin",
        "Interner mehrsprachiger Übersetzungs-Microservice",
        "Teamplanung, Beseitigung von Blockaden, CEO-Reporting und Server-OPS",
      ],
      stack: ["Next.js", "React", "TypeScript", "Symfony", "Mercure", "OpenAI", "Replicate"],
    },
    {
      period: "2018 — 2022",
      role: "Fullstack-Entwickler",
      org: "Pulse · Axian Group · Madagaskar",
      summary:
        "Lokales Softwarehaus für Web- und Mobile-Apps in Madagaskar und im Ausland (Togo, Réunion, Komoren).",
      highlights: [
        "Selfcare, Mbalik, Parasol, SimS mit Symfony 2 → 4",
        "Parasol mit REST-API + PostGIS",
        "Selfcare Togo und ein Payment Gateway in Java Spring Boot + WSO2",
        "Technische Analyse, Konzeption und Dokumentation im Team",
      ],
      stack: ["Symfony", "Java / Spring Boot", "WSO2", "PostGIS", "SOAP", "Phalcon"],
    },
    {
      period: "2018 — 2019",
      role: "Symfony-/React-Entwickler",
      org: "Levea · Frankreich — Remote",
      summary: "Online-Restaurant-Plattform (Frankreich), vollständig remote.",
      highlights: [
        "Wartung und Entwicklung von Restaurant-Websites mit React",
        "Migration des Backends von Symfony 2.4 auf 4",
        "Stripe-Zahlungen und asynchrones Echtzeit-Tracking der Bestellungen über Urbantz",
      ],
      stack: ["Symfony", "React", "Stripe"],
    },
    {
      period: "2017 — 2018",
      role: "PHP-Entwickler",
      org: "Ingenosya · Madagaskar",
      summary:
        "Webentwicklung und SEO-Optimierung für WordPress- und CodeIgniter-Websites (Nounous2Paris, Nounous2Nantes, Henri Fraise).",
      highlights: [
        "Entwicklung, Wartung und SEO-Optimierung",
        "WordPress und CodeIgniter",
      ],
      stack: ["PHP", "WordPress", "CodeIgniter"],
    },
  ],
};
