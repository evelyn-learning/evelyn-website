/**
 * Biology — Unit 10 CED 10.5: The Immune System & Defense Against Disease.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.immune-system.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U10_IMMUNE_SYSTEM: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.immune-system.v1',
  course: 'Biology',
  cedUnit: 10,
  cedTopic: '10.5',
  cedTitle: 'The Immune System & Defense Against Disease',
  planId: 'evelyn.hs.bio.immune-system.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.immune-system.v1' }],
  theory: [
    { loId: 'bio.immune-system', content: `LINE 1: BARRIERS — physical and chemical, and they never learn anything. Skin is a wall of dead, dry cells; mucus in your nose and airways traps particles; stomach acid destroys most of what you swallow; tears and saliva carry enzymes that break bacterial cell walls. These block every pathogen the same way and stop the overwhelming majority before an infection ever starts.` },
    { loId: 'bio.immune-system', content: `LINE 2: THE INNATE (NONSPECIFIC) RESPONSE — if something gets through, this fires in minutes. PHAGOCYTES are white blood cells that engulf and digest invaders whole. INFLAMMATION widens nearby blood vessels so more of those cells reach the site, which is exactly why a cut goes red, warm and swollen. FEVER raises body temperature, slowing pathogens and speeding your own defenses. Key property: it is IDENTICAL against every pathogen and it keeps NO record.` },
    { loId: 'bio.immune-system', content: `LINE 3: THE ADAPTIVE (SPECIFIC) RESPONSE — slower the first time, taking days, but it targets one particular invader and it remembers. This is the only line that can tell a flu virus from a strep bacterium.` },
    { loId: 'bio.immune-system', kind: 'framework', title: 'Antigen vs antibody', content: `ANTIGEN VS ANTIBODY — do not swap these. An ANTIGEN is a molecule ON the pathogen, the recognition tag your body reads. An ANTIBODY is a Y-shaped protein YOUR body makes that locks onto one specific antigen, like a key cut for one lock. Antigen = the label on the invader; antibody = your matching response.` },
    { loId: 'bio.immune-system', kind: 'framework', title: 'B cells and t cells', content: `B CELLS AND T CELLS — B cells are the antibody factories: a B cell that matches an antigen multiplies and pumps out antibodies that clump pathogens together and mark them for destruction. HELPER T cells coordinate, switching on the B cells and the rest of the response. KILLER T cells destroy your own body cells that have already been infected, which antibodies floating in the blood cannot reach.` },
    { loId: 'bio.immune-system', kind: 'framework', title: 'Antibodies are not general-purpose', content: `ANTIBODIES ARE NOT GENERAL-PURPOSE — the classic error is imagining antibodies as tiny soldiers that attack anything foreign. Each antibody binds ONE antigen shape. Measles antibodies do nothing against a flu virus. That specificity is the whole point, and it is also why you can catch a cold every year: there are hundreds of different cold viruses, each with its own antigens.` },
    { loId: 'bio.immune-system', kind: 'framework', title: 'Memory cells', content: `MEMORY CELLS — after an infection clears, memory B and T cells for that antigen survive for years or decades. A second exposure to the SAME pathogen triggers a response that is faster and far larger, so the pathogen is cleared before you ever feel symptoms. You were immune, and you never knew you were exposed. That is why chickenpox is a once-in-a-lifetime illness.` },
    { loId: 'bio.immune-system', kind: 'framework', title: 'Vaccines, active vs passive, and when it misfires', content: `VACCINES, ACTIVE VS PASSIVE, AND WHEN IT MISFIRES — a vaccine presents the ANTIGEN alone (a killed or weakened pathogen, one surface protein, or instructions to make that protein) so memory cells form with no disease. That is ACTIVE immunity: your own cells did the work, and it lasts. PASSIVE immunity is receiving ready-made antibodies — across the placenta, in breast milk, or as an injection after a snakebite — which protects immediately but fades in weeks because no memory cells were made. Two ways the system misfires: an ALLERGY is a full adaptive attack on something harmless like pollen, and an AUTOIMMUNE disease, such as type 1 diabetes, is the system failing to recognize self and attacking the body's own cells.` },
    { loId: 'bio.immune-system', kind: 'definition', title: 'antigen', content: 'a molecule on a pathogen surface that the immune system recognizes as foreign.' },
    { loId: 'bio.immune-system', kind: 'definition', title: 'antibody', content: 'a Y-shaped protein made by B cells that binds one specific antigen.' },
    { loId: 'bio.immune-system', kind: 'definition', title: 'memory cell', content: `a long-lived B or T cell left behind after an infection that makes the second response fast.` },
  ],
  methods: [
    {
      title: 'Worked first vs second exposure',
      steps: [
        `Sort the first exposure by line of defense. Barriers and the innate response acted immediately — that is the fever and inflammation — but neither makes antibody, so the antibody reading stays flat at first.`,
        `Explain the four-day lag. The adaptive response has to FIND the rare B cell whose antibody matches the chickenpox antigen, then that cell must multiply into a large population before enough antibody exists to measure. Building that army from scratch takes days, and during those days the virus spreads freely — which is the ten days of feeling sick.`,
        `Account for what is left behind. Once the infection clears, most of those cells die off, but MEMORY B and T cells specific to chickenpox antigen survive for decades.`,
        `Now run the second exposure through the same model. The matching cells no longer have to be found and built from nothing — a large memory population is already standing by, so it responds within a day or two, and because it starts from many cells rather than a few, it climbs to a much higher antibody level.`,
        `Connect that to how she feels. The virus is cleared before it can build up enough to damage tissue and trigger noticeable symptoms. She was infected and defended; she simply never got sick, which is what "you only get chickenpox once" actually means.`,
      ],
      example: { problem: `A student catches chickenpox at age six. Doctors track the amount of chickenpox antibody in her blood. After that first infection, antibody stays near zero for about four days, then climbs slowly over the next week to a modest peak, and she is visibly sick for roughly ten days. At age twenty she is exposed to chickenpox again by a sick classmate. This time antibody rises within a day or two to a level several times higher than the first peak, and she never develops a single symptom. Explain both patterns.`, solution: `The first response is slow and small because the adaptive system must locate and multiply the matching B cells from scratch; the second is fast and much larger because memory cells specific to that antigen were already in place, so the virus is cleared before symptoms appear.` },
      relatedLoIds: ['bio.immune-system'],
    },
    {
      title: 'Worked vaccine without illness',
      steps: [
        `Separate the two things an infection does. A pathogen (1) carries ANTIGENS your immune system can recognize, and (2) reproduces inside you and damages tissue, which is what makes you feel sick. Only the first of those is needed to build memory.`,
        `Identify what a vaccine actually delivers: the antigen without the working pathogen — a killed pathogen, a weakened one that cannot reproduce well, one isolated surface protein, or instructions telling your cells to display that protein.`,
        `Run the adaptive response on it. Your B and T cells see the antigen, matching B cells multiply and make antibodies, and helper T cells coordinate exactly as in a real infection. The system cannot tell that nothing dangerous is present.`,
        `Collect the product. When that response winds down it leaves MEMORY cells specific to that antigen — the same memory a real infection would have left.`,
        `Test the result against a real exposure. Meeting the actual pathogen now triggers the fast, large second-exposure response from the first worked example, so it is cleared before symptoms develop.`,
        `State the limit clearly. Soreness or a mild fever after a shot is the innate response and inflammation doing their normal job at the injection site — it is not a mild case of the disease, and the vaccine is not able to give you the disease it protects against.`,
      ],
      example: { problem: `A vaccine gives you protection against a disease you have never had. If immunity normally comes from getting sick and recovering, how can a vaccine produce the same memory without producing the illness?`, solution: `A vaccine supplies the antigen without a pathogen that can reproduce and damage tissue, so the adaptive system builds antibodies and memory cells exactly as it would after an infection — protection without the illness.` },
      relatedLoIds: ['bio.immune-system'],
    },
  ],
  pointers: [
    { content: `A vaccine delivers the ANTIGEN, not a pathogen able to reproduce and damage tissue — a killed or weakened pathogen, one surface protein, or instructions to display that protein. The adaptive system builds antibodies and memory cells from the antigen alone, so no disease is needed. A sore arm or mild fever afterward is the INNATE response and inflammation reacting to the injection, exactly as they would to a splinter; it is the immune system starting work, not the disease itself.`, kind: 'common-error' },
    { content: `Three lines of defense: barriers (skin, mucus, stomach acid, tears), the innate response (inflammation, fever, phagocytes) which is fast but the same against everything, and the adaptive response, which is slower the first time but specific and remembers.`, kind: 'tip' },
    { content: `Antigen = the recognition tag ON the pathogen; antibody = the Y-shaped protein YOUR B cells make to bind that one antigen. Antibodies are specific, never general-purpose.`, kind: 'tip' },
    { content: `Helper T cells coordinate the response; killer T cells destroy your own already-infected cells; B cells make the antibodies.`, kind: 'tip' },
    { content: `Memory cells make the second exposure fast and large enough that you never feel sick — that is why chickenpox happens once, and it is exactly what a vaccine builds using the antigen alone. Active immunity (your own cells) lasts; passive immunity (borrowed antibodies) is immediate but fades.`, kind: 'tip' },
    { content: `Allergies are an adaptive overreaction to something harmless; autoimmune disease is an attack on self. Antibiotics target bacterial structures, so they do nothing against viruses.`, kind: 'tip' },
    { content: `That closes the course: from the chemistry of life and the cell, through genetics, evolution, classification and ecosystems, to the body systems that keep one organism alive — every level running on the same rules.`, kind: 'tip' },
    { content: `Antigen is ON the pathogen; antibody is what YOUR B cells make. Both start with "anti-" and get swapped constantly. Quick check: if it's a Y-shaped protein your body produced, it's an antibody — the thing it locks onto is the antigen.`, kind: 'vocab-note' },
    { content: `Don't write that antibodies "attack germs." Each antibody binds ONE antigen shape — measles antibodies do nothing to a flu virus. Say which antigen an antibody matches whenever you describe it.`, kind: 'common-error' },
    { content: `A sore arm or mild fever after a shot is the INNATE response to the injection — not a mild case of the disease. A vaccine delivers antigen, not a pathogen that can reproduce, so it cannot give you the disease it protects against.`, kind: 'gotcha' },
    { content: `"Nonspecific" ≠ weak, and "specific" ≠ strong. Innate is fast but identical against everything and keeps no record; adaptive is slow the first time but targeted and remembers. Speed and memory are what separate them.`, kind: 'vocab-note' },
    { content: `Antibodies float in blood and can't reach a pathogen already hiding inside your cells — that's the killer T cell's job. Don't credit antibodies for clearing infected body cells.`, kind: 'edge-case' },
    { content: `Passive immunity (placenta, breast milk, antivenom) is borrowed antibodies — immediate but fades in weeks because NO memory cells form. Only active immunity (infection or vaccine) leaves memory. Ask: did the person's own B cells do the work?`, kind: 'gotcha' },
    { content: `Antibiotics target bacterial structures like cell walls and bacterial ribosomes. Viruses aren't cells and have neither, so antibiotics do nothing for flu or a cold — that's a virus/bacteria distinction, not an immune-system one.`, kind: 'common-error' },
    { content: `Catching a cold every year doesn't disprove memory cells — hundreds of different cold viruses each carry their own antigens. Memory is antigen-specific, not disease-name-specific.`, kind: 'edge-case' },
  ],
};
