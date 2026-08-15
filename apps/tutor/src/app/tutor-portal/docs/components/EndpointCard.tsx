interface EndpointCardProps {
  method: string;
  path: string;
  description: string;
}

const methodColors: Record<string, string> = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-amber-100 text-amber-700',
  DELETE: 'bg-red-100 text-red-700',
};

export function EndpointCard({ method, path, description }: EndpointCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 px-4 py-3">
      <span
        className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-xs font-bold ${
          methodColors[method] || 'bg-slate-100 text-slate-700'
        }`}
      >
        {method}
      </span>
      <div className="min-w-0">
        <code className="text-sm font-mono text-slate-800">{path}</code>
        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}
