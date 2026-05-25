# default-credentials-app

Searchable web UI + JSON API for the public default-credentials dataset at
https://github.com/maxvaer/default-credentials.

Hosted on Vercel. The data repo is the source of truth — this app shallow-clones
it on every build, parses the YAML files, builds an in-memory MiniSearch index,
and serves it via Next.js API routes.

## API

CORS open for all origins. `Cache-Control: public, max-age=300, stale-while-revalidate=86400`.

- `GET /api/products` — list of all products. Add `?verified=true` to only return
  products that have at least one credential cited against a vendor doc.
- `GET /api/products/:slug` — one product with all credentials.
- `GET /api/search?q=tomcat&limit=20&verified=true` — search by product, vendor,
  alias, or username.

## Local dev

The build prefers a sibling checkout of the data repo if one exists; otherwise
it shallow-clones into `data-cache/`. Easiest setup:

```sh
git clone https://github.com/maxvaer/default-credentials.git ../default-credentials
npm install
npm run dev   # http://localhost:3000
```

The `predev` and `prebuild` hooks regenerate `lib/data/products.json` from
whichever data source is available. To point at a different fork or branch:

```sh
DATA_REPO_URL=https://github.com/you/default-credentials.git \
DATA_REPO_REF=experimental \
npm run build
```

## Deploy to Vercel

1. Import this repo into Vercel as a new project.
2. Framework preset: **Next.js**. No further config required — the `prebuild`
   step (`npm run fetch:data && npm run build:index`) handles the data clone
   automatically using the default `DATA_REPO_URL`.
3. To redeploy on data changes, add a Vercel deploy hook URL to the data
   repo's GitHub webhook settings (or run `vercel --prod` from CI).

## Adding credentials

Open a PR against the [data repo](https://github.com/maxvaer/default-credentials),
not this one. The schema (`schema/product.schema.json`) is enforced in CI.
