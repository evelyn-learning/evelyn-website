'use client';

/**
 * Dev-only topic-notes inspector. NOT linked from production UI;
 * accessible at /tutor/dev/notes?studentId=<id>&baselineId=<id>. Read-only
 * (with delete-overlay support per Q8g).
 *
 * Purpose: verify the topic-notes pipeline end-to-end on the existing
 * demo tutor — start a session in an AP Macro U4 plan, complete ≥3
 * segments to clear the warmup gate, observe the brain firing
 * expand_topic_notes_theory / add_topic_notes_method /
 * add_topic_notes_pointer, then refresh this page to see the rendered
 * baseline + per-student overlays merged.
 *
 * Mirrors /tutor/dev/gaps. Auto-refetches on tab focus to handle the
 * common "end session, switch tabs" race where the PATCH is still in
 * flight on first focus.
 */

import { useEffect, useState } from 'react';

interface DiagramSpec {
  type: string;
  params: Record<string, unknown>;
}

interface SourceRef {
  type?: string;
  planId?: string;
  segmentId?: string;
  book?: string;
  chapter?: string;
  page?: number;
  exam?: string;
  frqNumber?: string;
  url?: string;
}

interface TheoryEntry {
  loId: string | null;
  kind?: string;
  title?: string;
  content: string;
  diagram?: DiagramSpec;
  sources?: SourceRef[];
}

interface MethodEntry {
  title: string;
  when_to_use?: string;
  steps: string[];
  example?: { problem: string; solution: string };
  diagram?: DiagramSpec;
  relatedLoIds?: string[];
  sources?: SourceRef[];
}

interface PointerEntry {
  content: string;
  kind?: string;
  relatedLoIds?: string[];
  sources?: SourceRef[];
}

interface OverlayCommon {
  overlayId: string;
  addedInSessionId: string;
  addedAt: string;
  rationale?: string;
  sourceGapId?: string;
  reinforcedInSessionIds?: string[];
  lastReinforcedAt?: string;
}

interface TheoryOverlay extends OverlayCommon {
  loId: string | null;
  kind: 'expansion' | 'prereq-refresher' | 'student-add';
  conceptLabel?: string;
  title?: string;
  content: string;
  diagram?: DiagramSpec;
}

interface MethodOverlay extends OverlayCommon, MethodEntry {
  alternativeTo?: string;
}

interface PointerOverlay extends OverlayCommon, PointerEntry {}

interface RenderedTopicNotes {
  baselineId: string;
  course: string;
  cedUnit: number;
  cedTopic: string;
  cedTitle: string;
  baselineVersion: number;
  theory: {
    prereqRefreshers: TheoryOverlay[];
    perLO: Array<{ loId: string; baseline: TheoryEntry[]; expansions: TheoryOverlay[] }>;
    studentAdds: TheoryOverlay[];
    orphans: TheoryOverlay[];
  };
  methods: { baseline: MethodEntry[]; overlays: MethodOverlay[] };
  pointers: { baseline: PointerEntry[]; overlays: PointerOverlay[] };
}

const KNOWN_BASELINES: Array<{ id: string; label: string }> = [
  { id: 'evelyn.ap.macro.loanable-funds-market.v1', label: 'U4.7 Loanable Funds (calibration)' },
  { id: 'evelyn.ap.macro.functions-of-money.v1', label: 'U4.3 Functions of Money' },
  { id: 'evelyn.ap.macro.banking-money-creation.v1', label: 'U4.5 Banking & Money Creation' },
  { id: 'evelyn.ap.macro.financial-assets.v1', label: 'U4.2 Financial Assets' },
  { id: 'evelyn.ap.macro.nominal-vs-real-interest-rates.v1', label: 'U4.1 Nominal vs Real Interest Rates' },
  { id: 'evelyn.ap.macro.money-market.v1', label: 'U4.6 Money Market' },
  { id: 'evelyn.ap.macro.monetary-policy.v1', label: 'U4.6 Monetary Policy' },
];

