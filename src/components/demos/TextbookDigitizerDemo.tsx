'use client';

import React, { useState } from 'react';

interface Chapter {
  id: string;
  title: string;
  pages: string;
  status: 'pending' | 'processing' | 'complete';
  elements: {
    paragraphs: number;
    images: number;
    quizzes: number;
    highlights: number;
  };
}

interface ConversionStats {
  totalPages: number;
  processedPages: number;
  quizzesGenerated: number;
  imagesOptimized: number;
  accessibilityScore: number;
}

const SAMPLE_CHAPTERS: Chapter[] = [
  {
    id: '1',
    title: 'Chapter 1: Introduction to Economics',
    pages: '1-24',
    status: 'complete',
    elements: { paragraphs: 45, images: 8, quizzes: 5, highlights: 12 },
  },
  {
    id: '2',
    title: 'Chapter 2: Supply and Demand',
    pages: '25-52',
    status: 'complete',
    elements: { paragraphs: 62, images: 15, quizzes: 8, highlights: 18 },
  },
  {
    id: '3',
    title: 'Chapter 3: Market Equilibrium',
    pages: '53-78',
    status: 'processing',
    elements: { paragraphs: 38, images: 10, quizzes: 0, highlights: 0 },
  },
  {
    id: '4',
    title: 'Chapter 4: Elasticity',
    pages: '79-102',
    status: 'pending',
    elements: { paragraphs: 0, images: 0, quizzes: 0, highlights: 0 },
  },
];

const SAMPLE_QUIZ = {
  question: 'According to the law of demand, when the price of a good increases, what happens to the quantity demanded?',
  options: [
    'Quantity demanded increases',
    'Quantity demanded decreases',
    'Quantity demanded stays the same',
    'It depends on the type of good',
  ],
  correct: 1,
  explanation: 'The law of demand states that, all else being equal, as the price of a good increases, the quantity demanded decreases. This inverse relationship is fundamental to understanding market behavior.',
};

