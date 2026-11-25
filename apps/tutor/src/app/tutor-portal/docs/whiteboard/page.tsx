import type { Metadata } from 'next';
import { boardCounts, catalogueBySubject } from '../../data/board-catalogue';
import { boardGroups } from '../../data/whiteboard-types';
import { portalMetadata } from '../../seo';
import { DocsBreadcrumb } from '../components/DocsBreadcrumb';

export const metadata: Metadata = portalMetadata('/docs/whiteboard');

// 2026-11-24: this page listed 19 "types" from the first engine (the home page said 16) with command names
// that the tutor no longer uses. It now describes the board as the engine
// draws it: the groups are data/whiteboard-types.ts and every count and figure name is read from the engine
// (data/board-catalogue.ts).
export default function WhiteboardPage() {
  const counts = boardCounts();
  const catalogue = catalogueBySubject();

  return (
    <div>
      <DocsBreadcrumb path="/docs/whiteboard" />
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Whiteboard</h1>
      <p className="mb-8 text-lg text-slate-600">
        What the tutor writes and draws while it teaches.
      </p>

      <h2 className="mb-4 mt-8 text-xl font-semibold text-slate-900">Overview</h2>
      <p className="mb-4 text-sm text-slate-600">
        As the tutor explains, it puts the matching item on the board at the moment it speaks of it: an equation, a
        worked step, a graph, a diagram. The board is organised in pages, so a student can look back at earlier work.
        You do not build or render any of this. It all happens inside the embed.
      </p>
      <p className="mb-6 text-sm text-slate-600">The board has three kinds of content:</p>
      <ul className="mb-8 list-disc space-y-2 pl-5 text-sm text-slate-600">
        <li>
          <strong>Everyday items</strong> the tutor writes as it talks: equations, notes, problems, worked steps,
          tables, timelines, graphs, number lines, charts, maps, code and simple sketches.
        </li>
        <li>
          <strong>Catalogue figures</strong>: {counts.catalogueFigures} figures drawn exactly from a few parameters,
          for example a pulley system from its masses or a titration curve from its concentrations. The full list is
          below.
        </li>
        <li>
          <strong>Figures with a drawing tool of their own</strong>: {counts.toolFigures} more, such as circuits, ray
          diagrams, molecules, box plots, annotated passages and call stacks.
        </li>
      </ul>

      <h2 className="mb-4 mt-10 text-xl font-semibold text-slate-900">What it draws, by subject</h2>
      {boardGroups.map((group) => (
        <div key={group.id} className="mt-8">
          <h3 className="mb-1 text-lg font-semibold text-slate-900">{group.name}</h3>
          <p className="mb-4 text-sm text-slate-500">{group.summary}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.items.map((item) => (
              <div key={item.name} className="rounded-lg border border-slate-200 p-4">
                <h4 className="mb-1 font-semibold text-slate-900">{item.name}</h4>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <h2 className="mb-2 mt-12 text-xl font-semibold text-slate-900">The figure catalogue</h2>
      <p className="mb-6 text-sm text-slate-600">
        The {counts.catalogueFigures} catalogue figures, by subject. A figure used in more than one subject is listed
        under each. The tutor is offered the figures that fit the lesson&apos;s subject and level.
      </p>
      <div className="space-y-6">
        {catalogue.map((s) => (
          <div key={s.id}>
            <h3 className="mb-2 text-base font-semibold text-slate-900">{s.name}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{s.figures.join(' · ')}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-12 text-xl font-semibold text-slate-900">Board data for your analytics</h2>
      <p className="text-sm text-slate-600">
        The{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">evelyn:session_ended</code>{' '}
        browser event carries <code className="text-xs">whiteboard_items</code>, and{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /sessions/summary</code>{' '}
        returns <code className="text-xs">boardItems</code> per session. See{' '}
        <a href="/docs/webhooks" className="text-blue-600 underline">Webhooks and Events</a>.
      </p>
    </div>
  );
}
