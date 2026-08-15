/**
 * Grades 9-10 Computer Science — Cybersecurity Basics.
 *
 * Threat model thinking, common attacks (phishing, MITM, SQL injection),
 * encryption at a high level.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_CS_CYBERSECURITY: LessonPlan = {
  id: 'evelyn.cs.9-10.cybersecurity.v1',
  title: 'Cybersecurity basics — threats, encryption, defense',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'cs',
  topic: 'cybersecurity',
  locale: 'en',
  los: [
    {
      id: 'cs910.cybersecurity',
      description: 'Identify common attack types, explain how encryption protects data in transit, and describe basic defenses.',
      standard: 'CSTA-3A-NI-05',
    },
  ],
  prerequisites: ['cs68.digital'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame security as a game between attackers and defenders, not a feature.',
      script: 'Security isn\'t a checkbox. It\'s a continuous game: attackers find new ways in, defenders patch them, repeat. The biggest companies get breached every year — not because they\'re lazy, but because the game is hard. Today: how attacks actually work, and what defends against them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-attacks',
      kind: 'concept',
      goal: 'Phishing, MITM, SQL injection, encryption, hashing.',
      keyIdeas: [
        'PHISHING: a fake login page or email that tricks the user into giving credentials. The most common breach vector by far.',
        'MAN-IN-THE-MIDDLE (MITM): attacker sits between you and the server, reads everything. HTTPS prevents this — that\'s why it matters.',
        'SQL INJECTION: user input naively concatenated into SQL. Type \'; DROP TABLE users; -- in a search box and bad code runs it.',
        'BRUTE FORCE: trying millions of passwords. Defended by long passwords + account lockouts + 2FA.',
        'ENCRYPTION: scrambles data so only someone with the key can read it. Symmetric (one key) and asymmetric (public/private key pair).',
        'HTTPS uses asymmetric handshake to agree on a symmetric session key, then symmetric for speed.',
        'HASHING: one-way scrambling. Used for passwords (server stores hashes, not passwords). Can\'t reverse — only compare.',
        'DEFENSE IN DEPTH: assume any single layer can fail. Stack multiple defenses.',
      ],
      vocabulary: [
        { term: 'phishing', definition: 'social-engineering attack that fools users into handing over credentials.' },
        { term: 'encryption', definition: 'scrambling data using a key so only key-holders can read it.' },
        { term: 'hash', definition: 'a one-way fingerprint of data; can\'t be reversed back to the original.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sql-inj',
      kind: 'worked_example',
      problem: 'Why is this code vulnerable? query = "SELECT * FROM users WHERE name = \'" + userInput + "\'"',
      steps: [
        'Suppose userInput = \'; DROP TABLE users; --',
        'The query becomes: SELECT * FROM users WHERE name = \'\'; DROP TABLE users; --\'',
        'The semicolon ends the SELECT, runs DROP TABLE, comments out the rest.',
        'FIX: use PARAMETERIZED queries. The database treats input as DATA not CODE.',
        '// Safe: cursor.execute("SELECT * FROM users WHERE name = ?", (userInput,))',
      ],
      answer: 'The user input is treated as code; parameterized queries fix this.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why do servers store hashed passwords instead of plaintext?',
      expectedAnswer: 'so a database breach doesn\'t reveal the actual passwords',
      responseFormat: 'free',
      hints: [
        'Even good companies sometimes get hacked.',
        'Hashing is one-way; the server can verify a password by hashing the attempt and comparing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-https-secure',
      kind: 'misconception_check',
      question: 'A student says: "If a site uses HTTPS, it\'s safe to use." Why is that misleading?',
      commonErrors: [
        {
          answer: 'because the lock icon means safe',
          misconception: 'Conflating encryption-in-transit with overall trust.',
          correctsTo: 'HTTPS only guarantees that the connection to the server is encrypted. It says NOTHING about whether the server is honest. A scam site can absolutely have HTTPS — many do, because certificates are free now. The lock icon means "no one between us is listening", not "this site is who it claims".',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Phishing is #1 attack vector. Train your eyes.',
        'HTTPS prevents MITM but doesn\'t verify site honesty.',
        'SQL injection: never concatenate user input into queries.',
        'Hash passwords; don\'t store them.',
        'Defense in depth: assume any one layer can fail.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
