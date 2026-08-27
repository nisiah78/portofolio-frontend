#!/usr/bin/env node
/**
 * Renders docs/CV Nomena EN.html and docs/CV Nomena FR (standalone).html to PDF
 * directly (no translation step — these are the primary authored languages),
 * then syncs the output into public/cv/. Companion to generate-cv-de.mjs, which
 * derives the German version from the EN HTML via translation.
 *
 *   node scripts/generate-cv-en-fr.mjs
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const targets = [
  { html: join(root, "docs/CV Nomena EN.html"), pdf: join(root, "docs/CV Nomena EN.pdf") },
  {
    html: join(root, "docs/CV Nomena FR (standalone).html"),
    pdf: join(root, "docs/CV Nomena FR (standalone).pdf"),
  },
];

async function htmlToPdf(htmlPath, pdfPath) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: puppeteer.executablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.goto(`file://${htmlPath}?t=${Date.now()}`, { waitUntil: "networkidle0", timeout: 120_000 });
    await page
      .waitForFunction(
        () => {
          const el = document.getElementById("__bundler_loading");
          return !el || el.textContent === "Done" || !el.offsetParent;
        },
        { timeout: 90_000 },
      )
      .catch(() => {});
    await new Promise((r) => setTimeout(r, 4000));
    mkdirSync(dirname(pdfPath), { recursive: true });
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
    console.log("Wrote", pdfPath);
  } finally {
    await browser.close();
  }
}

for (const { html, pdf } of targets) {
  await htmlToPdf(html, pdf);
}
