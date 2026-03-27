// Bare layout — no portal shell, no nav, no footer.
// This page lives inside partner iframes.
export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
