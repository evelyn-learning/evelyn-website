/**
 * Grades 9-10 Computer Science — Data & Databases.
 *
 * Tables, rows/columns, primary keys, basic SQL.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_CS_DATA_DATABASES: LessonPlan = {
  id: 'evelyn.cs.9-10.data-databases.v1',
  title: 'Data & databases — tables, keys, basic SQL',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'cs',
  topic: 'data-databases',
  locale: 'en',
  los: [
    {
      id: 'cs910.databases',
      description: 'Model data as tables with primary keys; write basic SELECT, WHERE, and JOIN queries.',
      standard: 'CSTA-3A-DA-09',
    },
  ],
  prerequisites: ['cs910.python'],
  followUps: ['cs910.cybersecurity'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame databases as the spreadsheet that scales.',
      script: 'Every app you use has a database behind it. When you log into Instagram, a database lookup says "yes, this username exists, here\'s the password hash." When you scroll, queries pull posts. Databases are spreadsheets that scale — and SQL is how you talk to them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tables-sql',
      kind: 'concept',
      goal: 'Tables, rows, columns, primary keys, SELECT WHERE, JOIN.',
      keyIdeas: [
        'TABLE: a named collection of rows with named columns. Like a sheet in Excel.',
        'ROW (record): one entity. COLUMN (field): one attribute.',
        'PRIMARY KEY: a column whose values uniquely identify each row. Usually called id.',
        'FOREIGN KEY: a column that points to another table\'s primary key. How tables relate.',
        'SELECT col1, col2 FROM table — returns those columns from every row.',
        'WHERE clause filters rows: SELECT * FROM students WHERE grade = 9.',
        'JOIN combines two tables matching on keys: SELECT * FROM orders JOIN users ON orders.user_id = users.id.',
        'INSERT INTO ... VALUES adds rows. UPDATE ... SET changes them. DELETE removes them.',
      ],
      vocabulary: [
        { term: 'primary key', definition: 'a column whose values uniquely identify each row.' },
        { term: 'foreign key', definition: 'a column referencing another table\'s primary key.' },
        { term: 'JOIN', definition: 'a SQL operation that combines rows from two tables based on a relationship.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-query',
      kind: 'worked_example',
      problem: 'Given a students table with columns id, name, grade — write a query that returns names of all 9th graders.',
      steps: [
        'SELECT name FROM students WHERE grade = 9;',
        '// SELECT name = which column to return',
        '// FROM students = which table',
        '// WHERE grade = 9 = filter to grade-9 rows only',
        'Returns: a list of names.',
      ],
      answer: 'SELECT name FROM students WHERE grade = 9;',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does every table need a primary key?',
      expectedAnswer: 'to uniquely identify each row so other tables can refer to it and you can update/delete the right one',
      responseFormat: 'free',
      hints: [
        'Imagine two students named "Alex" — how do you distinguish?',
        'Foreign keys point at primary keys. Without one, no joins.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-spreadsheet',
      kind: 'misconception_check',
      question: 'A student says: "A database is just like Excel but bigger." What\'s missing from that view?',
      commonErrors: [
        {
          answer: 'just bigger',
          misconception: 'Underestimating relational structure + concurrent access.',
          correctsTo: 'Excel handles ONE user, simple cell-by-cell formulas. A database handles thousands of users at once, enforces relationships between tables, and guarantees that two operations can\'t corrupt each other (transactions). Excel is a notebook; a database is a public library with strict rules.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Tables = rows × columns. Primary key uniquely IDs a row.',
        'SELECT cols FROM table WHERE condition.',
        'JOIN combines tables on matching keys.',
        'Foreign keys connect related data across tables.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'NoSQL databases (like MongoDB) skip the rigid table structure. When does that help, and when does it hurt?',
      hint: 'NoSQL helps when data is naturally hierarchical (a JSON document with nested structure) and your access pattern is "fetch one document by id". It hurts when relationships matter — joins are clumsy, consistency guarantees are weaker. Most production systems use BOTH: SQL for relational data, NoSQL for documents.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
