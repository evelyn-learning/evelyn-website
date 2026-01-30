'use client';

import React, { useState } from 'react';

interface Skill {
  name: string;
  current: number;
  required: number;
  category: 'technical' | 'soft' | 'domain';
}

interface Career {
  id: string;
  title: string;
  salary: string;
  growth: string;
  match: number;
  skills: string[];
  openings: number;
}

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  skillsCovered: string[];
  relevance: number;
}

const SAMPLE_SKILLS: Skill[] = [
  { name: 'Python Programming', current: 75, required: 90, category: 'technical' },
  { name: 'Data Analysis', current: 60, required: 85, category: 'technical' },
  { name: 'Machine Learning', current: 40, required: 80, category: 'technical' },
  { name: 'SQL/Databases', current: 70, required: 75, category: 'technical' },
  { name: 'Communication', current: 85, required: 80, category: 'soft' },
  { name: 'Problem Solving', current: 80, required: 85, category: 'soft' },
  { name: 'Statistics', current: 55, required: 75, category: 'domain' },
  { name: 'Business Acumen', current: 50, required: 70, category: 'domain' },
];

const SAMPLE_CAREERS: Career[] = [
  {
    id: '1',
    title: 'Data Scientist',
    salary: '$120,000 - $160,000',
    growth: '+36%',
    match: 78,
    skills: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
    openings: 12500,
  },
  {
    id: '2',
    title: 'Data Analyst',
    salary: '$75,000 - $100,000',
    growth: '+25%',
    match: 85,
    skills: ['SQL', 'Excel', 'Data Visualization', 'Statistics'],
    openings: 28000,
  },
  {
    id: '3',
    title: 'Machine Learning Engineer',
    salary: '$140,000 - $200,000',
    growth: '+40%',
    match: 62,
    skills: ['Python', 'TensorFlow', 'Deep Learning', 'MLOps'],
    openings: 8500,
  },
  {
    id: '4',
    title: 'Business Intelligence Analyst',
    salary: '$80,000 - $110,000',
    growth: '+22%',
    match: 72,
    skills: ['SQL', 'Tableau', 'Power BI', 'Business Strategy'],
    openings: 15000,
  },
];

const SAMPLE_COURSES: Course[] = [
  {
    id: '1',
    title: 'Applied Machine Learning',
    provider: 'Coursera',
    duration: '4 months',
    skillsCovered: ['Machine Learning', 'Python', 'TensorFlow'],
    relevance: 95,
  },
  {
    id: '2',
    title: 'Advanced Statistics for Data Science',
    provider: 'edX',
    duration: '3 months',
    skillsCovered: ['Statistics', 'Probability', 'R'],
    relevance: 88,
  },
  {
    id: '3',
    title: 'SQL for Data Analysis',
    provider: 'LinkedIn Learning',
    duration: '2 months',
    skillsCovered: ['SQL', 'Database Design', 'Query Optimization'],
    relevance: 82,
  },
];

