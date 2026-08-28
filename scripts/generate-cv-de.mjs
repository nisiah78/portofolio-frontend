#!/usr/bin/env node
/**
 * Builds a German CV from the EN HTML bundle (template translation) and exports PDF.
 * Requires puppeteer (devDependency). Run locally when CV content changes:
 *
 *   npm run cv:generate-de
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { CV_FILES, htmlToPdf, root, rewriteBundle } from "./cv-bundler.mjs";
import { enToDe } from "./cv-de-translations.mjs";

const enHtmlPath = join(root, CV_FILES.en.html);
const deHtmlPath = join(root, CV_FILES.de.html);
const dePdfDocs = join(root, CV_FILES.de.pdf);
const dePdfPublic = join(root, CV_FILES.de.public);

function translateTemplate(template) {
  const pairs = Object.entries(enToDe).sort((a, b) => b[0].length - a[0].length);
  let out = template;
  let replaced = 0;
  for (const [en, de] of pairs) {
    if (out.includes(en)) {
      out = out.split(en).join(de);
      replaced++;
    }
  }
  // Restore proper names caught by short keys (e.g. "English" → "Englisch").
  out = out.replaceAll("Englisch Teaching Program", "English Teaching Program");
  return { template: out, replaced };
}

function buildDeHtml() {
  let translated;
  rewriteBundle(enHtmlPath, deHtmlPath, (template) => {
    const result = translateTemplate(template);
    console.log(`Applied ${result.replaced}/${Object.keys(enToDe).length} translation pairs`);
    translated = result.template;
    return translated;
  });

  const untranslated = [];
  const re = />([^<]{4,200})</g;
  let m;
  while ((m = re.exec(translated))) {
    const s = m[1].replace(/\s+/g, " ").trim();
    if (
      s &&
      !s.startsWith("data:") &&
      !/^[\d\s·•—\-–.,:;()+&]+$/.test(s) &&
      /[a-zA-Z]/.test(s) &&
      !s.includes("MySQL") &&
      !s.includes("Symfony") &&
      !s.includes("React") &&
      !s.includes("@") &&
      !s.includes("LinkedIn") &&
      !s.includes("Nomena") &&
      !s.includes("NAMBININTSOA") &&
      !s.includes("Novity") &&
      !s.includes("Ubiweb") &&
      !s.includes("Kleap") &&
      !s.includes("Unlocked") &&
      !s.includes("Pulse") &&
      !s.includes("Levea") &&
      !s.includes("INGENOSYA") &&
      !s.includes("ValueIT") &&
      !s.includes("Selfcare") &&
      !s.includes("Mbalik") &&
      !s.includes("Parasol") &&
      !s.includes("SimS") &&
      !s.includes("Payment") &&
      !s.includes("Proxy") &&
      !s.includes("credential.net") &&
      !s.includes("WSO2") &&
      !s.includes("Phalcon") &&
      !s.includes("PostGIS") &&
      !s.includes("Malagasy") &&
      !s.includes("Cursor") &&
      !s.includes("GitHub") &&
      !s.includes("Windows") &&
      !s.includes("Nginx") &&
      !s.includes("Jira") &&
      !s.includes("Secure Coding") &&
      !s.includes("Stack") &&
      !s.includes("Docker") &&
      !s.includes("PHP ·") &&
      !s.includes("&nbsp;")
    ) {
      untranslated.push(s);
    }
  }
  const unique = [...new Set(untranslated)].sort();
  if (unique.length) {
    console.warn("Possible untranslated fragments:");
    for (const s of unique) console.warn("  -", s);
  }

  console.log("Wrote", deHtmlPath);
  return deHtmlPath;
}

const htmlPath = buildDeHtml();
await htmlToPdf(htmlPath, dePdfDocs);
console.log("Wrote", dePdfDocs);
mkdirSync(join(root, "public/cv"), { recursive: true });
copyFileSync(dePdfDocs, dePdfPublic);
console.log("Synced", dePdfPublic);
