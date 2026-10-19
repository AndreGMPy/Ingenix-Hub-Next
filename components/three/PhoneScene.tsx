"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture, ExtrudeGeometry, Group, MathUtils, MeshBasicMaterial, Shape, ShapeGeometry, SRGBColorSpace, VideoTexture, type Texture } from "three";
import type { VideoRefs } from "@/components/home/HeroPhone";
import type { ShowcaseItem } from "@/data/showcase";
import { showcaseFrame, showcaseLayout, smoothstep, type ShowcasePose } from "@/lib/motion";
import { heroProgress, subscribeHeroProgress } from "@/lib/scroll-progress";

type Props = { items: readonly ShowcaseItem[]; videos: VideoRefs; maxDpr?: number; mobile: boolean; running: boolean; animate: boolean; dark: boolean; onReady: () => void; onFailure: () => void };

/* Medidas en unidades de escena: alto 2 ≈ proporción de un teléfono actual (9:19.5). */
const PHONE = { w: 0.96, h: 2, d: 0.1, r: 0.15 };
const SCREEN = { w: 0.88, h: 1.91, r: 0.115 };
// Materiales 3D centralizados en la escena (V2_DESIGN_SYSTEM: colores de materiales dentro de la escena).
const NAVY = "#21407a", NAVY_EDGE = "#3a64ad", GLASS = "#05080f";

function roundedShape(w: number, h: number, r: number) {
  const s = new Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function roundedPlane(w: number, h: number, r: number) {
  const geometry = new ShapeGeometry(roundedShape(w, h, r), 10);
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / w + 0.5, uv.getY(i) / h + 0.5);
  return geometry;
}
/* RoundedBox limita el radio a la mitad del grosor; el cuerpo usa la misma idea (extrusión con bisel) con esquinas de teléfono. */
function bodyGeometry() {
  const bevel = 0.022;
  const geometry = new ExtrudeGeometry(roundedShape(PHONE.w - bevel * 2, PHONE.h - bevel * 2, PHONE.r - bevel), { depth: PHONE.d - bevel * 2, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 5, curveSegments: 14 });
  geometry.center();
  return geometry;
}
function prepareTextures(value: Texture | Texture[]) {
  for (const t of Array.isArray(value) ? value : [value]) { t.colorSpace = SRGBColorSpace; t.anisotropy = 4; t.needsUpdate = true; }
}
function lerpPose(a: ShowcasePose, b: ShowcasePose, t: number): ShowcasePose {
  return { x: MathUtils.lerp(a.x, b.x, t), y: MathUtils.lerp(a.y, b.y, t), scale: MathUtils.lerp(a.scale, b.scale, t) };
}

