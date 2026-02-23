'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Application {
  id: string;
  name: string;
  program: string;
  category: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'waitlisted';
  score: number;
  breakdown: { label: string; score: number; max: number }[];
  documents: { name: string; status: 'verified' | 'pending' | 'missing' }[];
  flags: string[];
  summary: string;
}

interface DocItem {
  id: string;
  filename: string;
  applicant: string;
  detail: string;
  status: 'verified' | 'pending' | 'flagged';
}

// ── Data ───────────────────────────────────────────────────────────────────

const CHATBOT_RESPONSES: Record<string, string> = {
  default: "Hello! I\u2019m the AI Admissions Assistant. I can help with application questions, deadlines, programs, and financial aid. What would you like to know?",
  deadline: "Here are our upcoming deadlines:\n\n**Fall 2025 Admissions:**\n\u2022 Early Decision: November 1\n\u2022 Regular Decision: January 15\n\u2022 Transfer Students: March 1\n\nFAFSA should be submitted by February 1 for priority consideration.",
  requirements: "For undergraduate admissions, you\u2019ll need:\n\n1. **Transcript** \u2014 Official high school transcript\n2. **Test Scores** \u2014 SAT or ACT (optional for 2025)\n3. **Essay** \u2014 Personal statement (650 words max)\n4. **Recommendations** \u2014 2 letters\n5. **Application Fee** \u2014 $65 (waivers available)\n\nWould you like details on any requirement?",
  financial: "We offer several options:\n\n**Merit Scholarships:** $5,000\u2013$25,000/year\n**Need-Based Aid:** Grants and work-study\n**Loans:** Federal and private\n\n**Key Stats:**\n\u2022 78% of students receive aid\n\u2022 Average award: $18,500/year\n\nHave you completed your FAFSA?",
  programs: "We offer 120+ undergraduate and 80+ graduate programs:\n\n**Popular Programs:**\n\u2022 Computer Science (Top 25)\n\u2022 Business Administration\n\u2022 Nursing (97% placement)\n\u2022 Engineering\n\u2022 Psychology\n\nNewest: Data Science, Cybersecurity. Want details on a specific program?",
  status: "To check your application status:\n\n1. Log into the Applicant Portal\n2. Click \u2018Application Status\u2019\n3. View documents and timeline\n\n**Typical Timeline:**\n\u2022 Document verification: 1\u20132 weeks\n\u2022 Application review: 4\u20136 weeks\n\u2022 Decision: Within 8 weeks",
};

