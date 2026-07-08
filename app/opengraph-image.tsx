import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "SGC Tech AI — Practitioner-Led Odoo & AI for UAE Mid-Market";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoData = await readFile(
    join(process.cwd(), "public", "sgc-logo.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(160deg, #0B0F14 0%, #101720 60%, #0B0F14 100%)",
          padding: "80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={160}
          height={160}
          style={{ marginBottom: 28 }}
        />
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.3em",
            color: "#6FA8C3",
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          Operator-Led · UAE Mid-Market
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: "#D4A574",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          SGC Tech AI
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#F4F1EA",
            textAlign: "center",
            marginTop: 32,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Practitioner-Led Odoo &amp; AI Implementation
        </div>
        <div
          style={{
            width: 220,
            height: 2,
            background: "#D4A574",
            marginTop: 48,
          }}
        />
        <div
          style={{
            fontSize: 24,
            color: "#F4F1EA",
            opacity: 0.7,
            marginTop: 32,
          }}
        >
          CPAs &amp; CIAs · Diagnosis-First · Fixed Price
        </div>
      </div>
    ),
    { ...size }
  );
}
