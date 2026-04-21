'use client';

/**
 * Call Stack Renderer
 *
 * Visual call stack for teaching recursion, scope, and function invocation.
 * Latest frame on top; each frame shows the function signature, argument
 * bindings, local variables, and the currently-executing line.
 *
 * Use for CS teaching — "step through factorial(3)", "what does the stack
 * look like when we hit the base case", "what goes wrong with infinite
 * recursion".
 */

import React from 'react';

export interface CallStackFrame {
  function: string; // e.g. "factorial(3)" — the label shown on the frame
  args?: Record<string, string | number>;
  locals?: Record<string, string | number>;
  currentLine?: number;
  returnValue?: string | number; // Shown if the frame is about to return
  highlight?: boolean; // Mark this frame as the active/focused one
}

export interface CallStackRendererProps {
  title?: string;
  /** Frames, with the OLDEST frame first (bottom of stack) and the newest LAST (top). */
  frames: CallStackFrame[];
  /** Optional global return value (for when the root frame returns). */
  finalReturn?: string | number;
}

export default function CallStackRenderer({
  title,
  frames,
  finalReturn,
}: CallStackRendererProps) {
  // Display latest frame on top → reverse for rendering order
  const displayFrames = [...frames].reverse();

  return (
    <div className="call-stack-renderer">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          {title}
        </div>
      )}
      <div className="flex flex-col items-stretch max-w-md mx-auto gap-1">
        {finalReturn !== undefined && (
          <div className="text-xs text-center text-green-700 italic mb-1">
            returns {String(finalReturn)} ↑
          </div>
        )}
        {displayFrames.map((frame, i) => {
          const isTop = i === 0;
          const frameKey = `frame-${frames.length - 1 - i}`;
          return (
            <div
              key={frameKey}
              className={`rounded-md border-2 px-3 py-2 font-mono text-xs ${
                frame.highlight || isTop
                  ? 'bg-blue-50 border-blue-400 shadow-sm'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">
                  {frame.function}
                </span>
                {frame.currentLine !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-gray-300 text-gray-600">
                    line {frame.currentLine}
                  </span>
                )}
              </div>

              {frame.args && Object.keys(frame.args).length > 0 && (
                <div className="mt-1.5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                    args
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-gray-800">
                    {Object.entries(frame.args).map(([k, v]) => (
                      <span key={k}>
                        <span className="text-purple-700">{k}</span>
                        <span className="text-gray-500"> = </span>
                        <span>{String(v)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {frame.locals && Object.keys(frame.locals).length > 0 && (
                <div className="mt-1.5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                    locals
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-gray-800">
                    {Object.entries(frame.locals).map(([k, v]) => (
                      <span key={k}>
                        <span className="text-blue-700">{k}</span>
                        <span className="text-gray-500"> = </span>
                        <span>{String(v)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {frame.returnValue !== undefined && (
                <div className="mt-1.5 text-green-700 italic">
                  return {String(frame.returnValue)}
                </div>
              )}
            </div>
          );
        })}
        <div className="text-[10px] text-center text-gray-400 mt-1 uppercase tracking-wide">
          stack bottom (main)
        </div>
      </div>
    </div>
  );
}
