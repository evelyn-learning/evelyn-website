'use client';

import React, { useState } from 'react';
import { safeAPICall } from '@core/utils/api-error-handler';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

interface LearningObjective {
  code: string;
  description: string;
  bloomsLevel: string;
}

interface LessonPlan {
  week: number;
  topic: string;
  objectives: string[];
  activities: string[];
  assessments: string[];
  resources: string[];
  duration: string;
}

interface CurriculumMap {
  subject: string;
  gradeLevel: string;
  duration: string;
  overview: string;
  standards: LearningObjective[];
  lessons: LessonPlan[];
  assessmentStrategy: string;
  differentiationNotes: string;
}

const STANDARDS_FRAMEWORKS = {
  'common-core-math': 'Common Core Math',
  'common-core-ela': 'Common Core ELA',
  'ngss': 'Next Generation Science Standards',
  'state-specific': 'State-Specific Standards',
  'custom': 'Custom Framework',
};

const GRADE_LEVELS = ['K-2', '3-5', '6-8', '9-12', 'Higher Ed'];

const SAMPLE_INPUTS = {
  math: {
    subject: 'Algebra I',
    gradeLevel: '9-12',
    duration: '4 weeks',
    topic: 'Quadratic Functions',
    standards: 'Common Core Math',
  },
  science: {
    subject: 'Biology',
    gradeLevel: '9-12',
    duration: '3 weeks',
    topic: 'Cell Biology and Genetics',
    standards: 'Next Generation Science Standards',
  },
  ela: {
    subject: 'English Language Arts',
    gradeLevel: '6-8',
    duration: '6 weeks',
    topic: 'Persuasive Writing',
    standards: 'Common Core ELA',
  },
};

