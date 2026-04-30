/**
 * AP Gov — Presidency and Bureaucracy.
 *
 * Constitutional powers, executive orders, the bureaucracy, oversight.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_GOV_PRESIDENCY: LessonPlan = {
  id: 'evelyn.ap.gov.presidency.v1',
  title: 'Presidency and the Bureaucracy',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ss',
  topic: 'ap-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.presidency',
      description: 'Identify the president\'s constitutional powers, distinguish formal vs informal powers, and explain the structure and oversight of the federal bureaucracy.',
      standard: 'AP-GOV-2.B',
    },
  ],
  prerequisites: ['apgov.constitution', 'apgov.congress'],
  followUps: ['apgov.judicial'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the presidency as more powerful than Article II suggests.',
      script: 'Article II of the Constitution describes the presidency in just over 1000 words — surprisingly little. Most of what we recognize as presidential power today comes from precedent, executive orders, and the office\'s growing role in foreign affairs. Lincoln, FDR, and modern presidents stretched the office well beyond what the framers wrote.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-powers',
      kind: 'concept',
      goal: 'Formal vs informal powers, executive branch structure, oversight.',
      keyIdeas: [
        'FORMAL POWERS (in Constitution): commander-in-chief; nominates federal judges, ambassadors, cabinet (Senate confirms); makes treaties (Senate ratifies 2/3); vetoes legislation; pardons.',
        'INFORMAL POWERS (developed via practice): executive orders; signing statements (interpreting how laws will be enforced); executive privilege; bully pulpit (using public addresses to shape opinion); legislative leadership (proposing the agenda).',
        'EXECUTIVE ORDERS: directives to the executive branch with the force of law for federal agencies. Don\'t require congressional approval, but Congress can pass laws to override OR a court can rule them unconstitutional.',
        'PRESIDENTIAL APPOINTMENTS: 4000+ positions, ~1200 require Senate confirmation. Cabinet, ambassadors, federal judges. Tenure varies — judges for life, cabinet at the president\'s pleasure.',
        'BUREAUCRACY: about 2 million civilian federal employees. CABINET DEPARTMENTS (15, e.g. Defense, State, Treasury). INDEPENDENT AGENCIES (EPA, NASA). REGULATORY COMMISSIONS (FCC, SEC) — semi-insulated from presidential control. GOVERNMENT CORPORATIONS (USPS, Amtrak).',
        'CIVIL SERVICE: most federal employees protected from political firing (Pendleton Act 1883 ended spoils system). Career staff carry institutional knowledge across administrations.',
        'OVERSIGHT: Congress checks the bureaucracy via budgets, hearings, GAO audits. Courts check via lawsuits over rulemaking. President checks via executive orders and appointments.',
        'IMPEACHMENT: House impeaches (simple majority). Senate tries (2/3 to remove). Used three times against presidents (Andrew Johnson, Clinton, Trump twice — none removed).',
      ],
      vocabulary: [
        { term: 'executive order', definition: 'a presidential directive to the executive branch with the force of law within the executive\'s authority.' },
        { term: 'bureaucracy', definition: 'the federal agencies and civil-service staff that implement laws and policies.' },
        { term: 'executive privilege', definition: 'the president\'s claimed right to keep certain communications confidential, including from Congress.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-eo',
      kind: 'worked_example',
      problem: 'A president issues an executive order requiring all federal agencies to use renewable energy by 2030. Trace what can happen next.',
      steps: [
        'IMMEDIATE: federal agencies must comply — the order has the force of law for the executive branch.',
        'CONGRESS could pass a law overriding the order, but the president would have to sign or be overridden 2/3.',
        'COURTS could rule the order exceeds presidential authority. Plaintiffs (an affected industry, a state) could sue.',
        'NEXT PRESIDENT could rescind it with another executive order. EOs are durable only as long as the issuer\'s authority lasts.',
        'CONGRESS could de-fund implementation in the appropriations process — power of the purse.',
        'TAKEAWAY: EOs let presidents act fast, but the action is not permanent and depends on others not pushing back.',
      ],
      answer: 'Compliance is immediate, but Congress, courts, the next president, or the appropriations process can each push back.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A president nominates a federal judge. What does the Senate do, and what threshold is needed?',
      expectedAnswer: 'The Senate confirms federal judges by a simple majority vote (since 2017 for Supreme Court, since 2013 for lower courts).',
      responseFormat: 'free',
      hints: [
        'Article II says the president nominates "with the advice and consent of the Senate".',
        'Confirmation threshold has changed via the "nuclear option".',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-eo-permanent',
      kind: 'misconception_check',
      question: 'Once a president issues an executive order, is it permanent law?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating EOs like statutes.',
          correctsTo: 'No. Executive orders bind only as long as: (a) the executive branch follows them, and (b) no court strikes them down, and (c) no subsequent president rescinds them. They\'re NOT statutes — Congress alone makes statutes. Many controversial EOs are reversed by the next administration. Real durability requires Congress to pass legislation.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Formal powers (in Constitution): commander, nominate, treaty, veto, pardon. Informal: EOs, signing statements, executive privilege, bully pulpit.',
        'Bureaucracy: cabinet, independent agencies, regulatory commissions. Civil service is mostly tenured.',
        'Oversight: Congress (budget, hearings, GAO), courts (rulings), president (EOs, appointments).',
        'Impeachment: House impeaches (majority), Senate removes (2/3). Three president impeachments, zero removals.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the bureaucracy sometimes act independently of presidential preference, even though the president is supposed to direct it?',
      hint: 'Civil-service protections (Pendleton Act 1883), expert career staff with institutional knowledge, regulatory commissions designed to be insulated, judicial review of agency rulemaking. Bureaucratic inertia is a feature, not a bug — it stabilizes policy across administrations.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
