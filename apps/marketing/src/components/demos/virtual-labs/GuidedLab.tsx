'use client';

import React, { useState } from 'react';

interface LabStep {
  instruction: string;
  parameterHint?: string;
  question?: string;
  correctAnswer?: string;
  explanation?: string;
}

interface GuidedLabProcedure {
  id: string;
  title: string;
  subject: 'physics' | 'chemistry';
  icon: string;
  description: string;
  learningObjective: string;
  steps: LabStep[];
}

const PROCEDURES: GuidedLabProcedure[] = [
  {
    id: 'gravity-exploration',
    title: 'Exploring Gravity',
    subject: 'physics',
    icon: '🍎',
    description: 'Investigate how gravity affects falling objects and discover the relationship between mass and fall time.',
    learningObjective: 'Understand that all objects fall at the same rate regardless of mass (in the absence of air resistance).',
    steps: [
      {
        instruction: 'Select the "Free Fall" preset and press Play. Watch the ball fall.',
        parameterHint: 'Use the Free Fall preset',
      },
      {
        instruction: 'Reset the simulation. Set gravity to 0.10 and press Play. Observe how slowly the ball falls.',
        parameterHint: 'Gravity → 0.10',
      },
      {
        instruction: 'Now reset and set gravity to 0.50. How does the fall speed compare?',
        parameterHint: 'Gravity → 0.50',
        question: 'When gravity doubled, what happened to how quickly the ball fell?',
        correctAnswer: 'faster',
        explanation: 'Higher gravity means stronger downward acceleration, so the ball reaches the ground faster. The relationship is: distance = ½gt², so doubling g halves the time for the same distance.',
      },
      {
        instruction: 'Now click and drag on the canvas to launch a heavy ball (mass 1) and a light ball. Do they fall at the same rate?',
        parameterHint: 'Drag to launch two balls at the same height',
        question: 'Do objects with different masses fall at the same rate?',
        correctAnswer: 'yes',
        explanation: 'In our simulation (without air resistance), all objects accelerate at the same rate due to gravity, regardless of mass. This is what Galileo demonstrated at the Tower of Pisa!',
      },
      {
        instruction: 'Enable "Show Energy Bars" and reset with Free Fall. Watch how energy transforms as the ball falls.',
        parameterHint: 'Toggle on Energy Bars',
        question: 'What happens to potential energy (PE) as the ball falls?',
        correctAnswer: 'decreases',
        explanation: 'As the ball falls, PE converts to KE. The total energy stays constant — this is conservation of energy! PE decreases as height decreases, and KE increases as speed increases.',
      },
    ],
  },
  {
    id: 'momentum-conservation',
    title: 'Conservation of Momentum',
    subject: 'physics',
    icon: '💥',
    description: 'Explore elastic collisions and verify that momentum is conserved when two objects collide.',
    learningObjective: 'Understand that total momentum is conserved in elastic collisions.',
    steps: [
      {
        instruction: 'Select "Elastic Collision" and press Play. Watch the two balls collide.',
        parameterHint: 'Use the Elastic Collision preset',
      },
      {
        instruction: 'Observe the velocity vectors. The blue ball (mass 2) moves right, the green ball (mass 1) moves left. After collision, what happens?',
        question: 'After the collision, which ball moves faster?',
        correctAnswer: 'green',
        explanation: 'The lighter ball (green, mass 1) moves faster after collision. Momentum (mass × velocity) is transferred — the heavier ball gives more momentum to the lighter one.',
      },
      {
        instruction: 'Reset and set elasticity to 50%. Run the collision again.',
        parameterHint: 'Elasticity → 50%',
        question: 'With lower elasticity, do the balls move faster or slower after collision compared to 100% elasticity?',
        correctAnswer: 'slower',
        explanation: 'Lower elasticity means energy is lost during collision (converted to heat/sound in real life). The balls move slower. Momentum is still conserved, but kinetic energy is not!',
      },
      {
        instruction: 'Try setting elasticity to 0%. What happens when the balls collide?',
        parameterHint: 'Elasticity → 0%',
        question: 'What kind of collision is this called?',
        correctAnswer: 'perfectly inelastic',
        explanation: 'At 0% elasticity, this is a perfectly inelastic collision — the objects lose all relative motion. In real life, they would stick together (like clay balls). Maximum kinetic energy is lost.',
      },
    ],
  },
  {
    id: 'gas-laws',
    title: 'Ideal Gas Law',
    subject: 'chemistry',
    icon: '🌡️',
    description: 'Investigate how temperature, volume, and particle count affect gas pressure through the ideal gas law PV=nRT.',
    learningObjective: 'Understand the relationships between pressure, volume, temperature, and amount of gas.',
    steps: [
      {
        instruction: 'Switch to the Chemistry Lab. Set Temperature to 300K, Volume to 70%, and Amount to 3 mol. Press Play and observe the particles.',
        parameterHint: 'T=300K, V=70%, n=3 mol',
      },
      {
        instruction: 'Now increase the temperature to 600K while keeping volume and amount the same. Watch the particles speed up.',
        parameterHint: 'Temperature → 600K',
        question: 'What happened to the pressure (wall hits/s) when you doubled the temperature?',
        correctAnswer: 'increased',
        explanation: 'PV=nRT tells us that if V and n are constant, P is directly proportional to T. Double T → double P. The particles move faster and hit the walls more frequently and harder.',
      },
      {
        instruction: 'Reset temperature to 300K. Now decrease the volume from 70% to 35%.',
        parameterHint: 'Temperature → 300K, Volume → 35%',
        question: 'What happened to pressure when you halved the volume?',
        correctAnswer: 'increased',
        explanation: 'This is Boyle\'s Law: at constant T and n, pressure is inversely proportional to volume. Half the volume → double the pressure. Particles hit walls more often in a smaller space.',
      },
      {
        instruction: 'Set volume back to 70%. Now increase the amount from 3 mol to 6 mol.',
        parameterHint: 'Volume → 70%, Amount → 6 mol',
        question: 'What happened to pressure when you doubled the number of particles?',
        correctAnswer: 'increased',
        explanation: 'More particles = more wall collisions = higher pressure. At constant T and V, pressure is directly proportional to n (Avogadro\'s contribution to the gas law).',
      },
      {
        instruction: 'Try to keep pressure constant while doubling the temperature. What do you need to change?',
        parameterHint: 'Experiment freely!',
        question: 'To keep P constant when T doubles, you must _____ the volume.',
        correctAnswer: 'double',
        explanation: 'This is Charles\'s Law: at constant P and n, volume is directly proportional to temperature. This is why hot air balloons rise — heated air expands!',
      },
    ],
  },
];

