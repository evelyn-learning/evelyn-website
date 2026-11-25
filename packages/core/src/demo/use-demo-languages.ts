'use client';
/**
 * The languages a picker offers: the built-in list at first paint, then the engine's live list
 * (demo-languages.ts fetchDemoLanguages). A language added to the engine shows up here by itself.
 */
import { useEffect, useState } from 'react';
import { DEMO_LANGUAGES, fetchDemoLanguages, type DemoLanguage } from './demo-languages';

export function useDemoLanguages(origin = ''): readonly DemoLanguage[] {
  const [languages, setLanguages] = useState<readonly DemoLanguage[]>(DEMO_LANGUAGES);
  useEffect(() => {
    let on = true;
    void fetchDemoLanguages(origin).then((rows) => { if (on && rows) setLanguages(rows); });
    return () => { on = false; };
  }, [origin]);
  return languages;
}
