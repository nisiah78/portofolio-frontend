#!/usr/bin/env node
/**
 * Builds a German CV from the EN HTML bundle (template translation) and exports PDF.
 * Requires puppeteer (devDependency). Run locally when CV content changes:
 *
 *   npm run cv:generate-de
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { enToDe } from "./cv-de-translations.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const enHtmlPath = join(root, "docs/CV Nomena EN.html");
const deHtmlPath = join(root, "docs/CV Nomena DE.html");
const dePdfDocs = join(root, "docs/CV Nomena DE.pdf");
const dePdfPublic = join(root, "public/cv/nomena-de.pdf");

/** Read bundler template JSON (greedy match up to the last `</script>` before `</body>`). */
function extractBundlerTemplate(html) {
  const match = html.match(/<script type="__bundler\/template">([\s\S]*)<\/script>\s*<\/body>/);
  if (!match) throw new Error("Missing __bundler/template in CV HTML");
  return JSON.parse(match[1]);
}

/** Serialize like the source export: avoid literal `</script>` in the host HTML. */
function serializeBundlerTemplate(template) {
  return JSON.stringify(template).replace(/<\/script>/gi, "<\\u002Fscript>");
}

function replaceBundlerTemplate(html, template) {
  const serialized = serializeBundlerTemplate(template);
  return html.replace(
    /<script type="__bundler\/template">[\s\S]*<\/script>(\s*<\/body>)/,
    `<script type="__bundler/template">${serialized}</script>$1`,
  );
}

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
  const html = readFileSync(enHtmlPath, "utf8");
  const template = extractBundlerTemplate(html);
  const { template: translated, replaced } = translateTemplate(template);
  console.log(`Applied ${replaced}/${Object.keys(enToDe).length} translation pairs`);

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

  const deHtml = replaceBundlerTemplate(html, translated);
  writeFileSync(deHtmlPath, deHtml);

  // Guard: corrupted embed would break the bundler at runtime.
  const roundTrip = extractBundlerTemplate(deHtml);
  if (roundTrip.length !== translated.length) {
    throw new Error(
      `DE HTML template length mismatch after embed (${roundTrip.length} vs ${translated.length})`,
    );
  }
  console.log("Wrote", deHtmlPath);
  return deHtmlPath;
}

async function htmlToPdf(htmlPath, pdfPath) {
  const executablePath = puppeteer.executablePath();
  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0", timeout: 120_000 });
    await page.waitForFunction(
      () => {
        const el = document.getElementById("__bundler_loading");
        return !el || el.textContent === "Done" || !el.offsetParent;
      },
      { timeout: 90_000 },
    ).catch(() => {});
    await new Promise((r) => setTimeout(r, 4000));
    mkdirSync(dirname(pdfPath), { recursive: true });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    console.log("Wrote", pdfPath);
  } finally {
    await browser.close();
  }
}

const htmlPath = buildDeHtml();
await htmlToPdf(htmlPath, dePdfDocs);
mkdirSync(join(root, "public/cv"), { recursive: true });
copyFileSync(dePdfDocs, dePdfPublic);
console.log("Synced", dePdfPublic);
