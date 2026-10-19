import type { Metadata, Viewport } from "next";
import { jsonLdScript, siteGraph } from "@/lib/schema";
import "@fontsource-variable/manrope";
import "./globals.css";
import "./home.css";
import "./interactions.css";
import "./chat.css";
import "./v21.css";
import "./studio.css";
import "./refinement.css";
import "./brand-updates.css";
import "./hero3d.css";
import "./landing.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.ingenixhub.com"),
  title: { default: "Ingenix Hub | Páginas web, tiendas en línea y software en Guanajuato", template: "%s | Ingenix Hub" },
  description: "Estudio de software y diseño en Moroleón, Guanajuato. Páginas web, tiendas en línea, sistemas, apps, automatización e IA para Moroleón, Uriangato, Salamanca, Irapuato y todo México.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "es_MX", siteName: "Ingenix Hub", title: "Ingenix Hub · Páginas web y software en Guanajuato", description: "Páginas web, tiendas en línea y software para negocios de Moroleón, Uriangato, Salamanca, Irapuato y todo México.", url: "/", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Ingenix Hub · Estudio de software y producto digital" }] },
  twitter: { card: "summary_large_image", title: "Ingenix Hub · Estudio de producto digital", description: "Diseño, desarrollo y sistemas conectados.", images: ["/opengraph-image"] },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
};
export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover", interactiveWidget: "resizes-content",
  colorScheme: "light dark", themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f7f9fc" }, { media: "(prefers-color-scheme: dark)", color: "#080f1d" }],
};
const themeScript = `document.documentElement.dataset.js='1';try { var t=localStorage.getItem('ingenix-v2-theme'); if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t; } catch(e) {}`;
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX" data-scroll-behavior="smooth" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(siteGraph())} /></body></html>;
}

