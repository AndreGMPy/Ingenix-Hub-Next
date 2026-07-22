export const whatsappNumber = "524451820808";

export const links = {
  diagnostic: "https://wa.me/524451820808?text=Hola%2C%20quiero%20un%20diagn%C3%B3stico%20para%20crear%20una%20p%C3%A1gina%20web%20o%20app%20para%20mi%20negocio.",
  quote: "https://wa.me/524451820808?text=Hola%2C%20quiero%20una%20cotizaci%C3%B3n%20personalizada%20para%20una%20p%C3%A1gina%20web%20o%20app%20para%20mi%20negocio.",
  contact: "https://wa.me/524451820808?text=Hola%2C%20quiero%20un%20diagn%C3%B3stico%20para%20mi%20proyecto%20web.",
  portfolioQuote: "https://wa.me/524451820808?text=Hola%2C%20vi%20tu%20portafolio%20y%20quiero%20cotizar%20un%20proyecto%20web.",
  portfolioFloat: "https://wa.me/524451820808?text=Hola%2C%20vi%20tu%20portafolio%20y%20quiero%20cotizar%20un%20proyecto.",
  calendly: "https://calendly.com/andregordillo9/30min",
  instagram: "https://www.instagram.com/ingenixhub?igsh=YjU4ZG5xMm5ocHM5&utm_source=qr",
  facebook: "https://www.facebook.com/share/18E1AF8CoZ/?mibextid=wwXIfr",
  linkedin: "https://www.linkedin.com/in/brandon-andre-gordillo-moreno-342403418/",
  email: "mailto:ingenixhub@gmail.com",
};

export type Project = {
  title: string;
  type: string;
  description: string;
  image: string;
  alt: string;
  browser: string;
  technologies: string[];
  href?: string;
};

export const projects: Project[] = [
  {
    title: "TextiBajío",
    type: "Directorio y plataforma web",
    description: "Plataforma para digitalizar negocios textiles con perfiles, catálogo y contacto directo.",
    image: "/images/textibajio.png",
    alt: "Vista previa de TextiBajío",
    browser: "textibajio.com",
    technologies: ["Firebase", "HTML", "CSS", "JavaScript"],
    href: "https://textibajio.com",
  },
  {
    title: "Gama Studio MX",
    type: "Sitio web corporativo",
    description: "Sitio profesional para presentar servicios, fortalecer marca y captar clientes con claridad.",
    image: "/images/gama-studio.png",
    alt: "Vista previa de Gama Studio MX",
    browser: "gamastudiomx.com",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    href: "https://gamastudiomx.com",
  },
  {
    title: "Cuellos Textiles Goar",
    type: "Catálogo y página web",
    description: "Página enfocada en mostrar productos textiles y facilitar el contacto comercial.",
    image: "/images/cuellos-textiles-goar.png",
    alt: "Vista previa de Cuellos Textiles Goar",
    browser: "cuellos-textiles-goar.vercel.app",
    technologies: ["HTML", "CSS", "Responsive", "Vercel"],
    href: "https://cuellos-textiles-goar.vercel.app",
  },
  {
    title: "Demo de Ventas Online",
    type: "Demo comercial",
    description: "Demo para mostrar catálogo, experiencia de compra y flujo de contacto comercial.",
    image: "/images/demo-tienda-online.png",
    alt: "Vista previa de Demo de Ventas Online",
    browser: "ejemplo-tienda-digital.vercel.app",
    technologies: ["Node.js", "JavaScript", "HTML/CSS", "Backend"],
    href: "https://ejemplo-tienda-digital.vercel.app",
  },
  {
    title: "Sistema de Control de Ventas",
    type: "App web privada",
    description: "Dashboard privado para ventas, gastos, ganancias, inventario y control del negocio.",
    image: "/images/damaris-dashboard.png",
    alt: "Vista previa de Sistema de Control de Ventas",
    browser: "app privada / dashboard",
    technologies: ["Next.js", "React", "PWA", "Dashboard"],
  },
];

export const services = [
  { code: "01 / WEB", title: "Páginas web profesionales", description: "Para negocios, marcas personales, talleres, estudios, consultorios o servicios que necesitan verse confiables." },
  { code: "02 / CAT", title: "Catálogos digitales", description: "Presenta productos, menús, paquetes o servicios con categorías, fotos y botones directos a WhatsApp." },
  { code: "03 / PWA", title: "Apps web y PWA", description: "Sistemas que funcionan desde navegador y pueden sentirse como app en el celular del negocio." },
  { code: "04 / CMS", title: "Paneles administrables", description: "Edita productos, precios, fotos, ventas, pedidos o contenido desde un panel privado." },
];

export const processSteps = [
  { number: "01", title: "Diagnóstico", description: "Me cuentas qué vendes, qué quieres lograr y qué problema quieres resolver." },
  { number: "02", title: "Alcance", description: "Definimos si necesitas web, catálogo, app, panel, formulario, pagos o automatización." },
  { number: "03", title: "Propuesta", description: "Te paso una cotización clara con entregables, tiempos y forma de trabajo." },
  { number: "04", title: "Lanzamiento", description: "Diseñamos, revisamos, publicamos y te explico cómo usar tu proyecto." },
];

export const faq = [
  { question: "¿Por qué la cotización es personalizada?", answer: "Porque cada proyecto cambia según secciones, contenido, funciones, panel, base de datos, pagos, automatizaciones o integraciones. Cotizar directo evita confusiones." },
  { question: "¿Qué necesito para cotizar?", answer: "Solo dime qué tipo de negocio tienes, qué quieres lograr, si tienes logo/fotos/textos y si necesitas mostrar productos, vender, recibir pedidos o administrar contenido." },
  { question: "¿La página se verá bien en celular?", answer: "Sí. El diseño se trabaja con enfoque mobile-first porque la mayoría de clientes entra desde el teléfono." },
  { question: "¿Puedo crecer el proyecto después?", answer: "Sí. Podemos iniciar con una web sencilla y luego agregar catálogo, panel, pagos, notificaciones o funciones especiales." },
];
