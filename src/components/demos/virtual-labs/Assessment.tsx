'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface QuizQuestion {
  id: string;
  trigger: AssessmentTrigger;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface AssessmentTrigger {
  lab: 'physics' | 'chemistry' | 'biology';
  condition: string; // description for display
}

const QUIZ_BANK: QuizQuestion[] = [
  // Physics — Free Fall
  {
    id: 'freefall-1',
    trigger: { lab: 'physics', condition: 'Free Fall experiment loaded' },
    question: 'If you double the gravity, how does the time to hit the ground change?',
    options: ['Doubles', 'Halves', 'Decreases by factor of √2', 'Stays the same'],
    correctIndex: 2,
    explanation: 'Time to fall height h is t = √(2h/g). Doubling g divides t by √2 ≈ 1.41, not by 2.',
  },
  {
    id: 'freefall-2',
    trigger: { lab: 'physics', condition: 'Free Fall experiment loaded' },
    question: 'A heavier ball and a lighter ball are dropped from the same height. Which hits the ground first?',
    options: ['The heavier ball', 'The lighter ball', 'They hit at the same time', 'Depends on elasticity'],
    correctIndex: 2,
    explanation: 'In the absence of air resistance, all objects fall at the same rate regardless of mass. This is Galileo\'s famous principle.',
  },
  // Physics — Collision
  {
    id: 'collision-1',
    trigger: { lab: 'physics', condition: 'Elastic Collision experiment loaded' },
    question: 'In a perfectly elastic collision, what is conserved?',
    options: ['Only momentum', 'Only kinetic energy', 'Both momentum and kinetic energy', 'Neither'],
    correctIndex: 2,
    explanation: 'Elastic collisions conserve both total momentum AND total kinetic energy. Inelastic collisions conserve only momentum.',
  },
  {
    id: 'collision-2',
    trigger: { lab: 'physics', condition: 'Elastic Collision experiment loaded' },
    question: 'A heavy ball hits a stationary light ball head-on. After collision, the heavy ball:',
    options: ['Stops completely', 'Continues forward slower', 'Bounces back', 'Speeds up'],
    correctIndex: 1,
    explanation: 'When a heavy object hits a lighter one, it continues forward but slower, transferring some momentum to the lighter object which moves faster.',
  },
  // Physics — Projectile
  {
    id: 'projectile-1',
    trigger: { lab: 'physics', condition: 'Projectile Motion experiment loaded' },
    question: 'At what launch angle is the range of a projectile maximized (ignoring air resistance)?',
    options: ['30°', '45°', '60°', '90°'],
    correctIndex: 1,
    explanation: 'Range R = v₀²sin(2θ)/g is maximized when sin(2θ) = 1, which occurs at θ = 45°.',
  },
  {
    id: 'projectile-2',
    trigger: { lab: 'physics', condition: 'Projectile Motion experiment loaded' },
    question: 'At the highest point of a projectile\'s path, what is the vertical velocity?',
    options: ['Maximum', 'Zero', 'Equal to horizontal velocity', 'Negative'],
    correctIndex: 1,
    explanation: 'At the apex, vertical velocity is momentarily zero as the ball transitions from going up to falling down. Horizontal velocity remains unchanged.',
  },
  // Physics — Bouncing
  {
    id: 'bounce-1',
    trigger: { lab: 'physics', condition: 'Bouncing Balls experiment loaded' },
    question: 'With elasticity set to 50%, what fraction of kinetic energy is lost in each bounce?',
    options: ['25%', '50%', '75%', '100%'],
    correctIndex: 2,
    explanation: 'The coefficient of restitution (elasticity) relates to energy by E_after/E_before = e². At e=0.5: 0.5² = 0.25, so 75% of kinetic energy is lost per bounce.',
  },
  // Chemistry — Gas Law
  {
    id: 'gas-1',
    trigger: { lab: 'chemistry', condition: 'Gas Law simulation' },
    question: 'If you double the temperature (in Kelvin) at constant volume, what happens to pressure?',
    options: ['Halves', 'Stays the same', 'Doubles', 'Quadruples'],
    correctIndex: 2,
    explanation: 'From PV=nRT, if V and n are constant: P ∝ T. Doubling T doubles P. This is Gay-Lussac\'s Law.',
  },
  {
    id: 'gas-2',
    trigger: { lab: 'chemistry', condition: 'Gas Law simulation' },
    question: 'Why do gas particles move faster at higher temperatures?',
    options: [
      'They get lighter',
      'Temperature IS average kinetic energy',
      'The container pushes them',
      'They absorb photons'
    ],
    correctIndex: 1,
    explanation: 'Temperature is directly proportional to the average kinetic energy of gas molecules: KE_avg = (3/2)kT. Higher T = faster particles.',
  },
  // Biology — Ecosystem
  {
    id: 'bio-1',
    trigger: { lab: 'biology', condition: 'Predator-Prey simulation' },
    question: 'In a Lotka-Volterra model, predator population peaks:',
    options: [
      'At the same time as prey',
      'Before prey peak',
      'After prey peak',
      'Independently of prey'
    ],
    correctIndex: 2,
    explanation: 'Predator population peaks AFTER prey — there\'s a phase lag. Prey grow first (food abundance), then predators respond to abundant prey, then prey crash from over-predation.',
  },
  {
    id: 'bio-2',
    trigger: { lab: 'biology', condition: 'Predator-Prey simulation' },
    question: 'If all predators are removed, what happens to the prey population?',
    options: [
      'Stays constant',
      'Grows to carrying capacity then stabilizes',
      'Grows forever',
      'Immediately crashes'
    ],
    correctIndex: 1,
    explanation: 'Without predation, prey grow logistically until limited by resources (carrying capacity). In our simulation, this is the density-dependent growth cap.',
  },
];