const INITIAL_APPS: Application[] = [
  {
    id: 'APP-001', name: 'Sarah Chen', program: 'Computer Science, BS', category: 'Computer Science',
    status: 'reviewing', score: 92,
    breakdown: [{ label: 'Academic', score: 33, max: 35 }, { label: 'Activities', score: 18, max: 20 }, { label: 'Essay', score: 14, max: 15 }, { label: 'Recs', score: 13, max: 15 }, { label: 'Diversity', score: 7, max: 10 }, { label: 'Interview', score: 7, max: 5 }],
    documents: [{ name: 'Transcript', status: 'verified' }, { name: 'SAT Scores', status: 'verified' }, { name: 'Recommendation 1', status: 'verified' }, { name: 'Recommendation 2', status: 'pending' }, { name: 'Essay', status: 'verified' }],
    flags: ['Strong STEM background', 'Leadership activities'],
    summary: 'Exceptional candidate with 3.9 GPA and robotics club leadership. Essay demonstrates passion for AI research. One recommendation still pending.',
  },
  {
    id: 'APP-002', name: 'Marcus Johnson', program: 'Business Administration, MBA', category: 'Business',
    status: 'interview', score: 88,
    breakdown: [{ label: 'Academic', score: 28, max: 35 }, { label: 'Work Exp.', score: 19, max: 20 }, { label: 'Essay', score: 13, max: 15 }, { label: 'Recs', score: 14, max: 15 }, { label: 'Diversity', score: 8, max: 10 }, { label: 'Interview', score: 6, max: 5 }],
    documents: [{ name: 'Transcript', status: 'verified' }, { name: 'GMAT', status: 'verified' }, { name: 'Resume', status: 'verified' }, { name: 'Recommendation 1', status: 'verified' }, { name: 'Recommendation 2', status: 'verified' }],
    flags: ['5+ years experience', 'International background'],
    summary: 'Strong MBA candidate with 6 years at Fortune 500. GMAT 720 above average. International experience in 3 countries. Interview rated excellent.',
  },
  {
    id: 'APP-003', name: 'Emma Rodriguez', program: 'Psychology, BA', category: 'Psychology',
    status: 'pending', score: 78,
    breakdown: [{ label: 'Academic', score: 25, max: 35 }, { label: 'Activities', score: 15, max: 20 }, { label: 'Essay', score: 13, max: 15 }, { label: 'Recs', score: 10, max: 15 }, { label: 'Diversity', score: 9, max: 10 }, { label: 'Interview', score: 6, max: 5 }],
    documents: [{ name: 'Transcript', status: 'verified' }, { name: 'SAT Scores', status: 'missing' }, { name: 'Recommendation 1', status: 'pending' }, { name: 'Essay', status: 'verified' }],
    flags: ['First-generation student', 'Community service'],
    summary: 'First-generation applicant with 200+ volunteer hours. SAT scores missing and one recommendation pending. Essay quality excellent.',
  },
  {
    id: 'APP-004', name: 'James Kim', program: 'Data Science, MS', category: 'Computer Science',
    status: 'accepted', score: 95,
    breakdown: [{ label: 'Academic', score: 34, max: 35 }, { label: 'Research', score: 19, max: 20 }, { label: 'Statement', score: 14, max: 15 }, { label: 'Recs', score: 14, max: 15 }, { label: 'Diversity', score: 7, max: 10 }, { label: 'Interview', score: 7, max: 5 }],
    documents: [{ name: 'Transcript', status: 'verified' }, { name: 'GRE Scores', status: 'verified' }, { name: 'Research Portfolio', status: 'verified' }, { name: 'Recommendation 1', status: 'verified' }, { name: 'Recommendation 2', status: 'verified' }],
    flags: ['Published researcher', '4.0 GPA'],
    summary: 'Outstanding MS candidate with 2 published papers in ML. Perfect 4.0 GPA in Mathematics. Strong research potential.',
  },
  {
    id: 'APP-005', name: 'Aisha Patel', program: 'Nursing, BSN', category: 'Nursing',
    status: 'reviewing', score: 85,
    breakdown: [{ label: 'Academic', score: 29, max: 35 }, { label: 'Clinical', score: 17, max: 20 }, { label: 'Essay', score: 12, max: 15 }, { label: 'Recs', score: 13, max: 15 }, { label: 'Diversity', score: 8, max: 10 }, { label: 'Interview', score: 6, max: 5 }],
    documents: [{ name: 'Transcript', status: 'verified' }, { name: 'SAT Scores', status: 'verified' }, { name: 'Recommendation 1', status: 'verified' }, { name: 'Recommendation 2', status: 'pending' }, { name: 'CNA Certification', status: 'verified' }],
    flags: ['CNA certified', 'Healthcare volunteer'],
    summary: 'Strong nursing candidate with CNA certification and 500+ hours clinical volunteer experience. Awaiting second recommendation.',
  },
  {
    id: 'APP-006', name: 'Tyler Washington', program: 'Mechanical Engineering, BS', category: 'Engineering',
    status: 'waitlisted', score: 81,
    breakdown: [{ label: 'Academic', score: 27, max: 35 }, { label: 'Activities', score: 16, max: 20 }, { label: 'Essay', score: 11, max: 15 }, { label: 'Recs', score: 12, max: 15 }, { label: 'Diversity', score: 8, max: 10 }, { label: 'Interview', score: 7, max: 5 }],
    documents: [{ name: 'Transcript', status: 'verified' }, { name: 'SAT Scores', status: 'verified' }, { name: 'Recommendation 1', status: 'verified' }, { name: 'Recommendation 2', status: 'verified' }, { name: 'Essay', status: 'verified' }],
    flags: ['Eagle Scout', 'Robotics team captain'],
    summary: 'Solid engineering candidate with hands-on robotics experience. GPA slightly below department average (3.4). Waitlisted pending space.',
  },
];