interface GuidedLabProps {
  onSwitchTab?: (tab: 'physics' | 'chemistry') => void;
}

export default function GuidedLab({ onSwitchTab }: GuidedLabProps) {
  const [selectedProcedure, setSelectedProcedure] = useState<GuidedLabProcedure | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(false);

  const handleSelectProcedure = (proc: GuidedLabProcedure) => {
    setSelectedProcedure(proc);
    setCurrentStep(0);
    setAnswers({});
    setRevealedSteps(new Set());
    setCompleted(false);
    if (onSwitchTab) {
      onSwitchTab(proc.subject);
    }
  };

  const handleAnswer = (stepIdx: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [stepIdx]: answer }));
  };

  const handleReveal = (stepIdx: number) => {
    setRevealedSteps(prev => new Set(prev).add(stepIdx));
  };

  const handleNext = () => {
    if (selectedProcedure && currentStep < selectedProcedure.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!selectedProcedure) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-2">Guided Lab Procedures</h3>
        <p className="text-sm text-gray-500 mb-5">Follow step-by-step experiments with questions to test your understanding.</p>
        <div className="space-y-3">
          {PROCEDURES.map(proc => (
            <button
              key={proc.id}
              onClick={() => handleSelectProcedure(proc)}
              className="w-full p-4 rounded-xl bg-gray-50 hover:bg-teal-50 transition text-left group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{proc.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800 group-hover:text-teal-700">{proc.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      proc.subject === 'physics' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {proc.subject}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{proc.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{proc.steps.length} steps</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (completed) {
    const questionsAnswered = Object.keys(answers).length;
    const totalQuestions = selectedProcedure.steps.filter(s => s.question).length;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center py-6">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Lab Complete!</h3>
          <p className="text-gray-600 mb-1">{selectedProcedure.title}</p>
          <p className="text-sm text-gray-500 mb-6">
            You answered {questionsAnswered} of {totalQuestions} questions
          </p>
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6 text-left">
            <p className="font-medium text-teal-800 text-sm mb-1">Learning Objective</p>
            <p className="text-sm text-teal-700">{selectedProcedure.learningObjective}</p>
          </div>
          <button
            onClick={() => { setSelectedProcedure(null); setCompleted(false); }}
            className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition"
          >
            Try Another Lab
          </button>
        </div>
      </div>
    );
  }

  const step = selectedProcedure.steps[currentStep];
  const isRevealed = revealedSteps.has(currentStep);
  const hasAnswer = answers[currentStep] !== undefined;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setSelectedProcedure(null)}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Labs
        </button>
        <span className="text-xs text-gray-400">
          Step {currentStep + 1} of {selectedProcedure.steps.length}
        </span>
      </div>

      <h3 className="font-semibold text-gray-800 mb-1">{selectedProcedure.title}</h3>

      {/* Progress bar */}
      <div className="flex gap-1 mb-5">
        {selectedProcedure.steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition ${
              idx < currentStep ? 'bg-teal-500' : idx === currentStep ? 'bg-teal-400' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="space-y-4">
        {/* Instruction */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">📋</span>
            <div>
              <p className="text-sm font-medium text-blue-800">{step.instruction}</p>
              {step.parameterHint && (
                <p className="text-xs text-blue-600 mt-1 font-mono bg-blue-100 px-2 py-0.5 rounded inline-block">
                  {step.parameterHint}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Question */}
        {step.question && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-medium text-amber-800 mb-3">❓ {step.question}</p>
            {!hasAnswer ? (
              <input
                type="text"
                placeholder="Type your answer..."
                className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                    handleAnswer(currentStep, (e.target as HTMLInputElement).value.trim());
                  }
                }}
              />
            ) : (
              <div>
                <p className="text-sm text-gray-700 mb-2">
                  Your answer: <span className="font-medium">{answers[currentStep]}</span>
                </p>
                {!isRevealed ? (
                  <button
                    onClick={() => handleReveal(currentStep)}
                    className="text-sm px-3 py-1.5 bg-amber-200 text-amber-800 rounded-lg hover:bg-amber-300 transition"
                  >
                    Reveal Explanation
                  </button>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-green-800">{step.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="px-5 py-2 text-sm bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition"
        >
          {currentStep === selectedProcedure.steps.length - 1 ? 'Finish Lab' : 'Next Step →'}
        </button>
      </div>
    </div>
  );
}
