'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface ChemistryState {
  temperature: number; // Kelvin
  pressure: number; // computed from collisions
  volume: number; // container width as fraction 0.3-1.0
  moles: number; // number of particles / scale factor
  isRunning: boolean;
  time: number;
}

const PARTICLE_SCALE = 10; // 1 mole = 10 particles for display
const BASE_SPEED = 2;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const WALL_THICKNESS = 4;

function generateParticles(count: number, containerRight: number): Particle[] {
  const particles: Particle[] = [];
  const usableWidth = containerRight - 40;
  const usableHeight = CANVAS_HEIGHT - 80;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = BASE_SPEED * (0.5 + Math.random());
    particles.push({
      x: 30 + Math.random() * usableWidth,
      y: 40 + Math.random() * usableHeight,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 5,
      color: i % 3 === 0 ? '#60a5fa' : i % 3 === 1 ? '#34d399' : '#f472b6',
    });
  }
  return particles;
}

export interface ChemistryLabRef {
  getContext: () => string;
}

export default function ChemistryLab({ onContextChange, compact }: { onContextChange?: (ctx: string) => void; compact?: boolean }) {
  const [state, setState] = useState<ChemistryState>({
    temperature: 300,
    pressure: 0,
    volume: 0.7,
    moles: 3,
    isRunning: false,
    time: 0,
  });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [wallHits, setWallHits] = useState(0);
  const [measuredPressure, setMeasuredPressure] = useState(0);
  const frameRef = useRef<number>(0);
  const wallHitsRef = useRef(0);
  const pressureIntervalRef = useRef<ReturnType<typeof setInterval>>();

  const containerRight = 20 + (CANVAS_WIDTH - 40) * state.volume;
  const containerRightRef = useRef(containerRight);
  containerRightRef.current = containerRight;

  const temperatureRef = useRef(state.temperature);
  temperatureRef.current = state.temperature;

  // Initialize particles
  const initParticles = useCallback((moles: number, vol: number) => {
    const count = Math.round(moles * PARTICLE_SCALE);
    const right = 20 + (CANVAS_WIDTH - 40) * vol;
    setParticles(generateParticles(count, right));
    wallHitsRef.current = 0;
    setWallHits(0);
    setMeasuredPressure(0);
  }, []);

  useEffect(() => {
    initParticles(state.moles, state.volume);
  }, []);

  // Measure pressure every second from wall hits
  useEffect(() => {
    if (state.isRunning) {
      pressureIntervalRef.current = setInterval(() => {
        const p = wallHitsRef.current;
        setMeasuredPressure(p);
        wallHitsRef.current = 0;
      }, 1000);
    }
    return () => {
      if (pressureIntervalRef.current) clearInterval(pressureIntervalRef.current);
    };
  }, [state.isRunning]);

  // Animation loop
  useEffect(() => {
    if (!state.isRunning) return;

    const animate = () => {
      const speedScale = Math.sqrt(temperatureRef.current / 300);
      const right = containerRightRef.current;

      setParticles(prev => {
        let hits = 0;
        const updated = prev.map(p => {
          let { x, y, vx, vy } = p;

          // Scale velocity by temperature
          const currentSpeed = Math.sqrt(vx * vx + vy * vy);
          const targetSpeed = BASE_SPEED * speedScale * (0.5 + Math.random() * 0.3);
          if (currentSpeed > 0) {
            const factor = 0.98 + 0.02 * (targetSpeed / currentSpeed);
            vx *= factor;
            vy *= factor;
          }

          x += vx;
          y += vy;

          // Wall collisions - left
          if (x - p.radius < 20) {
            x = 20 + p.radius;
            vx = Math.abs(vx);
            hits++;
          }
          // Wall collisions - right (movable piston)
          if (x + p.radius > right) {
            x = right - p.radius;
            vx = -Math.abs(vx);
            hits++;
          }
          // Wall collisions - top
          if (y - p.radius < 30) {
            y = 30 + p.radius;
            vy = Math.abs(vy);
            hits++;
          }
          // Wall collisions - bottom
          if (y + p.radius > CANVAS_HEIGHT - 30) {
            y = CANVAS_HEIGHT - 30 - p.radius;
            vy = -Math.abs(vy);
            hits++;
          }

          return { ...p, x, y, vx, vy };
        });

        wallHitsRef.current += hits;
        return updated;
      });

      setState(prev => ({ ...prev, time: prev.time + 1 }));
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [state.isRunning]);

  // Report context changes for AI assistant
  useEffect(() => {
    if (onContextChange) {
      const idealPressure = ((state.moles * state.temperature) / (state.volume * 300)).toFixed(2);
      onContextChange(
        `Chemistry Lab - Ideal Gas Law (PV=nRT). Temperature: ${state.temperature}K, ` +
        `Volume: ${(state.volume * 100).toFixed(0)}%, Moles: ${state.moles}, ` +
        `Measured Pressure (wall hits/s): ${measuredPressure}, ` +
        `Ideal Pressure ratio: ${idealPressure}. ` +
        `Simulation ${state.isRunning ? 'running' : 'paused'}.`
      );
    }
  }, [state.temperature, state.volume, state.moles, measuredPressure, state.isRunning, onContextChange]);

  const handleMolesChange = (newMoles: number) => {
    setState(prev => ({ ...prev, moles: newMoles }));
    initParticles(newMoles, state.volume);
  };

  const handleVolumeChange = (newVolume: number) => {
    setState(prev => ({ ...prev, volume: newVolume }));
    // Reposition particles that are outside new container
    const newRight = 20 + (CANVAS_WIDTH - 40) * newVolume;
    setParticles(prev =>
      prev.map(p => ({
        ...p,
        x: Math.min(p.x, newRight - p.radius - 2),
      }))
    );
  };

  const idealPressureRatio = (state.moles * state.temperature) / (state.volume * 300);

  return (
    <div>
      <div className={`grid gap-6 ${compact ? 'xl:grid-cols-3 grid-cols-1' : 'lg:grid-cols-3'}`}>
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Gas Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Temperature (T)</span>
                  <span>{state.temperature} K</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="10"
                  value={state.temperature}
                  onChange={(e) => setState(prev => ({ ...prev, temperature: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>100 K</span>
                  <span>800 K</span>
                </div>
              </div>

              <div>
                <label className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Volume (V)</span>
                  <span>{(state.volume * 100).toFixed(0)}%</span>
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.05"
                  value={state.volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>30%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Amount (n)</span>
                  <span>{state.moles} mol</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={state.moles}
                  onChange={(e) => handleMolesChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 mol</span>
                  <span>8 mol</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ideal Gas Law display */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Ideal Gas Law</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center mb-4">
              <p className="text-2xl font-bold text-amber-800">PV = nRT</p>
              <p className="text-xs text-amber-600 mt-1">Pressure x Volume = Moles x Gas Constant x Temperature</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-red-50 rounded-lg">
                <span className="text-gray-600">Predicted P ratio</span>
                <span className="font-semibold text-red-700">{idealPressureRatio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-blue-50 rounded-lg">
                <span className="text-gray-600">Measured P (hits/s)</span>
                <span className="font-semibold text-blue-700">{measuredPressure}</span>
              </div>
              <div className="flex justify-between p-2 bg-green-50 rounded-lg">
                <span className="text-gray-600">Particles</span>
                <span className="font-semibold text-green-700">{particles.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Canvas */}
        <div className={compact ? 'xl:col-span-2' : 'lg:col-span-2'}>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Gas Container</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setState(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    state.isRunning
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {state.isRunning ? '⏸️ Pause' : '▶️ Play'}
                </button>
                <button
                  onClick={() => {
                    setState(prev => ({ ...prev, isRunning: false, time: 0 }));
                    initParticles(state.moles, state.volume);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden">
              <svg viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} className="w-full h-auto">
                {/* Container walls */}
                <rect
                  x={20}
                  y={30}
                  width={containerRight - 20}
                  height={CANVAS_HEIGHT - 60}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth={WALL_THICKNESS}
                  rx={4}
                />

                {/* Piston (right wall) */}
                <rect
                  x={containerRight - 8}
                  y={26}
                  width={16}
                  height={CANVAS_HEIGHT - 52}
                  fill="#94a3b8"
                  rx={3}
                />
                <rect
                  x={containerRight - 4}
                  y={30}
                  width={8}
                  height={CANVAS_HEIGHT - 60}
                  fill="#cbd5e1"
                  rx={2}
                />
                {/* Piston handle lines */}
                {[0.3, 0.5, 0.7].map((f, i) => (
                  <line
                    key={i}
                    x1={containerRight - 3}
                    y1={30 + (CANVAS_HEIGHT - 60) * f - 5}
                    x2={containerRight + 3}
                    y2={30 + (CANVAS_HEIGHT - 60) * f - 5}
                    stroke="#64748b"
                    strokeWidth={1}
                  />
                ))}

                {/* Particles */}
                {particles.map((p, idx) => (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r={p.radius} fill={p.color} opacity={0.85} />
                    {/* Speed indicator - glow for fast particles */}
                    {state.isRunning && Math.sqrt(p.vx * p.vx + p.vy * p.vy) > BASE_SPEED * 1.2 && (
                      <circle cx={p.x} cy={p.y} r={p.radius + 3} fill={p.color} opacity={0.2} />
                    )}
                  </g>
                ))}

                {/* Labels */}
                <text x={CANVAS_WIDTH / 2} y={18} textAnchor="middle" fill="#94a3b8" fontSize="12">
                  Gas Container — Ideal Gas Law Simulation
                </text>
              </svg>

              {/* Temperature indicator */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur rounded-lg px-3 py-1 text-white text-xs">
                T = {state.temperature} K
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur rounded-lg p-3 text-white text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                  <span>Gas particles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-slate-400 rounded-sm"></div>
                  <span>Movable piston</span>
                </div>
              </div>
            </div>

            {/* Relationship hints */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 bg-red-50 rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">T up, V fixed</p>
                <p className="text-sm font-semibold text-red-700">P increases</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">V down, T fixed</p>
                <p className="text-sm font-semibold text-blue-700">P increases</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">n up, V &amp; T fixed</p>
                <p className="text-sm font-semibold text-green-700">P increases</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Concepts */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Chemistry Concepts Demonstrated</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { icon: '🌡️', title: 'Temperature', desc: 'Kinetic energy of gas particles' },
            { icon: '📦', title: 'Volume', desc: 'Container size affects pressure' },
            { icon: '💨', title: 'Pressure', desc: 'Force from particle-wall collisions' },
            { icon: '⚖️', title: 'Gas Law', desc: 'PV = nRT relationship' },
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
  );
}