export default function CareerPathwaysDemo() {
  const [activeTab, setActiveTab] = useState<'assessment' | 'careers' | 'courses' | 'pathway'>('assessment');
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(true);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);
  };

  const getCategoryColor = (category: Skill['category']) => {
    const colors = {
      technical: 'bg-blue-100 text-blue-700',
      soft: 'bg-green-100 text-green-700',
      domain: 'bg-purple-100 text-purple-700',
    };
    return colors[category];
  };

  const getMatchColor = (match: number) => {
    if (match >= 80) return 'text-green-600';
    if (match >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-violet-50 p-6 rounded-2xl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
            Higher Ed & Workforce Solution
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Career Pathways AI</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Skill gap analysis, career exploration, and personalized course recommendations
            based on real job market data.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'assessment', label: 'Skill Assessment', icon: '📊' },
            { id: 'careers', label: 'Career Explorer', icon: '🎯' },
            { id: 'courses', label: 'Course Recommendations', icon: '📚' },
            { id: 'pathway', label: 'My Pathway', icon: '🛤️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-lg'
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
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Your Skill Profile</h3>
                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Update Assessment'}
                </button>
              </div>

              {/* Skill Categories */}
              <div className="flex gap-2 mb-4">
                {[
                  { label: 'Technical', color: 'bg-blue-100 text-blue-700' },
                  { label: 'Soft Skills', color: 'bg-green-100 text-green-700' },
                  { label: 'Domain', color: 'bg-purple-100 text-purple-700' },
                ].map((cat) => (
                  <span key={cat.label} className={`px-3 py-1 rounded-full text-xs font-medium ${cat.color}`}>
                    {cat.label}
                  </span>
                ))}
              </div>

              <div className="space-y-4">
                {SAMPLE_SKILLS.map((skill, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(skill.category)}`}>
                          {skill.category}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${skill.current >= skill.required ? 'text-green-600' : 'text-amber-600'}`}>
                        {skill.current >= skill.required ? '✓ Met' : `Gap: ${skill.required - skill.current}%`}
                      </span>
                    </div>
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full rounded-full ${skill.current >= skill.required ? 'bg-green-500' : 'bg-violet-500'}`}
                        style={{ width: `${skill.current}%` }}
                      />
                      <div
                        className="absolute h-full w-0.5 bg-red-500"
                        style={{ left: `${skill.required}%` }}
                        title={`Required: ${skill.required}%`}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Current: {skill.current}%</span>
                      <span>Required: {skill.required}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
                <h4 className="font-medium text-violet-900 mb-2">AI Analysis Summary</h4>
                <p className="text-sm text-violet-800">
                  Based on your current skills and career interests in Data Science, you have a <strong>78% match</strong>.
                  Focus on improving Machine Learning (+40%) and Statistics (+20%) to increase your competitiveness.
                  Estimated time to fill gaps: <strong>4-6 months</strong> with dedicated study.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'careers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Career Matches</h3>
                <select className="p-2 border border-gray-200 rounded-lg text-sm">
                  <option>All Industries</option>
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {SAMPLE_CAREERS.map((career) => (
                  <div
                    key={career.id}
                    onClick={() => setSelectedCareer(selectedCareer?.id === career.id ? null : career)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      selectedCareer?.id === career.id
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{career.title}</h4>
                        <p className="text-sm text-gray-600">{career.salary}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getMatchColor(career.match)}`}>
                          {career.match}%
                        </div>
                        <div className="text-xs text-gray-500">match</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-green-600">📈 {career.growth} growth</span>
                      <span className="text-blue-600">💼 {career.openings.toLocaleString()} openings</span>
                    </div>

                    {selectedCareer?.id === career.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Key Skills Required:</h5>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700">
                            View Learning Path
                          </button>
                          <button className="flex-1 py-2 border border-violet-600 text-violet-600 text-sm font-medium rounded-lg hover:bg-violet-50">
                            See Job Listings
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">Market Insights</h4>
                <p className="text-sm text-gray-600">
                  Data-related roles are projected to grow <strong>28% faster</strong> than average through 2030.
                  Remote work options are available for <strong>65%</strong> of these positions.
                  Top hiring industries: Technology, Finance, Healthcare, Retail.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recommended Courses</h3>
                <span className="text-sm text-gray-500">Based on your skill gaps</span>
              </div>

              <div className="space-y-4">
                {SAMPLE_COURSES.map((course) => (
                  <div key={course.id} className="p-4 rounded-xl border border-gray-200 hover:border-violet-300 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600">{course.provider} • {course.duration}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          {course.relevance}% relevant
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-sm text-gray-500">Skills covered: </span>
                      {course.skillsCovered.map((skill, idx) => (
                        <span key={idx} className="text-sm text-violet-600">
                          {skill}{idx < course.skillsCovered.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700">
                        Enroll Now
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                        Add to Pathway
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 mb-2">Alternative Learning Options</h4>
                <div className="grid md:grid-cols-3 gap-4 mt-3">
                  {[
                    { type: 'Bootcamps', count: '12 programs', icon: '🚀' },
                    { type: 'Certifications', count: '8 available', icon: '🏆' },
                    { type: 'Free Resources', count: '45 courses', icon: '📖' },
                  ].map((option, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg text-center">
                      <span className="text-2xl">{option.icon}</span>
                      <h5 className="font-medium text-gray-900 mt-1">{option.type}</h5>
                      <p className="text-sm text-gray-500">{option.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pathway' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Learning Pathway</h3>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 text-sm font-medium rounded-full">
                  Data Scientist Track
                </span>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {[
                  { month: 'Month 1-2', title: 'Foundation Building', status: 'current', items: ['Complete Python Advanced course', 'Statistics fundamentals'] },
                  { month: 'Month 3-4', title: 'Core Skills', status: 'upcoming', items: ['Machine Learning basics', 'Data visualization mastery'] },
                  { month: 'Month 5-6', title: 'Specialization', status: 'upcoming', items: ['Deep Learning course', 'Capstone project'] },
                  { month: 'Month 7+', title: 'Job Ready', status: 'future', items: ['Portfolio building', 'Interview preparation'] },
                ].map((phase, idx) => (
                  <div key={idx} className="relative pl-20 pb-8">
                    <div className={`absolute left-6 w-5 h-5 rounded-full border-4 ${
                      phase.status === 'current' ? 'bg-violet-600 border-violet-200' :
                      phase.status === 'upcoming' ? 'bg-white border-gray-300' :
                      'bg-gray-100 border-gray-200'
                    }`}></div>
                    <div className={`p-4 rounded-xl ${
                      phase.status === 'current' ? 'bg-violet-50 border border-violet-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">{phase.month}</span>
                        {phase.status === 'current' && (
                          <span className="px-2 py-0.5 bg-violet-200 text-violet-800 text-xs font-medium rounded-full">
                            In Progress
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900">{phase.title}</h4>
                      <ul className="mt-2 space-y-1">
                        {phase.items.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-sm text-gray-600">Courses Completed</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600">45 hrs</div>
                  <div className="text-sm text-gray-600">Time Invested</div>
                </div>
                <div className="bg-violet-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-violet-600">4 mo</div>
                  <div className="text-sm text-gray-600">Est. to Goal</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition">
                  Continue Learning
                </button>
                <button className="px-6 py-3 border border-violet-600 text-violet-600 font-medium rounded-xl hover:bg-violet-50 transition">
                  Adjust Pathway
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {[
            { icon: '📊', title: 'Skill Analysis', desc: 'AI-powered assessment' },
            { icon: '🎯', title: 'Career Matching', desc: 'Real market data' },
            { icon: '📚', title: 'Course Recs', desc: 'Personalized learning' },
            { icon: '🛤️', title: 'Pathways', desc: 'Step-by-step plans' },
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
