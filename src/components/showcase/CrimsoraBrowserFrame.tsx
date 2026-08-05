// Minimal fake-browser chrome that brands a screenshot as Crimsora's product.
// Mirrors the framing device Crimsora's own homepage hero uses.
export function CrimsoraBrowserFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div aria-hidden className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="mx-auto min-w-0 rounded-full bg-white px-4 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
          <span className="truncate">crimsora.com — {label}</span>
        </div>
        <div aria-hidden className="w-12" />
      </div>
      {children}
    </div>
  );
}
