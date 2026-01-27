'use client';

import React, { useState } from 'react';

interface SkillNode {
  id: string;
  name: string;
  mastery: number;
  status: 'locked' | 'available' | 'in_progress' | 'mastered';
  prerequisites: string[];
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface LearningPath {
  subject: string;
  currentLevel: string;
  overallProgress: number;
  skills: SkillNode[];
  recommendedNext: string[];
  estimatedTimeToMastery: string;
}

const SUBJECTS = {
  algebra: {
    name: 'Algebra',
    icon: '📐',
    skills: [
      { id: 'variables', name: 'Variables & Expressions', mastery: 100, status: 'mastered', prerequisites: [], description: 'Understanding variables and algebraic expressions', difficulty: 'beginner' },
      { id: 'equations', name: 'Linear Equations', mastery: 85, status: 'in_progress', prerequisites: ['variables'], description: 'Solving one-variable linear equations', difficulty: 'beginner' },
      { id: 'inequalities', name: 'Inequalities', mastery: 60, status: 'in_progress', prerequisites: ['equations'], description: 'Solving and graphing inequalities', difficulty: 'intermediate' },
      { id: 'systems', name: 'Systems of Equations', mastery: 0, status: 'available', prerequisites: ['equations'], description: 'Solving systems of linear equations', difficulty: 'intermediate' },
      { id: 'quadratics', name: 'Quadratic Equations', mastery: 0, status: 'locked', prerequisites: ['equations', 'inequalities'], description: 'Solving quadratic equations', difficulty: 'advanced' },
      { id: 'functions', name: 'Functions', mastery: 0, status: 'locked', prerequisites: ['equations'], description: 'Understanding and graphing functions', difficulty: 'intermediate' },
    ]
  },
  biology: {
    name: 'Biology',
    icon: '🧬',
    skills: [
      { id: 'cells', name: 'Cell Structure', mastery: 100, status: 'mastered', prerequisites: [], description: 'Understanding cell components and organelles', difficulty: 'beginner' },
      { id: 'metabolism', name: 'Metabolism', mastery: 75, status: 'in_progress', prerequisites: ['cells'], description: 'Energy processes in cells', difficulty: 'intermediate' },
      { id: 'genetics', name: 'Basic Genetics', mastery: 45, status: 'in_progress', prerequisites: ['cells'], description: 'DNA, genes, and heredity', difficulty: 'intermediate' },
      { id: 'evolution', name: 'Evolution', mastery: 0, status: 'available', prerequisites: ['genetics'], description: 'Natural selection and adaptation', difficulty: 'intermediate' },
      { id: 'ecology', name: 'Ecology', mastery: 0, status: 'locked', prerequisites: ['evolution', 'metabolism'], description: 'Ecosystems and environmental science', difficulty: 'advanced' },
      { id: 'molecular', name: 'Molecular Biology', mastery: 0, status: 'locked', prerequisites: ['genetics', 'metabolism'], description: 'Advanced molecular processes', difficulty: 'advanced' },
    ]
  },
  writing: {
    name: 'Writing',
    icon: '✍️',
    skills: [
      { id: 'grammar', name: 'Grammar Basics', mastery: 90, status: 'mastered', prerequisites: [], description: 'Parts of speech and sentence structure', difficulty: 'beginner' },
      { id: 'paragraphs', name: 'Paragraph Writing', mastery: 80, status: 'in_progress', prerequisites: ['grammar'], description: 'Organizing ideas in paragraphs', difficulty: 'beginner' },
      { id: 'essays', name: 'Essay Structure', mastery: 55, status: 'in_progress', prerequisites: ['paragraphs'], description: 'Introduction, body, conclusion', difficulty: 'intermediate' },
      { id: 'arguments', name: 'Argumentative Writing', mastery: 0, status: 'available', prerequisites: ['essays'], description: 'Building and supporting arguments', difficulty: 'intermediate' },
      { id: 'research', name: 'Research Writing', mastery: 0, status: 'locked', prerequisites: ['essays', 'arguments'], description: 'Citations and research papers', difficulty: 'advanced' },
      { id: 'creative', name: 'Creative Writing', mastery: 0, status: 'locked', prerequisites: ['paragraphs'], description: 'Narrative and descriptive writing', difficulty: 'intermediate' },
    ]
  }
};

interface PracticeQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
}

