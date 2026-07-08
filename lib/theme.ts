export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "sgc-theme";

export function getStoredTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable (private mode, disabled storage) — theme
    // still applies for this page view, just won't persist across visits.
  }
}

/** Inline, pre-hydration script string — sets data-theme before first paint
 * to avoid a flash of the wrong theme. Injected via a <script> tag in
 * app/layout.tsx <head>, not imported as a module (must run synchronously
 * before React hydrates). */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t="dark";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;
