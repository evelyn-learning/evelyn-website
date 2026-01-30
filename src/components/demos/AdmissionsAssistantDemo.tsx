'use client';

import React, { useState, useRef, useEffect } from 'react';

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
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'waitlisted';
  score: number;
  documents: { name: string; status: 'verified' | 'pending' | 'missing' }[];
  flags: string[];
}

const SAMPLE_APPLICATIONS: Application[] = [
  {
    id: 'APP-2024-001',
    name: 'Sarah Chen',
    program: 'Computer Science, BS',
    status: 'reviewing',
    score: 92,
    documents: [
      { name: 'Transcript', status: 'verified' },
      { name: 'SAT Scores', status: 'verified' },
      { name: 'Recommendation 1', status: 'verified' },
      { name: 'Recommendation 2', status: 'pending' },
      { name: 'Essay', status: 'verified' },
    ],
    flags: ['Strong STEM background', 'Leadership activities'],
  },
  {
    id: 'APP-2024-002',
    name: 'Marcus Johnson',
    program: 'Business Administration, MBA',
    status: 'interview',
    score: 88,
    documents: [
      { name: 'Transcript', status: 'verified' },
      { name: 'GMAT Scores', status: 'verified' },
      { name: 'Resume', status: 'verified' },
      { name: 'Recommendation 1', status: 'verified' },
      { name: 'Recommendation 2', status: 'verified' },
    ],
    flags: ['5+ years work experience', 'International background'],
  },
  {
    id: 'APP-2024-003',
    name: 'Emma Rodriguez',
    program: 'Psychology, BA',
    status: 'pending',
    score: 78,
    documents: [
      { name: 'Transcript', status: 'verified' },
      { name: 'SAT Scores', status: 'missing' },
      { name: 'Recommendation 1', status: 'pending' },
      { name: 'Essay', status: 'verified' },
    ],
    flags: ['First-generation student', 'Community service'],
  },
];

const CHATBOT_RESPONSES: Record<string, string> = {
  'default': "Hello! I'm the AI Admissions Assistant for State University. I can help you with application questions, program information, deadlines, and financial aid. What would you like to know?",
  'deadline': "Great question! Here are our upcoming deadlines:\n\n**Fall 2024 Admissions:**\n- Early Decision: November 1, 2024\n- Regular Decision: January 15, 2025\n- Transfer Students: March 1, 2025\n\nFinancial aid applications (FAFSA) should be submitted by February 1, 2025 for priority consideration.",
  'requirements': "For undergraduate admissions, you'll need:\n\n1. **Academic Records:** Official high school transcript\n2. **Test Scores:** SAT or ACT (optional for 2024)\n3. **Essays:** Personal statement (650 words max)\n4. **Recommendations:** 2 letters from teachers/counselors\n5. **Application Fee:** $65 (fee waivers available)\n\nWould you like details on any specific requirement?",
  'financial': "We offer several financial aid options:\n\n**Merit Scholarships:** $5,000-$25,000/year based on academic achievement\n**Need-Based Aid:** Grants and work-study programs\n**Loans:** Federal and private options available\n\n**Key Stats:**\n- 78% of students receive financial aid\n- Average award: $18,500/year\n- Net price calculator available on our website\n\nHave you completed your FAFSA yet?",
  'programs': "We offer 120+ undergraduate and 80+ graduate programs across 8 colleges:\n\n**Popular Programs:**\n- Computer Science (Top 25 nationally)\n- Business Administration\n- Nursing (97% job placement)\n- Engineering\n- Psychology\n\nOur newest programs include Data Science and Cybersecurity. Would you like details on a specific program?",
  'status': "To check your application status:\n\n1. Log into the Applicant Portal\n2. Click 'Application Status'\n3. View document checklist and decision timeline\n\n**Typical Review Timeline:**\n- Document verification: 1-2 weeks\n- Application review: 4-6 weeks\n- Decision notification: Within 8 weeks\n\nWould you like me to explain what each status means?",
};

