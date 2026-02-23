'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
  initialX?: number;
  initialY?: number;
  initialVx?: number;
  initialVy?: number;
}

interface SimulationState {
  balls: Ball[];
  gravity: number;
  friction: number;
  elasticity: number;
  isRunning: boolean;
  time: number;
}

interface ProjectileMetrics {
  maxHeight: number;
  range: number;
  timeOfFlight: number;
  angle: number;
  initialSpeed: number;
}

const PRESETS = {
  freefall: {
    name: 'Free Fall',
    icon: '🍎',
    description: 'Observe how gravity affects falling objects',
    balls: [{ x: 300, y: 50, vx: 0, vy: 0, radius: 20, mass: 1, color: '#ef4444' }],
    gravity: 0.3,
    friction: 0.999,
    elasticity: 0.8,
  },
  collision: {
    name: 'Elastic Collision',
    icon: '💥',
    description: 'Watch momentum transfer between objects',
    balls: [
      { x: 80, y: 200, vx: 4, vy: 0, radius: 25, mass: 2, color: '#3b82f6' },
      { x: 520, y: 200, vx: -2, vy: 0, radius: 25, mass: 1, color: '#10b981' },
    ],
    gravity: 0,
    friction: 1,
    elasticity: 1,
  },
  pendulum: {
    name: 'Bouncing Balls',
    icon: '⚪',
    description: 'Multiple balls with gravity and collisions',
    balls: [
      { x: 150, y: 80, vx: 2, vy: 0, radius: 18, mass: 1, color: '#f59e0b' },
      { x: 300, y: 100, vx: -1, vy: 1, radius: 22, mass: 1.5, color: '#8b5cf6' },
      { x: 450, y: 60, vx: 0, vy: 0, radius: 16, mass: 1, color: '#ec4899' },
    ],
    gravity: 0.2,
    friction: 0.998,
    elasticity: 0.85,
  },
  projectile: {
    name: 'Projectile Motion',
    icon: '🎯',
    description: 'Launch an object at an angle',
    balls: [{ x: 50, y: 350, vx: 6, vy: -8, radius: 12, mass: 1, color: '#06b6d4' }],
    gravity: 0.2,
    friction: 1,
    elasticity: 0,
  },
};

