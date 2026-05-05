/**
 * Grades 11-12 Computer Science — Mobile App Development.
 *
 * Native vs hybrid, app lifecycle, UI components, state, platform stores.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_CS_MOBILE_DEVELOPMENT: LessonPlan = {
  id: 'evelyn.cs.11-12.mobile-development.v1',
  title: 'Mobile app development — platforms, lifecycle, UI',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'cs',
  topic: 'mobile-development',
  locale: 'en',
  los: [
    {
      id: 'cs1112.mobile',
      description: 'Compare native vs cross-platform mobile development; describe app lifecycle and basic UI patterns.',
      standard: 'CSTA-3B-AP-22',
    },
  ],
  prerequisites: ['cs1112.oop'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame mobile dev as a platform-choice question first.',
      script: 'Mobile is the most-used computing surface in human history. But the FIRST decision before you write a line of code is: which platforms? iOS only? Android only? Both? Each path has trade-offs in cost, speed, and how native it feels. Get this wrong and you ship 6 months late.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mobile',
      kind: 'concept',
      goal: 'Native, cross-platform, lifecycle, state, stores.',
      keyIdeas: [
        'NATIVE: Swift/SwiftUI for iOS, Kotlin/Jetpack for Android. Best UX, best performance, two codebases.',
        'CROSS-PLATFORM: React Native, Flutter — one codebase, both platforms. Slight UX gaps, faster shipping.',
        'PWA: a web app dressed up to feel like a mobile app. Easiest, but limited platform integration.',
        'APP LIFECYCLE: created → foreground → background → suspended → terminated. Save state when backgrounded; assume the OS may kill you anytime.',
        'UI: trees of components (View, Text, Image, Button). State drives UI; UI doesn\'t store the truth.',
        'STORES: App Store (Apple) and Play Store (Google) review submissions. Apple is famously strict. Plan 1-2 weeks for review.',
        'PERMISSIONS: location, camera, contacts — the user must grant these explicitly. Ask only when you need them, with context.',
      ],
      vocabulary: [
        { term: 'native app', definition: 'an app written in the platform\'s primary language (Swift / Kotlin).' },
        { term: 'lifecycle', definition: 'the sequence of states an app passes through from launch to termination.' },
        { term: 'state', definition: 'data that drives what the UI shows; changes trigger UI re-render.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-choice',
      kind: 'worked_example',
      problem: 'A team of 2 has 3 months and wants to ship on iOS AND Android. Which approach?',
      steps: [
        'Native = two codebases = 2 teams or 2× the time. With 2 people in 3 months, native iOS + native Android = unlikely.',
        'Cross-platform (React Native or Flutter) = one codebase ships both. Realistic in 3 months.',
        'PWA = even faster but limits camera/native integrations.',
        'Decision: cross-platform. Likely React Native (if team knows JS) or Flutter (if they want Dart\'s consistency).',
      ],
      answer: 'Cross-platform (React Native or Flutter).',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A user receives a phone call while using your app. What lifecycle event likely fires, and what should you do?',
      expectedAnswer: 'app moves to background — save unsaved state and pause expensive work',
      responseFormat: 'free',
      hints: [
        'The OS pulls focus away.',
        'Your app might not get to run again before being killed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-permissions',
      kind: 'misconception_check',
      question: 'A student says: "I\'ll request all permissions on app launch so we don\'t have to deal with it later." Why is that a bad idea?',
      commonErrors: [
        {
          answer: 'easier',
          misconception: 'Optimizing for developer convenience over user trust.',
          correctsTo: 'Asking for camera, location, and contacts on launch with no context makes most users deny everything (or uninstall). Best practice: ask just-in-time when the user invokes a feature that needs it, with a one-line explanation. iOS specifically punishes apps that look greedy with permissions in store review.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Native = best UX, two codebases. Cross-platform = one codebase, slight gaps.',
        'Lifecycle: foreground → background → killed. Save state when backgrounded.',
        'UI is a tree driven by state. Change state → UI re-renders.',
        'Permissions: ask just-in-time with context.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
