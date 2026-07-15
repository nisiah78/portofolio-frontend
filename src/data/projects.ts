import type { Locale } from "@/i18n/config";

export type Project = {
  slug: string;
  name: string;
  period: string;
  role: string;
  description: string;
  tags: string[];
  image: string;
  alt: string;
};

/** Experience / projects — chronological (newest first), per locale, from resume.md */
export const projects: Record<Locale, Project[]> = {
  en: [
    {
      slug: "novity",
      name: "Novity",
      period: "Dec 2025 — now",
      role: "Senior PHP Engineer",
      description:
        "All-in-one platform for organizations and associations — CRM, accounting and website management. Led code-base migration and optimization, agentic IDE rules, new features, and async task monitoring.",
      tags: ["symfony", "mysql", "redis", "docker", "aws"],
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&q=80",
      alt: "Novity — CRM and business platform dashboard",
    },
    {
      slug: "ubiweb",
      name: "Ubiweb",
      period: "Dec 2023 — Dec 2025",
      role: "Senior PHP Engineer · part-time",
      description:
        "Multi-tenant digital-marketing platform for SMEs. Micro-services and REST APIs, an AI service for automated review/email responses, Packagist SDKs, and real-time sync with Google, Meta, Yext and AWS.",
      tags: ["symfony", "mongodb", "temporal", "openai", "redis"],
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&q=80",
      alt: "Ubiweb — digital marketing analytics platform",
    },
    {
      slug: "unlocked",
      name: "Unlocked GG",
      period: "Jan 2022 — Mar 2023",
      role: "Fullstack Engineer · ex-Meta BV",
      description:
        "E-sports hosting platform (LoL, R6, Clash Royale, FIFA). Built the tournament engine with regression & classification, the React front-end, marketplace with Stripe, and streaming donation pots.",
      tags: ["react", "typescript", "symfony", "stripe", "tailwind"],
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&q=80",
      alt: "Unlocked — e-sports tournament platform",
    },
    {
      slug: "kleap",
      name: "Kleap",
      period: "Jul 2020 — Jun 2025",
      role: "Technical Lead · founding team",
      description:
        "AI-driven website builder. Led migration from headless WordPress to Next.js + Symfony, flexible page-render data model, multilingual translation micro-service, and OPS across Gridpane, DigitalOcean and Vercel.",
      tags: ["nextjs", "react", "symfony", "openai", "tailwind"],
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=640&q=80",
      alt: "Kleap — AI website builder",
    },
    {
      slug: "pulse",
      name: "Pulse (Axian Group)",
      period: "Dec 2018 — Jan 2022",
      role: "Fullstack Developer",
      description:
        "Local and regional web/mobile apps across Madagascar, Togo, Réunion and Comoros — Selfcare, Mbalik, Parasol, SimS, payment gateway and MVola proxies on Symfony, Spring Boot and Phalcon.",
      tags: ["symfony", "spring-boot", "postgis", "soap", "java"],
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&q=80",
      alt: "Pulse — telecom and mobile selfcare platforms",
    },
    {
      slug: "levea",
      name: "Levea",
      period: "Dec 2018 — Mar 2019",
      role: "Symfony / React Developer · remote",
      description:
        "Online restaurant platform. Maintained React storefronts, migrated Symfony 2.4 → 4, integrated Stripe payments and async order tracking with Urbantz.",
      tags: ["react", "symfony", "stripe", "urbantz"],
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=640&q=80",
      alt: "Levea — online restaurant ordering platform",
    },
    {
      slug: "ingenosya",
      name: "Ingenosya",
      period: "Dec 2017 — Dec 2018",
      role: "PHP Developer",
      description:
        "Built, maintained and SEO-optimized WordPress and CodeIgniter sites (Nounous2Paris, Nounous2Nantes, Henri Fraise).",
      tags: ["wordpress", "codeigniter", "php", "seo"],
      image:
        "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=640&q=80",
      alt: "Ingenosya — WordPress and CodeIgniter web projects",
    },
    {
      slug: "valueit",
      name: "ValueIT",
      period: "Sep 2017 — Dec 2017",
      role: "Java Developer",
      description:
        "Created a Java/Groovy crawler plugin and maintained plugins and modules with Git versioning.",
      tags: ["java", "groovy", "crawler", "git"],
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&q=80",
      alt: "ValueIT — Java crawler and plugin development",
    },
  ],
  fr: [
    {
      slug: "novity",
      name: "Novity",
      period: "déc. 2025 — en cours",
      role: "Développeur PHP Senior",
      description:
        "Plateforme tout-en-un pour organisations et associations — CRM, comptabilité et gestion de site web. Direction de la migration et de l'optimisation de la base de code, mise en place de règles IDE agentiques, nouvelles fonctionnalités et monitoring des tâches asynchrones.",
      tags: ["symfony", "mysql", "redis", "docker", "aws"],
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&q=80",
      alt: "Novity — tableau de bord de la plateforme CRM et métier",
    },
    {
      slug: "ubiweb",
      name: "Ubiweb",
      period: "déc. 2023 — déc. 2025",
      role: "Développeur PHP Senior · temps partiel",
      description:
        "Plateforme de marketing digital multi-tenant pour PME. Micro-services et API REST, service IA pour réponses automatiques aux avis/emails, SDKs Packagist et synchronisation temps réel avec Google, Meta, Yext et AWS.",
      tags: ["symfony", "mongodb", "temporal", "openai", "redis"],
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&q=80",
      alt: "Ubiweb — plateforme d'analyse marketing digital",
    },
    {
      slug: "unlocked",
      name: "Unlocked GG",
      period: "janv. 2022 — mars 2023",
      role: "Développeur Fullstack · ex-Meta BV",
      description:
        "Plateforme d'hébergement e-sport (LoL, R6, Clash Royale, FIFA). Conception du moteur de tournois avec régression et classification, du front-end React, de la marketplace avec Stripe, et des cagnottes de streaming.",
      tags: ["react", "typescript", "symfony", "stripe", "tailwind"],
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&q=80",
      alt: "Unlocked — plateforme de tournois e-sport",
    },
    {
      slug: "kleap",
      name: "Kleap",
      period: "juil. 2020 — juin 2025",
      role: "Lead Technique · équipe fondateur",
      description:
        "Website builder piloté par l'IA. Direction de la migration d'un WordPress headless vers Next.js et Symfony, conception d'un modèle de données flexible pour le rendu des pages, micro-service de traduction multilingue et OPS sur Gridpane, DigitalOcean et Vercel.",
      tags: ["nextjs", "react", "symfony", "openai", "tailwind"],
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=640&q=80",
      alt: "Kleap — website builder propulsé par l'IA",
    },
    {
      slug: "pulse",
      name: "Pulse (Axian Group)",
      period: "déc. 2018 — janv. 2022",
      role: "Développeur Fullstack",
      description:
        "Applications web et mobile locales et régionales à Madagascar, au Togo, à La Réunion et aux Comores — Selfcare, Mbalik, Parasol, SimS, passerelle de paiement et proxys MVola sur Symfony, Spring Boot et Phalcon.",
      tags: ["symfony", "spring-boot", "postgis", "soap", "java"],
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&q=80",
      alt: "Pulse — plateformes telecom et selfcare mobile",
    },
    {
      slug: "levea",
      name: "Levea",
      period: "déc. 2018 — mars 2019",
      role: "Développeur Symfony / React · télétravail",
      description:
        "Plateforme de restauration en ligne. Maintenance des vitrines React, migration de Symfony 2.4 vers 4, intégration des paiements Stripe et du suivi asynchrone des commandes avec Urbantz.",
      tags: ["react", "symfony", "stripe", "urbantz"],
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=640&q=80",
      alt: "Levea — plateforme de commande de restauration en ligne",
    },
    {
      slug: "ingenosya",
      name: "Ingenosya",
      period: "déc. 2017 — déc. 2018",
      role: "Développeur PHP",
      description:
        "Développement, maintenance et optimisation SEO de sites WordPress et CodeIgniter (Nounous2Paris, Nounous2Nantes, Henri Fraise).",
      tags: ["wordpress", "codeigniter", "php", "seo"],
      image:
        "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=640&q=80",
      alt: "Ingenosya — projets web WordPress et CodeIgniter",
    },
    {
      slug: "valueit",
      name: "ValueIT",
      period: "sept. 2017 — déc. 2017",
      role: "Développeur Java",
      description:
        "Création d'un plugin crawler en Java/Groovy et maintenance de plugins et modules avec versioning Git.",
      tags: ["java", "groovy", "crawler", "git"],
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&q=80",
      alt: "ValueIT — crawler Java et développement de plugins",
    },
  ],
  de: [
    {
      slug: "novity",
      name: "Novity",
      period: "Dez. 2025 — heute",
      role: "Senior PHP-Entwickler",
      description:
        "All-in-one-Plattform für Organisationen und Vereine — CRM, Buchhaltung und Website-Management. Leitung der Codebasis-Migration und -Optimierung, agentische IDE-Regeln, neue Funktionen und Monitoring asynchroner Aufgaben.",
      tags: ["symfony", "mysql", "redis", "docker", "aws"],
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&q=80",
      alt: "Novity — Dashboard der CRM- und Business-Plattform",
    },
    {
      slug: "ubiweb",
      name: "Ubiweb",
      period: "Dez. 2023 — Dez. 2025",
      role: "Senior PHP-Entwickler · Teilzeit",
      description:
        "Multi-Tenant-Plattform für digitales Marketing für KMUs. Microservices und REST-APIs, ein KI-Service für automatisierte Bewertungs-/E-Mail-Antworten, Packagist-SDKs und Echtzeit-Synchronisation mit Google, Meta, Yext und AWS.",
      tags: ["symfony", "mongodb", "temporal", "openai", "redis"],
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&q=80",
      alt: "Ubiweb — Plattform für digitale Marketinganalyse",
    },
    {
      slug: "unlocked",
      name: "Unlocked GG",
      period: "Jan. 2022 — März 2023",
      role: "Fullstack-Entwickler · ex-Meta BV",
      description:
        "E-Sport-Hosting-Plattform (LoL, R6, Clash Royale, FIFA). Entwicklung der Turnier-Engine mit Regression und Klassifikation, des React-Frontends, des Marketplace mit Stripe und der Streaming-Spendentöpfe.",
      tags: ["react", "typescript", "symfony", "stripe", "tailwind"],
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&q=80",
      alt: "Unlocked — E-Sport-Turnierplattform",
    },
    {
      slug: "kleap",
      name: "Kleap",
      period: "Juli 2020 — Juni 2025",
      role: "Technical Lead · Gründungsteam",
      description:
        "KI-gestützter Website-Builder. Leitung der Migration von headless WordPress zu Next.js + Symfony, flexibles Datenmodell für das Seiten-Rendering, mehrsprachiger Übersetzungs-Microservice und OPS über Gridpane, DigitalOcean und Vercel.",
      tags: ["nextjs", "react", "symfony", "openai", "tailwind"],
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=640&q=80",
      alt: "Kleap — KI-gestützter Website-Builder",
    },
    {
      slug: "pulse",
      name: "Pulse (Axian Group)",
      period: "Dez. 2018 — Jan. 2022",
      role: "Fullstack-Entwickler",
      description:
        "Lokale und regionale Web-/Mobile-Apps in Madagaskar, Togo, Réunion und den Komoren — Selfcare, Mbalik, Parasol, SimS, Payment Gateway und MVola-Proxys auf Symfony, Spring Boot und Phalcon.",
      tags: ["symfony", "spring-boot", "postgis", "soap", "java"],
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&q=80",
      alt: "Pulse — Telekom- und Mobile-Selfcare-Plattformen",
    },
    {
      slug: "levea",
      name: "Levea",
      period: "Dez. 2018 — März 2019",
      role: "Symfony-/React-Entwickler · Remote",
      description:
        "Online-Restaurant-Plattform. Wartung der React-Storefronts, Migration von Symfony 2.4 auf 4, Integration von Stripe-Zahlungen und asynchronem Bestell-Tracking mit Urbantz.",
      tags: ["react", "symfony", "stripe", "urbantz"],
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=640&q=80",
      alt: "Levea — Online-Bestellplattform für Restaurants",
    },
    {
      slug: "ingenosya",
      name: "Ingenosya",
      period: "Dez. 2017 — Dez. 2018",
      role: "PHP-Entwickler",
      description:
        "Entwicklung, Wartung und SEO-Optimierung von WordPress- und CodeIgniter-Websites (Nounous2Paris, Nounous2Nantes, Henri Fraise).",
      tags: ["wordpress", "codeigniter", "php", "seo"],
      image:
        "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=640&q=80",
      alt: "Ingenosya — WordPress- und CodeIgniter-Webprojekte",
    },
    {
      slug: "valueit",
      name: "ValueIT",
      period: "Sept. 2017 — Dez. 2017",
      role: "Java-Entwickler",
      description:
        "Erstellung eines Java/Groovy-Crawler-Plugins sowie Wartung von Plugins und Modulen mit Git-Versionierung.",
      tags: ["java", "groovy", "crawler", "git"],
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&q=80",
      alt: "ValueIT — Java-Crawler- und Plugin-Entwicklung",
    },
  ],
};
