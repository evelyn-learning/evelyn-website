'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

// ── Types ───────────────────────────────────────────────────────────────────

interface Skill {
  name: string;
  level: number;
  category: 'technical' | 'soft' | 'domain';
}

interface SkillReq {
  name: string;
  required: number;
}

interface Career {
  id: string;
  title: string;
  salary: string;
  growth: string;
  skillReqs: SkillReq[];
  openings: number;
  industries: string[];
  description: string;
}

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  skillsCovered: string[];
  level: string;
}

// ── Data ────────────────────────────────────────────────────────────────────

const INDUSTRIES = ['All Industries', 'Technology', 'Finance', 'Healthcare', 'Retail'];

const DEFAULT_SKILLS: Skill[] = [
  { name: 'Python Programming', level: 50, category: 'technical' },
  { name: 'Data Analysis', level: 40, category: 'technical' },
  { name: 'Machine Learning', level: 20, category: 'technical' },
  { name: 'SQL & Databases', level: 55, category: 'technical' },
  { name: 'JavaScript', level: 35, category: 'technical' },
  { name: 'Communication', level: 70, category: 'soft' },
  { name: 'Problem Solving', level: 65, category: 'soft' },
  { name: 'Leadership', level: 45, category: 'soft' },
  { name: 'Statistics', level: 35, category: 'domain' },
  { name: 'Business Acumen', level: 40, category: 'domain' },
  { name: 'Project Management', level: 30, category: 'domain' },
];

const CAREERS: Career[] = [
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    salary: '$120,000 – $160,000',
    growth: '+36%',
    skillReqs: [
      { name: 'Python Programming', required: 85 },
      { name: 'Data Analysis', required: 80 },
      { name: 'Machine Learning', required: 75 },
      { name: 'Statistics', required: 80 },
      { name: 'SQL & Databases', required: 70 },
    ],
    openings: 12500,
    industries: ['Technology', 'Finance', 'Healthcare'],
    description: 'Analyze complex data sets to inform business decisions using statistical methods and machine learning.',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    salary: '$75,000 – $100,000',
    growth: '+25%',
    skillReqs: [
      { name: 'SQL & Databases', required: 80 },
      { name: 'Data Analysis', required: 85 },
      { name: 'Statistics', required: 65 },
      { name: 'Python Programming', required: 60 },
      { name: 'Communication', required: 70 },
    ],
    openings: 28000,
    industries: ['Technology', 'Finance', 'Retail'],
    description: 'Transform raw data into meaningful insights through analysis, visualization, and reporting.',
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    salary: '$140,000 – $200,000',
    growth: '+40%',
    skillReqs: [
      { name: 'Python Programming', required: 90 },
      { name: 'Machine Learning', required: 90 },
      { name: 'SQL & Databases', required: 65 },
      { name: 'Statistics', required: 70 },
      { name: 'Problem Solving', required: 80 },
    ],
    openings: 8500,
    industries: ['Technology'],
    description: 'Design and deploy machine learning models and systems at scale in production environments.',
  },
  {
    id: 'bi-analyst',
    title: 'Business Intelligence Analyst',
    salary: '$80,000 – $110,000',
    growth: '+22%',
    skillReqs: [
      { name: 'SQL & Databases', required: 85 },
      { name: 'Data Analysis', required: 75 },
      { name: 'Business Acumen', required: 70 },
      { name: 'Communication', required: 65 },
    ],
    openings: 15000,
    industries: ['Finance', 'Retail', 'Healthcare'],
    description: 'Create dashboards and reports that translate business data into actionable intelligence.',
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    salary: '$110,000 – $150,000',
    growth: '+18%',
    skillReqs: [
      { name: 'Communication', required: 85 },
      { name: 'Leadership', required: 80 },
      { name: 'Business Acumen', required: 75 },
      { name: 'Data Analysis', required: 60 },
      { name: 'Project Management', required: 75 },
    ],
    openings: 18000,
    industries: ['Technology', 'Finance'],
    description: 'Drive product strategy and roadmap by coordinating between engineering, design, and business teams.',
  },
  {
    id: 'ux-researcher',
    title: 'UX Researcher',
    salary: '$90,000 – $130,000',
    growth: '+20%',
    skillReqs: [
      { name: 'Communication', required: 80 },
      { name: 'Problem Solving', required: 75 },
      { name: 'Data Analysis', required: 65 },
      { name: 'Statistics', required: 55 },
      { name: 'Business Acumen', required: 55 },
    ],
    openings: 9500,
    industries: ['Technology', 'Healthcare'],
    description: 'Conduct user research to understand needs and behaviors, informing product design decisions.',
  },
];

