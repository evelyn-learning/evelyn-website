'use client';

import React from 'react';
import { SECTIONS, SectionId } from './data';

interface HeaderBarProps {
  activeSection: SectionId;
}

export default function HeaderBar({ activeSection }: HeaderBarProps) {
  const activeIndex = SECTIONS.findIndex((s) => s.id === activeSection);

  return (
    <div
      className="fixed top-0 left-[220px] right-0 h-14 flex items-center justify-between px-6 border-b z-30"
      style={{ backgroundColor: '#FFF8F5', borderColor: '#E5E0DB' }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
          Rocketship Innovation School — Evelyn Learning Showcase
        </h1>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: '#C8402A' }}
        >
          For Preston
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {SECTIONS.map((section, i) => (
          <div key={section.id} className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeIndex ? 'w-6' : ''
              }`}
              style={{
                backgroundColor: i === activeIndex ? '#C8402A' : i < activeIndex ? '#2A7B6F' : '#E5E0DB',
                borderRadius: i === activeIndex ? '4px' : '50%',
              }}
            />
          </div>
        ))}
        <span className="ml-2 text-[10px] font-medium" style={{ color: '#6B6B6B' }}>
          {activeIndex + 1} / {SECTIONS.length}
        </span>
      </div>
    </div>
  );
}
