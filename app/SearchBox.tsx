"use client";

import { useEffect, useState } from "react";

type Result = {
  slug: string;
  product: string;
  vendor?: string;
  score: number;
  credentialCount: number;
};

export default function SearchBox() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data) => setResults(data.results ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [q]);

  return (
    <>
      <input
        className="search-box"
        autoFocus
        placeholder="e.g. tomcat, cisco, mongodb"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {q.trim() && (
        <div className="results">
          {results.map((r) => (
            <a key={r.slug} href={`/product/${r.slug}`} className="result">
              <span>
                <span className="product">{r.product}</span>
                {r.vendor && <span className="pill" style={{ marginLeft: "0.6rem" }}>{r.vendor}</span>}
              </span>
              <span className="count">{r.credentialCount} cred{r.credentialCount === 1 ? "" : "s"}</span>
            </a>
          ))}
          {!loading && results.length === 0 && (
            <p className="hint">No matches. Got data? Open a PR against the data repo.</p>
          )}
        </div>
      )}
    </>
  );
}