function kindBadge(kind?: string): string {
  if (!kind) return 'bg-gray-100 text-gray-700';
  if (kind === 'expansion') return 'bg-blue-100 text-blue-900 border border-blue-300';
  if (kind === 'prereq-refresher') return 'bg-purple-100 text-purple-900 border border-purple-300';
  if (kind === 'student-add') return 'bg-amber-100 text-amber-900 border border-amber-300';
  if (kind === 'gotcha' || kind === 'common-error') return 'bg-red-100 text-red-900';
  if (kind === 'frq-vocab') return 'bg-indigo-100 text-indigo-900';
  if (kind === 'edge-case') return 'bg-orange-100 text-orange-900';
  if (kind === 'tip') return 'bg-green-100 text-green-900';
  if (kind === 'definition') return 'bg-cyan-100 text-cyan-900';
  if (kind === 'formula' || kind === 'identity') return 'bg-violet-100 text-violet-900';
  if (kind === 'framework' || kind === 'shifter-list') return 'bg-slate-100 text-slate-900';
  return 'bg-gray-100 text-gray-700';
}

export default function NotesDevPage() {
  const [studentId, setStudentId] = useState('');
  const [baselineId, setBaselineId] = useState('');
  const [data, setData] = useState<RenderedTopicNotes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastFetchedAt, setLastFetchedAt] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStudentId(params.get('studentId') ?? '');
    setBaselineId(params.get('baselineId') ?? '');
  }, []);

  useEffect(() => {
    if (!studentId || !baselineId) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/tutor/topic-notes/${encodeURIComponent(studentId)}/${encodeURIComponent(baselineId)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`)))
      .then((d: RenderedTopicNotes) => {
        setData(d);
        setLastFetchedAt(new Date().toLocaleTimeString());
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [studentId, baselineId, refreshKey]);

  // Auto-refetch when the tab regains focus — same workflow as the gaps
  // inspector. End the session, switch back, this page re-fetches.
  useEffect(() => {
    function onFocus() {
      setRefreshKey((k) => k + 1);
    }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  async function deleteOverlay(bucket: 'theory' | 'methods' | 'pointers', overlayId: string) {
    if (!confirm(`Delete this ${bucket} overlay? Cannot be undone.`)) return;
    try {
      const res = await fetch(
        `/api/tutor/topic-notes/${encodeURIComponent(studentId)}/${encodeURIComponent(baselineId)}/${encodeURIComponent(overlayId)}?bucket=${bucket}`,
        { method: 'DELETE' },
      );
      if (!res.ok) {
        alert(`Delete failed: HTTP ${res.status}`);
        return;
      }
      refresh();
    } catch (err) {
      alert(`Delete error: ${String(err)}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-mono text-sm text-gray-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-1 text-2xl font-bold">Topic notes — dev inspector</h1>
        <p className="mb-4 text-xs text-gray-600">
          Read-only view of the merged baseline + per-student overlays.
          Run a tutor session on an AP Macro U4 plan, complete ≥3 segments
          to clear the warmup gate, then come back here.
        </p>

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <label className="text-xs uppercase tracking-wide text-gray-500">studentId:</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. demo-student-001"
            className="flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 font-mono"
          />
        </div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <label className="text-xs uppercase tracking-wide text-gray-500">baselineId:</label>
          <input
            type="text"
            value={baselineId}
            onChange={(e) => setBaselineId(e.target.value)}
            placeholder="e.g. evelyn.ap.macro.loanable-funds-market.v1"
            className="flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 font-mono text-xs"
          />
          <button
            onClick={refresh}
            className="rounded bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700"
          >
            Reload
          </button>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-gray-500">quick pick:</span>
          {KNOWN_BASELINES.map((b) => (
            <button
              key={b.id}
              onClick={() => setBaselineId(b.id)}
              className={`rounded border px-2 py-0.5 hover:bg-gray-100 ${
                baselineId === b.id ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-gray-300 text-gray-700'
              }`}
              title={b.id}
            >
              {b.label}
            </button>
          ))}
        </div>
        {lastFetchedAt && <div className="mb-3 text-[11px] text-gray-500">last fetched: {lastFetchedAt}</div>}

        {(!studentId || !baselineId) && (
          <div className="rounded border border-gray-200 bg-white p-4 text-gray-500">
            Provide both <code>studentId</code> and <code>baselineId</code> (in URL query params or above).
          </div>
        )}
        {loading && <div className="text-gray-500">Loading…</div>}
        {error && <div className="rounded border border-red-300 bg-red-50 p-3 text-red-800">Error: {error}</div>}

        {data && (
          <>
            {/* Header card */}
            <div className="mb-6 rounded border border-gray-300 bg-white p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">{data.course}</div>
              <h2 className="text-lg font-semibold">
                Unit {data.cedUnit} CED {data.cedTopic}: {data.cedTitle}
              </h2>
              <div className="mt-1 text-[11px] text-gray-500">
                baselineId: {data.baselineId} · v{data.baselineVersion}
              </div>
            </div>

            {/* Theory */}
            <Section title="Theory">
              {data.theory.prereqRefreshers.length > 0 && (
                <Subsection title={`Prerequisite refreshers (${data.theory.prereqRefreshers.length})`}>
                  {data.theory.prereqRefreshers.map((ov) => (
                    <OverlayCard key={ov.overlayId} ov={ov} bucket="theory" onDelete={deleteOverlay}>
                      {ov.conceptLabel && <div className="mb-1 text-xs italic text-gray-600">re: {ov.conceptLabel}</div>}
                      <div className="whitespace-pre-wrap text-gray-800">{ov.content}</div>
                    </OverlayCard>
                  ))}
                </Subsection>
              )}

              {data.theory.perLO.length === 0 ? (
                <div className="text-gray-500">(no baseline LOs)</div>
              ) : (
                data.theory.perLO.map((group) => (
                  <Subsection key={group.loId} title={`LO: ${group.loId}`}>
                    {group.baseline.map((b, i) => (
                      <BaselineCard key={i} kind={b.kind} title={b.title} content={b.content} diagram={b.diagram} />
                    ))}
                    {group.expansions.map((ov) => (
                      <OverlayCard key={ov.overlayId} ov={ov} bucket="theory" onDelete={deleteOverlay}>
                        {ov.title && <div className="mb-1 font-semibold">{ov.title}</div>}
                        <div className="whitespace-pre-wrap text-gray-800">{ov.content}</div>
                      </OverlayCard>
                    ))}
                  </Subsection>
                ))
              )}

              {data.theory.studentAdds.length > 0 && (
                <Subsection title={`Cross-LO additions (${data.theory.studentAdds.length})`}>
                  {data.theory.studentAdds.map((ov) => (
                    <OverlayCard key={ov.overlayId} ov={ov} bucket="theory" onDelete={deleteOverlay}>
                      {ov.title && <div className="mb-1 font-semibold">{ov.title}</div>}
                      <div className="whitespace-pre-wrap text-gray-800">{ov.content}</div>
                    </OverlayCard>
                  ))}
                </Subsection>
              )}

              {data.theory.orphans.length > 0 && (
                <Subsection title={`Older-session orphans (${data.theory.orphans.length}) — loId no longer in baseline`}>
                  {data.theory.orphans.map((ov) => (
                    <OverlayCard key={ov.overlayId} ov={ov} bucket="theory" onDelete={deleteOverlay}>
                      <div className="mb-1 text-[11px] text-amber-700">orphaned loId: {ov.loId ?? '(null)'}</div>
                      <div className="whitespace-pre-wrap text-gray-800">{ov.content}</div>
                    </OverlayCard>
                  ))}
                </Subsection>
              )}
            </Section>

            {/* Methods */}
            <Section title="Methods">
              {data.methods.baseline.length === 0 && data.methods.overlays.length === 0 && (
                <div className="text-gray-500">(no methods)</div>
              )}
              {data.methods.baseline.map((m, i) => (
                <BaselineMethodCard key={i} m={m} />
              ))}
              {data.methods.overlays.map((ov) => (
                <OverlayCard key={ov.overlayId} ov={ov} bucket="methods" onDelete={deleteOverlay}>
                  <div className="mb-1 font-semibold">
                    {ov.title}
                    {ov.alternativeTo && <span className="ml-2 text-xs italic text-gray-600">alt to: {ov.alternativeTo}</span>}
                  </div>
                  {ov.when_to_use && <div className="mb-1 text-xs italic text-gray-600">when: {ov.when_to_use}</div>}
                  <ol className="list-inside list-decimal text-gray-800">
                    {ov.steps.map((s, i) => (
                      <li key={i} className="mb-0.5 whitespace-pre-wrap">{s}</li>
                    ))}
                  </ol>
                </OverlayCard>
              ))}
            </Section>

            {/* Pointers */}
            <Section title="Pointers">
              {data.pointers.baseline.length === 0 && data.pointers.overlays.length === 0 && (
                <div className="text-gray-500">(no pointers)</div>
              )}
              {data.pointers.baseline.map((p, i) => (
                <BaselinePointerCard key={i} p={p} />
              ))}
              {data.pointers.overlays.length > 0 && (
                <Subsection title={`Pointers from your sessions (${data.pointers.overlays.length})`}>
                  {data.pointers.overlays.map((ov) => (
                    <OverlayCard key={ov.overlayId} ov={ov} bucket="pointers" onDelete={deleteOverlay}>
                      {ov.kind && <span className={`mr-2 rounded px-1.5 py-0.5 text-[10px] uppercase ${kindBadge(ov.kind)}`}>{ov.kind}</span>}
                      <span className="whitespace-pre-wrap text-gray-800">{ov.content}</span>
                    </OverlayCard>
                  ))}
                </Subsection>
              )}
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-700">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-600">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function BaselineCard({
  kind,
  title,
  content,
  diagram,
}: {
  kind?: string;
  title?: string;
  content: string;
  diagram?: DiagramSpec;
}) {
  return (
    <div className="rounded border border-gray-200 bg-white p-3">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-500">baseline</span>
        {kind && <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase ${kindBadge(kind)}`}>{kind}</span>}
        {title && <span className="font-semibold">{title}</span>}
      </div>
      <div className="whitespace-pre-wrap text-gray-800">{content}</div>
      {diagram && (
        <div className="mt-2 rounded border border-dashed border-gray-300 bg-gray-50 p-2 text-[11px] text-gray-600">
          📊 diagram: <code>{diagram.type}</code> · params: <code>{JSON.stringify(diagram.params)}</code>
        </div>
      )}
    </div>
  );
}

function BaselineMethodCard({ m }: { m: MethodEntry }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-3">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-500">baseline</span>
        <span className="font-semibold">{m.title}</span>
      </div>
      {m.when_to_use && <div className="mb-1 text-xs italic text-gray-600">when: {m.when_to_use}</div>}
      <ol className="list-inside list-decimal text-gray-800">
        {m.steps.map((s, i) => (
          <li key={i} className="mb-0.5 whitespace-pre-wrap">{s}</li>
        ))}
      </ol>
      {m.example && (
        <div className="mt-2 rounded border border-gray-200 bg-gray-50 p-2 text-xs">
          <div className="font-semibold text-gray-700">Example:</div>
          <div className="mt-1 text-gray-700"><b>Q:</b> {m.example.problem}</div>
          <div className="mt-1 text-gray-700"><b>A:</b> {m.example.solution}</div>
        </div>
      )}
      {m.diagram && (
        <div className="mt-2 rounded border border-dashed border-gray-300 bg-gray-50 p-2 text-[11px] text-gray-600">
          📊 diagram: <code>{m.diagram.type}</code> · params: <code>{JSON.stringify(m.diagram.params)}</code>
        </div>
      )}
    </div>
  );
}

function BaselinePointerCard({ p }: { p: PointerEntry }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-3">
      <div className="flex items-start gap-2">
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-500">baseline</span>
        {p.kind && <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase ${kindBadge(p.kind)}`}>{p.kind}</span>}
        <span className="flex-1 whitespace-pre-wrap text-gray-800">{p.content}</span>
      </div>
    </div>
  );
}

function OverlayCard({
  ov,
  bucket,
  onDelete,
  children,
}: {
  ov: OverlayCommon & { kind?: string; sourceGapId?: string };
  bucket: 'theory' | 'methods' | 'pointers';
  onDelete: (bucket: 'theory' | 'methods' | 'pointers', overlayId: string) => void;
  children: React.ReactNode;
}) {
  const reinforcedCount = ov.reinforcedInSessionIds?.length ?? 0;
  return (
    <div className="rounded border-l-4 border-amber-400 border border-amber-200 bg-amber-50 p-3">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-amber-900">overlay</span>
        {ov.kind && <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase ${kindBadge(ov.kind)}`}>{ov.kind}</span>}
        <span className="text-[11px] text-gray-600">{ov.addedAt.slice(0, 10)}</span>
        {reinforcedCount > 0 && (
          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-900">
            reinforced {reinforcedCount}×
          </span>
        )}
        {ov.sourceGapId && (
          <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] text-purple-900">
            ← gap {ov.sourceGapId.slice(0, 8)}
          </span>
        )}
        <button
          onClick={() => onDelete(bucket, ov.overlayId)}
          className="ml-auto rounded border border-red-300 bg-white px-2 py-0.5 text-[11px] text-red-700 hover:bg-red-50"
        >
          delete
        </button>
      </div>
      <div>{children}</div>
      {ov.rationale && (
        <div className="mt-2 border-l-2 border-gray-300 pl-2 text-[11px] italic text-gray-600">
          rationale: {ov.rationale}
        </div>
      )}
      <div className="mt-1 text-[10px] text-gray-500">
        sessionId: {ov.addedInSessionId.slice(0, 16)}…
      </div>
    </div>
  );
}
