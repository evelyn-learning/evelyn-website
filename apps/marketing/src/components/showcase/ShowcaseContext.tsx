'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Content section for dynamic page rendering
export interface ShowcaseSectionData {
  type: "hero" | "text" | "heading" | "image" | "gallery" | "list" | "cards" | "cta" | "testimonials" | "team" | "faq" | "pricing" | "contact" | "raw";
  title?: string;
  subtitle?: string;
  content?: string;
  items?: string[];
  images?: Array<{ url: string; alt: string; caption?: string }>;
  cards?: Array<{
    title: string;
    description?: string;
    image?: string;
    price?: string;
    link?: string;
  }>;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
  fullWidth?: boolean;
}

// Per-page content for dynamic rendering
export interface ShowcasePageData {
  path: string;
  title: string;
  navLabel?: string;
  sections: ShowcaseSectionData[];
  heroImage?: string;
  metaDescription?: string;
}

// Navigation item with path
export interface ShowcaseNavItemData {
  label: string;
  path: string;
  originalUrl?: string;
}

export interface ShowcaseSiteData {
  slug: string;
  businessName: string;
  tagline?: string;
  businessType: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl?: string;
    logoText?: string;
    heroImageUrl?: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    businessHours?: string;
  };
  pages: Record<string, unknown>;
  testimonials?: Array<{ quote: string; author: string; role?: string; imageUrl?: string }>;
  stats?: Array<{ value: string; label: string }>;
  team?: Array<{ name: string; role?: string; bio?: string; imageUrl?: string }>;
  images?: Array<{ url: string; alt: string; context: string }>;
  navItems?: string[];
  // New: Navigation with paths for dynamic routing
  navigation?: ShowcaseNavItemData[];
  // New: Scraped pages with content for dynamic rendering
  scrapedPages?: ShowcasePageData[];
  enabledTools?: string[];
  status: string;
  daysRemaining?: number;
  trialExpiresAt?: string | Date;
}

interface ShowcaseContextType {
  site: ShowcaseSiteData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isStaffAuthenticated: boolean;
  error: string | null;
  verifyAccess: (accessCode: string) => Promise<boolean>;
  verifyStaffAccess: (accessCode: string) => Promise<boolean>;
  logout: () => void;
}

const ShowcaseContext = createContext<ShowcaseContextType | undefined>(undefined);

export function ShowcaseProvider({
  children,
  slug
}: {
  children: ReactNode;
  slug: string;
}) {
  const [site, setSite] = useState<ShowcaseSiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const publicSession = sessionStorage.getItem(`showcase_public_${slug}`);
      const staffSession = sessionStorage.getItem(`showcase_staff_${slug}`);

      if (publicSession) {
        try {
          const data = JSON.parse(publicSession);
          setSite(data.site);
          setIsAuthenticated(true);
        } catch {
          sessionStorage.removeItem(`showcase_public_${slug}`);
        }
      }

      if (staffSession) {
        try {
          const data = JSON.parse(staffSession);
          setSite(data.site);
          setIsStaffAuthenticated(true);
          setIsAuthenticated(true);
        } catch {
          sessionStorage.removeItem(`showcase_staff_${slug}`);
        }
      }

      setIsLoading(false);
    };

    checkSession();
  }, [slug]);

  const verifyAccess = async (accessCode: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/showcase/${slug}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSite(data.site);
        setIsAuthenticated(true);
        sessionStorage.setItem(`showcase_public_${slug}`, JSON.stringify({
          site: data.site,
          timestamp: Date.now()
        }));
        return true;
      } else {
        setError(data.error || 'Invalid access code');
        return false;
      }
    } catch {
      setError('Network error. Please try again.');
      return false;
    }
  };

  const verifyStaffAccess = async (accessCode: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/showcase/${slug}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode, staffAccess: true }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSite(data.site);
        setIsAuthenticated(true);
        setIsStaffAuthenticated(true);
        sessionStorage.setItem(`showcase_staff_${slug}`, JSON.stringify({
          site: data.site,
          timestamp: Date.now()
        }));
        return true;
      } else {
        setError(data.error || 'Invalid access code');
        return false;
      }
    } catch {
      setError('Network error. Please try again.');
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem(`showcase_public_${slug}`);
    sessionStorage.removeItem(`showcase_staff_${slug}`);
    setSite(null);
    setIsAuthenticated(false);
    setIsStaffAuthenticated(false);
  };

  return (
    <ShowcaseContext.Provider
      value={{
        site,
        isLoading,
        isAuthenticated,
        isStaffAuthenticated,
        error,
        verifyAccess,
        verifyStaffAccess,
        logout
      }}
    >
      {children}
    </ShowcaseContext.Provider>
  );
}

export function useShowcase() {
  const context = useContext(ShowcaseContext);
  if (context === undefined) {
    throw new Error('useShowcase must be used within a ShowcaseProvider');
  }
  return context;
}
