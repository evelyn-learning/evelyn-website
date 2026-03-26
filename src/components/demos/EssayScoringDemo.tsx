'use client';

import React, { useState } from 'react';
import { safeAPICall } from '@/lib/utils/api-error-handler';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

// Types
interface Category {
  name: string;
  score: number;
  observations: string[];
  suggestions: string[];
}

interface RewriteExample {
  original: string;
  improved: string;
  explanation: string;
}

interface FeedbackData {
  categories: Category[];
  overallScore: number;
  overallAssessment: string;
  priorityImprovements: string[];
  rewriteExample: RewriteExample;
}

interface Rubric {
  name: string;
  categories: string[];
  maxScore: number;
  description: string;
}

interface ScoreBarProps {
  score: number;
  maxScore: number;
  label: string;
}

// Sample essays
const SAMPLE_ESSAYS = {
  good: `The impact of social media on modern communication represents one of the most significant cultural shifts of the 21st century. While critics argue that platforms like Instagram and Twitter have diminished the quality of human interaction, a closer examination reveals a more nuanced reality.

First, social media has democratized information sharing in unprecedented ways. Prior to these platforms, ordinary citizens had limited means to share their perspectives with a broad audience. Today, a teenager in rural Kansas can engage in meaningful dialogue with thought leaders across the globe. This accessibility has empowered marginalized voices and facilitated social movements that might otherwise have remained localized.

However, the benefits of this connectivity come with notable drawbacks. The brevity encouraged by platforms like Twitter can oversimplify complex issues, reducing nuanced debates to polarizing soundbites. Furthermore, the algorithmic curation of content creates echo chambers that reinforce existing beliefs rather than challenging them.

In conclusion, social media's impact on communication is neither wholly positive nor negative. The key lies in developing digital literacy skills that allow users to harness these tools' potential while mitigating their risks. As with any powerful technology, the outcome depends largely on how we choose to use it.`,

  needsWork: `Social media is really bad for people I think. Everyone is always on their phones and nobody talks anymore. My mom says when she was young people actually had conversations.

There are some good things about social media too though. You can talk to friends and see pictures. But mostly its bad because people get addicted and waste time. Studies show this is true.

Also cyberbullying is a big problem. Kids get bullied online and its really sad. The companies should do something about this but they dont care about anything except money.

In conclusion social media has good and bad parts but mostly bad. We should limit how much we use it.`
};

type EssayType = 'sat' | 'act' | 'college' | 'ap-synthesis' | 'ap-rhetorical' | 'ap-argument' | 'ap-lit' | 'ib-extended' | 'gre' | 'toefl' | 'ielts' | 'six-traits' | 'custom';

