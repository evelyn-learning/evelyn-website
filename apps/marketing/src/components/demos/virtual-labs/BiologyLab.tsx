'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Lotka-Volterra predator-prey simulation

interface Organism {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'prey' | 'predator';
  energy: number;
}

interface PopulationSnapshot {
  time: number;
  prey: number;
  predators: number;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const GRAPH_HEIGHT = 120;

export default function BiologyLab({
  onContextChange,
  compact,
}: {
  onContextChange?: (ctx: string) => void;
  compact?: boolean;
}) {
  const [organisms, setOrganisms] = useState<Organism[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [history, setHistory] = useState<PopulationSnapshot[]>([]);

  // Parameters
  const [preyBirthRate, setPreyBirthRate] = useState(0.025);
  const [preyDeathRate, setPreyDeathRate] = useState(0.002);
  const [predatorDeathRate, setPredatorDeathRate] = useState(0.008);
  const [initialPrey, setInitialPrey] = useState(50);
  const [initialPredators, setInitialPredators] = useState(10);

  const frameRef = useRef<number>(0);
  const organismsRef = useRef(organisms);
  organismsRef.current = organisms;
  const paramsRef = useRef({ preyBirthRate, preyDeathRate, predatorDeathRate });
  paramsRef.current = { preyBirthRate, preyDeathRate, predatorDeathRate };

  const spawn = useCallback((count: number, type: 'prey' | 'predator'): Organism[] => {
    return Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1;
      return {
        x: 20 + Math.random() * (CANVAS_WIDTH - 40),
        y: 20 + Math.random() * (CANVAS_HEIGHT - 40),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type,
        energy: type === 'predator' ? 300 : 100,
      };
    });
  }, []);

  const initSimulation = useCallback(() => {
    const prey = spawn(initialPrey, 'prey');
    const predators = spawn(initialPredators, 'predator');
    setOrganisms([...prey, ...predators]);
    setHistory([{ time: 0, prey: initialPrey, predators: initialPredators }]);
    setTime(0);
    setIsRunning(false);
  }, [initialPrey, initialPredators, spawn]);

  useEffect(() => {
    initSimulation();
  }, []);

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return;

    let frameCount = 0;

