'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ANNOTATION_STYLES } from './constants';
import { splitTextIntoSegments } from './utils';
import type { TextAnnotation } from './types';

interface AnnotatedTextProps {
  text: string;
  annotations: TextAnnotation[];
  enabled?: boolean;
}

interface TooltipPos {
  top: number;
  left: number;
  flippedBelow: boolean;
}

function Tooltip({
  annotation,
  style,
  anchorRef,
  onDismiss,
}: {
  annotation: TextAnnotation;
  style: (typeof ANNOTATION_STYLES)[keyof typeof ANNOTATION_STYLES];
  anchorRef: HTMLSpanElement | null;
  onDismiss: () => void;
}) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<TooltipPos | null>(null);

  const updatePosition = useCallback(() => {
    if (!anchorRef || !tooltipRef.current) return;
    const rect = anchorRef.getBoundingClientRect();
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const tooltipWidth = 288; // w-72 = 18rem = 288px
    const gap = 8;

    // Default: above the highlight
    let top = rect.top - tooltipHeight - gap + window.scrollY;
    let flippedBelow = false;

    // If it would go above viewport, flip below
    if (rect.top - tooltipHeight - gap < 0) {
      top = rect.bottom + gap + window.scrollY;
      flippedBelow = true;
    }

    // Horizontal: align left edge with highlight, but clamp to viewport
    let left = rect.left + window.scrollX;
    if (left + tooltipWidth > window.innerWidth - 12) {
      left = window.innerWidth - tooltipWidth - 12 + window.scrollX;
    }
    if (left < 12) left = 12;

    setPos({ top, left, flippedBelow });
  }, [anchorRef]);

  useEffect(() => {
    updatePosition();
    // Reposition on scroll/resize since parent may be a scrollable container
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition]);

  return createPortal(
    <div
      ref={tooltipRef}
      className="fixed z-[9999] w-72 p-3 bg-white rounded-lg shadow-xl border border-gray-200 text-left"
      style={
        pos
          ? { top: pos.top - window.scrollY, left: pos.left - window.scrollX }
          : { visibility: 'hidden', top: 0, left: 0 }
      }
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`w-2 h-2 rounded-full ${style.dotColor}`} />
        <span className="text-xs font-semibold text-gray-900">{style.label}</span>
        <span
          className="ml-auto text-xs text-gray-400 cursor-help"
          title={`${annotation.confidence}% confidence`}
        >
          {annotation.confidence}%
        </span>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed font-sans">
        {annotation.reason}
      </p>
      <button
        className="mt-2 text-xs text-gray-400 hover:text-gray-600"
        onClick={onDismiss}
      >
        Dismiss
      </button>
    </div>,
    document.body
  );
}

export default function AnnotatedText({ text, annotations, enabled = true }: AnnotatedTextProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const spanRefs = useRef<Map<number, HTMLSpanElement>>(new Map());

  if (!enabled || annotations.length === 0) {
    return (
      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm font-serif">
        {text}
      </div>
    );
  }

  const segments = splitTextIntoSegments(text, annotations);

  return (
    <div className="relative">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 pb-3 border-b border-gray-200">
        {Object.entries(ANNOTATION_STYLES).map(([key, style]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className={`w-3 h-3 rounded-sm ${style.bg}`} />
            {style.label}
          </div>
        ))}
      </div>

      {/* Annotated text */}
      <div className="whitespace-pre-wrap leading-relaxed text-sm font-serif">
        {segments.map((segment, idx) => {
          if (!segment.annotation) {
            return <span key={idx}>{segment.text}</span>;
          }

          const ann = segment.annotation;
          const style = ANNOTATION_STYLES[ann.type];
          const isActive = activeIndex === idx;

          return (
            <span key={idx} className="inline">
              <span
                ref={(el) => {
                  if (el) spanRefs.current.set(idx, el);
                  else spanRefs.current.delete(idx);
                }}
                className={`${style.bg} ${style.hoverBg} rounded-sm cursor-pointer transition-colors border-b-2 ${style.border}`}
                onClick={() => setActiveIndex(isActive ? null : idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => {
                  if (!isActive) setActiveIndex(null);
                }}
              >
                {segment.text}
              </span>

              {isActive && (
                <Tooltip
                  annotation={ann}
                  style={style}
                  anchorRef={spanRefs.current.get(idx) || null}
                  onDismiss={() => setActiveIndex(null)}
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
