import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import "./home.css";
import "./interactions.css";
import "./chat.css";
import "./v21.css";
import "./studio.css";
import "./refinement.css";
import "./brand-updates.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.ingenixhub.com"),
  title: { default: "Ingenix Hub | Estudio de software y producto digital", template: "%s | Ingenix Hub" },
  description: "Diseñamos y desarrollamos páginas web, e-commerce, aplicaciones, sistemas, automatizaciones e inteligencia artificial. Cotiza tu proyecto con Ingenix Hub.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "es_MX", siteName: "Ingenix Hub", title: "Ingenix Hub · Tu negocio. Bien conectado.", description: "Páginas web, tiendas en línea y software que conecta lo que tu negocio necesita.", url: "/", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Ingenix Hub · Estudio de software y producto digital" }] },
  twitter: { card: "summary_large_image", title: "Ingenix Hub · Estudio de producto digital", description: "Diseño, desarrollo y sistemas conectados.", images: ["/opengraph-image"] },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
};
export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover", interactiveWidget: "resizes-content",
  colorScheme: "light dark", themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f7f9fc" }, { media: "(prefers-color-scheme: dark)", color: "#080f1d" }],
};
const themeScript = `try { var t=localStorage.getItem('ingenix-v2-theme'); if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t; } catch(e) {}`;
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX" data-scroll-behavior="smooth" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body>{children}</body></html>;
}

