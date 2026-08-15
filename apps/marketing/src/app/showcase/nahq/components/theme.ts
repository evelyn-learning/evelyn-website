// Shared visual tokens for the NAHQ slide deck. SVG diagrams need literal
// hex values (Tailwind classes don't resolve inside inline SVG attributes),
// so this mirrors the brand palette from tailwind.config.ts (primary purple
// #7a2a8e family, secondary blue) plus a small set of dark-deck-only tokens.
export const COLORS = {
  // Backdrops
  bgBase: "#020617", // slate-950
  bgPanel: "#0b1220", // between slate-950/900, used for card fills
  bgPanelAlt: "#111827", // slate-900-ish, used for nested panels
  border: "rgba(148, 163, 184, 0.18)", // slate-400 @ 18%
  borderStrong: "rgba(148, 163, 184, 0.32)",

  // Brand purple (matches tailwind primary.*)
  primary100: "#ebe1ef",
  primary200: "#d6c3df",
  primary300: "#c2a5cf",
  primary400: "#ad87bf",
  primary500: "#7a2a8e",
  primary600: "#6e2680",
  primary700: "#5c1f6a",

  // Brand secondary blue
  secondary300: "#7dd3fc",
  secondary400: "#38bdf8",
  secondary500: "#0ea5e9",

  // Accent semantics (evidence/status colors used across diagrams)
  amber: "#f59e0b",
  emerald: "#34d399",
  rose: "#fb7185",
  slateText: "#e2e8f0",

  textPrimary: "#f8fafc",
  textSecondary: "#cbd5e1",
  textMuted: "#94a3b8",
  textFaint: "#64748b",
} as const;

export const FONT_MONO =
  "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
