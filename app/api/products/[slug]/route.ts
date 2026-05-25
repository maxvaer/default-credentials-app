import { productsBySlug, generatedAt } from "@/lib/index";
import { apiJson, preflight } from "@/lib/api";

export const runtime = "nodejs";

export async function OPTIONS() {
  return preflight();
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productsBySlug.get(slug);
  if (!product) {
    return apiJson({ error: "not_found", slug }, { status: 404 });
  }
  return apiJson({ generatedAt, ...product });
}
