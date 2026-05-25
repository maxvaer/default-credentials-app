"use client";

import { useState } from "react";

export default function CopyChip({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const display = label ?? value;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard API may be unavailable (http context, sandbox); silently no-op
    }
  };

  return (
    <button
      type="button"
      className={`copy-chip${copied ? " copied" : ""}`}
      onClick={handleClick}
      aria-label={`Copy ${value}`}
      title="Click to copy"
    >
      <code>{display}</code>
      <span className="copy-chip-status" aria-hidden="true">{copied ? "copied" : ""}</span>
    </button>
  );
}
