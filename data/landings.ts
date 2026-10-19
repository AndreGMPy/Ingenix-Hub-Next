import type { CitySlug } from "./site";

/* Páginas de servicio y de ciudad. Sin precios ni tiempos exactos: dependen del alcance y la cotización es gratis. */
export type Faq = { q: string; a: string };
export type Block = { title: string; text: string };
export type ServiceSlug = "paginas-web" | "tiendas-en-linea" | "sistemas-web" | "apps-pwa" | "automatizacion" | "inteligencia-artificial" | "experiencias-inmersivas";
export type ServiceLanding = {
  kind: "service"; slug: ServiceSlug; name: string; metaTitle: string; description: string; ogLine: string;
  h1: string; lead: string; includes: readonly Block[]; forWhom: readonly string[]; problems: readonly Block[];
  projects: readonly string[]; projectsNote?: string; faqs: readonly Faq[];
};
export type CityLanding = {
  kind: "city"; slug: CitySlug; city: string; metaTitle: string; description: string; ogLine: string;
  h1: string; lead: string; economy: readonly Block[]; howWeHelp: readonly Block[];
  projects: readonly string[]; projectsNote: string; nearby: string; faqs: readonly Faq[];
};

const QUOTE = "Depende del alcance: no es lo mismo una página de presentación que una tienda con pagos o un sistema a la medida. El diagnóstico y la cotización son gratis; te enviamos una propuesta con lo que incluye antes de empezar.";
const TIME = "Depende de las funciones y de qué tan listos estén los textos y las fotos. En el diagnóstico definimos etapas y fechas de entrega para tu proyecto concreto.";

