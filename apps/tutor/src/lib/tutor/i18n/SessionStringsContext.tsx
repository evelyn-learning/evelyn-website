'use client';
/**
 * The session's chrome wording (session-strings.ts), handed down the session tree.
 * Outside a provider the hook returns English, so a component used elsewhere is unchanged.
 */
import { createContext, useContext, type ReactNode } from 'react';
import { EN, sessionStrings, type SessionStrings } from './session-strings';

const SessionStringsContext = createContext<SessionStrings>(EN);
const SessionLanguagesContext = createContext<readonly string[] | null>(null);

/** `languages`: the session's list, lesson language first (`tutorLanguages`). */
export function SessionStringsProvider({ languages, children }: { languages: readonly string[] | null | undefined; children: ReactNode }) {
  // sessionStrings returns one shared object per language: a stable context value without a memo.
  return <SessionLanguagesContext.Provider value={languages ?? null}><SessionStringsContext.Provider value={sessionStrings(languages)}>{children}</SessionStringsContext.Provider></SessionLanguagesContext.Provider>;
}

export function useSessionStrings(): SessionStrings {
  return useContext(SessionStringsContext);
}

/** The session's languages, lesson language first; null outside a session or in an English-only one. The
 *  session PDF picks its Chinese or Japanese font from it. */
export function useSessionLanguages(): readonly string[] | null {
  return useContext(SessionLanguagesContext);
}
