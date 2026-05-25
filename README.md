# default-credentials-app

Searchable web UI + JSON API for the public default-credentials dataset at
https://github.com/maxvaer/default-credentials.

Hosted on Vercel. The data repo is the source of truth — this app pulls it in at
build time, builds an in-memory search index, and serves it via Next.js API routes.

## API

- `GET /api/products` — list of all products
- `GET /api/products/:slug` — one product with all credentials
- `GET /api/search?q=tomcat&limit=20` — search by product / vendor / alias / username

## Local dev

Clone the data repo as a sibling directory:

```sh
git clone https://github.com/maxvaer/default-credentials.git ../default-credentials
```

Or set `DATA_REPO_PATH` to wherever you have it. Then:

```sh
npm install
npm run build:index   # parses data repo into lib/data/products.json
npm run dev           # http://localhost:3000
```

## Adding credentials

Open a PR against the [data repo](https://github.com/maxvaer/default-credentials),
not this one. The schema (`schema/product.schema.json`) is enforced in CI.
