#!/usr/bin/env node
/**
 * Ensures Puppeteer's bundled Chrome is installed before PDF generation.
 * Run automatically via `npm run cv:generate-de`, or manually:
 *
 *   npm run cv:install-chrome
 */
import { accessSync } from "node:fs";
import { spawnSync } from "node:child_process";
import puppeteer from "puppeteer";

function resolveChromePath() {
  try {
    const executablePath = puppeteer.executablePath();
    accessSync(executablePath);
    return executablePath;
  } catch {
    return null;
  }
}

let chromePath = resolveChromePath();
if (chromePath) {
  console.log("Puppeteer Chrome:", chromePath);
  process.exit(0);
}

console.log("Chrome not found for Puppeteer — installing (one-time download)…");
const install = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["puppeteer", "browsers", "install", "chrome"],
  { stdio: "inherit" },
);

if (install.status !== 0) {
  console.error(
    "\nFailed to install Chrome. Try manually:\n  npm run cv:install-chrome",
  );
  process.exit(install.status ?? 1);
}

chromePath = resolveChromePath();
if (!chromePath) {
  console.error(
    "\nChrome install reported success but the executable is still missing.",
    "\nCache dir:", process.env.PUPPETEER_CACHE_DIR ?? `${process.env.HOME}/.cache/puppeteer`,
    "\nTry: npm run cv:install-chrome",
  );
  process.exit(1);
}

console.log("Puppeteer Chrome:", chromePath);
