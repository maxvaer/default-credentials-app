import { NextResponse } from "next/server";
import { products, generatedAt } from "@/lib/index";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    generatedAt,
    count: products.length,
    products: products.map((p) => ({
      slug: p.slug,
      product: p.product,
      vendor: p.vendor,
      category: p.category,
      credentialCount: p.credentials.length,
    })),
  });
}
