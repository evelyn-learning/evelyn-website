'use client';

import { useState, useCallback, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface Student {
  name: string;
  grade: string;
  emoji: string;
  overall: number;
  attendance: number;
  grades: { subject: string; grade: string; trend: 'up' | 'down' | 'stable' }[];
  events: { date: string; event: string }[];
  summary: string;
  recommendations: string[];
  resources: { title: string; subject: string; icon: string; match: string }[];
  plan: { priority: string; actions: string[] }[];
}

interface Msg {
  id: string;
  type: 'progress' | 'alert' | 'event' | 'recommendation';
  subject: string;
  preview: string;
  full: string;
  date: string;
}

// ── Data ───────────────────────────────────────────────────────────────────

const STUDENTS: Student[] = [
  {
    name: 'Emma Thompson', grade: '7th Grade', emoji: '\uD83D\uDC67', overall: 87, attendance: 96,
    grades: [
      { subject: 'Mathematics', grade: 'A-', trend: 'up' },
      { subject: 'English', grade: 'B+', trend: 'stable' },
      { subject: 'Science', grade: 'A', trend: 'up' },
      { subject: 'History', grade: 'B', trend: 'down' },
      { subject: 'Art', grade: 'A+', trend: 'stable' },
    ],
    events: [
      { date: 'Jan 25', event: 'Math Quiz \u2014 Chapter 7' },
      { date: 'Jan 28', event: 'Science Project Due' },
      { date: 'Feb 1', event: 'Parent-Teacher Conference' },
      { date: 'Feb 5', event: 'History Essay Due' },
    ],
    summary: 'Emma had a great week. She scored 95% on the Math Chapter 7 quiz, showing significant improvement. Her Science project is progressing well. We recommend reviewing History study habits as performance has slightly declined.',
    recommendations: [
      'Emma shows strong improvement in Mathematics. Consider enrichment activities.',
      'History performance has declined slightly. Review study habits for this subject.',
      'Encourage continued participation in Science club activities.',
    ],
    resources: [
      { title: 'Khan Academy Math', subject: 'Mathematics', icon: '\uD83D\uDD22', match: '95%' },
      { title: 'History for Kids', subject: 'History', icon: '\uD83D\uDCDC', match: '88%' },
      { title: 'Science Buddies', subject: 'Science', icon: '\uD83D\uDD2C', match: '92%' },
    ],
    plan: [
      { priority: 'History \u2014 Needs Improvement', actions: ['30 min daily review with flashcards', 'Khan Academy World History course', 'Weekly practice quizzes with parent'] },
      { priority: 'Mathematics \u2014 Enrichment', actions: ['Continue current trajectory', 'Add challenge problems from AMC 8 prep', 'Consider Math Olympiad team'] },
      { priority: 'Science \u2014 Maintain & Grow', actions: ['Join Science Olympiad after-school team', 'Start science fair project planning', 'Encourage independent reading'] },
    ],
  },
  {
    name: 'Liam Thompson', grade: '5th Grade', emoji: '\uD83D\uDC66', overall: 92, attendance: 98,
    grades: [
      { subject: 'Mathematics', grade: 'A', trend: 'up' },
      { subject: 'English', grade: 'A-', trend: 'stable' },
      { subject: 'Science', grade: 'A+', trend: 'up' },
      { subject: 'History', grade: 'A', trend: 'stable' },
      { subject: 'PE', grade: 'A', trend: 'stable' },
    ],
    events: [
      { date: 'Jan 30', event: 'School Spelling Bee' },
      { date: 'Feb 3', event: 'Art Show' },
      { date: 'Feb 7', event: 'Science Museum Field Trip' },
    ],
    summary: 'Liam continues to excel across all subjects. He scored 100% on his Spelling test and his Science experiment was selected as the class example. He has qualified for the school Spelling Bee on January 30th.',
    recommendations: [
      'Liam excels in all subjects. Consider accelerated programs for next year.',
      'His leadership skills are notable. Look into student council opportunities.',
      'Strong reader \u2014 encourage more challenging books from the advanced list.',
    ],
    resources: [
      { title: 'Prodigy Math Game', subject: 'Mathematics', icon: '\uD83C\uDFAE', match: '97%' },
      { title: 'Epic! Reading', subject: 'English', icon: '\uD83D\uDCDA', match: '94%' },
      { title: 'Nat Geo Kids', subject: 'Science', icon: '\uD83C\uDF0D', match: '91%' },
    ],
    plan: [
      { priority: 'Accelerated Learning', actions: ['Enroll in 6th grade math preview program', 'Join advanced reading group', 'Apply for gifted & talented assessment'] },
      { priority: 'Leadership Development', actions: ['Run for student council representative', 'Volunteer as peer tutor', 'Lead group projects when possible'] },
    ],
  },
  {
    name: 'Sophie Thompson', grade: '10th Grade', emoji: '\uD83D\uDC69', overall: 79, attendance: 91,
    grades: [
      { subject: 'Mathematics', grade: 'C+', trend: 'down' },
      { subject: 'English', grade: 'B', trend: 'up' },
      { subject: 'Chemistry', grade: 'B-', trend: 'down' },
      { subject: 'History', grade: 'B+', trend: 'stable' },
      { subject: 'Spanish', grade: 'A-', trend: 'up' },
    ],
    events: [
      { date: 'Feb 2', event: 'Chemistry Lab Report Due' },
      { date: 'Feb 8', event: 'College Prep Workshop' },
      { date: 'Feb 10', event: 'SAT Prep Session' },
      { date: 'Feb 14', event: 'Spanish Oral Exam' },
    ],
    summary: 'Sophie\u2019s Chemistry grade dropped to B- this week. Math continues to be challenging (C+). On the positive side, Spanish improved to A- and English engagement is up. College prep workshops begin next month.',
    recommendations: [
      'Math scores need immediate attention. Schedule tutoring sessions (Tue/Thu 3\u20134 PM).',
      'Chemistry lab work needs improvement. Practice with online simulations at home.',
      'Strong performance in Spanish \u2014 consider AP Spanish for junior year.',
      'Start building college application portfolio with extracurricular activities.',
    ],
    resources: [
      { title: 'Khan Academy SAT Prep', subject: 'Math / SAT', icon: '\uD83D\uDCDD', match: '96%' },
      { title: 'Crash Course Chemistry', subject: 'Chemistry', icon: '\u2697\uFE0F', match: '90%' },
      { title: 'College Board AP', subject: 'College Prep', icon: '\uD83C\uDF93', match: '88%' },
    ],
    plan: [
      { priority: 'Mathematics \u2014 Urgent', actions: ['Sign up for after-school tutoring (Tue/Thu)', 'Complete Khan Academy SAT Math module', '30 min daily practice problems', 'Meet with math teacher for extra help'] },
      { priority: 'Chemistry \u2014 Improvement Needed', actions: ['Watch Crash Course Chemistry for each topic', 'Attend office hours before lab reports', 'Form study group with classmates'] },
      { priority: 'College Prep', actions: ['Attend Feb 8 workshop (mandatory)', 'Register for March SAT', 'Start extracurricular activity log', 'Research summer programs'] },
    ],
  },
];

const MESSAGES: Msg[][] = [
  [ // Emma
    { id: 'e1', type: 'progress', subject: 'Weekly Progress Report', preview: 'Emma had a great week! Scored 95% on the Math quiz...', full: 'Emma had a great week at school. She scored 95% on the Math Chapter 7 quiz, showing significant improvement from last week. Her Science project is progressing well and she has been actively participating in class discussions. We recommend reviewing History study habits as her last test score dropped slightly.', date: 'Today' },
    { id: 'e2', type: 'alert', subject: 'Missing Assignment Alert', preview: 'History essay was not submitted on time...', full: 'Emma\u2019s History essay on "The Roman Empire" was due on Monday but has not been submitted. Please discuss with Emma and ensure it is turned in by Friday for partial credit. Her History grade may be affected if not submitted.', date: 'Yesterday' },
    { id: 'e3', type: 'event', subject: 'Upcoming: Parent-Teacher Conference', preview: 'Your conference is scheduled for Feb 1...', full: 'Your parent-teacher conference is scheduled for February 1st at 3:00 PM in Room 204 with Ms. Martinez. Topics: Emma\u2019s overall progress, Math improvement strategies, and History study plan. Please arrive 5 minutes early.', date: '2 days ago' },
    { id: 'e4', type: 'recommendation', subject: 'Learning Recommendation', preview: 'Based on Emma\u2019s progress, we suggest enrichment...', full: 'Based on Emma\u2019s strong improvement in Mathematics, we recommend enrolling her in the after-school Math enrichment program. She also shows aptitude for Science and could benefit from the Science Olympiad team. For History, consider using Khan Academy\u2019s World History course.', date: '3 days ago' },
  ],
  [ // Liam
    { id: 'l1', type: 'progress', subject: 'Excellent Week Report', preview: 'Liam is doing wonderfully! Top of his class...', full: 'Liam had an excellent week. He scored 100% on his Spelling test and his Science experiment was selected as the class example. He continues to be a positive leader in group activities and was nominated for Student of the Month.', date: 'Today' },
    { id: 'l2', type: 'event', subject: 'Spelling Bee Qualification', preview: 'Liam has qualified for the school Spelling Bee...', full: 'Congratulations! Liam has qualified for the school-wide Spelling Bee on January 30th at 2:00 PM in the auditorium. Parents are welcome to attend. He has been practicing during recess and shows strong preparation.', date: '1 day ago' },
    { id: 'l3', type: 'event', subject: 'Field Trip Permission', preview: 'Permission needed for the Science Museum trip...', full: 'The 5th grade class will visit the Natural Science Museum on February 7th. Please sign and return the permission slip by February 3rd. Cost: $15 for admission and lunch. Bus departs at 8:30 AM.', date: '3 days ago' },
  ],
  [ // Sophie
    { id: 's1', type: 'alert', subject: 'Grade Alert: Chemistry', preview: 'Sophie\u2019s Chemistry grade has dropped to B-...', full: 'Sophie\u2019s Chemistry grade has dropped from a B to a B- after the most recent lab report and exam. Main areas of concern: stoichiometry calculations and lab procedure understanding. We recommend scheduling time with the Chemistry tutor (available Tue/Thu 3\u20134 PM).', date: 'Today' },
    { id: 's2', type: 'event', subject: 'College Prep Workshop', preview: 'Mandatory college prep session on Feb 8...', full: 'All 10th graders must attend the College Prep Workshop on February 8th from 9 AM\u201312 PM. Topics: SAT/ACT overview, application timeline, extracurricular planning, and financial aid basics. Parents are invited to the 11 AM session.', date: '1 day ago' },
    { id: 's3', type: 'recommendation', subject: 'SAT Prep Recommendation', preview: 'Based on PSAT scores, we recommend focused Math prep...', full: 'Based on Sophie\u2019s PSAT scores (Math: 480, Reading: 540), we recommend focused Math preparation. The school offers free SAT Math tutoring on Saturdays. Khan Academy\u2019s SAT prep course has been linked to her College Board account for personalized practice.', date: '2 days ago' },
    { id: 's4', type: 'alert', subject: 'Attendance Notice', preview: '3 tardies recorded this month...', full: 'Sophie has been recorded as tardy 3 times this month (Jan 8, Jan 15, Jan 22), all for 1st period. If tardiness continues, it may affect her attendance record. Please ensure she arrives by 7:45 AM for the 8:00 AM start.', date: '4 days ago' },
  ],
];

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '\uD83C\uDDFA\uD83C\uDDF8' },
  { code: 'es', name: 'Espa\u00F1ol', flag: '\uD83C\uDDEA\uD83C\uDDF8' },
  { code: 'zh', name: '\u4E2D\u6587', flag: '\uD83C\uDDE8\uD83C\uDDF3' },
  { code: 'vi', name: 'Ti\u1EBFng Vi\u1EC7t', flag: '\uD83C\uDDFB\uD83C\uDDF3' },
  { code: 'ar', name: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629', flag: '\uD83C\uDDF8\uD83C\uDDE6' },
  { code: 'ko', name: '\uD55C\uAD6D\uC5B4', flag: '\uD83C\uDDF0\uD83C\uDDF7' },
];

