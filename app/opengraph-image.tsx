import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site-config";

export const runtime = "edge";
export const alt = "Zenith — Commercial & Retention Video Editing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090B",
          color: "#F4F4F6",
          padding: "52px 64px",
          position: "relative",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Subtle grid background accent lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Viewfinder Crop Corner Brackets (#D4AF37 Gold) */}
        {/* Top-Left */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            left: "32px",
            width: "36px",
            height: "36px",
            borderTop: "3px solid #D4AF37",
            borderLeft: "3px solid #D4AF37",
          }}
        />
        {/* Top-Right */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            right: "32px",
            width: "36px",
            height: "36px",
            borderTop: "3px solid #D4AF37",
            borderRight: "3px solid #D4AF37",
          }}
        />
        {/* Bottom-Left */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "32px",
            width: "36px",
            height: "36px",
            borderBottom: "3px solid #D4AF37",
            borderLeft: "3px solid #D4AF37",
          }}
        />
        {/* Bottom-Right */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            right: "32px",
            width: "36px",
            height: "36px",
            borderBottom: "3px solid #D4AF37",
            borderRight: "3px solid #D4AF37",
          }}
        />

        {/* Top Header Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#EF4444",
                boxShadow: "0 0 12px #EF4444",
              }}
            />
            <span
              style={{
                color: "#EF4444",
                fontSize: "15px",
                fontWeight: "800",
                fontFamily: "monospace",
                letterSpacing: "2px",
              }}
            >
              REC
            </span>
            <span
              style={{
                color: "rgba(255, 255, 255, 0.45)",
                fontFamily: "monospace",
                fontSize: "13px",
                marginLeft: "12px",
              }}
            >
              00:00:24:00 // 4K 60FPS · REC.709
            </span>
          </div>

          <div
            style={{
              color: "#D4AF37",
              fontFamily: "monospace",
              fontSize: "13px",
              letterSpacing: "3px",
              fontWeight: "700",
            }}
          >
            ZENITH POST-PRODUCTION VAULT
          </div>
        </div>

        {/* Center Main Stage Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            zIndex: 10,
            marginTop: "10px",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              color: "#D4AF37",
              fontFamily: "monospace",
              fontSize: "14px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            {siteConfig.brand.eyebrow || "ZENITH — VIDEO EDITING STUDIO"}
          </div>

          {/* Master Brand Headline */}
          <div
            style={{
              fontSize: "82px",
              fontWeight: "900",
              letterSpacing: "-2.5px",
              color: "#FFFFFF",
              lineHeight: 0.95,
              textTransform: "uppercase",
            }}
          >
            {siteConfig.brand.name}
          </div>

          {/* Tagline / Subtitle */}
          <div
            style={{
              fontSize: "26px",
              color: "rgba(255, 255, 255, 0.82)",
              maxWidth: "960px",
              lineHeight: 1.35,
              marginTop: "16px",
              fontWeight: "500",
            }}
          >
            Commercial Video Ads · High-Retention YouTube Cuts · 9:16 Vertical Reels
          </div>

          {/* Monospace Badge Strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(212, 175, 55, 0.12)",
                border: "1px solid rgba(212, 175, 55, 0.45)",
                color: "#D4AF37",
                padding: "8px 18px",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "14px",
                letterSpacing: "2px",
                fontWeight: "700",
              }}
            >
              [ COMMERCIALS // YOUTUBE // 9:16 REELS // MOTION ]
            </div>
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "rgba(255, 255, 255, 0.7)",
                padding: "8px 16px",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "13px",
              }}
            >
              FOLEY AUDIO & COLOR GRADE
            </div>
          </div>
        </div>

        {/* Bottom Timeline & Playhead Motif */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            zIndex: 10,
          }}
        >
          {/* Simulated Multi-Track Timeline Stage */}
          <div
            style={{
              width: "100%",
              height: "44px",
              backgroundColor: "#121216",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "6px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              padding: "0 8px",
              gap: "6px",
            }}
          >
            {/* Cut segment 1 */}
            <div
              style={{
                height: "26px",
                flex: "0 0 160px",
                backgroundColor: "rgba(212, 175, 55, 0.35)",
                borderRadius: "3px",
                border: "1px solid rgba(212, 175, 55, 0.6)",
              }}
            />
            {/* Cut segment 2 */}
            <div
              style={{
                height: "26px",
                flex: "0 0 240px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "3px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            />
            {/* Cut segment 3 */}
            <div
              style={{
                height: "26px",
                flex: "0 0 190px",
                backgroundColor: "rgba(212, 175, 55, 0.25)",
                borderRadius: "3px",
                border: "1px solid rgba(212, 175, 55, 0.5)",
              }}
            />
            {/* Cut segment 4 */}
            <div
              style={{
                height: "26px",
                flex: "1",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: "3px",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            />

            {/* Glowing Golden Playhead Cursor */}
            <div
              style={{
                position: "absolute",
                left: "480px",
                top: 0,
                bottom: 0,
                width: "3px",
                backgroundColor: "#D4AF37",
                boxShadow: "0 0 14px #D4AF37, 0 0 4px #D4AF37",
              }}
            />
            {/* Playhead Top Scrubber Cap */}
            <div
              style={{
                position: "absolute",
                left: "474px",
                top: "2px",
                width: "15px",
                height: "10px",
                backgroundColor: "#D4AF37",
                borderRadius: "2px",
              }}
            />
          </div>

          {/* Track Labels & Studio URL */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "12px",
            }}
          >
            <div
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "monospace",
                fontSize: "12px",
                letterSpacing: "1px",
              }}
            >
              V1: HERO MASTER · V2: KINETIC GFX · A1: 48kHz FOLEY ARCHITECTURE
            </div>

            <div
              style={{
                color: "#D4AF37",
                fontFamily: "monospace",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "1px",
              }}
            >
              zenithdigitalstudio.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