const INITIAL_DOCS: DocItem[] = [
  { id: 'd1', filename: 'transcript_chen_sarah.pdf', applicant: 'Sarah Chen', detail: 'GPA: 3.9 | Credits: 128 | Institution verified', status: 'verified' },
  { id: 'd2', filename: 'sat_scores_chen_sarah.pdf', applicant: 'Sarah Chen', detail: 'Score: 1480/1600 | Date: Oct 2024', status: 'verified' },
  { id: 'd3', filename: 'recommendation_johnson_1.pdf', applicant: 'Marcus Johnson', detail: 'Professional reference | Signature pending', status: 'pending' },
  { id: 'd4', filename: 'recommendation_patel_2.pdf', applicant: 'Aisha Patel', detail: 'Academic reference | Letterhead detected', status: 'pending' },
  { id: 'd5', filename: 'sat_scores_rodriguez.pdf', applicant: 'Emma Rodriguez', detail: 'Image quality low | Possible alteration', status: 'flagged' },
  { id: 'd6', filename: 'essay_washington.pdf', applicant: 'Tyler Washington', detail: 'Plagiarism check: 2% similarity | Passed', status: 'verified' },
  { id: 'd7', filename: 'gre_scores_kim.pdf', applicant: 'James Kim', detail: 'Quant: 170 | Verbal: 165 | Date: Sep 2024', status: 'verified' },
  { id: 'd8', filename: 'cna_cert_patel.pdf', applicant: 'Aisha Patel', detail: 'Certification #CNA-29481 | Expiry: 2026', status: 'pending' },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function AdmissionsAssistantDemo() {
  const trackInteraction = useTrackInteraction();
  const [activeTab, setActiveTab] = useState<'chatbot' | 'review' | 'documents' | 'analytics'>('chatbot');

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: CHATBOT_RESPONSES.default, timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [applications, setApplications] = useState(INITIAL_APPS);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [programFilter, setProgramFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [documents, setDocuments] = useState(INITIAL_DOCS);
  const [processingDocs, setProcessingDocs] = useState(false);

  const [recommendations, setRecommendations] = useState([
    { action: 'Send personalized financial aid packages to 234 high-fit, low-yield prospects', impact: 45, priority: 'high' as const, executed: false },
    { action: 'Schedule virtual campus tours for 156 admitted international students', impact: 28, priority: 'high' as const, executed: false },
    { action: 'Connect current students with 89 undecided admits in same major', impact: 18, priority: 'medium' as const, executed: false },
    { action: 'Send deadline reminders to 423 incomplete applications', impact: 52, priority: 'medium' as const, executed: false },
  ]);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Chat ────────────────────────────────────────────────────────────────

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() }]);
    setInputValue('');
    setIsTyping(true);
    trackInteraction('message', text.trim(), undefined, 'student');

    setTimeout(() => {
      const lower = text.toLowerCase();
      let response = CHATBOT_RESPONSES.default;
      if (lower.includes('deadline') || lower.includes('when')) response = CHATBOT_RESPONSES.deadline;
      else if (lower.includes('require') || lower.includes('need') || lower.includes('submit')) response = CHATBOT_RESPONSES.requirements;
      else if (lower.includes('financial') || lower.includes('scholar') || lower.includes('cost') || lower.includes('tuition')) response = CHATBOT_RESPONSES.financial;
      else if (lower.includes('program') || lower.includes('major') || lower.includes('degree')) response = CHATBOT_RESPONSES.programs;
      else if (lower.includes('status') || lower.includes('application') || lower.includes('check')) response = CHATBOT_RESPONSES.status;

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1500);
  }, []);

  // ── Applications ────────────────────────────────────────────────────────

  const updateAppStatus = useCallback((appId: string, newStatus: Application['status']) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    const labels: Record<string, string> = { interview: 'Interview scheduled', accepted: 'Application accepted', waitlisted: 'Added to waitlist' };
    showToast(labels[newStatus] || 'Status updated');
    trackInteraction('tool_use', 'update_app_status', { appId, newStatus });
  }, [showToast, trackInteraction]);

  const requestDocs = useCallback((app: Application) => {
    const missing = app.documents.filter(d => d.status !== 'verified');
    if (missing.length === 0) { showToast('All documents already received'); return; }
    showToast(`Requested ${missing.length} document(s) from ${app.name}`);
  }, [showToast]);

  const filteredApps = applications.filter(a => {
    if (programFilter !== 'All' && a.category !== programFilter) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter.toLowerCase()) return false;
    return true;
  });

  const categories = ['All', ...Array.from(new Set(applications.map(a => a.category)))];
  const statuses = ['All', 'Pending', 'Reviewing', 'Interview', 'Accepted', 'Waitlisted'];

  // ── Documents ───────────────────────────────────────────────────────────

  const verifyDoc = useCallback((docId: string) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: 'verified' as const } : d));
    showToast('Document verified');
    trackInteraction('tool_use', 'verify_doc', { docId });
  }, [showToast, trackInteraction]);

  const flagDoc = useCallback((docId: string) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: 'flagged' as const } : d));
    showToast('Document flagged for review');
    trackInteraction('tool_use', 'flag_doc', { docId });
  }, [showToast, trackInteraction]);

  const processAllDocs = useCallback(() => {
    const pending = documents.filter(d => d.status === 'pending');
    if (pending.length === 0) { showToast('No pending documents'); return; }
    setProcessingDocs(true);
    trackInteraction('tool_use', 'process_all_docs', { count: pending.length });
    pending.forEach((doc, idx) => {
      setTimeout(() => {
        setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'verified' as const } : d));
        if (idx === pending.length - 1) {
          setProcessingDocs(false);
          showToast(`Processed ${pending.length} document(s)`);
        }
      }, (idx + 1) * 800);
    });
  }, [documents, showToast, trackInteraction]);

  const docCounts = {
    verified: documents.filter(d => d.status === 'verified').length,
    pending: documents.filter(d => d.status === 'pending').length,
    flagged: documents.filter(d => d.status === 'flagged').length,
  };

  // ── Analytics ───────────────────────────────────────────────────────────

  const additionalEnrollments = recommendations.filter(r => r.executed).reduce((sum, r) => sum + r.impact, 0);
  const predictedEnrollment = 2847 + additionalEnrollments;
  const yieldBoost = Math.min(additionalEnrollments * 0.02, 3.0);

  const executeRec = useCallback((idx: number) => {
    setRecommendations(prev => prev.map((r, i) => i === idx ? { ...r, executed: true } : r));
    showToast('Recommendation executed');
    trackInteraction('tool_use', 'execute_recommendation', { index: idx });
  }, [showToast, trackInteraction]);

  const executeAllRecs = useCallback(() => {
    const remaining = recommendations.filter(r => !r.executed);
    if (remaining.length === 0) { showToast('All recommendations already executed'); return; }
    remaining.forEach((_, idx) => {
      setTimeout(() => {
        setRecommendations(prev => {
          const next = [...prev];
          const pi = next.findIndex(r => !r.executed);
          if (pi >= 0) next[pi] = { ...next[pi], executed: true };
          return next;
        });
        if (idx === remaining.length - 1) showToast('All recommendations executed!');
      }, (idx + 1) * 600);
    });
  }, [recommendations, showToast]);

  // ── Helpers ─────────────────────────────────────────────────────────────

  const statusColor = (s: Application['status']) => ({ pending: 'bg-gray-100 text-gray-800', reviewing: 'bg-blue-100 text-blue-800', interview: 'bg-purple-100 text-purple-800', accepted: 'bg-green-100 text-green-800', waitlisted: 'bg-yellow-100 text-yellow-800' })[s];

  const docColor = (s: DocItem['status']) => ({ verified: 'text-green-600', pending: 'text-yellow-600', flagged: 'text-red-600' })[s];
  const docBorder = (s: DocItem['status']) => ({ verified: 'border-green-200', pending: 'border-yellow-200', flagged: 'border-red-200' })[s];
  const docBadge = (s: DocItem['status']) => ({ verified: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', flagged: 'bg-red-100 text-red-700' })[s];
  const docIcon = (s: DocItem['status']) => ({ verified: '\u2713', pending: '\u23F3', flagged: '\u26A0' })[s];
  const docLabel = (s: DocItem['status']) => ({ verified: 'Verified', pending: 'Pending', flagged: 'Flagged' })[s];

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-2xl">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{toast}</div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Interactive Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Admissions Assistant</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            24/7 prospective student support, automated application review, and enrollment prediction.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {([
            { id: 'chatbot' as const, label: 'Student Chatbot', icon: '\uD83D\uDCAC' },
            { id: 'review' as const, label: 'Application Review', icon: '\uD83D\uDCCB' },
            { id: 'documents' as const, label: 'Document Verification', icon: '\uD83D\uDCC4' },
            { id: 'analytics' as const, label: 'Enrollment Prediction', icon: '\uD83D\uDCCA' },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); trackInteraction('navigation', 'tab_switch', { tab: tab.id }); }}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* ── CHATBOT ──────────────────────────────────────────── */}
          {activeTab === 'chatbot' && (
            <div className="flex flex-col">
              <div className="overflow-y-auto p-4 space-y-4 max-h-[350px]">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      <p className="whitespace-pre-line text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-2xl">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-4 py-2 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {['Application deadlines?', 'What are the requirements?', 'Financial aid options?', 'Check my status'].map(q => (
                    <button key={q} onClick={() => sendMessage(q)} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full hover:bg-blue-100 transition">
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage(inputValue)}
                    placeholder="Ask about admissions, programs, or financial aid..."
                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button onClick={() => sendMessage(inputValue)} disabled={!inputValue.trim()} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── APPLICATION REVIEW ───────────────────────────────── */}
          {activeTab === 'review' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Application Queue
                  <span className="ml-2 text-sm font-normal text-gray-500">({filteredApps.length} shown)</span>
                </h3>
                <div className="flex gap-2">
                  <select value={programFilter} onChange={e => setProgramFilter(e.target.value)} className="p-2 border border-gray-200 rounded-lg text-sm">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2 border border-gray-200 rounded-lg text-sm">
                    {statuses.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {filteredApps.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No applications match the current filters</p>
              ) : (
                <div className="space-y-4">
                  {filteredApps.map(app => (
                    <div
                      key={app.id}
                      className={`rounded-xl border transition ${selectedApp === app.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)} className="p-4 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{app.name}</h4>
                            <p className="text-sm text-gray-500">{app.program}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{app.score}</div>
                              <div className="text-xs text-gray-500">AI Score</div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {selectedApp === app.id && (
                        <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">AI Score Breakdown</h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {app.breakdown.map((b, i) => (
                                <div key={i}>
                                  <div className="flex justify-between text-xs mb-0.5">
                                    <span className="text-gray-600">{b.label}</span>
                                    <span className="text-gray-900 font-medium">{b.score}/{b.max}</span>
                                  </div>
                                  <div className="h-1.5 bg-gray-200 rounded-full">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(b.score / b.max) * 100}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <h5 className="text-sm font-medium text-blue-900 mb-1">AI Review Summary</h5>
                            <p className="text-sm text-blue-800">{app.summary}</p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Highlights</h5>
                              <div className="flex flex-wrap gap-2">
                                {app.flags.map((f, i) => (
                                  <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{f}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Documents</h5>
                              <div className="space-y-1">
                                {app.documents.map((doc, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm">
                                    <span className={doc.status === 'verified' ? 'text-green-600' : doc.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}>
                                      {doc.status === 'verified' ? '\u2713' : doc.status === 'pending' ? '\u23F3' : '\u2717'}
                                    </span>
                                    <span className="text-gray-600">{doc.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {app.status !== 'accepted' && (
                              <button onClick={e => { e.stopPropagation(); updateAppStatus(app.id, 'accepted'); }} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                                Accept
                              </button>
                            )}
                            {app.status !== 'interview' && app.status !== 'accepted' && (
                              <button onClick={e => { e.stopPropagation(); updateAppStatus(app.id, 'interview'); }} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
                                Schedule Interview
                              </button>
                            )}
                            {app.status !== 'waitlisted' && app.status !== 'accepted' && (
                              <button onClick={e => { e.stopPropagation(); updateAppStatus(app.id, 'waitlisted'); }} className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700">
                                Waitlist
                              </button>
                            )}
                            <button onClick={e => { e.stopPropagation(); requestDocs(app); }} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                              Request Documents
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── DOCUMENTS ────────────────────────────────────────── */}
          {activeTab === 'documents' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Document Verification Center</h3>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-green-600">{docCounts.verified}</div>
                  <div className="text-sm text-gray-600">Verified</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-yellow-600">{docCounts.pending}</div>
                  <div className="text-sm text-gray-600">Pending Review</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-red-600">{docCounts.flagged}</div>
                  <div className="text-sm text-gray-600">Flagged</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">AI Document Analysis</h4>
                <div className="space-y-3">
                  {documents.map(doc => (
                    <div key={doc.id} className={`flex items-center justify-between p-3 bg-white rounded-lg border ${docBorder(doc.status)}`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className={`text-xl ${docColor(doc.status)}`}>{docIcon(doc.status)}</span>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{doc.filename}</p>
                          <p className="text-sm text-gray-500">{doc.applicant} &middot; {doc.detail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        {doc.status === 'pending' && (
                          <>
                            <button onClick={() => verifyDoc(doc.id)} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200">Verify</button>
                            <button onClick={() => flagDoc(doc.id)} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200">Flag</button>
                          </>
                        )}
                        {doc.status === 'flagged' && (
                          <button onClick={() => verifyDoc(doc.id)} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200">Override</button>
                        )}
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${docBadge(doc.status)}`}>{docLabel(doc.status)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={processAllDocs}
                disabled={processingDocs || docCounts.pending === 0}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              >
                {processingDocs ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Process Pending Documents (${docCounts.pending})`
                )}
              </button>
            </div>
          )}

          {/* ── ANALYTICS ────────────────────────────────────────── */}
          {activeTab === 'analytics' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Enrollment Prediction Dashboard</h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                  <h4 className="text-sm font-medium text-blue-100 mb-2">Predicted Enrollment</h4>
                  <div className="text-4xl font-bold mb-2">{predictedEnrollment.toLocaleString()}</div>
                  <p className="text-sm text-blue-100">Target: 3,000 | Gap: {Math.max(0, 3000 - predictedEnrollment)} students</p>
                  <div className="mt-4 h-2 bg-blue-400 rounded-full">
                    <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (predictedEnrollment / 3000) * 100)}%` }} />
                  </div>
                  {additionalEnrollments > 0 && (
                    <p className="text-xs text-blue-200 mt-2">+{additionalEnrollments} from executed recommendations</p>
                  )}
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
                  <h4 className="text-sm font-medium text-green-100 mb-2">Yield Rate Prediction</h4>
                  <div className="text-4xl font-bold mb-2">{(34.2 + yieldBoost).toFixed(1)}%</div>
                  <p className="text-sm text-green-100">Last year: 32.8% | +{(34.2 + yieldBoost - 32.8).toFixed(1)}% improvement</p>
                  <div className="mt-4 text-sm">
                    <span className="text-green-200">Top factors: </span>
                    <span>Financial aid, campus visit, early engagement</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">AI-Powered Yield Recommendations</h4>
                  <button onClick={executeAllRecs} className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    Execute All
                  </button>
                </div>
                <div className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border transition ${rec.executed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${rec.executed ? 'bg-green-500' : rec.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        <span className={`text-sm text-gray-700 ${rec.executed ? 'line-through opacity-60' : ''}`}>{rec.action}</span>
                      </div>
                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${rec.executed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {rec.executed ? '\u2713 ' : '+'}
                          {rec.impact}
                        </span>
                        {!rec.executed && (
                          <button onClick={() => executeRec(idx)} className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">Execute</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {([
            { icon: '\uD83D\uDCAC', title: '24/7 Chatbot', desc: 'Instant student support' },
            { icon: '\uD83D\uDCCB', title: 'Smart Review', desc: 'AI application scoring' },
            { icon: '\uD83D\uDCC4', title: 'Doc Verify', desc: 'Automated verification' },
            { icon: '\uD83D\uDCCA', title: 'Predictions', desc: 'Enrollment forecasting' },
          ]).map((f, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 text-center shadow">
              <span className="text-2xl">{f.icon}</span>
              <h4 className="font-medium text-gray-900 mt-2">{f.title}</h4>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
