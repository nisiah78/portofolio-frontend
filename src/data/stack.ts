import type { IconName } from "@/components/ui/Icon";
import type { Locale } from "@/i18n/config";

/** A copy string that exists in every supported locale. */
export type Localized = Record<Locale, string>;

// ─── Definitions (locale-aware source of truth) ──────────────────────────────

export type TechDef = {
  id: string;
  /** Product names are proper nouns — never translated. */
  label: string;
  desc: Localized;
};

export type SubgroupDef = {
  id: string;
  label: Localized;
  desc: Localized;
  techs: TechDef[];
};

export type StackCategoryDef = {
  id: string;
  tag: string;
  label: Localized;
  color: string;
  icon: IconName;
  desc: Localized;
  subgroups: SubgroupDef[];
};

// ─── Resolved shapes (what the UI consumes) ──────────────────────────────────

export type Tech = { id: string; label: string; desc: string };
export type Subgroup = { id: string; label: string; desc: string; techs: Tech[] };
export type StackCategory = {
  id: string;
  tag: string;
  label: string;
  color: string;
  icon: IconName;
  desc: string;
  subgroups: Subgroup[];
};

/**
 * The tree structure — ids, colors and icons — is locale-independent, so the
 * connector graph in the Stack section stays identical across locales.
 */
