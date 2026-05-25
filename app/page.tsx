import { products, vendors, type Product, type Vendor } from "@/lib/index";
import IndexToggle from "./IndexToggle";

function groupByLetter<T>(items: T[], label: (item: T) => string) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const first = label(item)[0]?.toUpperCase() ?? "?";
    const key = /[A-Z]/.test(first) ? first : "#";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (a === "#") return 1;
      if (b === "#") return -1;
      return a.localeCompare(b);
    })
    .map(([letter, items]) => ({
      letter,
      items: [...items].sort((a, b) => label(a).localeCompare(label(b))),
    }));
}

function hasVerifiedCred(p: Product): boolean {
  return p.credentials.some((c) => c.verified === true);
}

function AlphaNav({ letters, idPrefix }: { letters: string[]; idPrefix: string }) {
  return (
    <div className="alpha-nav">
      {letters.map((l) => (
        <a key={l} href={`#${idPrefix}-${l}`}>{l}</a>
      ))}
    </div>
  );
}

function ProductsIndex({ groups, idPrefix = "p" }: { groups: { letter: string; items: Product[] }[]; idPrefix?: string }) {
  if (groups.length === 0) return <p className="hint">No products match.</p>;
  return (
    <>
      <AlphaNav letters={groups.map((g) => g.letter)} idPrefix={idPrefix} />
      <section className="index">
        {groups.map(({ letter, items }) => (
          <div key={letter} className="index-group">
            <h2 id={`${idPrefix}-${letter}`}>{letter}</h2>
            <ul>
              {items.map((p) => (
                <li key={p.slug}>
                  <a href={`/product/${p.slug}`}>{p.product}</a>
                  {p.vendor && <span className="pill" style={{ marginLeft: "0.5rem" }}>{p.vendor}</span>}
                  <span className="count"> · {p.credentials.length}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}

function VendorsIndex({ groups, idPrefix = "v" }: { groups: { letter: string; items: Vendor[] }[]; idPrefix?: string }) {
  if (groups.length === 0) return <p className="hint">No vendors match.</p>;
  return (
    <>
      <AlphaNav letters={groups.map((g) => g.letter)} idPrefix={idPrefix} />
      <section className="index">
        {groups.map(({ letter, items }) => (
          <div key={letter} className="index-group">
            <h2 id={`${idPrefix}-${letter}`}>{letter}</h2>
            <ul>
              {items.map((v) => (
                <li key={v.slug}>
                  <a href={`/vendor/${v.slug}`}>{v.name}</a>
                  <span className="count"> · {v.products.length} product{v.products.length === 1 ? "" : "s"}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}

export default function Home() {
  const verifiedProducts = products.filter(hasVerifiedCred);
  const verifiedSlugs = new Set(verifiedProducts.map((p) => p.slug));
  const verifiedVendors = vendors
    .map((v) => ({ ...v, products: v.products.filter((p) => verifiedSlugs.has(p.slug)) }))
    .filter((v) => v.products.length > 0);

  const productGroups = groupByLetter(products, (p) => p.product);
  const verifiedProductGroups = groupByLetter(verifiedProducts, (p) => p.product);
  const vendorGroups = groupByLetter(vendors, (v) => v.name);
  const verifiedVendorGroups = groupByLetter(verifiedVendors, (v) => v.name);

  return (
    <>
      <p className="muted" style={{ marginTop: 0 }}>
        Public default credentials for pentesters and CTF players. {products.length} products · {vendors.length} vendors.
      </p>

      <IndexToggle
        productsView={<ProductsIndex groups={productGroups} idPrefix="p" />}
        vendorsView={<VendorsIndex groups={vendorGroups} idPrefix="v" />}
        productsViewVerified={<ProductsIndex groups={verifiedProductGroups} idPrefix="pv" />}
        vendorsViewVerified={<VendorsIndex groups={verifiedVendorGroups} idPrefix="vv" />}
        verifiedCount={verifiedProducts.length}
      />
    </>
  );
}
