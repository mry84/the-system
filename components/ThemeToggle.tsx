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
      aria-label={theme === "light" ? "Night" : "Day"}
      className="grid size-11 place-items-center rounded-full text-muted hover:text-paper"
      onClick={() => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        apply(next);
      }}
    >
      {theme === "light" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21 14.3A8.5 8.5 0 0 1 9.7 3 7 7 0 1 0 21 14.3Z" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
