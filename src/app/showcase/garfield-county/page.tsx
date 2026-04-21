'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useDemoTracker } from '@/components/demos/DemoTracker';
import { DemoTrackingProvider } from '@/components/demos/DemoTrackingContext';
import StandardsMasteryHeatmap, {
  CellCoord,
} from '@/components/showcase/garfield/StandardsMasteryHeatmap';
import ExitTicketLiveUpdate from '@/components/showcase/garfield/ExitTicketLiveUpdate';
import InterventionGroupsPanel from '@/components/showcase/garfield/InterventionGroupsPanel';
import GarfieldMathSolver from '@/components/showcase/garfield/GarfieldMathSolver';

const ACCENT = '#8B1A1A';
const ACCENT_SOFT = '#FEF2F2';

const ACCESS_CODE = 'PANGUITCH';

function AccessGate({ onAccessGranted }: { onAccessGranted: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (code.trim().toUpperCase() === ACCESS_CODE) {
        onAccessGranted();
      } else {
        setError('Invalid access code.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          'linear-gradient(135deg, #4A0E0E 0%, #8B1A1A 55%, #1F2937 100%)',
      }}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-5">
            <span className="text-3xl font-bold text-white">Σ</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Panguitch Middle Math
          </h1>
          <p className="text-red-100 text-sm">
            Prepared for Jace Howell.
            <br />
            Enter the access code to continue.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          <label
            htmlFor="access-code"
            className="block text-sm font-medium text-red-100 mb-2"
          >
            Access Code
          </label>
          <input
            id="access-code"
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError('');
            }}
            placeholder="Enter code"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-white/60 text-center text-lg tracking-widest uppercase"
            autoFocus
            autoComplete="off"
          />
          {error && (
            <p className="mt-2 text-sm text-red-200 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full mt-4 py-3 rounded-xl bg-white text-red-900 font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50"
          >
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
        <p className="text-center text-red-200/70 text-xs mt-6">
          Evelyn Learning · Demo preview
        </p>
      </div>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <div
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: ACCENT }}
        >
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && (
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">{subtitle}</p>
      )}
    </div>
  );
}

// Access gate temporarily disabled — the URL opens directly into the showcase.
// Flip this to `true` to re-enable the PANGUITCH code screen.
const REQUIRE_ACCESS_CODE = false;