const COURSES: Course[] = [
  { id: 'c1', title: 'Applied Machine Learning', provider: 'Coursera', duration: '4 months', skillsCovered: ['Machine Learning', 'Python Programming'], level: 'Advanced' },
  { id: 'c2', title: 'Advanced Statistics for Data Science', provider: 'edX', duration: '3 months', skillsCovered: ['Statistics', 'Data Analysis'], level: 'Intermediate' },
  { id: 'c3', title: 'SQL Masterclass', provider: 'LinkedIn Learning', duration: '2 months', skillsCovered: ['SQL & Databases'], level: 'Intermediate' },
  { id: 'c4', title: 'Python for Data Science', provider: 'Coursera', duration: '3 months', skillsCovered: ['Python Programming', 'Data Analysis'], level: 'Beginner' },
  { id: 'c5', title: 'Leadership Essentials', provider: 'Harvard Online', duration: '6 weeks', skillsCovered: ['Leadership', 'Communication'], level: 'Intermediate' },
  { id: 'c6', title: 'Business Strategy Fundamentals', provider: 'Wharton Online', duration: '2 months', skillsCovered: ['Business Acumen', 'Project Management'], level: 'Intermediate' },
  { id: 'c7', title: 'Data Visualization & Storytelling', provider: 'Udemy', duration: '6 weeks', skillsCovered: ['Data Analysis', 'Communication'], level: 'Beginner' },
  { id: 'c8', title: 'Product Management Fundamentals', provider: 'Coursera', duration: '3 months', skillsCovered: ['Project Management', 'Communication', 'Leadership'], level: 'Beginner' },
  { id: 'c9', title: 'UX Research Methods', provider: 'Google / Coursera', duration: '2 months', skillsCovered: ['Communication', 'Problem Solving'], level: 'Beginner' },
  { id: 'c10', title: 'Modern JavaScript', provider: 'freeCodeCamp', duration: '2 months', skillsCovered: ['JavaScript'], level: 'Beginner' },
];

