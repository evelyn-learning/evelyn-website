'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';
import dynamic from 'next/dynamic';

const ChemistryLab = dynamic(() => import('./virtual-labs/ChemistryLab'), { ssr: false });
const BiologyLab = dynamic(() => import('./virtual-labs/BiologyLab'), { ssr: false });
const LabAssistant = dynamic(() => import('./virtual-labs/LabAssistant'), { ssr: false });
const GuidedLab = dynamic(() => import('./virtual-labs/GuidedLab'), { ssr: false });
const DataExport = dynamic(() => import('./virtual-labs/DataExport'), { ssr: false });
const Assessment = dynamic(() => import('./virtual-labs/Assessment'), { ssr: false });

// ============================================================================
// Types
// ============================================================================

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

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

type LabTab = 'physics' | 'chemistry' | 'biology';

interface DataPoint {
  time: number;
  balls: { x: number; y: number; vx: number; vy: number; speed: number; ke: number; pe: number }[];
}

// ============================================================================
// Constants
// ============================================================================

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

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
  newton_cradle: {
    name: "Newton's Cradle",
    icon: '⚖️',
    description: 'Chain of collisions transferring momentum',
    balls: [
      { x: 80, y: 200, vx: 5, vy: 0, radius: 18, mass: 1, color: '#ef4444' },
      { x: 250, y: 200, vx: 0, vy: 0, radius: 18, mass: 1, color: '#64748b' },
      { x: 290, y: 200, vx: 0, vy: 0, radius: 18, mass: 1, color: '#64748b' },
      { x: 330, y: 200, vx: 0, vy: 0, radius: 18, mass: 1, color: '#64748b' },
      { x: 370, y: 200, vx: 0, vy: 0, radius: 18, mass: 1, color: '#3b82f6' },
    ],
    gravity: 0,
    friction: 1,
    elasticity: 1,
  },
  mass_comparison: {
    name: 'Mass Comparison',
    icon: '⚖️',
    description: 'Heavy vs light objects under gravity',
    balls: [
      { x: 200, y: 50, vx: 0, vy: 0, radius: 28, mass: 5, color: '#1e40af' },
      { x: 400, y: 50, vx: 0, vy: 0, radius: 14, mass: 1, color: '#f59e0b' },
    ],
    gravity: 0.25,
    friction: 0.999,
    elasticity: 0.7,
  },
  orbital: {
    name: 'Orbiting Bodies',
    icon: '🪐',
    description: 'Multiple bodies in circular-like motion',
    balls: [
      { x: 300, y: 100, vx: 3, vy: 0, radius: 12, mass: 0.5, color: '#22d3ee' },
      { x: 300, y: 300, vx: -3, vy: 0, radius: 12, mass: 0.5, color: '#f472b6' },
      { x: 100, y: 200, vx: 0, vy: 3, radius: 12, mass: 0.5, color: '#a3e635' },
      { x: 500, y: 200, vx: 0, vy: -3, radius: 12, mass: 0.5, color: '#fb923c' },
    ],
    gravity: 0,
    friction: 1,
    elasticity: 1,
  },
};

// ============================================================================
// Energy helpers
// ============================================================================

function computeEnergy(balls: Ball[], gravity: number) {
  let ke = 0;
  let pe = 0;
  for (const b of balls) {
    const speed2 = b.vx * b.vx + b.vy * b.vy;
    ke += 0.5 * b.mass * speed2;
    // PE relative to bottom of canvas
    const height = CANVAS_HEIGHT - b.y;
    pe += b.mass * gravity * height;
  }
  return { ke, pe, total: ke + pe };
}

// ============================================================================
// Main Component
// ============================================================================