export const stack: StackCategoryDef[] = [
  {
    id: "fe",
    tag: "FE",
    label: { en: "Frontend", fr: "Frontend", de: "Frontend" },
    color: "#22d3ee",
    icon: "layout-panel-top",
    desc: {
      en: "Modern, responsive and performant web interfaces.",
      fr: "Interfaces web modernes, réactives et performantes.",
      de: "Moderne, responsive und performante Web-Oberflächen.",
    },
    subgroups: [
      {
        id: "fe-fw",
        label: { en: "Frameworks & Libs", fr: "Frameworks & Libs", de: "Frameworks & Libs" },
        desc: {
          en: "Client-side application foundation.",
          fr: "Socle applicatif côté client.",
          de: "Anwendungsbasis auf Client-Seite.",
        },
        techs: [
          {
            id: "react",
            label: "React",
            desc: {
              en: "Component-based UI library.",
              fr: "Bibliothèque UI à base de composants.",
              de: "Komponentenbasierte UI-Bibliothek.",
            },
          },
          {
            id: "next",
            label: "Next.js",
            desc: {
              en: "Full-stack React SSR / SSG framework.",
              fr: "Framework React SSR / SSG full-stack.",
              de: "Full-Stack-React-Framework für SSR / SSG.",
            },
          },
          {
            id: "redux",
            label: "Redux",
            desc: {
              en: "Predictable, centralized state management.",
              fr: "Gestion d'état prévisible et centralisée.",
              de: "Vorhersagbares, zentrales State-Management.",
            },
          },
          {
            id: "ts",
            label: "TypeScript",
            desc: {
              en: "Statically typed JavaScript.",
              fr: "JavaScript typé statiquement.",
              de: "Statisch typisiertes JavaScript.",
            },
          },
        ],
      },
      {
        id: "fe-ui",
        label: { en: "UI & Styling", fr: "UI & mise en forme", de: "UI & Styling" },
        desc: {
          en: "Layout, styling and content editing.",
          fr: "Mise en forme et édition de contenu.",
          de: "Layout, Styling und Content-Bearbeitung.",
        },
        techs: [
          {
            id: "tw",
            label: "Tailwind CSS",
            desc: {
              en: "Utility-first CSS framework.",
              fr: "Framework CSS utilitaire.",
              de: "Utility-First-CSS-Framework.",
            },
          },
          {
            id: "tiptap",
            label: "Tiptap",
            desc: {
              en: "Headless rich-text editor.",
              fr: "Éditeur de texte riche headless.",
              de: "Headless-Rich-Text-Editor.",
            },
          },
          {
            id: "i18n",
            label: "i18n",
            desc: {
              en: "Multilingual internationalization.",
              fr: "Internationalisation multilingue.",
              de: "Mehrsprachige Internationalisierung.",
            },
          },
        ],
      },
      {
        id: "fe-ai",
        label: { en: "AI UI", fr: "IA UI", de: "KI-UI" },
        desc: {
          en: "AI-driven interface components.",
          fr: "Composants d'interface pilotés par l'IA.",
          de: "KI-gesteuerte Interface-Komponenten.",
        },
        techs: [
          {
            id: "copilot",
            label: "CopilotKit",
            desc: {
              en: "AI copilots embedded in the app.",
              fr: "Copilotes IA intégrés à l'application.",
              de: "In die App eingebettete KI-Copiloten.",
            },
          },
          {
            id: "mastra",
            label: "Mastra",
            desc: {
              en: "In-app AI agent framework.",
              fr: "Framework d'agents IA côté application.",
              de: "KI-Agenten-Framework in der Anwendung.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "be",
    tag: "BE",
    label: { en: "Backend", fr: "Backend", de: "Backend" },
    color: "#a78bfa",
    icon: "server-cog",
    desc: {
      en: "Server logic, APIs and micro-services.",
      fr: "Logique serveur, APIs et micro-services.",
      de: "Server-Logik, APIs und Micro-Services.",
    },
    subgroups: [
      {
        id: "be-lang",
        label: { en: "Languages & Frameworks", fr: "Langages & Frameworks", de: "Sprachen & Frameworks" },
        desc: {
          en: "Server-side application core.",
          fr: "Cœur applicatif serveur.",
          de: "Serverseitiger Anwendungskern.",
        },
        techs: [
          {
            id: "php",
            label: "PHP",
            desc: {
              en: "Primary server-side language (senior).",
              fr: "Langage serveur principal (senior).",
              de: "Primäre serverseitige Sprache (Senior).",
            },
          },
          {
            id: "symfony",
            label: "Symfony",
            desc: {
              en: "Structured PHP framework, v2 → 7.",
              fr: "Framework PHP structurant, v2 → 7.",
              de: "Strukturiertes PHP-Framework, v2 → 7.",
            },
          },
          {
            id: "apiplatform",
            label: "API Platform",
            desc: {
              en: "Resource-oriented REST/GraphQL APIs.",
              fr: "APIs REST/GraphQL orientées ressources.",
              de: "Ressourcenorientierte REST-/GraphQL-APIs.",
            },
          },
          {
            id: "node",
            label: "Node.js",
            desc: {
              en: "Server-side JavaScript runtime.",
              fr: "Runtime JavaScript serveur.",
              de: "Serverseitige JavaScript-Runtime.",
            },
          },
          {
            id: "spring",
            label: "Java Spring Boot",
            desc: {
              en: "Java micro-services (payment, selfcare).",
              fr: "Micro-services Java (paiement, selfcare).",
              de: "Java-Micro-Services (Payment, Selfcare).",
            },
          },
          {
            id: "phalcon",
            label: "Phalcon",
            desc: {
              en: "High-performance PHP framework.",
              fr: "Framework PHP haute performance.",
              de: "Hochperformantes PHP-Framework.",
            },
          },
          {
            id: "ci",
            label: "CodeIgniter",
            desc: {
              en: "Lightweight PHP framework.",
              fr: "Framework PHP léger.",
              de: "Leichtgewichtiges PHP-Framework.",
            },
          },
          {
            id: "wp",
            label: "WordPress headless",
            desc: {
              en: "Decoupled CMS as a content source.",
              fr: "CMS découplé comme source de contenu.",
              de: "Entkoppeltes CMS als Content-Quelle.",
            },
          },
        ],
      },
      {
        id: "be-ms",
        label: {
          en: "Micro-services & Messaging",
          fr: "Micro-services & Messaging",
          de: "Micro-Services & Messaging",
        },
        desc: {
          en: "Orchestration, workflows and real time.",
          fr: "Orchestration, workflows et temps réel.",
          de: "Orchestrierung, Workflows und Echtzeit.",
        },
        techs: [
          {
            id: "temporal",
            label: "Temporal IO",
            desc: {
              en: "Durable workflow orchestration.",
              fr: "Orchestration de workflows durables.",
              de: "Orchestrierung dauerhafter Workflows.",
            },
          },
          {
            id: "roadrunner",
            label: "RoadRunner",
            desc: {
              en: "High-performance PHP application server.",
              fr: "Serveur d'application PHP haute perf.",
              de: "Hochperformanter PHP-Application-Server.",
            },
          },
          {
            id: "mercure",
            label: "Mercure Hub",
            desc: {
              en: "Real-time push (SSE).",
              fr: "Push temps réel (SSE).",
              de: "Echtzeit-Push (SSE).",
            },
          },
          {
            id: "wso2",
            label: "WSO2",
            desc: {
              en: "API gateway / management.",
              fr: "API gateway / management.",
              de: "API-Gateway / -Management.",
            },
          },
          {
            id: "soap",
            label: "SOAP",
            desc: {
              en: "Legacy integrations (telco).",
              fr: "Intégrations legacy (telco).",
              de: "Legacy-Integrationen (Telko).",
            },
          },
        ],
      },
      {
        id: "be-qa",
        label: { en: "Quality & Testing", fr: "Qualité & Tests", de: "Qualität & Tests" },
        desc: {
          en: "Reliability and code standards.",
          fr: "Fiabilité et standards de code.",
          de: "Zuverlässigkeit und Code-Standards.",
        },
        techs: [
          {
            id: "phpunit",
            label: "PHPUnit",
            desc: { en: "PHP unit testing.", fr: "Tests unitaires PHP.", de: "PHP-Unit-Tests." },
          },
          {
            id: "phpstan",
            label: "PHPStan",
            desc: { en: "PHP static analysis.", fr: "Analyse statique PHP.", de: "Statische PHP-Analyse." },
          },
          {
            id: "rector",
            label: "Rector",
            desc: {
              en: "Automated refactoring.",
              fr: "Refactoring automatisé.",
              de: "Automatisiertes Refactoring.",
            },
          },
          {
            id: "grumphp",
            label: "GrumPHP",
            desc: {
              en: "Pre-commit quality checks.",
              fr: "Contrôles qualité en pre-commit.",
              de: "Qualitätsprüfungen im Pre-Commit.",
            },
          },
          {
            id: "jest",
            label: "Jest",
            desc: {
              en: "JavaScript / React testing.",
              fr: "Tests JavaScript / React.",
              de: "JavaScript-/React-Tests.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "db",
    tag: "DB",
    label: { en: "Database", fr: "Base de données", de: "Datenbank" },
    color: "#34d399",
    icon: "database",
    desc: {
      en: "SQL and NoSQL data persistence.",
      fr: "Persistance des données SQL et NoSQL.",
      de: "SQL- und NoSQL-Datenpersistenz.",
    },
    subgroups: [
      {
        id: "db-sql",
        label: { en: "SQL", fr: "SQL", de: "SQL" },
        desc: {
          en: "Relational databases.",
          fr: "Bases relationnelles.",
          de: "Relationale Datenbanken.",
        },
        techs: [
          {
            id: "mysql",
            label: "MySQL",
            desc: {
              en: "Primary relational database.",
              fr: "SGBD relationnel principal.",
              de: "Primäre relationale Datenbank.",
            },
          },
          {
            id: "mariadb",
            label: "MariaDB",
            desc: {
              en: "Open-source MySQL fork.",
              fr: "Fork MySQL open-source.",
              de: "Open-Source-Fork von MySQL.",
            },
          },
          {
            id: "pg",
            label: "PostgreSQL + PostGIS",
            desc: {
              en: "Relational with geospatial extension.",
              fr: "Relationnel avec extension géospatiale.",
              de: "Relational mit Geo-Erweiterung.",
            },
          },
          {
            id: "mssql",
            label: "SQL Server",
            desc: {
              en: "Microsoft relational database.",
              fr: "SGBD relationnel Microsoft.",
              de: "Relationale Datenbank von Microsoft.",
            },
          },
        ],
      },
      {
        id: "db-nosql",
        label: { en: "NoSQL & Cache", fr: "NoSQL & Cache", de: "NoSQL & Cache" },
        desc: {
          en: "Documents and in-memory cache.",
          fr: "Documents et cache mémoire.",
          de: "Dokumente und In-Memory-Cache.",
        },
        techs: [
          {
            id: "mongo",
            label: "MongoDB",
            desc: {
              en: "NoSQL document database.",
              fr: "Base documentaire NoSQL.",
              de: "NoSQL-Dokumentendatenbank.",
            },
          },
          {
            id: "redis",
            label: "Redis",
            desc: {
              en: "In-memory cache & key-value store.",
              fr: "Cache & store clé-valeur en mémoire.",
              de: "In-Memory-Cache & Key-Value-Store.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "ops",
    tag: "OPS",
    label: { en: "DevOps / Cloud", fr: "DevOps / Cloud", de: "DevOps / Cloud" },
    color: "#fbbf24",
    icon: "cloud",
    desc: {
      en: "Containerization, servers and deployment.",
      fr: "Conteneurisation, serveurs et déploiement.",
      de: "Containerisierung, Server und Deployment.",
    },
    subgroups: [
      {
        id: "ops-ct",
        label: { en: "Containers & Servers", fr: "Conteneurs & Serveurs", de: "Container & Server" },
        desc: {
          en: "Runtime and process management.",
          fr: "Runtime et gestion des process.",
          de: "Runtime und Prozess-Management.",
        },
        techs: [
          {
            id: "docker",
            label: "Docker",
            desc: {
              en: "Service containerization.",
              fr: "Conteneurisation des services.",
              de: "Containerisierung der Services.",
            },
          },
          {
            id: "nginx",
            label: "Nginx",
            desc: {
              en: "Web server / reverse proxy.",
              fr: "Serveur web / reverse proxy.",
              de: "Webserver / Reverse-Proxy.",
            },
          },
          {
            id: "pm2",
            label: "PM2",
            desc: {
              en: "Node process manager.",
              fr: "Gestionnaire de process Node.",
              de: "Node-Prozessmanager.",
            },
          },
          {
            id: "ubuntu",
            label: "Ubuntu",
            desc: { en: "Linux/Unix servers.", fr: "Serveurs Linux/Unix.", de: "Linux-/Unix-Server." },
          },
        ],
      },
      {
        id: "ops-cloud",
        label: { en: "Cloud & Hosting", fr: "Cloud & Hébergement", de: "Cloud & Hosting" },
        desc: {
          en: "Infrastructure and hosting.",
          fr: "Infrastructure et hébergement.",
          de: "Infrastruktur und Hosting.",
        },
        techs: [
          {
            id: "awss3",
            label: "AWS S3",
            desc: { en: "Cloud object storage.", fr: "Stockage objet cloud.", de: "Cloud-Objektspeicher." },
          },
          {
            id: "azure",
            label: "Azure",
            desc: { en: "Microsoft cloud.", fr: "Cloud Microsoft.", de: "Microsoft-Cloud." },
          },
          {
            id: "do",
            label: "DigitalOcean",
            desc: {
              en: "Production cloud / VPS.",
              fr: "Cloud / VPS de production.",
              de: "Produktions-Cloud / VPS.",
            },
          },
          {
            id: "vercel",
            label: "Vercel",
            desc: {
              en: "Next.js front-end deployment.",
              fr: "Déploiement front Next.js.",
              de: "Next.js-Frontend-Deployment.",
            },
          },
          {
            id: "gridpane",
            label: "GridPane",
            desc: {
              en: "WordPress server management.",
              fr: "Gestion de serveurs WordPress.",
              de: "WordPress-Serververwaltung.",
            },
          },
          {
            id: "plesk",
            label: "Plesk",
            desc: {
              en: "Server administration panel.",
              fr: "Panneau d'administration serveur.",
              de: "Server-Administrationsoberfläche.",
            },
          },
          {
            id: "gandi",
            label: "Gandi",
            desc: { en: "Domains & hosting.", fr: "Domaines & hébergement.", de: "Domains & Hosting." },
          },
        ],
      },
      {
        id: "ops-vcs",
        label: { en: "Versioning & Tracking", fr: "Versioning & Suivi", de: "Versionierung & Tracking" },
        desc: {
          en: "Source control and project management.",
          fr: "Code source et gestion de projet.",
          de: "Versionskontrolle und Projektmanagement.",
        },
        techs: [
          {
            id: "git",
            label: "Git",
            desc: { en: "Version control.", fr: "Gestion de versions.", de: "Versionskontrolle." },
          },
          {
            id: "github",
            label: "GitHub",
            desc: { en: "Repository hosting.", fr: "Hébergement de dépôts.", de: "Repository-Hosting." },
          },
          {
            id: "gitlab",
            label: "GitLab",
            desc: { en: "Repositories & CI/CD.", fr: "Dépôts & CI/CD.", de: "Repositories & CI/CD." },
          },
          {
            id: "bitbucket",
            label: "Bitbucket",
            desc: {
              en: "Atlassian repositories.",
              fr: "Dépôts Atlassian.",
              de: "Atlassian-Repositories.",
            },
          },
          {
            id: "svn",
            label: "Subversion",
            desc: {
              en: "Centralized versioning (legacy).",
              fr: "Versioning centralisé (legacy).",
              de: "Zentrale Versionierung (Legacy).",
            },
          },
          {
            id: "jira",
            label: "Jira",
            desc: {
              en: "Issue tracking & agile.",
              fr: "Suivi de tickets & agile.",
              de: "Ticket-Tracking & Agile.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "ai",
    tag: "AI",
    label: { en: "AI & Third-party services", fr: "IA & Services tiers", de: "KI & Drittanbieter-Services" },
    color: "#fb7185",
    icon: "sparkles",
    desc: {
      en: "Generative AI and external integrations.",
      fr: "IA générative et intégrations externes.",
      de: "Generative KI und externe Integrationen.",
    },
    subgroups: [
      {
        id: "ai-llm",
        label: { en: "AI / LLM", fr: "IA / LLM", de: "KI / LLM" },
        desc: {
          en: "Generative models & agents.",
          fr: "Modèles génératifs & agents.",
          de: "Generative Modelle & Agenten.",
        },
        techs: [
          {
            id: "openai",
            label: "OpenAI",
            desc: {
              en: "Content generation & analysis.",
              fr: "Génération de contenu & analyse.",
              de: "Content-Generierung & Analyse.",
            },
          },
          {
            id: "claude",
            label: "Anthropic Claude",
            desc: { en: "LLM & Claude Code.", fr: "LLM & Claude Code.", de: "LLM & Claude Code." },
          },
          {
            id: "replicate",
            label: "Replicate",
            desc: { en: "Hosted ML models.", fr: "Modèles ML hébergés.", de: "Gehostete ML-Modelle." },
          },
          {
            id: "cursor",
            label: "Cursor",
            desc: {
              en: "AI-first IDE / agentic rules.",
              fr: "IDE orienté IA / agentic rules.",
              de: "KI-orientierte IDE / Agentic Rules.",
            },
          },
        ],
      },
      {
        id: "ai-api",
        label: { en: "Third-party APIs", fr: "APIs tierces", de: "Drittanbieter-APIs" },
        desc: {
          en: "External data synchronization.",
          fr: "Synchronisation de données externes.",
          de: "Synchronisation externer Daten.",
        },
        techs: [
          {
            id: "googleapi",
            label: "Google API",
            desc: {
              en: "Google services & data.",
              fr: "Services & données Google.",
              de: "Google-Services & -Daten.",
            },
          },
          {
            id: "metaapi",
            label: "Meta API",
            desc: {
              en: "Meta / social network integration.",
              fr: "Intégration Meta / réseaux sociaux.",
              de: "Meta-/Social-Media-Integration.",
            },
          },
          {
            id: "yext",
            label: "Yext",
            desc: {
              en: "Online presence management.",
              fr: "Gestion de présence en ligne.",
              de: "Management der Online-Präsenz.",
            },
          },
          {
            id: "kraken",
            label: "Kraken",
            desc: {
              en: "Third-party data service.",
              fr: "Service de données tiers.",
              de: "Datendienst von Drittanbietern.",
            },
          },
          {
            id: "gmb",
            label: "Google My Business",
            desc: { en: "Business listings.", fr: "Fiches établissement.", de: "Unternehmenseinträge." },
          },
          {
            id: "auth0",
            label: "Auth0",
            desc: {
              en: "Delegated authentication.",
              fr: "Authentification déléguée.",
              de: "Delegierte Authentifizierung.",
            },
          },
        ],
      },
      {
        id: "ai-auto",
        label: { en: "Automation & Payment", fr: "Automation & Paiement", de: "Automatisierung & Zahlung" },
        desc: {
          en: "Scraping and transactions.",
          fr: "Scraping et transactions.",
          de: "Scraping und Transaktionen.",
        },
        techs: [
          {
            id: "puppeteer",
            label: "Puppeteer",
            desc: {
              en: "Automation & web scraping.",
              fr: "Automatisation & web scraping.",
              de: "Automatisierung & Web-Scraping.",
            },
          },
          {
            id: "stripe",
            label: "Stripe",
            desc: { en: "Online payments.", fr: "Paiement en ligne.", de: "Online-Zahlungen." },
          },
        ],
      },
    ],
  },
];

/** Flatten the definitions down to plain strings for a single locale. */
export function getStack(locale: Locale): StackCategory[] {
  return stack.map((cat) => ({
    id: cat.id,
    tag: cat.tag,
    label: cat.label[locale],
    color: cat.color,
    icon: cat.icon,
    desc: cat.desc[locale],
    subgroups: cat.subgroups.map((sub) => ({
      id: sub.id,
      label: sub.label[locale],
      desc: sub.desc[locale],
      techs: sub.techs.map((t) => ({ id: t.id, label: t.label, desc: t.desc[locale] })),
    })),
  }));
}
