import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "default-credentials",
  description: "Searchable database of public default credentials for pentesters and CTF players.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <a href="/" className="brand" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "var(--accent)" }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            default-credentials
          </a>
          <nav>
            <a href="/">Browse</a>
            <a href="/api/products">API</a>
            <a href="https://github.com/maxvaer/default-credentials" target="_blank" rel="noreferrer">Data</a>
            <a href="https://github.com/maxvaer/default-credentials-app" target="_blank" rel="noreferrer">App</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <small>
            Data: <a href="https://github.com/maxvaer/default-credentials">maxvaer/default-credentials</a>.
            Initial seed from <a href="https://cirt.net/passwords">CIRT.net</a>.
          </small>
        </footer>
      </body>
    </html>
  );
}
