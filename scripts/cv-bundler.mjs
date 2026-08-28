/**
 * Shared helpers for the CV HTML bundles in docs/.
 *
 * Each bundle is a single-file export whose readable content lives in a JSON
 * string embedded as `<script type="__bundler/template">`. Editing a CV means
 * round-tripping that string: extract → transform → re-embed → render.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Source bundle, docs PDF and served copy for each locale. */
export const CV_FILES = {
  en: {
    html: "docs/CV Nomena EN.html",
    pdf: "docs/CV Nomena EN.pdf",
    public: "public/cv/nomena-en.pdf",
  },
  fr: {
    html: "docs/CV Nomena FR (standalone).html",
    pdf: "docs/CV Nomena FR (standalone).pdf",
    public: "public/cv/nomena-fr.pdf",
  },
  de: {
    html: "docs/CV Nomena DE.html",
    pdf: "docs/CV Nomena DE.pdf",
    public: "public/cv/nomena-de.pdf",
  },
};

export const locales = Object.keys(CV_FILES);

const TEMPLATE_RE = /<script type="__bundler\/template">([\s\S]*)<\/script>\s*<\/body>/;

/** Read bundler template JSON (greedy match up to the last `</script>` before `</body>`). */
export function extractBundlerTemplate(html) {
  const match = html.match(TEMPLATE_RE);
  if (!match) throw new Error("Missing __bundler/template in CV HTML");
  return JSON.parse(match[1]);
}

/** Serialize like the source export: avoid literal `</script>` in the host HTML. */
export function serializeBundlerTemplate(template) {
  return JSON.stringify(template).replace(/<\/script>/gi, "<\\u002Fscript>");
}

export function replaceBundlerTemplate(html, template) {
  const serialized = serializeBundlerTemplate(template);
  return html.replace(
    /<script type="__bundler\/template">[\s\S]*<\/script>(\s*<\/body>)/,
    `<script type="__bundler/template">${serialized}</script>$1`,
  );
}

/**
 * Apply `transform` to a bundle's template and write the result to `outPath`.
 * Verifies the re-embedded template round-trips — a corrupted embed would only
 * surface later, as a blank page at render time.
 */
export function rewriteBundle(inPath, outPath, transform) {
  const html = readFileSync(inPath, "utf8");
  const template = extractBundlerTemplate(html);
  const next = transform(template);
  const out = replaceBundlerTemplate(html, next);
  writeFileSync(outPath, out);

  const roundTrip = extractBundlerTemplate(out);
  if (roundTrip.length !== next.length) {
    throw new Error(
      `Template length mismatch after embed (${roundTrip.length} vs ${next.length})`,
    );
  }
  return next;
}

/** Render a local HTML bundle to PDF, waiting for the embedded bundler to finish. */
export async function htmlToPdf(htmlPath, pdfPath) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: puppeteer.executablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    // pathToFileURL escapes spaces and parentheses — "CV Nomena FR (standalone).html".
    await page.goto(pathToFileURL(htmlPath).href, {
      waitUntil: "networkidle0",
      timeout: 120_000,
    });
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
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }
}
