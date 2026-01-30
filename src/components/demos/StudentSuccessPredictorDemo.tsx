'use client';

import React, { useState } from 'react';

interface StudentData {
  id: string;
  name: string;
  grade: string;
  course: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  metrics: {
    attendance: number;
    assignmentCompletion: number;
    averageGrade: number;
    lmsEngagement: number;
    participationScore: number;
    trendDirection: 'up' | 'down' | 'stable';
  };
  riskFactors: string[];
  recommendations: string[];
  lastActive: string;
}

const SAMPLE_STUDENTS: StudentData[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    grade: '10th',
    course: 'Algebra II',
    riskLevel: 'critical',
    riskScore: 87,
    metrics: {
      attendance: 65,
      assignmentCompletion: 45,
      averageGrade: 58,
      lmsEngagement: 23,
      participationScore: 30,
      trendDirection: 'down'
    },
    riskFactors: [
      'Missed 5 consecutive classes',
      'Assignment completion dropped 40% this month',
      'Grade dropped from B to D in 3 weeks',
      'No LMS login in 8 days'
    ],
    recommendations: [
      'Schedule immediate counselor check-in',
      'Contact parent/guardian',
      'Assign peer tutor for algebra support',
      'Provide catch-up assignment packet'
    ],
    lastActive: '8 days ago'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    grade: '11th',
    course: 'AP Chemistry',
    riskLevel: 'high',
    riskScore: 68,
    metrics: {
      attendance: 85,
      assignmentCompletion: 70,
      averageGrade: 72,
      lmsEngagement: 55,
      participationScore: 45,
      trendDirection: 'down'
    },
    riskFactors: [
      'Grade trend declining for 4 weeks',
      'Missed last 2 lab assignments',
      'Reduced class participation'
    ],
    recommendations: [
      'Schedule tutoring session',
      'Check in about workload/stress',
      'Offer lab make-up opportunity'
    ],
    lastActive: '2 days ago'
  },
  {
    id: '3',
    name: 'Jordan Lee',
    grade: '9th',
    course: 'English Literature',
    riskLevel: 'medium',
    riskScore: 42,
    metrics: {
      attendance: 92,
      assignmentCompletion: 85,
      averageGrade: 78,
      lmsEngagement: 70,
      participationScore: 60,
      trendDirection: 'stable'
    },
    riskFactors: [
      'Writing scores below class average',
      'Inconsistent quiz performance'
    ],
    recommendations: [
      'Recommend writing center sessions',
      'Provide additional reading comprehension resources'
    ],
    lastActive: 'Today'
  },
  {
    id: '4',
    name: 'Sam Patel',
    grade: '12th',
    course: 'AP Calculus',
    riskLevel: 'low',
    riskScore: 15,
    metrics: {
      attendance: 98,
      assignmentCompletion: 95,
      averageGrade: 91,
      lmsEngagement: 88,
      participationScore: 85,
      trendDirection: 'up'
    },
    riskFactors: [],
    recommendations: [
      'Consider for advanced enrichment',
      'Potential peer tutor candidate'
    ],
    lastActive: 'Today'
  },
  {
    id: '5',
    name: 'Casey Williams',
    grade: '10th',
    course: 'World History',
    riskLevel: 'high',
    riskScore: 71,
    metrics: {
      attendance: 75,
      assignmentCompletion: 60,
      averageGrade: 65,
      lmsEngagement: 40,
      participationScore: 35,
      trendDirection: 'down'
    },
    riskFactors: [
      'Frequent tardiness to class',
      'Missing major project deadline',
      'Decreased engagement in discussions'
    ],
    recommendations: [
      'Check for attendance barriers',
      'Offer project extension with support plan',
      'Connect with school social worker'
    ],
    lastActive: '4 days ago'
  }
];

export default function StudentSuccessPredictorDemo() {
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredStudents = SAMPLE_STUDENTS.filter(student => {
    if (filterRisk === 'all') return true;
    return student.riskLevel === filterRisk;
  });

  const getRiskColor = (level: StudentData['riskLevel']) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[level];
  };

  const getRiskBgColor = (level: StudentData['riskLevel']) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500'
    };
    return colors[level];
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    if (value >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getMetricBg = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const summary = {
    total: SAMPLE_STUDENTS.length,
    critical: SAMPLE_STUDENTS.filter(s => s.riskLevel === 'critical').length,
    high: SAMPLE_STUDENTS.filter(s => s.riskLevel === 'high').length,
    medium: SAMPLE_STUDENTS.filter(s => s.riskLevel === 'medium').length,
    low: SAMPLE_STUDENTS.filter(s => s.riskLevel === 'low').length
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-amber-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            AI-Powered Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Student Success Predictor
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Early warning system using AI to identify at-risk students before they fall behind.
          </p>
        </div>

        {/* Summary Dashboard */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Risk Overview Dashboard</h3>
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Refresh Analysis
                </>
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Student List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Students</h3>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1"
                >
                  <option value="all">All Risks</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full p-3 rounded-xl text-left transition ${
                      selectedStudent?.id === student.id
                        ? 'bg-amber-100 border-2 border-amber-400'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{student.name}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRiskColor(student.riskLevel)}`}>
                        {student.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{student.grade} • {student.course}</span>
                      <span className={getTrendColor(student.metrics.trendDirection)}>
                        {getTrendIcon(student.metrics.trendDirection)}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getRiskBgColor(student.riskLevel)}`}
                        style={{ width: `${student.riskScore}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Student Detail */}
          <div className="lg:col-span-2">
            {!selectedStudent ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center h-full flex items-center justify-center">
                <div>
                  <span className="text-5xl mb-4 block">👤</span>
                  <p className="text-gray-500">Select a student to view detailed analysis</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Student Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                      <p className="text-gray-500">{selectedStudent.grade} • {selectedStudent.course}</p>
                      <p className="text-sm text-gray-400 mt-1">Last active: {selectedStudent.lastActive}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-4 py-2 rounded-xl font-bold ${getRiskColor(selectedStudent.riskLevel)}`}>
                        {selectedStudent.riskLevel.toUpperCase()} RISK
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mt-2">
                        {selectedStudent.riskScore}
                        <span className="text-lg text-gray-400">/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { label: 'Attendance', value: selectedStudent.metrics.attendance },
                      { label: 'Assignments', value: selectedStudent.metrics.assignmentCompletion },
                      { label: 'Avg Grade', value: selectedStudent.metrics.averageGrade },
                      { label: 'LMS Usage', value: selectedStudent.metrics.lmsEngagement },
                      { label: 'Participation', value: selectedStudent.metrics.participationScore }
                    ].map((metric, idx) => (
                      <div key={idx} className="text-center">
                        <div className={`text-2xl font-bold ${getMetricColor(metric.value)}`}>
                          {metric.value}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{metric.label}</div>
                        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getMetricBg(metric.value)}`}
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
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
                  {selectedStudent.riskFactors.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No significant risk factors identified</p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedStudent.riskFactors.map((factor, idx) => (
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
                    {selectedStudent.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-500 font-bold">{idx + 1}.</span>
                        <span className="text-gray-700">{rec}</span>
                        <button className="ml-auto text-sm text-green-600 hover:text-green-700 font-medium">
                          Take Action →
                        </button>
                      </li>
                    ))}
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
              { icon: '🎯', title: 'Behavioral Signals', desc: 'Participation & submission timing' }
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-gray-50">
                <span className="text-2xl">{feature.icon}</span>
                <h4 className="font-medium text-gray-800 mt-2">{feature.title}</h4>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