export const services: readonly ServiceLanding[] = [
  {
    kind: "service", slug: "paginas-web", name: "Páginas web",
    metaTitle: "Páginas web para negocios en Moroleón y Guanajuato",
    description: "Diseño y desarrollo de páginas web rápidas y a la medida para negocios de Moroleón, Uriangato, Salamanca, Irapuato y todo Guanajuato. Cotización gratis.",
    ogLine: "Tu negocio, bien presentado en la web.",
    h1: "Páginas web para negocios en Moroleón y Guanajuato",
    lead: "Una página que explica lo que haces, se ve bien en el celular y lleva a tus clientes a escribirte. Diseñada para tu marca, no armada con una plantilla.",
    includes: [
      { title: "Diseño a medida", text: "Partimos de tu marca, tus colores y tus fotos. Cada sección tiene un propósito: presentar, convencer o llevar al contacto." },
      { title: "Pensada para el celular", text: "La mayoría de tus visitas llegan desde un teléfono. Probamos cada página en pantallas pequeñas antes de entregarla." },
      { title: "Contacto directo", text: "Botones a WhatsApp, llamada, correo o formulario, según cómo prefieras atender." },
      { title: "Base de SEO y velocidad", text: "Títulos, descripciones, datos estructurados e imágenes optimizadas para que Google entienda qué haces y dónde." },
    ],
    forWhom: ["Negocios que hoy sólo están en redes sociales", "Profesionistas y consultorios que necesitan explicar sus servicios", "Marcas que ya tienen página pero no les representa o no la pueden actualizar"],
    problems: [
      { title: "“Sólo tengo Facebook”", text: "Las redes son prestadas: cambian sus reglas y tu información se pierde entre publicaciones. Una página es tuya y aparece en Google." },
      { title: "“Mi página se ve vieja”", text: "Si carga lento o no se ve bien en el celular, la gente se va antes de leer. La rediseñamos con lo que ya funciona de tu negocio." },
      { title: "“Me preguntan siempre lo mismo”", text: "Horarios, ubicación, servicios y precios de referencia en un solo lugar que puedes compartir." },
    ],
    projects: ["aurea-studio", "lumina-derma", "atelier-vertice"],
    projectsNote: "Son demos con marcas ficticias.",
    faqs: [
      { q: "¿Cuánto cuesta una página web?", a: QUOTE },
      { q: "¿Cuánto tiempo tarda?", a: TIME },
      { q: "¿Necesito tener dominio y hosting?", a: "No es necesario tenerlos antes. Te ayudamos a elegir y registrar el dominio a tu nombre y a publicar la página; el dominio siempre queda como tuyo." },
      { q: "¿Puedo hacer cambios después?", a: "Sí. Según el proyecto, puedes editar textos e imágenes tú mismo o pedirnos los cambios. Lo definimos desde la cotización." },
    ],
  },
  {
    kind: "service", slug: "tiendas-en-linea", name: "Tiendas en línea",
    metaTitle: "Tiendas en línea y e-commerce en Guanajuato",
    description: "Tiendas en línea con catálogo, carrito, pagos y panel de pedidos para negocios de Guanajuato y todo México. Diagnóstico y cotización gratis.",
    ogLine: "Del catálogo al pedido, en un solo lugar.",
    h1: "Tiendas en línea para negocios de Guanajuato",
    lead: "Tu catálogo abierto las 24 horas: el cliente elige, paga o te envía el pedido por WhatsApp, y tú lo administras desde un panel.",
    includes: [
      { title: "Catálogo y búsqueda", text: "Productos por categoría, tallas, colores y variantes, con fotos que se cargan rápido." },
      { title: "Carrito y pagos", text: "Pago con tarjeta mediante una pasarela como Stripe o Mercado Pago, o pedido por WhatsApp si así trabajas hoy." },
      { title: "Panel de administración", text: "Da de alta productos, cambia precios y revisa pedidos sin depender de nadie." },
      { title: "Listo para crecer", text: "Empezamos con lo necesario y agregamos inventario, envíos o reportes cuando el negocio lo pida." },
    ],
    forWhom: ["Tiendas de ropa y calzado que venden por mensajes", "Fabricantes y mayoristas que quieren mostrar su catálogo", "Negocios que ya venden en redes y necesitan ordenar sus pedidos"],
    problems: [
      { title: "Pedidos por mensaje", text: "Contestar fotos, tallas y precios uno por uno no escala. El catálogo responde por ti y el pedido llega completo." },
      { title: "Inventario en la cabeza", text: "Un panel con productos y pedidos evita vender lo que ya no tienes." },
      { title: "Clientes fuera de la ciudad", text: "Una tienda en línea vende igual en Moroleón que en Monterrey." },
    ],
    projects: ["kroma-studio", "casa-ambar", "indigo-lab-denim"],
    projectsNote: "Son demos con marcas ficticias. Muestran catálogo, carrito y pedido por WhatsApp.",
    faqs: [
      { q: "¿Cuánto cuesta una tienda en línea?", a: QUOTE },
      { q: "¿Qué formas de pago puedo recibir?", a: "Tarjetas mediante una pasarela de pago, transferencia o pedido por WhatsApp. Elegimos según tu volumen y cómo cobras hoy; las comisiones las define cada pasarela." },
      { q: "¿Puedo administrar los productos yo mismo?", a: "Sí. Incluimos un panel para agregar, editar y ocultar productos y revisar pedidos." },
      { q: "¿Cuánto tarda en estar lista?", a: TIME },
    ],
  },
  {
    kind: "service", slug: "sistemas-web", name: "Sistemas web",
    metaTitle: "Sistemas web a la medida en Guanajuato",
    description: "Sistemas web a la medida para controlar clientes, pedidos, inventario o información de tu negocio en Moroleón, Salamanca, Irapuato y todo Guanajuato.",
    ogLine: "Menos hojas sueltas. Más control.",
    h1: "Sistemas web a la medida para negocios en Guanajuato",
    lead: "Cuando las hojas de cálculo y los mensajes ya no alcanzan, un sistema web centraliza la información y la pone al alcance de tu equipo desde cualquier computadora o celular.",
    includes: [
      { title: "Paneles administrativos", text: "Pantallas para registrar, consultar y actualizar lo que hoy vive en libretas o archivos." },
      { title: "Roles y permisos", text: "Cada persona ve y modifica sólo lo que le corresponde." },
      { title: "Base de datos", text: "Información ordenada, respaldada y lista para consultarse o exportarse." },
      { title: "Integraciones", text: "Conexión con tu tienda en línea, formularios o herramientas que ya usas, cuando la herramienta lo permite." },
    ],
    forWhom: ["Talleres y fábricas que controlan producción en papel", "Negocios con varias sucursales o vendedores", "Plataformas que reúnen a varios negocios o usuarios"],
    problems: [
      { title: "Información repartida", text: "Un archivo por persona y versiones distintas del mismo dato. El sistema deja una sola fuente." },
      { title: "Errores al capturar", text: "Validaciones y listas predefinidas reducen errores de captura." },
      { title: "Depender de una sola persona", text: "Si sólo una persona sabe dónde está todo, el negocio se detiene cuando falta." },
    ],
    projects: [],
    projectsNote: "Todavía no hay un demo público de sistemas en el portafolio. Cuéntanos tu proceso y lo revisamos juntos en el diagnóstico.",
    faqs: [
      { q: "¿Cuánto cuesta un sistema a la medida?", a: QUOTE },
      { q: "¿Necesito servidores propios?", a: "No. Lo publicamos en servicios en la nube; el costo de operación depende del uso y te lo explicamos en la propuesta." },
      { q: "¿Puedo empezar con algo pequeño?", a: "Sí, y es lo recomendable: empezamos por el proceso que más te cuesta hoy y agregamos módulos después." },
      { q: "¿Mi información está segura?", a: "Usamos inicio de sesión, permisos por rol y respaldos del proveedor de nube. En el diagnóstico revisamos qué datos manejas para definir el nivel de protección." },
    ],
  },
  {
    kind: "service", slug: "apps-pwa", name: "Apps web / PWA",
    metaTitle: "Apps web y PWA para negocios en Guanajuato",
    description: "Aplicaciones web progresivas (PWA) que se instalan en el celular sin pasar por tiendas de apps. Para equipos y clientes de negocios en Guanajuato y México.",
    ogLine: "La experiencia de una app. En la web.",
    h1: "Apps web y PWA para negocios en Guanajuato",
    lead: "Una app que se abre desde el navegador y se puede instalar en la pantalla de inicio del teléfono. Sin descargas desde tiendas y con una sola versión para Android y iPhone.",
    includes: [
      { title: "Experiencia móvil", text: "Botones grandes, navegación inferior y pantallas pensadas para usarse con una mano." },
      { title: "Instalable", text: "Ícono en la pantalla de inicio y apertura a pantalla completa, como una app." },
      { title: "Funciones a medida", text: "Registro de pedidos, consultas, citas o reportes de campo, según tu operación." },
      { title: "Actualización inmediata", text: "Los cambios se publican una vez y llegan a todos, sin esperar la aprobación de una tienda." },
    ],
    forWhom: ["Equipos de venta o de campo que trabajan desde el celular", "Negocios que quieren una app para sus clientes sin el costo de dos apps nativas", "Procesos internos que hoy se hacen por WhatsApp"],
    problems: [
      { title: "Dos apps, doble costo", text: "Una PWA funciona en Android y iPhone con el mismo código." },
      { title: "Nadie descarga apps", text: "Abrir un enlace es más fácil que buscar e instalar desde una tienda." },
      { title: "Procesos por chat", text: "Pasar reportes o pedidos a una app ordena la información que hoy se pierde en conversaciones." },
    ],
    projects: ["kroma-studio", "kairos-concept"],
    projectsNote: "Son demos con marcas ficticias. Están pensados primero para el celular.",
    faqs: [
      { q: "¿Qué diferencia hay entre una PWA y una app nativa?", a: "La PWA vive en la web y se instala desde el navegador; la nativa se descarga de App Store o Google Play. Para muchos negocios la PWA basta y cuesta menos; si necesitas funciones específicas del teléfono, lo revisamos en el diagnóstico." },
      { q: "¿Funciona en iPhone?", a: "Sí. En iPhone se instala desde Safari con la opción “Agregar a inicio”; algunas funciones dependen de la versión de iOS." },
      { q: "¿Cuánto cuesta?", a: QUOTE },
    ],
  },
  {
    kind: "service", slug: "automatizacion", name: "Automatización",
    metaTitle: "Automatización de procesos en Guanajuato",
    description: "Automatizamos pedidos, notificaciones, formularios y tareas repetitivas conectando las herramientas de tu negocio. Moroleón, Guanajuato y todo México.",
    ogLine: "Que los procesos sigan su curso.",
    h1: "Automatización de procesos para negocios en Guanajuato",
    lead: "Conectamos tus formularios, pedidos y herramientas para que un evento dispare el siguiente paso sin que alguien tenga que copiar y pegar.",
    includes: [
      { title: "Flujos de trabajo", text: "Un pedido nuevo puede avisar al equipo, registrar la venta y enviar la confirmación al cliente." },
      { title: "Integración de herramientas", text: "Hojas de cálculo, correo, WhatsApp Business, tu tienda o tu sistema, según las integraciones disponibles de cada herramienta." },
      { title: "Notificaciones", text: "Avisos a la persona correcta en el momento correcto." },
      { title: "Reportes automáticos", text: "Resúmenes periódicos sin armar tablas a mano." },
    ],
    forWhom: ["Negocios donde alguien pasa horas copiando datos entre sistemas", "Equipos que se enteran tarde de pedidos o solicitudes", "Empresas que ya usan varias herramientas que no se hablan entre sí"],
    problems: [
      { title: "Copiar y pegar", text: "Cada captura manual es tiempo y una oportunidad de error." },
      { title: "Avisos que no llegan", text: "Si el aviso depende de que alguien se acuerde, a veces no pasa." },
      { title: "Herramientas aisladas", text: "Conectarlas evita tener la misma información en tres lugares." },
    ],
    projects: ["kroma-studio", "proforma-textil"],
    projectsNote: "Son demos con marcas ficticias. El pedido o la solicitud llega directo por WhatsApp con un mensaje prellenado.",
    faqs: [
      { q: "¿Qué procesos se pueden automatizar?", a: "Los que siguen reglas claras y se repiten: registrar pedidos, enviar confirmaciones, avisar al equipo, generar reportes. En el diagnóstico revisamos cuáles valen la pena." },
      { q: "¿Tengo que cambiar mis herramientas?", a: "No necesariamente. Primero intentamos conectar lo que ya usas; sólo proponemos cambios si la herramienta no lo permite." },
      { q: "¿Cuánto cuesta?", a: QUOTE },
    ],
  },
  {
    kind: "service", slug: "inteligencia-artificial", name: "Inteligencia artificial",
    metaTitle: "Inteligencia artificial para negocios en Guanajuato",
    description: "Asistentes virtuales y herramientas de IA con una tarea concreta: atender consultas, orientar clientes y organizar información. Para Guanajuato y México.",
    ogLine: "IA con una tarea concreta.",
    h1: "Inteligencia artificial para negocios en Guanajuato",
    lead: "IA que hace un trabajo específico dentro de tu negocio: responder preguntas frecuentes, orientar a un cliente hacia el producto correcto o resumir información.",
    includes: [
      { title: "Asistentes virtuales", text: "Un asistente en tu página que conoce tus servicios y lleva al cliente al contacto, como Nix en este sitio." },
      { title: "Análisis de información", text: "Clasificar mensajes, resumir documentos o extraer datos de formularios." },
      { title: "Flujos con IA", text: "La IA como un paso dentro de un proceso automatizado, con revisión humana donde importa." },
      { title: "Límites claros", text: "Definimos qué puede responder y qué debe pasar a una persona." },
    ],
    forWhom: ["Negocios que reciben muchas preguntas repetidas", "Equipos que procesan mucha información escrita", "Marcas que quieren atender fuera de horario sin perder el trato humano"],
    problems: [
      { title: "Las mismas preguntas", text: "Un asistente resuelve dudas frecuentes y deja a tu equipo las conversaciones que sí necesitan una persona." },
      { title: "Clientes que no saben qué pedir", text: "La IA puede orientar con preguntas y llevar a la opción adecuada." },
      { title: "Información sin ordenar", text: "Resúmenes y clasificación automática de lo que llega por escrito." },
    ],
    projects: [],
    projectsNote: "Nix, el asistente de este sitio, es un ejemplo en funcionamiento: pregúntale lo que quieras sobre tu proyecto.",
    faqs: [
      { q: "¿La IA va a contestar cosas incorrectas?", a: "Puede equivocarse, por eso le damos información de tu negocio, límites de lo que puede responder y una salida clara para hablar con una persona." },
      { q: "¿Qué pasa con los datos de mis clientes?", a: "Usamos proveedores de IA desde el servidor, sin exponer claves, y definimos qué información se envía. En el diagnóstico revisamos qué datos maneja tu proceso." },
      { q: "¿Cuánto cuesta?", a: QUOTE + " Además, el uso del modelo de IA tiene un costo variable que estimamos contigo." },
    ],
  },
  {
    kind: "service", slug: "experiencias-inmersivas", name: "Experiencias inmersivas",
    metaTitle: "Experiencias web inmersivas con 3D y scroll",
    description: "Páginas que cuentan la historia de tu marca con scroll, 3D y animación, para marcas que quieren que las recuerden. Desde Moroleón, Guanajuato, para todo México.",
    ogLine: "Páginas que cuentan tu historia.",
    h1: "Experiencias web inmersivas con 3D y scroll",
    lead: "Páginas que cuentan tu historia con scroll, 3D y animación, para marcas que quieren que las recuerden. Cada movimiento tiene un propósito y la página sigue siendo rápida y fácil de usar.",
    includes: [
      { title: "Narrativa con scroll", text: "La historia avanza mientras el visitante baja: producto, origen y propuesta en el orden correcto." },
      { title: "3D y animación", text: "Productos o escenas en 3D con WebGL, con una versión ligera para teléfonos sin potencia." },
      { title: "Catálogo integrado", text: "La experiencia termina en lo importante: el catálogo y el pedido por WhatsApp o en línea." },
      { title: "Accesible", text: "Respeta la preferencia de reducir movimiento y el contenido se puede leer aunque no cargue el 3D." },
    ],
    forWhom: ["Marcas de moda, café, gastronomía o producto premium", "Lanzamientos y colecciones que necesitan un momento propio", "Negocios que compiten por imagen y no sólo por precio"],
    problems: [
      { title: "Una página más", text: "Si tu sitio se parece al de la competencia, nadie lo recuerda." },
      { title: "Productos que se explican mejor en movimiento", text: "Texturas, ingredientes o procesos se entienden mejor cuando se muestran." },
      { title: "Efectos que estorban", text: "Diseñamos la animación para que acompañe la lectura, no para que la interrumpa ni haga lenta la página." },
    ],
    projects: ["ambar-cafe", "brasa-burgers", "aura-travel"],
    projectsNote: "Son demos con marcas ficticias. Sus recorridos también se reproducen en el celular 3D de la página de inicio.",
    faqs: [
      { q: "¿Una página con 3D no es lenta?", a: "Puede serlo si no se cuida. Cargamos el 3D después del contenido, con una imagen estática mientras tanto, y una versión 2D para teléfonos sin potencia." },
      { q: "¿Funciona en el celular?", a: "Sí. La experiencia se adapta: menos efectos y animación más ligera en teléfonos, y una versión estática si la persona prefiere reducir el movimiento." },
      { q: "¿Cuánto cuesta?", a: QUOTE },
    ],
  },
];