export default function CurriculumDesignerDemo() {
  const trackInteraction = useTrackInteraction();
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('9-12');
  const [duration, setDuration] = useState('4 weeks');
  const [topic, setTopic] = useState('');
  const [standards, setStandards] = useState<keyof typeof STANDARDS_FRAMEWORKS>('common-core-math');
  const [isGenerating, setIsGenerating] = useState(false);
  const [curriculum, setCurriculum] = useState<CurriculumMap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const generateCurriculum = async () => {
    if (!subject.trim() || !topic.trim()) {
      setError('Please enter both subject and topic.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurriculum(null);

    trackInteraction('tool_use', 'generate_curriculum', { subject, topic, gradeLevel, duration, standards });

    const systemPrompt = `You are an expert curriculum designer with deep knowledge of educational standards and pedagogy.
Create detailed, standards-aligned curriculum maps that are practical and implementable.
Follow backward design principles: start with learning objectives, then assessments, then activities.
Include differentiation strategies and varied assessment types.`;

    const userPrompt = `Design a curriculum map for:
- Subject: ${subject}
- Topic/Unit: ${topic}
- Grade Level: ${gradeLevel}
- Duration: ${duration}
- Standards Framework: ${STANDARDS_FRAMEWORKS[standards]}

Create a comprehensive curriculum map in this JSON format:
{
  "subject": "${subject}",
  "gradeLevel": "${gradeLevel}",
  "duration": "${duration}",
  "overview": "2-3 sentence unit overview",
  "standards": [
    {
      "code": "standard code (e.g., CCSS.MATH.CONTENT.HSF-IF.C.7)",
      "description": "standard description",
      "bloomsLevel": "remember/understand/apply/analyze/evaluate/create"
    }
  ],
  "lessons": [
    {
      "week": 1,
      "topic": "specific lesson topic",
      "objectives": ["SWBAT objective 1", "SWBAT objective 2"],
      "activities": ["activity 1", "activity 2", "activity 3"],
      "assessments": ["formative assessment type"],
      "resources": ["resource needed"],
      "duration": "X class periods"
    }
  ],
  "assessmentStrategy": "overview of assessment approach",
  "differentiationNotes": "strategies for diverse learners"
}

Include ${parseInt(duration) || 4} weeks of lessons. Make it practical and detailed.`;

    const { data, error: apiError } = await safeAPICall<{ text?: string }>(
      '/api/ai/claude',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
          max_tokens: 3500,
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
          const parsed = JSON.parse(jsonMatch[0]) as CurriculumMap;
          trackInteraction('tool_use', 'curriculum_generated', { weekCount: parsed.lessons?.length || 0 });
          setCurriculum(parsed);
          setExpandedWeek(1);
        } catch {
          setError('Could not parse curriculum. Please try again.');
        }
      } else {
        setError('Could not parse curriculum. Please try again.');
      }
    }

    setIsGenerating(false);
  };

  const loadSample = (type: keyof typeof SAMPLE_INPUTS) => {
    const sample = SAMPLE_INPUTS[type];
    setSubject(sample.subject);
    setGradeLevel(sample.gradeLevel);
    setDuration(sample.duration);
    setTopic(sample.topic);
    setStandards(
      sample.standards === 'Common Core Math' ? 'common-core-math' :
      sample.standards === 'Common Core ELA' ? 'common-core-ela' :
      sample.standards === 'Next Generation Science Standards' ? 'ngss' : 'common-core-math'
    );
    setCurriculum(null);
  };

  const getBloomsColor = (level: string) => {
    const colors: Record<string, string> = {
      remember: 'bg-red-100 text-red-700',
      understand: 'bg-orange-100 text-orange-700',
      apply: 'bg-yellow-100 text-yellow-700',
      analyze: 'bg-green-100 text-green-700',
      evaluate: 'bg-blue-100 text-blue-700',
      create: 'bg-purple-100 text-purple-700',
    };
    return colors[level.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-violet-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
            AI-Powered Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            AI Curriculum Designer
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate standards-aligned curriculum maps with learning objectives, activities, and assessments.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Curriculum Parameters</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Algebra I, Biology, English"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic/Unit</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Quadratic Functions"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500"
                >
                  {GRADE_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500"
                >
                  {['2 weeks', '3 weeks', '4 weeks', '6 weeks', '8 weeks', '1 semester'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standards Framework</label>
                <select
                  value={standards}
                  onChange={(e) => setStandards(e.target.value as keyof typeof STANDARDS_FRAMEWORKS)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500"
                >
                  {Object.entries(STANDARDS_FRAMEWORKS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-500">Try sample:</span>
              {Object.keys(SAMPLE_INPUTS).map((type) => (
                <button
                  key={type}
                  onClick={() => loadSample(type as keyof typeof SAMPLE_INPUTS)}
                  className="text-sm text-violet-600 hover:text-violet-700 underline"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={generateCurriculum}
              disabled={isGenerating || !subject.trim() || !topic.trim()}
              className="w-full mt-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <span>📋</span>
                  Generate Curriculum
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {!curriculum && !isGenerating && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <span className="text-5xl mb-4 block">📋</span>
                <p className="text-gray-500">Configure parameters and generate a curriculum map</p>
              </div>
            )}

            {isGenerating && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
                <p className="text-gray-600">Designing your curriculum...</p>
                <p className="text-sm text-gray-400 mt-1">This may take 15-20 seconds</p>
              </div>
            )}

            {curriculum && (
              <>
                {/* Overview */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{curriculum.subject}: {topic}</h3>
                      <div className="flex gap-2 mt-2">
                        <span className="px-3 py-1 bg-violet-100 text-violet-700 text-sm rounded-full">
                          {curriculum.gradeLevel}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {curriculum.duration}
                        </span>
                      </div>
                    </div>
                    <span className="text-3xl">📚</span>
                  </div>
                  <p className="text-gray-600">{curriculum.overview}</p>
                </div>

                {/* Standards */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Learning Standards</h3>
                  <div className="space-y-3">
                    {curriculum.standards.map((standard, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <code className="text-sm font-mono text-violet-600 bg-violet-50 px-2 py-1 rounded">
                            {standard.code}
                          </code>
                          <span className={`px-2 py-1 text-xs rounded-full ${getBloomsColor(standard.bloomsLevel)}`}>
                            {standard.bloomsLevel}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{standard.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Lessons */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Weekly Lesson Plans</h3>
                  <div className="space-y-3">
                    {curriculum.lessons.map((lesson) => (
                      <div key={lesson.week} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedWeek(expandedWeek === lesson.week ? null : lesson.week)}
                          className="w-full p-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold">
                              {lesson.week}
                            </span>
                            <div className="text-left">
                              <p className="font-medium text-gray-900">{lesson.topic}</p>
                              <p className="text-sm text-gray-500">{lesson.duration}</p>
                            </div>
                          </div>
                          <span className="text-gray-400">
                            {expandedWeek === lesson.week ? '▲' : '▼'}
                          </span>
                        </button>

                        {expandedWeek === lesson.week && (
                          <div className="p-4 space-y-4">
                            {/* Objectives */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">🎯 Learning Objectives</h4>
                              <ul className="space-y-1">
                                {lesson.objectives.map((obj, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="text-green-500">✓</span> {obj}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Activities */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">📝 Activities</h4>
                              <ul className="space-y-1">
                                {lesson.activities.map((activity, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-500">•</span> {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Assessments */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">📊 Assessments</h4>
                              <div className="flex flex-wrap gap-2">
                                {lesson.assessments.map((assessment, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                                    {assessment}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Resources */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">📚 Resources</h4>
                              <div className="flex flex-wrap gap-2">
                                {lesson.resources.map((resource, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                    {resource}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">📊 Assessment Strategy</h3>
                    <p className="text-sm text-gray-600">{curriculum.assessmentStrategy}</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">🎯 Differentiation</h3>
                    <p className="text-sm text-gray-600">{curriculum.differentiationNotes}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Curriculum Features</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '📋', title: 'Standards-Aligned', desc: 'Common Core, NGSS, state standards' },
              { icon: '🎯', title: 'Learning Objectives', desc: 'SWBAT format, Bloom\'s taxonomy' },
              { icon: '📊', title: 'Assessments', desc: 'Formative & summative options' },
              { icon: '🔄', title: 'Differentiation', desc: 'Strategies for all learners' },
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
