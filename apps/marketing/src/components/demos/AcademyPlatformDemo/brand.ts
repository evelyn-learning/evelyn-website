/**
 * Brand model for the Academy demo. Mirrors how the real platform is themed:
 * a brand is a name + a palette, applied as tokens — a rebrand never touches
 * a component. Here the tokens are CSS variables on the demo frame root.
 */

import type { CSSProperties } from 'react';

export interface DemoBrand {
  id: string;
  name: string;
  primary: string;
  accent: string;
}

export const CUSTOM_BRAND_ID = 'custom';
export const MAX_BRAND_NAME = 40;

export const BRAND_PRESETS: DemoBrand[] = [
  { id: 'academy', name: 'Evelyn Academy', primary: '#2563eb', accent: '#f59e0b' },
  { id: 'crimsora', name: 'Crimsora', primary: '#a51c30', accent: '#d97706' },
  { id: 'evelyn', name: 'Evelyn Tutor', primary: '#0d9488', accent: '#f97316' },
];

export const DEFAULT_CUSTOM_BRAND: DemoBrand = {
  id: CUSTOM_BRAND_ID,
  name: 'Your Institute',
  primary: '#7c3aed',
  accent: '#f59e0b',
};

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function isHexColor(value: string): boolean {
  return HEX_RE.test(value);
}

/** WCAG relative luminance of a #rrggbb colour. */
function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/** Text colour that stays readable on top of `hex` — a visitor can pick any colour. */
export function readableOn(hex: string): string {
  if (!isHexColor(hex)) return '#ffffff';
  return luminance(hex) > 0.45 ? '#0f172a' : '#ffffff';
}

export function brandInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'A';
  return words.slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
}

export function brandStyle(brand: DemoBrand): CSSProperties {
  const primary = isHexColor(brand.primary) ? brand.primary : BRAND_PRESETS[0]!.primary;
  return {
    '--ab-primary': primary,
    '--ab-primary-fg': readableOn(primary),
    '--ab-soft': `color-mix(in srgb, ${primary} 10%, white)`,
    '--ab-mid': `color-mix(in srgb, ${primary} 45%, white)`,
    '--ab-accent': isHexColor(brand.accent) ? brand.accent : '#f59e0b',
  } as CSSProperties;
}
