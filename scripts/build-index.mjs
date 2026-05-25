#!/usr/bin/env node
// Build a single products.json from the default-credentials data repo.
//
// Two data sources, in priority order:
//   1. DATA_REPO_PATH env var → local path to a checkout of maxvaer/default-credentials
//   2. Default: ../default-credentials (sibling directory)
//
// In CI, the workflow will clone the data repo into ./data-cache before running this.
// The output products.json is read at request time by the Next.js API routes.

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = resolve(__dirname, "..");

const candidates = [
  process.env.DATA_REPO_PATH,
  join(APP_ROOT, "data-cache"),
  resolve(APP_ROOT, "..", "default-credentials"),
].filter(Boolean);

const dataRepo = candidates.find((p) => existsSync(join(p, "data")));
if (!dataRepo) {
  console.error("No data repo found. Set DATA_REPO_PATH or clone the data repo to a sibling directory.");
  console.error("Tried:");
  for (const c of candidates) console.error(`  - ${c}`);
  process.exit(1);
}

console.error(`reading data from ${dataRepo}`);
const dataDir = join(dataRepo, "data");
const files = (await readdir(dataDir)).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));
const products = [];
for (const file of files) {
  const raw = await readFile(join(dataDir, file), "utf8");
  try {
    const doc = parseYaml(raw);
    if (doc && doc.slug) products.push(doc);
  } catch (err) {
    console.error(`skip ${file}: ${err.message}`);
  }
}

products.sort((a, b) => a.slug.localeCompare(b.slug));

const outDir = join(APP_ROOT, "lib", "data");
await mkdir(outDir, { recursive: true });
const outPath = join(outDir, "products.json");
await writeFile(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), products }, null, 2));
console.error(`wrote ${products.length} product(s) to ${outPath}`);
