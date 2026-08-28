#!/usr/bin/env node
/**
 * Renders CV HTML bundles from docs/ to PDF and syncs them into public/cv/.
 * Use after editing the content of a bundle. Requires puppeteer (devDependency).
 *
 *   npm run cv:render          # all locales
 *   npm run cv:render -- fr    # one or more locales
 *
 * Note: the German bundle is derived from the English one — after changing the
 * EN content, run `npm run cv:generate-de` rather than rendering DE directly.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { CV_FILES, htmlToPdf, locales, root } from "./cv-bundler.mjs";

const requested = process.argv.slice(2).map((a) => a.toLowerCase());
const unknown = requested.filter((l) => !locales.includes(l));
if (unknown.length) {
  console.error(`Unknown locale(s): ${unknown.join(", ")}`);
  console.error(`Available: ${locales.join(", ")}`);
  process.exit(1);
}

const targets = requested.length ? requested : locales;

for (const locale of targets) {
  const { html, pdf, public: served } = CV_FILES[locale];
  const htmlPath = join(root, html);
  if (!existsSync(htmlPath)) {
    console.error(`[${locale}] missing source: ${html}`);
    process.exit(1);
  }

  console.log(`[${locale}] rendering ${html}…`);
  await htmlToPdf(htmlPath, join(root, pdf));
  console.log(`[${locale}] wrote ${pdf}`);

  mkdirSync(dirname(join(root, served)), { recursive: true });
  copyFileSync(join(root, pdf), join(root, served));
  console.log(`[${locale}] synced ${served}`);
}

console.log(`\nDone — ${targets.length} CV(s) rendered.`);
