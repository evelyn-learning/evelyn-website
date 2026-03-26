'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  User,
  Users,
  GripVertical,
  Sparkles,
  Send,
  TrendingUp,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { STUDENTS, MASTERY_COLORS, EXIT_TICKET_DATA, ACTION_CARDS, PARENT_MESSAGES } from './data';
import { usePresenterMode } from './PresenterContext';

// =============================================================================
// Panel A — Class Mastery Overview
// =============================================================================
function PanelA() {
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const onTrack = STUDENTS.filter((s) => s.mastery === 'Proficient' || s.exitTicket >= 70).length;

  return (
    <div className="rounded-2xl border p-4 h-full flex flex-col" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B6B6B' }}>
          Class Mastery Overview
        </h3>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium" style={{ backgroundColor: '#FFF8F5', color: '#1A1A1A' }}>
          <TrendingUp className="w-3 h-3" style={{ color: '#2A7B6F' }} />
          {onTrack} of {STUDENTS.length} on track
        </div>
      </div>

      {/* Mastery bar */}
      <div className="flex h-2 rounded-full overflow-hidden mb-4" style={{ backgroundColor: '#E5E0DB' }}>
        <div className="h-full" style={{ width: `${(STUDENTS.filter((s) => s.mastery === 'Proficient').length / STUDENTS.length) * 100}%`, backgroundColor: '#10B981' }} />
        <div className="h-full" style={{ width: `${(STUDENTS.filter((s) => s.mastery === 'Approaching').length / STUDENTS.length) * 100}%`, backgroundColor: '#F59E0B' }} />
        <div className="h-full" style={{ width: `${(STUDENTS.filter((s) => s.mastery === 'Developing').length / STUDENTS.length) * 100}%`, backgroundColor: '#EF4444' }} />
      </div>

      <div className="grid grid-cols-3 gap-2 flex-1">
        {STUDENTS.map((student) => {
          const colors = MASTERY_COLORS[student.mastery];
          const isExpanded = expandedStudent === student.name;
          return (
            <div key={student.name}>
              <button
                onClick={() => setExpandedStudent(isExpanded ? null : student.name)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all hover:shadow-sm ${colors.border}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <span className="text-xs font-semibold" style={{ color: '#1A1A1A' }}>
                      {student.name.split(' ')[0]}
                    </span>
                  </div>
                  {student.ell !== 'No' && (
                    <span className="text-[8px] px-1 py-0.5 rounded font-medium" style={{ backgroundColor: '#2A7B6F', color: 'white' }}>
                      ELL
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[10px]" style={{ color: '#6B6B6B' }}>
                  {student.exitTicket}% · {student.mastery}
                </div>
                {isExpanded ? <ChevronUp className="w-3 h-3 mt-1" style={{ color: '#6B6B6B' }} /> : <ChevronDown className="w-3 h-3 mt-1" style={{ color: '#E5E0DB' }} />}
              </button>
              {isExpanded && (
                <div className="mt-1 p-2 rounded-lg text-[10px] space-y-1" style={{ backgroundColor: '#FFF8F5' }}>
                  <div style={{ color: '#6B6B6B' }}>Exit tickets: {student.exitTicketHistory?.join('%, ') || 'N/A'}%</div>
                  <div style={{ color: '#6B6B6B' }}>Project: {student.projectPhase || 'N/A'}</div>
                  <div className="flex gap-1 mt-1">
                    {student.exitTicketHistory?.map((score, i) => (
                      <div key={i} className="flex-1 rounded-sm" style={{ height: `${score / 3}px`, backgroundColor: score >= 70 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444' }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// Panel B — Today's Groupings
// =============================================================================
interface GroupData {
  smallGroup: string[];
  independent: string[];
  extension: string[];
}

function PanelB() {
  const [groups, setGroups] = useState<GroupData>({
    smallGroup: ['Marcus T.', 'Sofia R.', 'Destiny M.', 'James L.'],
    independent: ['Priya S.', 'Aiden K.'],
    extension: ['Aiden K.'],
  });
  const [isRegrouping, setIsRegrouping] = useState(false);
  const [draggedStudent, setDraggedStudent] = useState<{ name: string; from: keyof GroupData } | null>(null);

  const handleRegroup = async () => {
    setIsRegrouping(true);
    try {
      const response = await fetch('/api/showcase/rocketship/regroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: STUDENTS }),
      });
      const data = await response.json();
      if (data.groupings) {
        setGroups({
          smallGroup: data.groupings.smallGroup?.students || groups.smallGroup,
          independent: data.groupings.independent?.students || groups.independent,
          extension: data.groupings.extension?.students || groups.extension,
        });
      }
    } catch {
      // keep existing groups
    } finally {
      setIsRegrouping(false);
    }
  };

  const handleDragStart = (name: string, from: keyof GroupData) => {
    setDraggedStudent({ name, from });
  };

  const handleDrop = (to: keyof GroupData) => {
    if (!draggedStudent || draggedStudent.from === to) {
      setDraggedStudent(null);
      return;
    }
    setGroups((prev) => {
      const next = { ...prev };
      next[draggedStudent.from] = prev[draggedStudent.from].filter((n) => n !== draggedStudent.name);
      if (!next[to].includes(draggedStudent.name)) {
        next[to] = [...prev[to], draggedStudent.name];
      }
      return next;
    });
    setDraggedStudent(null);
  };

  const GROUP_CONFIG = [
    { key: 'smallGroup' as const, label: 'Small Group Instruction', color: '#C8402A', icon: Users },
    { key: 'independent' as const, label: 'Independent Practice', color: '#2A7B6F', icon: User },
    { key: 'extension' as const, label: 'Extension Challenge', color: '#7C3AED', icon: Sparkles },
  ];

  return (
    <div className="rounded-2xl border p-4 h-full flex flex-col" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B6B6B' }}>
          Today&apos;s Groupings
        </h3>
        <button
          onClick={handleRegroup}
          disabled={isRegrouping}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-white transition-all disabled:opacity-50 hover:brightness-110"
          style={{ backgroundColor: '#2A7B6F' }}
        >
          {isRegrouping ? (
            <div className="animate-spin w-3 h-3 border border-white/30 border-t-white rounded-full" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          Regroup with AI
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {GROUP_CONFIG.map(({ key, label, color, icon: Icon }) => (
          <div
            key={key}
            className="p-3 rounded-xl border-2 border-dashed transition-colors"
            style={{ borderColor: draggedStudent ? color + '40' : '#E5E0DB' }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(key)}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-[11px] font-semibold" style={{ color }}>{label}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {groups[key].map((name) => (
                <div
                  key={name}
                  draggable
                  onDragStart={() => handleDragStart(name, key)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow"
                  style={{ backgroundColor: color + '15', color }}
                >
                  <GripVertical className="w-3 h-3 opacity-40" />
                  {name}
                </div>
              ))}
              {groups[key].length === 0 && (
                <span className="text-[10px] italic" style={{ color: '#E5E0DB' }}>Drop students here</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Panel C — Exit Ticket Analysis
// =============================================================================
function PanelC() {
  return (
    <div className="rounded-2xl border p-4 h-full flex flex-col" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
      <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B6B6B' }}>
        Exit Ticket Analysis — Yesterday
      </h3>

      <div className="h-36 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={EXIT_TICKET_DATA} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E0DB" />
            <XAxis dataKey="question" tick={{ fontSize: 9, fill: '#6B6B6B' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#6B6B6B' }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, borderColor: '#E5E0DB' }}
            />
            <Bar dataKey="correct" stackId="a" radius={[0, 0, 0, 0]}>
              {EXIT_TICKET_DATA.map((_, i) => (
                <Cell key={i} fill="#10B981" />
              ))}
            </Bar>
            <Bar dataKey="incorrect" stackId="a" radius={[4, 4, 0, 0]}>
              {EXIT_TICKET_DATA.map((_, i) => (
                <Cell key={i} fill="#EF4444" opacity={0.6} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 flex-1">
        {ACTION_CARDS.map((card, i) => (
          <div
            key={i}
            className="flex items-start gap-2 p-2.5 rounded-xl"
            style={{ backgroundColor: card.severity === 'high' ? '#FEF2F2' : card.severity === 'medium' ? '#FFFBEB' : '#F0FDF4' }}
          >
            <AlertTriangle
              className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
              style={{
                color: card.severity === 'high' ? '#EF4444' : card.severity === 'medium' ? '#F59E0B' : '#10B981',
              }}
            />
            <div>
              <div className="text-[11px] font-medium" style={{ color: '#1A1A1A' }}>{card.misconception}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#6B6B6B' }}>→ {card.action}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Panel D — Family Pulse
// =============================================================================
function PanelD() {
  const [familyUpdate, setFamilyUpdate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [selectedStudent, setSelectedStudent] = useState(STUDENTS[0]);
  const abortRef = useRef<AbortController | null>(null);

  const generateUpdate = useCallback(async () => {
    setIsGenerating(true);
    setFamilyUpdate('');
    abortRef.current = new AbortController();
    let fullText = '';

    try {
      const response = await fetch('/api/showcase/rocketship/family-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedStudent.name,
          language,
          masteryLevel: selectedStudent.mastery,
          recentActivity: `Exit ticket score: ${selectedStudent.exitTicket}%. ${selectedStudent.flag}.`,
        }),
        signal: abortRef.current.signal,
      });

      const reader = response.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.type === 'chunk') {
              fullText += payload.content;
              setFamilyUpdate(fullText);
            }
          } catch {
            // skip
          }
        }
      }
    } catch {
      // ignore abort
    } finally {
      setIsGenerating(false);
    }
  }, [selectedStudent, language]);

  return (
    <div className="rounded-2xl border p-4 h-full flex flex-col" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B6B6B' }}>
          Family Pulse — Last 24hrs
        </h3>
        <Clock className="w-3.5 h-3.5" style={{ color: '#6B6B6B' }} />
      </div>

      {/* Home practice summary */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {STUDENTS.filter((s) => s.homePractice && s.homePractice.minutes > 0).map((s) => (
          <div key={s.name} className="p-1.5 rounded-lg text-center" style={{ backgroundColor: '#FFF8F5' }}>
            <div className="text-[10px] font-medium" style={{ color: '#1A1A1A' }}>{s.name.split(' ')[0]}</div>
            <div className="text-[10px]" style={{ color: '#2A7B6F' }}>{s.homePractice!.minutes}m</div>
          </div>
        ))}
      </div>

      {/* Parent messages */}
      <div className="space-y-2 mb-3">
        {PARENT_MESSAGES.slice(0, 2).map((msg, i) => (
          <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: '#FFF8F5' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0" style={{ backgroundColor: '#C8402A' }}>
              {msg.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold" style={{ color: '#1A1A1A' }}>{msg.parent}</span>
                <span className="text-[9px]" style={{ color: '#6B6B6B' }}>{msg.time}</span>
              </div>
              <div className="text-[10px] mt-0.5 truncate" style={{ color: '#6B6B6B' }}>{msg.message}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Send update */}
      <div className="mt-auto pt-3 border-t" style={{ borderColor: '#E5E0DB' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <select
              value={selectedStudent.name}
              onChange={(e) => setSelectedStudent(STUDENTS.find((s) => s.name === e.target.value) || STUDENTS[0])}
              className="text-[10px] px-2 py-1 rounded-lg border"
              style={{ borderColor: '#E5E0DB', color: '#1A1A1A' }}
            >
              {STUDENTS.map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-[9px] font-medium ${language === 'en' ? 'text-white' : ''}`}
              style={language === 'en' ? { backgroundColor: '#2A7B6F' } : { color: '#6B6B6B' }}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-2 py-0.5 rounded text-[9px] font-medium ${language === 'es' ? 'text-white' : ''}`}
              style={language === 'es' ? { backgroundColor: '#2A7B6F' } : { color: '#6B6B6B' }}
            >
              ES
            </button>
          </div>
        </div>
        <button
          onClick={generateUpdate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-white text-[11px] font-medium disabled:opacity-50 hover:brightness-110 transition-all"
          style={{ backgroundColor: '#C8402A' }}
        >
          {isGenerating ? (
            <div className="animate-spin w-3 h-3 border border-white/30 border-t-white rounded-full" />
          ) : (
            <Send className="w-3 h-3" />
          )}
          Send Family Update
        </button>
        {familyUpdate && (
          <div className="mt-2 p-2.5 rounded-lg text-[11px] leading-relaxed" style={{ backgroundColor: '#FFF8F5', color: '#1A1A1A' }}>
            {familyUpdate}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Main Dashboard
// =============================================================================
export default function Section4Dashboard() {
  const presenterMode = usePresenterMode();
  return (
    <div className="h-[calc(100vh-10rem)]">
      {/* Teacher header */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E0DB' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#2A7B6F' }}>
          AC
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>Ms. Amara Chen</div>
          <div className="text-[11px]" style={{ color: '#6B6B6B' }}>Grade 4 Lead Teacher — Rocketship Mateo Sheedy</div>
        </div>
        {!presenterMode && (
          <div className="ml-auto text-[10px]" style={{ color: '#E5E0DB' }}>
            Demo data — for illustration only
          </div>
        )}
      </div>

      {/* 4-panel grid */}
      <div className="grid grid-cols-2 gap-4 h-[calc(100%-4rem)]">
        <PanelA />
        <PanelB />
        <PanelC />
        <PanelD />
      </div>
    </div>
  );
}
