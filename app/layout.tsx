import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import SearchBox from "./SearchBox";

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
          <SearchBox />
          <nav>
            <a href="/api/products">API</a>
            <a href="https://github.com/maxvaer/default-credentials" target="_blank" rel="noreferrer">Data</a>
            <a href="https://github.com/maxvaer/default-credentials-app" target="_blank" rel="noreferrer">App</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p className="disclaimer">
            <strong>For authorized use only.</strong> This catalog of public default credentials is provided for
            pentesting engagements, CTF challenges, security research, and the operators of systems you own or have
            written permission to test. Using these credentials against systems you do not own or are not authorized
            to test is illegal in most jurisdictions and unethical everywhere.
          </p>
          <nav className="footer-nav">
            <a href="/impressum">Impressum</a>
            <span aria-hidden="true">·</span>
            <a href="/datenschutz">Datenschutz</a>
            <span aria-hidden="true">·</span>
            <a href="https://github.com/maxvaer/default-credentials" target="_blank" rel="noreferrer">Data repo</a>
          </nav>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
