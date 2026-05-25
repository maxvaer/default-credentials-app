import { NextRequest, NextResponse } from "next/server";
import { searchIndex, productsBySlug, generatedAt } from "@/lib/index";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "20", 10) || 20, 100);

  if (!q.trim()) {
    return NextResponse.json({ generatedAt, query: q, results: [] });
  }

  const hits = searchIndex.search(q).slice(0, limit);
  const results = hits.map((h) => {
    const p = productsBySlug.get(h.slug as string);
    return {
      slug: h.slug,
      product: h.product,
      vendor: h.vendor || undefined,
      score: h.score,
      credentialCount: p?.credentials.length ?? 0,
    };
  });
  return NextResponse.json({ generatedAt, query: q, results });
}
