import MiniSearch from "minisearch";
import productsData from "./data/products.json";

export type Credential = {
  username: string;
  password?: string;
  versions?: string[];
  role?: string;
  service?: string;
  port?: number;
  notes?: string;
  source?: string;
  verified?: boolean;
};

export type Product = {
  product: string;
  vendor?: string;
  slug: string;
  aliases?: string[];
  category?: string;
  credentials: Credential[];
  sources?: string[];
};

type Bundle = { generatedAt: string; products: Product[] };

const bundle = productsData as Bundle;

export const products: Product[] = bundle.products;
export const generatedAt: string = bundle.generatedAt;

export const productsBySlug = new Map<string, Product>(
  products.map((p) => [p.slug, p]),
);

export function vendorSlug(vendor: string): string {
  return vendor
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export type Vendor = { name: string; slug: string; products: Product[] };

export const vendors: Vendor[] = (() => {
  const byName = new Map<string, Product[]>();
  for (const p of products) {
    if (!p.vendor) continue;
    if (!byName.has(p.vendor)) byName.set(p.vendor, []);
    byName.get(p.vendor)!.push(p);
  }
  const list: Vendor[] = [...byName.entries()].map(([name, ps]) => ({
    name,
    slug: vendorSlug(name),
    products: [...ps].sort((a, b) => a.product.localeCompare(b.product)),
  }));
  list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
})();

export const vendorsBySlug = new Map<string, Vendor>(vendors.map((v) => [v.slug, v]));

const searchDocs = products.map((p) => ({
  slug: p.slug,
  product: p.product,
  vendor: p.vendor ?? "",
  aliases: (p.aliases ?? []).join(" "),
  usernames: p.credentials.map((c) => c.username).filter(Boolean).join(" "),
}));

export const searchIndex = new MiniSearch({
  fields: ["product", "vendor", "aliases", "usernames"],
  storeFields: ["slug", "product", "vendor"],
  idField: "slug",
  searchOptions: {
    boost: { product: 3, vendor: 2, aliases: 2 },
    prefix: true,
    fuzzy: 0.2,
  },
});
searchIndex.addAll(searchDocs);
