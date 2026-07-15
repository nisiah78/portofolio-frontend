export type Tech = {
  id: string;
  label: string;
  desc: string;
};

export type Subgroup = {
  id: string;
  label: string;
  desc: string;
  techs: Tech[];
};

import type { IconName } from "@/components/ui/Icon";

export type StackCategory = {
  id: string;
  tag: string;
  label: string;
  color: string;
  icon: IconName;
  desc: string;
  subgroups: Subgroup[];
};

export const stack: StackCategory[] = [
  {
    id: "fe",
    tag: "FE",
    label: "Frontend",
    color: "#22d3ee",
    icon: "layout-panel-top",
    desc: "Interfaces web modernes, réactives et performantes.",
    subgroups: [
      {
        id: "fe-fw",
        label: "Frameworks & Libs",
        desc: "Socle applicatif côté client.",
        techs: [
          { id: "react",  label: "React",      desc: "Bibliothèque UI à base de composants." },
          { id: "next",   label: "Next.js",    desc: "Framework React SSR / SSG full-stack." },
          { id: "redux",  label: "Redux",      desc: "Gestion d'état prévisible et centralisée." },
          { id: "ts",     label: "TypeScript", desc: "JavaScript typé statiquement." },
        ],
      },
      {
        id: "fe-ui",
        label: "UI & Styling",
        desc: "Mise en forme et édition de contenu.",
        techs: [
          { id: "tw",     label: "Tailwind CSS", desc: "Framework CSS utilitaire." },
          { id: "tiptap", label: "Tiptap",       desc: "Éditeur de texte riche headless." },
          { id: "i18n",   label: "i18n",         desc: "Internationalisation multilingue." },
        ],
      },
      {
        id: "fe-ai",
        label: "IA UI",
        desc: "Composants d'interface pilotés par l'IA.",
        techs: [
          { id: "copilot", label: "CopilotKit", desc: "Copilotes IA intégrés à l'application." },
          { id: "mastra",  label: "Mastra",     desc: "Framework d'agents IA côté application." },
        ],
      },
    ],
  },
  {
    id: "be",
    tag: "BE",
    label: "Backend",
    color: "#a78bfa",
    icon: "server-cog",
    desc: "Logique serveur, APIs et micro-services.",
    subgroups: [
      {
        id: "be-lang",
        label: "Langages & Frameworks",
        desc: "Cœur applicatif serveur.",
        techs: [
          { id: "php",         label: "PHP",                desc: "Langage serveur principal (senior)." },
          { id: "symfony",     label: "Symfony",            desc: "Framework PHP structurant, v2 → 7." },
          { id: "apiplatform", label: "API Platform",       desc: "APIs REST/GraphQL orientées ressources." },
          { id: "node",        label: "Node.js",            desc: "Runtime JavaScript serveur." },
          { id: "spring",      label: "Java Spring Boot",   desc: "Micro-services Java (paiement, selfcare)." },
          { id: "phalcon",     label: "Phalcon",            desc: "Framework PHP haute performance." },
          { id: "ci",          label: "CodeIgniter",        desc: "Framework PHP léger." },
          { id: "wp",          label: "WordPress headless", desc: "CMS découplé comme source de contenu." },
        ],
      },
      {
        id: "be-ms",
        label: "Micro-services & Messaging",
        desc: "Orchestration, workflows et temps réel.",
        techs: [
          { id: "temporal",   label: "Temporal IO",   desc: "Orchestration de workflows durables." },
          { id: "roadrunner", label: "RoadRunner",    desc: "Serveur d'application PHP haute perf." },
          { id: "mercure",    label: "Mercure Hub",   desc: "Push temps réel (SSE)." },
          { id: "wso2",       label: "WSO2",          desc: "API gateway / management." },
          { id: "soap",       label: "SOAP",          desc: "Intégrations legacy (telco)." },
        ],
      },
      {
        id: "be-qa",
        label: "Qualité & Tests",
        desc: "Fiabilité et standards de code.",
        techs: [
          { id: "phpunit",  label: "PHPUnit",  desc: "Tests unitaires PHP." },
          { id: "phpstan",  label: "PHPStan",  desc: "Analyse statique PHP." },
          { id: "rector",   label: "Rector",   desc: "Refactoring automatisé." },
          { id: "grumphp",  label: "GrumPHP",  desc: "Contrôles qualité en pre-commit." },
          { id: "jest",     label: "Jest",     desc: "Tests JavaScript / React." },
        ],
      },
    ],
  },
  {
    id: "db",
    tag: "DB",
    label: "Database",
    color: "#34d399",
    icon: "database",
    desc: "Persistance des données SQL et NoSQL.",
    subgroups: [
      {
        id: "db-sql",
        label: "SQL",
        desc: "Bases relationnelles.",
        techs: [
          { id: "mysql",   label: "MySQL",                  desc: "SGBD relationnel principal." },
          { id: "mariadb", label: "MariaDB",                desc: "Fork MySQL open-source." },
          { id: "pg",      label: "PostgreSQL + PostGIS",   desc: "Relationnel avec extension géospatiale." },
          { id: "mssql",   label: "SQL Server",             desc: "SGBD relationnel Microsoft." },
        ],
      },
      {
        id: "db-nosql",
        label: "NoSQL & Cache",
        desc: "Documents et cache mémoire.",
        techs: [
          { id: "mongo", label: "MongoDB", desc: "Base documentaire NoSQL." },
          { id: "redis", label: "Redis",   desc: "Cache & store clé-valeur en mémoire." },
        ],
      },
    ],
  },
  {
    id: "ops",
    tag: "OPS",
    label: "DevOps / Cloud",
    color: "#fbbf24",
    icon: "cloud",
    desc: "Conteneurisation, serveurs et déploiement.",
    subgroups: [
      {
        id: "ops-ct",
        label: "Conteneurs & Serveurs",
        desc: "Runtime et process management.",
        techs: [
          { id: "docker", label: "Docker",  desc: "Conteneurisation des services." },
          { id: "nginx",  label: "Nginx",   desc: "Serveur web / reverse proxy." },
          { id: "pm2",    label: "PM2",     desc: "Gestionnaire de process Node." },
          { id: "ubuntu", label: "Ubuntu",  desc: "Serveurs Linux/Unix." },
        ],
      },
      {
        id: "ops-cloud",
        label: "Cloud & Hosting",
        desc: "Infrastructure et hébergement.",
        techs: [
          { id: "awss3",    label: "AWS S3",       desc: "Stockage objet cloud." },
          { id: "azure",    label: "Azure",         desc: "Cloud Microsoft." },
          { id: "do",       label: "DigitalOcean",  desc: "Cloud / VPS de production." },
          { id: "vercel",   label: "Vercel",        desc: "Déploiement front Next.js." },
          { id: "gridpane", label: "GridPane",      desc: "Gestion de serveurs WordPress." },
          { id: "plesk",    label: "Plesk",         desc: "Panneau d'administration serveur." },
          { id: "gandi",    label: "Gandi",         desc: "Domaines & hébergement." },
        ],
      },
      {
        id: "ops-vcs",
        label: "Versioning & Suivi",
        desc: "Code source et gestion de projet.",
        techs: [
          { id: "git",       label: "Git",        desc: "Gestion de versions." },
          { id: "github",    label: "GitHub",     desc: "Hébergement de dépôts." },
          { id: "gitlab",    label: "GitLab",     desc: "Dépôts & CI/CD." },
          { id: "bitbucket", label: "Bitbucket",  desc: "Dépôts Atlassian." },
          { id: "svn",       label: "Subversion", desc: "Versioning centralisé (legacy)." },
          { id: "jira",      label: "Jira",       desc: "Suivi de tickets & agile." },
        ],
      },
    ],
  },
  {
    id: "ai",
    tag: "AI",
    label: "IA & Services tiers",
    color: "#fb7185",
    icon: "sparkles",
    desc: "IA générative et intégrations externes.",
    subgroups: [
      {
        id: "ai-llm",
        label: "IA / LLM",
        desc: "Modèles génératifs & agents.",
        techs: [
          { id: "openai",    label: "OpenAI",          desc: "Génération de contenu & analyse." },
          { id: "claude",    label: "Anthropic Claude", desc: "LLM & Claude Code." },
          { id: "replicate", label: "Replicate",        desc: "Modèles ML hébergés." },
          { id: "cursor",    label: "Cursor",           desc: "IDE orienté IA / agentic rules." },
        ],
      },
      {
        id: "ai-api",
        label: "APIs tierces",
        desc: "Synchronisation de données externes.",
        techs: [
          { id: "googleapi", label: "Google API",       desc: "Services & données Google." },
          { id: "metaapi",   label: "Meta API",         desc: "Intégration Meta / réseaux sociaux." },
          { id: "yext",      label: "Yext",             desc: "Gestion de présence en ligne." },
          { id: "kraken",    label: "Kraken",           desc: "Service de données tiers." },
          { id: "gmb",       label: "Google My Business", desc: "Fiches établissement." },
          { id: "auth0",     label: "Auth0",            desc: "Authentification déléguée." },
        ],
      },
      {
        id: "ai-auto",
        label: "Automation & Paiement",
        desc: "Scraping et transactions.",
        techs: [
          { id: "puppeteer", label: "Puppeteer", desc: "Automatisation & web scraping." },
          { id: "stripe",    label: "Stripe",    desc: "Paiement en ligne." },
        ],
      },
    ],
  },
];
