'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';

// ── Types ───────────────────────────────────────────────────────────────────

interface StudentMetrics {
  attendance: number;
  assignmentCompletion: number;
  averageGrade: number;
  lmsEngagement: number;
  participationScore: number;
}

interface Student {
  id: string;
  name: string;
  grade: string;
  course: string;
  metrics: StudentMetrics;
  prevMetrics: StudentMetrics | null;
  actionsTaken: Set<string>;
}

// ── Constants ───────────────────────────────────────────────────────────────

const METRIC_KEYS: (keyof StudentMetrics)[] = [
  'attendance', 'assignmentCompletion', 'averageGrade', 'lmsEngagement', 'participationScore',
];

const METRIC_LABELS: Record<keyof StudentMetrics, string> = {
  attendance: 'Attendance',
  assignmentCompletion: 'Assignments',
  averageGrade: 'Avg Grade',
  lmsEngagement: 'LMS Usage',
  participationScore: 'Participation',
};

const METRIC_WEIGHTS: Record<keyof StudentMetrics, number> = {
  attendance: 0.25,
  assignmentCompletion: 0.25,
  averageGrade: 0.20,
  lmsEngagement: 0.15,
  participationScore: 0.15,
};

const GRADES = ['9th', '10th', '11th', '12th'];

const INITIAL_STUDENTS: Student[] = [
  {
    id: '1', name: 'Alex Thompson', grade: '10th', course: 'Algebra II',
    metrics: { attendance: 65, assignmentCompletion: 45, averageGrade: 58, lmsEngagement: 23, participationScore: 30 },
    prevMetrics: { attendance: 72, assignmentCompletion: 60, averageGrade: 68, lmsEngagement: 35, participationScore: 40 },
    actionsTaken: new Set(),
  },
  {
    id: '2', name: 'Maria Garcia', grade: '11th', course: 'AP Chemistry',
    metrics: { attendance: 85, assignmentCompletion: 70, averageGrade: 72, lmsEngagement: 55, participationScore: 45 },
    prevMetrics: { attendance: 90, assignmentCompletion: 78, averageGrade: 80, lmsEngagement: 65, participationScore: 55 },
    actionsTaken: new Set(),
  },
  {
    id: '3', name: 'Jordan Lee', grade: '9th', course: 'English Literature',
    metrics: { attendance: 92, assignmentCompletion: 85, averageGrade: 78, lmsEngagement: 70, participationScore: 60 },
    prevMetrics: { attendance: 90, assignmentCompletion: 83, averageGrade: 76, lmsEngagement: 68, participationScore: 58 },
    actionsTaken: new Set(),
  },
  {
    id: '4', name: 'Sam Patel', grade: '12th', course: 'AP Calculus',
    metrics: { attendance: 98, assignmentCompletion: 95, averageGrade: 91, lmsEngagement: 88, participationScore: 85 },
    prevMetrics: { attendance: 96, assignmentCompletion: 93, averageGrade: 88, lmsEngagement: 85, participationScore: 82 },
    actionsTaken: new Set(),
  },
  {
    id: '5', name: 'Casey Williams', grade: '10th', course: 'World History',
    metrics: { attendance: 75, assignmentCompletion: 60, averageGrade: 65, lmsEngagement: 40, participationScore: 35 },
    prevMetrics: { attendance: 80, assignmentCompletion: 68, averageGrade: 72, lmsEngagement: 50, participationScore: 45 },
    actionsTaken: new Set(),
  },
];

// ── Prediction engine ───────────────────────────────────────────────────────

function calcRiskScore(m: StudentMetrics): number {
  let score = 0;
  for (const key of METRIC_KEYS) {
    score += (100 - m[key]) * METRIC_WEIGHTS[key];
  }
  return Math.round(score);
}

type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}

function getTrend(current: StudentMetrics, prev: StudentMetrics | null): 'up' | 'down' | 'stable' {
  if (!prev) return 'stable';
  const avg = (m: StudentMetrics) => METRIC_KEYS.reduce((sum, k) => sum + m[k], 0) / 5;
  const diff = avg(current) - avg(prev);
  if (diff > 3) return 'up';
  if (diff < -3) return 'down';
  return 'stable';
}