const TRANSLATIONS: Record<string, string> = {
  es: 'Emma tuvo una semana excelente en la escuela. Obtuvo un 95% en el examen de Matem\u00E1ticas del Cap\u00EDtulo 7, mostrando una mejora significativa. Su proyecto de Ciencias est\u00E1 progresando bien. Recomendamos revisar los h\u00E1bitos de estudio de Historia.',
  zh: '\u827E\u739B\u8FD9\u5468\u5728\u5B66\u6821\u8868\u73B0\u51FA\u8272\u3002\u5979\u5728\u7B2C7\u7AE0\u6570\u5B66\u6D4B\u9A8C\u4E2D\u83B7\u5F97\u4E8695%\u7684\u6210\u7EE9\uFF0C\u663E\u793A\u51FA\u663E\u8457\u8FDB\u6B65\u3002\u5979\u7684\u79D1\u5B66\u9879\u76EE\u8FDB\u5C55\u987A\u5229\u3002\u6211\u4EEC\u5EFA\u8BAE\u68C0\u67E5\u5386\u53F2\u79D1\u76EE\u7684\u5B66\u4E60\u4E60\u60EF\u3002',
  vi: 'Emma \u0111\u00E3 c\u00F3 m\u1ED9t tu\u1EA7n tuy\u1EC7t v\u1EDDi \u1EDF tr\u01B0\u1EDDng. Em \u0111\u1EA1t 95% trong b\u00E0i ki\u1EC3m tra To\u00E1n Ch\u01B0\u01A1ng 7. D\u1EF1 \u00E1n Khoa h\u1ECDc \u0111ang ti\u1EBFn tri\u1EC3n t\u1ED1t. Ch\u00FAng t\u00F4i khuy\u00EAn n\u00EAn xem x\u00E9t l\u1EA1i th\u00F3i quen h\u1ECDc L\u1ECBch s\u1EED.',
  ar: '\u0642\u0636\u062A \u0625\u064A\u0645\u0627 \u0623\u0633\u0628\u0648\u0639\u064B\u0627 \u0631\u0627\u0626\u0639\u064B\u0627 \u0641\u064A \u0627\u0644\u0645\u062F\u0631\u0633\u0629. \u062D\u0635\u0644\u062A \u0639\u0644\u0649 95\u066A \u0641\u064A \u0627\u062E\u062A\u0628\u0627\u0631 \u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0627\u062A \u0644\u0644\u0641\u0635\u0644 7. \u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u0639\u0644\u0648\u0645 \u064A\u0633\u064A\u0631 \u0639\u0644\u0649 \u0645\u0627 \u064A\u0631\u0627\u0645. \u0646\u0648\u0635\u064A \u0628\u0645\u0631\u0627\u062C\u0639\u0629 \u0639\u0627\u062F\u0627\u062A \u062F\u0631\u0627\u0633\u0629 \u0627\u0644\u062A\u0627\u0631\u064A\u062E.',
  ko: '\uC5E0\uB9C8\uB294 \uC774\uBC88 \uC8FC \uD559\uAD50\uC5D0\uC11C \uD6CC\uB96D\uD55C \uD55C \uC8FC\uB97C \uBCF4\uB0C8\uC2B5\uB2C8\uB2E4. 7\uC7A5 \uC218\uD559 \uC2DC\uD5D8\uC5D0\uC11C 95%\uB97C \uBC1B\uC558\uC2B5\uB2C8\uB2E4. \uACFC\uD559 \uD504\uB85C\uC81D\uD2B8\uAC00 \uC798 \uC9C4\uD589\uB418\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uC5ED\uC0AC \uACFC\uBAA9\uC758 \uD559\uC2B5 \uC2B5\uAD00\uC744 \uAC80\uD1A0\uD558\uC2DC\uAE30 \uBC14\uB78D\uB2C8\uB2E4.',
};

