import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ingenixhub.com"),
  title: {
    default: "Ingenix Hub | Páginas web, catálogos y apps para negocios",
    template: "%s | Ingenix Hub",
  },
  description: "Ingenix Hub crea páginas web, catálogos digitales, apps web, paneles administrables y sistemas personalizados para negocios que quieren verse profesionales y conseguir más clientes.",
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Ingenix Hub",
    title: "Ingenix Hub | Soluciones digitales para negocios",
    description: "Páginas web, catálogos, apps y sistemas con diseño profesional, rendimiento y enfoque comercial.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1f52",
};

const themeScript = `
try {
  if (localStorage.getItem('ingenix-theme') === 'dark') document.body.classList.add('dark-mode');
} catch (_) {}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