export default function VirtualLabDemo() {
  const trackInteraction = useTrackInteraction();
  const [activeTab, setActiveTab] = useState<LabTab>('physics');
  const [showAssistant, setShowAssistant] = useState(false);
  const [showGuided, setShowGuided] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [labContext, setLabContext] = useState('');
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // Data recording state
  const [isRecording, setIsRecording] = useState(false);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

  // Physics state
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
  const [showEnergy, setShowEnergy] = useState(true);
  const [trails, setTrails] = useState<{ x: number; y: number; color: string }[]>([]);
  const [projectileMetrics, setProjectileMetrics] = useState<ProjectileMetrics | null>(null);
  const [energy, setEnergy] = useState({ ke: 0, pe: 0, total: 0 });
  const frameRef = useRef<number>(0);

  // Drag-to-launch state
  const [drag, setDrag] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });
  const svgRef = useRef<SVGSVGElement>(null);

  // ============================================================================
  // Physics preset loading
  // ============================================================================

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

    if (presetKey === 'projectile') {
      const ball = preset.balls[0];
      const g = preset.gravity * 60;
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

  // ============================================================================
  // Physics animation loop
  // ============================================================================

  useEffect(() => {
    if (!simulation.isRunning) return;

    const animate = () => {
      setSimulation((prev) => {
        const newBalls = prev.balls.map((ball) => {
          let newVx = ball.vx;
          let newVy = ball.vy + prev.gravity;
          let newX = ball.x + newVx;
          let newY = ball.y + newVy;

          if (selectedPreset === 'projectile') {
            if (newY + ball.radius >= CANVAS_HEIGHT) {
              newY = CANVAS_HEIGHT - ball.radius;
              return { ...ball, x: newX, y: newY, vx: 0, vy: 0 };
            }
            if (newX - ball.radius < 0 || newX + ball.radius > CANVAS_WIDTH) {
              return { ...ball, x: Math.max(ball.radius, Math.min(CANVAS_WIDTH - ball.radius, newX)), y: newY, vx: newVx, vy: newVy };
            }
            return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
          }

          if (newX - ball.radius < 0) { newX = ball.radius; newVx = Math.abs(newVx) * prev.elasticity; }
          if (newX + ball.radius > CANVAS_WIDTH) { newX = CANVAS_WIDTH - ball.radius; newVx = -Math.abs(newVx) * prev.elasticity; }
          if (newY - ball.radius < 0) { newY = ball.radius; newVy = Math.abs(newVy) * prev.elasticity; }
          if (newY + ball.radius > CANVAS_HEIGHT) {
            newY = CANVAS_HEIGHT - ball.radius;
            newVy = -Math.abs(newVy) * prev.elasticity;
            if (Math.abs(newVy) < 0.5) newVy = 0;
          }

          newVx *= prev.friction;
          newVy *= prev.friction;
          return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
        });

        // Ball-to-ball collisions
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
                const nx = dx / dist;
                const ny = dy / dist;
                const dvx = b1.vx - b2.vx;
                const dvy = b1.vy - b2.vy;
                const dvn = dvx * nx + dvy * ny;

                if (dvn > 0) {
                  const restitution = prev.elasticity;
                  const m1 = b1.mass;
                  const m2 = b2.mass;
                  const impulse = (2 * dvn) / (m1 + m2);
                  newBalls[i].vx -= impulse * m2 * nx * restitution;
                  newBalls[i].vy -= impulse * m2 * ny * restitution;
                  newBalls[j].vx += impulse * m1 * nx * restitution;
                  newBalls[j].vy += impulse * m1 * ny * restitution;
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
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [simulation.isRunning, showTrails, selectedPreset]);

  // ============================================================================
  // Energy computation
  // ============================================================================

  useEffect(() => {
    if (activeTab === 'physics') {
      setEnergy(computeEnergy(simulation.balls, simulation.gravity));
    }
  }, [simulation.balls, simulation.gravity, activeTab]);

  // ============================================================================
  // Data recording
  // ============================================================================

  useEffect(() => {
    if (isRecording && simulation.isRunning && simulation.time % 5 === 0) {
      setDataPoints(prev => [...prev, {
        time: simulation.time,
        balls: simulation.balls.map(b => ({
          x: b.x,
          y: CANVAS_HEIGHT - b.y,
          vx: b.vx,
          vy: -b.vy,
          speed: Math.sqrt(b.vx * b.vx + b.vy * b.vy),
          ke: 0.5 * b.mass * (b.vx * b.vx + b.vy * b.vy),
          pe: b.mass * simulation.gravity * (CANVAS_HEIGHT - b.y),
        })),
      }]);
    }
  }, [isRecording, simulation.isRunning, simulation.time, simulation.balls, simulation.gravity]);

  // ============================================================================
  // Physics lab context for AI assistant
  // ============================================================================

  useEffect(() => {
    if (activeTab === 'physics') {
      const preset = PRESETS[selectedPreset];
      const ballInfo = simulation.balls.map((b, i) =>
        `Ball ${i + 1}: pos(${b.x.toFixed(0)},${(CANVAS_HEIGHT - b.y).toFixed(0)}) vel(${b.vx.toFixed(1)},${(-b.vy).toFixed(1)}) mass=${b.mass}`
      ).join('; ');
      setLabContext(
        `Physics Lab - ${preset.name}. Gravity: ${simulation.gravity}, Elasticity: ${simulation.elasticity}, ` +
        `${simulation.isRunning ? 'Running' : 'Paused'}, Time: ${(simulation.time / 60).toFixed(1)}s. ` +
        `Energy - KE: ${energy.ke.toFixed(1)}, PE: ${energy.pe.toFixed(1)}, Total: ${energy.total.toFixed(1)}. ` +
        `Balls: ${ballInfo}`
      );
    }
  }, [activeTab, selectedPreset, simulation.gravity, simulation.elasticity, simulation.isRunning, simulation.time, energy, simulation.balls]);

  // ============================================================================
  // Drag-to-launch handlers
  // ============================================================================

  const getSVGPoint = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (simulation.isRunning) return;
    const pt = getSVGPoint(e);
    setDrag({ isDragging: true, startX: pt.x, startY: pt.y, currentX: pt.x, currentY: pt.y });
  }, [simulation.isRunning, getSVGPoint]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!drag.isDragging) return;
    const pt = getSVGPoint(e);
    setDrag(prev => ({ ...prev, currentX: pt.x, currentY: pt.y }));
  }, [drag.isDragging, getSVGPoint]);

  const handleMouseUp = useCallback(() => {
    if (!drag.isDragging) return;
    const dx = drag.startX - drag.currentX;
    const dy = drag.startY - drag.currentY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 10) {
      // Launch a new ball in the drag direction
      const speed = Math.min(dist / 15, 10);
      const angle = Math.atan2(dy, dx);
      const newBall: Ball = {
        x: drag.startX,
        y: drag.startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 15,
        mass: 1,
        color: `hsl(${Math.random() * 360}, 70%, 55%)`,
        initialX: drag.startX,
        initialY: drag.startY,
        initialVx: Math.cos(angle) * speed,
        initialVy: Math.sin(angle) * speed,
      };
      setSimulation(prev => ({
        ...prev,
        balls: [...prev.balls, newBall],
      }));
      trackInteraction('click', 'drag_launch_ball', {
        x: drag.startX.toFixed(0),
        y: drag.startY.toFixed(0),
        speed: speed.toFixed(1),
      });
    }

    setDrag({ isDragging: false, startX: 0, startY: 0, currentX: 0, currentY: 0 });
  }, [drag, trackInteraction]);

  // ============================================================================
  // Touch handlers for mobile
  // ============================================================================

  const getTouchSVGPoint = useCallback((touch: React.Touch) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    if (simulation.isRunning || e.touches.length !== 1) return;
    e.preventDefault();
    const pt = getTouchSVGPoint(e.touches[0]);
    setDrag({ isDragging: true, startX: pt.x, startY: pt.y, currentX: pt.x, currentY: pt.y });
  }, [simulation.isRunning, getTouchSVGPoint]);

  const handleTouchMove = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    if (!drag.isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const pt = getTouchSVGPoint(e.touches[0]);
    setDrag(prev => ({ ...prev, currentX: pt.x, currentY: pt.y }));
  }, [drag.isDragging, getTouchSVGPoint]);

  const handleTouchEnd = useCallback(() => {
    handleMouseUp(); // Reuse the same launch logic
  }, [handleMouseUp]);

  // ============================================================================
  // Fullscreen toggle
  // ============================================================================

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      fullscreenRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ============================================================================
  // Controls
  // ============================================================================

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

  // ============================================================================
  // Energy bar max for scaling
  // ============================================================================

  const maxEnergy = Math.max(energy.total, 1);
  const kePercent = (energy.ke / maxEnergy) * 100;
  const pePercent = (energy.pe / maxEnergy) * 100;

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div ref={fullscreenRef} className={`bg-gradient-to-br from-slate-50 to-teal-50 p-6 rounded-2xl ${isFullscreen ? 'overflow-y-auto' : ''}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
            Interactive Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Virtual Science Lab</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore physics, chemistry, and biology through interactive simulations. Adjust parameters, launch objects, and observe real-time data.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="inline-flex bg-white rounded-xl shadow-sm p-1">
            <button
              onClick={() => { setActiveTab('physics'); trackInteraction('click', 'switch_tab', { tab: 'physics' }); }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'physics'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              ⚡ Physics Lab
            </button>
            <button
              onClick={() => { setActiveTab('chemistry'); trackInteraction('click', 'switch_tab', { tab: 'chemistry' }); }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'chemistry'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              🧪 Chemistry Lab
            </button>
            <button
              onClick={() => { setActiveTab('biology'); trackInteraction('click', 'switch_tab', { tab: 'biology' }); }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'biology'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              🧬 Biology Lab
            </button>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => { setShowGuided(!showGuided); if (!showGuided) { setShowAssistant(false); setShowAssessment(false); } trackInteraction('click', 'toggle_guided'); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm ${
                showGuided
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📋 Guided Labs
            </button>
            <button
              onClick={() => { setShowAssessment(!showAssessment); if (!showAssessment) { setShowAssistant(false); setShowGuided(false); } trackInteraction('click', 'toggle_assessment'); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm ${
                showAssessment
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📝 Quiz
            </button>
            <button
              onClick={() => { setShowAssistant(!showAssistant); if (!showAssistant) { setShowGuided(false); setShowAssessment(false); } trackInteraction('click', 'toggle_assistant'); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm ${
                showAssistant
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              🤖 AI Assistant
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? '⬜ Exit' : '⛶ Fullscreen'}
            </button>
          </div>
        </div>

        {/* Main content with optional sidebar */}
        <div className={`grid gap-6 ${(showAssistant || showGuided || showAssessment) ? 'lg:grid-cols-[1fr_340px]' : ''}`}>
          <div className="min-w-0">
            {activeTab === 'physics' ? (
              /* ============================================================ */
              /* PHYSICS LAB                                                  */
              /* ============================================================ */
              <div>
                <div className={`grid gap-6 ${(showAssistant || showGuided || showAssessment) ? 'xl:grid-cols-3 grid-cols-1' : 'lg:grid-cols-3'}`}>
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
                            type="range" min="0" max="0.6" step="0.02"
                            value={simulation.gravity}
                            onChange={(e) => setSimulation(prev => ({ ...prev, gravity: parseFloat(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                          />
                        </div>
                        <div>
                          <label className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Elasticity (Bounciness)</span>
                            <span>{(simulation.elasticity * 100).toFixed(0)}%</span>
                          </label>
                          <input
                            type="range" min="0" max="1" step="0.05"
                            value={simulation.elasticity}
                            onChange={(e) => setSimulation(prev => ({ ...prev, elasticity: parseFloat(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                          />
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="mt-4 space-y-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={showVectors} onChange={(e) => setShowVectors(e.target.checked)} className="rounded accent-teal-600" />
                          Show Velocity Vectors
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={showTrails} onChange={(e) => { setShowTrails(e.target.checked); if (!e.target.checked) setTrails([]); }} className="rounded accent-teal-600" />
                          Show Motion Trails
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={showEnergy} onChange={(e) => setShowEnergy(e.target.checked)} className="rounded accent-teal-600" />
                          Show Energy Bars
                        </label>
                      </div>
                    </div>

                    {/* Energy Visualization */}
                    {showEnergy && (
                      <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Energy</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Kinetic Energy (KE)</span>
                              <span className="font-mono">{energy.ke.toFixed(1)}</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-500 rounded-full transition-all duration-150"
                                style={{ width: `${Math.min(kePercent, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Potential Energy (PE)</span>
                              <span className="font-mono">{energy.pe.toFixed(1)}</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-150"
                                style={{ width: `${Math.min(pePercent, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Total Energy</span>
                              <span className="font-mono">{energy.total.toFixed(1)}</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full transition-all duration-150"
                                style={{ width: '100%' }}
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                          With 100% elasticity & no friction, total energy stays constant.
                        </p>
                      </div>
                    )}

                    {/* Projectile Metrics */}
                    {selectedPreset === 'projectile' && projectileMetrics && (
                      <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Projectile Analysis</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between p-2 bg-cyan-50 rounded-lg">
                            <span className="text-gray-600">Launch Angle</span>
                            <span className="font-semibold text-cyan-700">{projectileMetrics.angle}°</span>
                          </div>
                          <div className="flex justify-between p-2 bg-cyan-50 rounded-lg">
                            <span className="text-gray-600">Initial Speed</span>
                            <span className="font-semibold text-cyan-700">{projectileMetrics.initialSpeed} m/s</span>
                          </div>
                          <div className="flex justify-between p-2 bg-green-50 rounded-lg">
                            <span className="text-gray-600">Max Height</span>
                            <span className="font-semibold text-green-700">{projectileMetrics.maxHeight} m</span>
                          </div>
                          <div className="flex justify-between p-2 bg-blue-50 rounded-lg">
                            <span className="text-gray-600">Range</span>
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
                  <div className={(showAssistant || showGuided || showAssessment) ? 'xl:col-span-2' : 'lg:col-span-2'}>
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

                      {/* Canvas with drag-to-launch */}
                      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden">
                        <svg
                          ref={svgRef}
                          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
                          className="w-full h-auto cursor-crosshair"
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        >
                          {/* Grid */}
                          <defs>
                            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#374151" strokeWidth="0.5" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />

                          {/* Ground line for projectile */}
                          {selectedPreset === 'projectile' && (
                            <line x1="0" y1={CANVAS_HEIGHT - 1} x2={CANVAS_WIDTH} y2={CANVAS_HEIGHT - 1} stroke="#10b981" strokeWidth="2" />
                          )}

                          {/* Trails */}
                          {showTrails && trails.map((trail, idx) => (
                            <circle key={idx} cx={trail.x} cy={trail.y} r={2} fill={trail.color} opacity={0.2 + (idx / trails.length) * 0.6} />
                          ))}

                          {/* Drag-to-launch arrow */}
                          {drag.isDragging && (
                            <>
                              {/* Launch position indicator */}
                              <circle cx={drag.startX} cy={drag.startY} r={15} fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4" opacity={0.8} />
                              {/* Arrow showing launch direction (opposite of drag) */}
                              <line
                                x1={drag.startX}
                                y1={drag.startY}
                                x2={drag.startX + (drag.startX - drag.currentX) * 0.5}
                                y2={drag.startY + (drag.startY - drag.currentY) * 0.5}
                                stroke="#fbbf24"
                                strokeWidth="3"
                                strokeLinecap="round"
                                markerEnd="url(#arrowhead)"
                              />
                              {/* Slingshot line (from start to cursor) */}
                              <line
                                x1={drag.startX}
                                y1={drag.startY}
                                x2={drag.currentX}
                                y2={drag.currentY}
                                stroke="#fbbf24"
                                strokeWidth="1.5"
                                strokeDasharray="6"
                                opacity={0.5}
                              />
                              {/* Speed indicator */}
                              {(() => {
                                const dist = Math.sqrt(
                                  (drag.startX - drag.currentX) ** 2 + (drag.startY - drag.currentY) ** 2
                                );
                                const speed = Math.min(dist / 15, 10);
                                return (
                                  <text
                                    x={drag.startX + 20}
                                    y={drag.startY - 20}
                                    fill="#fbbf24"
                                    fontSize="11"
                                    fontWeight="bold"
                                  >
                                    v = {speed.toFixed(1)}
                                  </text>
                                );
                              })()}
                            </>
                          )}

                          {/* Arrow marker definition */}
                          <defs>
                            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                              <polygon points="0 0, 8 3, 0 6" fill="#fbbf24" />
                            </marker>
                          </defs>

                          {/* Balls */}
                          {simulation.balls.map((ball, idx) => (
                            <g key={idx}>
                              <ellipse cx={ball.x + 2} cy={ball.y + 4} rx={ball.radius} ry={ball.radius * 0.3} fill="rgba(0,0,0,0.2)" />
                              <circle cx={ball.x} cy={ball.y} r={ball.radius} fill={ball.color} stroke="white" strokeWidth="2" />
                              {showVectors && (Math.abs(ball.vx) > 0.1 || Math.abs(ball.vy) > 0.1) && (
                                <>
                                  <line x1={ball.x} y1={ball.y} x2={ball.x + ball.vx * 8} y2={ball.y + ball.vy * 8} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
                                  <circle cx={ball.x + ball.vx * 8} cy={ball.y + ball.vy * 8} r={4} fill="#22c55e" />
                                </>
                              )}
                              <text x={ball.x} y={ball.y + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
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
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-4 h-0.5 bg-green-500"></div>
                              <span>Velocity vector</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-0.5 bg-yellow-400"></div>
                            <span>Click &amp; drag to launch</span>
                          </div>
                        </div>

                        {/* Time display */}
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur rounded-lg px-3 py-1 text-white text-xs">
                          t = {(simulation.time / 60).toFixed(1)}s
                        </div>
                      </div>

                      {/* Data Panel */}
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {simulation.balls.slice(0, 6).map((ball, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ball.color }}></div>
                              <span className="font-medium text-sm">Ball {idx + 1}</span>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>Position: ({ball.x.toFixed(0)}, {(CANVAS_HEIGHT - ball.y).toFixed(0)})</p>
                              <p>Velocity: ({ball.vx.toFixed(1)}, {(-ball.vy).toFixed(1)})</p>
                              <p>Speed: {Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy).toFixed(1)} m/s</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Physics Concepts */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Physics Concepts Demonstrated</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { icon: '🍎', title: 'Gravity', desc: 'Constant downward acceleration' },
                      { icon: '💥', title: 'Collisions', desc: 'Elastic momentum transfer' },
                      { icon: '🔄', title: 'Momentum', desc: 'Conservation in collisions' },
                      { icon: '⚡', title: 'Energy', desc: 'KE ↔ PE transformations' },
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
            ) : activeTab === 'chemistry' ? (
              /* ============================================================ */
              /* CHEMISTRY LAB                                                */
              /* ============================================================ */
              <ChemistryLab onContextChange={setLabContext} compact={showAssistant || showGuided} />
            ) : (
              /* ============================================================ */
              /* BIOLOGY LAB                                                  */
              /* ============================================================ */
              <BiologyLab onContextChange={setLabContext} compact={showAssistant || showGuided} />
            )}

            {/* Data Export — shown below any active lab */}
            {activeTab === 'physics' && (
              <div className="mt-6">
                <DataExport
                  labType="physics"
                  dataPoints={dataPoints}
                  labContext={labContext}
                  isRecording={isRecording}
                  onStartRecording={() => { setDataPoints([]); setIsRecording(true); }}
                  onStopRecording={() => setIsRecording(false)}
                />
              </div>
            )}
          </div>

          {/* Sidebar: AI Assistant, Guided Labs, or Assessment */}
          {showAssistant && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <LabAssistant labContext={labContext} />
            </div>
          )}
          {showGuided && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <GuidedLab onSwitchTab={(tab) => setActiveTab(tab)} />
            </div>
          )}
          {showAssessment && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Assessment activeTab={activeTab} selectedPreset={activeTab === 'physics' ? selectedPreset : undefined} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
