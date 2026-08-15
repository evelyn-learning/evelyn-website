'use client';

import React, { useState } from 'react';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

interface Module {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'interactive' | 'quiz' | 'scenario';
  status: 'locked' | 'available' | 'completed';
}

interface SkillGap {
  skill: string;
  current: number;
  required: number;
  priority: 'high' | 'medium' | 'low';
}

interface ComplianceTraining {
  name: string;
  dueDate: string;
  status: 'completed' | 'in_progress' | 'overdue' | 'upcoming';
  completionRate: number;
}

const SAMPLE_CONTENT = `Effective Leadership in Remote Teams

Remote work has fundamentally changed how teams collaborate. Leaders must adapt their management styles to maintain productivity and team cohesion in distributed environments.

Key principles of remote leadership include:
1. Clear communication expectations
2. Trust-based management
3. Regular check-ins without micromanaging
4. Asynchronous work optimization
5. Virtual team building activities

Studies show that remote teams with strong leadership practices report 25% higher engagement scores than those without structured remote management frameworks.`;

const SAMPLE_MODULES: Module[] = [
  { id: '1', title: 'Introduction to Remote Leadership', duration: '5 min', type: 'video', status: 'completed' },
  { id: '2', title: 'Building Trust Virtually', duration: '8 min', type: 'interactive', status: 'completed' },
  { id: '3', title: 'Communication Best Practices', duration: '10 min', type: 'video', status: 'available' },
  { id: '4', title: 'Scenario: Handling Remote Conflict', duration: '15 min', type: 'scenario', status: 'locked' },
  { id: '5', title: 'Knowledge Check', duration: '5 min', type: 'quiz', status: 'locked' },
];

const SKILL_GAPS: SkillGap[] = [
  { skill: 'Remote Communication', current: 45, required: 80, priority: 'high' },
  { skill: 'Virtual Team Building', current: 30, required: 70, priority: 'high' },
  { skill: 'Async Collaboration', current: 60, required: 85, priority: 'medium' },
  { skill: 'Digital Tool Proficiency', current: 75, required: 90, priority: 'low' },
];

const COMPLIANCE_ITEMS: ComplianceTraining[] = [
  { name: 'Data Privacy & GDPR', dueDate: '2024-02-15', status: 'completed', completionRate: 100 },
  { name: 'Workplace Harassment Prevention', dueDate: '2024-03-01', status: 'in_progress', completionRate: 65 },
  { name: 'Cybersecurity Awareness', dueDate: '2024-01-30', status: 'overdue', completionRate: 20 },
  { name: 'Health & Safety', dueDate: '2024-04-15', status: 'upcoming', completionRate: 0 },
];

