/**
 * Brand tokens for the Academy demo. The demo is shown as a neutral
 * "Your Brand" academy at yourbrand.com — the visitor's own institution
 * goes here. Mirrors how the real platform is themed: a brand is a name +
 * a palette applied as tokens (CSS variables on the frame root), so a
 * rebrand never touches a component.
 */

import type { CSSProperties } from 'react';

export const DEMO_BRAND = {
  name: 'Your Brand',
  initials: 'YB',
  domain: 'yourbrand.com',
  primary: '#2563eb',
  primaryFg: '#ffffff',
  accent: '#f59e0b',
};

export const BRAND_STYLE = {
  '--ab-primary': DEMO_BRAND.primary,
  '--ab-primary-fg': DEMO_BRAND.primaryFg,
  '--ab-soft': `color-mix(in srgb, ${DEMO_BRAND.primary} 10%, white)`,
  '--ab-mid': `color-mix(in srgb, ${DEMO_BRAND.primary} 45%, white)`,
  '--ab-accent': DEMO_BRAND.accent,
} as CSSProperties;
