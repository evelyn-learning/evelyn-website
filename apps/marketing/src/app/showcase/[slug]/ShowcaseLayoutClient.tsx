'use client';

import { ReactNode, createContext, useContext } from 'react';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseFooter } from '@/components/showcase/ShowcaseFooter';
import { ShowcaseSiteData } from '@/components/showcase/ShowcaseContext';
import { DemoBanner } from '@/components/showcase/DemoBanner';
import { ShowcaseChatWidget } from '@/components/showcase/ShowcaseChatWidget';
import { DemoTour } from '@/components/showcase/DemoTour';

// Create a simpler context that just holds the site data
const SiteContext = createContext<ShowcaseSiteData | null>(null);

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within ShowcaseLayoutClient');
  }
  return context;
}

// Re-export for the showcase components to use
export { SiteContext };

interface ShowcaseLayoutClientProps {
  children: ReactNode;
  site: ShowcaseSiteData;
}

export function ShowcaseLayoutClient({ children, site }: ShowcaseLayoutClientProps) {
  // Calculate trial expiration (default: 14 days from creation)
  const trialExpiresAt = site.trialExpiresAt
    ? new Date(site.trialExpiresAt)
    : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  return (
    <SiteContext.Provider value={site}>
      <div className="min-h-screen flex flex-col">
        <DemoBanner trialExpiresAt={trialExpiresAt} />
        <ShowcaseHeader />
        <main className="flex-1">
          {children}
        </main>
        <ShowcaseFooter />
        <ShowcaseChatWidget />
        <DemoTour />
      </div>
    </SiteContext.Provider>
  );
}
