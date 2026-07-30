#!/usr/bin/env node
/**
 * Copies CV PDFs from docs/ (source exports) into public/cv/ for static serving.
 * Run after updating CV Nomena EN.pdf or CV Nomena FR (standalone).pdf in docs/.
 *
 *   node scripts/sync-cv-pdfs.mjs
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "cv");

mkdirSync(outDir, { recursive: true });

const copies = [
  ["docs/CV Nomena EN.pdf", "public/cv/nomena-en.pdf"],
  ["docs/CV Nomena FR (standalone).pdf", "public/cv/nomena-fr.pdf"],
  ["docs/CV Nomena DE.pdf", "public/cv/nomena-de.pdf"],
];

for (const [src, dest] of copies) {
  copyFileSync(join(root, src), join(root, dest));
  console.log(`synced ${dest}`);
}

console.log("Done.");
