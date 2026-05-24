const state = {
  index: [],
  activeSlug: "",
  products: new Map(),
  query: "",
  status: ""
};

const els = {
  search: document.querySelector("#search"),
  status: document.querySelector("#status-filter"),
  results: document.querySelector("#results"),
  count: document.querySelector("#result-count"),
  detail: document.querySelector("#detail"),
  copyIcon: document.querySelector("#copy-icon"),
  themeToggle: document.querySelector("#theme-toggle")
};

const script = document.currentScript;
const basePath = script?.dataset.basePath ?? ".";
const initialSlug = script?.dataset.initialSlug ?? "";
const themeStorageKey = "defaultcreds-theme";

function credentialPair(username, password) {
  return `${username}:${password}`;
}

function displaySecret(value) {
  return value === "" ? "<blank>" : value;
}

function displayList(values, fallback = "") {
  return values?.length ? values.join(", ") : fallback;
}

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function queryMatches(product) {
  const query = normalize(state.query);
  if (!query) return true;

  const parts = query.split(/\s+/).filter(Boolean);
  return parts.every((part) => product.searchText.includes(part));
}

function statusMatches(product) {
  return !state.status || product.statuses.includes(state.status);
}

function getPreferredTheme() {
  const saved = localStorage.getItem(themeStorageKey);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(themeStorageKey, theme);

  if (!els.themeToggle) return;
  const isDark = theme === "dark";
  els.themeToggle.setAttribute("aria-pressed", String(isDark));
  els.themeToggle.setAttribute("aria-label", isDark ? "Use light mode" : "Use dark mode");
  els.themeToggle.querySelector(".theme-toggle-text").textContent = isDark ? "Light" : "Dark";
}

function filteredProducts() {
  return state.index.filter((product) => queryMatches(product) && statusMatches(product));
}

function productListLabel(product) {
  const vendor = normalize(product.vendor);
  const productName = normalize(product.product);
  return productName.includes(vendor) ? product.product : `${product.vendor} ${product.product}`;
}

function renderResults() {
  const products = filteredProducts();
  els.count.textContent = `${products.length} product${products.length === 1 ? "" : "s"}`;
  els.results.replaceChildren();

  for (const product of products) {
    const button = document.createElement("button");
    button.className = `result${product.slug === state.activeSlug ? " is-active" : ""}`;
    button.type = "button";
    button.dataset.slug = product.slug;

    const title = document.createElement("div");
    title.className = "result-title";
    title.textContent = productListLabel(product);

    button.append(title);
    button.addEventListener("click", () => selectProduct(product.slug));
    els.results.append(button);
  }

  if (!products.some((product) => product.slug === state.activeSlug)) {
    renderEmpty(products.length === 0 ? "No matching products." : "Select a product.");
  }
}

async function selectProduct(slug) {
  state.activeSlug = slug;
  if (!initialSlug) location.hash = slug;
  renderResults();
  renderLoading();

  const product = await loadProduct(slug);
  renderProduct(product);
}

async function loadProduct(slug) {
  if (state.products.has(slug)) return state.products.get(slug);

  const response = await fetch(`${basePath}/data/products/${slug}.json`);
  if (!response.ok) throw new Error(`Failed to load ${slug}`);

  const product = await response.json();
  state.products.set(slug, product);
  return product;
}

function renderLoading() {
  els.detail.innerHTML = `<div class="loading-state">Loading...</div>`;
}

function renderEmpty(message) {
  els.detail.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
}

function renderProduct(product) {
  const productSources = new Set(product.sources ?? []);
  for (const credential of product.credentials) {
    for (const source of credential.sources ?? []) productSources.add(source);
  }

  els.detail.innerHTML = `
    <div class="detail-header">
      <div class="detail-title-row">
        <div>
          <h2>${escapeHtml(product.product)}</h2>
          <div class="detail-meta">${escapeHtml(product.vendor)} / ${escapeHtml(product.category)}</div>
          ${renderProductMetaDetails(product)}
        </div>
      </div>
    </div>
    <div class="credential-list" role="table" aria-label="Credentials">
      <div class="credential-list-header" role="row">
        <span role="columnheader">Version</span>
        <span role="columnheader">Username</span>
        <span role="columnheader">Password</span>
        <span role="columnheader">Details</span>
      </div>
      ${product.credentials.map((credential) => renderCredentialCard(credential)).join("")}
    </div>
    ${renderSources([...productSources])}
  `;

  for (const button of els.detail.querySelectorAll(".copy-button")) {
    button.append(els.copyIcon.content.cloneNode(true));
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.setAttribute("aria-label", "Copied");
      window.setTimeout(() => button.setAttribute("aria-label", "Copy"), 900);
    });
  }
}