function generateRiskFactors(m: StudentMetrics): string[] {
  const f: string[] = [];
  if (m.attendance < 70) f.push(`Critical attendance at ${m.attendance}% — missed over 30% of classes`);
  else if (m.attendance < 80) f.push(`Attendance declining — currently at ${m.attendance}%`);
  if (m.assignmentCompletion < 50) f.push(`Assignment completion critically low at ${m.assignmentCompletion}%`);
  else if (m.assignmentCompletion < 70) f.push(`Missing assignments — completion rate at ${m.assignmentCompletion}%`);
  if (m.averageGrade < 60) f.push(`Grade in danger zone at ${m.averageGrade}% — at risk of failing`);
  else if (m.averageGrade < 75) f.push(`Grade trending below target at ${m.averageGrade}%`);
  if (m.lmsEngagement < 40) f.push(`Minimal LMS engagement at ${m.lmsEngagement}% — may lack tech access`);
  else if (m.lmsEngagement < 60) f.push(`Reduced LMS activity at ${m.lmsEngagement}%`);
  if (m.participationScore < 40) f.push(`Low class participation at ${m.participationScore}%`);
  else if (m.participationScore < 60) f.push(`Declining participation score at ${m.participationScore}%`);
  return f;
}

function generateRecommendations(m: StudentMetrics): string[] {
  const r: string[] = [];
  const score = calcRiskScore(m);
  if (score >= 70) {
    r.push('Schedule immediate counselor intervention');
    r.push('Contact parent/guardian for urgent meeting');
  }
  if (m.attendance < 80) r.push('Investigate attendance barriers — schedule check-in');
  if (m.assignmentCompletion < 70) r.push('Offer assignment extension with structured support plan');
  if (m.averageGrade < 75) r.push('Arrange peer tutoring or study group');
  if (m.lmsEngagement < 60) r.push('Verify technology access and demonstrate LMS features');
  if (m.participationScore < 60) r.push('Explore alternative participation methods');
  if (score < 30 && r.length === 0) {
    r.push('Consider for advanced enrichment opportunities');
    r.push('Potential peer tutor candidate');
  }
  if (r.length === 0) r.push('Continue monitoring — student is on track');
  return r;
}

// ── Color helpers ───────────────────────────────────────────────────────────

const RISK_BADGE: Record<RiskLevel, string> = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
};

const RISK_BAR: Record<RiskLevel, string> = {
  low: 'bg-green-500', medium: 'bg-yellow-500', high: 'bg-orange-500', critical: 'bg-red-500',
};

function metricColor(v: number) {
  return v >= 80 ? 'text-green-600' : v >= 60 ? 'text-yellow-600' : v >= 40 ? 'text-orange-600' : 'text-red-600';
}

function trendIcon(t: 'up' | 'down' | 'stable') {
  return t === 'up' ? '↑' : t === 'down' ? '↓' : '→';
}

function trendColor(t: 'up' | 'down' | 'stable') {
  return t === 'up' ? 'text-green-600' : t === 'down' ? 'text-red-600' : 'text-gray-600';
}

function trendLabel(t: 'up' | 'down' | 'stable') {
  return t === 'up' ? 'Improving' : t === 'down' ? 'Declining' : 'Stable';
}

// ── Component ───────────────────────────────────────────────────────────────

