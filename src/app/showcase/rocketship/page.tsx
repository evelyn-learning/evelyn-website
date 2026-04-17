'use client';

import React, { useState, useEffect } from 'react';
import AccessGate from './components/AccessGate';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import SectionWrapper from './components/SectionWrapper';
import Section1ELLCoPilot from './components/Section1ELLCoPilot';
import Section2TeacherBrief from './components/Section2TeacherBrief';
import Section3AICoPilot from './components/Section3AICoPilot';
import Section4Dashboard from './components/Section4Dashboard';
import Section5Proposal from './components/Section5Proposal';
import { SectionId } from './components/data';
import { PresenterProvider } from './components/PresenterContext';

const SECTION_TITLES: Record<SectionId, { title: string; subtitle: string }> = {
  'ell-copilot': {
    title: 'Built for your Rocketeers first',
    subtitle: 'Every child can participate — readers and emerging readers alike.',
  },
  'teacher-brief': {
    title: 'Your 60-second morning brief — before the bell rings',
    subtitle: 'AI-generated instructional briefs from real class data. A new product concept, demonstrated for the first time.',
  },
  'ai-copilot': {
    title: 'A thought partner for every Rocketeer, every moment',
    subtitle: 'An elementary AI co-pilot for project-based learning — coaches thinking, never writes the answer.',
  },
  dashboard: {
    title: 'Watch the room regroup in real time',
    subtitle:
      'A student submits a quiz. The AI evaluates mastery against today\u2019s learning objective. Groups update instantly — teachers are notified of the shift.',
  },
  proposal: {
    title: 'Where we start: Fall 2026',
    subtitle:
      'A focused pilot at the Rocketship Innovation School, designed to complement Jetpacked with a classroom-grounded adaptive learning layer.',
  },
};

export default function RocketshipShowcase() {
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>('ell-copilot');
  const [presenterMode, setPresenterMode] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('rocketship_access');
    if (stored === 'verified') {
      setHasAccess(true);
    }
    setCheckingAccess(false);
  }, []);

  if (checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF8F5' }}>
        <div className="animate-spin w-8 h-8 border-2 rounded-full" style={{ borderColor: '#E5E0DB', borderTopColor: '#C8402A' }} />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <AccessGate
        onAccessGranted={() => {
          sessionStorage.setItem('rocketship_access', 'verified');
          setHasAccess(true);
        }}
      />
    );
  }

  const currentSection = SECTION_TITLES[activeSection];

  return (
    <PresenterProvider value={presenterMode}>
      <div className="min-h-screen" style={{ backgroundColor: '#FFF8F5' }}>
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          presenterMode={presenterMode}
          onTogglePresenterMode={() => setPresenterMode(!presenterMode)}
        />
        <HeaderBar activeSection={activeSection} />

        {/* Jetpacked framing banner — complements, not competes */}
        <div
          className="fixed left-[220px] right-0 flex items-center justify-center border-b z-20"
          style={{
            top: 56,
            height: 32,
            backgroundColor: '#FFF3E8',
            borderColor: '#E5E0DB',
          }}
        >
          <span
            className="text-center px-4"
            style={{ color: '#C8402A', fontSize: 12 }}
          >
            Built as an instructional intelligence layer for the Rocketship Innovation School — designed to
            complement your existing Jetpacked data platform with classroom-grounded adaptive learning capabilities.
          </span>
        </div>

        <main className="ml-[220px] pt-[88px] p-6">
          <SectionWrapper
            title={currentSection.title}
            subtitle={presenterMode ? undefined : currentSection.subtitle}
            isActive={true}
            sectionKey={activeSection}
          >
            {activeSection === 'ell-copilot' && <Section1ELLCoPilot />}
            {activeSection === 'teacher-brief' && <Section2TeacherBrief />}
            {activeSection === 'ai-copilot' && <Section3AICoPilot />}
            {activeSection === 'dashboard' && <Section4Dashboard />}
            {activeSection === 'proposal' && <Section5Proposal />}
          </SectionWrapper>
        </main>
      </div>
    </PresenterProvider>
  );
}
