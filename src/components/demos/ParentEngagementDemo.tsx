'use client';

import React, { useState } from 'react';

interface Student {
  id: string;
  name: string;
  grade: string;
  overallScore: number;
  attendance: number;
  recentGrades: { subject: string; grade: string; trend: 'up' | 'down' | 'stable' }[];
  upcomingEvents: { date: string; event: string }[];
  recommendations: string[];
}

interface Message {
  id: string;
  type: 'progress' | 'alert' | 'event' | 'recommendation';
  subject: string;
  preview: string;
  date: string;
  read: boolean;
}

const SAMPLE_STUDENT: Student = {
  id: '1',
  name: 'Emma Thompson',
  grade: '7th Grade',
  overallScore: 87,
  attendance: 96,
  recentGrades: [
    { subject: 'Mathematics', grade: 'A-', trend: 'up' },
    { subject: 'English', grade: 'B+', trend: 'stable' },
    { subject: 'Science', grade: 'A', trend: 'up' },
    { subject: 'History', grade: 'B', trend: 'down' },
    { subject: 'Art', grade: 'A+', trend: 'stable' },
  ],
  upcomingEvents: [
    { date: 'Jan 25', event: 'Math Quiz - Chapter 7' },
    { date: 'Jan 28', event: 'Science Project Due' },
    { date: 'Feb 1', event: 'Parent-Teacher Conference' },
    { date: 'Feb 5', event: 'History Essay Due' },
  ],
  recommendations: [
    'Emma shows strong improvement in Mathematics. Consider enrichment activities.',
    'History performance has declined slightly. Review study habits for this subject.',
    'Encourage continued participation in Science club activities.',
  ],
};

