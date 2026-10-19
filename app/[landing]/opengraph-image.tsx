import { ImageResponse } from "next/og";
import { landingBySlug } from "@/data/landings";

export const alt = "Ingenix Hub · Páginas web y software en Guanajuato";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({ params }: { params: Promise<{ landing: string }> }) {
  const { landing } = await params;
  const item = landingBySlug(landing);
  const title = item?.h1 ?? "Ingenix Hub";
  const line = item?.ogLine ?? "";
  const tag = item?.kind === "city" ? "INGENIX HUB / " + item.city.toUpperCase() : "INGENIX HUB / SERVICIOS";
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 80, background: "linear-gradient(135deg,#f7f9fc 0%,#e6effc 100%)", color: "#10233f", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", fontSize: 24, color: "#075be8", letterSpacing: 5 }}>{tag}</div>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", fontSize: title.length > 48 ? 64 : 76, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>{title}</div>
      <div style={{ display: "flex", fontSize: 32, marginTop: 28, color: "#075be8" }}>{line}</div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#53647b" }}><span>ingenixhub.com</span><span>Moroleón · Uriangato · Salamanca · Irapuato</span></div>
  </div>, size);
}