export default function GarfieldCountyShowcase() {
  const [hasAccess, setHasAccess] = useState(!REQUIRE_ACCESS_CODE);
  const [checkingAccess, setCheckingAccess] = useState(REQUIRE_ACCESS_CODE);
  const [pulseCell, setPulseCell] = useState<CellCoord | null>(null);
  const [cellOverrides, setCellOverrides] = useState<Record<string, number>>(
    {}
  );
  const [highlightGroupId, setHighlightGroupId] = useState<string | null>(null);

  const { onView, onTry, trackInteraction } = useDemoTracker(
    'garfield-county',
    'Garfield County / Panguitch Middle'
  );

  useEffect(() => {
    if (!REQUIRE_ACCESS_CODE) return;
    const stored = sessionStorage.getItem('garfield_county_access');
    if (stored === 'verified') setHasAccess(true);
    setCheckingAccess(false);
  }, []);

  useEffect(() => {
    if (hasAccess) onView();
  }, [hasAccess, onView]);

  const handleAccessGranted = () => {
    sessionStorage.setItem('garfield_county_access', 'verified');
    setHasAccess(true);
  };

  const handlePulse = useCallback((coord: CellCoord) => {
    setPulseCell(coord);
    // Clear pulse after animation finishes so it can retrigger
    setTimeout(() => setPulseCell(null), 4000);
  }, []);

  const handleCellOverride = useCallback((key: string, value: number) => {
    setCellOverrides((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleInterventionAdded = useCallback(() => {
    setHighlightGroupId('systems-foundations');
    setTimeout(() => setHighlightGroupId(null), 5000);
  }, []);

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div
          className="animate-spin w-8 h-8 border-2 rounded-full"
          style={{ borderColor: '#E5E0DB', borderTopColor: ACCENT }}
        />
      </div>
    );
  }

  if (!hasAccess) {
    return <AccessGate onAccessGranted={handleAccessGranted} />;
  }

  return (
    <DemoTrackingProvider trackInteraction={trackInteraction}>
      <div
        className="min-h-screen"
        style={{ backgroundColor: '#F9FAFB' }}
        onClick={onTry}
      >
        {/* Branded header */}
        <header
          className="border-b"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
        >
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: ACCENT }}
              >
                Σ
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Prepared for
                </div>
                <div className="text-sm font-bold text-gray-900">
                  Panguitch Middle School — Grade 8 Math, Utah Core
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Evelyn Learning · Demo preview for Jace Howell
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-10 space-y-14">
          {/* SECTION 1 — Hero */}
          <section>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ backgroundColor: ACCENT_SOFT, color: ACCENT }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
              Grade 8 · Utah Core Math · Demo built for Jace Howell
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Live mastery tracking and intervention,{' '}
              <span style={{ color: ACCENT }}>
                built for Panguitch Middle Math
              </span>
              .
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl leading-relaxed">
              The layer that fills the gap between your Aspire benchmarks and
              your iReady diagnostics — day-by-day, standard-by-standard,
              student-by-student.
            </p>
          </section>

          {/* SECTION 2 — Heatmap */}
          <section>
            <SectionTitle
              eyebrow="Section 1 · Mastery heatmap"
              title="Every student, every Utah Core standard, at a glance."
              subtitle="Twenty simulated Panguitch Middle 8th graders across the eight core standards for the year. Click any cell to see the specific misconception behind the gap."
            />
            <StandardsMasteryHeatmap
              pulseCell={pulseCell}
              cellOverrides={cellOverrides}
            />
          </section>

          {/* SECTION 3 — Exit ticket live update */}
          <section>
            <SectionTitle
              eyebrow="Section 2 · On-the-go monitoring"
              title="The gap you named — solved in the middle of the period, not at the end of the week."
              subtitle="Press play. An exit ticket lands. The mastery model, the heatmap above, and the intervention queue below update together."
            />
            <ExitTicketLiveUpdate
              onPulse={handlePulse}
              onCellOverride={handleCellOverride}
              onInterventionAdded={handleInterventionAdded}
            />
          </section>

          {/* SECTION 4 — Intervention groups */}
          <section>
            <SectionTitle
              eyebrow="Section 3 · Intervention groups"
              title="The groups form themselves."
              subtitle="Pulled directly from the heatmap — three groups the data already tells you to run this week."
            />
            <InterventionGroupsPanel highlightGroupId={highlightGroupId} />
          </section>

          {/* SECTION 5 — Student experience (Math Solver) */}
          <section>
            <SectionTitle
              eyebrow="Section 4 · The student experience"
              title="Word-problem-first. Never hands over the answer."
              subtitle="This is what your students see when they're stuck after school. Pick one of the three examples — each one maps to a specific pain point you named."
            />
            <GarfieldMathSolver />
          </section>

          {/* SECTION 6 — Integration story */}
          <section>
            <SectionTitle
              eyebrow="Section 5 · Integration"
              title="Fits into the stack you already run."
              subtitle="We don't replace iReady or ask your students to leave Canvas. We extend both."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* iReady */}
              <div
                className="rounded-2xl border p-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                }}
              >
                <div className="text-xs font-bold uppercase tracking-wide mb-3 text-gray-500">
                  Works with iReady
                </div>
                <svg viewBox="0 0 400 160" className="w-full h-auto mb-3">
                  <defs>
                    <marker
                      id="ireadyArrow"
                      markerWidth="10"
                      markerHeight="10"
                      refX="8"
                      refY="5"
                      orient="auto"
                    >
                      <path d="M0,0 L8,5 L0,10 Z" fill="#9CA3AF" />
                    </marker>
                  </defs>
                  {/* Sources */}
                  <g>
                    <rect
                      x="10"
                      y="10"
                      width="110"
                      height="30"
                      rx="6"
                      fill="#EFF6FF"
                      stroke="#BFDBFE"
                    />
                    <text
                      x="65"
                      y="30"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#1E40AF"
                      fontWeight="600"
                    >
                      iReady diagnostic
                    </text>
                    <rect
                      x="10"
                      y="50"
                      width="110"
                      height="30"
                      rx="6"
                      fill="#FEF3C7"
                      stroke="#FCD34D"
                    />
                    <text
                      x="65"
                      y="70"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#92400E"
                      fontWeight="600"
                    >
                      Exit tickets
                    </text>
                    <rect
                      x="10"
                      y="90"
                      width="110"
                      height="30"
                      rx="6"
                      fill="#F3E8FF"
                      stroke="#D8B4FE"
                    />
                    <text
                      x="65"
                      y="110"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#6B21A8"
                      fontWeight="600"
                    >
                      Practice sets
                    </text>
                    <rect
                      x="10"
                      y="130"
                      width="110"
                      height="25"
                      rx="6"
                      fill="#DCFCE7"
                      stroke="#86EFAC"
                    />
                    <text
                      x="65"
                      y="147"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#166534"
                      fontWeight="600"
                    >
                      Aspire benchmarks
                    </text>
                  </g>
                  {/* Arrows */}
                  <g
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    fill="none"
                    markerEnd="url(#ireadyArrow)"
                  >
                    <path d="M 125 25 L 240 80" />
                    <path d="M 125 65 L 240 80" />
                    <path d="M 125 105 L 240 85" />
                    <path d="M 125 143 L 240 90" />
                  </g>
                  {/* Mastery model */}
                  <rect
                    x="240"
                    y="60"
                    width="150"
                    height="50"
                    rx="8"
                    fill="#8B1A1A"
                  />
                  <text
                    x="315"
                    y="85"
                    textAnchor="middle"
                    fontSize="12"
                    fill="white"
                    fontWeight="700"
                  >
                    Evelyn mastery model
                  </text>
                  <text
                    x="315"
                    y="100"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#FECACA"
                  >
                    per student × per standard
                  </text>
                </svg>
                <p className="text-xs text-gray-600 italic">
                  We don&apos;t replace iReady — we extend it with day-to-day
                  resolution.
                </p>
              </div>

              {/* Canvas */}
              <div
                className="rounded-2xl border p-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                }}
              >
                <div className="text-xs font-bold uppercase tracking-wide mb-3 text-gray-500">
                  Canvas integration
                </div>
                <svg viewBox="0 0 400 160" className="w-full h-auto mb-3">
                  <defs>
                    <marker
                      id="canvasArrow"
                      markerWidth="10"
                      markerHeight="10"
                      refX="8"
                      refY="5"
                      orient="auto"
                    >
                      <path d="M0,0 L8,5 L0,10 Z" fill="#9CA3AF" />
                    </marker>
                  </defs>
                  {/* Canvas block */}
                  <rect
                    x="10"
                    y="50"
                    width="120"
                    height="60"
                    rx="8"
                    fill="#DC2626"
                  />
                  <text
                    x="70"
                    y="78"
                    textAnchor="middle"
                    fontSize="14"
                    fill="white"
                    fontWeight="700"
                  >
                    Canvas LMS
                  </text>
                  <text
                    x="70"
                    y="95"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#FECACA"
                  >
                    single sign-on
                  </text>

                  {/* Evelyn block */}
                  <rect
                    x="270"
                    y="50"
                    width="120"
                    height="60"
                    rx="8"
                    fill="#8B1A1A"
                  />
                  <text
                    x="330"
                    y="78"
                    textAnchor="middle"
                    fontSize="13"
                    fill="white"
                    fontWeight="700"
                  >
                    Evelyn mastery
                  </text>
                  <text
                    x="330"
                    y="95"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#FECACA"
                  >
                    + homework helper
                  </text>

                  {/* Bidirectional arrows */}
                  <g stroke="#9CA3AF" strokeWidth="1.5" fill="none">
                    <path
                      d="M 135 68 L 265 68"
                      markerEnd="url(#canvasArrow)"
                    />
                    <text
                      x="200"
                      y="62"
                      textAnchor="middle"
                      fontSize="9"
                      fill="#6B7280"
                    >
                      SSO · assignments
                    </text>
                    <path
                      d="M 265 92 L 135 92"
                      markerEnd="url(#canvasArrow)"
                    />
                    <text
                      x="200"
                      y="106"
                      textAnchor="middle"
                      fontSize="9"
                      fill="#6B7280"
                    >
                      grades · completions
                    </text>
                  </g>

                  {/* Student */}
                  <circle cx="200" cy="30" r="14" fill="#F3F4F6" stroke="#9CA3AF" />
                  <text
                    x="200"
                    y="34"
                    textAnchor="middle"
                    fontSize="11"
                    fill="#374151"
                  >
                    👤
                  </text>
                  <text
                    x="200"
                    y="150"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6B7280"
                  >
                    Student never leaves Canvas
                  </text>
                </svg>
                <p className="text-xs text-gray-600 italic">
                  Assignments and grades flow through your existing Canvas
                  workflow. Students never leave their normal LMS.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 7 — Pilot concept */}
          <section>
            <div
              className="rounded-2xl p-8"
              style={{
                background:
                  'linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%)',
                border: `1px solid ${ACCENT}30`,
              }}
            >
              <div
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: ACCENT }}
              >
                Soft close
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                A shape for a pilot at Panguitch Middle.
              </h3>
              <div className="space-y-3 text-gray-700 leading-relaxed max-w-3xl">
                <p>
                  Start with your 8th grade math classrooms — roughly 60–80
                  students, one semester.
                </p>
                <p>
                  Weekly exit tickets aligned to your current Utah Core pacing
                  feed the mastery model; Homework Helper is available 24/7 for
                  struggling students on their Chromebooks.
                </p>
                <p>
                  Measure against 8th grade RISE performance at year-end vs.
                  prior cohort baseline.
                </p>
              </div>
              <p
                className="mt-5 text-sm italic"
                style={{ color: ACCENT }}
              >
                This is a conversation starter — we&apos;ll co-design the real
                pilot together if there&apos;s fit.
              </p>
            </div>
          </section>

          <footer className="pt-8 pb-4 border-t border-gray-200 text-xs text-gray-500 text-center">
            Evelyn Learning · Demo preview for Jace Howell, Computer Science
            Coordinator, Garfield County School District
          </footer>
        </main>
      </div>
    </DemoTrackingProvider>
  );
}
