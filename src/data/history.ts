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

/** Experience timeline, per locale — facts sourced from the CV (docs/CV Nomena *.html). */
export const history: Record<Locale, HistoryEntry[]> = {
  en: [
    {
      period: "2025 — now",
      role: "Senior PHP Engineer",
      org: "Novity — full-time",
      summary:
        "Online platform to run the full operations of organizations and associations — CRM, accounting, website and more.",
      highlights: [
        "Led code-base migration and optimization",
        "Designed and built new features end to end",
        "Async task maintenance & monitoring, plus several internal PHP SDKs",
        "AI-assisted development workflows and coding guidelines with Claude Code",
      ],
      stack: ["Symfony", "MySQL", "Redis", "Docker", "AWS S3", "Azure"],
    },
    {
      period: "2023 — 2025",
      role: "Senior PHP Engineer",
      org: "Ubiweb · Canada — Freelance",
      summary:
        "Digital-marketing solution on a multi-tenant platform for SMEs and investors.",
      highlights: [
        "Micro-services and REST APIs",
        "AI micro-service for automated review & email responses",
        "Async job platform (Temporal, RoadRunner) with execution-time forecasting",
        "Real-time sync with Google My Business, Meta, Yext, Kraken, AWS",
        "5 reusable PHP SDKs published on Packagist",
        "Cursor and Claude Code as core parts of the daily workflow",
      ],
      stack: ["Symfony", "MySQL", "MongoDB", "Temporal.io", "RoadRunner", "OpenAI"],
    },
    {
      period: "2022 — 2023",
      role: "Fullstack Engineer",
      org: "Unlocked GG · Netherlands — part-time",
      summary:
        "E-sports tournament-hosting platform (League of Legends, Rainbow Six Siege, Clash Royale, FIFA) with digital marketing.",
      highlights: [
        "Tournament-matching micro-service using regression & classification",
        "React front-end",
        "E-marketplace with online payments (Stripe)",
        "Streaming-integrated tipping module and a web-scraping micro-service",
      ],
      stack: ["React", "TypeScript", "Redux", "Symfony", "Node.js", "Stripe"],
    },
    {
      period: "2020 — 2025",
      role: "Technical Lead",
      org: "Kleap · Switzerland — part-time",
      summary:
        "AI-powered website builder and content-creation tools.",
      highlights: [
        "Migrated the builder from headless WordPress to Next.js + Symfony",
        "Flexible data model for page rendering",
        "Micro-services: accounting, marketplace, workspace, layout, admin",
        "In-house multilingual translation micro-service",
        "Led a team of 5 — planning, code reviews, CEO reporting, server OPS",
        "Cursor as a core development tool",
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
        "Selfcare Togo & a Payment Gateway in Java/Spring Boot + WSO2",
        "Technical study, design and documentation with the team",
      ],
      stack: ["Symfony", "Java / Spring Boot", "WSO2", "PostGIS", "SOAP", "Phalcon"],
    },
    {
      period: "2018 — 2019",
      role: "Symfony / React Developer",
      org: "Levea · France — Freelance, evenings",
      summary:
        "Online restaurant platform (France) — freelance work in the evenings, alongside the full-time Pulse role.",
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
    {
      period: "2017",
      role: "Java Developer",
      org: "ValueIT · Madagascar",
      summary: "Crawler plugin and module maintenance for a local software company.",
      highlights: [
        "Built a crawler plugin using Java/Groovy",
        "Plugin and module maintenance with Git versioning",
      ],
      stack: ["Java", "Groovy", "Git"],
    },
  ],
  fr: [
    {
      period: "2025 — en cours",
      role: "Développeur PHP Senior",
      org: "Novity — temps plein",
      summary:
        "Plateforme en ligne pour piloter l'ensemble des opérations des organisations et associations — CRM, comptabilité, site web et plus encore.",
      highlights: [
        "Migration et optimisation de la base de code",
        "Conception et développement de nouvelles fonctionnalités de bout en bout",
        "Maintenance et monitoring de tâches asynchrones, plus plusieurs SDKs PHP internes",
        "Workflows de développement assisté par IA et conventions de code avec Claude Code",
      ],
      stack: ["Symfony", "MySQL", "Redis", "Docker", "AWS S3", "Azure"],
    },
    {
      period: "2023 — 2025",
      role: "Développeur PHP Senior",
      org: "Ubiweb · Canada — Freelance",
      summary:
        "Solution de marketing digital sur une plateforme multi-tenant destinée aux PME et investisseurs.",
      highlights: [
        "Micro-services et API REST",
        "Micro-service IA pour l'analyse et la réponse automatique aux avis et emails clients",
        "Plateforme de traitement asynchrone (Temporal, RoadRunner) avec prévision du temps d'exécution",
        "Synchronisation temps réel avec Google My Business, Meta, Yext, Kraken, AWS",
        "5 SDKs PHP réutilisables publiés sur Packagist",
        "Cursor et Claude Code utilisés au quotidien",
      ],
      stack: ["Symfony", "MySQL", "MongoDB", "Temporal.io", "RoadRunner", "OpenAI"],
    },
    {
      period: "2022 — 2023",
      role: "Développeur Fullstack",
      org: "Unlocked GG · Pays-Bas — temps partiel",
      summary:
        "Plateforme de hosting de tournois e-sport (League of Legends, Rainbow Six Siege, Clash Royale, FIFA) avec marketing digital.",
      highlights: [
        "Micro-service de tournois utilisant régression et classification",
        "Front-end React",
        "E-marketplace avec paiement en ligne (Stripe)",
        "Module de cagnottes en sur-couche de streaming et micro-service de web scraping",
      ],
      stack: ["React", "TypeScript", "Redux", "Symfony", "Node.js", "Stripe"],
    },
    {
      period: "2020 — 2025",
      role: "Lead Technique",
      org: "Kleap · Suisse — temps partiel",
      summary:
        "Website builder et outils de création de contenu intégrant des fonctionnalités IA.",
      highlights: [
        "Migration du website builder d'un WordPress headless vers Next.js et Symfony",
        "Conception d'une structure de données flexible pour le rendu des pages",
        "Micro-services : comptabilité, marketplace, workspace, layout, admin",
        "Micro-service de traduction multilingue en interne",
        "Direction d'une équipe de 5 — planification, revues de code, reporting au CEO, OPS serveurs",
        "Cursor comme outil de développement principal",
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
        "Selfcare Togo et une Payment Gateway en Java/Spring Boot + WSO2",
        "Étude technique, conception et documentation en équipe",
      ],
      stack: ["Symfony", "Java / Spring Boot", "WSO2", "PostGIS", "SOAP", "Phalcon"],
    },
    {
      period: "2018 — 2019",
      role: "Développeur Symfony / React",
      org: "Levea · France — Freelance, soirées",
      summary:
        "Plateforme de restauration en ligne (France) — mission freelance en soirée, en parallèle du poste à temps plein chez Pulse.",
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
    {
      period: "2017",
      role: "Développeur Java",
      org: "ValueIT · Madagascar",
      summary: "Plugin crawler et maintenance de modules pour une société locale.",
      highlights: [
        "Création d'un plugin crawler en Java/Groovy",
        "Maintenance de plugins et modules avec versioning Git",
      ],
      stack: ["Java", "Groovy", "Git"],
    },
  ],
  de: [
    {
      period: "2025 — heute",
      role: "Senior PHP-Entwickler",
      org: "Novity — Vollzeit",
      summary:
        "Online-Plattform zur Steuerung sämtlicher Abläufe von Organisationen und Vereinen — CRM, Buchhaltung, Website und mehr.",
      highlights: [
        "Leitung der Migration und Optimierung der Codebasis",
        "Konzeption und Entwicklung neuer Funktionen End-to-End",
        "Wartung und Monitoring asynchroner Aufgaben sowie mehrerer interner PHP-SDKs",
        "KI-gestützte Entwicklungs-Workflows und Coding-Guidelines mit Claude Code",
      ],
      stack: ["Symfony", "MySQL", "Redis", "Docker", "AWS S3", "Azure"],
    },
    {
      period: "2023 — 2025",
      role: "Senior PHP-Entwickler",
      org: "Ubiweb · Kanada — Freelance",
      summary:
        "Digitale Marketinglösung auf einer Multi-Tenant-Plattform für KMUs und Investoren.",
      highlights: [
        "Microservices und REST-APIs",
        "KI-Microservice für automatisierte Bewertungs- und E-Mail-Antworten",
        "Plattform für asynchrone Jobs (Temporal, RoadRunner) mit Prognose der Ausführungszeit",
        "Echtzeit-Synchronisation mit Google My Business, Meta, Yext, Kraken, AWS",
        "5 wiederverwendbare PHP-SDKs auf Packagist veröffentlicht",
        "Cursor und Claude Code als fester Bestandteil des täglichen Workflows",
      ],
      stack: ["Symfony", "MySQL", "MongoDB", "Temporal.io", "RoadRunner", "OpenAI"],
    },
    {
      period: "2022 — 2023",
      role: "Fullstack-Entwickler",
      org: "Unlocked GG · Niederlande — Teilzeit",
      summary:
        "E-Sport-Turnier-Plattform (League of Legends, Rainbow Six Siege, Clash Royale, FIFA) mit digitalem Marketing.",
      highlights: [
        "Turnier-Matching-Microservice mit Regressions- und Klassifikationsalgorithmen",
        "React-Frontend",
        "E-Marketplace mit Online-Zahlungen (Stripe)",
        "In Streaming integriertes Trinkgeldmodul und ein Web-Scraping-Microservice",
      ],
      stack: ["React", "TypeScript", "Redux", "Symfony", "Node.js", "Stripe"],
    },
    {
      period: "2020 — 2025",
      role: "Technical Lead",
      org: "Kleap · Schweiz — Teilzeit",
      summary:
        "KI-gestützter Website-Builder und Content-Erstellungstools.",
      highlights: [
        "Migration des Builders von headless WordPress zu Next.js + Symfony",
        "Flexibles Datenmodell für das Seiten-Rendering",
        "Microservices: Buchhaltung, Marketplace, Workspace, Layout, Admin",
        "Interner mehrsprachiger Übersetzungs-Microservice",
        "Leitung eines 5-köpfigen Teams — Planung, Code-Reviews, CEO-Reporting, Server-OPS",
        "Cursor als zentrales Entwicklungstool",
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
        "Selfcare Togo und ein Payment Gateway in Java/Spring Boot + WSO2",
        "Technische Analyse, Konzeption und Dokumentation im Team",
      ],
      stack: ["Symfony", "Java / Spring Boot", "WSO2", "PostGIS", "SOAP", "Phalcon"],
    },
    {
      period: "2018 — 2019",
      role: "Symfony-/React-Entwickler",
      org: "Levea · Frankreich — Freelance, abends",
      summary:
        "Online-Restaurant-Plattform (Frankreich) — abendliche Freelance-Tätigkeit parallel zur Vollzeitstelle bei Pulse.",
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
    {
      period: "2017",
      role: "Java-Entwickler",
      org: "ValueIT · Madagaskar",
      summary: "Crawler-Plugin und Modulpflege für ein lokales Softwareunternehmen.",
      highlights: [
        "Entwicklung eines Crawler-Plugins mit Java/Groovy",
        "Wartung von Plugins und Modulen mit Git-Versionierung",
      ],
      stack: ["Java", "Groovy", "Git"],
    },
  ],
};
