'use client';

import { useState, useCallback, useRef } from 'react';
import { safeAPICall } from '@core/utils/api-error-handler';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';
import type { GeneratedCourse, CourseModule } from '@core/utils/export/pdf-course-export';

export type { GeneratedCourse, CourseModule };

const SAMPLE_INPUTS = {
  document: {
    title: 'Introduction to Machine Learning',
    content: `Machine learning is a subset of artificial intelligence that enables systems to learn from data.

Key concepts include:
- Supervised Learning: Learning from labeled examples
- Unsupervised Learning: Finding patterns in unlabeled data
- Neural Networks: Computing systems inspired by biological brains
- Training Data: The examples used to teach the model
- Model Evaluation: Testing accuracy on new data

Applications range from recommendation systems to medical diagnosis, autonomous vehicles, and natural language processing.`
  },
  video: {
    title: 'Cell Biology Fundamentals',
    duration: '45 minutes',
    topics: ['Cell structure', 'Organelles', 'Cell division', 'Membrane transport']
  }
};

export default function CourseCreatorStudioDemo() {
  const trackInteraction = useTrackInteraction();
  const [inputType, setInputType] = useState<'document' | 'video'>('document');
  const [documentText, setDocumentText] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [targetAudience, setTargetAudience] = useState('undergraduate');
  const [courseDuration, setCourseDuration] = useState('1 hour');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  const [exportedFormats, setExportedFormats] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const handleExport = useCallback(async (label: string) => {
    if (exportingFormat || exportedFormats.has(label) || !generatedCourse) return;
    trackInteraction('click', 'export_course', { format: label });
    setExportingFormat(label);

    try {
      if (label === 'PDF Outline') {
        const { exportCourseToPDF } = await import('@core/utils/export/pdf-course-export');
        await exportCourseToPDF(generatedCourse);
      } else if (label === 'SCORM Package') {
        const { exportCourseToSCORM } = await import('@/lib/utils/export/scorm-course-export');
        await exportCourseToSCORM(generatedCourse);
      } else {
        // Canvas Import & xAPI Module not yet implemented
        setExportingFormat(null);
        showToast(`${label} export coming soon`);
        return;
      }
      setExportingFormat(null);
      setExportedFormats(prev => new Set(prev).add(label));
      showToast(`${label} exported successfully`);
    } catch (err) {
      console.error(`Export failed (${label}):`, err);
      setExportingFormat(null);
      showToast(`Export failed — please try again`);
    }
  }, [exportingFormat, exportedFormats, showToast, generatedCourse, trackInteraction]);

  const generateCourse = async () => {
    if (!documentText.trim() || !courseTitle.trim()) {
      setError('Please provide both content and a course title.');
      return;
    }

    trackInteraction('tool_use', 'generate_course', { title: courseTitle, audience: targetAudience, duration: courseDuration });
    setIsGenerating(true);
    setError(null);
    setGeneratedCourse(null);
    setExportedFormats(new Set());

    const systemPrompt = `You are an expert instructional designer who creates engaging, pedagogically-sound online courses.
Design courses using established learning principles like Bloom's taxonomy, chunked content, and varied assessment types.
Create practical, actionable learning experiences.`;

    const userPrompt = `Transform this content into a structured online course:

Course Title: ${courseTitle}
Target Audience: ${targetAudience}
Target Duration: ${courseDuration}
Source Content: ${documentText}

Create a complete course structure in this JSON format:
{
  "title": "${courseTitle}",
  "description": "2-3 sentence course description",
  "learningObjectives": ["objective 1", "objective 2", "objective 3", "objective 4"],
  "estimatedDuration": "${courseDuration}",
  "modules": [
    {
      "id": "1",
      "title": "Module title",
      "duration": "X minutes",
      "type": "video|reading|quiz|activity",
      "content": "Brief description or content summary"
    },
    {
      "id": "2",
      "title": "Knowledge Check",
      "duration": "5 minutes",
      "type": "quiz",
      "questions": [
        {
          "question": "Question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct": 0
        }
      ]
    }
  ],
  "assessmentStrategy": "Overview of how learning is assessed"
}

Include 4-6 modules with a mix of content types (readings, videos, quizzes, activities).
Each quiz should have 2-3 questions.`;

    const { data, error: apiError } = await safeAPICall<{ text?: string }>(
      '/api/ai/claude',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
          max_tokens: 3000,
        }),
      }
    );

    if (apiError) {
      setError(apiError.message);
      setIsGenerating(false);
      return;
    }

    if (data?.text) {
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]) as GeneratedCourse;
          trackInteraction('tool_use', 'course_generated', { moduleCount: parsed.modules?.length || 0, title: parsed.title });
          setGeneratedCourse(parsed);
          if (parsed.modules.length > 0) {
            setExpandedModule(parsed.modules[0].id);
          }
        } catch {
          setError('Could not parse course structure. Please try again.');
        }
      } else {
        setError('Could not parse course structure. Please try again.');
      }
    }

    setIsGenerating(false);
  };

  const loadSample = () => {
    trackInteraction('click', 'load_sample');
    if (inputType === 'document') {
      const sample = SAMPLE_INPUTS.document;
      setCourseTitle(sample.title);
      setDocumentText(sample.content);
    } else {
      const sample = SAMPLE_INPUTS.video;
      setCourseTitle(sample.title);
      setDocumentText(`Video: ${sample.title}\nDuration: ${sample.duration}\nTopics covered: ${sample.topics.join(', ')}`);
    }
    setGeneratedCourse(null);
  };

  const getModuleIcon = (type: CourseModule['type']) => {
    const icons = {
      video: '🎬',
      reading: '📖',
      quiz: '❓',
      activity: '✏️'
    };
    return icons[type];
  };

  const getModuleColor = (type: CourseModule['type']) => {
    const colors = {
      video: 'bg-blue-100 border-blue-200 text-blue-800',
      reading: 'bg-purple-100 border-purple-200 text-purple-800',
      quiz: 'bg-amber-100 border-amber-200 text-amber-800',
      activity: 'bg-green-100 border-green-200 text-green-800'
    };
    return colors[type];
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-cyan-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            AI-Powered Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            AI Course Creator Studio
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform documents, videos, or raw content into structured, interactive courses with auto-generated assessments.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Source Content</h3>

            {/* Input Type Selector */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setInputType('document')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  inputType === 'document'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📄 Document
              </button>
              <button
                onClick={() => setInputType('video')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  inputType === 'video'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🎬 Video
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g., Introduction to Machine Learning"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {inputType === 'document' ? 'Paste Content' : 'Describe Video Content'}
                </label>
                <textarea
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder={inputType === 'document'
                    ? 'Paste your document text, article, or notes here...'
                    : 'Describe the video content, key topics, and timestamps...'
                  }
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="k12">K-12 Students</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="30 minutes">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                    <option value="4 hours">4 hours</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={loadSample}
              className="text-sm text-cyan-600 hover:text-cyan-700 underline mt-3"
            >
              Load sample content
            </button>

            <button
              onClick={generateCourse}
              disabled={isGenerating || !documentText.trim() || !courseTitle.trim()}
              className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Course...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate Course
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-2 space-y-6">
            {!generatedCourse && !isGenerating && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <span className="text-5xl mb-4 block">🎓</span>
                <p className="text-gray-500">Add your content and generate a complete course structure</p>
              </div>
            )}

            {isGenerating && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
                <p className="text-gray-600">Creating your course structure...</p>
                <p className="text-sm text-gray-400 mt-1">This may take 15-20 seconds</p>
              </div>
            )}

            {generatedCourse && (
              <>
                {/* Course Overview */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{generatedCourse.title}</h3>
                      <p className="text-gray-600 mt-2">{generatedCourse.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                        {generatedCourse.estimatedDuration}
                      </span>
                      <div className="text-sm text-gray-500 mt-2">
                        {generatedCourse.modules.length} modules
                      </div>
                    </div>
                  </div>

                  {/* Learning Objectives */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Learning Objectives</h4>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {generatedCourse.learningObjectives.map((obj, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-cyan-500 mt-0.5">✓</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Course Modules */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Course Modules</h4>
                  <div className="space-y-3">
                    {generatedCourse.modules.map((module, idx) => (
                      <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                          className="w-full p-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {idx + 1}
                            </span>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getModuleIcon(module.type)}</span>
                                <p className="font-medium text-gray-900">{module.title}</p>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getModuleColor(module.type)}`}>
                                  {module.type}
                                </span>
                                <span className="text-xs text-gray-500">{module.duration}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-gray-400">
                            {expandedModule === module.id ? '▲' : '▼'}
                          </span>
                        </button>

                        {expandedModule === module.id && (
                          <div className="p-4 border-t border-gray-200">
                            {module.type === 'quiz' && module.questions ? (
                              <div className="space-y-4">
                                <p className="text-sm text-gray-500">Auto-generated quiz questions:</p>
                                {module.questions.map((q, qIdx) => (
                                  <div key={qIdx} className="bg-gray-50 rounded-lg p-4">
                                    <p className="font-medium text-gray-800 mb-3">{qIdx + 1}. {q.question}</p>
                                    <div className="space-y-2">
                                      {q.options.map((opt, oIdx) => (
                                        <div
                                          key={oIdx}
                                          className={`p-2 rounded-lg text-sm ${
                                            oIdx === q.correct
                                              ? 'bg-green-100 border border-green-300 text-green-800'
                                              : 'bg-white border border-gray-200 text-gray-600'
                                          }`}
                                        >
                                          {String.fromCharCode(65 + oIdx)}. {opt}
                                          {oIdx === q.correct && <span className="ml-2">✓</span>}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div>
                                {module.type === 'video' && (
                                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 text-sm text-blue-700">
                                    <span className="mt-0.5">ℹ️</span>
                                    <span>Video production is handled separately. This outline defines the script and structure for the video segment.</span>
                                  </div>
                                )}
                                <p className="text-gray-600">{module.content}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assessment Strategy */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Assessment Strategy</h4>
                  <p className="text-gray-600">{generatedCourse.assessmentStrategy}</p>
                </div>

                {/* Export Options */}
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 text-white">
                  <h4 className="font-semibold mb-4">Export Options</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'SCORM Package', icon: '📦' },
                      { label: 'Canvas Import', icon: '🎨' },
                      { label: 'PDF Outline', icon: '📄' },
                      { label: 'xAPI Module', icon: '🔌' }
                    ].map((option, idx) => {
                      const isExporting = exportingFormat === option.label;
                      const isExported = exportedFormats.has(option.label);
                      return (
                        <button
                          key={idx}
                          onClick={() => handleExport(option.label)}
                          disabled={isExporting || !!exportingFormat}
                          className={`py-2 px-3 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2 ${
                            isExported
                              ? 'bg-white/40 cursor-default'
                              : isExporting
                                ? 'bg-white/30 cursor-wait'
                                : 'bg-white/20 hover:bg-white/30'
                          } disabled:cursor-not-allowed`}
                        >
                          {isExporting ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : isExported ? (
                            <span>✓</span>
                          ) : (
                            <span>{option.icon}</span>
                          )}
                          {isExporting ? 'Exporting...' : isExported ? 'Exported' : option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Course Creation Features</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '📄', title: 'Any Source', desc: 'Documents, videos, slides, or notes' },
              { icon: '🧩', title: 'Smart Chunking', desc: 'Auto-segments into digestible modules' },
              { icon: '❓', title: 'Auto Assessments', desc: 'Quiz questions generated from content' },
              { icon: '📤', title: 'LMS Ready', desc: 'Export to SCORM, xAPI, or direct LMS' }
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

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
