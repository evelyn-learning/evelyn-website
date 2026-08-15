import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for AP
 * World Unit-9: life expectancy at birth, world and three regions, 1950 vs
 * 2019, from the UN Population Division's World Population Prospects (2024
 * revision). All eight figures are the REAL published period-life-expectancy
 * estimates, verified against the WPP indicator (as reproduced by Our World
 * in Data, "UN, World Population Prospects (2024)"): World 46.4 -> 72.6;
 * Africa 37.2 -> 62.4; Asia 42.0 -> 74.0; Europe 62.0 -> 78.8 (all rounded to
 * the nearest whole year in the description below). Every region gains
 * across the period; Asia's +32-year gain is the largest of the three shown
 * (Africa +25, Europe +17), and is cited honestly as such — this is the
 * intended "identify the largest gain" anchor. 2019 is used rather than a
 * more recent year because it is the last full pre-pandemic year in the WPP
 * series (the 2020-21 COVID-19 mortality shock produced a temporary global
 * decline that would complicate a single before/after comparison). Text-only
 * passage, so fullText is a factual DESCRIPTION of the table (how a
 * data-table document is presented for analysis), not the table itself -
 * mirrors the visual-document pattern used for described images.
 */
export const PASSAGE_APWORLD_LIFE_EXPECTANCY_TABLE: Passage = {
  id: 'evelyn.passage.apworld-life-expectancy-table.v1',
  title: 'World and Regional Life Expectancy at Birth (data table, 1950 and 2019)',
  author: 'United Nations Population Division',
  year: 2026,
  sourceUrl: 'https://population.un.org/wpp/',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table adapted from the United Nations Population Division\'s World Population Prospects, showing life expectancy at birth, in years, for the world and three major regions, at two points sixty-nine years apart — 1950 and 2019 (the last full year before the COVID-19 pandemic\'s temporary global decline in life expectancy). World: 46 years in 1950, rising to 73 years in 2019, a gain of about 27 years by the rounded figures shown. Africa: 37 years in 1950, rising to 62 years in 2019, a gain of about 25 years. Asia: 42 years in 1950, rising to 74 years in 2019, a gain of about 32 years — the largest gain of the three regions shown. Asia started 1950 above Africa but below both the world figure and Europe; by 2019 Asia\'s life expectancy exceeds both the world average and Africa\'s, though it still trails Europe\'s. Europe: 62 years in 1950, rising to 79 years in 2019, a gain of about 17 years — the smallest gain of the three, reflecting its already comparatively high starting point in 1950. Every region gained life expectancy over the period, but Asia — despite not starting the lowest of the three — gained the most years of any region shown, narrowing (without closing) the regional gap with Europe. Figures are period-life-expectancy estimates (a snapshot of the mortality conditions prevailing in the stated year, not the eventual lifespan of any real birth cohort) and are rounded to the nearest whole year.',
  lineNumbered: false,
  wordCount: 246,
};
