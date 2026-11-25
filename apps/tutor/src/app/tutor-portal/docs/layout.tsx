import { DocsSidebar } from './components/DocsSidebar';

// 2026-11-24: no metadata here. This layout's title made every docs page "Documentation | Evelyn Voice Tutor";
// each page now sets its own title, description and canonical (portalMetadata in ../seo.ts).

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
