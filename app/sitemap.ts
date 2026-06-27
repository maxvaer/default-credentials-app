import type { MetadataRoute } from "next";
import { products, vendors } from "@/lib/index";

const BASE = "https://credentials.pentesting-labs.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const vendorEntries: MetadataRoute.Sitemap = vendors.map((v) => ({
    url: `${BASE}/vendor/${v.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    ...productEntries,
    ...vendorEntries,
  ];
}
