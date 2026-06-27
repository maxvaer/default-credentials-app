import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productsBySlug, products, type Credential } from "@/lib/index";
import CopyChip from "@/app/CopyChip";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productsBySlug.get(slug);
  if (!product) return {};
  const title = `${product.product} default credentials`;
  const description = product.vendor
    ? `Default username and password for ${product.product} by ${product.vendor}. ${product.credentials.length} credential set${product.credentials.length === 1 ? "" : "s"}.`
    : `Default username and password for ${product.product}. ${product.credentials.length} credential set${product.credentials.length === 1 ? "" : "s"}.`;
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `https://credentials.pentesting-labs.com/product/${slug}` },
  };
}

// Returns the columns that vary across the credential list, plus a map of
// shared (constant) values that we'll render once as metadata above the table.
function partitionColumns(creds: Credential[]) {
  const allCols = [
    { key: "verified", label: "✓" },
    { key: "username", label: "Username" },
    { key: "password", label: "Password" },
    { key: "versions", label: "Versions" },
    { key: "role", label: "Role" },
    { key: "service", label: "Service" },
    { key: "notes", label: "Notes" },
    { key: "source", label: "Source" },
  ] as const;

  const repr = (c: Credential, key: string): string => {
    if (key === "service") return [c.service, c.port].filter(Boolean).join(":");
    if (key === "versions") return (c.versions ?? []).join(",");
    if (key === "verified") return c.verified === true ? "yes" : "no";
    const v = (c as Record<string, unknown>)[key];
    return v == null ? "" : String(v);
  };

  const varying: typeof allCols[number][] = [];
  const shared: { label: string; value: string; key: string }[] = [];
  for (const col of allCols) {
    const values = new Set(creds.map((c) => repr(c, col.key)));
    // Username and password always vary in meaning even when identical — keep them in the table.
    if (col.key === "username" || col.key === "password") {
      varying.push(col);
      continue;
    }
    // Verified status: keep in table if at least one row is verified (mixed),
    // collapse to shared if every row has the same value.
    if (col.key === "verified") {
      if (values.size === 1) {
        const v = [...values][0];
        if (v === "yes") shared.push({ label: "Verified", value: "all credentials verified ✓", key: "verified" });
        // when all "no", don't bother showing
      } else {
        varying.push(col);
      }
      continue;
    }
    if (values.size === 1) {
      const v = [...values][0];
      if (v) shared.push({ label: col.label, value: v, key: col.key });
    } else {
      varying.push(col);
    }
  }
  return { varying, shared };
}

function fmt(c: Credential, key: string) {
  switch (key) {
    case "verified":
      return c.verified === true ? (
        <span className="badge-verified" title="Independently confirmed">
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : <span className="muted">—</span>;
    case "username":
      return c.username === "" ? <span className="muted">(blank)</span> : <CopyChip value={c.username} />;
    case "password":
      if (c.password === "") return <span className="muted">(blank)</span>;
      if (c.password == null) return <span className="muted">—</span>;
      return <CopyChip value={c.password} />;
    case "versions":
      return c.versions?.join(", ") ?? <span className="muted">—</span>;
    case "role":
      return c.role ?? <span className="muted">—</span>;
    case "service":
      return [c.service, c.port].filter(Boolean).join(":") || <span className="muted">—</span>;
    case "notes":
      return c.notes ?? "";
    case "source":
      return c.source ? (
        <a href={c.source} target="_blank" rel="noreferrer">link</a>
      ) : (
        <span className="muted">—</span>
      );
  }
  return null;
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productsBySlug.get(slug);
  if (!product) notFound();

  const { varying, shared } = partitionColumns(product.credentials);

  return (
    <>
      <h1>{product.product}</h1>
      <p className="muted">
        {product.vendor && <>vendor: {product.vendor} · </>}
        slug: <code>{product.slug}</code>
        {product.category && <> · category: {product.category}</>}
      </p>

      {shared.length > 0 && (
        <dl className="shared-meta">
          {shared.map((s) => (
            <div key={s.key}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <table className="creds">
        <thead>
          <tr>{varying.map((c) => <th key={c.key}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {product.credentials.map((c, i) => (
            <tr key={i}>{varying.map((col) => <td key={col.key}>{fmt(c, col.key)}</td>)}</tr>
          ))}
        </tbody>
      </table>

      {product.sources && product.sources.length > 0 && (
        <>
          <h3>References</h3>
          <ul>
            {product.sources.map((s) => (
              <li key={s}><a href={s} target="_blank" rel="noreferrer">{s}</a></li>
            ))}
          </ul>
        </>
      )}

      <p className="muted" style={{ marginTop: "2rem" }}>
        API: <a href={`/api/products/${product.slug}`}>/api/products/{product.slug}</a>
      </p>
    </>
  );
}