const PRACTICE_QUESTIONS: Record<string, PracticeQuestion[]> = {
  equations: [
    { question: 'Solve for x: 2x + 5 = 13', options: ['x = 4', 'x = 6', 'x = 3', 'x = 9'], correctAnswer: 0, hint: 'Subtract 5 from both sides, then divide by 2' },
    { question: 'Solve for x: 3x - 7 = 14', options: ['x = 7', 'x = 3', 'x = 21', 'x = 5'], correctAnswer: 0, hint: 'Add 7 to both sides, then divide by 3' },
  ],
  inequalities: [
    { question: 'Solve: 2x + 3 > 9', options: ['x > 3', 'x > 6', 'x < 3', 'x > 12'], correctAnswer: 0, hint: 'Subtract 3 from both sides, then divide by 2' },
  ],
  systems: [
    { question: 'Solve: x + y = 5, x - y = 1. What is x?', options: ['x = 3', 'x = 2', 'x = 4', 'x = 1'], correctAnswer: 0, hint: 'Add the two equations together to eliminate y' },
  ],
  metabolism: [
    { question: 'What is the main product of cellular respiration?', options: ['ATP', 'Glucose', 'Oxygen', 'Carbon Dioxide'], correctAnswer: 0, hint: 'Think about what cells use for energy' },
  ],
  genetics: [
    { question: 'What molecule carries genetic information?', options: ['DNA', 'Protein', 'Lipids', 'Carbohydrates'], correctAnswer: 0, hint: 'It stands for deoxyribonucleic acid' },
  ],
  evolution: [
    { question: 'What is natural selection?', options: ['Survival of the fittest traits', 'Random mutations', 'Artificial breeding', 'Genetic drift'], correctAnswer: 0, hint: 'Think about Darwin\'s theory' },
  ],
  paragraphs: [
    { question: 'What should a topic sentence do?', options: ['Introduce the main idea', 'Provide evidence', 'Conclude the paragraph', 'List details'], correctAnswer: 0, hint: 'It comes at the beginning of a paragraph' },
  ],
  essays: [
    { question: 'What are the three main parts of an essay?', options: ['Intro, Body, Conclusion', 'Title, Abstract, Bibliography', 'Opening, Middle, End', 'Thesis, Evidence, Summary'], correctAnswer: 0, hint: 'Think about the basic structure' },
  ],
  arguments: [
    { question: 'What makes an argument persuasive?', options: ['Evidence and logic', 'Length only', 'Personal opinions', 'Emotional appeals only'], correctAnswer: 0, hint: 'Strong arguments need support' },
  ],
};