export default function AdmissionsAssistantDemo() {
  const [activeTab, setActiveTab] = useState<'chatbot' | 'review' | 'documents' | 'analytics'>('chatbot');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: CHATBOT_RESPONSES['default'], timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = inputValue.toLowerCase();
      let response = CHATBOT_RESPONSES['default'];

      if (lowerInput.includes('deadline') || lowerInput.includes('when')) {
        response = CHATBOT_RESPONSES['deadline'];
      } else if (lowerInput.includes('require') || lowerInput.includes('need') || lowerInput.includes('submit')) {
        response = CHATBOT_RESPONSES['requirements'];
      } else if (lowerInput.includes('financial') || lowerInput.includes('scholarship') || lowerInput.includes('cost') || lowerInput.includes('tuition')) {
        response = CHATBOT_RESPONSES['financial'];
      } else if (lowerInput.includes('program') || lowerInput.includes('major') || lowerInput.includes('degree')) {
        response = CHATBOT_RESPONSES['programs'];
      } else if (lowerInput.includes('status') || lowerInput.includes('application') || lowerInput.includes('check')) {
        response = CHATBOT_RESPONSES['status'];
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getStatusColor = (status: Application['status']) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      reviewing: 'bg-blue-100 text-blue-800',
      interview: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      waitlisted: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status];
  };

  const getDocStatusColor = (status: 'verified' | 'pending' | 'missing') => {
    const colors = {
      verified: 'text-green-600',
      pending: 'text-yellow-600',
      missing: 'text-red-600',
    };
    return colors[status];
  };

  const getDocStatusIcon = (status: 'verified' | 'pending' | 'missing') => {
    const icons = { verified: '✓', pending: '⏳', missing: '✗' };
    return icons[status];
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-2xl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Higher Education Solution
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Admissions Assistant</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            24/7 prospective student support, automated application review, and enrollment prediction.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'chatbot', label: 'Student Chatbot', icon: '💬' },
            { id: 'review', label: 'Application Review', icon: '📋' },
            { id: 'documents', label: 'Document Verification', icon: '📄' },
            { id: 'analytics', label: 'Enrollment Prediction', icon: '📊' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {activeTab === 'chatbot' && (
            <div className="flex flex-col h-[500px]">
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-2xl">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick replies */}
              <div className="px-4 py-2 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {['Application deadlines?', 'What are the requirements?', 'Financial aid options?', 'Check my status'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInputValue(q)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full hover:bg-blue-100 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about admissions, programs, or financial aid..."
                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Application Queue</h3>
                <div className="flex gap-2">
                  <select className="p-2 border border-gray-200 rounded-lg text-sm">
                    <option>All Programs</option>
                    <option>Computer Science</option>
                    <option>Business</option>
                    <option>Engineering</option>
                  </select>
                  <select className="p-2 border border-gray-200 rounded-lg text-sm">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Reviewing</option>
                    <option>Interview</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {SAMPLE_APPLICATIONS.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      selectedApp?.id === app.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
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
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                    {selectedApp?.id === app.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">AI Highlights</h5>
                            <div className="flex flex-wrap gap-2">
                              {app.flags.map((flag, idx) => (
                                <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  {flag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Documents</h5>
                            <div className="space-y-1">
                              {app.documents.slice(0, 3).map((doc, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <span className={getDocStatusColor(doc.status)}>{getDocStatusIcon(doc.status)}</span>
                                  <span className="text-gray-600">{doc.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                            Full Review
                          </button>
                          <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                            Schedule Interview
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                            Request Documents
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Document Verification Center</h3>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-green-600">1,247</div>
                  <div className="text-sm text-gray-600">Verified</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-yellow-600">89</div>
                  <div className="text-sm text-gray-600">Pending Review</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-red-600">23</div>
                  <div className="text-sm text-gray-600">Issues Detected</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">AI Document Analysis</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 text-xl">✓</span>
                      <div>
                        <p className="font-medium text-gray-900">transcript_chen_sarah.pdf</p>
                        <p className="text-sm text-gray-500">GPA: 3.8 | Credits: 120 | Institution Verified</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Verified</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-600 text-xl">⚠️</span>
                      <div>
                        <p className="font-medium text-gray-900">recommendation_johnson.pdf</p>
                        <p className="text-sm text-gray-500">Signature verification pending | Letterhead detected</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">Review Needed</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <span className="text-red-600 text-xl">✗</span>
                      <div>
                        <p className="font-medium text-gray-900">sat_scores_rodriguez.pdf</p>
                        <p className="text-sm text-gray-500">Document quality too low | Possible alteration detected</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">Flagged</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition">
                Process Pending Documents (89)
              </button>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Enrollment Prediction Dashboard</h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                  <h4 className="text-sm font-medium text-blue-100 mb-2">Predicted Enrollment</h4>
                  <div className="text-4xl font-bold mb-2">2,847</div>
                  <p className="text-sm text-blue-100">Target: 3,000 | Gap: 153 students</p>
                  <div className="mt-4 h-2 bg-blue-400 rounded-full">
                    <div className="h-full bg-white rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
                  <h4 className="text-sm font-medium text-green-100 mb-2">Yield Rate Prediction</h4>
                  <div className="text-4xl font-bold mb-2">34.2%</div>
                  <p className="text-sm text-green-100">Last year: 32.8% | +1.4% improvement</p>
                  <div className="mt-4 text-sm">
                    <span className="text-green-200">Top yield factors: </span>
                    <span>Financial aid, campus visit, early engagement</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-medium text-gray-900 mb-4">AI-Powered Yield Recommendations</h4>
                <div className="space-y-3">
                  {[
                    { action: 'Send personalized financial aid package to 234 high-fit, low-yield prospects', impact: '+45 enrollments', priority: 'high' },
                    { action: 'Schedule virtual campus tours for 156 admitted international students', impact: '+28 enrollments', priority: 'high' },
                    { action: 'Connect current students with 89 undecided admits in same major', impact: '+18 enrollments', priority: 'medium' },
                    { action: 'Send deadline reminder to 423 incomplete applications', impact: '+52 completions', priority: 'medium' },
                  ].map((rec, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${rec.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                        <span className="text-gray-700">{rec.action}</span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        {rec.impact}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition">
                  Execute All Recommendations
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {[
            { icon: '💬', title: '24/7 Chatbot', desc: 'Instant student support' },
            { icon: '📋', title: 'Smart Review', desc: 'AI application scoring' },
            { icon: '📄', title: 'Doc Verify', desc: 'Automated verification' },
            { icon: '📊', title: 'Predictions', desc: 'Enrollment forecasting' },
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
