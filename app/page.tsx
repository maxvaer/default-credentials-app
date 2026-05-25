import { products, vendors, type Product, type Vendor } from "@/lib/index";
import SearchBox from "./SearchBox";
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

function AlphaNav({ letters, idPrefix }: { letters: string[]; idPrefix: string }) {
  return (
    <div className="alpha-nav">
      {letters.map((l) => (
        <a key={l} href={`#${idPrefix}-${l}`}>{l}</a>
      ))}
    </div>
  );
}

function ProductsIndex({ groups }: { groups: { letter: string; items: Product[] }[] }) {
  return (
    <>
      <AlphaNav letters={groups.map((g) => g.letter)} idPrefix="p" />
      <section className="index">
        {groups.map(({ letter, items }) => (
          <div key={letter} className="index-group">
            <h2 id={`p-${letter}`}>{letter}</h2>
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

function VendorsIndex({ groups }: { groups: { letter: string; items: Vendor[] }[] }) {
  return (
    <>
      <AlphaNav letters={groups.map((g) => g.letter)} idPrefix="v" />
      <section className="index">
        {groups.map(({ letter, items }) => (
          <div key={letter} className="index-group">
            <h2 id={`v-${letter}`}>{letter}</h2>
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
  const productGroups = groupByLetter(products, (p) => p.product);
  const vendorGroups = groupByLetter(vendors, (v) => v.name);

  return (
    <>
      <h1>default-credentials</h1>
      <p className="muted">
        Public default credentials for pentesters and CTF players. {products.length} products · {vendors.length} vendors.
      </p>

      <SearchBox />

      <IndexToggle
        productsView={<ProductsIndex groups={productGroups} />}
        vendorsView={<VendorsIndex groups={vendorGroups} />}
      />
    </>
  );
}
