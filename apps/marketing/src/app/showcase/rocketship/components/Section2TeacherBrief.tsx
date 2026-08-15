'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, RotateCcw, Pencil, Check, User } from 'lucide-react';
import { STUDENTS, MASTERY_COLORS } from './data';
import { renderFullMarkdown } from './renderMarkdown';

export default function Section2TeacherBrief() {
  const [brief, setBrief] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBrief, setEditedBrief] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const generateBrief = useCallback(async () => {
    setError(null);
    setIsGenerating(true);
    setBrief('');
    setIsEditing(false);
    setHasGenerated(true);

    abortRef.current = new AbortController();
    let fullText = '';

    try {
      const response = await fetch('/api/showcase/rocketship/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students: STUDENTS.map((s) => ({
            name: s.name,
            mastery: s.mastery,
            exitTicket: s.exitTicket,
            ell: s.ell,
            flag: s.flag,
          })),
        }),
        signal: abortRef.current.signal,
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

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
              setBrief(fullText);
            } else if (payload.type === 'error') {
              setError(payload.content);
            }
          } catch {
            // skip
          }
        }
      }

      setEditedBrief(fullText);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError('Failed to generate brief. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedBrief(brief);
  };

  const handleSaveEdit = () => {
    setBrief(editedBrief);
    setIsEditing(false);
  };

  return (
    <div className="flex gap-5 h-[calc(100vh-10rem)]">
      {/* Left — Student Roster */}
      <div className="w-80 flex flex-col gap-3">
        <div className="rounded-2xl border p-4" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B6B6B' }}>
              Class Roster — Grade 4
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f0ebe7', color: '#6B6B6B' }}>
              Mateo Sheedy Elementary
            </span>
          </div>

          <div className="space-y-2.5">
            {STUDENTS.map((student) => {
              const colors = MASTERY_COLORS[student.mastery];
              return (
                <div
                  key={student.name}
                  className={`p-3 rounded-xl border ${colors.border}`}
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0ebe7' }}>
                        <User className="w-3.5 h-3.5" style={{ color: '#6B6B6B' }} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
                        {student.name}
                      </span>
                    </div>
                    {student.ell !== 'No' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#2A7B6F', color: 'white' }}>
                        ELL
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
                      {student.mastery}
                    </span>
                    <span style={{ color: '#6B6B6B' }}>Exit: {student.exitTicket}%</span>
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: '#6B6B6B' }}>
                    {student.flag}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center text-[10px] py-1" style={{ color: '#E5E0DB' }}>
          Demo data — for illustration only
        </div>
      </div>

      {/* Right — Brief Output */}
      <div className="flex-1 flex flex-col rounded-2xl border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E0DB' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: '#E5E0DB', backgroundColor: '#FFF8F5' }}>
          <div>
            <div className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
              Morning Instructional Brief
            </div>
            <div className="text-[11px]" style={{ color: '#6B6B6B' }}>
              Grade 4 · Fractions: Comparing with unlike denominators
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasGenerated && !isGenerating && (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#E5E0DB', color: '#6B6B6B' }}
                >
                  <Pencil className="w-3 h-3" />
                  {isEditing ? 'Editing...' : 'Edit'}
                </button>
                <button
                  onClick={generateBrief}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#E5E0DB', color: '#6B6B6B' }}
                >
                  <RotateCcw className="w-3 h-3" />
                  Regenerate
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!hasGenerated && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FFF8F5' }}>
                <Sparkles className="w-8 h-8" style={{ color: '#C8402A' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                Ready to generate your morning brief
              </h3>
              <p className="text-sm mb-6 max-w-md" style={{ color: '#6B6B6B' }}>
                Based on yesterday&apos;s exit ticket data and current mastery levels, the AI will create a personalized instructional brief in under 30 seconds.
              </p>
              <button
                onClick={generateBrief}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:brightness-110 shadow-lg"
                style={{ backgroundColor: '#C8402A' }}
              >
                <Sparkles className="w-4 h-4" />
                Generate Brief
              </button>
            </div>
          )}

          {isGenerating && brief === '' && (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 rounded-full" style={{ borderColor: '#E5E0DB', borderTopColor: '#C8402A' }} />
                <span className="text-sm" style={{ color: '#6B6B6B' }}>Analyzing class data...</span>
              </div>
            </div>
          )}

          {isEditing ? (
            <div className="h-full flex flex-col">
              <textarea
                value={editedBrief}
                onChange={(e) => setEditedBrief(e.target.value)}
                className="flex-1 w-full p-4 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2"
                style={{ borderColor: '#E5E0DB', color: '#1A1A1A', fontFamily: 'inherit' }}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-medium"
                  style={{ backgroundColor: '#2A7B6F' }}
                >
                  <Check className="w-3 h-3" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className={isGenerating ? 'animate-pulse-subtle' : ''}>
              {renderFullMarkdown(brief)}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