function renderProductMetaDetails(product) {
  return `
    <details class="product-details">
      <summary>Product details</summary>
      <div class="product-detail-grid">
        ${renderProductDetail("Tags", displayList(product.tags, "None"))}
        ${renderProductDetail("Protocols", displayList(product.protocols, "Unknown"))}
        ${renderProductDetail("Login paths", displayList(product.loginPaths, "Unknown"))}
        ${renderProductDetail("Services", displayList(product.services, "Unknown"))}
        ${renderProductDetail("Ports", displayList(product.ports, "Unknown"))}
      </div>
    </details>
  `;
}

function renderProductDetail(label, value) {
  return `
    <div class="product-detail-item">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderCredentialCard(credential) {
  const versions = credential.versions?.length ? credential.versions.join(", ") : "Any";
  const pair = credentialPair(credential.username, credential.password);
  const target = [
    displayList(credential.services),
    displayList(credential.ports?.map((port) => `:${port}`)),
    displayList(credential.loginPaths)
  ].filter(Boolean).join(" ");

  return `
    <article class="credential-card" role="rowgroup">
      <div class="credential-row" role="row">
        <div class="credential-version" role="cell">${escapeHtml(versions)}</div>
        <div role="cell">${renderCredentialValue(credential.username)}</div>
        <div role="cell">${renderCredentialValue(credential.password, pair)}</div>
        <div role="cell">
          <details class="credential-details">
            <summary>Details</summary>
            <div class="credential-detail-body">
              <div class="credential-card-meta">
                <span class="status" data-status="${escapeHtml(credential.status)}">${escapeHtml(credential.status)}</span>
                ${credential.context ? `<span class="tag">${escapeHtml(credential.context)}</span>` : ""}
                ${credential.confidence ? `<span class="tag">${escapeHtml(credential.confidence)}</span>` : ""}
                ${credential.sourceType ? `<span class="tag">${escapeHtml(credential.sourceType)}</span>` : ""}
              </div>
              ${target ? `<div class="target-line">${escapeHtml(target)}</div>` : ""}
              <div class="notes">
                ${escapeHtml(credential.notes ?? "")}
                ${credential.scopeNote ? `<div class="scope-note">${escapeHtml(credential.scopeNote)}</div>` : ""}
                ${credential.lastVerified ? `<div class="verified">Verified ${escapeHtml(credential.lastVerified)}</div>` : ""}
              </div>
            </div>
          </details>
        </div>
      </div>
    </article>
  `;
}

function renderCredentialValue(value, copyValue = value) {
  return `
    <span class="credential-cell">
      <code>${escapeHtml(displaySecret(value))}</code>
      <button class="copy-button" type="button" aria-label="Copy" title="Copy" data-copy="${escapeHtml(copyValue)}"></button>
    </span>
  `;
}

function renderSources(sources) {
  if (sources.length === 0) return "";

  return `
    <div class="sources">
      <h3>Sources</h3>
      ${sources.map((source) => `<div><a href="${escapeHtml(source)}" target="_blank" rel="noreferrer noopener">${escapeHtml(source)}</a></div>`).join("")}
    </div>
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

async function init() {
  setTheme(getPreferredTheme());
  els.themeToggle?.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });

  renderLoading();
  const response = await fetch(`${basePath}/data/search-index.json`);
  const data = await response.json();
  state.index = data.products;

  els.search.addEventListener("input", () => {
    state.query = els.search.value;
    renderResults();
  });

  els.status.addEventListener("change", () => {
    state.status = els.status.value;
    renderResults();
  });

  renderResults();

  const hashSlug = location.hash.replace(/^#/, "");
  const requestedSlug = initialSlug || hashSlug;
  const initial = state.index.find((product) => product.slug === requestedSlug) ?? state.index[0];
  if (initial) await selectProduct(initial.slug);
}

init().catch((error) => {
  console.error(error);
  renderEmpty("Unable to load data.");
});
