export const site = {
  name: "Ingenix Hub",
  domain: "https://www.ingenixhub.com",
  phone: "+52 493 263 6339",
  telephone: "tel:+524932636339",
  email: "ingenixhub@gmail.com",
  whatsapp: "https://wa.me/524932636339",
  quote: "https://wa.me/524932636339?text=Hola%2C%20quiero%20cotizar%20un%20proyecto%20con%20Ingenix%20Hub.",
  instagram: "https://www.instagram.com/ingenixhub",
  facebook: "https://www.facebook.com/share/18E1AF8CoZ/",
} as const;

export type CapabilityId = "web" | "commerce" | "systems" | "apps" | "automation" | "ai";
export type Capability = {
  id: CapabilityId; number: string; name: string; short: string;
  title: string; description: string; includes: readonly string[];
};
export const capabilities: readonly Capability[] = [
  { id: "web", number: "01", name: "Páginas web", short: "Tu primera impresión, bien hecha.", title: "Una web a la altura de tu negocio.", description: "Presenta lo que haces con claridad. Una página rápida, diseñada para tu marca y para las personas que la visitan.", includes: ["Diseño a medida", "Contacto directo", "SEO y rendimiento"] },
  { id: "commerce", number: "02", name: "E-commerce", short: "Del catálogo al pedido.", title: "Tu tienda, abierta y conectada.", description: "Catálogos digitales y tiendas en línea con productos, carrito, pagos y un panel para administrar la operación.", includes: ["Catálogo y búsqueda", "Carrito y pagos", "Gestión de pedidos"] },
  { id: "systems", number: "03", name: "Sistemas web", short: "Menos hojas sueltas. Más control.", title: "Software para tu forma de trabajar.", description: "Centraliza productos, clientes, pedidos o información en un sistema que responda a tus procesos.", includes: ["Paneles administrativos", "Roles y permisos", "Bases de datos"] },
  { id: "apps", number: "04", name: "Apps web / PWA", short: "Tu herramienta, donde la necesitas.", title: "La experiencia de una app. En la web.", description: "Aplicaciones que funcionan desde el navegador y pueden instalarse en el teléfono. Acceso rápido para tu equipo o tus clientes.", includes: ["Experiencia móvil", "Instalación PWA", "Funciones a medida"] },
  { id: "automation", number: "05", name: "Automatización", short: "Conecta lo que hoy haces a mano.", title: "Que los procesos sigan su curso.", description: "Conectamos formularios, pedidos, notificaciones y herramientas para reducir tareas repetitivas, según las integraciones disponibles.", includes: ["Flujos de trabajo", "Integración de herramientas", "Notificaciones"] },
  { id: "ai", number: "06", name: "Inteligencia artificial", short: "IA con una tarea concreta.", title: "Una nueva forma de atender y operar.", description: "Asistentes y herramientas de IA que ayudan a entender consultas, organizar información y orientar a las personas.", includes: ["Asistentes virtuales", "Análisis de información", "Flujos con IA"] },
];

export const architecture = [
  { number: "01", name: "Negocio", label: "El punto de partida", description: "Entendemos qué necesitas resolver y cómo trabajas hoy.", tags: ["Objetivo", "Personas", "Proceso"] },
  { number: "02", name: "Interfaz", label: "Lo que tu cliente ve", description: "Diseñamos una experiencia clara, tanto en un teléfono como en una computadora.", tags: ["Diseño", "Experiencia móvil"] },
  { number: "03", name: "Software / API", label: "Lo que hace que funcione", description: "Convertimos las funciones en lógica y conectamos los sistemas que tu proyecto necesita.", tags: ["Lógica", "Integraciones"] },
  { number: "04", name: "Datos", label: "Información con estructura", description: "Organizamos la información y definimos quién puede consultarla o modificarla.", tags: ["Base de datos", "Permisos"] },
  { number: "05", name: "Automatización", label: "Menos trabajo repetitivo", description: "Un evento puede iniciar el siguiente paso: un pedido, una notificación o una actualización.", tags: ["Eventos", "Flujos"] },
  { number: "06", name: "Inteligencia artificial", label: "Cuando aporta valor", description: "Integramos IA donde ayuda a interpretar información o atender consultas.", tags: ["Asistentes", "Análisis"] },
  { number: "07", name: "Resultado", label: "Una herramienta útil", description: "Un producto que puedes usar, administrar y hacer crecer con tu negocio.", tags: ["Operación", "Evolución"] },
] as const;

export const processSteps = [
  { title: "Idea", description: "Nos cuentas qué quieres crear." },
  { title: "Diagnóstico", description: "Definimos el problema y el alcance." },
  { title: "Diseño", description: "Damos forma a la experiencia." },
  { title: "Desarrollo", description: "Construimos y conectamos las piezas." },
  { title: "Pruebas", description: "Revisamos funciones y dispositivos." },
  { title: "Lanzamiento", description: "Lo ponemos en marcha contigo." },
] as const;

