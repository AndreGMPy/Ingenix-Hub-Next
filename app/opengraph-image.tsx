import { ImageResponse } from "next/og";
export const runtime = "nodejs";
export const alt = "Ingenix Hub · Tu negocio. Bien conectado.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", padding: 80, background: "#f7f9fc", color: "#10233f", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", fontSize: 24, color: "#075be8", letterSpacing: 5, marginBottom: 32 }}>INGENIX HUB / DIGITAL PRODUCT STUDIO</div>
    <div style={{ display: "flex", fontSize: 86, fontWeight: 700 }}>Tu negocio.</div><div style={{ display: "flex", fontSize: 86, fontWeight: 700, color: "#075be8" }}>Bien conectado.</div>
    <div style={{ display: "flex", fontSize: 24, marginTop: 40 }}>Web · E-commerce · Software · Automatización · IA</div>
  </div>, size);
}

