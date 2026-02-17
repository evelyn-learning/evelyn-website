'use client';

import React, { useState } from 'react';

// ─── Simulated data for Aiden, Grade 6 ───────────────────────────────
interface SkillNode {
  id: string;
  label: string;
  status: 'mastered' | 'in_progress' | 'needs_work' | 'not_started';
  score: number;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

const SKILL_NODES: SkillNode[] = [
  { id: 'number-sense', label: 'Number Sense', status: 'mastered', score: 88, x: 150, y: 60 },
  { id: 'fractions', label: 'Fractions', status: 'needs_work', score: 54, x: 80, y: 180 },
  { id: 'decimals', label: 'Decimals', status: 'in_progress', score: 71, x: 280, y: 160 },
  { id: 'ratios', label: 'Ratios', status: 'needs_work', score: 41, x: 180, y: 290 },
  { id: 'geometry', label: 'Geometry', status: 'mastered', score: 92, x: 400, y: 80 },
  { id: 'data-analysis', label: 'Data Analysis', status: 'not_started', score: 0, x: 420, y: 250 },
];

const CONNECTIONS: Connection[] = [
  { from: 'number-sense', to: 'fractions' },
  { from: 'number-sense', to: 'decimals' },
  { from: 'fractions', to: 'ratios' },
  { from: 'decimals', to: 'ratios' },
  { from: 'number-sense', to: 'geometry' },
  { from: 'geometry', to: 'data-analysis' },
];

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string; ring: string; label: string }> = {
  mastered: { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-700', ring: 'ring-green-300', label: 'Mastered' },
  in_progress: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700', ring: 'ring-yellow-300', label: 'In Progress' },
  needs_work: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-700', ring: 'ring-red-300', label: 'Needs Work' },
  not_started: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-500', ring: 'ring-gray-200', label: 'Not Started' },
};

const STRENGTHS = [
  { topic: 'Geometry', score: 92, color: 'bg-green-500' },
  { topic: 'Number Sense', score: 88, color: 'bg-green-500' },
];

const WEAKNESSES = [
  { topic: 'Fractions', score: 54, color: 'bg-red-500' },
  { topic: 'Ratios', score: 41, color: 'bg-red-500' },
];

export default function AdaptiveLearningPath() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const overallProgress = 62;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-5 border-b border-purple-50 bg-gradient-to-r from-purple-50 to-white">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-purple-600">4.</span> Adaptive Learning Path
        </h2>
        <p className="text-gray-600 mt-1">
          AI-powered personalization that adapts to each student&apos;s strengths and weaknesses
        </p>
      </div>

      <div className="p-6">
        {/* Student Profile */}
        <div className="flex items-center gap-4 mb-6 bg-purple-50 rounded-xl p-4">
          <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
            A
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">Aiden Chen</h3>
            <p className="text-sm text-gray-600">Grade 6 Mathematics &bull; BC Curriculum</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Overall Progress</p>
            <p className="text-2xl font-bold text-purple-600">{overallProgress}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Grade 6 Math Completion</span>
            <span className="text-sm font-semibold text-purple-600">{overallProgress}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skill Tree (SVG) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Skill Map
            </h4>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 overflow-hidden">
              <svg viewBox="0 0 520 360" className="w-full h-auto" style={{ minHeight: 280 }}>
                {/* Connections */}
                {CONNECTIONS.map((conn) => {
                  const from = SKILL_NODES.find((n) => n.id === conn.from)!;
                  const to = SKILL_NODES.find((n) => n.id === conn.to)!;
                  const fromStatus = STATUS_COLORS[from.status];
                  const isActive = from.status === 'mastered' || from.status === 'in_progress';

                  return (
                    <line
                      key={`${conn.from}-${conn.to}`}
                      x1={from.x + 40}
                      y1={from.y + 25}
                      x2={to.x + 40}
                      y2={to.y + 25}
                      stroke={isActive ? fromStatus.border.replace('border-', '#').replace('green-400', '4ade80').replace('yellow-400', 'facc15').replace('red-400', 'f87171') : '#d1d5db'}
                      strokeWidth={isActive ? 3 : 2}
                      strokeDasharray={isActive ? 'none' : '6 4'}
                      opacity={0.6}
                    />
                  );
                })}

                {/* Nodes */}
                {SKILL_NODES.map((node) => {
                  const colors = STATUS_COLORS[node.status];
                  const isHovered = hoveredNode === node.id;
                  const isRecommended = node.id === 'fractions';

                  // Color mapping for SVG
                  const fillColors: Record<string, string> = {
                    mastered: '#dcfce7',
                    in_progress: '#fef9c3',
                    needs_work: '#fee2e2',
                    not_started: '#f3f4f6',
                  };
                  const strokeColors: Record<string, string> = {
                    mastered: '#4ade80',
                    in_progress: '#facc15',
                    needs_work: '#f87171',
                    not_started: '#d1d5db',
                  };
                  const textColors: Record<string, string> = {
                    mastered: '#15803d',
                    in_progress: '#a16207',
                    needs_work: '#b91c1c',
                    not_started: '#6b7280',
                  };

                  return (
                    <g
                      key={node.id}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className="cursor-pointer"
                    >
                      {/* Glow for recommended */}
                      {isRecommended && (
                        <circle
                          cx={node.x + 40}
                          cy={node.y + 25}
                          r={42}
                          fill="none"
                          stroke="#7c3aed"
                          strokeWidth={2}
                          strokeDasharray="4 3"
                          opacity={0.6}
                        >
                          <animate attributeName="r" values="42;46;42" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Node circle */}
                      <rect
                        x={node.x}
                        y={node.y}
                        width={80}
                        height={50}
                        rx={12}
                        fill={fillColors[node.status]}
                        stroke={isHovered ? '#7c3aed' : strokeColors[node.status]}
                        strokeWidth={isHovered ? 3 : 2}
                      />

                      {/* Label */}
                      <text
                        x={node.x + 40}
                        y={node.y + 22}
                        textAnchor="middle"
                        fill={textColors[node.status]}
                        fontSize={11}
                        fontWeight={600}
                      >
                        {node.label}
                      </text>

                      {/* Score */}
                      <text
                        x={node.x + 40}
                        y={node.y + 40}
                        textAnchor="middle"
                        fill={textColors[node.status]}
                        fontSize={13}
                        fontWeight={700}
                      >
                        {node.score > 0 ? `${node.score}%` : '—'}
                      </text>

                      {/* Recommended badge */}
                      {isRecommended && (
                        <>
                          <rect x={node.x - 2} y={node.y - 18} width={84} height={16} rx={8} fill="#7c3aed" />
                          <text x={node.x + 40} y={node.y - 7} textAnchor="middle" fill="white" fontSize={9} fontWeight={600}>
                            RECOMMENDED
                          </text>
                        </>
                      )}

                      {/* Tooltip on hover */}
                      {isHovered && (
                        <g>
                          <rect
                            x={node.x - 20}
                            y={node.y + 56}
                            width={120}
                            height={24}
                            rx={6}
                            fill="white"
                            stroke="#e5e7eb"
                          />
                          <text
                            x={node.x + 40}
                            y={node.y + 72}
                            textAnchor="middle"
                            fill="#6b7280"
                            fontSize={10}
                          >
                            {colors.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-3 justify-center">
                {Object.entries(STATUS_COLORS).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs">
                    <div className={`w-3 h-3 rounded-full ${val.bg} border ${val.border}`} />
                    <span className="text-gray-500">{val.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel: Strengths, Weaknesses & Recommendation */}
          <div className="space-y-5">
            {/* Strengths */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Strengths
              </h4>
              <div className="space-y-2">
                {STRENGTHS.map((s) => (
                  <div key={s.topic} className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-800">{s.topic}</span>
                      <span className="text-sm font-bold text-green-700">{s.score}%</span>
                    </div>
                    <div className="h-2 bg-green-200 rounded-full">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Areas to Improve
              </h4>
              <div className="space-y-2">
                {WEAKNESSES.map((w) => (
                  <div key={w.topic} className="bg-red-50 rounded-lg p-3 border border-red-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-800">{w.topic}</span>
                      <span className="text-sm font-bold text-red-700">{w.score}%</span>
                    </div>
                    <div className="h-2 bg-red-200 rounded-full">
                      <div className={`h-full ${w.color} rounded-full`} style={{ width: `${w.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h4 className="text-sm font-bold text-purple-800">AI Recommendation</h4>
              </div>
              <p className="text-sm text-purple-700 font-semibold mb-1">
                Next Lesson: Fractions — Comparing and Ordering
              </p>
              <p className="text-xs text-purple-600 leading-relaxed">
                Aiden should strengthen fractions before moving to ratios, since ratios build on fraction concepts. The adaptive engine has identified this as the highest-impact next step.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-right">
        <span className="text-xs text-gray-400">Powered by Evelyn Learning</span>
      </div>
    </div>
  );
}
