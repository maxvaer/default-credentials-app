import { NextRequest } from "next/server";
import { searchIndex, productsBySlug, generatedAt } from "@/lib/index";
import { apiJson, parseVerifiedParam, preflight } from "@/lib/api";

export const runtime = "nodejs";

export async function OPTIONS() {
  return preflight();
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "20", 10) || 20, 100);
  const verifiedOnly = parseVerifiedParam(req.nextUrl.searchParams);

  if (!q.trim()) {
    return apiJson({ generatedAt, query: q, verifiedOnly, results: [] });
  }

  let hits = searchIndex.search(q);
  if (verifiedOnly) {
    hits = hits.filter((h) => {
      const p = productsBySlug.get(h.slug as string);
      return p?.credentials.some((c) => c.verified === true) ?? false;
    });
  }
  const results = hits.slice(0, limit).map((h) => {
    const p = productsBySlug.get(h.slug as string);
    return {
      slug: h.slug,
      product: h.product,
      vendor: h.vendor || undefined,
      score: h.score,
      credentialCount: p?.credentials.length ?? 0,
      verifiedCredentialCount: p?.credentials.filter((c) => c.verified === true).length ?? 0,
    };
  });
  return apiJson({ generatedAt, query: q, verifiedOnly, results });
}
