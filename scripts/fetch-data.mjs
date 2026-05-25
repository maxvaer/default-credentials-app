#!/usr/bin/env node
// Fetch the data repo into data-cache/ so the next build:index step can read it.
//
// On Vercel, the app repo is cloned but the data repo is not — this script
// shallow-clones it. Locally, if a sibling ../default-credentials checkout
// exists, the build-index script will prefer that.

import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..");
const CACHE = join(APP_ROOT, "data-cache");

const REPO = process.env.DATA_REPO_URL ?? "https://github.com/maxvaer/default-credentials.git";
const REF = process.env.DATA_REPO_REF ?? "main";

// If a sibling checkout exists, prefer it (faster local dev — no clone).
if (existsSync(join(APP_ROOT, "..", "default-credentials", "data"))) {
  console.error("(sibling ../default-credentials checkout found — skipping clone)");
  process.exit(0);
}

if (existsSync(CACHE)) {
  console.error(`removing existing ${CACHE}`);
  await rm(CACHE, { recursive: true, force: true });
}

console.error(`shallow-cloning ${REPO} @ ${REF} -> ${CACHE}`);
execSync(`git clone --depth=1 --branch=${REF} --single-branch ${REPO} ${CACHE}`, { stdio: "inherit" });
console.error("data fetched");
