import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const productsDir = path.join(root, "data", "products");
const outputDir = path.join(root, "docs", "data");
const outputProductsDir = path.join(outputDir, "products");
const apiDir = path.join(root, "docs", "api");
const apiProductsDir = path.join(apiDir, "products");
const pagesDir = path.join(root, "docs", "products");
const generatedAt = process.env.DEFAULTCREDS_GENERATED_AT ?? "1970-01-01T00:00:00.000Z";

const allowedStatuses = new Set(["active", "historical", "reported", "no-default", "unknown"]);
const allowedContexts = new Set(["upstream", "vendor-appliance", "docker-image", "distro-package", "ctf-lab", "sample-config", "unknown"]);
const allowedConfidence = new Set(["confirmed", "vendor-docs", "community-reported", "lab-only", "unknown"]);
const allowedSourceTypes = new Set(["vendor-doc", "manual", "sample-config", "community-list", "ctf", "unknown"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function fail(message, file) {
  const prefix = file ? `${path.relative(root, file)}: ` : "";
  throw new Error(`${prefix}${message}`);
}

function assertString(value, field, file, allowEmpty = false) {
  if (typeof value !== "string" || (!allowEmpty && value.trim() === "")) {
    fail(`expected ${field} to be a ${allowEmpty ? "string" : "non-empty string"}`, file);
  }
}

function assertStringArray(value, field, file, required = false) {
  if (value === undefined && !required) return;
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    fail(`expected ${field} to be an array of strings`, file);
  }
}

function assertPortArray(value, field, file) {
  if (value === undefined) return;
  if (!Array.isArray(value) || value.some((item) => !Number.isInteger(item) || item < 1 || item > 65535)) {
    fail(`expected ${field} to be an array of TCP/UDP port numbers`, file);
  }
}

function assertEnum(value, field, allowed, file) {
  if (value !== undefined && !allowed.has(value)) {
    fail(`${field} must be one of ${Array.from(allowed).join(", ")}`, file);
  }
}

function validateProduct(product, file) {
  assertString(product.product, "product", file);
  assertString(product.slug, "slug", file);
  assertString(product.vendor, "vendor", file);
  assertString(product.category, "category", file);

  if (!slugPattern.test(product.slug)) {
    fail("slug must be lowercase kebab-case", file);
  }

  assertStringArray(product.aliases, "aliases", file);
  assertStringArray(product.tags, "tags", file);
  assertStringArray(product.services, "services", file);
  assertPortArray(product.ports, "ports", file);
  assertStringArray(product.protocols, "protocols", file);
  assertStringArray(product.loginPaths, "loginPaths", file);
  assertStringArray(product.sources, "sources", file);
  if (product.homepage !== undefined) assertString(product.homepage, "homepage", file);

  if (!Array.isArray(product.credentials) || product.credentials.length === 0) {
    fail("credentials must contain at least one record", file);
  }

  product.credentials.forEach((credential, index) => {
    const prefix = `credentials[${index}]`;
    assertString(credential.username, `${prefix}.username`, file, true);
    assertString(credential.password, `${prefix}.password`, file, true);
    assertString(credential.status, `${prefix}.status`, file);

    if (!allowedStatuses.has(credential.status)) {
      fail(`${prefix}.status must be one of ${Array.from(allowedStatuses).join(", ")}`, file);
    }

    assertStringArray(credential.versions, `${prefix}.versions`, file);
    assertStringArray(credential.services, `${prefix}.services`, file);
    assertPortArray(credential.ports, `${prefix}.ports`, file);
    assertStringArray(credential.protocols, `${prefix}.protocols`, file);
    assertStringArray(credential.loginPaths, `${prefix}.loginPaths`, file);
    assertStringArray(credential.sources, `${prefix}.sources`, file);

    assertEnum(credential.context, `${prefix}.context`, allowedContexts, file);
    assertEnum(credential.confidence, `${prefix}.confidence`, allowedConfidence, file);
    assertEnum(credential.sourceType, `${prefix}.sourceType`, allowedSourceTypes, file);
    if (credential.notes !== undefined) assertString(credential.notes, `${prefix}.notes`, file);
    if (credential.scopeNote !== undefined) assertString(credential.scopeNote, `${prefix}.scopeNote`, file);
    if (credential.introduced !== undefined) assertString(credential.introduced, `${prefix}.introduced`, file);
    if (credential.removed !== undefined) assertString(credential.removed, `${prefix}.removed`, file);
    if (credential.lastVerified !== undefined && !datePattern.test(credential.lastVerified)) {
      fail(`${prefix}.lastVerified must be YYYY-MM-DD`, file);
    }
  });
}

function credentialSearchText(product, credential) {
  return [
    product.product,
    product.vendor,
    product.category,
    ...(product.aliases ?? []),
    ...(product.tags ?? []),
    ...(product.services ?? []),
    ...(product.ports ?? []),
    ...(product.protocols ?? []),
    ...(product.loginPaths ?? []),
    credential.username,
    credential.password,
    `${credential.username}:${credential.password}`,
    credential.status,
    credential.context,
    credential.confidence,
    credential.sourceType,
    credential.notes,
    credential.scopeNote,
    ...(credential.services ?? []),
    ...(credential.ports ?? []),
    ...(credential.protocols ?? []),
    ...(credential.loginPaths ?? []),
    ...(credential.versions ?? [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function buildIndex(products) {
  return products
    .map((product) => ({
      product: product.product,
      slug: product.slug,
      vendor: product.vendor,
      category: product.category,
      aliases: product.aliases ?? [],
      tags: product.tags ?? [],
      services: mergedStrings(product, "services"),
      ports: mergedValues(product, "ports").sort((a, b) => a - b),
      protocols: mergedStrings(product, "protocols"),
      loginPaths: mergedStrings(product, "loginPaths"),
      credentialCount: product.credentials.length,
      statuses: [...new Set(product.credentials.map((credential) => credential.status))].sort(),
      contexts: mergedStrings(product, "context"),
      confidence: mergedStrings(product, "confidence"),
      versions: [
        ...new Set(product.credentials.flatMap((credential) => credential.versions ?? []))
      ].sort(),
      searchText: [
        product.product,
        product.vendor,
        product.category,
        ...(product.aliases ?? []),
        ...(product.tags ?? []),
        ...product.credentials.map((credential) => credentialSearchText(product, credential))
      ]
        .join(" ")
        .toLowerCase()
    }))
    .sort((a, b) => a.product.localeCompare(b.product));
}

function mergedValues(product, field) {
  return [
    ...(product[field] ?? []),
    ...product.credentials.flatMap((credential) => credential[field] ?? [])
  ].filter((value, index, values) => values.indexOf(value) === index);
}

function mergedStrings(product, field) {
  return [
    ...(Array.isArray(product[field]) ? product[field] : []),
    ...product.credentials.flatMap((credential) => {
      if (Array.isArray(credential[field])) return credential[field];
      return credential[field] ? [credential[field]] : [];
    })
  ]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .sort();
}

function buildFlatCredentials(products) {
  return products.flatMap((product) =>
    product.credentials.map((credential) => ({
      product: product.product,
      slug: product.slug,
      vendor: product.vendor,
      category: product.category,
      username: credential.username,
      password: credential.password,
      pair: `${credential.username}:${credential.password}`,
      versions: credential.versions ?? [],
      status: credential.status,
      context: credential.context ?? "unknown",
      confidence: credential.confidence ?? "unknown",
      sourceType: credential.sourceType ?? "unknown",
      services: credential.services ?? product.services ?? [],
      ports: credential.ports ?? product.ports ?? [],
      protocols: credential.protocols ?? product.protocols ?? [],
      loginPaths: credential.loginPaths ?? product.loginPaths ?? [],
      lastVerified: credential.lastVerified ?? "",
      notes: credential.notes ?? "",
      scopeNote: credential.scopeNote ?? "",
      sources: credential.sources ?? product.sources ?? []
    }))
  );
}

function renderProductPage(product) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(product.product)} - defaultcreds</title>
    <link rel="icon" href="../../assets/defaultcreds-mark.svg" type="image/svg+xml">
    <link rel="stylesheet" href="../../styles.css">
  </head>
  <body>
    <header class="topbar">
      <a class="brand" href="../../" aria-label="defaultcreds home">
        <img src="../../assets/defaultcreds-mark.svg" width="34" height="34" alt="">
        <span>defaultcreds</span>
      </a>
      <div class="header-search" role="search" aria-label="Credential search">
        <label class="search-box">
          <span class="sr-only">Search</span>
          <input id="search" type="search" autocomplete="off" spellcheck="false" placeholder="Search product, port, service, username:password">
        </label>
        <select id="status-filter" aria-label="Status">
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="reported">Reported</option>
          <option value="historical">Historical</option>
          <option value="no-default">No default</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>
      <div class="top-actions">
        <nav class="nav">
          <a href="https://github.com/maxvaer/default-credentials" target="_blank" rel="noreferrer noopener">Contribute</a>
        </nav>
        <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Use dark mode" aria-pressed="false">
          <span class="theme-toggle-track" aria-hidden="true">
            <span class="theme-toggle-thumb"></span>
          </span>
          <span class="theme-toggle-text">Dark</span>
        </button>
      </div>
    </header>

    <main class="shell">
      <section class="layout">
        <aside class="results" aria-label="Products">
          <div class="result-meta">
            <span id="result-count">0 products</span>
          </div>
          <div id="results"></div>
        </aside>

        <section class="detail" id="detail" aria-live="polite"></section>
      </section>
    </main>

    <footer class="site-footer">
      <p>For authorized pentesting, CTF, lab, and defensive assessment usage only.</p>
      <p>Contributions are handled through the <a href="https://github.com/maxvaer/default-credentials" target="_blank" rel="noreferrer noopener">default-credentials GitHub repository</a>.</p>
    </footer>

    <template id="copy-icon">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M8 8h11v13H8z"></path>
        <path d="M5 16H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1"></path>
      </svg>
    </template>

    <script src="../../app.js" type="module" data-base-path="../.." data-initial-slug="${escapeHtml(product.slug)}"></script>
  </body>
</html>
`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function main() {
  const files = (await readdir(productsDir))
    .filter((file) => file.endsWith(".json"))
    .sort();

  const products = [];
  const seenSlugs = new Set();

  for (const filename of files) {
    const file = path.join(productsDir, filename);
    const product = JSON.parse(await readFile(file, "utf8"));
    validateProduct(product, file);

    if (seenSlugs.has(product.slug)) {
      fail(`duplicate slug: ${product.slug}`, file);
    }

    seenSlugs.add(product.slug);
    products.push(product);
  }

  const index = buildIndex(products);
  const flatCredentials = buildFlatCredentials(products);

  await mkdir(outputProductsDir, { recursive: true });
  await mkdir(apiProductsDir, { recursive: true });
  await mkdir(pagesDir, { recursive: true });

  for (const product of products) {
    const serialized = `${JSON.stringify(product, null, 2)}\n`;
    await writeFile(path.join(outputProductsDir, `${product.slug}.json`), serialized);
    await writeFile(path.join(apiProductsDir, `${product.slug}.json`), serialized);
    await mkdir(path.join(pagesDir, product.slug), { recursive: true });
    await writeFile(path.join(pagesDir, product.slug, "index.html"), renderProductPage(product));
  }

  await writeFile(
    path.join(outputDir, "search-index.json"),
    `${JSON.stringify({ generatedAt, products: index }, null, 2)}\n`
  );
  await writeFile(
    path.join(apiDir, "products.json"),
    `${JSON.stringify({ products: index }, null, 2)}\n`
  );
  await writeFile(
    path.join(apiDir, "credentials.json"),
    `${JSON.stringify({ credentials: flatCredentials }, null, 2)}\n`
  );

  console.log(`Built ${products.length} product record${products.length === 1 ? "" : "s"} and ${flatCredentials.length} credential record${flatCredentials.length === 1 ? "" : "s"}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
