interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ children, language, title }: CodeBlockProps) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-slate-200">
      {title && (
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500">
          {title}
        </div>
      )}
      <pre className="overflow-x-auto bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
        <code data-language={language}>{children}</code>
      </pre>
    </div>
  );
}