/* ---------- Tarjetas de interfaz (canvas → textura, vidrio simulado sin transmission) ---------- */
type CardKind = "order" | "product" | "nix" | "chart";
const CARDS: { kind: CardKind; pos: [number, number, number]; far: boolean; w: number }[] = [
  { kind: "order", pos: [-0.9, 0.5, 0.42], far: false, w: 0.92 },
  { kind: "nix", pos: [0.6, -0.5, 0.6], far: false, w: 0.96 },
  { kind: "product", pos: [0.86, 0.76, -0.62], far: true, w: 0.84 },
  { kind: "chart", pos: [-0.92, -0.62, -0.5], far: true, w: 0.84 },
];
function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
}
function drawCard(kind: CardKind, dark: boolean, blur: boolean, nix: HTMLImageElement | null) {
  const W = 512, H = kind === "chart" ? 300 : 200, pad = 18;
  const base = document.createElement("canvas"); base.width = W; base.height = H;
  const ctx = base.getContext("2d")!;
  const font = '"Manrope Variable", Manrope, system-ui, sans-serif';
  const text = dark ? "#eef4ff" : "#10233f", muted = dark ? "#a8b8cf" : "#53647b";
  const accent = dark ? "#80b4ff" : "#075be8", cyan = dark ? "#55d9ef" : "#087f98";
  roundRectPath(ctx, pad, pad, W - pad * 2, H - pad * 2, 30);
  const fill = ctx.createLinearGradient(0, 0, W, H);
  fill.addColorStop(0, dark ? "rgba(36,58,94,.86)" : "rgba(255,255,255,.9)");
  fill.addColorStop(1, dark ? "rgba(17,29,48,.74)" : "rgba(237,242,248,.78)");
  ctx.fillStyle = fill; ctx.fill();
  ctx.lineWidth = 2.5; ctx.strokeStyle = dark ? "rgba(160,200,255,.32)" : "rgba(255,255,255,.95)"; ctx.stroke();
  // Reflejo superior del vidrio.
  const shine = ctx.createLinearGradient(0, pad, 0, H * 0.55);
  shine.addColorStop(0, dark ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.7)"); shine.addColorStop(1, "rgba(255,255,255,0)");
  roundRectPath(ctx, pad + 2, pad + 2, W - pad * 2 - 4, H * 0.5, 28); ctx.fillStyle = shine; ctx.fill();
  const icon = (color: string, glyph: string) => {
    ctx.fillStyle = color; roundRectPath(ctx, 48, 52, 64, 64, 18); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = `700 34px ${font}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(glyph, 80, 86); ctx.textAlign = "left";
  };
  ctx.textBaseline = "alphabetic";
  if (kind === "order" || kind === "product") {
    icon(kind === "order" ? accent : cyan, kind === "order" ? "✓" : "+");
    ctx.fillStyle = text; ctx.font = `700 34px ${font}`; ctx.fillText(kind === "order" ? "Nuevo pedido" : "Producto agregado", 134, 82);
    ctx.fillStyle = muted; ctx.font = `500 25px ${font}`; ctx.fillText(kind === "order" ? "2 artículos · pago confirmado" : "Al carrito · talla M", 134, 120);
    ctx.fillStyle = cyan; ctx.beginPath(); ctx.arc(W - 62, 66, 7, 0, Math.PI * 2); ctx.fill();
  } else if (kind === "nix") {
    ctx.save(); ctx.beginPath(); ctx.arc(80, 100, 36, 0, Math.PI * 2); ctx.fillStyle = dark ? "#17263d" : "#e3ecf8"; ctx.fill(); ctx.clip();
    if (nix) ctx.drawImage(nix, 40, 58, 80, 80); ctx.restore();
    ctx.fillStyle = accent; ctx.font = `800 24px ${font}`; ctx.fillText("NIX", 134, 78);
    ctx.fillStyle = text; ctx.font = `700 31px ${font}`; ctx.fillText("¿Te ayudo a cotizar?", 134, 118);
    ctx.fillStyle = muted; ctx.font = `500 22px ${font}`; ctx.fillText("Asistente de Ingenix", 134, 150);
  } else {
    ctx.fillStyle = muted; ctx.font = `600 22px ${font}`; ctx.fillText("VENTAS · ESTA SEMANA", 50, 72);
    ctx.fillStyle = text; ctx.font = `800 40px ${font}`; ctx.fillText("+24%", 50, 120);
    const bars = [0.35, 0.5, 0.42, 0.62, 0.58, 0.8, 0.95];
    bars.forEach((v, i) => {
      const bw = 34, gap = 16, x = 210 + i * (bw + gap), h = v * 150, y = H - 46 - h;
      const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, i === bars.length - 1 ? accent : cyan); g.addColorStop(1, dark ? "rgba(85,217,239,.15)" : "rgba(8,127,152,.15)");
      ctx.fillStyle = g; roundRectPath(ctx, x, y, bw, h, 8); ctx.fill();
    });
  }
  if (!blur) return base;
  // Desenfoque de profundidad pre-horneado (las tarjetas lejanas no cambian de capa).
  const out = document.createElement("canvas"); out.width = W; out.height = H;
  const octx = out.getContext("2d")!;
  if ("filter" in octx) { octx.filter = "blur(5px)"; octx.drawImage(base, 0, 0); return out; }
  return base;
}
function Cards({ dark, mobile, opacity, time }: { dark: boolean; mobile: boolean; opacity: { current: number }; time: { current: number } }) {
  const refs = useRef<(Group | null)[]>([]);
  const mats = useRef<(MeshBasicMaterial | null)[]>([]);
  const { invalidate } = useThree();
  const cards = useMemo(() => mobile ? CARDS.slice(0, 2) : CARDS, [mobile]);
  useEffect(() => {
    let disposed = false;
    const made: CanvasTexture[] = [];
    const nix = new Image(); nix.src = "/nix/nix.webp";
    Promise.all([document.fonts?.ready, nix.decode().catch(() => undefined)]).then(() => {
      if (disposed) return;
      cards.forEach((card, i) => {
        const texture = new CanvasTexture(drawCard(card.kind, dark, card.far, nix.complete ? nix : null));
        texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4; made.push(texture);
        const mat = mats.current[i]; if (mat) { mat.map = texture; mat.needsUpdate = true; }
      });
      invalidate();
    });
    return () => { disposed = true; made.forEach(t => t.dispose()); };
  }, [cards, dark, invalidate]);
  useFrame(() => {
    const o = opacity.current, t = time.current;
    cards.forEach((card, i) => {
      const node = refs.current[i], mat = mats.current[i];
      if (!node || !mat) return;
      const a = Math.sin(t * 0.32 + i * 1.7) * 0.16, [x0, y, z] = card.pos, x = x0 * (mobile ? 0.62 : 1);
      node.position.set(x * Math.cos(a) + z * Math.sin(a), y + Math.sin(t * 0.5 + i) * 0.035, -x * Math.sin(a) + z * Math.cos(a));
      node.rotation.set(0, -node.position.x * 0.12, 0);
      mat.opacity = o * (card.far ? 0.62 : 1) * (mat.map ? 1 : 0);
      node.visible = mat.opacity > 0.01;
    });
  });
  return <>{cards.map((card, i) => {
    const h = card.w * (card.kind === "chart" ? 300 : 200) / 512;
    return <group key={card.kind} ref={node => { refs.current[i] = node; }} scale={mobile ? 0.82 : 1}>
      <mesh renderOrder={card.far ? 1 : 3}><planeGeometry args={[card.w, h]} /><meshBasicMaterial ref={m => { mats.current[i] = m; }} transparent depthWrite={false} toneMapped={false} opacity={0} /></mesh>
    </group>;
  })}</>;
}

/* ---------- Celular ---------- */
function Phone({ items, videos, maxDpr = 1, mobile, animate, dark, onReady }: Omit<Props, "running" | "onFailure">) {
  const rig = useRef<Group>(null), spinner = useRef<Group>(null), screen = useRef<MeshBasicMaterial>(null), cardsRoot = useRef<Group>(null);
  const loaded = useTexture(items.map(item => item.screen), prepareTextures) as Texture[];
  const isotipo = useTexture("/brand/ingenix-isotipo.png", prepareTextures);
  // La pantalla usa los mismos <video> del mockup 2D (HeroPhone decide cuál corre); el poster cubre hasta que haya cuadros.
  const videoTextures = useRef<(VideoTexture | null)[]>([]);
  useEffect(() => () => { videoTextures.current.forEach(texture => texture?.dispose()); videoTextures.current = []; }, []);
  const screenTexture = (index: number): Texture => {
    const video = videos.current[index];
    if (!video || video.readyState < 2) return loaded[index];
    let texture = videoTextures.current[index];
    if (!texture || texture.image !== video) { texture?.dispose(); texture = new VideoTexture(video); texture.colorSpace = SRGBColorSpace; videoTextures.current[index] = texture; }
    return texture;
  };
  const { gl, size, viewport, camera, invalidate } = useThree();
  const setDpr = useThree(store => store.setDpr);
  // Resolución adaptativa: sólo se mide con render continuo (scroll/arrastre); en reposo a ~30 fps no cuenta.
  const budget = useRef({ sum: 0, count: 0, slow: 0, fast: 0, dpr: maxDpr, changes: 0 });
  const measure = (delta: number) => {
    const b = budget.current, minDpr = mobile ? 0.75 : 1;
    if (delta > 0.05 || b.changes >= 4) return; // pausa de demanda o demasiados cambios: no medir
    b.sum += delta; b.count++;
    if (b.count < 45) return;
    const avg = b.sum / b.count; b.sum = 0; b.count = 0;
    b.slow = avg > 0.021 ? b.slow + 1 : 0; b.fast = avg < 0.0175 ? b.fast + 1 : 0;
    const next = b.slow >= 2 ? Math.max(minDpr, b.dpr - 0.25) : b.fast >= 6 ? Math.min(maxDpr, b.dpr + 0.25) : b.dpr;
    if (next !== b.dpr) { b.dpr = next; b.slow = b.fast = 0; b.changes++; setDpr(next); }
  };
  const body = useMemo(() => bodyGeometry(), []), screenGeo = useMemo(() => roundedPlane(SCREEN.w, SCREEN.h, SCREEN.r), []), glassGeo = useMemo(() => roundedPlane(PHONE.w - 0.035, PHONE.h - 0.035, PHONE.r - 0.015), []), islandGeo = useMemo(() => roundedPlane(0.27, 0.072, 0.036), []);
  const state = useRef({ time: 0, tiltX: 0, tiltY: 0, drag: 0, dragging: false, lastX: 0, orient: null as null | { x: number; y: number }, screen: -1, active: 0, tick: 0 });
  const cardOpacity = useRef(1), time = useRef(0);
  useEffect(() => () => { body.dispose(); screenGeo.dispose(); glassGeo.dispose(); islandGeo.dispose(); }, [body, screenGeo, glassGeo, islandGeo]);
  useEffect(() => { invalidate(); const id = requestAnimationFrame(() => requestAnimationFrame(onReady)); return () => cancelAnimationFrame(id); }, [invalidate, onReady]);
  useEffect(() => subscribeHeroProgress(() => { state.current.active = performance.now(); invalidate(); }), [invalidate]);
  useEffect(() => () => window.clearTimeout(state.current.tick), []);
  // Arrastrar para girar (regresa solo) y orientación del dispositivo cuando hay permiso.
  useEffect(() => {
    const el = gl.domElement, s = state.current;
    let askedPermission = false;
    const down = (e: PointerEvent) => {
      s.dragging = true; s.lastX = e.clientX; invalidate();
      const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> } | undefined;
      if (mobile && !askedPermission && typeof DOE?.requestPermission === "function") { askedPermission = true; DOE.requestPermission().catch(() => undefined); }
    };
    const move = (e: PointerEvent) => {
      if (s.dragging) { s.drag += (e.clientX - s.lastX) * 0.012; s.lastX = e.clientX; }
      else if (e.pointerType === "mouse") { s.tiltX = (e.clientX / innerWidth) * 2 - 1; s.tiltY = (e.clientY / innerHeight) * 2 - 1; }
      s.active = performance.now(); invalidate();
    };
    const up = () => { s.dragging = false; invalidate(); };
    const orient = (e: DeviceOrientationEvent) => { if (e.gamma == null || e.beta == null) return; s.orient = { x: MathUtils.clamp(e.gamma / 30, -1, 1), y: MathUtils.clamp((e.beta - 45) / 30, -1, 1) }; };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    if (mobile) window.addEventListener("deviceorientation", orient);
    return () => { el.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); window.removeEventListener("deviceorientation", orient); };
  }, [gl, invalidate, mobile]);
  useFrame((_, delta) => {
    const s = state.current, dt = Math.min(delta, 0.06);
    if (animate) { s.time += dt; time.current = s.time; }
    const frame = showcaseFrame(heroProgress.value, items.length);
    const layout = showcaseLayout(mobile);
    const pose = lerpPose(lerpPose(layout.rest, layout.projects, smoothstep(frame.intro)), layout.outro, smoothstep(frame.outro));
    const vp = viewport.getCurrentViewport(camera, [0, 0, 0]);
    const phonePx = Math.min(size.height * 0.72, 640) * pose.scale;
    const scale = (phonePx / size.height) * vp.height / PHONE.h;
    const float = animate ? Math.sin(s.time * 0.9) * 0.035 : 0;
    if (rig.current) { rig.current.position.set(pose.x * vp.width, -pose.y * vp.height + float * scale, 0); rig.current.scale.setScalar(scale); }
    // Inclinación: mouse en desktop; orientación si llega; si no, vaivén automático suave.
    let tx = s.tiltX, ty = s.tiltY;
    if (mobile) { if (s.orient) { tx = s.orient.x; ty = s.orient.y; } else if (animate) { tx = Math.sin(s.time * 0.45) * 0.6; ty = Math.sin(s.time * 0.31) * 0.3; } else { tx = 0; ty = 0; } }
    if (!s.dragging) s.drag = MathUtils.damp(s.drag, 0, 3.2, dt);
    if (spinner.current) {
      const r = spinner.current.rotation;
      const focus = 1 - smoothstep(frame.outro) * 0.6;
      const yaw = frame.spin * Math.PI * 2 - 0.32 * (1 - smoothstep(frame.outro)) * (mobile ? 0.4 : 1) + s.drag + tx * 0.28 * focus, pitch = ty * 0.16 * focus;
      r.y = MathUtils.damp(r.y, yaw, 6, dt);
      r.x = MathUtils.damp(r.x, pitch, 5, dt);
      // Movimiento "activo" = giro por scroll, arrastre o inclinación que aún converge; el vaivén automático (desfase < .02) va a 30 fps.
      if (Math.abs(r.y - yaw) + Math.abs(r.x - pitch) > 0.02 || s.dragging || Math.abs(s.drag) > 0.002) s.active = performance.now();
      r.z = MathUtils.damp(r.z, mobile ? 0 : 0.04 * (1 - smoothstep(frame.intro)), 5, dt);
    }
    if (screen.current) { const map = screenTexture(frame.screen); if (screen.current.map !== map) { s.screen = frame.screen; screen.current.map = map; screen.current.needsUpdate = true; } }
    cardOpacity.current = Math.max(1 - smoothstep(frame.intro * 1.6), smoothstep((frame.outro - 0.35) / 0.65));
    if (cardsRoot.current) { cardsRoot.current.position.copy(rig.current!.position); cardsRoot.current.scale.setScalar(scale); }
    // Cadencia (frameloop "demand"): 60 fps mientras algo se mueve (scroll, arrastre, inclinación que converge);
    // ~30 fps en reposo, suficiente para la flotación y para el video (≈30 fps). Pausado: nada hasta el siguiente evento.
    if (performance.now() - s.active < 300) { measure(delta); invalidate(); }
    else if (animate && !s.tick) s.tick = window.setTimeout(() => { s.tick = 0; invalidate(); }, 33);
  });
  return <>
    <group ref={rig}>
      <group ref={spinner}>
        <mesh geometry={body}><meshStandardMaterial color={NAVY} metalness={0.86} roughness={0.26} envMapIntensity={1.15} /></mesh>
        {/* Cristal frontal y pantalla */}
        <mesh geometry={glassGeo} position={[0, 0, PHONE.d / 2 + 0.001]}><meshStandardMaterial color={GLASS} roughness={0.08} metalness={0.2} /></mesh>
        <mesh geometry={screenGeo} position={[0, 0, PHONE.d / 2 + 0.003]}><meshBasicMaterial ref={screen} map={loaded[0]} toneMapped={false} /></mesh>
        <mesh geometry={islandGeo} position={[0, SCREEN.h / 2 - 0.07, PHONE.d / 2 + 0.005]}><meshBasicMaterial color="#000" /></mesh>
        {/* Botones laterales */}
        {[[-1, 0.5, 0.16], [-1, 0.3, 0.16], [1, 0.38, 0.26]].map(([side, y, h], i) => <RoundedBox key={i} args={[0.02, h, 0.045]} radius={0.009} smoothness={3} position={[side * (PHONE.w / 2 + 0.006), y, 0]}><meshStandardMaterial color={NAVY_EDGE} metalness={0.9} roughness={0.22} /></RoundedBox>)}
        {/* Reverso: módulo de cámara e isotipo */}
        <group position={[0, 0, -PHONE.d / 2]} rotation={[0, Math.PI, 0]}>
          <RoundedBox args={[0.4, 0.4, 0.035]} radius={0.016} smoothness={4} position={[0.22, 0.72, 0.012]}><meshStandardMaterial color={NAVY_EDGE} metalness={0.7} roughness={0.18} /></RoundedBox>
          {[[0.13, 0.81], [0.13, 0.63], [0.31, 0.72]].map(([x, y], i) => <group key={i} position={[x, y, 0.034]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.068, 0.072, 0.03, 28]} /><meshStandardMaterial color="#0d1a30" metalness={0.9} roughness={0.15} /></mesh>
            <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.042, 28]} /><meshStandardMaterial color="#04060c" metalness={0.4} roughness={0.05} /></mesh>
          </group>)}
          <mesh position={[0.31, 0.83, 0.032]}><circleGeometry args={[0.018, 16]} /><meshBasicMaterial color="#fff6d8" /></mesh>
          <mesh position={[0, -0.1, 0.002]}><planeGeometry args={[0.38 * 1234 / 1419, 0.38]} /><meshBasicMaterial map={isotipo} transparent toneMapped={false} opacity={0.92} /></mesh>
        </group>
      </group>
    </group>
    <group ref={cardsRoot}><Cards dark={dark} mobile={mobile} opacity={cardOpacity} time={time} /></group>
  </>;
}

function Lifecycle({ onFailure }: { onFailure: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const lost = (e: Event) => { e.preventDefault(); onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  return null;
}

export default function PhoneScene(props: Props) {
  const { mobile, running } = props;
  // El canvas cubre todo el hero: la resolución es el costo principal en GPUs integradas.
  // Tope 1.5 (antes 2), sin MSAA cuando la pantalla ya es densa; Phone baja la resolución si no se sostienen los cuadros.
  const [maxDpr] = useState(() => Math.min(window.devicePixelRatio || 1, 1.5));
  const [antialias] = useState(() => !mobile && maxDpr < 1.5);
  return <Canvas
    dpr={maxDpr} camera={{ position: [0, 0, 8], fov: 30 }}
    frameloop={running ? "demand" : "never"}
    gl={{ alpha: true, antialias, powerPreference: "high-performance" }}
    resize={{ scroll: false }} fallback={null} aria-hidden="true" style={{ touchAction: "pan-y" }}
  >
    <ambientLight intensity={0.5} />
    <directionalLight position={[3, 4, 6]} intensity={2.2} />
    <directionalLight position={[-5, 1, -2]} intensity={1.6} color="#55d9ef" />
    <Environment resolution={64} frames={1}>
      <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[8, 2, 1]} />
      <Lightformer form="rect" intensity={2} color="#80b4ff" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
      <Lightformer form="rect" intensity={1.4} color="#55d9ef" position={[5, -1, -2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
    </Environment>
    <Lifecycle onFailure={props.onFailure} />
    <Suspense fallback={null}><Phone {...props} maxDpr={maxDpr} /></Suspense>
  </Canvas>;
}
