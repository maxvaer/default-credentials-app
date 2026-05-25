"use client";

import { useState, type ReactNode } from "react";

export default function IndexToggle({
  productsView,
  vendorsView,
}: {
  productsView: ReactNode;
  vendorsView: ReactNode;
}) {
  const [mode, setMode] = useState<"products" | "vendors">("products");
  return (
    <>
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
      {mode === "products" ? productsView : vendorsView}
    </>
  );
}
