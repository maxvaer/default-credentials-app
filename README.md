# defaultcreds

A static, searchable reference for public default credentials, designed to be backed by community GitHub contributions.

The site follows an endoflife.date-style model: each product has a stable page, generated JSON API output, and credential records scoped to versions, services, ports, contexts, confidence, and sources.

## Local Development

```sh
npm run build:data
npm run serve
```

Then open `http://127.0.0.1:8080`.

## Data Model

Product records live in `data/products/*.json`. Each credential can include:

- `username` and `password`
- `versions`, such as `8.x`, `9.0.x`, `<= 2.1.4`, or `firmware 3.x`
- `status`, one of `active`, `historical`, `reported`, `no-default`, or `unknown`
- `context`, such as `upstream`, `vendor-appliance`, `docker-image`, `distro-package`, or `ctf-lab`
- `services`, `ports`, `protocols`, and `loginPaths` for pentest search workflows
- `confidence`, `sourceType`, `lastVerified`, and `scopeNote` for data quality
- `sources` for verification

The formal schema lives at `schema/product.schema.json`. The build script validates product files and writes:

- `docs/data/search-index.json` for the web UI
- `docs/data/products/*.json` for product detail loading
- `docs/api/products.json` for product index consumers
- `docs/api/products/*.json` for per-product API consumers
- `docs/api/credentials.json` for flat credential search tooling
- `docs/products/<slug>/index.html` for stable product pages

## Upstream Dataset

The intended source of truth is:

https://github.com/maxvaer/default-credentials

Records must describe public default, vendor, sample, appliance, or lab credentials only. Do not submit leaked, stolen, customer-specific, or environment-specific secrets.
