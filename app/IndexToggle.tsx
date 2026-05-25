"use client";

import { useState, type ReactNode } from "react";

export default function IndexToggle({
  productsView,
  vendorsView,
  productsViewVerified,
  vendorsViewVerified,
  verifiedCount,
}: {
  productsView: ReactNode;
  vendorsView: ReactNode;
  productsViewVerified: ReactNode;
  vendorsViewVerified: ReactNode;
  verifiedCount: number;
}) {
  const [mode, setMode] = useState<"products" | "vendors">("products");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const view =
    mode === "products"
      ? (verifiedOnly ? productsViewVerified : productsView)
      : (verifiedOnly ? vendorsViewVerified : vendorsView);

  return (
    <>
      <div className="index-controls">
        <div className="index-toggle" role="tablist">
          <button
            role="tab"
            aria-selected={mode === "products"}
            className={mode === "products" ? "active" : ""}
            onClick={() => setMode("products")}
          >
            Products
          </button>
          <button
            role="tab"
            aria-selected={mode === "vendors"}
            className={mode === "vendors" ? "active" : ""}
            onClick={() => setMode("vendors")}
          >
            Vendors
          </button>
        </div>

        <label className="verified-toggle">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
          />
          <span>Verified only · {verifiedCount}</span>
        </label>
      </div>

      {view}
    </>
  );
}
