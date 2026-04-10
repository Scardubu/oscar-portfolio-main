import { ImageResponse } from "@vercel/og";
export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #09090e 0%, #0f0f17 100%)",
        padding: 80,
        position: "relative",
        fontFamily: "system-ui",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 80,
          right: 80,
          height: 2,
          background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.8),rgba(34,211,238,0.5),transparent)",
        }} />
        <div style={{
          fontSize: 12,
          color: "rgba(99,102,241,0.9)",
          letterSpacing: 6,
          textTransform: "uppercase",
          marginBottom: 20,
        }}>
          Staff Full-Stack ML Engineer
        </div>
        <div style={{
          fontSize: 68,
          fontWeight: 800,
          color: "rgba(255,255,255,0.92)",
          lineHeight: 1,
          marginBottom: 28,
        }}>
          Oscar Ndugbu (Scardubu)
        </div>
        <div style={{
          fontSize: 22,
          color: "rgba(255,255,255,0.52)",
          maxWidth: 680,
          lineHeight: 1.5,
          marginBottom: 48,
        }}>
          Production AI/fintech systems — credit scoring, blockchain analytics, ML consulting.
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["FastAPI", "XGBoost", "Redis", "Postgres", "Next.js", "MLflow"].map((tag) => (
            <div key={tag} style={{
              fontSize: 13,
              color: "rgba(34,211,238,0.85)",
              border: "1px solid rgba(34,211,238,0.18)",
              borderRadius: 6,
              padding: "4px 12px",
              background: "rgba(34,211,238,0.06)",
            }}>{tag}</div>
          ))}
        </div>
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.28)" }}>scardubu.dev</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.38)" }}>
              Available · Staff+ · Co-founder · Consulting
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
