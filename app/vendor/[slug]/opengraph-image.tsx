import { ImageResponse } from "next/og";
import { vendors, vendorsBySlug } from "@/lib/index";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return vendors.map((v) => ({ slug: v.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vendor = vendorsBySlug.get(slug);
  const title = vendor ? `${vendor.name} default credentials` : "Default Credentials";
  const sub = vendor
    ? `${vendor.products.length} product${vendor.products.length === 1 ? "" : "s"}`
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0e1a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", marginBottom: "32px" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5fd5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div style={{ color: "#e6eaf2", fontSize: "62px", fontWeight: 700, lineHeight: 1.15, marginBottom: "28px", display: "flex", maxWidth: "1000px" }}>
          {title}
        </div>
        {sub ? (
          <div style={{ color: "#7a8599", fontSize: "28px", marginBottom: "52px", display: "flex" }}>
            {sub}
          </div>
        ) : null}
        <div style={{ color: "#5fd5ff", fontSize: "22px", display: "flex" }}>
          credentials.pentesting-labs.com
        </div>
      </div>
    ),
    { ...size },
  );
}
