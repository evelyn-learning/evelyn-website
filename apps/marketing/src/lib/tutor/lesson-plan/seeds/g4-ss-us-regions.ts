/**
 * G4 — Five regions of the United States.
 *
 * Northeast, Southeast, Midwest, Southwest, West. Geography,
 * climate, and resources of each.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_SS_US_REGIONS: LessonPlan = {
  id: 'evelyn.g4.ss.us-geography.regions.v1',
  title: 'The five regions of the United States',
  curriculum: 'NCSS',
  grade: '4',
  subject: 'ss',
  topic: 'us-geography',
  locale: 'en',
  los: [
    {
      id: 'ncss.35.geography.regions',
      description: 'Identify regions of the United States by location, climate, and resources.',
      standard: 'NCSS.D2.Geo.5.3-5',
    },
  ],
  prerequisites: ['ncss.35.geography.places'],
  followUps: ['ncss.68.geography.world-regions'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Tap into something the student knows about a US place.',
      script: 'New York City is famous for skyscrapers. Texas is famous for cowboys and BBQ. California is famous for beaches and Hollywood. Why are these places so DIFFERENT? Geography — and that\'s what regions are about.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-regions',
      kind: 'concept',
      goal: 'The US splits into 5 regions based on location, climate, and what\'s grown or made there.',
      keyIdeas: [
        'NORTHEAST: small area, lots of cities (NY, Boston, Philadelphia). Cold winters. Famous for finance and history.',
        'SOUTHEAST: humid, warm. Florida beaches, Georgia peaches, Mississippi River delta. States: Florida, Georgia, North Carolina, etc.',
        'MIDWEST: flat farmland — "America\'s breadbasket". Corn, wheat, soybeans. States: Iowa, Illinois, Ohio, Michigan.',
        'SOUTHWEST: dry deserts and canyons. Texas, Arizona, New Mexico, Oklahoma. Cowboy and Mexican-American culture.',
        'WEST: mountains, deserts, Pacific coast. California, Washington, Oregon, plus mountains in Colorado and Nevada. Tech, movies, redwoods.',
      ],
      vocabulary: [
        { term: 'region', definition: 'an area where places share similar geography or culture.' },
        { term: 'climate', definition: 'the typical weather of a place over time.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-which-region',
      kind: 'worked_example',
      problem: 'Iowa is famous for corn and wheat farms on flat land. Which region is it in?',
      steps: [
        'Flat farmland → that\'s a clue.',
        'Corn and wheat → "America\'s breadbasket".',
        'That\'s the MIDWEST region.',
      ],
      answer: 'Midwest',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Arizona is hot, dry, has the Grand Canyon, and lots of desert. Which region?',
      expectedAnswer: 'Southwest',
      responseFormat: 'free',
      hints: [
        'Dry deserts → which region?',
        'Grand Canyon is in Arizona — and Arizona is in the…',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-state-vs-region',
      kind: 'misconception_check',
      question: 'Is Texas its own region?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating big states as their own region.',
          correctsTo: 'No — Texas is in the SOUTHWEST region (along with New Mexico, Arizona, Oklahoma). Big as it is, it shares geography and history with its neighbors.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five regions: Northeast, Southeast, Midwest, Southwest, West.',
        'Each has its own climate, geography, and what grows there.',
        'Region tells you a LOT about why people live and work there a certain way.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do most US movies and TV shows get made in the West region?',
      hint: 'Think Hollywood — California has a special climate and history with film.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
