from pathlib import Path
from PIL import Image
import hashlib, json, os, re, shutil

root = Path(r"C:\Users\brand\OneDrive\Desktop\Proyectos trabajo\Proyectos paginas wb\Ingenix-hub")
reference = root / "next-app"
v2 = root / "next-app-v2"
assert reference.is_dir() and v2.is_dir()
(v2 / "public/images").mkdir(parents=True, exist_ok=True)
(v2 / "public/brand").mkdir(parents=True, exist_ok=True)
(v2 / "public/nix").mkdir(parents=True, exist_ok=True)
for name in ["charly-alexa", "gama-studio", "textibajio", "cuellos-textiles-goar", "demo-tienda-online"]:
    Image.open(reference / "public/images" / (name + ".png")).convert("RGB").save(v2 / "public/images" / (name + ".webp"), "WEBP", quality=88, method=6)
shutil.copy2(reference / "public/images/logo_no_bg.png", v2 / "public/brand/logo.png")
shutil.copy2(reference / "public/mascota-ingenix/mascota-final.webp", v2 / "public/nix/nix.webp")
envtext = (reference / ".env.local").read_text(encoding="utf-8-sig")
names = ["GEMINI_API_KEY", "GEMINI_MODEL"]
lines = []
for name in names:
    found = re.search(r"^" + name + r"=(.*)$", envtext, re.M)
    if found:
        lines.append(name + "=" + found.group(1).rstrip())
lines.append("ALLOWED_ORIGIN=https://www.ingenixhub.com,http://127.0.0.1:4173,http://127.0.0.1:4174,http://localhost:4173,http://localhost:4174")
(v2 / ".env.local").write_text("\n".join(lines) + "\n", encoding="utf-8")
excluded = {".git", "node_modules", ".next", ".vercel"}
snapshot = {}
for appname in ["next-app", "legacy-site"]:
    for current, dirs, files in os.walk(root / appname):
        dirs[:] = [d for d in dirs if d not in excluded]
        for fname in files:
            path = Path(current) / fname
            if path.suffix == ".log": continue
            snapshot[str(path.relative_to(root))] = hashlib.sha256(path.read_bytes()).hexdigest()
(v2 / "qa-results").mkdir(exist_ok=True)
(v2 / "qa-results/reference-baseline.json").write_text(json.dumps(snapshot, indent=2), encoding="utf-8")
print("Assets optimizados/copias dentro V2. Env server-side copiado sin mostrar valores.")
print("Archivos de referencia registrados:", len(snapshot))

