'use client';

import React from 'react';
import { Languages, FileText, Bot, LayoutDashboard, Rocket, Eye, EyeOff } from 'lucide-react';
import { SECTIONS, SectionId } from './data';

const ICON_MAP = {
  Languages,
  FileText,
  Bot,
  LayoutDashboard,
  Rocket,
};

interface SidebarProps {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
  presenterMode: boolean;
  onTogglePresenterMode: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, presenterMode, onTogglePresenterMode }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-[220px] flex flex-col border-r z-40" style={{ backgroundColor: '#FFF8F5', borderColor: '#E5E0DB' }}>
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: '#E5E0DB' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2A7B6F' }}>
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Evelyn Learning</div>
            <div className="text-[10px]" style={{ color: '#6B6B6B' }}>evelynlearning.com</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {SECTIONS.map((section, index) => {
          const Icon = ICON_MAP[section.icon as keyof typeof ICON_MAP];
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                isActive
                  ? 'font-semibold shadow-sm'
                  : 'hover:bg-white/60'
              }`}
              style={
                isActive
                  ? { backgroundColor: '#C8402A', color: 'white' }
                  : { color: '#1A1A1A' }
              }
            >
              <span className={`flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                isActive ? 'bg-white/20 text-white' : ''
              }`}
                style={!isActive ? { backgroundColor: '#E5E0DB', color: '#6B6B6B' } : undefined}
              >
                {index + 1}
              </span>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{section.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Presenter Mode Toggle */}
      <div className="px-3 pb-3">
        <button
          onClick={onTogglePresenterMode}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all hover:bg-white/60"
          style={{ color: '#6B6B6B' }}
        >
          {presenterMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {presenterMode ? 'Exit Presenter Mode' : 'Presenter Mode'}
        </button>
      </div>

      {/* Meeting Context — hidden in presenter mode */}
      {!presenterMode && (
        <div className="p-4 mx-3 mb-3 rounded-xl text-xs" style={{ backgroundColor: '#f0ebe7', color: '#6B6B6B' }}>
          <div className="font-semibold mb-1" style={{ color: '#1A1A1A' }}>Meeting Context</div>
          <div>Preston Smith</div>
          <div>Co-Founder & CEO</div>
          <div>Rocketship Public Schools</div>
          <div className="mt-1.5 pt-1.5 border-t" style={{ borderColor: '#E5E0DB' }}>
            April 2, 2026 · 11:00 AM
          </div>
        </div>
      )}
    </div>
  );
}
