'use client';
/**
 * The session's chrome wording (session-strings.ts), handed down the session tree.
 * Outside a provider the hook returns English, so a component used elsewhere is unchanged.
 */
import { createContext, useContext, type ReactNode } from 'react';
import { EN, sessionStrings, type SessionStrings } from './session-strings';

const SessionStringsContext = createContext<SessionStrings>(EN);

/** `languages`: the session's list, lesson language first (`tutorLanguages`). */
export function SessionStringsProvider({ languages, children }: { languages: readonly string[] | null | undefined; children: ReactNode }) {
  // sessionStrings returns one shared object per language: a stable context value without a memo.
  return <SessionStringsContext.Provider value={sessionStrings(languages)}>{children}</SessionStringsContext.Provider>;
}

export function useSessionStrings(): SessionStrings {
  return useContext(SessionStringsContext);
}
