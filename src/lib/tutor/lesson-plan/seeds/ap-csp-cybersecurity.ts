/**
 * AP CSP — Cybersecurity.
 *
 * Encryption (symmetric / asymmetric), HTTPS, phishing, malware, trust models.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSP_CYBERSECURITY: LessonPlan = {
  id: 'evelyn.ap.csp.cybersecurity.v1',
  title: 'Cybersecurity Fundamentals',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'cs',
  topic: 'ap-cs-principles',
  locale: 'en',
  los: [
    {
      id: 'apcsp.cybersecurity',
      description: 'Explain how symmetric and public-key encryption work, identify common attacks (phishing, malware), and analyze trust assumptions.',
      standard: 'AP-CSP-5.D',
    },
  ],
  prerequisites: ['apcsp.internet'],
  followUps: ['apcsp.impact-computing'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Encryption as keys without trust.',
      script: 'When you log into your bank, your browser and the bank exchange messages over the internet — through routers run by people you\'ve never met. How does the bank know it\'s really you, and how do you know nobody is reading your password? The answer is encryption: math you can do but not undo without a secret key.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-encryption',
      kind: 'concept',
      goal: 'Symmetric vs public-key encryption, HTTPS, attacks.',
      keyIdeas: [
        'SYMMETRIC ENCRYPTION: same key for encrypting and decrypting. Fast. Problem: how do you share the key without someone overhearing?',
        'PUBLIC-KEY (asymmetric) ENCRYPTION: each party has TWO keys, a public one (shared openly) and a private one (kept secret). Anyone can encrypt with your public key, but only you can decrypt with your private key. Solves the key-exchange problem.',
        'HTTPS uses public-key crypto to negotiate a symmetric key, then switches to symmetric for speed. Best of both.',
        'CERTIFICATES + CERTIFICATE AUTHORITIES: when your browser visits a site, it gets the site\'s public key signed by a trusted authority (Let\'s Encrypt, DigiCert, etc.). The browser already trusts that authority, so it knows the public key really belongs to the site.',
        'PHISHING: an attacker tricks YOU into giving up your password (fake login page, urgent email, etc.). Encryption can\'t stop this — it\'s a human-trust problem.',
        'MALWARE: software that runs on your machine to steal data, encrypt your files for ransom, or join a botnet. Defense: don\'t run untrusted code, keep software updated, use antivirus.',
        'BRUTE FORCE: trying every password until one works. Defense: long passwords (each extra character multiplies the search space), rate-limiting, MFA.',
        'MULTI-FACTOR AUTHENTICATION (MFA): something you know (password) + something you have (phone) + something you are (fingerprint). Even if one is compromised, attacker needs the others.',
      ],
      vocabulary: [
        { term: 'symmetric encryption', definition: 'one shared key for both encrypting and decrypting.' },
        { term: 'public-key encryption', definition: 'two keys per person — public for encrypting, private for decrypting.' },
        { term: 'phishing', definition: 'tricking a user into voluntarily giving up credentials.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-https',
      kind: 'worked_example',
      problem: 'Trace what happens when you visit https://yourbank.com — how does encryption protect your password?',
      steps: [
        'STEP 1: Browser connects, asks for the bank\'s certificate. Bank sends its public key + a certificate signed by a CA the browser trusts.',
        'STEP 2: Browser verifies the certificate signature against the trusted CA list. ✓ confirms "this public key really belongs to yourbank.com".',
        'STEP 3: Browser generates a fresh random SYMMETRIC key, encrypts it with the bank\'s public key, and sends it. Only the bank (with its private key) can decrypt.',
        'STEP 4: Both sides now share the symmetric key. They use it for fast bulk encryption of all subsequent traffic.',
        'STEP 5: You type your password. Browser encrypts it with the symmetric key before sending. Anyone listening on the network sees gibberish.',
        'BANK can decrypt → checks password → grants access. Eavesdroppers see only ciphertext.',
      ],
      answer: 'Public-key crypto is used to safely exchange a symmetric key; symmetric encryption then protects all traffic, including your password.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You receive an email saying "Your bank account was compromised. Click here to verify your password." Even with strong encryption, why is this still a threat?',
      expectedAnswer: 'Phishing — encryption protects data in transit but doesn\'t stop you from voluntarily entering your password into a fake site that an attacker controls.',
      responseFormat: 'free',
      hints: [
        'Encryption protects against eavesdroppers, not against trickery.',
        'If YOU type your password into the wrong site, encryption can\'t help.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-encryption-stops-everything',
      kind: 'misconception_check',
      question: 'If a website uses HTTPS, are you completely safe from being hacked?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating HTTPS as a total security solution.',
          correctsTo: 'No — HTTPS only protects data in transit between your browser and the server. It doesn\'t stop: phishing (you typing into a fake site), malware on your device, weak passwords, server-side breaches that leak the database. Security is layered. HTTPS is necessary but not sufficient.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Symmetric: one shared key. Public-key: two keys per person.',
        'HTTPS uses public-key to negotiate a symmetric session key, then encrypts traffic.',
        'Certificates from a trusted CA prove a public key belongs to a real site.',
        'Encryption doesn\'t stop phishing or malware. Layered defense matters.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are passwords stored as HASHES, not as plain text, even on the server?',
      hint: 'Hash is one-way math. If the server is breached and the hash file leaks, attackers can\'t directly read passwords. They\'d have to guess + hash + compare. Salt + slow-hash (bcrypt, Argon2) make brute force impractical. Plain-text storage means one breach = every password leaked.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
