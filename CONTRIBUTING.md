# Contributing

Add or update product files in `data/products/`.

Each product needs a stable `slug`, searchable metadata, and at least one credential record. Prefer exact version ranges, service/port metadata, and source links when available.

Use the JSON schema in new files:

```json
{
  "$schema": "../../schema/product.schema.json"
}
```

Use an empty string for blank usernames or passwords:

```json
{
  "username": "admin",
  "password": "",
  "versions": ["8.x", "9.x"],
  "status": "reported",
  "context": "distro-package",
  "confidence": "community-reported",
  "sourceType": "community-list",
  "services": ["http"],
  "ports": [8080],
  "protocols": ["http"],
  "loginPaths": ["/admin"],
  "lastVerified": "2026-05-24",
  "scopeNote": "Applies to the referenced package only; upstream may differ.",
  "sources": ["https://example.com/reference"]
}
```

Allowed `status` values are `active`, `historical`, `reported`, `no-default`, and `unknown`.

Allowed `confidence` values are `confirmed`, `vendor-docs`, `community-reported`, `lab-only`, and `unknown`.

Allowed `sourceType` values are `vendor-doc`, `manual`, `sample-config`, `community-list`, `ctf`, and `unknown`.

Only submit public default, vendor, sample, appliance, or lab credentials. Do not submit leaked, stolen, customer-specific, or environment-specific secrets.

Run validation before opening a pull request:

```sh
npm run validate
```

The generated files under `docs/data/`, `docs/api/`, and `docs/products/` should be committed with the source data change.
