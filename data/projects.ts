export type Project = {
  slug: string; title: string; category: string; summary: string;
  description: string; image: string; width: number; height: number;
  domain: string; href: string; technologies: readonly string[];
  scope: readonly string[]; kind: "project" | "demo";
};
/* Portafolio: proyectos del celular del inicio + demos interactivos de PORTAFOLIO.md. Los demos son marcas ficticias con fotografía generada con IA, alojadas en Vercel.
   Común a todas: diseño responsivo, pedidos por WhatsApp con mensaje prellenado e imágenes optimizadas.
   Capturas: node scripts/capture-portfolio.mjs (1872×915 WebP). */
const SHOT = { width: 1872, height: 915 } as const;
const common = ["Diseño responsivo", "Pedidos por WhatsApp con mensaje prellenado", "Imágenes optimizadas"] as const;
const demo = (slug: string, title: string, category: string, summary: string, description: string, host: string, technologies: readonly string[], scope: readonly string[], shared: readonly string[] = common): Project =>
  ({ slug, title, category, summary, description, image: `/projects/${slug}.webp`, ...SHOT, domain: host, href: "https://" + host, technologies, scope: [...scope, ...shared], kind: "demo" });
export const projects: readonly Project[] = [
  demo("ambar-cafe", "Ámbar Café", "Cafetería", "Una cafetería que se antoja desde el celular.",
    "Un sitio para una cafetería con menú, ubicación y animación al desplazar, pensado para verse desde el teléfono.",
    "ambar-cafe-demo.vercel.app", [], ["Menú", "Cómo llegar", "Animación con scroll"], []),
  demo("brasa-burgers", "Brasa Burgers", "Restaurante de hamburguesas", "El menú entra por los ojos.",
    "Un sitio para una hamburguesería con secciones de menú y producto animado al desplazar.",
    "brasa-burgers-demo.vercel.app", [], ["Menú por secciones", "Animación con scroll"], []),
  demo("aura-travel", "Aura Travel", "Agencia de viajes", "Destinos que se recorren al desplazar.",
    "Un sitio para una agencia de viajes que presenta destinos y paquetes con escenas animadas y lleva a cotizar el viaje.",
    "aura-travel-demo.vercel.app", [], ["Destinos y paquetes", "Animación con scroll"], []),
  { slug: "gama-studio", title: "Gama Studio MX", category: "Web · Estudio de fotografía y video", summary: "Una presencia digital con identidad.",
    description: "Un sitio corporativo para presentar los servicios de fotografía y video del estudio y facilitar la cotización.",
    image: "/projects/gama-studio.webp", ...SHOT, domain: "gamastudiomx.com", href: "https://gamastudiomx.com",
    technologies: ["Next.js", "React", "TypeScript"], scope: ["Presentación de servicios", "Identidad visual", "Cotización por WhatsApp"], kind: "project" },
  demo("kroma-studio", "KROMA STUDIO", "Tienda streetwear con carrito", "Streetwear con carrito de compra.",
    "Una tienda de streetwear donde el cliente arma su carrito y envía el pedido completo por WhatsApp.",
    "kroma-studio-demo.vercel.app", ["Next.js 16", "React 19", "TypeScript", "CSS a medida"], ["Catálogo de productos", "Carrito de compra"]),
  demo("noctis-archive", "NOCTIS ARCHIVE", "Catálogo streetwear oscuro", "Un catálogo con atmósfera propia.",
    "Un catálogo de streetwear con estética oscura, pensado para que la marca se sienta antes de leer el primer precio.",
    "noctis-archive-demo.vercel.app", ["Next.js 16 (export estático)", "React 19", "TypeScript", "Tailwind CSS 4", "Playwright"], ["Catálogo de productos", "Identidad visual oscura"]),
  demo("kairos-concept", "KAIROS CONCEPT", "Catálogo de moda urbana", "Moda urbana, ordenada para elegir.",
    "Un catálogo de moda urbana que presenta la colección y lleva cada producto a un pedido por WhatsApp.",
    "kairos-concept-demo.vercel.app", ["Next.js 16 (export estático)", "React 19", "TypeScript", "Tailwind CSS 4", "Playwright"], ["Catálogo de colección"]),
  demo("indigo-lab-denim", "ÍNDIGO LAB DENIM", "Catálogo de mezclilla · mayoreo y menudeo", "Mezclilla para mayoreo y menudeo.",
    "Un catálogo de mezclilla que atiende a clientes de mayoreo y de menudeo desde el mismo sitio.",
    "indigo-lab-denim-demo.vercel.app", ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"], ["Catálogo de mezclilla", "Mayoreo y menudeo"]),
  demo("aurea-studio", "AUREA STUDIO", "Boutique femenina editorial", "Una boutique con mirada editorial.",
    "Una boutique femenina presentada como revista: fotografía grande, colecciones y pedido directo.",
    "aurea-studio-demo.vercel.app", ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"], ["Presentación editorial", "Colecciones"]),
  demo("casa-ambar", "CASA ÁMBAR", "Tienda de ropa y temporada", "Ropa de temporada, lista para pedir.",
    "Una tienda de ropa organizada por temporada, hecha sin framework y generada como sitio estático.",
    "casa-ambar-demo-seven.vercel.app", ["HTML", "CSS", "JavaScript vanilla", "Generador estático en Node.js"], ["Catálogo por temporada"]),
  demo("lumina-derma", "LUMINA DERMA CLINIC", "Clínica de estética médica", "Tratamientos claros, citas a un mensaje.",
    "Un sitio para una clínica de estética médica que explica tratamientos y lleva a agendar por WhatsApp.",
    "lumina-derma-demo.vercel.app", ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Lucide Icons"], ["Catálogo de tratamientos", "Contacto para citas"]),
  demo("atelier-vertice", "ATELIER VÉRTICE", "Boutique de alta moda", "Alta moda con espacio para respirar.",
    "Una boutique de alta moda con una presentación sobria que deja el protagonismo a las prendas.",
    "atelier-vertice-demo.vercel.app", ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"], ["Presentación de colección", "Boutique"]),
  demo("proforma-textil", "PROFORMA TEXTIL", "Uniformes empresariales", "Uniformes para empresas, sin vueltas.",
    "Un sitio para un fabricante de uniformes empresariales que presenta su línea y recibe solicitudes de cotización.",
    "proforma-textil-demo.vercel.app", ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Lucide Icons"], ["Catálogo de uniformes", "Solicitud de cotización"]),
];

/* Casos de estudio (/portafolio/[slug]). Son demos: "reto" = lo que la demo debía demostrar. Sin métricas ni clientes inventados. */
export type CaseDetail = { challenge: string; solution: string; alt: string };
export const caseDetails: Record<string, CaseDetail> = {
  "ambar-cafe": {
    challenge: "Mostrar cómo una cafetería puede despertar el antojo antes de que el cliente llegue: menú claro y ubicación a un toque.",
    solution: "Un sitio con menú, botón para llegar y productos que se animan al desplazar, sin perder velocidad en el celular.",
    alt: "Página de inicio del demo Ámbar Café, cafetería con menú y animación",
  },
  "brasa-burgers": {
    challenge: "Hacer que el menú de una hamburguesería se vea tan bien como se come, y que se navegue rápido.",
    solution: "Un sitio con menú por secciones y la hamburguesa como protagonista animada con el scroll.",
    alt: "Página de inicio del demo Brasa Burgers, hamburguesería con menú por secciones",
  },
  "aura-travel": {
    challenge: "Presentar destinos de viaje de forma que inviten a imaginarse ahí y a pedir una cotización.",
    solution: "Un sitio con escenas animadas por destino, paquetes y llamada a cotizar el viaje.",
    alt: "Página de inicio del demo Aura Travel, agencia de viajes con destinos animados",
  },
  "gama-studio": {
    challenge: "Un estudio de fotografía y video necesitaba una presencia propia que transmitiera su estilo y convirtiera visitas en solicitudes de cotización.",
    solution: "Un sitio corporativo que presenta los servicios y el portafolio visual con la identidad del estudio, y lleva cada visita a cotizar por WhatsApp.",
    alt: "Sitio web de Gama Studio MX con servicios de fotografía y video",
  },
  "kroma-studio": {
    challenge: "Mostrar que una marca de ropa puede vender en línea sin pasarela de pago: el cliente elige, arma su carrito y el pedido llega listo por WhatsApp.",
    solution: "Catálogo con carrito de compra que convierte la selección en un mensaje de WhatsApp prellenado con productos y cantidades.",
    alt: "Página de inicio del demo KROMA STUDIO, tienda de streetwear con carrito",
  },
  "noctis-archive": {
    challenge: "Probar que un catálogo puede transmitir la personalidad de una marca de streetwear oscura sin sacrificar velocidad.",
    solution: "Un catálogo exportado como sitio estático, con estética oscura y pruebas automatizadas con Playwright.",
    alt: "Página de inicio del demo NOCTIS ARCHIVE, catálogo de streetwear con estética oscura",
  },
  "kairos-concept": {
    challenge: "Ordenar una colección de moda urbana para que el cliente encuentre rápido lo que busca desde el celular.",
    solution: "Un catálogo estático y ligero, probado con Playwright, con pedido por WhatsApp desde cada producto.",
    alt: "Página de inicio del demo KAIROS CONCEPT, catálogo de moda urbana",
  },
  "indigo-lab-denim": {
    challenge: "Atender en un mismo sitio a quien compra una pieza y a quien compra por mayoreo, algo común en los negocios de mezclilla de la región.",
    solution: "Un catálogo de mezclilla que distingue mayoreo y menudeo y envía cada solicitud por WhatsApp.",
    alt: "Página de inicio del demo ÍNDIGO LAB DENIM, catálogo de mezclilla para mayoreo y menudeo",
  },
  "aurea-studio": {
    challenge: "Presentar una boutique femenina con la calidad visual de una revista, sin que el sitio se vuelva pesado.",
    solution: "Un diseño editorial con fotografía grande, colecciones y contacto directo, con imágenes optimizadas.",
    alt: "Página de inicio del demo AUREA STUDIO, boutique femenina editorial",
  },
  "casa-ambar": {
    challenge: "Demostrar una tienda de ropa rápida y fácil de mantener sin depender de un framework.",
    solution: "HTML, CSS y JavaScript sin dependencias, generados como sitio estático con un script de Node.js.",
    alt: "Página de inicio del demo CASA ÁMBAR, tienda de ropa de temporada",
  },
  "lumina-derma": {
    challenge: "Explicar tratamientos de estética médica con claridad y llevar a la persona a agendar una valoración.",
    solution: "Un sitio con catálogo de tratamientos, íconos de apoyo y contacto por WhatsApp para citas.",
    alt: "Página de inicio del demo LUMINA DERMA CLINIC, clínica de estética médica",
  },
  "atelier-vertice": {
    challenge: "Comunicar exclusividad en una boutique de alta moda: menos elementos, más intención.",
    solution: "Una presentación sobria de la colección con pedido directo por WhatsApp.",
    alt: "Página de inicio del demo ATELIER VÉRTICE, boutique de alta moda",
  },
  "proforma-textil": {
    challenge: "Mostrar a compradores de empresas una línea de uniformes y facilitar que pidan cotización.",
    solution: "Un sitio con la línea de uniformes empresariales y solicitud de cotización por WhatsApp.",
    alt: "Página de inicio del demo PROFORMA TEXTIL, uniformes empresariales",
  },
};
export function projectBySlug(slug: string) { return projects.find(project => project.slug === slug); }
