/**
 * Fixture specs of batch 5 (2026-10-16), collected from the part files
 * (practice-figure-fixtures-b5-<part>.ts). practice-figure-fixtures.ts appends
 * them to `FIGURE_FIXTURES`, after every earlier fixture.
 *
 * Conventions (test-practice-figure-batch5*.ts hold them), as batch 4:
 *   - a new kind or variant has ≥ 3 fixtures under one id prefix: one whose
 *     note starts "simple", one whose note contains "dense", and one with
 *     "blank" in its ID that really shows a "?";
 *   - a fixture for a to-do fix of the round (a–k) is `fix5-<letter>-…` and
 *     its note starts "<letter>: ";
 *   - a fixture that is MEANT to trip a legibility warning says "warns" in
 *     its note; every other fixture is clean under `checkFigureLegibility`.
 */
import type { FigureFixture } from './practice-figure-fixtures';
import { FIXTURES as BIO } from './practice-figure-fixtures-b5-bio';
import { FIXTURES as EM } from './practice-figure-fixtures-b5-em';
import { FIXTURES as MODERN } from './practice-figure-fixtures-b5-modern';
import { FIXTURES as TABLE } from './practice-figure-fixtures-b5-table';
import { FIXTURES as FIXES_BIO } from './practice-figure-fixtures-b5-fixes-bio';
import { FIXTURES as FIXES_EM } from './practice-figure-fixtures-b5-fixes-em';
import { FIXTURES as FIXES_BARS } from './practice-figure-fixtures-b5-fixes-bars';
import { FIXTURES as FIXES_MATH } from './practice-figure-fixtures-b5-fixes-math';
import { FIXTURES as FIXES_ALT } from './practice-figure-fixtures-b5-fixes-alt';

export const BATCH5_FIXTURES: FigureFixture[] = [...BIO, ...EM, ...MODERN, ...TABLE, ...FIXES_BIO, ...FIXES_EM, ...FIXES_BARS, ...FIXES_MATH, ...FIXES_ALT];