// ── Component ──────────────────────────────────────────────────────────────

export default function ParentEngagementDemo() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messages' | 'translate' | 'recommendations'>('dashboard');
  const [studentIdx, setStudentIdx] = useState(0);
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null);
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());
  const [dismissedRecs, setDismissedRecs] = useState<Set<number>>(new Set());
  const [expandedResource, setExpandedResource] = useState<number | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const student = STUDENTS[studentIdx];
  const studentMessages = MESSAGES[studentIdx];
  const unreadCount = studentMessages.filter(m => !readMessages.has(m.id)).length;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const selectStudent = useCallback((idx: number) => {
    setStudentIdx(idx);
    setExpandedMsg(null);
    setDismissedRecs(new Set());
    setShowPlan(false);
    setExpandedResource(null);
  }, []);

  const toggleMessage = useCallback((id: string) => {
    if (expandedMsg === id) {
      setExpandedMsg(null);
    } else {
      setExpandedMsg(id);
      setReadMessages(prev => new Set([...prev, id]));
    }
  }, [expandedMsg]);

  const handleTranslate = useCallback((code: string) => {
    setSelectedLanguage(code);
    if (code === 'en') { setTranslatedText(''); return; }
    setIsTranslating(true);
    setTimeout(() => {
      setTranslatedText(TRANSLATIONS[code] || '');
      setIsTranslating(false);
    }, 1200);
  }, []);

  const copyTranslation = useCallback(() => {
    if (translatedText) {
      navigator.clipboard?.writeText(translatedText);
      showToast('Copied to clipboard');
    }
  }, [translatedText, showToast]);

  const trendIcon = (t: 'up' | 'down' | 'stable') => ({ up: '\u2191', down: '\u2193', stable: '\u2192' })[t];
  const trendColor = (t: 'up' | 'down' | 'stable') => ({ up: 'text-green-600', down: 'text-red-600', stable: 'text-gray-600' })[t];
  const msgIcon = (t: Msg['type']) => ({ progress: '\uD83D\uDCCA', alert: '\u26A0\uFE0F', event: '\uD83D\uDCC5', recommendation: '\uD83D\uDCA1' })[t];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-teal-50 p-6 rounded-2xl">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{toast}</div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            Interactive Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Parent Engagement Portal</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered progress summaries, automated communications, and multilingual support to keep parents informed.
          </p>
        </div>

        {/* Student selector */}
        <div className="flex justify-center gap-2 mb-4">
          {STUDENTS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => selectStudent(idx)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                studentIdx === idx ? 'bg-teal-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{s.emoji}</span>
              {s.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {([
            { id: 'dashboard' as const, label: 'Progress', icon: '\uD83D\uDCCA' },
            { id: 'messages' as const, label: `Messages${unreadCount ? ` (${unreadCount})` : ''}`, icon: '\uD83D\uDCEC' },
            { id: 'translate' as const, label: 'Multilingual', icon: '\uD83C\uDF0D' },
            { id: 'recommendations' as const, label: 'AI Recommendations', icon: '\uD83D\uDCA1' },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-teal-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* ── DASHBOARD ────────────────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-2xl">{student.emoji}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-gray-500">{student.grade} &middot; Lincoln School</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-600">{student.overall}%</div>
                    <div className="text-sm text-gray-500">Overall</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{student.attendance}%</div>
                    <div className="text-sm text-gray-500">Attendance</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Recent Grades</h4>
                  <div className="space-y-3">
                    {student.grades.map((g, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-gray-700">{g.subject}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">{g.grade}</span>
                          <span className={`text-lg ${trendColor(g.trend)}`}>{trendIcon(g.trend)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Upcoming Events</h4>
                  <div className="space-y-3">
                    {student.events.map((ev, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-xs font-medium text-teal-700">
                          {ev.date}
                        </div>
                        <span className="text-gray-700">{ev.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">\uD83E\uDD16</span>
                  <h4 className="font-medium text-teal-900">AI Weekly Summary</h4>
                </div>
                <p className="text-teal-800">{student.summary}</p>
              </div>
            </div>
          )}

          {/* ── MESSAGES ─────────────────────────────────────────── */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Inbox</h3>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">{unreadCount} unread</span>
                )}
              </div>

              <div className="space-y-3">
                {studentMessages.map(msg => {
                  const isRead = readMessages.has(msg.id);
                  const isExpanded = expandedMsg === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => toggleMessage(msg.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        isRead ? 'bg-white border-gray-200' : 'bg-teal-50 border-teal-200'
                      } hover:shadow-md`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{msgIcon(msg.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${isRead ? 'text-gray-700' : 'text-gray-900'}`}>{msg.subject}</h4>
                            <span className="text-sm text-gray-500">{msg.date}</span>
                          </div>
                          {!isExpanded && <p className="text-sm text-gray-600 mt-1">{msg.preview}</p>}
                          {isExpanded && <p className="text-sm text-gray-700 mt-2 leading-relaxed">{msg.full}</p>}
                        </div>
                        {!isRead && <span className="w-3 h-3 bg-teal-500 rounded-full flex-shrink-0 mt-1" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => showToast('Meeting scheduler opened')} className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-200">
                    \uD83D\uDCC5 Schedule Meeting
                  </button>
                  <button onClick={() => showToast('Message sent to teacher')} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">
                    \u2709\uFE0F Message Teacher
                  </button>
                  <button onClick={() => showToast('Report card downloaded')} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">
                    \uD83D\uDCCB View Report Card
                  </button>
                  <button onClick={() => showToast('Notification preferences saved')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                    \u2699\uFE0F Notification Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── TRANSLATE ────────────────────────────────────────── */}
          {activeTab === 'translate' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Multilingual Communication</h3>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-3">Original Message (English)</h4>
                <p className="text-gray-700">{student.summary}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Translate to:</h4>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleTranslate(lang.code)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                        selectedLanguage === lang.code ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-teal-400'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {selectedLanguage !== 'en' && (
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-teal-900">
                      Translated ({LANGUAGES.find(l => l.code === selectedLanguage)?.name})
                    </h4>
                    <div className="flex gap-2">
                      <button onClick={copyTranslation} className="text-sm text-teal-600 hover:text-teal-700">\uD83D\uDCCB Copy</button>
                      <button onClick={() => showToast('Translation sent to parent')} className="text-sm text-teal-600 hover:text-teal-700">\uD83D\uDCE7 Send</button>
                    </div>
                  </div>
                  {isTranslating ? (
                    <div className="flex items-center gap-3 text-teal-700">
                      <span className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                      Translating...
                    </div>
                  ) : (
                    <p className="text-teal-800" dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}>{translatedText}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── RECOMMENDATIONS ──────────────────────────────────── */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Learning Recommendations</h3>

              <div className="space-y-4">
                {student.recommendations.map((rec, idx) =>
                  dismissedRecs.has(idx) ? null : (
                    <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">\uD83D\uDCA1</span>
                        <div className="flex-1">
                          <p className="text-gray-800">{rec}</p>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => setExpandedResource(expandedResource === idx ? null : idx)}
                              className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-lg hover:bg-teal-200"
                            >
                              {expandedResource === idx ? 'Hide Resources' : 'View Resources'}
                            </button>
                            <button
                              onClick={() => { setDismissedRecs(prev => new Set([...prev, idx])); showToast('Recommendation dismissed'); }}
                              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                            >
                              Dismiss
                            </button>
                          </div>
                          {expandedResource === idx && student.resources[idx] && (
                            <div className="mt-3 p-3 bg-white rounded-lg border border-teal-200">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">{student.resources[idx].icon}</span>
                                <span className="font-medium text-gray-900">{student.resources[idx].title}</span>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">{student.resources[idx].match} match</span>
                              </div>
                              <p className="text-sm text-gray-500">{student.resources[idx].subject}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <h4 className="font-medium text-purple-900 mb-4">Suggested Learning Resources</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {student.resources.map((r, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{r.icon}</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">{r.match} match</span>
                      </div>
                      <h5 className="font-medium text-gray-900">{r.title}</h5>
                      <p className="text-sm text-gray-500">{r.subject}</p>
                      <button onClick={() => showToast(`Opening ${r.title}`)} className="mt-2 text-sm text-purple-600 hover:text-purple-700">
                        Learn more \u2192
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => { setShowPlan(true); showToast('Learning plan generated!'); }}
                  className={`flex-1 py-3 font-medium rounded-xl transition ${showPlan ? 'bg-green-600 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                >
                  {showPlan ? '\u2713 Learning Plan Generated' : 'Generate Personalized Learning Plan'}
                </button>
                <button onClick={() => showToast('Plan shared with teacher')} className="px-6 py-3 border border-teal-600 text-teal-600 font-medium rounded-xl hover:bg-teal-50 transition">
                  Share with Teacher
                </button>
              </div>

              {showPlan && (
                <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
                  <h4 className="font-medium text-teal-900 mb-4">Personalized Learning Plan for {student.name}</h4>
                  <div className="space-y-4">
                    {student.plan.map((p, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 border border-teal-200">
                        <h5 className="font-semibold text-gray-900 mb-2">{p.priority}</h5>
                        <ul className="space-y-1">
                          {p.actions.map((a, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-teal-500 mt-0.5">\u2022</span>
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {([
            { icon: '\uD83D\uDCCA', title: 'Progress Tracking', desc: 'Real-time updates' },
            { icon: '\uD83C\uDF0D', title: 'Multilingual', desc: '40+ languages' },
            { icon: '\uD83D\uDCEC', title: 'Auto Messages', desc: 'Smart notifications' },
            { icon: '\uD83D\uDCA1', title: 'AI Insights', desc: 'Learning recommendations' },
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
