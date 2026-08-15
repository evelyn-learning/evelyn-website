/**
 * World History — Unit 8 CED 8.1: The Industrial Revolution.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.whist.industrial-revolution.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_WHIST_U8_INDUSTRIAL_REVOLUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.whist.industrial-revolution.v1',
  course: 'World History',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'The Industrial Revolution',
  planId: 'evelyn.hs.whist.industrial-revolution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.whist.industrial-revolution.v1' }],
  theory: [
    { loId: 'whist.industrial-revolution', kind: 'framework', title: 'Why Britain first', content: `WHY BRITAIN FIRST — a stack of preconditions, not one cause: coal and iron at home; capital from Atlantic trade (including profits from the slave economy); colonies supplying raw cotton and buying finished goods; an Agricultural Revolution (crop rotation, enclosure) freeing workers from farms; stable banks and patent law; navigable rivers and no internal tariffs.` },
    { loId: 'whist.industrial-revolution', kind: 'framework', title: 'The invention chain', content: `THE INVENTION CHAIN — textiles led: the spinning jenny and water frame made thread faster than weavers could use it, pulling cloth-making out of cottages into water-powered mills. Watt's improved steam engine (1769) then cut the cord to the river — factories could go anywhere near coal.` },
    { loId: 'whist.industrial-revolution', kind: 'framework', title: 'Steam shrank the map', content: `STEAM SHRANK THE MAP — railroads (Stockton–Darlington 1825) and steamships collapsed travel times from weeks to days. Fresh food, daily newspapers, national markets, and precise clock time all ride on the rails.` },
    { loId: 'whist.industrial-revolution', kind: 'framework', title: 'The factory system rewrote work', content: `THE FACTORY SYSTEM REWROTE WORK — the shift from task-time (work until the job is done, at home, at your pace) to clock-time (12–14 hour shifts, bells, fines for lateness). Workers became interchangeable machine-tenders; skilled hand-weavers were ruined.` },
    { loId: 'whist.industrial-revolution', kind: 'framework', title: 'Urbanization at speed', content: `URBANIZATION AT SPEED — Manchester grew roughly tenfold in a century. Housing, sewage, and disease control lagged catastrophically: cholera outbreaks, soot-black air, child labor in mills and mines — the raw material for Unit 8.2's reform movements.` },
    { loId: 'whist.industrial-revolution', kind: 'framework', title: 'The global ripple', content: `THE GLOBAL RIPPLE — industrial Britain needed raw materials (cotton, rubber, palm oil, metals) and buyers. Regions that had led world manufacturing — India's cotton weavers, for example — were pushed into supplying raw materials instead, as machine-made cloth undersold handloom cloth. That resource hunger loads the gun for the New Imperialism (8.4).` },
    { loId: 'whist.industrial-revolution', kind: 'framework', title: 'A process, not an event', content: `A PROCESS, NOT AN EVENT — "revolution" misleads: this was a rolling transformation over a century-plus, spreading unevenly (Belgium, Germany, the US, Japan by the late 1800s), and it is still spreading today.` },
    { loId: 'whist.industrial-revolution', kind: 'definition', title: 'factory system', content: `production concentrated in one building, powered by machines, with workers on fixed shifts tending them.` },
    { loId: 'whist.industrial-revolution', kind: 'definition', title: 'enclosure', content: `the fencing-off of shared village farmland into private holdings — efficient for landowners, displacing for laborers.` },
    { loId: 'whist.industrial-revolution', kind: 'definition', title: 'urbanization', content: 'the mass movement of population from countryside to cities.' },
  ],
  methods: [
    {
      title: 'Worked why Britain',
      steps: [
        `Reject the single-cause answer first: "Britain was cleverer" explains nothing — inventiveness existed everywhere. Look for the STACK of conditions that only Britain had at once.`,
        `Energy: Britain's coal seams were shallow, abundant, and close to iron and to ports. Wood-short Britain had already switched to coal for heating — mines flooding with water is literally the problem the steam engine was built to solve.`,
        `Money and markets: Atlantic trade — including the slave economy — had built deep pools of investment capital, and colonies both supplied raw cotton and were captive buyers of finished cloth.`,
        `Labor: the Agricultural Revolution and enclosure pushed workers off the land right as mills needed hands.`,
        `Institutions: patent law made inventions property, banks lent to factory-builders, and internal free trade let goods move. Conclusion: not one cause but a coincidence of energy + capital + labor + markets + institutions in one small island.`,
      ],
      example: { problem: `China in 1700 had skilled workers, huge markets, and sophisticated manufacturing — arguably more than Britain. Work through why the breakthrough happened in Britain anyway.`, solution: `No single cause — Britain uniquely stacked cheap coal, trade capital, displaced farm labor, colonial markets, and invention-protecting institutions at the same moment.` },
      relatedLoIds: ['whist.industrial-revolution'],
    },
    {
      title: 'Worked weaver account',
      steps: [
        `Locate the speaker: one generation apart, same trade, same region — the account is built to show change WITHIN living memory.`,
        `Place of work: home workshop → factory floor. The weaver no longer owns tools or workspace; the mill owner does.`,
        `Rhythm of work: task-time ("stopped when the piece was done") → clock-time ("twelve hours by the bell"). Time itself became the employer's property — the fine for lateness prices it exactly.`,
        `Status of skill: the father's craft set his income; the child "minds" a machine that holds the skill instead. Hand-weavers' wages collapsed as power looms spread.`,
        `Read the silence too: nothing here about starvation or machine-breaking — but multiply this account by a million and you get the anger behind the Luddites and the reform movements of 8.2.`,
      ],
      example: { problem: `A Lancashire hand-weaver recalled around 1820 (paraphrased): "My father wove at home and stopped when the day's piece was done. I mind a power loom among hundreds, twelve hours by the factory bell, fined a penny if late." What transformations of work does this account capture?`, solution: `It captures the factory system's core shifts: home → mill, task-time → clock-time, owned tools → owned by the machine, craft skill → machine-tending.` },
      relatedLoIds: ['whist.industrial-revolution'],
    },
  ],
  pointers: [
    { content: `Watt IMPROVED an existing engine (Newcomen's), and the transformation was a rolling process — textiles, then steam, then rail, spreading from Britain over more than a century and reaching different regions at different times. Think process with accelerating phases, not lightning strike.`, kind: 'common-error' },
    { content: `Britain first because of a STACK: coal, trade capital, displaced labor, colonial markets, and invention-friendly institutions together.`, kind: 'tip' },
    { content: `Textiles → steam → rail: each solved the bottleneck the last one created; steam freed factories from rivers.`, kind: 'tip' },
    { content: `The factory system replaced task-time with clock-time and craft skill with machine-tending — cities exploded faster than they could cope.`, kind: 'tip' },
    { content: `Industrial resource hunger reversed global trade flows (India's cloth → raw cotton) and loads the gun for the New Imperialism.`, kind: 'tip' },
    { content: `A process, not an event: over a century, spreading unevenly — and still spreading.`, kind: 'tip' },
    { content: `Watt **improved** the steam engine (Newcomen's already existed); he didn't invent it. Same for the "invention" of the factory — no single date. Write "from the 1760s onward" or "over the following century," not "in 1769 the Industrial Revolution began."`, kind: 'common-error' },
    { content: `Never answer "why Britain?" with one cause. Coal alone, or colonies alone, existed elsewhere. The answer is the STACK — coal + trade capital + displaced farm labor + colonial markets + patent law/banks — present at once.`, kind: 'tip' },
    { content: `Don't confuse **enclosure** (fencing common village land into private holdings) with **urbanization** (people moving to cities). Enclosure is a cause; urbanization is a consequence. And enclosure is about land ownership, not about factories.`, kind: 'vocab-note' },
    { content: `"Task-time" vs "clock-time" is the precise language for the work shift — not "people worked harder." Pre-factory weavers often worked long hours too; what changed was WHO controlled the rhythm and that lateness could be fined.`, kind: 'vocab-note' },
    { content: `India's decline in cloth wasn't because Indian weavers lost skill or worked less. Machine-made British cloth was simply cheaper. Frame the reversal as price competition plus colonial trade policy, not as Indian backwardness.`, kind: 'gotcha' },
    { content: `Britain first ≠ Britain only. By the late 1800s Belgium, Germany, the US, and Japan had industrialized on their own paths. If a question says "industrialization spread," name at least one non-British case.`, kind: 'edge-case' },
    { content: `Keep the sequence straight: water frame and spinning jenny came BEFORE steam power, so the first mills sat on rivers. Steam (Watt) is what freed factories from riverbanks and let them cluster near coal — that's the causal payoff, not just a date.`, kind: 'gotcha' },
    { content: `Cholera, soot, child labor and slum housing belong in 8.1 as consequences; the reform laws, unions, and Luddite response belong in 8.2. Describe the conditions here — don't jump straight to the fixes.`, kind: 'tip' },
  ],
};
