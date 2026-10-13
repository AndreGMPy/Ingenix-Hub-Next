"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
function applyTheme(theme: "dark" | "light") {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach(meta => { meta.content = theme === "dark" ? "#080f1d" : "#f7f9fc"; });
}
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const sync = () => { const theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light"; applyTheme(theme); setDark(theme === "dark"); };
    sync();
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem("ingenix-v2-theme"); } catch {}
      if (!saved) { document.documentElement.dataset.theme = query.matches ? "dark" : "light"; sync(); }
    };
    query.addEventListener("change", onSystemChange);
    return () => query.removeEventListener("change", onSystemChange);
  }, []);
  const toggle = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("ingenix-v2-theme", next); } catch {}
    setDark(next === "dark");
  };
  return <button className="icon-button theme-toggle" type="button" onClick={toggle} aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"} aria-pressed={dark}>
    <Sun className="theme-sun" size={19} aria-hidden="true" /><Moon className="theme-moon" size={19} aria-hidden="true" />
  </button>;
}