    const animate = () => {
      frameCount++;

      // Population logic every 20th frame (~3 ticks/sec at 60fps)
      // This makes slider values intuitive: 0.01 = ~1% chance per tick, ~3% per second
      const populationTick = frameCount % 20 === 0;

      setOrganisms(prev => {
        const updated: Organism[] = [];
        const toAdd: Organism[] = [];
        const { preyBirthRate: birthRate, preyDeathRate: preyDeath, predatorDeathRate: deathRate } = paramsRef.current;

        // Pre-count populations for this tick (avoids O(n²) filtering in loop)
        let preyCount = 0;
        let predatorCount = 0;
        for (const o of prev) {
          if (o.type === 'prey') preyCount++;
          else predatorCount++;
        }

        for (const org of prev) {
          let { x, y, vx, vy, energy } = org;

          // Random direction change
          if (Math.random() < 0.05) {
            const angle = Math.random() * Math.PI * 2;
            const speed = org.type === 'predator' ? 1.5 : 1;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
          }

          // Predators chase nearest prey
          if (org.type === 'predator') {
            let minDist = Infinity;
            let nearestPrey: Organism | null = null;
            for (const other of prev) {
              if (other.type !== 'prey') continue;
              const dist = Math.sqrt((other.x - x) ** 2 + (other.y - y) ** 2);
              if (dist < minDist && dist < 100) {
                minDist = dist;
                nearestPrey = other;
              }
            }
            if (nearestPrey) {
              const dx = nearestPrey.x - x;
              const dy = nearestPrey.y - y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > 0) {
                vx = (dx / dist) * 1.8;
                vy = (dy / dist) * 1.8;
              }
            }
          }

          // Prey flees from nearest predator
          if (org.type === 'prey') {
            for (const other of prev) {
              if (other.type !== 'predator') continue;
              const dist = Math.sqrt((other.x - x) ** 2 + (other.y - y) ** 2);
              if (dist < 60) {
                const dx = x - other.x;
                const dy = y - other.y;
                const d = Math.sqrt(dx * dx + dy * dy) || 1;
                vx = (dx / d) * 1.5;
                vy = (dy / d) * 1.5;
                break;
              }
            }
          }

          x += vx;
          y += vy;

          // Wrap edges
          if (x < 5) x = CANVAS_WIDTH - 5;
          if (x > CANVAS_WIDTH - 5) x = 5;
          if (y < 5) y = CANVAS_HEIGHT - 5;
          if (y > CANVAS_HEIGHT - 5) y = 5;

          // Energy drain — predators drain slowly, hunger builds over time
          energy -= org.type === 'predator' ? 0.15 : 0.03;

          // Predator eats prey — spatial check every frame (this IS the predation interaction)
          if (org.type === 'predator') {
            for (let i = updated.length - 1; i >= 0; i--) {
              if (updated[i].type === 'prey') {
                const dist = Math.sqrt((updated[i].x - x) ** 2 + (updated[i].y - y) ** 2);
                if (dist < 14) {
                  updated.splice(i, 1);
                  preyCount--;
                  energy += 100;
                  break;
                }
              }
            }
          }

          // Energy death — always checked
          if (energy <= 0) {
            if (org.type === 'prey') preyCount--;
            else predatorCount--;
            continue;
          }

          // Population dynamics — birth/death rates on population ticks only
          if (populationTick) {
            // Random death (disease, old age, environmental)
            if (org.type === 'predator' && Math.random() < deathRate) {
              predatorCount--;
              continue;
            }
            if (org.type === 'prey' && Math.random() < preyDeath) {
              preyCount--;
              continue;
            }

            // Prey reproduction — density-dependent (harder to breed when crowded)
            const preyDensityFactor = 1 - (preyCount / 150);
            if (org.type === 'prey' && Math.random() < birthRate * Math.max(0, preyDensityFactor) && preyCount < 150) {
              toAdd.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                type: 'prey',
                energy: 80,
              });
              preyCount++;
            }

            // Predator reproduction — need to be well-fed (must eat 2+ prey)
            if (org.type === 'predator' && energy > 400 && Math.random() < 0.03 && predatorCount < 50) {
              energy -= 180;
              toAdd.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                type: 'predator',
                energy: 200,
              });
              predatorCount++;
            }
          }

          updated.push({ ...org, x, y, vx, vy, energy });
        }

        return [...updated, ...toAdd];
      });

      setTime(prev => prev + 1);

      // Record history every 30 frames (~0.5s)
      if (frameCount % 30 === 0) {
        setOrganisms(current => {
          const prey = current.filter(o => o.type === 'prey').length;
          const predators = current.filter(o => o.type === 'predator').length;
          setHistory(prev => {
            const updated = [...prev, { time: frameCount, prey, predators }];
            return updated.slice(-100); // Keep last 100 snapshots
          });
          return current;
        });
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [isRunning]);

  // Report context
  useEffect(() => {
    if (onContextChange) {
      const prey = organisms.filter(o => o.type === 'prey').length;
      const predators = organisms.filter(o => o.type === 'predator').length;
      onContextChange(
        `Biology Lab - Predator-Prey Ecosystem (Lotka-Volterra). ` +
        `Prey: ${prey}, Predators: ${predators}. ` +
        `Prey birth rate: ${preyBirthRate}, Prey death rate: ${preyDeathRate}, Predator death rate: ${predatorDeathRate}. ` +
        `Time: ${(time / 60).toFixed(1)}s. ${isRunning ? 'Running' : 'Paused'}.`
      );
    }
  }, [organisms.length, preyBirthRate, preyDeathRate, predatorDeathRate, time, isRunning, onContextChange]);

  const preyCount = organisms.filter(o => o.type === 'prey').length;
  const predatorCount = organisms.filter(o => o.type === 'predator').length;

  // Population graph
  const maxPop = Math.max(10, ...history.map(h => Math.max(h.prey, h.predators)));

  return (
    <div>
      <div className={`grid gap-6 ${compact ? 'xl:grid-cols-3 grid-cols-1' : 'lg:grid-cols-3'}`}>
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Ecosystem Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Initial Prey</span>
                  <span>{initialPrey}</span>
                </label>
                <input
                  type="range" min="10" max="80" step="5"
                  value={initialPrey}
                  onChange={(e) => setInitialPrey(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Initial Predators</span>
                  <span>{initialPredators}</span>
                </label>
                <input
                  type="range" min="2" max="30" step="1"
                  value={initialPredators}
                  onChange={(e) => setInitialPredators(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Prey Birth Rate</span>
                  <span>{preyBirthRate.toFixed(2)}</span>
                </label>
                <input
                  type="range" min="0.01" max="0.08" step="0.005"
                  value={preyBirthRate}
                  onChange={(e) => setPreyBirthRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Prey Death Rate</span>
                  <span>{preyDeathRate.toFixed(3)}</span>
                </label>
                <input
                  type="range" min="0" max="0.02" step="0.001"
                  value={preyDeathRate}
                  onChange={(e) => setPreyDeathRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Predator Death Rate</span>
                  <span>{predatorDeathRate.toFixed(2)}</span>
                </label>
                <input
                  type="range" min="0.005" max="0.05" step="0.005"
                  value={predatorDeathRate}
                  onChange={(e) => setPredatorDeathRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>
            </div>
          </div>

          {/* Live counts */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Population</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-green-700">{preyCount}</p>
                <p className="text-xs text-green-600">🐰 Prey</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-red-700">{predatorCount}</p>
                <p className="text-xs text-red-600">🐺 Predators</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-700 font-medium">Lotka-Volterra Equations:</p>
              <p className="text-xs text-amber-600 mt-1 font-mono">dx/dt = αx - βxy</p>
              <p className="text-xs text-amber-600 font-mono">dy/dt = δxy - γy</p>
            </div>
          </div>
        </div>

        {/* Simulation + Graph */}
        <div className={compact ? 'xl:col-span-2' : 'lg:col-span-2'}>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Ecosystem</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    isRunning
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {isRunning ? '⏸️ Pause' : '▶️ Play'}
                </button>
                <button
                  onClick={initSimulation}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Ecosystem canvas */}
            <div className="relative bg-gradient-to-br from-green-900 to-green-950 rounded-xl overflow-hidden">
              <svg viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} className="w-full h-auto">
                {/* Grass texture */}
                <defs>
                  <pattern id="grass" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="transparent" />
                    <circle cx="10" cy="15" r="1" fill="#166534" opacity="0.3" />
                    <circle cx="5" cy="8" r="0.8" fill="#166534" opacity="0.2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grass)" />

                {/* Organisms */}
                {organisms.map((org, idx) => (
                  <g key={idx}>
                    {org.type === 'prey' ? (
                      <>
                        <circle cx={org.x} cy={org.y} r={5} fill="#4ade80" />
                        <circle cx={org.x} cy={org.y} r={7} fill="#4ade80" opacity={0.2} />
                      </>
                    ) : (
                      <>
                        <circle cx={org.x} cy={org.y} r={7} fill="#ef4444" />
                        <circle cx={org.x} cy={org.y} r={10} fill="#ef4444" opacity={0.15} />
                      </>
                    )}
                  </g>
                ))}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur rounded-lg p-2.5 text-white text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span>Prey (rabbit)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Predator (wolf)</span>
                </div>
              </div>

              {/* Time */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur rounded-lg px-3 py-1 text-white text-xs">
                t = {(time / 60).toFixed(1)}s
              </div>
            </div>

            {/* Population graph */}
            <div className="mt-4 bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Population Over Time</h4>
              <svg viewBox={`0 0 ${CANVAS_WIDTH} ${GRAPH_HEIGHT}`} className="w-full h-auto">
                <rect width={CANVAS_WIDTH} height={GRAPH_HEIGHT} fill="white" rx="4" />

                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map(f => (
                  <line key={f} x1="0" y1={GRAPH_HEIGHT * f} x2={CANVAS_WIDTH} y2={GRAPH_HEIGHT * f} stroke="#e5e7eb" strokeWidth="0.5" />
                ))}

                {/* Prey line */}
                {history.length > 1 && (
                  <polyline
                    points={history.map((h, i) =>
                      `${(i / Math.max(history.length - 1, 1)) * CANVAS_WIDTH},${GRAPH_HEIGHT - (h.prey / maxPop) * (GRAPH_HEIGHT - 10)}`
                    ).join(' ')}
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2"
                  />
                )}

                {/* Predator line */}
                {history.length > 1 && (
                  <polyline
                    points={history.map((h, i) =>
                      `${(i / Math.max(history.length - 1, 1)) * CANVAS_WIDTH},${GRAPH_HEIGHT - (h.predators / maxPop) * (GRAPH_HEIGHT - 10)}`
                    ).join(' ')}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                )}

                {/* Labels */}
                <text x="5" y="12" fontSize="10" fill="#4ade80" fontWeight="bold">Prey</text>
                <text x="50" y="12" fontSize="10" fill="#ef4444" fontWeight="bold">Predators</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Concepts */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Ecology Concepts Demonstrated</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { icon: '🐰', title: 'Population Dynamics', desc: 'Prey populations grow and shrink cyclically' },
            { icon: '🐺', title: 'Predation', desc: 'Predators regulate prey populations' },
            { icon: '🔄', title: 'Boom-Bust Cycles', desc: 'Populations oscillate out of phase' },
            { icon: '⚖️', title: 'Ecosystem Balance', desc: 'Parameters determine stability' },
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
