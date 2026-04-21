import { ImageResponse } from "next/og";

import { brandColors, company } from "@/constants/site";

export const alt = `${company.name} courier and delivery services`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: brandColors.background,
          color: brandColors.navy,
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: 72,
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: `2px solid ${brandColors.border}`,
            borderRadius: 36,
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
            display: "flex",
            flexDirection: "column",
            gap: 26,
            height: "100%",
            justifyContent: "space-between",
            padding: 56,
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div
                style={{
                  alignItems: "center",
                  background: brandColors.primary,
                  borderRadius: 20,
                  color: "#ffffff",
                  display: "flex",
                  fontSize: 34,
                  fontWeight: 800,
                  height: 64,
                  justifyContent: "center",
                  width: 64,
                }}
              >
                A
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 30, fontWeight: 800 }}>
                  {company.name}
                </span>
                <span style={{ color: brandColors.muted, fontSize: 22 }}>
                  {company.tagline}
                </span>
              </div>
            </div>
            <span
              style={{
                background: "#fff4ee",
                borderRadius: 999,
                color: brandColors.primary,
                fontSize: 22,
                fontWeight: 800,
                padding: "12px 20px",
              }}
            >
              Courier operations
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <h1
              style={{
                fontSize: 76,
                letterSpacing: 0,
                lineHeight: 1.02,
                margin: 0,
                maxWidth: 900,
              }}
            >
              Ship with confidence from pickup to proof of delivery.
            </h1>
            <p
              style={{
                color: brandColors.muted,
                fontSize: 30,
                lineHeight: 1.35,
                margin: 0,
                maxWidth: 920,
              }}
            >
              Clear quotes, dependable pickup windows, shipment tracking, and
              business courier support.
            </p>
          </div>

          <div
            style={{
              alignItems: "center",
              borderTop: `2px solid ${brandColors.border}`,
              color: brandColors.muted,
              display: "flex",
              fontSize: 24,
              justifyContent: "space-between",
              paddingTop: 28,
            }}
          >
            <span>{company.coverage}</span>
            <span>{company.email}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
