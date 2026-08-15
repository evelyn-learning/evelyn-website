/**
 * IB Computer Science — Systems Fundamentals.
 *
 * Hardware, OS roles, storage hierarchy, networks, social/ethical impact.
 * Aligns with IB CS Topic 1 (System fundamentals).
 */

import type { LessonPlan } from '../types';

export const SEED_IB_CS_SYSTEMS_FUNDAMENTALS: LessonPlan = {
  id: 'evelyn.ibdp.cs.systems-fundamentals.v1',
  title: 'IB CS systems fundamentals — hardware, OS, networks',
  curriculum: 'IBDP',
  grade: '11',
  subject: 'cs',
  topic: 'ib-cs',
  locale: 'en',
  los: [
    {
      id: 'ibcs.systems',
      description: 'Describe the role of hardware, operating systems, and networks in modern computing systems and the social/ethical implications.',
      standard: 'IB-CS-1.1',
    },
  ],
  prerequisites: ['cs910.python'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the system as layers, each abstracting the one below.',
      script: 'When you tap an app, dozens of layers wake up. Hardware → operating system → drivers → frameworks → your app code. Each layer hides complexity from the layer above. This abstraction is what lets one developer ship an app at all — and understanding the layers is what separates someone who can ship vs. someone who debugs forever.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-systems',
      kind: 'concept',
      goal: 'Hardware components, OS roles, storage hierarchy, networks, ethics.',
      keyIdeas: [
        'CPU executes instructions. RAM holds running programs and active data. Storage (SSD/HDD) keeps data when power is off.',
        'STORAGE HIERARCHY: registers → cache → RAM → SSD → HDD → network. Each layer 10-100× slower but 10-100× larger.',
        'OS roles: process scheduling, memory management, file system, device I/O, security/isolation.',
        'PROCESS: a running program with its own memory space. THREAD: a unit of execution within a process.',
        'NETWORK: layered (physical → link → IP → TCP/UDP → application). Each layer\'s concerns are local to it.',
        'CLOUD: someone else\'s computer + automation. Trade ownership for elasticity.',
        'SOCIAL/ETHICAL: privacy (who sees data), bias (training data shapes outputs), accessibility (works for whom), environmental cost (data centers use serious electricity).',
        'Reliability comes from REDUNDANCY: backup power, replicated data, failover servers. Single points of failure are bugs.',
      ],
      vocabulary: [
        { term: 'process', definition: 'a running program isolated by the OS in its own memory space.' },
        { term: 'storage hierarchy', definition: 'the speed/size tradeoff layers from registers to network.' },
        { term: 'redundancy', definition: 'duplicate components so a single failure doesn\'t take the system down.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-latency',
      kind: 'worked_example',
      problem: 'Order these by typical access time (fastest first): RAM, SSD, register, network round-trip.',
      steps: [
        'Register: ~1 nanosecond (inside the CPU).',
        'RAM: ~100 nanoseconds.',
        'SSD: ~100,000 nanoseconds (100 microseconds).',
        'Network round-trip: ~10,000,000 to 100,000,000 nanoseconds (10-100 ms).',
        'Order: register < RAM < SSD < network.',
        'Network is roughly 10 MILLION times slower than RAM. That\'s why caching wins.',
      ],
      answer: 'register < RAM < SSD < network round-trip',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is preventing a single point of failure considered the foundation of reliability?',
      expectedAnswer: 'because if one piece can take the whole system down, you\'re not reliable — you\'re lucky',
      responseFormat: 'free',
      hints: [
        'Reliability is about what happens when something breaks.',
        'A datacenter loses power, a disk dies, a switch fails — none of these should be system-ending.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cloud',
      kind: 'misconception_check',
      question: 'A student says: "Cloud means there\'s no real server, it\'s just out there." What\'s wrong with that?',
      commonErrors: [
        {
          answer: 'because cloud is virtual',
          misconception: 'Treating "cloud" as magic instead of "rented computers".',
          correctsTo: 'Cloud is just servers in someone else\'s building. AWS, Google Cloud, Azure all rent physical machines in real datacenters using real electricity. The CONVENIENCE is automation: you can spin up 100 servers in minutes without buying them. But the physics is the same — somewhere, real hardware is running your code.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Layers: hardware → OS → frameworks → app. Each abstracts the one below.',
        'Storage hierarchy: faster = smaller, larger = slower.',
        'OS handles scheduling, memory, files, devices, security.',
        'Reliability = redundancy. No single points of failure.',
        'Computing has real ethical consequences: privacy, bias, accessibility, environment.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do server applications usually use many small VMs / containers instead of one big server?',
      hint: 'ISOLATION (one buggy app can\'t crash others), SCALABILITY (spin up more containers as load grows), PORTABILITY (move workloads between machines), DEPLOYMENT (treat servers as cattle, not pets — replace, don\'t fix). Containers are the modern unit of cloud compute for these reasons.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
