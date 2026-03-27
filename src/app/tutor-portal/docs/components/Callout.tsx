interface CalloutProps {
  type?: 'info' | 'warning' | 'tip';
  title?: string;
  children: React.ReactNode;
}

const styles = {
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  tip: 'border-green-200 bg-green-50 text-green-800',
};

const icons = {
  info: 'i',
  warning: '!',
  tip: '*',
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  return (
    <div className={`my-4 rounded-lg border-l-4 px-4 py-3 text-sm ${styles[type]}`}>
      {title && (
        <p className="mb-1 font-semibold">
          <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-current/10 text-xs font-bold">
            {icons[type]}
          </span>
          {title}
        </p>
      )}
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
