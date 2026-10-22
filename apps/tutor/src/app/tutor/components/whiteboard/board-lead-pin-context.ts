import { createContext, type ReactNode } from 'react';

/**
 * The one-problem homework question pin, handed from SessionStage to the
 * WhiteboardCanvas it hosts (GAC round 11, owner ruling 2026-10-22): the pin
 * sits IN the board flow, under the pre-built figure — never a row above the
 * board card (the figure jumped down when the first question arrived) and
 * never floating over the drawing. Null (the default, and every session
 * without a problem panel) ⇒ the canvas renders no slot at all.
 */
export const BoardLeadPinContext = createContext<ReactNode | null>(null);