export default function AdaptiveLearningDemo() {
  const [selectedSubject, setSelectedSubject] = useState<keyof typeof SUBJECTS>('algebra');
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentPracticeQuestion, setCurrentPracticeQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentSubject = SUBJECTS[selectedSubject];
  const skills = currentSubject.skills as SkillNode[];

  const calculateProgress = () => {
    const totalMastery = skills.reduce((sum, skill) => sum + skill.mastery, 0);
    return Math.round(totalMastery / skills.length);
  };

  const getRecommended = () => {
    return skills
      .filter(s => s.status === 'available' || s.status === 'in_progress')
      .sort((a, b) => {
        if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
        if (b.status === 'in_progress' && a.status !== 'in_progress') return 1;
        return b.mastery - a.mastery;
      })
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'available': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'mastered': return 'border-green-500 bg-green-50';
      case 'in_progress': return 'border-yellow-500 bg-yellow-50';
      case 'available': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const startPractice = (skillId: string) => {
    setIsPracticing(true);
    setCurrentPracticeQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setShowHint(false);
  };

  const closePractice = () => {
    setIsPracticing(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setShowHint(false);
  };

  const getPracticeQuestions = (): PracticeQuestion[] => {
    if (!selectedSkill) return [];
    return PRACTICE_QUESTIONS[selectedSkill.id] || [
      { question: `Practice question for ${selectedSkill.name}`, options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'], correctAnswer: 0, hint: 'Think about the concept carefully' }
    ];
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-cyan-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            Interactive Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Adaptive Learning Engine
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore a personalized skill tree that adapts to each student&apos;s progress and learning needs.
          </p>
        </div>

        {/* Subject Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {Object.entries(SUBJECTS).map(([key, subject]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedSubject(key as keyof typeof SUBJECTS);
                setSelectedSkill(null);
              }}
              className={`px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 ${
                selectedSubject === key
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
              }`}
            >
              <span className="text-xl">{subject.icon}</span>
              {subject.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Progress Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Overall Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Overview</h3>
              <div className="text-center mb-4">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#06b6d4"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${calculateProgress() * 3.52} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{calculateProgress()}%</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{currentSubject.name} Mastery</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Skills Mastered</span>
                  <span className="font-medium text-green-600">
                    {skills.filter(s => s.status === 'mastered').length}/{skills.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">In Progress</span>
                  <span className="font-medium text-yellow-600">
                    {skills.filter(s => s.status === 'in_progress').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Available</span>
                  <span className="font-medium text-blue-600">
                    {skills.filter(s => s.status === 'available').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Next */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended Next</h3>
              <div className="space-y-3">
                {getRecommended().map((skill, idx) => (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${getStatusBorder(skill.status)} hover:shadow-md`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <span className="text-xs px-2 py-1 bg-white rounded-full">
                        {skill.mastery}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStatusColor(skill.status)}`}
                        style={{ width: `${skill.mastery}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Tree Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Skill Tree</h3>

              <div className="grid grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    disabled={skill.status === 'locked'}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedSkill?.id === skill.id ? 'ring-2 ring-cyan-500 ring-offset-2' : ''
                    } ${getStatusBorder(skill.status)} ${
                      skill.status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-3 h-3 rounded-full ${getStatusColor(skill.status)}`}></span>
                      <span className="text-xs text-gray-500 capitalize">{skill.difficulty}</span>
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm mb-2">{skill.name}</h4>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStatusColor(skill.status)} transition-all duration-500`}
                        style={{ width: `${skill.mastery}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{skill.mastery}% mastery</p>
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-6 pt-4 border-t">
                {[
                  { status: 'mastered', label: 'Mastered' },
                  { status: 'in_progress', label: 'In Progress' },
                  { status: 'available', label: 'Available' },
                  { status: 'locked', label: 'Locked' },
                ].map((item) => (
                  <div key={item.status} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></span>
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Details */}
            {selectedSkill && (
              <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedSkill.name}</h3>
                    <p className="text-gray-600">{selectedSkill.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBorder(selectedSkill.status)}`}>
                    {selectedSkill.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Mastery Level</p>
                    <p className="text-xl font-bold text-gray-900">{selectedSkill.mastery}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Difficulty</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">{selectedSkill.difficulty}</p>
                  </div>
                </div>

                {selectedSkill.prerequisites.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Prerequisites:</p>
                    <div className="flex gap-2">
                      {selectedSkill.prerequisites.map((prereqId) => {
                        const prereq = skills.find(s => s.id === prereqId);
                        return prereq ? (
                          <span key={prereqId} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {prereq.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {selectedSkill.status !== 'locked' && selectedSkill.status !== 'mastered' && !isPracticing && (
                  <button
                    onClick={() => startPractice(selectedSkill.id)}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <span>🎯</span>
                    Practice This Skill
                  </button>
                )}

                {/* Practice Mode */}
                {isPracticing && (
                  <div className="mt-4 p-4 bg-cyan-50 rounded-xl border-2 border-cyan-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-cyan-800">Practice: {selectedSkill.name}</h4>
                      <button
                        onClick={closePractice}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Close
                      </button>
                    </div>

                    {(() => {
                      const questions = getPracticeQuestions();
                      const q = questions[currentPracticeQuestion];
                      return (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Question {currentPracticeQuestion + 1} of {questions.length}
                          </p>
                          <p className="font-medium text-gray-900 mb-4">{q.question}</p>

                          <div className="space-y-2">
                            {q.options.map((opt, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setSelectedAnswer(idx);
                                  setShowAnswer(true);
                                }}
                                disabled={showAnswer}
                                className={`w-full text-left p-3 rounded-lg border-2 transition text-sm ${
                                  showAnswer && idx === q.correctAnswer
                                    ? 'bg-green-100 border-green-500'
                                    : showAnswer && idx === selectedAnswer && idx !== q.correctAnswer
                                    ? 'bg-red-100 border-red-500'
                                    : 'bg-white border-gray-200 hover:border-cyan-400'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>

                          {!showAnswer && (
                            <button
                              onClick={() => setShowHint(!showHint)}
                              className="mt-3 text-sm text-cyan-600 hover:text-cyan-700"
                            >
                              {showHint ? 'Hide hint' : 'Need a hint?'}
                            </button>
                          )}

                          {showHint && !showAnswer && (
                            <p className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                              💡 {q.hint}
                            </p>
                          )}

                          {showAnswer && (
                            <div className="mt-4 flex gap-2">
                              {currentPracticeQuestion < questions.length - 1 ? (
                                <button
                                  onClick={() => {
                                    setCurrentPracticeQuestion(prev => prev + 1);
                                    setSelectedAnswer(null);
                                    setShowAnswer(false);
                                    setShowHint(false);
                                  }}
                                  className="flex-1 py-2 bg-cyan-600 text-white rounded-lg font-medium"
                                >
                                  Next Question
                                </button>
                              ) : (
                                <button
                                  onClick={closePractice}
                                  className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium"
                                >
                                  Complete Practice
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features Banner */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Adaptive Features</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '🎯', title: 'Personalized Paths', desc: 'Unique learning journeys' },
              { icon: '📈', title: 'Progress Tracking', desc: 'Real-time mastery data' },
              { icon: '🔓', title: 'Skill Prerequisites', desc: 'Logical progression' },
              { icon: '🤖', title: 'AI Recommendations', desc: 'Smart next steps' },
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
