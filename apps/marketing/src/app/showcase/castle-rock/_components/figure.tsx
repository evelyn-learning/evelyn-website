import type { ReactNode } from "react";

/** Shared drawing colours so the four figures read as one set. */
export const C = {
  ink: "#14213a",
  muted: "#586580",
  grid: "#e6ebf2",
  blue: "#1d5bd0",
  rose: "#cf2f68",
  roseTint: "rgba(207,47,104,0.09)",
  green: "#177a50",
  amber: "#b45309",
  amberTint: "rgba(180,83,9,0.10)",
  blueTint: "rgba(29,91,208,0.08)",
  surface: "#ffffff",
};

/**
 * One group of marks that belongs to a step. During playback it stays hidden
 * until its step is reached, and anything inside with `cr-draw` is drawn in.
 */
export function Layer({ at, step, playing, children }: { at: number; step: number; playing: boolean; children: ReactNode }) {
  const cls = ["cr-layer", playing && step < at ? "cr-hidden" : "", playing && step === at ? "cr-now" : ""].join(" ");
  return <g className={cls}>{children}</g>;
}

export function Label({ x, y, children, fill = C.ink, anchor = "start", size = 15, weight = 600 }: {
  x: number; y: number; children: ReactNode; fill?: string; anchor?: "start" | "middle" | "end"; size?: number; weight?: number;
}) {
  return (
    <text x={x} y={y} fill={fill} textAnchor={anchor} fontSize={size} fontWeight={weight}>
      {children}
    </text>
  );
}

/** A variable inside a figure label, set in italics like the maths in the text. */
export function V({ children }: { children: ReactNode }) {
  return (
    <tspan fontStyle="italic" fontFamily="KaTeX_Math, 'Times New Roman', serif" fontSize="1.12em">
      {children}
    </tspan>
  );
}

export function ArrowHead({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill={color} />
    </marker>
  );
}
