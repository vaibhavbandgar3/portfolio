import { ImageResponse } from "next/og";
import { profile } from "@/data";

export const alt = `${profile.name} — ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card, generated at build time from the profile data. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background:
          "radial-gradient(60% 80% at 85% 20%, rgba(79,140,255,0.35), transparent 60%), radial-gradient(50% 60% at 10% 100%, rgba(139,123,255,0.22), transparent 60%), #07080b",
        color: "#f2f4f8",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#a3abbb" }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "linear-gradient(135deg, #4f8cff, #22d3ee)",
          }}
        />
        {profile.availability}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>{profile.name}</div>
        <div
          style={{
            fontSize: 44,
            marginTop: 12,
            backgroundImage: "linear-gradient(90deg, #9cc2ff, #22d3ee)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {profile.headline}
        </div>
      </div>
      <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#7c8496" }}>
        {profile.focusAreas.map((a) => (
          <div
            key={a}
            style={{
              display: "flex",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 999,
              padding: "8px 20px",
            }}
          >
            {a}
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
