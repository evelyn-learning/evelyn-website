/**
 * Biology — Human Body Systems: The Immune System & Defense Against Disease.
 *
 * The closing lesson of the HS Biology course (NGSS HS-LS1-2). Built on the
 * concept/process template: three layered lines of defense, and almost every
 * student error here is a bookkeeping error about WHICH line is acting and
 * WHETHER it remembers — so the concept segment is organized around that
 * ladder, and the memory-cell idea carries the vaccine explanation.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U10_IMMUNE_SYSTEM: LessonPlan = {
  id: 'evelyn.hs.bio.immune-system.v1',
  title: 'The Immune System & Defense Against Disease',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.immune-system',
      standard: 'BIO-10.5',
      description:
        'Explain how the body defends itself against pathogens through three lines of defense — barriers, the fast nonspecific innate response, and the slower specific adaptive response with its antibodies and memory cells — and use that model to explain immunity and vaccination (NGSS HS-LS1-2).',
    },
  ],
  prerequisites: ['bio.nervous-endocrine'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame immunity around a fact every student already owns: you only get chickenpox once.',
      script:
        'You can catch a cold every single winter, but almost nobody catches chickenpox twice. Same body, same virus-sized threat — completely different outcome. And when you scrape your knee, the skin around the cut turns red, warm and puffy within an hour; that is not the injury, that is your body arriving on scene. In this lesson you will build the three-layer defense system that explains both of those, and by the end you will be able to say exactly how a vaccine protects you without ever making you sick.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-lines',
      kind: 'concept',
      goal: 'The three lines of defense, what antigens and antibodies actually are, and why memory cells change everything.',
      keyIdeas: [
        'LINE 1: BARRIERS — physical and chemical, and they never learn anything. Skin is a wall of dead, dry cells; mucus in your nose and airways traps particles; stomach acid destroys most of what you swallow; tears and saliva carry enzymes that break bacterial cell walls. These block every pathogen the same way and stop the overwhelming majority before an infection ever starts.',
        'LINE 2: THE INNATE (NONSPECIFIC) RESPONSE — if something gets through, this fires in minutes. PHAGOCYTES are white blood cells that engulf and digest invaders whole. INFLAMMATION widens nearby blood vessels so more of those cells reach the site, which is exactly why a cut goes red, warm and swollen. FEVER raises body temperature, slowing pathogens and speeding your own defenses. Key property: it is IDENTICAL against every pathogen and it keeps NO record.',
        'LINE 3: THE ADAPTIVE (SPECIFIC) RESPONSE — slower the first time, taking days, but it targets one particular invader and it remembers. This is the only line that can tell a flu virus from a strep bacterium.',
        'ANTIGEN VS ANTIBODY — do not swap these. An ANTIGEN is a molecule ON the pathogen, the recognition tag your body reads. An ANTIBODY is a Y-shaped protein YOUR body makes that locks onto one specific antigen, like a key cut for one lock. Antigen = the label on the invader; antibody = your matching response.',
        'B CELLS AND T CELLS — B cells are the antibody factories: a B cell that matches an antigen multiplies and pumps out antibodies that clump pathogens together and mark them for destruction. HELPER T cells coordinate, switching on the B cells and the rest of the response. KILLER T cells destroy your own body cells that have already been infected, which antibodies floating in the blood cannot reach.',
        'ANTIBODIES ARE NOT GENERAL-PURPOSE — the classic error is imagining antibodies as tiny soldiers that attack anything foreign. Each antibody binds ONE antigen shape. Measles antibodies do nothing against a flu virus. That specificity is the whole point, and it is also why you can catch a cold every year: there are hundreds of different cold viruses, each with its own antigens.',
        'MEMORY CELLS — after an infection clears, memory B and T cells for that antigen survive for years or decades. A second exposure to the SAME pathogen triggers a response that is faster and far larger, so the pathogen is cleared before you ever feel symptoms. You were immune, and you never knew you were exposed. That is why chickenpox is a once-in-a-lifetime illness.',
        'VACCINES, ACTIVE VS PASSIVE, AND WHEN IT MISFIRES — a vaccine presents the ANTIGEN alone (a killed or weakened pathogen, one surface protein, or instructions to make that protein) so memory cells form with no disease. That is ACTIVE immunity: your own cells did the work, and it lasts. PASSIVE immunity is receiving ready-made antibodies — across the placenta, in breast milk, or as an injection after a snakebite — which protects immediately but fades in weeks because no memory cells were made. Two ways the system misfires: an ALLERGY is a full adaptive attack on something harmless like pollen, and an AUTOIMMUNE disease, such as type 1 diabetes, is the system failing to recognize self and attacking the body\'s own cells.',
      ],
      vocabulary: [
        { term: 'antigen', definition: 'a molecule on a pathogen surface that the immune system recognizes as foreign.' },
        { term: 'antibody', definition: 'a Y-shaped protein made by B cells that binds one specific antigen.' },
        { term: 'memory cell', definition: 'a long-lived B or T cell left behind after an infection that makes the second response fast.' },
      ],
      suggestedTools: ['show_diagram', 'show_concept_map', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-first-vs-second-exposure',
      kind: 'worked_example',
      problem:
        'A student catches chickenpox at age six. Doctors track the amount of chickenpox antibody in her blood. After that first infection, antibody stays near zero for about four days, then climbs slowly over the next week to a modest peak, and she is visibly sick for roughly ten days. At age twenty she is exposed to chickenpox again by a sick classmate. This time antibody rises within a day or two to a level several times higher than the first peak, and she never develops a single symptom. Explain both patterns.',
      steps: [
        'Sort the first exposure by line of defense. Barriers and the innate response acted immediately — that is the fever and inflammation — but neither makes antibody, so the antibody reading stays flat at first.',
        'Explain the four-day lag. The adaptive response has to FIND the rare B cell whose antibody matches the chickenpox antigen, then that cell must multiply into a large population before enough antibody exists to measure. Building that army from scratch takes days, and during those days the virus spreads freely — which is the ten days of feeling sick.',
        'Account for what is left behind. Once the infection clears, most of those cells die off, but MEMORY B and T cells specific to chickenpox antigen survive for decades.',
        'Now run the second exposure through the same model. The matching cells no longer have to be found and built from nothing — a large memory population is already standing by, so it responds within a day or two, and because it starts from many cells rather than a few, it climbs to a much higher antibody level.',
        'Connect that to how she feels. The virus is cleared before it can build up enough to damage tissue and trigger noticeable symptoms. She was infected and defended; she simply never got sick, which is what "you only get chickenpox once" actually means.',
      ],
      answer:
        'The first response is slow and small because the adaptive system must locate and multiply the matching B cells from scratch; the second is fast and much larger because memory cells specific to that antigen were already in place, so the virus is cleared before symptoms appear.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-vaccine-without-illness',
      kind: 'worked_example',
      problem:
        'A vaccine gives you protection against a disease you have never had. If immunity normally comes from getting sick and recovering, how can a vaccine produce the same memory without producing the illness?',
      steps: [
        'Separate the two things an infection does. A pathogen (1) carries ANTIGENS your immune system can recognize, and (2) reproduces inside you and damages tissue, which is what makes you feel sick. Only the first of those is needed to build memory.',
        'Identify what a vaccine actually delivers: the antigen without the working pathogen — a killed pathogen, a weakened one that cannot reproduce well, one isolated surface protein, or instructions telling your cells to display that protein.',
        'Run the adaptive response on it. Your B and T cells see the antigen, matching B cells multiply and make antibodies, and helper T cells coordinate exactly as in a real infection. The system cannot tell that nothing dangerous is present.',
        'Collect the product. When that response winds down it leaves MEMORY cells specific to that antigen — the same memory a real infection would have left.',
        'Test the result against a real exposure. Meeting the actual pathogen now triggers the fast, large second-exposure response from the first worked example, so it is cleared before symptoms develop.',
        'State the limit clearly. Soreness or a mild fever after a shot is the innate response and inflammation doing their normal job at the injection site — it is not a mild case of the disease, and the vaccine is not able to give you the disease it protects against.',
      ],
      answer:
        'A vaccine supplies the antigen without a pathogen that can reproduce and damage tissue, so the adaptive system builds antibodies and memory cells exactly as it would after an infection — protection without the illness.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-antigen-antibody',
      kind: 'try_yourself',
      problem:
        'A bacterium entering the bloodstream carries distinctive proteins on its outer surface. A patient\'s B cells respond by producing a Y-shaped protein that locks onto those surface proteins and nothing else. Which term goes with which molecule?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The bacterial surface protein is the antibody, and the Y-shaped protein the B cells make is the antigen' },
        { id: 'b', text: 'Both the bacterial surface protein and the Y-shaped protein are antigens, made by the pathogen' },
        { id: 'c', text: 'The bacterial surface protein is the antigen, and the Y-shaped protein the B cells make is the antibody', correct: true },
        { id: 'd', text: 'The bacterial surface protein is the antigen, and the Y-shaped protein is a phagocyte released by the innate response' },
      ],
      expectedAnswer: 'The bacterial surface protein is the antigen, and the Y-shaped protein the B cells make is the antibody',
      hints: [
        'One of these two molecules comes from the invader and one is built by the patient. Which is which?',
        'The antigen is the recognition tag ON the pathogen; the antibody is your body\'s Y-shaped protein cut to match it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-vaccine-mechanism',
      kind: 'try_yourself',
      problem:
        'A student receives a measles vaccine and never develops measles. Years later she is exposed to the measles virus at school and does not get sick. Which statement best explains the protection?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The vaccine exposed her adaptive system to measles antigens, so memory cells formed and mounted a fast, large response on real exposure', correct: true },
        { id: 'b', text: 'A vaccine gives you a mild case of the disease every time, and surviving that mild case is what makes you immune' },
        { id: 'c', text: 'The vaccine strengthened her skin, mucus and stomach acid so the measles virus could no longer get into her body at all' },
        { id: 'd', text: 'The vaccine supplied ready-made measles antibodies that stayed in her blood for years and neutralized the virus on contact' },
      ],
      expectedAnswer: 'The vaccine exposed her adaptive system to measles antigens, so memory cells formed and mounted a fast, large response on real exposure',
      hints: [
        'Which of the three lines of defense is the only one that can remember a specific pathogen?',
        'Ask what the vaccine leaves behind: her own memory cells (active immunity), or someone else\'s antibodies (passive, and short-lived)?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-antibiotics-vs-virus',
      kind: 'try_yourself',
      problem:
        'A patient with influenza, a viral infection, asks for antibiotics. Back in Unit 8 you saw that bacteria are living cells with cell walls and ribosomes, while viruses are not cells at all and reproduce only by hijacking a host cell\'s machinery. What should the doctor explain?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Antibiotics cure the flu, but only if they are started within the first day of symptoms' },
        { id: 'b', text: 'Antibiotics will work, because any medicine that kills bacteria also kills viruses' },
        { id: 'c', text: 'Antibiotics will work, because the flu is caused by a bacterium that lives inside human cells' },
        { id: 'd', text: 'Antibiotics attack bacterial structures such as cell walls and bacterial ribosomes, which a virus does not have, so they cannot treat the flu', correct: true },
      ],
      expectedAnswer: 'Antibiotics attack bacterial structures such as cell walls and bacterial ribosomes, which a virus does not have, so they cannot treat the flu',
      hints: [
        'Antibiotics work by damaging specific bacterial structures. List what a virus actually has.',
        'A virus is not a cell — no cell wall, no ribosomes of its own — so the drug has no target to attack.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-vaccine-mild-illness',
      kind: 'misconception_check',
      question:
        'A student says: "A vaccine works by giving you a mild version of the disease. Your body fights off the small dose and then it is immune, which is why people feel a bit sick after a shot." What went wrong?',
      commonErrors: [
        {
          answer: 'A vaccine gives you a mild case of the disease',
          misconception:
            'Assuming immunity requires disease, so the vaccine must be a small dose of the illness — and reading post-shot soreness or a low fever as proof of that mild case.',
          correctsTo:
            'A vaccine delivers the ANTIGEN, not a pathogen able to reproduce and damage tissue — a killed or weakened pathogen, one surface protein, or instructions to display that protein. The adaptive system builds antibodies and memory cells from the antigen alone, so no disease is needed. A sore arm or mild fever afterward is the INNATE response and inflammation reacting to the injection, exactly as they would to a splinter; it is the immune system starting work, not the disease itself.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three lines of defense: barriers (skin, mucus, stomach acid, tears), the innate response (inflammation, fever, phagocytes) which is fast but the same against everything, and the adaptive response, which is slower the first time but specific and remembers.',
        'Antigen = the recognition tag ON the pathogen; antibody = the Y-shaped protein YOUR B cells make to bind that one antigen. Antibodies are specific, never general-purpose.',
        'Helper T cells coordinate the response; killer T cells destroy your own already-infected cells; B cells make the antibodies.',
        'Memory cells make the second exposure fast and large enough that you never feel sick — that is why chickenpox happens once, and it is exactly what a vaccine builds using the antigen alone. Active immunity (your own cells) lasts; passive immunity (borrowed antibodies) is immediate but fades.',
        'Allergies are an adaptive overreaction to something harmless; autoimmune disease is an attack on self. Antibiotics target bacterial structures, so they do nothing against viruses.',
        'That closes the course: from the chemistry of life and the cell, through genetics, evolution, classification and ecosystems, to the body systems that keep one organism alive — every level running on the same rules.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.5', cedTitle: 'The Immune System & Defense Against Disease' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
