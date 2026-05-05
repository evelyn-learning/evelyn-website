/**
 * Grades 6-8 Computer Science — Digital Literacy.
 *
 * How the internet works at a high level, password hygiene, source
 * evaluation, digital footprint.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_CS_DIGITAL_LITERACY: LessonPlan = {
  id: 'evelyn.cs.6-8.digital-literacy.v1',
  title: 'Digital literacy — internet basics, passwords, sources',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'cs',
  topic: 'digital-literacy',
  locale: 'en',
  los: [
    {
      id: 'cs68.digital',
      description: 'Explain how a web request works at a high level, evaluate online source credibility, and apply password best practices.',
      standard: 'CSTA-2-NI-05',
    },
  ],
  prerequisites: [],
  followUps: ['cs912.cybersecurity'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame digital literacy as understanding tools you already use daily.',
      script: 'You probably visit dozens of websites a day, send messages, watch videos. But do you know what actually HAPPENS when you tap a link? And why some passwords get hacked in seconds while others would take a thousand years? This stuff is invisible — and that\'s why most people get fooled by it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-internet',
      kind: 'concept',
      goal: 'Web request flow + password strength + source evaluation.',
      keyIdeas: [
        'When you type evelynlearning.com: your browser asks DNS "what IP address is this?", then sends an HTTP REQUEST to that IP, which sends back HTML.',
        'IP ADDRESS: a number that uniquely identifies a server (like a phone number for a computer).',
        'HTTPS = HTTP + encryption. The S means data is scrambled in transit so eavesdroppers see gibberish.',
        'PASSWORDS: length matters more than weird characters. "horsebatterystaple" is FAR stronger than "P@$$w0rd1!".',
        'PASSWORD MANAGER: the right answer. Generates long random unique passwords, remembers them for you.',
        'TWO-FACTOR (2FA): even if password leaks, attacker needs your phone too. Always turn it on.',
        'EVALUATING SOURCES: who wrote it? do they cite primary evidence? does it appear elsewhere? a single blog ≠ a peer-reviewed journal.',
        'DIGITAL FOOTPRINT: things you post are durable. Screenshots, archive sites, screenshots of screenshots.',
      ],
      vocabulary: [
        { term: 'DNS', definition: 'Domain Name System — translates domain names to IP addresses.' },
        { term: 'HTTPS', definition: 'encrypted version of HTTP; the S means secure.' },
        { term: '2FA', definition: 'two-factor authentication — a second proof of identity beyond password.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-strength',
      kind: 'worked_example',
      problem: 'Which password is stronger: "P@ssw0rd!" or "purple-elephant-cycling-quietly"?',
      steps: [
        '"P@ssw0rd!" — 9 characters, common base word with predictable substitutions. Crackers test this pattern in milliseconds.',
        '"purple-elephant-cycling-quietly" — 30 characters, four unrelated words. Even with a dictionary attack, the combinations explode.',
        'Length × randomness wins. Four unrelated words ≈ trillions of years to brute-force.',
      ],
      answer: '"purple-elephant-cycling-quietly" is far stronger.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You see a viral claim: "scientists say chocolate cures the flu." What three questions should you ask before sharing?',
      expectedAnswer: 'who said it / where was it published (peer-reviewed?) / does another source confirm it',
      responseFormat: 'free',
      hints: [
        'Source credibility: who is "scientists"? Named researchers? A university?',
        'Primary vs secondary: is this a study, or a blog summarizing a tweet?',
        'Independent confirmation: does any other reputable source agree?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-incognito',
      kind: 'misconception_check',
      question: 'A student says: "Incognito mode means nobody can track me online." Why is that wrong?',
      commonErrors: [
        {
          answer: 'because the browser is private',
          misconception: 'Confusing local privacy with network privacy.',
          correctsTo: 'Incognito only stops YOUR browser from saving history. Your school, your internet provider, the websites you visit, and any logged-in accounts can still see everything. Incognito hides your tracks at home — not on the network.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A web request: browser → DNS → server IP → HTTP back. HTTPS is encrypted.',
        'Long random unique passwords beat clever short ones. Use a password manager.',
        'Always enable 2FA on important accounts.',
        'Evaluate sources: who, where, confirmed by whom.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
