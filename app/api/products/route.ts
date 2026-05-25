import { NextRequest } from "next/server";
import { products, generatedAt } from "@/lib/index";
import { apiJson, parseVerifiedParam, preflight } from "@/lib/api";

export const runtime = "nodejs";

export async function OPTIONS() {
  return preflight();
}

export async function GET(req: NextRequest) {
  const verifiedOnly = parseVerifiedParam(req.nextUrl.searchParams);
  const filtered = verifiedOnly
    ? products.filter((p) => p.credentials.some((c) => c.verified === true))
    : products;

  return apiJson({
    generatedAt,
    count: filtered.length,
    verifiedOnly,
    products: filtered.map((p) => ({
      slug: p.slug,
      product: p.product,
      vendor: p.vendor,
      category: p.category,
      credentialCount: p.credentials.length,
      verifiedCredentialCount: p.credentials.filter((c) => c.verified === true).length,
    })),
  });
}
