import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { vendors, vendorsBySlug } from "@/lib/index";

export function generateStaticParams() {
  return vendors.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vendor = vendorsBySlug.get(slug);
  if (!vendor) return {};
  const title = `${vendor.name} default credentials`;
  const description = `Default credentials for all ${vendor.name} products. ${vendor.products.length} product${vendor.products.length === 1 ? "" : "s"} in the database.`;
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `https://credentials.pentesting-labs.com/vendor/${slug}` },
  };
}

export default async function VendorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vendor = vendorsBySlug.get(slug);
  if (!vendor) notFound();

  const totalCreds = vendor.products.reduce((n, p) => n + p.credentials.length, 0);

  return (
    <>
      <h1>{vendor.name}</h1>
      <p className="muted">
        {vendor.products.length} product{vendor.products.length === 1 ? "" : "s"} · {totalCreds} credential{totalCreds === 1 ? "" : "s"}
      </p>

      <section className="index">
        <div className="index-group">
          <ul>
            {vendor.products.map((p) => (
              <li key={p.slug}>
                <a href={`/product/${p.slug}`}>{p.product}</a>
                <span className="count"> · {p.credentials.length} cred{p.credentials.length === 1 ? "" : "s"}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="muted" style={{ marginTop: "2rem" }}>
        <a href="/">← Back to index</a>
      </p>
    </>
  );
}