export default function StudentSuccessPredictorDemo() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState('all');
  const [isSimulating, setIsSimulating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('10th');
  const [newCourse, setNewCourse] = useState('');
  const dashboardRef = useRef<HTMLDivElement>(null);

  const notify = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  // ── Derived ─────────────────────────────────────────────────────────────

  const enriched = useMemo(() => students.map(s => {
    const riskScore = calcRiskScore(s.metrics);
    return {
      ...s,
      riskScore,
      riskLevel: getRiskLevel(riskScore),
      trend: getTrend(s.metrics, s.prevMetrics),
      riskFactors: generateRiskFactors(s.metrics),
      recommendations: generateRecommendations(s.metrics),
    };
  }), [students]);

  const filtered = useMemo(() => {
    if (filterRisk === 'all') return enriched;
    return enriched.filter(s => s.riskLevel === filterRisk);
  }, [enriched, filterRisk]);

  const selected = enriched.find(s => s.id === selectedId) ?? null;

  const summary = useMemo(() => ({
    total: enriched.length,
    critical: enriched.filter(s => s.riskLevel === 'critical').length,
    high: enriched.filter(s => s.riskLevel === 'high').length,
    medium: enriched.filter(s => s.riskLevel === 'medium').length,
    low: enriched.filter(s => s.riskLevel === 'low').length,
  }), [enriched]);

  // ── Actions ─────────────────────────────────────────────────────────────

  const updateMetric = useCallback((studentId: string, key: keyof StudentMetrics, value: number) => {
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, metrics: { ...s.metrics, [key]: value } } : s
    ));
  }, []);

  const markAction = useCallback((studentId: string, recText: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const next = new Set(s.actionsTaken);
      next.add(recText);
      return { ...s, actionsTaken: next };
    }));
    notify('Action marked as taken');
  }, [notify]);

  const addStudent = () => {
    if (!newName.trim()) { notify('Please enter a student name'); return; }
    if (!newCourse.trim()) { notify('Please enter a course'); return; }
    const id = String(Date.now());
    const metrics: StudentMetrics = { attendance: 75, assignmentCompletion: 75, averageGrade: 75, lmsEngagement: 75, participationScore: 75 };
    setStudents(prev => [...prev, { id, name: newName.trim(), grade: newGrade, course: newCourse.trim(), metrics, prevMetrics: null, actionsTaken: new Set() }]);
    setSelectedId(id);
    setNewName('');
    setNewCourse('');
    setShowAddForm(false);
    notify(`Added ${newName.trim()} — adjust their metrics to see predictions`);
  };

  const simulateWeek = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setStudents(prev => prev.map(s => {
        const newMetrics = { ...s.metrics };
        for (const key of METRIC_KEYS) {
          const delta = Math.round((Math.random() - 0.45) * 12);
          newMetrics[key] = Math.max(0, Math.min(100, newMetrics[key] + delta));
        }
        return { ...s, prevMetrics: { ...s.metrics }, metrics: newMetrics, actionsTaken: new Set() };
      }));
      setIsSimulating(false);
      notify('Week simulated — metrics updated with new data');
      setTimeout(() => dashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }, 1500);
  };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="bg-gradient-to-br from-slate-50 to-amber-50 p-6 rounded-2xl relative">
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium">
          {notification}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            Interactive Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Student Success Predictor</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Adjust student metrics and watch the AI predict risk levels, identify factors, and generate recommendations in real time.
          </p>
        </div>

        {/* ── Summary Dashboard ──────────────────────────────────────────── */}
        <div ref={dashboardRef} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Risk Overview Dashboard</h3>
            <button
              onClick={simulateWeek}
              disabled={isSimulating}
              className="px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSimulating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Simulating&hellip;
                </>
              ) : (
                <>⏩ Simulate Next Week</>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-slate-800">{summary.total}</div>
              <div className="text-sm text-slate-500">Total Students</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
              <div className="text-3xl font-bold text-red-600">{summary.critical}</div>
              <div className="text-sm text-red-600">Critical Risk</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">{summary.high}</div>
              <div className="text-sm text-orange-600">High Risk</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600">{summary.medium}</div>
              <div className="text-sm text-yellow-600">Medium Risk</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
              <div className="text-3xl font-bold text-green-600">{summary.low}</div>
              <div className="text-sm text-green-600">Low Risk</div>
            </div>
          </div>
        </div>

        {/* ── Main Layout ────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Student List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Students</h3>
                <select
                  value={filterRisk}
                  onChange={e => setFilterRisk(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1"
                >
                  <option value="all">All Risks</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto">
                {filtered.map(student => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedId(student.id)}
                    className={`w-full p-3 rounded-xl text-left transition ${
                      selectedId === student.id
                        ? 'bg-amber-100 border-2 border-amber-400'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{student.name}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${RISK_BADGE[student.riskLevel]}`}>
                        {student.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{student.grade} &middot; {student.course}</span>
                      <span className={trendColor(student.trend)}>{trendIcon(student.trend)}</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${RISK_BAR[student.riskLevel]}`}
                        style={{ width: `${student.riskScore}%` }}
                      />
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-4">No students match this filter</p>
                )}
              </div>

              {/* Add student */}
              {showAddForm ? (
                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                  <input
                    type="text"
                    placeholder="Student name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                  <div className="flex gap-2">
                    <select value={newGrade} onChange={e => setNewGrade(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <input
                      type="text"
                      placeholder="Course"
                      value={newCourse}
                      onChange={e => setNewCourse(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addStudent} className="flex-1 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition">
                      Add Student
                    </button>
                    <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium rounded-xl hover:border-amber-400 hover:text-amber-600 transition"
                >
                  + Add Student
                </button>
              )}
            </div>
          </div>

          {/* ── Student Detail ───────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            {!selected ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center h-full flex items-center justify-center">
                <div>
                  <span className="text-5xl mb-4 block">👤</span>
                  <p className="text-gray-500">Select a student to view and edit their analysis</p>
                  <p className="text-sm text-gray-400 mt-1">Adjust metrics with sliders to see predictions update in real time</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header + Metrics */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selected.name}</h3>
                      <p className="text-gray-500">{selected.grade} &middot; {selected.course}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-4 py-2 rounded-xl font-bold ${RISK_BADGE[selected.riskLevel]}`}>
                        {selected.riskLevel.toUpperCase()} RISK
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mt-2 tabular-nums">
                        {selected.riskScore}<span className="text-lg text-gray-400">/100</span>
                      </div>
                      <div className={`text-sm font-medium ${trendColor(selected.trend)}`}>
                        {trendIcon(selected.trend)} {trendLabel(selected.trend)}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">Drag sliders to adjust metrics and see how predictions change:</p>

                  <div className="space-y-4">
                    {METRIC_KEYS.map(key => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{METRIC_LABELS[key]}</span>
                          <span className={`text-sm font-bold tabular-nums ${metricColor(selected.metrics[key])}`}>
                            {selected.metrics[key]}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={selected.metrics[key]}
                          onChange={e => updateMetric(selected.id, key, parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    AI-Identified Risk Factors
                  </h4>
                  {selected.riskFactors.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-green-600 font-medium">No significant risk factors identified</p>
                      <p className="text-sm text-gray-500 mt-1">All metrics are within healthy ranges</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {selected.riskFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span className="text-gray-700">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-green-500">💡</span>
                    AI Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {selected.recommendations.map((rec, idx) => {
                      const done = selected.actionsTaken.has(rec);
                      return (
                        <li key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${done ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'}`}>
                          <span className={`font-bold ${done ? 'text-gray-400' : 'text-green-500'}`}>{idx + 1}.</span>
                          <span className={`flex-1 ${done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{rec}</span>
                          {done ? (
                            <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded-full whitespace-nowrap">Done</span>
                          ) : (
                            <button
                              onClick={() => markAction(selected.id, rec)}
                              className="text-sm text-green-600 hover:text-green-700 font-medium whitespace-nowrap"
                            >
                              Take Action →
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Prediction Factors</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '📊', title: 'Grade Trends', desc: 'Historical performance patterns' },
              { icon: '📅', title: 'Attendance Data', desc: 'Absence patterns & tardiness' },
              { icon: '💻', title: 'LMS Engagement', desc: 'Login frequency & time on task' },
              { icon: '🎯', title: 'Behavioral Signals', desc: 'Participation & submission timing' },
            ].map((f, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-gray-50">
                <span className="text-2xl">{f.icon}</span>
                <h4 className="font-medium text-gray-800 mt-2">{f.title}</h4>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
