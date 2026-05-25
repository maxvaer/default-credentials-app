import { NextResponse } from "next/server";
import { productsBySlug, generatedAt } from "@/lib/index";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productsBySlug.get(slug);
  if (!product) {
    return NextResponse.json({ error: "not_found", slug }, { status: 404 });
  }
  return NextResponse.json({ generatedAt, ...product });
}
