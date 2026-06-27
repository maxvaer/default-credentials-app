import { ImageResponse } from "next/og";

export const alt = "Default Credentials — searchable database for pentesters";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        <div style={{ display: "flex", marginBottom: "36px" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#5fd5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div style={{ color: "#e6eaf2", fontSize: "72px", fontWeight: 700, lineHeight: 1.1, marginBottom: "28px", display: "flex" }}>
          Default Credentials
        </div>
        <div style={{ color: "#7a8599", fontSize: "30px", marginBottom: "56px", display: "flex" }}>
          1039 products · 567 vendors · free JSON API
        </div>
        <div style={{ color: "#5fd5ff", fontSize: "22px", display: "flex" }}>
          credentials.pentesting-labs.com
        </div>
      </div>
    ),
    { ...size },
  );
}