interface AssessmentProps {
  activeTab: 'physics' | 'chemistry' | 'biology';
  selectedPreset?: string;
}

export default function Assessment({ activeTab, selectedPreset }: AssessmentProps) {
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [completed, setCompleted] = useState(false);

  // Select questions based on active lab/preset
  const loadQuestions = useCallback(() => {
    let filtered: QuizQuestion[];

    if (activeTab === 'physics' && selectedPreset) {
      const presetMap: Record<string, string> = {
        freefall: 'Free Fall',
        collision: 'Elastic Collision',
        projectile: 'Projectile Motion',
        pendulum: 'Bouncing Balls',
      };
      const presetName = presetMap[selectedPreset] || '';
      filtered = QUIZ_BANK.filter(q =>
        q.trigger.lab === 'physics' && q.trigger.condition.includes(presetName)
      );
    } else {
      filtered = QUIZ_BANK.filter(q => q.trigger.lab === activeTab);
    }

    // Shuffle and take up to 3
    const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, 3);
    setCurrentQuestions(shuffled);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore({ correct: 0, total: 0 });
    setCompleted(false);
  }, [activeTab, selectedPreset]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  if (currentQuestions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-2">Knowledge Check</h3>
        <p className="text-sm text-gray-500">No questions available for this experiment yet.</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center py-4">
          <div className="text-4xl mb-3">{score.correct === score.total ? '🌟' : score.correct > 0 ? '👍' : '📚'}</div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Assessment Complete</h3>
          <p className="text-3xl font-bold text-teal-600 mb-1">{score.correct}/{score.total}</p>
          <p className="text-sm text-gray-500 mb-4">
            {score.correct === score.total
              ? 'Perfect score! You understand the concepts well.'
              : score.correct > 0
              ? 'Good effort! Review the explanations to strengthen your understanding.'
              : 'Keep experimenting with the simulation and try again!'}
          </p>
          <button
            onClick={loadQuestions}
            className="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const q = currentQuestions[currentIdx];

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    setScore(prev => ({
      correct: prev.correct + (idx === q.correctIndex ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    if (currentIdx < currentQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Knowledge Check</h3>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {currentIdx + 1}/{currentQuestions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-4">
        {currentQuestions.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full ${
              idx < currentIdx ? 'bg-teal-500' : idx === currentIdx ? 'bg-teal-300' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <p className="text-sm font-medium text-gray-800 mb-4">{q.question}</p>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {q.options.map((option, idx) => {
          let style = 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200';
          if (selectedAnswer !== null) {
            if (idx === q.correctIndex) {
              style = 'bg-green-50 text-green-800 border-green-300';
            } else if (idx === selectedAnswer && idx !== q.correctIndex) {
              style = 'bg-red-50 text-red-800 border-red-300';
            } else {
              style = 'bg-gray-50 text-gray-400 border-gray-100';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selectedAnswer !== null}
              className={`w-full p-3 rounded-xl text-left text-sm border transition ${style} ${
                selectedAnswer === null ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
              {option}
              {selectedAnswer !== null && idx === q.correctIndex && (
                <span className="float-right">✓</span>
              )}
              {selectedAnswer === idx && idx !== q.correctIndex && (
                <span className="float-right">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`p-3 rounded-xl text-sm mb-4 ${
          selectedAnswer === q.correctIndex
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-amber-50 border border-amber-200 text-amber-800'
        }`}>
          <p className="font-medium mb-1">
            {selectedAnswer === q.correctIndex ? 'Correct!' : 'Not quite.'}
          </p>
          <p>{q.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {selectedAnswer !== null && (
        <button
          onClick={handleNext}
          className="w-full py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition"
        >
          {currentIdx < currentQuestions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  );
}
