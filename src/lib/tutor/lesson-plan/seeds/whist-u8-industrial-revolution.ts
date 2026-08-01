/**
 * World History — Industry, Nationalism & Empire: The Industrial Revolution.
 *
 * The hinge of the modern world: why Britain first, how the factory
 * rewired work and cities, and the global ripple — resource hunger that
 * feeds directly into the New Imperialism (8.4). Salvaged factual spine
 * from the legacy world-history U5 industrial seeds, reframed subject-first.
 * C3 D2.His.14.9-12, D2.Eco.1.9-12, D2.Geo.7.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U8_INDUSTRIAL_REVOLUTION: LessonPlan = {
  id: 'evelyn.hs.whist.industrial-revolution.v1',
  title: 'The Industrial Revolution',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.industrial-revolution',
      standard: 'WHIST-8.1',
      description:
        'Explain why industrialization began in Britain, how the factory system transformed work, cities, and daily life, and how industrial demand for materials and markets reshaped the global economy (C3 D2.His.14.9-12, D2.Eco.1.9-12).',
    },
  ],
  prerequisites: ['whist.atlantic-revolutions'],
  followUps: ['whist.industrial-society-reform'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the scale of the break visible: for most of history, life crawled at muscle speed — then one lifetime changed everything.',
      script:
        'Here is the strangest fact in this course: a farmer in 1700 lived more like a farmer in ancient Egypt than like their own great-grandchildren in 1850. For thousands of years, nearly everything was made by hand, moved by muscle, and lit by fire. Then, in about a century, humans learned to burn fossil fuel for power — and got railroads, factories, telegraphs, and cities of millions. Every device you own descends from that pivot. So the two questions historians ask: why did it start in BRITAIN, of all places? And what did it cost the people who lived through it?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-industrialization',
      kind: 'concept',
      goal: "Britain's preconditions, the invention chain, the factory system, and the global ripple.",
      keyIdeas: [
        'WHY BRITAIN FIRST — a stack of preconditions, not one cause: coal and iron at home; capital from Atlantic trade (including profits from the slave economy); colonies supplying raw cotton and buying finished goods; an Agricultural Revolution (crop rotation, enclosure) freeing workers from farms; stable banks and patent law; navigable rivers and no internal tariffs.',
        "THE INVENTION CHAIN — textiles led: the spinning jenny and water frame made thread faster than weavers could use it, pulling cloth-making out of cottages into water-powered mills. Watt's improved steam engine (1769) then cut the cord to the river — factories could go anywhere near coal.",
        'STEAM SHRANK THE MAP — railroads (Stockton–Darlington 1825) and steamships collapsed travel times from weeks to days. Fresh food, daily newspapers, national markets, and precise clock time all ride on the rails.',
        'THE FACTORY SYSTEM REWROTE WORK — the shift from task-time (work until the job is done, at home, at your pace) to clock-time (12–14 hour shifts, bells, fines for lateness). Workers became interchangeable machine-tenders; skilled hand-weavers were ruined.',
        "URBANIZATION AT SPEED — Manchester grew roughly tenfold in a century. Housing, sewage, and disease control lagged catastrophically: cholera outbreaks, soot-black air, child labor in mills and mines — the raw material for Unit 8.2's reform movements.",
        "THE GLOBAL RIPPLE — industrial Britain needed raw materials (cotton, rubber, palm oil, metals) and buyers. Regions that had led world manufacturing — India's cotton weavers, for example — were pushed into supplying raw materials instead, as machine-made cloth undersold handloom cloth. That resource hunger loads the gun for the New Imperialism (8.4).",
        'A PROCESS, NOT AN EVENT — "revolution" misleads: this was a rolling transformation over a century-plus, spreading unevenly (Belgium, Germany, the US, Japan by the late 1800s), and it is still spreading today.',
      ],
      vocabulary: [
        { term: 'factory system', definition: 'production concentrated in one building, powered by machines, with workers on fixed shifts tending them.' },
        { term: 'enclosure', definition: 'the fencing-off of shared village farmland into private holdings — efficient for landowners, displacing for laborers.' },
        { term: 'urbanization', definition: 'the mass movement of population from countryside to cities.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-why-britain',
      kind: 'worked_example',
      problem:
        'China in 1700 had skilled workers, huge markets, and sophisticated manufacturing — arguably more than Britain. Work through why the breakthrough happened in Britain anyway.',
      steps: [
        'Reject the single-cause answer first: "Britain was cleverer" explains nothing — inventiveness existed everywhere. Look for the STACK of conditions that only Britain had at once.',
        "Energy: Britain's coal seams were shallow, abundant, and close to iron and to ports. Wood-short Britain had already switched to coal for heating — mines flooding with water is literally the problem the steam engine was built to solve.",
        'Money and markets: Atlantic trade — including the slave economy — had built deep pools of investment capital, and colonies both supplied raw cotton and were captive buyers of finished cloth.',
        'Labor: the Agricultural Revolution and enclosure pushed workers off the land right as mills needed hands.',
        'Institutions: patent law made inventions property, banks lent to factory-builders, and internal free trade let goods move. Conclusion: not one cause but a coincidence of energy + capital + labor + markets + institutions in one small island.',
      ],
      answer:
        'No single cause — Britain uniquely stacked cheap coal, trade capital, displaced farm labor, colonial markets, and invention-protecting institutions at the same moment.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-weaver-account',
      kind: 'worked_example',
      problem:
        'A Lancashire hand-weaver recalled around 1820 (paraphrased): "My father wove at home and stopped when the day\'s piece was done. I mind a power loom among hundreds, twelve hours by the factory bell, fined a penny if late." What transformations of work does this account capture?',
      steps: [
        'Locate the speaker: one generation apart, same trade, same region — the account is built to show change WITHIN living memory.',
        'Place of work: home workshop → factory floor. The weaver no longer owns tools or workspace; the mill owner does.',
        'Rhythm of work: task-time ("stopped when the piece was done") → clock-time ("twelve hours by the bell"). Time itself became the employer\'s property — the fine for lateness prices it exactly.',
        "Status of skill: the father's craft set his income; the child \"minds\" a machine that holds the skill instead. Hand-weavers' wages collapsed as power looms spread.",
        "Read the silence too: nothing here about starvation or machine-breaking — but multiply this account by a million and you get the anger behind the Luddites and the reform movements of 8.2.",
      ],
      answer:
        "It captures the factory system's core shifts: home → mill, task-time → clock-time, owned tools → owned by the machine, craft skill → machine-tending.",
      estimatedMinutes: 3,
    },
    {
      id: 'try-preconditions',
      kind: 'try_yourself',
      problem: 'Which combination best explains why the Industrial Revolution began in Britain?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Abundant coal, capital from overseas trade, displaced farm labor, and colonial markets — present together', correct: true },
        { id: 'b', text: 'Britain was the only country whose people wanted new technology' },
        { id: 'c', text: 'The British government invented and owned all the early factories' },
        { id: 'd', text: 'Britain had the largest population in the world' },
      ],
      expectedAnswer: 'Abundant coal, capital from overseas trade, displaced farm labor, and colonial markets — present together',
      hints: [
        'Single-cause answers ("they wanted it more") are the trap — what did Britain have all at once?',
        'Energy + money + workers + buyers + institutions: the stack, not any one layer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-clock-time',
      kind: 'try_yourself',
      problem:
        'Before factories, a rural weaver worked "until the day\'s piece was done." What replaced this rhythm under the factory system?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Fixed shifts measured by the clock, enforced with bells and fines', correct: true },
        { id: 'b', text: 'Shorter, more flexible hours chosen by each worker' },
        { id: 'c', text: 'Seasonal work following the harvest calendar' },
        { id: 'd', text: 'Payment in land instead of wages' },
      ],
      expectedAnswer: 'Fixed shifts measured by the clock, enforced with bells and fines',
      hints: [
        "Machines run continuously — the worker's schedule had to match the machine's, not the task's.",
        'Bells, shift whistles, and lateness fines: the employer now bought your TIME, not your product.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-global-ripple',
      kind: 'try_yourself',
      problem:
        'India led the world in handmade cotton cloth in 1750; by 1850 it mainly exported raw cotton and imported British cloth. What best explains the reversal?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Machine-made British cloth undersold handloom cloth, pushing India toward supplying raw materials', correct: true },
        { id: 'b', text: 'Indian weavers voluntarily abandoned a profitable craft' },
        { id: 'c', text: 'Cotton stopped growing in India after 1800' },
        { id: 'd', text: "Britain purchased India's cloth at premium prices to protect its weavers" },
      ],
      expectedAnswer: 'Machine-made British cloth undersold handloom cloth, pushing India toward supplying raw materials',
      hints: [
        'Compare production costs: a power loom versus a hand loom — who can sell cheaper?',
        'Industrial economies pull raw materials IN and push finished goods OUT — reversing the old flow.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-event',
      kind: 'misconception_check',
      question:
        'A student writes: "The Industrial Revolution happened in 1769 when James Watt invented the steam engine." What needs correcting?',
      commonErrors: [
        {
          answer: "It happened in 1769 with Watt's invention",
          misconception: 'Compressing a century-long process into a single inventor-and-date event (and crediting Watt with inventing, rather than improving, the steam engine).',
          correctsTo:
            "Watt IMPROVED an existing engine (Newcomen's), and the transformation was a rolling process — textiles, then steam, then rail, spreading from Britain over more than a century and reaching different regions at different times. Think process with accelerating phases, not lightning strike.",
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Britain first because of a STACK: coal, trade capital, displaced labor, colonial markets, and invention-friendly institutions together.',
        'Textiles → steam → rail: each solved the bottleneck the last one created; steam freed factories from rivers.',
        'The factory system replaced task-time with clock-time and craft skill with machine-tending — cities exploded faster than they could cope.',
        "Industrial resource hunger reversed global trade flows (India's cloth → raw cotton) and loads the gun for the New Imperialism.",
        'A process, not an event: over a century, spreading unevenly — and still spreading.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'The Industrial Revolution' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
