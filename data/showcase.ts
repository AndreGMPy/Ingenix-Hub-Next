export type ShowcaseItem = {
  slug: string; title: string; category: string; color: string; href: string;
  /** Poster vertical 472×1024 (primer cuadro del video): pantalla mientras el video no corre. */ screen: string;
  /** Recorrido vertical del sitio (~270×580, 6–9 s, sin audio) que se reproduce en la pantalla del celular. */ video: string;
};
// Orden del giro en el hero. Posters: node scripts/capture-portfolio.mjs posters
const item = (slug: string, title: string, category: string, color: string, href: string): ShowcaseItem =>
  ({ slug, title, category, color, href, screen: `/projects/videos/${slug}.webp`, video: `/projects/videos/${slug}.mp4` });
export const showcase: readonly ShowcaseItem[] = [
  item("ambar-cafe", "Ámbar Café", "Cafetería · Demo", "#c98a3c", "https://ambar-cafe-demo.vercel.app"),
  item("brasa-burgers", "Brasa Burgers", "Restaurante · Demo", "#f0a21a", "https://brasa-burgers-demo.vercel.app"),
  item("aura-travel", "Aura Travel", "Agencia de viajes · Demo", "#0f8fa3", "https://aura-travel-demo.vercel.app"),
  item("gama-studio", "Gama Studio", "Sitio corporativo", "#b98a5e", "https://gamastudiomx.com"),
  item("kroma-studio", "Kroma Studio", "Tienda streetwear · Demo", "#5b6b8a", "https://kroma-studio-demo.vercel.app"),
];
