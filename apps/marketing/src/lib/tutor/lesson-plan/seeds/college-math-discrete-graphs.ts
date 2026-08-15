/**
 * College Discrete Math — Graph Theory Basics.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_MATH_DISCRETE_GRAPHS: LessonPlan = {
  id: 'evelyn.college.math.discrete.graphs.v1',
  title: 'Discrete Math — Graph Theory Basics',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'math',
  topic: 'discrete-math',
  locale: 'en',
  los: [
    {
      id: 'college.math.discrete.graphs',
      description: 'Apply core graph-theory definitions (vertex, edge, degree, path, cycle, connectedness) and the handshake lemma; distinguish trees, bipartite graphs, and Eulerian/Hamiltonian properties.',
      standard: 'COLLEGE-DISCRETE',
    },
  ],
  prerequisites: ['college.math.discrete-math'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Graph theory is the math behind networks — social, road, internet, biological.',
      script: 'Friend networks, road systems, web pages and links, neurons firing, supply chains — they all map to a GRAPH: dots (vertices) connected by lines (edges). The math of graphs gives you universal tools for shortest path, scheduling, coloring, and community detection. Today we cover the core definitions and the first-week-of-class theorems.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-graphs',
      kind: 'concept',
      goal: 'Definitions, degree, paths, connectedness, special graphs, key theorems.',
      keyIdeas: [
        'GRAPH G = (V, E): V is a set of VERTICES (nodes); E is a set of EDGES, each connecting two vertices.',
        'DIRECTED graph: edges have direction (arrows). UNDIRECTED: no direction.',
        'SIMPLE graph: no loops (edge from a vertex to itself), no multiple edges between the same pair.',
        'DEGREE of vertex v = number of edges incident to v. In a directed graph, in-degree and out-degree.',
        'HANDSHAKE LEMMA: Σ deg(v) over all v = 2|E|. Each edge contributes 2 to the total degree (one for each endpoint).',
        'COROLLARY: the number of odd-degree vertices in any graph is EVEN.',
        'PATH from u to v: sequence of edges connecting u to v with no repeated vertex. CYCLE: a closed path (returns to start).',
        'CONNECTED graph: there\'s a path between every pair of vertices.',
        'SPECIAL GRAPHS:',
        '  TREE: connected, acyclic graph. Has exactly |V| − 1 edges.',
        '  BIPARTITE: vertices split into two sets, edges only between sets (e.g. men/women in dating apps, students/courses).',
        '  COMPLETE graph K_n: every pair of vertices has an edge. |E| = n(n−1)/2.',
        'EULERIAN PATH: visits every EDGE exactly once. Exists ⟺ at most 2 vertices have odd degree (Euler\'s theorem, 1736; the famous Königsberg bridges).',
        'HAMILTONIAN PATH: visits every VERTEX exactly once. Hard to determine in general (NP-complete).',
      ],
      vocabulary: [
        { term: 'degree', definition: 'the number of edges incident to a vertex.' },
        { term: 'tree', definition: 'a connected, acyclic graph; equivalently, has |V| − 1 edges and is connected.' },
        { term: 'bipartite graph', definition: 'a graph whose vertices can be partitioned into two sets such that every edge connects vertices from different sets.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A graph has 7 vertices with degrees 5, 4, 4, 3, 3, 2, 2. How many edges does it have?',
      steps: [
        'Apply the Handshake Lemma: Σ deg(v) = 2|E|.',
        'Sum: 5 + 4 + 4 + 3 + 3 + 2 + 2 = 23.',
        'But 23 is ODD ⟹ this is impossible! Σ deg(v) must be EVEN (it\'s 2|E|).',
        'So no such graph exists.',
        'Equivalently, count odd-degree vertices: 5, 3, 3 — three odd-degree vertices. The corollary says odd-degree vertex count must be EVEN. 3 is odd. Contradiction confirmed.',
      ],
      answer: 'No such graph exists — sum of degrees is odd, violating the handshake lemma.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A connected graph on 8 vertices has 7 edges. What can you say about its structure?',
      expectedAnswer: 'A connected graph on n vertices with exactly n − 1 edges is a TREE. Here n = 8, edges = 7 = n − 1, so it\'s a tree. Trees have no cycles.',
      responseFormat: 'free',
      hints: [
        'Connected + (n − 1) edges is a defining property of one common graph type.',
        'Adding any edge would create a cycle.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-eulerian-vs-hamiltonian',
      kind: 'misconception_check',
      question: 'A student claims that if a graph has an Eulerian path, it must also have a Hamiltonian path. Why is this wrong?',
      commonErrors: [
        {
          answer: 'Eulerian implies Hamiltonian',
          misconception: 'Conflating "every edge once" with "every vertex once."',
          correctsTo: 'They are independent properties. Eulerian = every EDGE once. Hamiltonian = every VERTEX once. A graph can have one without the other. Example: a triangle plus a pendant edge — Eulerian path exists if the right conditions on degrees hold, but a Hamiltonian path may not (or may). Eulerian existence is decided by easy degree checks (≤ 2 odd-degree vertices). Hamiltonian existence is NP-complete in general — there\'s no efficient general algorithm to decide it.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Σ deg(v) = 2|E| (handshake lemma).',
        'Odd-degree vertex count is always even.',
        'Tree: connected, acyclic, |E| = |V| − 1.',
        'Eulerian (every edge once): ≤ 2 odd-degree vertices.',
        'Hamiltonian (every vertex once): hard problem in general.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
