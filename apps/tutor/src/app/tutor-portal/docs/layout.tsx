import type { Metadata } from 'next';
import { DocsSidebar } from './components/DocsSidebar';

export const metadata: Metadata = {
  title: 'Documentation',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
        {/* Sidebar — hidden on mobile, visible on lg+ */}
        <aside className="hidden lg:block">
          <DocsSidebar />
        </aside>

        {/* Content */}
        <article className="min-w-0 max-w-3xl">{children}</article>
      </div>
    </div>
  );
}