const SAMPLE_MESSAGES: Message[] = [
  { id: '1', type: 'progress', subject: 'Weekly Progress Report', preview: 'Emma had a great week! Scored 95% on the Math quiz...', date: 'Today', read: false },
  { id: '2', type: 'alert', subject: 'Missing Assignment Alert', preview: 'History essay was not submitted on time...', date: 'Yesterday', read: false },
  { id: '3', type: 'event', subject: 'Upcoming: Parent-Teacher Conference', preview: 'Your conference is scheduled for Feb 1 at 3:00 PM...', date: '2 days ago', read: true },
  { id: '4', type: 'recommendation', subject: 'Learning Recommendation', preview: 'Based on Emma\'s progress, we suggest Khan Academy for...', date: '3 days ago', read: true },
];

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export default function ParentEngagementDemo() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messages' | 'translate' | 'recommendations'>('dashboard');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = (targetLang: string) => {
    setSelectedLanguage(targetLang);
    setIsTranslating(true);

    setTimeout(() => {
      const translations: Record<string, string> = {
        es: 'Emma tuvo una semana excelente en la escuela. Obtuvo un 95% en el examen de Matemáticas del Capítulo 7, mostrando una mejora significativa. Su proyecto de Ciencias está progresando bien y está programado para entregarse el 28 de enero. Recomendamos revisar los hábitos de estudio de Historia, ya que el rendimiento ha disminuido ligeramente.',
        zh: '艾玛这周在学校表现出色。她在第7章数学测验中获得了95%的成绩，显示出显著进步。她的科学项目进展顺利，计划于1月28日提交。我们建议检查历史科目的学习习惯，因为成绩略有下降。',
        vi: 'Emma đã có một tuần tuyệt vời ở trường. Em đạt 95% trong bài kiểm tra Toán Chương 7, cho thấy sự tiến bộ đáng kể. Dự án Khoa học của em đang tiến triển tốt và dự kiến nộp vào ngày 28 tháng 1. Chúng tôi khuyên nên xem xét lại thói quen học Lịch sử vì kết quả đã giảm nhẹ.',
        ar: 'قضت إيما أسبوعًا رائعًا في المدرسة. حصلت على 95٪ في اختبار الرياضيات للفصل 7، مما يدل على تحسن ملحوظ. مشروع العلوم يسير على ما يرام ومن المقرر تقديمه في 28 يناير. نوصي بمراجعة عادات دراسة التاريخ حيث انخفض الأداء قليلاً.',
        ko: '엠마는 이번 주 학교에서 훌륭한 한 주를 보냈습니다. 7장 수학 시험에서 95%를 받아 상당한 향상을 보여주었습니다. 과학 프로젝트가 잘 진행되고 있으며 1월 28일에 제출 예정입니다. 성적이 약간 하락했으므로 역사 과목의 학습 습관을 검토하시기 바랍니다.',
      };
      setTranslatedText(translations[targetLang] || '');
      setIsTranslating(false);
    }, 1500);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    const icons = { up: '↑', down: '↓', stable: '→' };
    return icons[trend];
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    const colors = { up: 'text-green-600', down: 'text-red-600', stable: 'text-gray-600' };
    return colors[trend];
  };

  const getMessageIcon = (type: Message['type']) => {
    const icons = { progress: '📊', alert: '⚠️', event: '📅', recommendation: '💡' };
    return icons[type];
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-teal-50 p-6 rounded-2xl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
            K-12 Solution
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Parent Engagement Portal</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered progress summaries, automated communications, and multilingual support
            to keep parents informed and engaged.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'dashboard', label: 'Progress Dashboard', icon: '📊' },
            { id: 'messages', label: 'Messages', icon: '📬' },
            { id: 'translate', label: 'Multilingual', icon: '🌍' },
            { id: 'recommendations', label: 'AI Recommendations', icon: '💡' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-lg'
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
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Student Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-2xl">
                    👧
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{SAMPLE_STUDENT.name}</h3>
                    <p className="text-gray-500">{SAMPLE_STUDENT.grade} • Lincoln Middle School</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-600">{SAMPLE_STUDENT.overallScore}%</div>
                    <div className="text-sm text-gray-500">Overall</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{SAMPLE_STUDENT.attendance}%</div>
                    <div className="text-sm text-gray-500">Attendance</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Grades */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Recent Grades</h4>
                  <div className="space-y-3">
                    {SAMPLE_STUDENT.recentGrades.map((grade, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-gray-700">{grade.subject}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">{grade.grade}</span>
                          <span className={`text-lg ${getTrendColor(grade.trend)}`}>
                            {getTrendIcon(grade.trend)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Upcoming Events</h4>
                  <div className="space-y-3">
                    {SAMPLE_STUDENT.upcomingEvents.map((event, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-xs font-medium text-teal-700">
                          {event.date}
                        </div>
                        <span className="text-gray-700">{event.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🤖</span>
                  <h4 className="font-medium text-teal-900">AI Weekly Summary</h4>
                </div>
                <p className="text-teal-800">
                  Emma had a great week at school. She scored 95% on the Math Chapter 7 quiz,
                  showing significant improvement. Her Science project is progressing well and is
                  scheduled for submission on January 28th. We recommend reviewing History study
                  habits as performance has slightly declined.
                </p>
                <button className="mt-3 text-teal-600 text-sm font-medium hover:text-teal-700">
                  View Full Report →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Inbox</h3>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  2 unread
                </span>
              </div>

              <div className="space-y-3">
                {SAMPLE_MESSAGES.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      message.read ? 'bg-white border-gray-200' : 'bg-teal-50 border-teal-200'
                    } hover:shadow-md`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getMessageIcon(message.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${message.read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {message.subject}
                          </h4>
                          <span className="text-sm text-gray-500">{message.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{message.preview}</p>
                      </div>
                      {!message.read && (
                        <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-200">
                    📅 Schedule Meeting
                  </button>
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">
                    ✉️ Message Teacher
                  </button>
                  <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">
                    📋 View Report Card
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                    ⚙️ Notification Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'translate' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Multilingual Communication</h3>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-3">Original Message (English)</h4>
                <p className="text-gray-700">
                  Emma had a great week at school. She scored 95% on the Math Chapter 7 quiz,
                  showing significant improvement. Her Science project is progressing well and is
                  scheduled for submission on January 28th. We recommend reviewing History study
                  habits as performance has slightly declined.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Translate to:</h4>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleTranslate(lang.code)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                        selectedLanguage === lang.code
                          ? 'bg-teal-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-teal-400'
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
                      Translated Message ({LANGUAGES.find(l => l.code === selectedLanguage)?.name})
                    </h4>
                    <div className="flex gap-2">
                      <button className="text-sm text-teal-600 hover:text-teal-700">📋 Copy</button>
                      <button className="text-sm text-teal-600 hover:text-teal-700">📧 Send</button>
                    </div>
                  </div>
                  {isTranslating ? (
                    <div className="flex items-center gap-3 text-teal-700">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Translating...
                    </div>
                  ) : (
                    <p className="text-teal-800" dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}>
                      {translatedText}
                    </p>
                  )}
                </div>
              )}

              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 mb-2">Automatic Translation Settings</h4>
                <p className="text-sm text-blue-700 mb-3">
                  All communications can be automatically translated to your preferred language.
                </p>
                <div className="flex items-center gap-4">
                  <select className="p-2 border border-blue-200 rounded-lg bg-white">
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-teal-600" />
                    <span className="text-sm text-gray-700">Auto-translate all messages</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Learning Recommendations</h3>

              <div className="space-y-4">
                {SAMPLE_STUDENT.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <p className="text-gray-800">{rec}</p>
                        <div className="flex gap-2 mt-3">
                          <button className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-lg hover:bg-teal-200">
                            View Resources
                          </button>
                          <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300">
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <h4 className="font-medium text-purple-900 mb-4">Suggested Learning Resources</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: 'Khan Academy Math', subject: 'Mathematics', icon: '🔢', match: '95%' },
                    { title: 'History for Kids', subject: 'History', icon: '📜', match: '88%' },
                    { title: 'Science Buddies', subject: 'Science', icon: '🔬', match: '92%' },
                  ].map((resource, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{resource.icon}</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          {resource.match} match
                        </span>
                      </div>
                      <h5 className="font-medium text-gray-900">{resource.title}</h5>
                      <p className="text-sm text-gray-500">{resource.subject}</p>
                      <button className="mt-2 text-sm text-purple-600 hover:text-purple-700">
                        Learn more →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition">
                  Generate Personalized Learning Plan
                </button>
                <button className="px-6 py-3 border border-teal-600 text-teal-600 font-medium rounded-xl hover:bg-teal-50 transition">
                  Share with Teacher
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {[
            { icon: '📊', title: 'Progress Tracking', desc: 'Real-time updates' },
            { icon: '🌍', title: 'Multilingual', desc: '40+ languages' },
            { icon: '📬', title: 'Auto Messages', desc: 'Smart notifications' },
            { icon: '💡', title: 'AI Insights', desc: 'Learning recommendations' },
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