export default function VirtualLabDemo() {
  const trackInteraction = useTrackInteraction();
  const [simulation, setSimulation] = useState<SimulationState>({
    balls: [],
    gravity: 0.3,
    friction: 0.999,
    elasticity: 0.8,
    isRunning: false,
    time: 0,
  });
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PRESETS>('freefall');
  const [showVectors, setShowVectors] = useState(true);
  const [showTrails, setShowTrails] = useState(false);
  const [trails, setTrails] = useState<{ x: number; y: number; color: string }[]>([]);
  const [projectileMetrics, setProjectileMetrics] = useState<ProjectileMetrics | null>(null);
  const frameRef = useRef<number>(0);

  const canvasWidth = 600;
  const canvasHeight = 400;

  const loadPreset = useCallback((presetKey: keyof typeof PRESETS) => {
    const preset = PRESETS[presetKey];
    const balls = preset.balls.map(b => ({
      ...b,
      initialX: b.x,
      initialY: b.y,
      initialVx: b.vx,
      initialVy: b.vy,
    }));

    setSimulation({
      balls: JSON.parse(JSON.stringify(balls)),
      gravity: preset.gravity,
      friction: preset.friction,
      elasticity: preset.elasticity,
      isRunning: false,
      time: 0,
    });
    setTrails([]);
    setSelectedPreset(presetKey);
    trackInteraction('click', 'load_preset', { preset: presetKey, name: preset.name });

    // Calculate projectile metrics
    if (presetKey === 'projectile') {
      const ball = preset.balls[0];
      const g = preset.gravity * 60; // Scale for display
      const v0 = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy) * 60;
      const angle = Math.atan2(-ball.vy, ball.vx) * (180 / Math.PI);
      const angleRad = angle * (Math.PI / 180);
      const vy0 = v0 * Math.sin(angleRad);
      const vx0 = v0 * Math.cos(angleRad);

      const maxHeight = (vy0 * vy0) / (2 * g);
      const timeOfFlight = (2 * vy0) / g;
      const range = vx0 * timeOfFlight;

      setProjectileMetrics({
        maxHeight: Math.round(maxHeight),
        range: Math.round(range),
        timeOfFlight: (timeOfFlight / 60).toFixed(2) as unknown as number,
        angle: Math.round(angle),
        initialSpeed: Math.round(v0),
      });
    } else {
      setProjectileMetrics(null);
    }
  }, []);

  useEffect(() => {
    loadPreset('freefall');
  }, [loadPreset]);

  useEffect(() => {
    if (!simulation.isRunning) return;

    const animate = () => {
      setSimulation((prev) => {
        const newBalls = prev.balls.map((ball) => {
          let newVx = ball.vx;
          let newVy = ball.vy + prev.gravity;
          let newX = ball.x + newVx;
          let newY = ball.y + newVy;

          // For projectile, stop when it lands
          if (selectedPreset === 'projectile') {
            if (newY + ball.radius >= canvasHeight) {
              newY = canvasHeight - ball.radius;
              newVx = 0;
              newVy = 0;
              return { ...ball, x: newX, y: newY, vx: 0, vy: 0 };
            }
            // No wall bouncing for projectile
            if (newX - ball.radius < 0 || newX + ball.radius > canvasWidth) {
              return { ...ball, x: Math.max(ball.radius, Math.min(canvasWidth - ball.radius, newX)), y: newY, vx: newVx, vy: newVy };
            }
            return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
          }

          // Wall collisions for other modes
          if (newX - ball.radius < 0) {
            newX = ball.radius;
            newVx = Math.abs(newVx) * prev.elasticity;
          }
          if (newX + ball.radius > canvasWidth) {
            newX = canvasWidth - ball.radius;
            newVx = -Math.abs(newVx) * prev.elasticity;
          }
          if (newY - ball.radius < 0) {
            newY = ball.radius;
            newVy = Math.abs(newVy) * prev.elasticity;
          }
          if (newY + ball.radius > canvasHeight) {
            newY = canvasHeight - ball.radius;
            newVy = -Math.abs(newVy) * prev.elasticity;
            // Stop if velocity is very small
            if (Math.abs(newVy) < 0.5) {
              newVy = 0;
            }
          }

          // Apply friction
          newVx *= prev.friction;
          newVy *= prev.friction;

          return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
        });

        // Ball-to-ball collisions (only for multi-ball simulations)
        if (newBalls.length > 1) {
          for (let i = 0; i < newBalls.length; i++) {
            for (let j = i + 1; j < newBalls.length; j++) {
              const b1 = newBalls[i];
              const b2 = newBalls[j];
              const dx = b2.x - b1.x;
              const dy = b2.y - b1.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const minDist = b1.radius + b2.radius;

              if (dist < minDist && dist > 0) {
                // Normalize collision vector
                const nx = dx / dist;
                const ny = dy / dist;

                // Relative velocity
                const dvx = b1.vx - b2.vx;
                const dvy = b1.vy - b2.vy;
                const dvn = dvx * nx + dvy * ny;

                // Only resolve if objects are moving toward each other
                if (dvn > 0) {
                  const restitution = prev.elasticity;
                  const m1 = b1.mass;
                  const m2 = b2.mass;

                  // Calculate impulse
                  const impulse = (2 * dvn) / (m1 + m2);

                  // Apply impulse
                  newBalls[i].vx -= impulse * m2 * nx * restitution;
                  newBalls[i].vy -= impulse * m2 * ny * restitution;
                  newBalls[j].vx += impulse * m1 * nx * restitution;
                  newBalls[j].vy += impulse * m1 * ny * restitution;

                  // Separate overlapping balls
                  const overlap = (minDist - dist) / 2;
                  newBalls[i].x -= overlap * nx;
                  newBalls[i].y -= overlap * ny;
                  newBalls[j].x += overlap * nx;
                  newBalls[j].y += overlap * ny;
                }
              }
            }
          }
        }

        return { ...prev, balls: newBalls, time: prev.time + 1 };
      });

      // Update trails
      if (showTrails) {
        setTrails((prev) => {
          const newTrails = [
            ...prev,
            ...simulation.balls.map((b) => ({ x: b.x, y: b.y, color: b.color })),
          ];
          return newTrails.slice(-300);
        });
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [simulation.isRunning, showTrails, selectedPreset]);

  const toggleSimulation = () => {
    setSimulation((prev) => {
      trackInteraction('click', prev.isRunning ? 'pause_simulation' : 'play_simulation', { preset: selectedPreset });
      return { ...prev, isRunning: !prev.isRunning };
    });
  };

  const resetSimulation = () => {
    trackInteraction('click', 'reset_simulation', { preset: selectedPreset });
    loadPreset(selectedPreset);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-teal-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
            Interactive Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Virtual Physics Lab
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore physics concepts through interactive simulations. Adjust parameters and observe how objects behave.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Presets */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Experiments</h3>
              <div className="space-y-2">
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => loadPreset(key as keyof typeof PRESETS)}
                    className={`w-full p-3 rounded-xl text-left transition ${
                      selectedPreset === key
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{preset.icon}</span>
                      <div>
                        <p className="font-medium">{preset.name}</p>
                        <p className={`text-xs ${selectedPreset === key ? 'text-teal-100' : 'text-gray-500'}`}>
                          {preset.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Parameters */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Parameters</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Gravity</span>
                    <span>{simulation.gravity.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.6"
                    step="0.02"
                    value={simulation.gravity}
                    onChange={(e) =>
                      setSimulation((prev) => ({ ...prev, gravity: parseFloat(e.target.value) }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Elasticity (Bounciness)</span>
                    <span>{(simulation.elasticity * 100).toFixed(0)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={simulation.elasticity}
                    onChange={(e) =>
                      setSimulation((prev) => ({ ...prev, elasticity: parseFloat(e.target.value) }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="mt-4 space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showVectors}
                    onChange={(e) => setShowVectors(e.target.checked)}
                    className="rounded accent-teal-600"
                  />
                  Show Velocity Vectors
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTrails}
                    onChange={(e) => {
                      setShowTrails(e.target.checked);
                      if (!e.target.checked) setTrails([]);
                    }}
                    className="rounded accent-teal-600"
                  />
                  Show Motion Trails
                </label>
              </div>
            </div>

            {/* Projectile Metrics */}
            {selectedPreset === 'projectile' && projectileMetrics && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Projectile Analysis</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-2 bg-cyan-50 rounded-lg">
                    <span className="text-gray-600">Launch Angle (θ)</span>
                    <span className="font-semibold text-cyan-700">{projectileMetrics.angle}°</span>
                  </div>
                  <div className="flex justify-between p-2 bg-cyan-50 rounded-lg">
                    <span className="text-gray-600">Initial Speed (v₀)</span>
                    <span className="font-semibold text-cyan-700">{projectileMetrics.initialSpeed} m/s</span>
                  </div>
                  <div className="flex justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-gray-600">Max Height (H)</span>
                    <span className="font-semibold text-green-700">{projectileMetrics.maxHeight} m</span>
                  </div>
                  <div className="flex justify-between p-2 bg-blue-50 rounded-lg">
                    <span className="text-gray-600">Range (R)</span>
                    <span className="font-semibold text-blue-700">{projectileMetrics.range} m</span>
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                    <p className="font-medium mb-1">Formulas:</p>
                    <p>H = v₀²sin²θ / 2g</p>
                    <p>R = v₀²sin(2θ) / g</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Simulation Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Simulation</h3>
                <div className="flex gap-2">
                  <button
                    onClick={toggleSimulation}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      simulation.isRunning
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {simulation.isRunning ? '⏸️ Pause' : '▶️ Play'}
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>

              {/* Canvas */}
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden">
                <svg width={canvasWidth} height={canvasHeight} className="w-full h-auto">
                  {/* Grid */}
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#374151" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Ground line for projectile */}
                  {selectedPreset === 'projectile' && (
                    <line
                      x1="0"
                      y1={canvasHeight - 1}
                      x2={canvasWidth}
                      y2={canvasHeight - 1}
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  )}

                  {/* Trails */}
                  {showTrails &&
                    trails.map((trail, idx) => (
                      <circle
                        key={idx}
                        cx={trail.x}
                        cy={trail.y}
                        r={2}
                        fill={trail.color}
                        opacity={0.2 + (idx / trails.length) * 0.6}
                      />
                    ))}

                  {/* Balls */}
                  {simulation.balls.map((ball, idx) => (
                    <g key={idx}>
                      {/* Ball shadow */}
                      <ellipse
                        cx={ball.x + 2}
                        cy={ball.y + 4}
                        rx={ball.radius}
                        ry={ball.radius * 0.3}
                        fill="rgba(0,0,0,0.2)"
                      />
                      {/* Ball */}
                      <circle
                        cx={ball.x}
                        cy={ball.y}
                        r={ball.radius}
                        fill={ball.color}
                        stroke="white"
                        strokeWidth="2"
                      />
                      {/* Velocity vector */}
                      {showVectors && (Math.abs(ball.vx) > 0.1 || Math.abs(ball.vy) > 0.1) && (
                        <>
                          <line
                            x1={ball.x}
                            y1={ball.y}
                            x2={ball.x + ball.vx * 8}
                            y2={ball.y + ball.vy * 8}
                            stroke="#22c55e"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <circle
                            cx={ball.x + ball.vx * 8}
                            cy={ball.y + ball.vy * 8}
                            r={4}
                            fill="#22c55e"
                          />
                        </>
                      )}
                      {/* Mass label */}
                      <text
                        x={ball.x}
                        y={ball.y + 4}
                        textAnchor="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {ball.mass}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur rounded-lg p-3 text-white text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-white border border-gray-400"></div>
                    <span>Ball (number = mass)</span>
                  </div>
                  {showVectors && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-green-500"></div>
                      <span>Velocity vector</span>
                    </div>
                  )}
                </div>

                {/* Time display */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur rounded-lg px-3 py-1 text-white text-xs">
                  t = {(simulation.time / 60).toFixed(1)}s
                </div>
              </div>

              {/* Data Panel */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                {simulation.balls.map((ball, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: ball.color }}
                      ></div>
                      <span className="font-medium text-sm">Ball {idx + 1}</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Position: ({ball.x.toFixed(0)}, {(canvasHeight - ball.y).toFixed(0)})</p>
                      <p>Velocity: ({ball.vx.toFixed(1)}, {(-ball.vy).toFixed(1)})</p>
                      <p>Speed: {Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy).toFixed(1)} m/s</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Concepts */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Physics Concepts Demonstrated</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '🍎', title: 'Gravity', desc: 'Constant downward acceleration' },
              { icon: '💥', title: 'Collisions', desc: 'Elastic momentum transfer' },
              { icon: '🔄', title: 'Momentum', desc: 'Conservation in collisions' },
              { icon: '📐', title: 'Projectile Motion', desc: 'Parabolic trajectories' },
            ].map((concept, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-gray-50">
                <span className="text-2xl">{concept.icon}</span>
                <h4 className="font-medium text-gray-800 mt-2">{concept.title}</h4>
                <p className="text-sm text-gray-500">{concept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
