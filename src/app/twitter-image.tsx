import { ImageResponse } from "next/og";

import { brandColors, company } from "@/constants/site";

export const alt = `${company.name} social preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: brandColors.navy,
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: 72,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 34, fontWeight: 800 }}>{company.name}</span>
          <span
            style={{
              background: brandColors.primary,
              borderRadius: 999,
              fontSize: 22,
              fontWeight: 800,
              padding: "12px 20px",
            }}
          >
            Courier services
          </span>
        </div>
        <h1
          style={{
            fontSize: 78,
            letterSpacing: 0,
            lineHeight: 1.04,
            margin: 0,
            maxWidth: 940,
          }}
        >
          Reliable delivery support for urgent and everyday shipments.
        </h1>
        <div
          style={{
            color: "#cbd5e1",
            display: "flex",
            fontSize: 26,
            gap: 26,
          }}
        >
          <span>Quotes</span>
          <span>Tracking</span>
          <span>Pickup planning</span>
          <span>Proof of delivery</span>
        </div>
      </div>
    ),
    size,
  );
}
