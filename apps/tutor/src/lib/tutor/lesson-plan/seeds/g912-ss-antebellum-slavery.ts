/**
 * Grades 9-12 Social Studies — Antebellum America & Slavery.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_SS_ANTEBELLUM_SLAVERY: LessonPlan = {
  id: 'evelyn.g912.ss.antebellum-slavery.v1',
  title: 'Grades 9-12 SS — Antebellum America & Slavery',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ss',
  topic: 'g912-ss',
  locale: 'en',
  los: [
    {
      id: 'g912.ss.antebellum-slavery',
      description: 'Analyse the institution of slavery in antebellum America (1815-1860); recognise resistance and abolition movements.',
      standard: 'NCSS 9-12 Time, Continuity, Change',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Slavery wasn\'t a side issue — it was central to the US economy and politics in the decades before the Civil War.',
      script: 'In 1860, nearly 4 MILLION people were enslaved in the United States. The cotton they produced fueled the Northern textile industry, the British economy, and Southern wealth. Slavery shaped American politics until war broke the system. Today we drill the antebellum era.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-antebellum',
      kind: 'concept',
      goal: 'Slavery system + economy + political conflict + resistance + abolition.',
      keyIdeas: [
        'ANTEBELLUM = "before the war" — refers to ~1815-1860, between War of 1812 and Civil War.',
        'SLAVERY EXPANSION: cotton gin (1793, Eli Whitney) made cotton processing efficient; demand for enslaved labour exploded as cotton became king.',
        '1820s-1860s: enslaved population grew from ~1.5 million to ~4 million. Mostly in 15 Southern states.',
        'COTTON ECONOMY: cotton was the largest US export. Connected slave-grown cotton to Northern textile mills, banks, and British factories. Slavery was NATIONAL.',
        'LIFE UNDER SLAVERY: forced labour, dawn-to-dusk work, families separated by sale, brutal punishment. Enslaved people were legal "property" of owners.',
        'BUT enslaved people CONSTANTLY RESISTED: work slowdowns, sabotage, escape (Underground Railroad), uprisings (Nat Turner, 1831), preserving culture and family despite the system.',
        'ABOLITION MOVEMENT: northern movement to end slavery. Key figures: Frederick Douglass (escaped slavery, became leading abolitionist), Harriet Tubman (Underground Railroad), William Lloyd Garrison (newspaper "The Liberator"), Sojourner Truth.',
        'POLITICAL CONFLICT — SLAVERY EXPANSION QUESTION: would new western territories permit slavery?',
        '  MISSOURI COMPROMISE (1820): MO admitted slave; ME free; line at 36°30\' for future territories.',
        '  COMPROMISE OF 1850: California free; popular sovereignty for Utah/New Mexico; Fugitive Slave Act.',
        '  KANSAS-NEBRASKA ACT (1854): popular sovereignty allowed slavery into former free territory; "Bleeding Kansas" violence.',
        '  DRED SCOTT v. SANFORD (1857): Supreme Court ruled enslaved person was property; Congress couldn\'t ban slavery in territories.',
        'GROWING NORTH-SOUTH TENSIONS led to LINCOLN\'S 1860 ELECTION → Southern secession → Civil War.',
        'KEY UNDERSTANDING: slavery wasn\'t passively maintained — it was actively defended through violence, law, politics, and economic interest. Resisting it took enormous courage.',
      ],
      vocabulary: [
        { term: 'antebellum', definition: 'before the (US Civil) war; referring to the period roughly 1815-1860.' },
        { term: 'abolitionist', definition: 'a person who worked to end slavery.' },
        { term: 'Underground Railroad', definition: 'a network of safe houses and routes helping enslaved people escape to free states or Canada.' },
        { term: 'popular sovereignty', definition: 'the principle that voters in a territory should decide whether slavery would be allowed there.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cotton',
      kind: 'worked_example',
      problem: 'How did the cotton gin and slavery REINFORCE each other?',
      steps: [
        'Before cotton gin (1793): cotton processing was so labour-intensive that growing cotton wasn\'t very profitable. Slavery seemed to be slowly fading in the South.',
        'Cotton gin made processing 50x faster. Suddenly cotton was hugely profitable.',
        'Demand for cotton EXPLODED — both in Northern US textile mills and British factories.',
        'Plantation owners wanted MORE cotton fields → wanted MORE enslaved labour to work them.',
        'Enslaved population grew rapidly. New slave states (Alabama, Mississippi, Louisiana, Texas) joined.',
        'Cotton became the largest US export. Slavery deeply entrenched into the economy.',
        'CONCLUSION: technology + cotton demand → expansion of slavery. The institution that might have died was renewed by the Industrial Revolution.',
      ],
      answer: 'Cotton gin made cotton highly profitable → demand for enslaved labour exploded.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Who was Frederick Douglass and why is he an important figure in this era?',
      expectedAnswer: 'Frederick Douglass (1818-1895) escaped from slavery and became one of the most influential abolitionists. His autobiography "Narrative of the Life of Frederick Douglass" (1845) showed the horror of slavery to wide readers. He gave powerful speeches, edited an abolitionist newspaper, advised Lincoln, and lived to see emancipation.',
      responseFormat: 'free',
      hints: [
        'He was both formerly enslaved AND a writer/speaker.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-passive',
      kind: 'misconception_check',
      question: 'A student says "enslaved people accepted their situation." Why is this wrong?',
      commonErrors: [
        {
          answer: 'Enslaved people accepted slavery',
          misconception: 'Treating compliance under brutal coercion as acceptance.',
          correctsTo: 'Enslaved people CONSTANTLY resisted in many ways: working slowly, breaking tools, running away (tens of thousands escaped), pretending illness, learning to read despite laws against it, preserving African religions and culture, organising uprisings (Nat Turner 1831, Stono 1739), protecting family. Compliance was forced by violence — overseers, dogs, whips, separation of families. To call this "acceptance" reverses cause and effect. Enslaved people fought for freedom every way they could; the systems just made full open rebellion suicidal.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Antebellum = ~1815-1860.',
        '4 million enslaved by 1860; cotton economy national, not just Southern.',
        'Slavery expansion drove political compromises (1820, 1850, 1854).',
        'Dred Scott (1857) ruled enslaved as property.',
        'Abolitionists, escapes, and resistance constant.',
        '1860 Lincoln election → secession → Civil War.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did SLAVE EXPANSION become the central political question even though most Northerners weren\'t abolitionists?',
      hint: 'Even Northerners who didn\'t oppose slavery in the South opposed its expansion to NEW territories. Reasons: 1) Free workers couldn\'t compete with unpaid enslaved labour. 2) New states\' political power would tip Senate toward slavery interests. 3) Moral concerns growing slowly. So the question wasn\'t "should slavery exist" — most accepted it where established. It was "should it expand". That question proved IRRESOLVABLE through politics — slavery and free labour couldn\'t both grow indefinitely. The Civil War answered the question with force.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