export default function CorporateTrainingDemo() {
  const trackInteraction = useTrackInteraction();
  const [activeTab, setActiveTab] = useState<'generator' | 'compliance' | 'skills' | 'export'>('generator');
  const [inputContent, setInputContent] = useState(SAMPLE_CONTENT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<Module[] | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'scorm' | 'xapi' | 'aicc'>('scorm');

  const generateMicrolearning = () => {
    trackInteraction('click', 'start_module');
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedCourse(SAMPLE_MODULES);
      setIsGenerating(false);
    }, 2000);
  };

  const getStatusColor = (status: ComplianceTraining['status']) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      overdue: 'bg-red-100 text-red-800',
      upcoming: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  const getModuleIcon = (type: Module['type']) => {
    const icons = { video: '🎬', interactive: '🖱️', quiz: '❓', scenario: '🎭' };
    return icons[type];
  };

  const getPriorityColor = (priority: SkillGap['priority']) => {
    const colors = { high: 'text-red-600', medium: 'text-yellow-600', low: 'text-green-600' };
    return colors[priority];
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-2xl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Enterprise L&D Solution
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Corporate Training AI</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate microlearning modules, track compliance, analyze skill gaps, and export to any LMS.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'generator', label: 'Microlearning Generator', icon: '🎯' },
            { id: 'compliance', label: 'Compliance Tracker', icon: '✅' },
            { id: 'skills', label: 'Skill Gap Analysis', icon: '📊' },
            { id: 'export', label: 'LMS Export', icon: '📤' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { trackInteraction('click', 'select_course', { course: tab.label }); setActiveTab(tab.id as typeof activeTab); }}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {activeTab === 'generator' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste your training content or documentation
                </label>
                <textarea
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Paste training material, policies, or documentation..."
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Module Duration</label>
                  <select className="w-full p-3 border border-gray-200 rounded-lg">
                    <option>5-minute modules</option>
                    <option>10-minute modules</option>
                    <option>15-minute modules</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Include</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                      <span className="text-sm">Quizzes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                      <span className="text-sm">Scenarios</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-indigo-600" />
                      <span className="text-sm">Certificates</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={generateMicrolearning}
                disabled={isGenerating || !inputContent.trim()}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating Microlearning Course...
                  </>
                ) : (
                  <>
                    <span>🎯</span>
                    Generate Microlearning Modules
                  </>
                )}
              </button>

              {generatedCourse && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Course: Remote Leadership Essentials</h3>
                  <div className="space-y-3">
                    {generatedCourse.map((module, idx) => (
                      <div
                        key={module.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border ${
                          module.status === 'completed' ? 'bg-green-50 border-green-200' :
                          module.status === 'available' ? 'bg-white border-gray-200' :
                          'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-2xl">{getModuleIcon(module.type)}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{module.title}</h4>
                          <p className="text-sm text-gray-500">{module.duration} • {module.type}</p>
                        </div>
                        {module.status === 'completed' && (
                          <span className="text-green-600">✓</span>
                        )}
                        {module.status === 'locked' && (
                          <span className="text-gray-400">🔒</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Compliance Training Dashboard</h3>
                <span className="text-sm text-gray-500">Acme Corp • 1,247 employees</span>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-gray-600">Overall Compliance</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Active Courses</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-red-600">47</div>
                  <div className="text-sm text-gray-600">Overdue</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-yellow-600">156</div>
                  <div className="text-sm text-gray-600">Due This Month</div>
                </div>
              </div>

              <div className="space-y-3">
                {COMPLIANCE_ITEMS.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">Due: {item.dueDate}</p>
                    </div>
                    <div className="w-32">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.status === 'overdue' ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${item.completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{item.completionRate}% complete</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full py-3 bg-indigo-100 text-indigo-700 font-medium rounded-xl hover:bg-indigo-200 transition">
                Send Reminder Emails to Overdue Employees
              </button>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Team Skill Gap Analysis</h3>
                <select className="p-2 border border-gray-200 rounded-lg text-sm">
                  <option>Engineering Team</option>
                  <option>Sales Team</option>
                  <option>Marketing Team</option>
                  <option>All Employees</option>
                </select>
              </div>

              <div className="space-y-4">
                {SKILL_GAPS.map((gap, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{gap.skill}</h4>
                      <span className={`text-sm font-medium ${getPriorityColor(gap.priority)}`}>
                        {gap.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-indigo-600 rounded-full"
                        style={{ width: `${gap.current}%` }}
                      />
                      <div
                        className="absolute h-full border-r-2 border-red-500"
                        style={{ left: `${gap.required}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Current: {gap.current}%</span>
                      <span>Required: {gap.required}%</span>
                      <span className="text-red-600">Gap: {gap.required - gap.current}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl">
                <h4 className="font-medium text-indigo-900 mb-2">AI Recommendation</h4>
                <p className="text-sm text-indigo-700">
                  Based on the skill gaps identified, we recommend prioritizing &quot;Remote Communication&quot; and
                  &quot;Virtual Team Building&quot; training. Estimated time to close gaps: 4-6 weeks with
                  2 hours/week of training per employee.
                </p>
                <button className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                  Generate Personalized Learning Paths
                </button>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export to LMS</h3>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: 'scorm', name: 'SCORM 1.2/2004', desc: 'Universal LMS compatibility', icon: '📦' },
                  { id: 'xapi', name: 'xAPI (Tin Can)', desc: 'Advanced tracking & analytics', icon: '📊' },
                  { id: 'aicc', name: 'AICC', desc: 'Legacy system support', icon: '🔧' },
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id as typeof selectedFormat)}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      selectedFormat === format.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{format.icon}</span>
                    <h4 className="font-medium text-gray-900 mt-2">{format.name}</h4>
                    <p className="text-sm text-gray-500">{format.desc}</p>
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-3">Direct LMS Integrations</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Cornerstone', 'SAP SuccessFactors', 'Workday Learning', 'Docebo', 'TalentLMS', 'Absorb LMS', 'LearnUpon', 'Custom API'].map((lms) => (
                    <div key={lms} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-gray-700">{lms}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                  <span>📥</span>
                  Download {selectedFormat.toUpperCase()} Package
                </button>
                <button className="px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition">
                  API Docs
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {[
            { icon: '🎯', title: 'Microlearning', desc: 'Bite-sized 5-10 min modules' },
            { icon: '✅', title: 'Compliance', desc: 'Auto-track certifications' },
            { icon: '📊', title: 'Analytics', desc: 'Skill gap insights' },
            { icon: '🔌', title: 'LMS Ready', desc: 'SCORM/xAPI export' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 text-center shadow">
              <span className="text-2xl">{feature.icon}</span>
              <h4 className="font-medium text-gray-900 mt-2">{feature.title}</h4>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