export const cities: readonly CityLanding[] = [
  {
    kind: "city", slug: "moroleon", city: "Moroleón",
    metaTitle: "Páginas web y software en Moroleón",
    description: "Páginas web, tiendas en línea, catálogos y sistemas para negocios de Moroleón, Guanajuato. Experiencia con el sector textil y de venta de ropa. Cotización gratis.",
    ogLine: "Desde Moroleón, para los negocios de Moroleón.",
    h1: "Páginas web y software en Moroleón",
    lead: "Ingenix Hub es de Moroleón. Conocemos cómo se mueve la venta de ropa y textiles en la ciudad: los compradores que llegan de otros estados, los pedidos de mayoreo y la temporada alta.",
    economy: [
      { title: "Textil y confección", text: "Talleres y fábricas de tejido, prendas y accesorios abastecen a tiendas de todo el país. Muchos venden por mayoreo y reciben pedidos de clientes que no pueden venir en persona." },
      { title: "Comercio de ropa", text: "Tiendas y locales del centro y de las zonas comerciales atienden a compradores que llegan de fuera, sobre todo en fines de semana y temporadas." },
      { title: "Servicios locales", text: "Consultorios, estudios, restaurantes y profesionistas que necesitan aparecer cuando alguien busca en Google desde la ciudad." },
    ],
    howWeHelp: [
      { title: "Catálogo para mayoristas", text: "Tus modelos, tallas y colores en un catálogo que puedes enviar por WhatsApp en lugar de decenas de fotos." },
      { title: "Tienda en línea", text: "Para vender a clientes de otros estados sin que tengan que viajar a Moroleón." },
      { title: "Sistema de pedidos y producción", text: "Para talleres que llevan pedidos y avances en libretas o mensajes." },
      { title: "Página para tu negocio", text: "Ubicación, horarios y contacto para que te encuentren en Google y Maps." },
    ],
    projects: ["indigo-lab-denim", "proforma-textil"],
    projectsNote: "Son demos con marcas ficticias. Están pensados para negocios como los de la región: mezclilla de mayoreo y menudeo, y uniformes empresariales.",
    nearby: "También atendemos Uriangato y Yuriria, a unos minutos, con reuniones en persona cuando el proyecto lo necesita.",
    faqs: [
      { q: "¿Puedo reunirme en persona en Moroleón?", a: "Sí. Estamos en Moroleón y podemos vernos para el diagnóstico; también trabajamos por videollamada y WhatsApp si te acomoda más." },
      { q: "Vendo por mayoreo, ¿me sirve una tienda en línea?", a: "Depende de cómo vendes. A muchos negocios de mayoreo les funciona mejor un catálogo con pedido por WhatsApp que una tienda con pago en línea; lo vemos en el diagnóstico." },
      { q: "¿Cuánto cuesta?", a: QUOTE },
    ],
  },
  {
    kind: "city", slug: "uriangato", city: "Uriangato",
    metaTitle: "Páginas web y software en Uriangato",
    description: "Páginas web, catálogos digitales y tiendas en línea para negocios textiles y comercios de Uriangato, Guanajuato. A minutos de Moroleón. Diagnóstico gratis.",
    ogLine: "Tu catálogo de Uriangato, abierto a todo México.",
    h1: "Páginas web y software en Uriangato",
    lead: "Uriangato y Moroleón forman uno de los corredores de venta de ropa más conocidos del país. Estamos a unos minutos y trabajamos con negocios del mismo sector.",
    economy: [
      { title: "Fabricantes textiles", text: "Talleres de prendas tejidas y confección que venden a tiendas y revendedores de distintos estados." },
      { title: "Comercio de ropa por mayoreo y menudeo", text: "Locales que reciben compradores de fuera y que cada vez más reciben pedidos a distancia." },
      { title: "Negocios que venden por redes", text: "Muchos negocios ya venden por Facebook e Instagram y necesitan un lugar donde ordenar productos y pedidos." },
    ],
    howWeHelp: [
      { title: "Catálogo digital", text: "Modelos, colores y tallas en un enlace para compartir con tus clientes, sin depender del algoritmo de las redes." },
      { title: "Tienda en línea o pedido por WhatsApp", text: "El cliente arma su pedido y te llega completo." },
      { title: "Presencia en directorios y mapas", text: "Aparecer en directorios de la región y en Google Maps ayuda a que compradores de fuera te encuentren." },
      { title: "Control de pedidos", text: "Un sistema sencillo para saber qué se vendió, qué falta producir y qué se envió." },
    ],
    projects: ["indigo-lab-denim", "casa-ambar"],
    projectsNote: "Son demos con marcas ficticias. Muestran catálogos de mezclilla y de ropa de temporada como los que venden los negocios de Uriangato.",
    nearby: "Atendemos Uriangato desde Moroleón, a unos minutos, y también Yuriria.",
    faqs: [
      { q: "¿Trabajan con negocios de Uriangato?", a: "Sí. Estamos en Moroleón, a unos minutos, y podemos reunirnos en persona o por videollamada." },
      { q: "Ya vendo en Facebook, ¿para qué quiero una página?", a: "Las redes sirven para atraer; una página o catálogo propio sirve para ordenar productos, aparecer en Google y no depender de una sola plataforma." },
      { q: "¿Cuánto cuesta?", a: QUOTE },
    ],
  },
  {
    kind: "city", slug: "salamanca", city: "Salamanca",
    metaTitle: "Páginas web y software en Salamanca, Guanajuato",
    description: "Sistemas web, páginas corporativas y automatización para empresas, proveedores industriales y comercios de Salamanca, Guanajuato. Diagnóstico y cotización gratis.",
    ogLine: "Software para la industria y el comercio de Salamanca.",
    h1: "Páginas web y software en Salamanca",
    lead: "Salamanca combina industria y comercio. Para un proveedor industrial, una página clara y un sistema ordenado pesan tanto como el precio; para un comercio, aparecer en Google es parte de la venta.",
    economy: [
      { title: "Industria y proveedores", text: "La actividad industrial de la ciudad, con la refinería como referencia, genera una red de proveedores de mantenimiento, servicios técnicos, transporte y suministros." },
      { title: "Comercio", text: "Tiendas, distribuidores y negocios de servicio que atienden a la ciudad y a los municipios cercanos." },
      { title: "Servicios profesionales", text: "Despachos, consultorios y empresas de servicios que necesitan proyectar seriedad desde la primera búsqueda." },
    ],
    howWeHelp: [
      { title: "Página corporativa", text: "Para proveedores que deben presentar capacidades, certificaciones y contacto a compradores de empresas." },
      { title: "Sistemas de seguimiento", text: "Órdenes de servicio, reportes de campo y control de clientes en un sistema web, en lugar de hojas sueltas." },
      { title: "Automatización", text: "Avisos y reportes automáticos para equipos que trabajan en distintos turnos o ubicaciones." },
      { title: "Catálogo o tienda", text: "Para comercios y distribuidores que quieren recibir pedidos en línea." },
    ],
    projects: ["proforma-textil", "lumina-derma"],
    projectsNote: "Aún no tenemos un proyecto publicado de Salamanca. Estos demos (marcas ficticias) muestran un sitio para un proveedor de uniformes empresariales y uno de servicios.",
    nearby: "También atendemos Valle de Santiago e Irapuato. Las reuniones pueden ser en persona o por videollamada.",
    faqs: [
      { q: "¿Pueden hacer un sistema para órdenes de servicio?", a: "Sí. Registramos órdenes, técnicos, evidencias y estatus en un sistema web que se usa desde la computadora o el celular. El alcance se define en el diagnóstico." },
      { q: "¿Se reúnen en Salamanca?", a: "Sí, cuando el proyecto lo requiere. Muchas reuniones de seguimiento se hacen por videollamada para avanzar más rápido." },
      { q: "¿Cuánto cuesta?", a: QUOTE },
    ],
  },
  {
    kind: "city", slug: "irapuato", city: "Irapuato",
    metaTitle: "Páginas web y software en Irapuato",
    description: "Páginas web, tiendas en línea y sistemas para empresas, comercios y servicios de Irapuato, Guanajuato. Diseño a medida y cotización gratis.",
    ogLine: "Web y software para Irapuato.",
    h1: "Páginas web y software en Irapuato",
    lead: "Irapuato es una ciudad de industria, comercio y servicios, con parques industriales, distribución y una vida comercial intensa. Ahí la competencia también se juega en Google.",
    economy: [
      { title: "Industria y agroindustria", text: "Empresas manufactureras, proveedores y negocios ligados al campo de la región que necesitan presentar su oferta a otras empresas." },
      { title: "Comercio y distribución", text: "Distribuidores y tiendas que atienden a la ciudad y a los municipios del corredor industrial." },
      { title: "Servicios", text: "Salud, educación, restaurantes y servicios profesionales que compiten por aparecer primero en búsquedas locales." },
    ],
    howWeHelp: [
      { title: "Página para captar clientes", text: "Servicios claros, ubicación y contacto directo para quien te busca en Google desde Irapuato." },
      { title: "Tienda en línea", text: "Para comercios y distribuidores que quieren vender o recibir pedidos fuera del mostrador." },
      { title: "Sistemas para la operación", text: "Inventario, pedidos o clientes en un sistema web a la medida." },
      { title: "Asistente con IA", text: "Para atender preguntas frecuentes fuera de horario y pasar los casos importantes a tu equipo." },
    ],
    projects: ["lumina-derma", "kroma-studio"],
    projectsNote: "Aún no tenemos un proyecto publicado de Irapuato. Estos demos (marcas ficticias) muestran un sitio de servicios y una tienda en línea.",
    nearby: "También atendemos Salamanca, Celaya y el resto del corredor, en persona o por videollamada.",
    faqs: [
      { q: "¿Trabajan con empresas de Irapuato?", a: "Sí. Atendemos Irapuato con reuniones en persona cuando el proyecto lo requiere y seguimiento por videollamada y WhatsApp." },
      { q: "¿Me ayudan a aparecer en Google en Irapuato?", a: "Construimos la página con bases de SEO local: títulos, datos estructurados y contenido sobre tu zona. También te orientamos para configurar tu Perfil de Negocio de Google." },
      { q: "¿Cuánto cuesta?", a: QUOTE },
    ],
  },
];

export type Landing = ServiceLanding | CityLanding;
export const landings: readonly Landing[] = [...services, ...cities];
export function landingBySlug(slug: string) { return landings.find(item => item.slug === slug); }
