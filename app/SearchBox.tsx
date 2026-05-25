"use client";

import { useEffect, useRef, useState } from "react";

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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const showDropdown = open && q.trim().length > 0;

  return (
    <div className="search-wrap" ref={wrapRef}>
      <input
        className="search-box"
        placeholder="Search products, vendors, usernames…"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
      />
      {showDropdown && (
        <div className="search-dropdown" role="listbox">
          {results.length > 0 ? (
            results.map((r) => (
              <a key={r.slug} href={`/product/${r.slug}`} className="result">
                <span>
                  <span className="product">{r.product}</span>
                  {r.vendor && <span className="pill" style={{ marginLeft: "0.6rem" }}>{r.vendor}</span>}
                </span>
                <span className="count">{r.credentialCount} cred{r.credentialCount === 1 ? "" : "s"}</span>
              </a>
            ))
          ) : (
            !loading && <p className="hint" style={{ margin: "0.5rem 0.8rem" }}>No matches.</p>
          )}
        </div>
      )}
    </div>
  );
}
