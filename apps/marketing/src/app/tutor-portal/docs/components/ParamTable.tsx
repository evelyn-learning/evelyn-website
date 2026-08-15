interface Param {
  name: string;
  type: string;
  required?: boolean;
  description: string;
  example?: string;
}

interface ParamTableProps {
  params: Param[];
  showRequired?: boolean;
  showExample?: boolean;
}

export function ParamTable({ params, showRequired = true, showExample = false }: ParamTableProps) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-slate-200 text-left">
            <th className="pb-3 pr-4 font-medium text-slate-500">Parameter</th>
            <th className="pb-3 pr-4 font-medium text-slate-500">Type</th>
            {showRequired && <th className="pb-3 pr-4 font-medium text-slate-500">Required</th>}
            <th className="pb-3 pr-4 font-medium text-slate-500">Description</th>
            {showExample && <th className="pb-3 font-medium text-slate-500">Example</th>}
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.name} className="border-b border-slate-100">
              <td className="py-2.5 pr-4">
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-800">
                  {p.name}
                </code>
              </td>
              <td className="py-2.5 pr-4 text-slate-500">{p.type}</td>
              {showRequired && (
                <td className="py-2.5 pr-4">
                  {p.required ? (
                    <span className="text-xs font-medium text-red-600">Required</span>
                  ) : (
                    <span className="text-xs text-slate-400">Optional</span>
                  )}
                </td>
              )}
              <td className="py-2.5 pr-4 text-slate-600">{p.description}</td>
              {showExample && p.example && (
                <td className="py-2.5">
                  <code className="text-xs text-slate-500">{p.example}</code>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
