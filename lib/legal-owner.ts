// Operator PII for the legal pages (Impressum / Datenschutz).
//
// Sourced from environment variables so it is NEVER committed to the repo:
// set these in Vercel → Project → Settings → Environment Variables (and in
// a local, git-ignored .env.local for `npm run dev`). The deployed app
// renders them; the public repo only ever sees `process.env.*` references.
// These are server-only env vars (no NEXT_PUBLIC_ prefix) — the legal pages
// are server components, so the values are rendered server-side.

const env = (k: string) => process.env[k]?.trim() || "";

export const siteOwner = {
  name: env("IMPRESSUM_NAME"),
  // c/o line shown between name and street when set.
  careOf: env("IMPRESSUM_CARE_OF") || undefined,
  street: env("IMPRESSUM_STREET"),
  postalCode: env("IMPRESSUM_POSTAL_CODE"),
  city: env("IMPRESSUM_CITY"),
  country: env("IMPRESSUM_COUNTRY") || "Deutschland",
  email: env("IMPRESSUM_EMAIL"),
  // Optional — omitted from the page when empty.
  secondContact: env("IMPRESSUM_SECOND_CONTACT") || undefined,
  vatId: env("IMPRESSUM_VAT_ID") || undefined,
};

/** One-line postal address, e.g. "Street 1, 12345 City, Country". */
export const ownerAddress = (): string =>
  [
    siteOwner.street,
    `${siteOwner.postalCode} ${siteOwner.city}`.trim(),
    siteOwner.country,
  ]
    .filter((p) => p && p.trim().length > 0)
    .join(", ");
