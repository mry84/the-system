"use client";

import { useEffect, useState } from "react";

function apply(theme: "light" | "dark") {
  document.documentElement.classList.toggle("light", theme === "light");
  localStorage.setItem("system-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#f3f3f3" : "#0b0b0b");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("system-theme");
    const next =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
    setTheme(next);
    apply(next);
  }, []);

  return (
    <button
      type="button"
      className="min-h-10 px-2 text-sm text-muted hover:text-paper"
      onClick={() => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        apply(next);
      }}
    >
      {theme === "light" ? "Night" : "Light"}
    </button>
  );
}