export default function EssayScoringDemo() {
  const trackInteraction = useTrackInteraction();
  const [essay, setEssay] = useState('');
  const [essayType, setEssayType] = useState<EssayType>('sat');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [studentName, setStudentName] = useState('');
  const [analysesUsed, setAnalysesUsed] = useState<number | null>(null);

  // Custom rubric state
  const [customRubricText, setCustomRubricText] = useState('');
  const [customMaxScore, setCustomMaxScore] = useState(10);

  // Calibration anchor essay
  const [showCalibration, setShowCalibration] = useState(false);
  const [anchorEssay, setAnchorEssay] = useState('');
  const [anchorScore, setAnchorScore] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.txt', '.docx', '.pdf'].includes(ext)) {
      setError('Unsupported file type. Please upload a .txt, .docx, or .pdf file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File exceeds 10MB limit.');
      return;
    }

    setIsUploading(true);
    setError(null);
    trackInteraction('tool_use', 'upload_file', { fileType: ext });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/showcase/plagiarism-detection/parse-file', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to parse file.');
      } else {
        setEssay(data.text);
        setUploadedFileName(data.fileName);
        setFeedback(null);
      }
    } catch {
      setError('Failed to upload file. Please try again.');
    }

    setIsUploading(false);
    // Reset file input so re-uploading the same file triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const rubrics: Record<Exclude<EssayType, 'custom'>, Rubric> = {
    sat: {
      name: 'SAT Essay',
      categories: ['Reading', 'Analysis', 'Writing'],
      maxScore: 8,
      description: 'Evaluates comprehension, analytical depth, and writing quality'
    },
    act: {
      name: 'ACT Writing',
      categories: ['Ideas & Analysis', 'Development & Support', 'Organization', 'Language Use'],
      maxScore: 6,
      description: 'Assesses argument quality, evidence, structure, and language'
    },
    college: {
      name: 'College Application',
      categories: ['Authenticity', 'Insight & Reflection', 'Writing Quality', 'Engagement'],
      maxScore: 10,
      description: 'Focuses on personal voice, self-awareness, and compelling narrative'
    },
    'ap-synthesis': {
      name: 'AP Lang: Synthesis',
      categories: ['Thesis', 'Evidence & Commentary', 'Sophistication'],
      maxScore: 6,
      description: 'Synthesizes at least 3 sources into a coherent, evidence-driven argument (AP scoring 0-6)'
    },
    'ap-rhetorical': {
      name: 'AP Lang: Rhetorical Analysis',
      categories: ['Thesis', 'Evidence & Commentary', 'Sophistication'],
      maxScore: 6,
      description: 'Analyzes the writer\'s rhetorical choices and their effects on the audience (AP scoring 0-6)'
    },
    'ap-argument': {
      name: 'AP Lang: Argument',
      categories: ['Thesis', 'Evidence & Commentary', 'Sophistication'],
      maxScore: 6,
      description: 'Develops an evidence-based argument that responds to the prompt (AP scoring 0-6)'
    },
    'ap-lit': {
      name: 'AP Literature',
      categories: ['Thesis', 'Evidence & Commentary', 'Sophistication'],
      maxScore: 6,
      description: 'Analyzes literary works with attention to thesis, textual evidence, and literary interpretation (AP scoring 0-6)'
    },
    'ib-extended': {
      name: 'IB Extended Essay',
      categories: ['Focus & Method', 'Knowledge & Understanding', 'Critical Thinking', 'Presentation', 'Engagement'],
      maxScore: 7,
      description: 'Evaluates research quality, analysis depth, and academic presentation per IB criteria (banded A-E, scored 0-34 total)'
    },
    gre: {
      name: 'GRE Analytical Writing',
      categories: ['Argument Analysis', 'Critical Thinking', 'Organization & Development', 'Language Facility'],
      maxScore: 6,
      description: 'Assesses analytical writing ability for graduate admissions (ETS scoring 0-6 in half-point increments)'
    },
    toefl: {
      name: 'TOEFL iBT Writing',
      categories: ['Development', 'Organization', 'Language Use', 'Mechanics'],
      maxScore: 5,
      description: 'Evaluates English writing proficiency for non-native speakers (ETS scoring 0-5)'
    },
    ielts: {
      name: 'IELTS Academic Writing',
      categories: ['Task Achievement', 'Coherence & Cohesion', 'Lexical Resource', 'Grammatical Range & Accuracy'],
      maxScore: 9,
      description: 'Assesses English academic writing with band scores (0-9) per British Council/IDP criteria'
    },
    'six-traits': {
      name: '6+1 Traits of Writing',
      categories: ['Ideas', 'Organization', 'Voice', 'Word Choice', 'Sentence Fluency', 'Conventions', 'Presentation'],
      maxScore: 5,
      description: 'K-12 formative writing assessment across seven trait dimensions (Education Northwest model, scored 1-5)'
    }
  };

  const getActiveRubric = (): Rubric => {
    if (essayType === 'custom') {
      const categories = customRubricText
        .split(/\n/)
        .map(s => s.trim())
        .filter(Boolean);
      return {
        name: 'Custom Rubric',
        categories: categories.length > 0 ? categories : ['Overall Quality'],
        maxScore: customMaxScore,
        description: 'Teacher-defined evaluation criteria'
      };
    }
    return rubrics[essayType];
  };

  const wordCount = essay.split(/\s+/).filter(w => w).length;

  const analyzeEssay = async () => {
    if (!essay.trim()) {
      setError('Please enter an essay to analyze.');
      return;
    }
    if (wordCount < 50) {
      setError('Please enter at least 50 words for a meaningful analysis.');
      return;
    }
    if (essayType === 'custom' && customRubricText.trim().split(/\n/).filter(s => s.trim()).length === 0) {
      setError('Please enter at least one rubric category.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setFeedback(null);
    trackInteraction('tool_use', 'analyze_essay', { rubric: essayType, wordCount, studentName: studentName.trim() || undefined, essayText: essay });

    const rubric = getActiveRubric();

    const systemPrompt = `You are an expert essay evaluator for standardized tests and college admissions.
You provide detailed, constructive feedback that helps students improve their writing.
Always be encouraging while being honest about areas for improvement.
Your feedback should be specific and actionable.`;

    const calibrationBlock = anchorEssay.trim() && anchorScore.trim()
      ? `\n\nCALIBRATION REFERENCE:
The teacher has provided a pre-scored anchor essay to calibrate your scoring. Use this as your reference point for what a score of ${anchorScore} looks like on this rubric. Adjust your scoring of the student essay relative to this anchor.

ANCHOR ESSAY (scored ${anchorScore} by the teacher):
"""
${anchorEssay.trim()}
"""\n`
      : '';

    const userPrompt = `Please evaluate this ${rubric.name} essay using the following criteria: ${rubric.categories.join(', ')}.
${calibrationBlock}
For each category, provide:
1. A score from 1-${rubric.maxScore}
2. 2-3 specific observations (what works well)
3. 2-3 specific suggestions for improvement

Also provide:
- An overall score (average of categories)
- A brief overall assessment (2-3 sentences)
- The top 3 priority improvements
- One specific sentence from the essay that could be rewritten, with your improved version

Format your response as JSON with this structure:
{
  "categories": [
    {
      "name": "Category Name",
      "score": number,
      "observations": ["observation 1", "observation 2"],
      "suggestions": ["suggestion 1", "suggestion 2"]
    }
  ],
  "overallScore": number,
  "overallAssessment": "string",
  "priorityImprovements": ["improvement 1", "improvement 2", "improvement 3"],
  "rewriteExample": {
    "original": "original sentence",
    "improved": "improved sentence",
    "explanation": "why this is better"
  }
}

ESSAY TO EVALUATE:
"""
${essay}
"""`;

    const { data, error: apiError } = await safeAPICall<{ text?: string }>('/api/ai/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userPrompt }],
        system: systemPrompt,
        max_tokens: 2000
      })
    });

    if (apiError) {
      setError(apiError.message);
      setIsAnalyzing(false);
      return;
    }

    if (data?.text) {
      // Extract JSON from response
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]) as FeedbackData;
          setFeedback(parsed);
          setAnalysesUsed(prev => (prev ?? 0) + 1);
          trackInteraction('tool_use', 'essay_scored', { rubric: essayType, overallScore: parsed.overallScore, studentName: studentName.trim() || undefined });
        } catch {
          setError('Could not parse feedback. Please try again.');
        }
      } else {
        setError('Could not parse feedback. Please try again.');
      }
    } else {
      setError('No response received. Please try again.');
    }

    setIsAnalyzing(false);
  };

  const loadSample = (quality: 'good' | 'needsWork') => {
    setEssay(SAMPLE_ESSAYS[quality]);
    setFeedback(null);
    setUploadedFileName(null);
    trackInteraction('click', 'load_sample', { quality });
  };

  const handleExportPDF = async () => {
    if (!feedback) return;
    setIsExportingPDF(true);
    try {
      const { exportEssayFeedbackPDF } = await import('@/lib/utils/export/pdf-essay-feedback');
      const rubric = getActiveRubric();
      await exportEssayFeedbackPDF(essay, feedback, rubric.name, rubric.maxScore, studentName.trim() || undefined);
    } catch (err) {
      console.error('PDF export error:', err);
    }
    setIsExportingPDF(false);
  };

  const ScoreBar = ({ score, maxScore, label }: ScoreBarProps) => {
    const percentage = (score / maxScore) * 100;
    const getColor = () => {
      if (percentage >= 80) return 'bg-emerald-500';
      if (percentage >= 60) return 'bg-purple-500';
      if (percentage >= 40) return 'bg-yellow-500';
      return 'bg-red-400';
    };

    return (
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="font-bold text-gray-900">{score}/{maxScore}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColor()} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const activeRubric = getActiveRubric();

  return (
    <div className="bg-gradient-to-br from-slate-50 to-purple-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            AI-Powered Demo
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Essay Scoring & Feedback System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant, detailed feedback on essays using advanced AI analysis.
            Scores are calibrated to official rubrics with actionable improvement suggestions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Essay Input</h2>
              <select
                value={essayType}
                onChange={(e) => setEssayType(e.target.value as EssayType)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="sat">SAT Essay Rubric</option>
                <option value="act">ACT Writing Rubric</option>
                <option value="college">College Application</option>
                <option value="ap-synthesis">AP Lang: Synthesis</option>
                <option value="ap-rhetorical">AP Lang: Rhetorical Analysis</option>
                <option value="ap-argument">AP Lang: Argument</option>
                <option value="ap-lit">AP Literature</option>
                <option value="ib-extended">IB Extended Essay</option>
                <option value="gre">GRE Analytical Writing</option>
                <option value="toefl">TOEFL iBT Writing</option>
                <option value="ielts">IELTS Academic Writing</option>
                <option value="six-traits">6+1 Traits of Writing</option>
                <option value="custom">Custom Rubric</option>
              </select>
            </div>

            {essayType === 'custom' ? (
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 mb-4 space-y-3">
                <p className="text-sm text-purple-800">
                  <strong>Custom Rubric:</strong> Define your own evaluation criteria below.
                </p>
                <div>
                  <label className="block text-xs font-medium text-purple-700 mb-1">
                    Categories (one per line)
                  </label>
                  <textarea
                    value={customRubricText}
                    onChange={(e) => setCustomRubricText(e.target.value)}
                    placeholder={"e.g.,\nThesis Clarity\nEvidence Quality\nArgument Structure\nGrammar, Mechanics & Usage"}
                    className="w-full min-h-[60px] p-3 border border-purple-200 rounded-lg resize-y text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {customRubricText.trim() && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {customRubricText.split(/\n/).map(s => s.trim()).filter(Boolean).map((cat, i) => (
                        <span key={i} className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full text-xs">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-700 mb-1">
                    Max Score per Category
                  </label>
                  <select
                    value={customMaxScore}
                    onChange={(e) => setCustomMaxScore(Number(e.target.value))}
                    className="px-3 py-1.5 border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {[4, 5, 6, 8, 10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 mb-4">
                <p className="text-sm text-purple-800">
                  <strong>{rubrics[essayType].name}:</strong> {rubrics[essayType].description}
                </p>
              </div>
            )}

            {/* Rubric Calibration */}
            <div className="mb-4">
              <button
                onClick={() => setShowCalibration(!showCalibration)}
                className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 transition font-medium"
              >
                <svg className={`w-3.5 h-3.5 transition-transform ${showCalibration ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Calibrate with an anchor essay
              </button>
              {showCalibration && (
                <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-2">
                  <p className="text-xs text-blue-700">
                    Paste a pre-scored essay to calibrate AI scoring to your standards. The AI will use this as a reference point.
                  </p>
                  <textarea
                    value={anchorEssay}
                    onChange={(e) => setAnchorEssay(e.target.value)}
                    placeholder="Paste your anchor essay here..."
                    className="w-full min-h-[80px] p-3 border border-blue-200 rounded-lg resize-y text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-blue-700">Score you assigned:</label>
                    <input
                      type="text"
                      value={anchorScore}
                      onChange={(e) => setAnchorScore(e.target.value)}
                      placeholder={`e.g., ${activeRubric.maxScore - 1}/${activeRubric.maxScore}`}
                      className="w-32 px-3 py-1.5 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Student Name */}
            <div className="mb-4">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Student name (optional — included in PDF report)"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
              />
            </div>

            <textarea
              value={essay}
              onChange={(e) => { setEssay(e.target.value); setUploadedFileName(null); }}
              placeholder="Paste or type your essay here, or upload a file below..."
              className="w-full min-h-[16rem] p-4 border border-gray-200 rounded-xl resize-y focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
            />

            {/* File Upload */}
            <div className="mt-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.docx,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="essay-file-upload"
              />
              <div className="flex items-center gap-3">
                <label
                  htmlFor="essay-file-upload"
                  className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 transition ${isUploading ? 'opacity-50 pointer-events-none' : 'text-gray-600'}`}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Parsing file...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload File
                    </>
                  )}
                </label>
                <span className="text-xs text-gray-400">.txt, .docx, .pdf (max 10MB)</span>
                {uploadedFileName && (
                  <span className="text-xs text-purple-600 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {uploadedFileName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <button
                  onClick={() => loadSample('good')}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  Load Strong Sample
                </button>
                <button
                  onClick={() => loadSample('needsWork')}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  Load Weak Sample
                </button>
              </div>
              <span className={`text-sm ${wordCount < 50 && wordCount > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                {wordCount} words{wordCount > 0 && wordCount < 50 ? ' (min 50)' : ''}
              </span>
            </div>

            <button
              onClick={analyzeEssay}
              disabled={isAnalyzing || !essay.trim() || wordCount < 50}
              className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-primary-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing Essay...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Analyze Essay
                </>
              )}
            </button>

            {/* Free limit indicator */}
            <p className="mt-2 text-center text-xs text-gray-400">
              {analysesUsed !== null
                ? `${Math.max(0, 50 - analysesUsed)} of 50 free analyses remaining today`
                : '50 free analyses per day'}
            </p>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
              {feedback && (
                <button
                  onClick={handleExportPDF}
                  disabled={isExportingPDF}
                  className="px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {isExportingPDF ? 'Exporting...' : 'Export PDF'}
                </button>
              )}
            </div>

            {!feedback && !isAnalyzing && (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Enter an essay and click &quot;Analyze&quot; to see detailed feedback</p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center w-full max-w-xs">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600 mb-3">Analyzing your essay...</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-primary-500 rounded-full animate-progress-bar" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Usually takes 5-10 seconds</p>
                </div>
              </div>
            )}

            {feedback && (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-gradient-to-r from-purple-500 to-primary-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Overall Score</p>
                      <p className="text-4xl font-bold">{feedback.overallScore.toFixed(1)}<span className="text-xl opacity-75">/{activeRubric.maxScore}</span></p>
                    </div>
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-3xl font-bold">{Math.round((feedback.overallScore / activeRubric.maxScore) * 100)}%</span>
                    </div>
                  </div>
                  <p className="mt-4 text-purple-100 text-sm">{feedback.overallAssessment}</p>
                </div>

                {/* Category Scores */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Category Breakdown</h3>
                  <div className="space-y-3">
                    {feedback.categories.map((cat, idx) => (
                      <ScoreBar
                        key={idx}
                        score={cat.score}
                        maxScore={activeRubric.maxScore}
                        label={cat.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Priority Improvements */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Priority Improvements</h3>
                  <div className="space-y-2">
                    {feedback.priorityImprovements.map((imp, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                        <span className="flex-shrink-0 w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-amber-900">{imp}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewrite Example */}
                {feedback.rewriteExample && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Sentence Improvement Example</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-xs font-medium text-red-600 mb-1">ORIGINAL</p>
                        <p className="text-sm text-red-900 italic">&quot;{feedback.rewriteExample.original}&quot;</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                        <p className="text-xs font-medium text-green-600 mb-1">IMPROVED</p>
                        <p className="text-sm text-green-900 italic">&quot;{feedback.rewriteExample.improved}&quot;</p>
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <strong>Why this works:</strong> {feedback.rewriteExample.explanation}
                      </p>
                    </div>
                  </div>
                )}

                {/* Detailed Category Feedback */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Detailed Feedback</h3>
                  <div className="space-y-4">
                    {feedback.categories.map((cat, idx) => (
                      <details key={idx} className="border border-gray-200 rounded-lg">
                        <summary className="p-3 cursor-pointer hover:bg-gray-50 font-medium text-gray-700">
                          {cat.name} — {cat.score}/{activeRubric.maxScore}
                        </summary>
                        <div className="p-4 pt-0 space-y-3">
                          <div>
                            <p className="text-xs font-medium text-green-600 mb-2">STRENGTHS</p>
                            <ul className="space-y-1">
                              {cat.observations.map((obs, i) => (
                                <li key={i} className="text-sm text-gray-600 flex gap-2">
                                  <span className="text-green-500">&#10003;</span> {obs}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-purple-600 mb-2">SUGGESTIONS</p>
                            <ul className="space-y-1">
                              {cat.suggestions.map((sug, i) => (
                                <li key={i} className="text-sm text-gray-600 flex gap-2">
                                  <span className="text-purple-500">&#8594;</span> {sug}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Banner */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Platform Capabilities</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '⚡', title: 'Instant Feedback', desc: 'Results in under 10 seconds' },
              { icon: '📊', title: 'Rubric-Aligned', desc: 'SAT, ACT, AP, IB, GRE, TOEFL, IELTS, 6+1 Traits & custom' },
              { icon: '🎯', title: 'Actionable Insights', desc: 'Specific improvement suggestions' },
              { icon: '📈', title: 'Progress Tracking', desc: 'Monitor improvement over time' }
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