const MARKET_INSIGHTS: Record<string, string> = {
  'All Industries': 'Data-related roles are projected to grow <strong>28% faster</strong> than average through 2030. Remote work options are available for <strong>65%</strong> of these positions. Top hiring industries: Technology, Finance, Healthcare, Retail.',
  'Technology': 'The technology sector leads in data role hiring with <strong>42%</strong> of all openings. Average salaries are <strong>15% higher</strong> than other industries. Remote-friendly positions account for <strong>78%</strong> of tech data roles.',
  'Finance': 'Financial services offer <strong>premium compensation</strong> for data roles, averaging 20% above market. Regulatory knowledge is increasingly valued. <strong>85%</strong> of firms are expanding their data teams.',
  'Healthcare': 'Healthcare data roles are growing at <strong>34%</strong> annually. Clinical data expertise commands premium salaries. <strong>HIPAA compliance</strong> knowledge is a key differentiator.',
  'Retail': 'Retail analytics is booming with <strong>29%</strong> year-over-year growth. E-commerce drives demand for <strong>customer behavior analysts</strong>. Omnichannel data expertise is highly sought after.',
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function calcCareerMatch(skills: Skill[], career: Career): number {
  let total = 0;
  for (const req of career.skillReqs) {
    const userLevel = skills.find(s => s.name === req.name)?.level ?? 0;
    total += Math.min(userLevel / req.required, 1);
  }
  return Math.round((total / career.skillReqs.length) * 100);
}

function calcCourseRelevance(skills: Skill[], career: Career, course: Course): number {
  let totalGap = 0;
  let coveredGap = 0;
  for (const req of career.skillReqs) {
    const gap = Math.max(req.required - (skills.find(s => s.name === req.name)?.level ?? 0), 0);
    totalGap += gap;
    if (course.skillsCovered.includes(req.name)) coveredGap += gap;
  }
  return totalGap > 0 ? Math.round((coveredGap / totalGap) * 100) : 0;
}

const categoryColor: Record<string, string> = {
  technical: 'bg-blue-100 text-blue-700',
  soft: 'bg-green-100 text-green-700',
  domain: 'bg-purple-100 text-purple-700',
};

function matchColor(m: number) {
  return m >= 80 ? 'text-green-600' : m >= 60 ? 'text-yellow-600' : 'text-red-600';
}

function parseSalary(s: string) {
  const m = s.match(/[\d,]+/);
  return m ? parseInt(m[0].replace(/,/g, '')) : 0;
}

function parseGrowth(g: string) {
  const m = g.match(/\d+/);
  return m ? parseInt(m[0]) : 0;
}

// ── Component ───────────────────────────────────────────────────────────────

export default function CareerPathwaysDemo() {
  const trackInteraction = useTrackInteraction();
  const [activeTab, setActiveTab] = useState<'assessment' | 'careers' | 'courses' | 'pathway'>('assessment');
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);
  const [targetCareerId, setTargetCareerId] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());
  const [pathwayCourses, setPathwayCourses] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisRun, setAnalysisRun] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'growth'>('match');
  const analysisRef = useRef<HTMLDivElement>(null);

  // ── Actions ─────────────────────────────────────────────────────────────

  const notify = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  const updateSkill = useCallback((name: string, level: number) => {
    trackInteraction('click', 'adjust_skill', { skill: name });
    setSkills(prev => prev.map(s => s.name === name ? { ...s, level } : s));
    setAnalysisRun(false);
  }, [trackInteraction]);

  const runAnalysis = () => {
    trackInteraction('click', 'run_analysis');
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisRun(true);
      setTimeout(() => analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }, 1500);
  };

  const enrollIn = (id: string, title: string) => {
    setEnrolledCourses(prev => new Set([...prev, id]));
    notify(`Enrolled in "${title}"`);
  };

  const addToPath = (id: string, title: string) => {
    setPathwayCourses(prev => new Set([...prev, id]));
    notify(`Added "${title}" to your pathway`);
  };

  const viewLearningPath = (careerId: string) => {
    const career = CAREERS.find(c => c.id === careerId);
    trackInteraction('click', 'select_pathway', { pathway: career?.title ?? careerId });
    setTargetCareerId(careerId);
    setActiveTab('pathway');
  };

  // ── Derived data ────────────────────────────────────────────────────────

  const careerMatches = useMemo(
    () => CAREERS.map(c => ({ ...c, match: calcCareerMatch(skills, c) })),
    [skills],
  );

  const sortedCareers = useMemo(() => [...careerMatches].sort((a, b) => b.match - a.match), [careerMatches]);

  const filteredCareers = useMemo(() => {
    let list = careerMatches;
    if (selectedIndustry !== 'All Industries') {
      list = list.filter(c => c.industries.includes(selectedIndustry));
    }
    const sorters: Record<string, (a: typeof list[0], b: typeof list[0]) => number> = {
      match: (a, b) => b.match - a.match,
      salary: (a, b) => parseSalary(b.salary) - parseSalary(a.salary),
      growth: (a, b) => parseGrowth(b.growth) - parseGrowth(a.growth),
    };
    return [...list].sort(sorters[sortBy]);
  }, [careerMatches, selectedIndustry, sortBy]);

  const bestMatch = sortedCareers[0];
  const top3 = sortedCareers.slice(0, 3);

  const targetCareer = useMemo(() => {
    if (targetCareerId) return CAREERS.find(c => c.id === targetCareerId) ?? CAREERS[0];
    return CAREERS.find(c => c.id === bestMatch.id) ?? CAREERS[0];
  }, [targetCareerId, bestMatch]);

  const skillGaps = useMemo(() => {
    return targetCareer.skillReqs
      .map(req => {
        const current = skills.find(s => s.name === req.name)?.level ?? 0;
        return { name: req.name, current, required: req.required, gap: Math.max(req.required - current, 0) };
      })
      .sort((a, b) => b.gap - a.gap);
  }, [skills, targetCareer]);

  const recommendedCourses = useMemo(() => {
    return COURSES
      .map(c => ({ ...c, relevance: calcCourseRelevance(skills, targetCareer, c) }))
      .filter(c => c.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);
  }, [skills, targetCareer]);

  const gapsToFill = skillGaps.filter(g => g.gap > 0);
  const estMonths = Math.max(1, Math.ceil(gapsToFill.length * 1.5));

  const pathwayPhases = useMemo(() => {
    if (gapsToFill.length === 0) {
      return [{ month: 'Now', title: 'Job Ready!', status: 'current' as const, items: ['Polish your portfolio', 'Practice interviews', 'Apply to positions'], courses: [] as Course[] }];
    }
    const phases: { month: string; title: string; status: 'current' | 'upcoming' | 'future'; items: string[]; courses: Course[] }[] = [];
    const titles = ['Foundation Building', 'Core Development', 'Advanced Skills', 'Specialization'];
    for (let i = 0; i < gapsToFill.length; i += 2) {
      const batch = gapsToFill.slice(i, i + 2);
      const phaseIdx = Math.floor(i / 2);
      const start = phaseIdx * 2 + 1;
      const batchSkillNames = batch.map(g => g.name);
      phases.push({
        month: `Month ${start}–${start + 1}`,
        title: titles[phaseIdx] ?? `Phase ${phaseIdx + 1}`,
        status: phaseIdx === 0 ? 'current' : 'upcoming',
        items: batch.map(g => `${g.name}: close ${g.gap}% gap (${g.current}% → ${g.required}%)`),
        courses: COURSES.filter(c => c.skillsCovered.some(s => batchSkillNames.includes(s))).slice(0, 2),
      });
    }
    phases.push({
      month: `Month ${phases.length * 2 + 1}+`,
      title: 'Job Ready',
      status: 'future',
      items: ['Build portfolio projects', 'Practice technical interviews', `Apply to ${targetCareer.title} positions`],
      courses: [],
    });
    return phases;
  }, [gapsToFill, targetCareer]);

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="bg-gradient-to-br from-slate-50 to-violet-50 p-6 rounded-2xl relative">
      {/* Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium">
          {notification}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
            Interactive Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Career Pathways AI</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rate your skills, explore career matches, and get personalized course recommendations&mdash;all powered by real-time analysis.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {([
            { id: 'assessment', label: 'Skill Assessment', icon: '📊' },
            { id: 'careers', label: 'Career Explorer', icon: '🎯' },
            { id: 'courses', label: 'Courses', icon: '📚' },
            { id: 'pathway', label: 'My Pathway', icon: '🛤️' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-violet-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Content Panel ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          {/* ═══ SKILL ASSESSMENT ═══ */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Rate Your Skills</h3>
                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 transition"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing&hellip;
                    </span>
                  ) : 'Run AI Analysis'}
                </button>
              </div>

              <p className="text-sm text-gray-500">
                Drag the sliders to rate your current proficiency. Career matches update in real time.
              </p>

              {/* Category legend */}
              <div className="flex gap-2">
                {(['Technical', 'Soft Skills', 'Domain'] as const).map(label => (
                  <span key={label} className={`px-3 py-1 rounded-full text-xs font-medium ${
                    label === 'Technical' ? 'bg-blue-100 text-blue-700' :
                    label === 'Soft Skills' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                  }`}>{label}</span>
                ))}
              </div>

              {/* Skill sliders */}
              <div className="space-y-3">
                {skills.map(skill => (
                  <div key={skill.name} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${categoryColor[skill.category]}`}>
                          {skill.category}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-violet-700 tabular-nums w-12 text-right">
                        {skill.level}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={skill.level}
                      onChange={e => updateSkill(skill.name, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live match strip */}
              <div className="flex flex-wrap items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-500">Live matches:</span>
                {top3.map(c => (
                  <span key={c.id} className="text-sm">
                    <span className="text-gray-700">{c.title}</span>{' '}
                    <strong className={matchColor(c.match)}>{c.match}%</strong>
                  </span>
                ))}
              </div>

              {/* AI analysis */}
              <div ref={analysisRef} className={`rounded-xl p-4 border transition-all ${analysisRun ? 'bg-violet-50 border-violet-200' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className="font-medium text-gray-900 mb-2">
                  {analysisRun ? '🤖 AI Analysis' : '💡 Quick Insights'}
                </h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    Your strongest match is <strong className="text-violet-700">{bestMatch.title}</strong>{' '}
                    at <strong className={matchColor(bestMatch.match)}>{bestMatch.match}%</strong>.
                    {bestMatch.match >= 80 && " You're well-positioned for this role!"}
                    {bestMatch.match >= 60 && bestMatch.match < 80 && ' A few skill improvements would make you highly competitive.'}
                    {bestMatch.match < 60 && ' Focused skill development will improve your competitiveness.'}
                  </p>
                  {analysisRun && (
                    <>
                      <p>
                        <strong>Top 3 matches:</strong>{' '}
                        {top3.map((c, i) => (
                          <span key={c.id}>{c.title} ({c.match}%){i < 2 ? ', ' : ''}</span>
                        ))}
                      </p>
                      {gapsToFill.length > 0 && (
                        <p>
                          <strong>Priority gaps to close:</strong>{' '}
                          {gapsToFill.slice(0, 3).map((g, i) => (
                            <span key={g.name}>{g.name} (need +{g.gap}%){i < Math.min(gapsToFill.length, 3) - 1 ? ', ' : ''}</span>
                          ))}
                        </p>
                      )}
                      <p className="text-violet-600 font-medium">
                        Estimated time to reach {bestMatch.title}: <strong>{estMonths} months</strong> with focused study.
                      </p>
                    </>
                  )}
                </div>
                {!analysisRun && (
                  <p className="text-xs text-gray-500 mt-2">Click &ldquo;Run AI Analysis&rdquo; for a detailed breakdown</p>
                )}
              </div>
            </div>
          )}

          {/* ═══ CAREER EXPLORER ═══ */}
          {activeTab === 'careers' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Career Matches</h3>
                <div className="flex gap-2">
                  <select
                    value={selectedIndustry}
                    onChange={e => setSelectedIndustry(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg text-sm"
                  >
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="p-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="match">Sort by Match</option>
                    <option value="salary">Sort by Salary</option>
                    <option value="growth">Sort by Growth</option>
                  </select>
                </div>
              </div>

              {filteredCareers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">No careers found in {selectedIndustry}</p>
                  <p className="text-sm mt-1">Try a different industry filter</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredCareers.map(career => {
                    const expanded = expandedCareer === career.id;
                    return (
                      <div
                        key={career.id}
                        onClick={() => setExpandedCareer(expanded ? null : career.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          expanded ? 'border-violet-500 bg-violet-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{career.title}</h4>
                            <p className="text-sm text-gray-600">{career.salary}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${matchColor(career.match)}`}>{career.match}%</div>
                            <div className="text-xs text-gray-500">match</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="text-green-600">📈 {career.growth} growth</span>
                          <span className="text-blue-600">💼 {career.openings.toLocaleString()} openings</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {career.industries.map(ind => (
                            <span key={ind} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{ind}</span>
                          ))}
                        </div>

                        {expanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                            <p className="text-sm text-gray-600">{career.description}</p>
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Skills Required:</h5>
                              <div className="space-y-2">
                                {career.skillReqs.map(req => {
                                  const userLevel = skills.find(s => s.name === req.name)?.level ?? 0;
                                  const met = userLevel >= req.required;
                                  return (
                                    <div key={req.name} className="flex items-center gap-2 text-sm">
                                      <span className={met ? 'text-green-500' : 'text-amber-500'}>{met ? '✓' : '○'}</span>
                                      <span className="flex-1 text-gray-700">{req.name}</span>
                                      <span className={`font-medium tabular-nums ${met ? 'text-green-600' : 'text-amber-600'}`}>
                                        {userLevel}% / {req.required}%
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={e => { e.stopPropagation(); viewLearningPath(career.id); }}
                                className="flex-1 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition"
                              >
                                View Learning Path
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); notify(`Showing ${career.openings.toLocaleString()} open ${career.title} positions…`); }}
                                className="flex-1 py-2 border border-violet-600 text-violet-600 text-sm font-medium rounded-lg hover:bg-violet-50 transition"
                              >
                                See Job Listings
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">Market Insights</h4>
                <p
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: MARKET_INSIGHTS[selectedIndustry] ?? MARKET_INSIGHTS['All Industries'] }}
                />
              </div>
            </div>
          )}

          {/* ═══ COURSE RECOMMENDATIONS ═══ */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recommended Courses</h3>
                  <p className="text-sm text-gray-500">
                    Based on skill gaps for <strong className="text-violet-600">{targetCareer.title}</strong>
                  </p>
                </div>
                <select
                  value={targetCareerId ?? bestMatch.id}
                  onChange={e => setTargetCareerId(e.target.value)}
                  className="p-2 border border-gray-200 rounded-lg text-sm"
                >
                  {sortedCareers.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.match}% match)</option>
                  ))}
                </select>
              </div>

              {recommendedCourses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lg text-green-600 font-medium">🎉 No skill gaps found!</p>
                  <p className="text-sm text-gray-500 mt-1">You meet all requirements for {targetCareer.title}.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendedCourses.map(course => {
                    const isEnrolled = enrolledCourses.has(course.id);
                    const inPath = pathwayCourses.has(course.id);
                    return (
                      <div key={course.id} className={`p-4 rounded-xl border transition ${isEnrolled ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-violet-300'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-gray-900">{course.title}</h4>
                              {isEnrolled && <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded-full">Enrolled</span>}
                              {inPath && !isEnrolled && <span className="text-xs px-2 py-0.5 bg-violet-200 text-violet-800 rounded-full">In Pathway</span>}
                            </div>
                            <p className="text-sm text-gray-600">{course.provider} &middot; {course.duration} &middot; {course.level}</p>
                          </div>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${
                            course.relevance >= 70 ? 'bg-green-100 text-green-700' :
                            course.relevance >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {course.relevance}% relevant
                          </span>
                        </div>

                        <div className="mt-3">
                          <span className="text-sm text-gray-500">Covers: </span>
                          {course.skillsCovered.map((sk, idx) => {
                            const gap = skillGaps.find(g => g.name === sk);
                            const hasGap = gap && gap.gap > 0;
                            return (
                              <span key={idx} className={`text-sm ${hasGap ? 'text-violet-600 font-medium' : 'text-gray-500'}`}>
                                {sk}{hasGap ? ` (-${gap.gap}%)` : ''}{idx < course.skillsCovered.length - 1 ? ', ' : ''}
                              </span>
                            );
                          })}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => isEnrolled ? notify('Already enrolled!') : enrollIn(course.id, course.title)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                              isEnrolled ? 'bg-green-600 text-white' : 'bg-violet-600 text-white hover:bg-violet-700'
                            }`}
                          >
                            {isEnrolled ? '✓ Enrolled' : 'Enroll Now'}
                          </button>
                          <button
                            onClick={() => inPath ? notify('Already in pathway!') : addToPath(course.id, course.title)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
                              inPath ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {inPath ? '✓ In Pathway' : 'Add to Pathway'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 mb-2">Alternative Learning Options</h4>
                <div className="grid md:grid-cols-3 gap-4 mt-3">
                  {[
                    { type: 'Bootcamps', count: '12 programs', icon: '🚀' },
                    { type: 'Certifications', count: '8 available', icon: '🏆' },
                    { type: 'Free Resources', count: '45 courses', icon: '📖' },
                  ].map((opt, idx) => (
                    <div
                      key={idx}
                      onClick={() => notify(`Browsing ${opt.count.split(' ')[0]} ${opt.type.toLowerCase()}…`)}
                      className="bg-white p-3 rounded-lg text-center cursor-pointer hover:shadow-md transition"
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <h5 className="font-medium text-gray-900 mt-1">{opt.type}</h5>
                      <p className="text-sm text-gray-500">{opt.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ MY PATHWAY ═══ */}
          {activeTab === 'pathway' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Learning Pathway</h3>
                <select
                  value={targetCareerId ?? bestMatch.id}
                  onChange={e => setTargetCareerId(e.target.value)}
                  className="px-3 py-1.5 bg-violet-100 text-violet-700 text-sm font-medium rounded-full border-0 cursor-pointer"
                >
                  {sortedCareers.map(c => (
                    <option key={c.id} value={c.id}>{c.title} Track ({c.match}%)</option>
                  ))}
                </select>
              </div>

              {/* Skill gap summary */}
              {gapsToFill.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-medium text-amber-900 mb-3">Skills to Develop for {targetCareer.title}</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {gapsToFill.map(g => (
                      <div key={g.name} className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700">{g.name}</span>
                          <span className="text-amber-600 font-medium tabular-nums">+{g.gap}% needed</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${(g.current / g.required) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {gapsToFill.length === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-lg text-green-700 font-medium">🎉 You meet all skill requirements for {targetCareer.title}!</p>
                  <p className="text-sm text-green-600 mt-1">Adjust your target career or fine-tune skills on the Assessment tab.</p>
                </div>
              )}

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
                {pathwayPhases.map((phase, idx) => (
                  <div key={idx} className="relative pl-20 pb-8">
                    <div className={`absolute left-6 w-5 h-5 rounded-full border-4 ${
                      phase.status === 'current' ? 'bg-violet-600 border-violet-200' :
                      phase.status === 'upcoming' ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'
                    }`} />
                    <div className={`p-4 rounded-xl ${
                      phase.status === 'current' ? 'bg-violet-50 border border-violet-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">{phase.month}</span>
                        {phase.status === 'current' && (
                          <span className="px-2 py-0.5 bg-violet-200 text-violet-800 text-xs font-medium rounded-full">In Progress</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900">{phase.title}</h4>
                      <ul className="mt-2 space-y-1">
                        {phase.items.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      {phase.courses.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Suggested courses</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {phase.courses.map(c => (
                              <span key={c.id} className="text-xs px-2 py-1 bg-white border border-gray-200 text-gray-700 rounded-lg">
                                {c.title} ({c.provider})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Courses added to pathway */}
              {pathwayCourses.size > 0 && (
                <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
                  <h4 className="font-medium text-violet-900 mb-2">Courses in Your Pathway</h4>
                  <div className="space-y-2">
                    {COURSES.filter(c => pathwayCourses.has(c.id)).map(c => (
                      <div key={c.id} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2">
                        <span className="text-gray-700">{c.title}</span>
                        <span className="text-gray-500">{c.provider} &middot; {c.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600">{enrolledCourses.size}</div>
                  <div className="text-sm text-gray-600">Courses Enrolled</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600">{enrolledCourses.size * 40} hrs</div>
                  <div className="text-sm text-gray-600">Est. Study Time</div>
                </div>
                <div className="bg-violet-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-violet-600">{estMonths} mo</div>
                  <div className="text-sm text-gray-600">Est. to Goal</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('courses')}
                  className="flex-1 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition"
                >
                  Browse Courses
                </button>
                <button
                  onClick={() => setActiveTab('assessment')}
                  className="px-6 py-3 border border-violet-600 text-violet-600 font-medium rounded-xl hover:bg-violet-50 transition"
                >
                  Update Skills
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom features */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {[
            { icon: '📊', title: 'Skill Analysis', desc: 'AI-powered assessment' },
            { icon: '🎯', title: 'Career Matching', desc: 'Real market data' },
            { icon: '📚', title: 'Course Recs', desc: 'Personalized learning' },
            { icon: '🛤️', title: 'Pathways', desc: 'Step-by-step plans' },
          ].map((f, idx) => (
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
