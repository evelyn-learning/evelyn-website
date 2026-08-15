'use client';

import React from 'react';
import { Rocket, Check, ArrowRight, Target, ClipboardCheck, TrendingUp, Mail } from 'lucide-react';

const EVELYN_DELIVERS = [
  'Adaptive Regrouping Engine (real-time mastery-based group updates)',
  'Teacher Brief Generator (curriculum-specific daily instructional briefs)',
  'ELL Co-Pilot (WIDA-aligned, bilingual scaffolding with multimodal support)',
  'Classroom data ingestion & pedagogical ontology layer (the foundation for all of the above)',
  'Educator onboarding and iteration support',
];

const ROCKETSHIP_PROVIDES = [
  'Access to student data through existing systems (coordination with Jetpacked team)',
  'Sample classroom session recordings (audio, across math and literacy)',
  'Bi-weekly working sessions with Innovation School educators',
  'Identification of pilot campus and cohort',
];

const TIMELINE = [
  {
    phase: 'Phase 1',
    title: 'Build & Configure',
    dates: 'May – Jul 2026',
    color: '#2A7B6F',
    items: [
      'Data access & integration scoping',
      'Classroom recordings & ontology design',
      'Adaptive Regrouping engine v1',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Launch',
    dates: 'Aug – Sep 2026',
    color: '#C8402A',
    items: [
      'Innovation School go-live (1 grade level, ~100 students)',
      'Teacher onboarding (3 PD sessions)',
      'First month live instructional support',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Measure & Iterate',
    dates: 'Oct – Dec 2026',
    color: '#7C3AED',
    items: [
      'Measure grouping accuracy & instructional fidelity',
      'Iterate on ontology based on real classroom data',
      'Scope Phase 2 expansion (additional grade level or capability)',
    ],
  },
];

const METRICS = [
  {
    icon: Target,
    title: 'Grouping accuracy',
    description: '% of AI-suggested regroupings that teachers agree with',
    color: '#7C3AED',
  },
  {
    icon: ClipboardCheck,
    title: 'Instructional specificity',
    description:
      "Teacher brief recommendations rated as 'ready to execute' vs. needing interpretation",
    color: '#2A7B6F',
  },
  {
    icon: TrendingUp,
    title: 'Student mastery gains',
    description:
      'Innovation School cohort vs. comparison classrooms on Rocketship benchmarks',
    color: '#C8402A',
  },
];

export default function Section5Proposal() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      {/* Pilot Scope */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#E5E0DB' }}>
        <div className="px-6 py-4 border-b" style={{ backgroundColor: '#FFF8F5', borderColor: '#E5E0DB' }}>
          <h3 className="text-base font-bold" style={{ color: '#1A1A1A' }}>
            Proposed Pilot Scope — Fall 2026
          </h3>
          <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
            Rocketship Innovation School
          </p>
        </div>
        <div className="grid grid-cols-2 divide-x" style={{ borderColor: '#E5E0DB' }}>
          {/* Evelyn column */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2A7B6F' }}>
                <span className="text-white font-bold text-[10px]">E</span>
              </div>
              <span className="text-xs font-semibold" style={{ color: '#2A7B6F' }}>What Evelyn builds & enables</span>
            </div>
            <div className="space-y-3">
              {EVELYN_DELIVERS.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#2A7B6F' }} />
                  <span className="text-sm" style={{ color: '#1A1A1A' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Rocketship column */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#C8402A' }}>
                <Rocket className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-semibold" style={{ color: '#C8402A' }}>What Rocketship provides</span>
            </div>
            <div className="space-y-3">
              {ROCKETSHIP_PROVIDES.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#C8402A' }} />
                  <span className="text-sm" style={{ color: '#1A1A1A' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
        <h3 className="text-base font-bold mb-6" style={{ color: '#1A1A1A' }}>
          Implementation Timeline
        </h3>
        <div className="grid grid-cols-3 gap-5">
          {TIMELINE.map((phase, i) => (
            <div key={i} className="relative">
              {i < TIMELINE.length - 1 && (
                <ArrowRight className="absolute -right-3 top-8 w-5 h-5" style={{ color: '#E5E0DB' }} />
              )}
              <div className="rounded-xl border-2 p-4 h-full" style={{ borderColor: phase.color }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: phase.color }}>
                    {phase.phase}
                  </span>
                </div>
                <div className="text-sm font-bold mb-0.5" style={{ color: '#1A1A1A' }}>{phase.title}</div>
                <div className="text-[11px] mb-3" style={{ color: '#6B6B6B' }}>{phase.dates}</div>
                <div className="space-y-2">
                  {phase.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: phase.color }} />
                      <span className="text-xs" style={{ color: '#1A1A1A' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <div className="rounded-2xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
        <h3 className="text-base font-bold mb-4" style={{ color: '#1A1A1A' }}>
          How We Measure Success
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: '#FFF8F5' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: metric.color + '15' }}>
                  <Icon className="w-5 h-5" style={{ color: metric.color }} />
                </div>
                <div className="text-sm font-semibold mb-1" style={{ color: '#1A1A1A' }}>{metric.title}</div>
                <div className="text-xs" style={{ color: '#6B6B6B' }}>{metric.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#C8402A' }}>
        <h3 className="text-xl font-bold text-white mb-2">
          Ready to start?
        </h3>
        <p className="text-sm text-white/80 mb-6">
          Let&apos;s agree on a data sharing protocol this week.
        </p>
        <a
          href="mailto:praveen@evelynlearning.com?subject=Rocketship%20Innovation%20School%20-%20Next%20Steps&body=Hi%20Praveen%2C%0A%0AFollowing%20up%20on%20our%20meeting%20about%20the%20Innovation%20School%20pilot.%20Let%27s%20discuss%20next%20steps%20for%20the%20data%20sharing%20protocol.%0A%0ABest%2C%0APreston"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white font-semibold text-sm transition-all hover:shadow-lg"
          style={{ color: '#C8402A' }}
        >
          <Mail className="w-4 h-4" />
          Contact Praveen — Let&apos;s Go
        </a>
        <p className="text-[11px] text-white/50 mt-4">
          praveen@evelynlearning.com
        </p>
      </div>
    </div>
  );
}
