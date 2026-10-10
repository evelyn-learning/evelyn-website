/**
 * Fixture specs of batch 4 (2026-10-14), collected from the part files
 * (practice-figure-fixtures-b4-<part>.ts). practice-figure-fixtures.ts appends
 * them to `FIGURE_FIXTURES`, after every earlier fixture.
 *
 * Conventions (test-practice-figure-batch4*.ts hold them):
 *   - a new kind or variant has ≥ 3 fixtures under one id prefix: one whose
 *     note starts "simple", one whose note contains "dense", and one with
 *     "blank" in its ID that really shows a "?";
 *   - a fixture for a to-do fix of the round is `fix4-<letter>-…` and its
 *     note starts "<letter>: ";
 *   - a fixture that is MEANT to trip a legibility warning says "warns" in
 *     its note; every other fixture is clean under `checkFigureLegibility`.
 */
import type { FigureFixture } from './practice-figure-fixtures';
import { FIXTURES as BARS } from './practice-figure-fixtures-b4-bars';
import { FIXTURES as BIO } from './practice-figure-fixtures-b4-bio';
import { FIXTURES as CHEM } from './practice-figure-fixtures-b4-chem';
import { FIXTURES as FIXES_D } from './practice-figure-fixtures-b4-fixes-d';
import { FIXTURES as FIXES_E } from './practice-figure-fixtures-b4-fixes-e';
import { FIXTURES as FIXES_F } from './practice-figure-fixtures-b4-fixes-f';
import { FIXTURES as MATH } from './practice-figure-fixtures-b4-math';
import { FIXTURES as MECH } from './practice-figure-fixtures-b4-mech';
import { FIXTURES as WAVE } from './practice-figure-fixtures-b4-wave';

export const BATCH4_FIXTURES: FigureFixture[] = [...MATH, ...MECH, ...WAVE, ...CHEM, ...BIO, ...BARS, ...FIXES_D, ...FIXES_E, ...FIXES_F];