export default function TextbookDigitizerDemo() {
  const [activeTab, setActiveTab] = useState<'upload' | 'preview' | 'enhance' | 'export'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [conversionStats, setConversionStats] = useState<ConversionStats | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setUploadedFile('Economics_Principles_10th_Edition.pdf');
      setConversionStats({
        totalPages: 456,
        processedPages: 78,
        quizzesGenerated: 13,
        imagesOptimized: 33,
        accessibilityScore: 94,
      });
      setIsProcessing(false);
      setActiveTab('preview');
    }, 2500);
  };

  const getStatusColor = (status: Chapter['status']) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-600',
      processing: 'bg-blue-100 text-blue-600',
      complete: 'bg-green-100 text-green-600',
    };
    return colors[status];
  };

  const getStatusIcon = (status: Chapter['status']) => {
    const icons = { pending: '⏳', processing: '🔄', complete: '✓' };
    return icons[status];
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-amber-50 p-6 rounded-2xl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            Publisher Solution
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Textbook Digitizer</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert print textbooks to interactive digital formats with auto-generated quizzes,
            highlights, and study tools.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'upload', label: 'Upload & Process', icon: '📤' },
            { id: 'preview', label: 'Content Preview', icon: '👁️' },
            { id: 'enhance', label: 'AI Enhancement', icon: '✨' },
            { id: 'export', label: 'Export Options', icon: '📦' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-lg'
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
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
                  isProcessing ? 'border-amber-300 bg-amber-50' : 'border-gray-300 hover:border-amber-400'
                }`}
              >
                {isProcessing ? (
                  <div>
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Textbook...</h3>
                    <p className="text-gray-600 mb-4">AI is analyzing content structure and extracting elements</p>
                    <div className="max-w-xs mx-auto">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Analyzing Chapter 3: Market Equilibrium...</p>
                    </div>
                  </div>
                ) : uploadedFile ? (
                  <div>
                    <span className="text-5xl">📚</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{uploadedFile}</h3>
                    <p className="text-gray-600">456 pages • Uploaded successfully</p>
                    <button
                      onClick={() => { setUploadedFile(null); setConversionStats(null); }}
                      className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Upload Different File
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="text-5xl">📄</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Upload Your Textbook</h3>
                    <p className="text-gray-600 mb-4">Drag and drop a PDF or click to browse</p>
                    <button
                      onClick={handleUpload}
                      className="px-6 py-3 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition"
                    >
                      Select PDF File
                    </button>
                    <p className="text-sm text-gray-500 mt-4">Supports PDF, EPUB, DOCX • Max 500MB</p>
                  </div>
                )}
              </div>

              {conversionStats && (
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-900">{conversionStats.totalPages}</div>
                    <div className="text-sm text-gray-500">Total Pages</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-600">{conversionStats.processedPages}</div>
                    <div className="text-sm text-gray-500">Processed</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-600">{conversionStats.quizzesGenerated}</div>
                    <div className="text-sm text-gray-500">Quizzes</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-purple-600">{conversionStats.imagesOptimized}</div>
                    <div className="text-sm text-gray-500">Images</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-amber-600">{conversionStats.accessibilityScore}%</div>
                    <div className="text-sm text-gray-500">Accessibility</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chapter Structure</h3>
                <span className="text-sm text-gray-500">Economics: Principles (10th Edition)</span>
              </div>

              <div className="space-y-3">
                {SAMPLE_CHAPTERS.map((chapter) => (
                  <div
                    key={chapter.id}
                    onClick={() => setSelectedChapter(selectedChapter?.id === chapter.id ? null : chapter)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      selectedChapter?.id === chapter.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg ${getStatusColor(chapter.status)}`}>
                          {chapter.status === 'processing' ? (
                            <span className="animate-spin">🔄</span>
                          ) : (
                            getStatusIcon(chapter.status)
                          )}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                          <p className="text-sm text-gray-500">Pages {chapter.pages}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(chapter.status)}`}>
                        {chapter.status}
                      </span>
                    </div>

                    {selectedChapter?.id === chapter.id && chapter.status === 'complete' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">{chapter.elements.paragraphs}</div>
                            <div className="text-xs text-gray-500">Paragraphs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">{chapter.elements.images}</div>
                            <div className="text-xs text-gray-500">Images</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-blue-600">{chapter.elements.quizzes}</div>
                            <div className="text-xs text-gray-500">Quizzes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-amber-600">{chapter.elements.highlights}</div>
                            <div className="text-xs text-gray-500">Key Terms</div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700">
                            Preview Chapter
                          </button>
                          <button className="flex-1 py-2 border border-amber-600 text-amber-600 text-sm font-medium rounded-lg hover:bg-amber-50">
                            Edit Content
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'enhance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Learning Elements</h3>

              {/* Sample Quiz */}
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">❓</span>
                  <h4 className="font-medium text-gray-900">Auto-Generated Quiz Question</h4>
                  <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full">Chapter 2</span>
                </div>

                <p className="text-gray-800 mb-4">{SAMPLE_QUIZ.question}</p>

                <div className="space-y-2 mb-4">
                  {SAMPLE_QUIZ.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedAnswer(idx); setShowExplanation(true); }}
                      className={`w-full p-3 text-left rounded-lg border transition ${
                        selectedAnswer === idx
                          ? idx === SAMPLE_QUIZ.correct
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : 'border-red-500 bg-red-50 text-red-800'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {option}
                      {selectedAnswer === idx && idx === SAMPLE_QUIZ.correct && (
                        <span className="float-right text-green-600">✓</span>
                      )}
                      {selectedAnswer === idx && idx !== SAMPLE_QUIZ.correct && (
                        <span className="float-right text-red-600">✗</span>
                      )}
                    </button>
                  ))}
                </div>

                {showExplanation && (
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <h5 className="font-medium text-gray-900 mb-2">Explanation</h5>
                    <p className="text-sm text-gray-600">{SAMPLE_QUIZ.explanation}</p>
                  </div>
                )}
              </div>

              {/* Enhancement Options */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Generate More Elements</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Quiz Questions', count: '+50 questions', icon: '❓' },
                      { label: 'Flashcards', count: '+120 cards', icon: '🎴' },
                      { label: 'Chapter Summaries', count: '4 summaries', icon: '📝' },
                      { label: 'Key Term Glossary', count: '+85 terms', icon: '📖' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <div className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span className="text-gray-700">{item.label}</span>
                        </div>
                        <span className="text-sm text-amber-600 font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700">
                    Generate All
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Accessibility Enhancements</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Alt text for images', status: '33/33 complete', done: true },
                      { label: 'Reading level adjustment', status: 'Available', done: true },
                      { label: 'Audio narration', status: 'Generate now', done: false },
                      { label: 'Screen reader optimization', status: '94% compliant', done: true },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <span className="text-gray-700">{item.label}</span>
                        <span className={`text-sm ${item.done ? 'text-green-600' : 'text-amber-600'}`}>
                          {item.done ? '✓' : '→'} {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 border border-amber-600 text-amber-600 font-medium rounded-lg hover:bg-amber-50">
                    Accessibility Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Your Digital Textbook</h3>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { format: 'EPUB 3', desc: 'Interactive e-reader format', icon: '📱', popular: true },
                  { format: 'Web (HTML5)', desc: 'Browser-based reading', icon: '🌐', popular: false },
                  { format: 'PDF (Enhanced)', desc: 'Print-ready with links', icon: '📄', popular: false },
                  { format: 'LMS Package', desc: 'SCORM/LTI compatible', icon: '🎓', popular: true },
                  { format: 'Kindle (KF8)', desc: 'Amazon ecosystem', icon: '📚', popular: false },
                  { format: 'API/JSON', desc: 'Raw content access', icon: '⚙️', popular: false },
                ].map((format, idx) => (
                  <div key={idx} className="relative p-4 rounded-xl border border-gray-200 hover:border-amber-400 transition cursor-pointer">
                    {format.popular && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full">
                        Popular
                      </span>
                    )}
                    <span className="text-3xl">{format.icon}</span>
                    <h4 className="font-medium text-gray-900 mt-2">{format.format}</h4>
                    <p className="text-sm text-gray-500">{format.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-3">Export Settings</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Include Elements</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded text-amber-600" />
                        <span className="text-sm">Quiz questions & answers</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded text-amber-600" />
                        <span className="text-sm">Flashcard deck</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded text-amber-600" />
                        <span className="text-sm">Chapter summaries</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-amber-600" />
                        <span className="text-sm">Audio narration</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Branding</label>
                    <div className="space-y-3">
                      <input type="text" placeholder="Publisher name" className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
                      <input type="text" placeholder="Copyright notice" className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
                      <button className="text-sm text-amber-600 hover:text-amber-700">+ Upload logo</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition">
                  Export Digital Textbook
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition">
                  Schedule Batch Export
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {[
            { icon: '📄', title: 'PDF to Digital', desc: 'Intelligent extraction' },
            { icon: '❓', title: 'Auto Quizzes', desc: 'AI-generated tests' },
            { icon: '🎴', title: 'Flashcards', desc: 'Study tool creation' },
            { icon: '♿', title: 'Accessible', desc: 'WCAG compliant' },
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
