import type { ReactNode } from "react";

/**
 * Common chrome for every slide: full-viewport dark panel, ambient purple/
 * blue glow, a kicker + title + optional subtitle, and a content region.
 * Every slide in slides/ wraps its body in this so the deck reads as one
 * system rather than 14 one-off pages.
 */
export function SlideShell({
  kicker,
  title,
  subtitle,
  align = "start",
  width = "wide",
  children,
}: {
  kicker?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  align?: "start" | "center";
  width?: "wide" | "full";
  children?: ReactNode;
}) {
  return (
    <div className="relative flex h-full w-full flex-col justify-center overflow-hidden bg-slate-950 px-8 py-14 text-white sm:px-14 md:px-20 md:py-16">
      {/* Ambient glow — echoes the marketing hero's radial purple/blue wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 10%, rgba(122,42,142,0.35) 0%, transparent 55%), radial-gradient(circle at 85% 90%, rgba(14,165,233,0.18) 0%, transparent 55%)",
        }}
      />
      <div
        className={[
          "relative z-10 mx-auto flex w-full flex-1 flex-col",
          width === "wide" ? "max-w-[1500px]" : "max-w-none",
          align === "center" ? "items-center text-center" : "items-start",
          "justify-center",
        ].join(" ")}
      >
        {kicker && (
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-300 sm:text-sm">
            {kicker}
          </span>
        )}
        {title && (
          <h2 className="font-heading mt-3 text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.4rem]">
            {title}
          </h2>
        )}
        {subtitle && (
          <p
            className={[
              "mt-5 text-lg leading-relaxed text-slate-300 sm:text-xl md:text-2xl",
              align === "center" ? "max-w-3xl" : "max-w-4xl",
            ].join(" ")}
          >
            {subtitle}
          </p>
        )}
        {children && <div className="mt-9 w-full md:mt-11">{children}</div>}
      </div>
    </div>
  );
}
