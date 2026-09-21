import { useEffect, useState } from "react";
import { Sun, Moon } from "./Icons";

type Mode = "light" | "dark";

function systemMode(): Mode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function stored(): Mode | null {
  try {
    const v = localStorage.getItem("leadrank-theme");
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null; // private mode / blocked storage — fall back to the system setting
  }
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>(() => stored() ?? systemMode());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    try { localStorage.setItem("leadrank-theme", mode); } catch { /* not fatal */ }
  }, [mode]);

  const next = mode === "dark" ? "light" : "dark";
  return (
    <button className="btn icon" onClick={() => setMode(next)}
      title={`Switch to ${next} mode`} aria-label={`Switch to ${next} mode`}>
      {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
