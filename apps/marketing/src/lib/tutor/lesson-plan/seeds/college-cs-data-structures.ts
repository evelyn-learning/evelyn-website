/**
 * College Intro — Data Structures (full course intro).
 *
 * Trees, graphs, balanced trees, heap; Big-O, ADT vs implementation.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_CS_DATA_STRUCTURES: LessonPlan = {
  id: 'evelyn.college.data-structures.v1',
  title: 'Data structures — trees, graphs, heaps, ADTs',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'cs',
  topic: 'college-data-structures',
  locale: 'en',
  los: [
    {
      id: 'college.dsa',
      description: 'Distinguish abstract data types from implementations; analyze tree, graph, and heap operations using Big-O.',
      standard: 'COLLEGE-DSA',
    },
  ],
  prerequisites: ['college.cs101'],
  followUps: ['college.algorithms'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame ADTs as the "what" separate from the "how".',
      script: 'A list is a list whether it\'s an array or a linked list. The ADT (abstract data type) is the contract: what operations and what guarantees. The IMPLEMENTATION is which underlying structure you pick. The same ADT — say, a Set — can be implemented with a hash map, a balanced tree, or a sorted array, with very different speed/memory tradeoffs.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trees-graphs',
      kind: 'concept',
      goal: 'Trees, BSTs, balanced trees, graphs, heaps.',
      keyIdeas: [
        'TREE: nodes with parent/children, no cycles. Root has no parent; leaves have no children.',
        'BINARY SEARCH TREE (BST): each node\'s left subtree < node < right subtree. Search: O(log n) IF balanced.',
        'UNBALANCED BST = O(n) (degenerates into a list). BALANCED TREES (AVL, red-black) self-balance to maintain O(log n).',
        'HEAP: complete binary tree with heap property (parent ≤ children for min-heap). Insert + extract-min: O(log n). Used in priority queues.',
        'GRAPH: nodes + edges, possibly with cycles. Directed (one-way) or undirected. Weighted or unweighted.',
        'GRAPH REPRESENTATION: adjacency list (each node lists its neighbors) — sparse-friendly. Adjacency matrix (n × n boolean grid) — dense-friendly.',
        'BFS (queue) explores layer-by-layer; DFS (stack/recursion) goes deep first.',
        'ADT vs implementation: a "Set" can be hash map (avg O(1) lookup) or balanced tree (sorted, O(log n) lookup). Choose based on need.',
      ],
      vocabulary: [
        { term: 'BST', definition: 'binary search tree — left subtree < node < right subtree.' },
        { term: 'heap', definition: 'a complete binary tree where parents satisfy a heap property (min or max at root).' },
        { term: 'adjacency list', definition: 'a graph representation where each node stores a list of neighbors.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-bst',
      kind: 'worked_example',
      problem: 'A BST initially holds {5, 3, 8, 1, 7}. Where does 9 get inserted?',
      steps: [
        '         5',
        '       /   \\',
        '      3     8',
        '     /     /',
        '    1     7',
        'Insert 9: start at root (5). 9 > 5 → right (8). 9 > 8 → right (empty). Insert there.',
        'Result: 9 becomes 8\'s right child. Tree height grows by 1.',
      ],
      answer: 'Right child of node 8.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A BST receives keys 1, 2, 3, 4, 5 inserted in order. What\'s the resulting tree shape, and what is search\'s Big-O?',
      expectedAnswer: 'a right-leaning chain (degenerate); search is O(n)',
      responseFormat: 'free',
      hints: [
        'No node ever has a left child.',
        'Walking from root to bottom is the same as walking a linked list.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-heap-vs-bst',
      kind: 'misconception_check',
      question: 'A student says: "A heap is just a sorted BST." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because both are trees',
          misconception: 'Conflating two different invariants.',
          correctsTo: 'BST: left < node < right (full ordering between siblings via parent). Heap: parent ≤ both children, but NO ordering between siblings. A heap is NOT sorted in any traversable order. Heaps optimize get-min/get-max; BSTs optimize range queries and sorted iteration.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Tree: hierarchical, no cycles. Graph: arbitrary, may have cycles.',
        'BST gives O(log n) when balanced; degenerate input → O(n).',
        'Self-balancing trees (AVL, red-black) protect against degeneration.',
        'Heaps: priority-queue workhorse, O(log n) push/pop.',
        'ADT (the contract) is separate from implementation (how).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Hash maps usually beat balanced trees for lookup. So why do databases (B+ trees) and STL (red-black trees) use trees instead?',
      hint: 'Hash maps: O(1) avg lookup, but unsorted. Trees: O(log n) lookup but SORTED traversal in O(n) and RANGE queries (find all keys 100-200) in O(log n + k). Databases love range queries; ordered iteration matters for SQL ORDER BY. Hash maps are wrong tool when you need order.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
