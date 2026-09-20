/**
 * Grade 8 World Geography — GIS & Geospatial Reasoning: GIS Layers & Overlay
 * Reasoning.
 *
 * CONCEPT-LED row 2.1 (National Geography Standard 1), shaped on the
 * concept-led exemplar `m8geo-u7-hazard-risk-exposure-and-vulnerability.ts`:
 * one framework is installed -- a stack of layers tied to the same locations,
 * queried by one condition per layer -- and the student then USES it on
 * described layer lists three times over: naming the places that pass an AND
 * rule, counting the survivors of a three-condition rule, and judging a
 * question the stack cannot answer at all. Every item is answered by a named
 * place-in-the-data, a count with its arithmetic, or a short verdict, never by
 * a definition.
 *
 * SCOPE GUARD: this row has NO Grade 7 antecedent -- the signed curriculum
 * states that none of the 40 `m7geo` LO descriptions mentions GIS, layers or
 * overlay, and reserved the subject for Grade 8 -- so the usual "assume the
 * Grade 7 mechanism in one clause" move has nothing to assume, and the depth
 * test was run against the two Grade 6 files the scope cell names instead.
 * What this row ASSUMES, in one clause where it is used, is that a single
 * thematic layer can be read for one topic at a time (Grade 6,
 * `m6geo-u7-reading-a-thematic-map.ts`) and that a recorded picture of the
 * ground is a different thing from a drawn map (Grade 6,
 * `m6geo-u7-satellite-images-and-aerial-views.ts`), and it re-teaches
 * neither: no keyIdea here explains how to read a map key, what a shaded or
 * symbol key is, what a thematic map is, or what a recorded image of the
 * ground shows. Grepped against the finished body: "symbol", "satellite",
 * "thematic" and "image" appear in no authored string, and "key" appears only
 * as the field name `keyIdeas`.
 * It ADDS lining several layers up place by place, turning a rule into one
 * condition per layer, running AND, OR and AND NOT and showing that they give
 * different answer sets from the same layers, catching an OR-for-AND error in
 * the arithmetic (two lists of 4 and 5 in a town of 8 parcels), checking a
 * survivor count by elimination, and judging when the stack cannot answer a
 * question at all. It STOPS SHORT of GIS software procedures -- no menu, no
 * file format, no projection setting, no tool name appears anywhere -- which
 * the curriculum withholds from the whole course by design (For sign-off #5;
 * the software is a high-school GIS elective), and of spectral classification
 * and remote-sensing algorithms. Sideways, it does NOT measure a distance or
 * apply a stated setback or service radius (row 2.2,
 * `buffers-and-proximity`): every adjacency in this file arrives as a value a
 * layer already records ("the road layer names every parcel that fronts a
 * paved road"), and no distance is stated, measured or compared against a
 * threshold anywhere -- the word "meter" occurs twice, both times in the
 * figure of speech "without moving a meter". It
 * does NOT weight or score criteria and does NOT rank candidate sites (row
 * 2.3, `site-selection-with-weighted-criteria`): an overlay here is pass or
 * fail against a rule and the survivors are never ordered or ranked; the file
 * counts how many layers name a place in exactly two spots, a distractor that
 * is wrong for that very reason and the hint that rules it out. It does NOT compute change between two dates (row 2.4,
 * `change-detection-from-satellite-data`): no layer here is compared with
 * itself at a later date, and the one layer that changes in this file is
 * corrected by a survey, which is a correction and not a measurement of
 * change. It does NOT set class breaks or evaluate a map's design (rows 1.2 and
 * 1.4). Three things ARE deliberately allowed, because neighbors sit close:
 * (a) the contrasting case in worked example 1 CORRECTS one layer and re-runs
 * the overlay, which is the wave-standard check move and is a change to the
 * data, not a change to a distance threshold, which is row 2.2's; (b) the
 * elimination count and the 25-percent share are arithmetic on set
 * membership, which the row's own "how many" question requires, and no rate
 * is chosen or compared across denominators (row 1.1's); (c) one step of
 * worked example 2 and one item say out loud that the stack cannot answer a
 * question no layer records, which is a limit-of-the-evidence judgment on THIS
 * row's material and is not the evidence-limits reading of imagery that row
 * 2.4 owns.
 *
 * BURNED SPECIMENS (ruling 36): the scope cell's own example -- parcels inside
 * the flood zone AND fronting a road -- is used in the HOOK and in worked
 * example 1, so it is burned for items. All three item specimens are fresh
 * (Kesterly: dry slope and water main; Harrow: flood, ownership and vacancy;
 * Alder: a stack with no age layer), and no item stem, choice or answer
 * appears in any teaching segment. Do not "helpfully" reuse Marden or
 * Thornbury in an item.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: read each keyIdea and notice what it is
 * ABOUT. None of them defines a map, a key, a layer's topic or a geographic
 * information system as a piece of technology; every one of them says what
 * you DO with several layers at once -- line up, test, choose the connector,
 * count, eliminate, judge what cannot be answered, re-run. The Grade 6 files
 * named above were read next to this one, and the closest pair was keyIdea 1
 * here against Grade 6's "one map, one topic, so the key answers questions
 * about that one topic only"; keyIdea 1 survives because it is about lining
 * SEVERAL layers up at the same location, and the one-topic clause is its
 * premise rather than its point.
 *
 * ACCURACY NOTE: every place in this file is invented (Marden, Thornbury,
 * Kesterly, Harrow, Alder) and every layer list was written for the
 * arithmetic. No real place, feature or figure is named anywhere, so the only
 * claims to check are the set arithmetic and the definitions, all of which are
 * in the report's claim ledger with their digits.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67% of the
 * time; chance with four choices is 25%). The per-item discipline is the
 * point: every distractor states the full wrong STEP that produces it -- the
 * union taken for the intersection, the rule stopped one condition early, the
 * first layer answered from alone, a layer that records something else used as
 * a stand-in, the number of layers naming a place read as a measurement of the
 * place -- and no key was built to be the longest choice BECAUSE it is the
 * key. Measured as a diagnostic, not as a score: the key is the strictly
 * longest choice in 1 of the 3 items. Zero is not the target, and a file
 * driven to zero is the same tell inverted. The three keys sit at ids c, a and
 * b, which is the id set `(2 + 1) mod 4 = 3` requires, omitting d.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every layer is written out
 * as a list inside the segment that needs it, each list states its own reading
 * convention (a place the list does not name is outside that layer), and every
 * item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U2_GIS_LAYERS_AND_OVERLAY: LessonPlan = {
  id: 'evelyn.ms.m8geo.gis-layers-and-overlay.v1',
  title: 'GIS Layers & Overlay Reasoning',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.gis-layers-and-overlay',
      standard: 'M8GEO-2.1',
      description:
        'Explain a geographic information system as separate data layers (parcels, roads, flood zone, land use) each tied to the same locations, and use an overlay of two or three layers to answer a where-question, such as which parcels are inside the flood zone AND next to a road (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: ['m8geo.maps-as-arguments'],
  followUps: ['m8geo.buffers-and-proximity'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student see one small word -- AND -- decide which houses get a notice and which do not, before any of the machinery is named.',
      script:
        'A notice goes up on the town website on a Thursday. Every household that is inside the flood zone AND on a street the crew will close has to move its car off the street by six. Your friend two doors down gets the notice. You do not. Same block, same river, same rain, and nobody walked around the neighborhood deciding house by house. Two separate lists decided it: one that records which land the river reaches, kept by the flood office, and one that records which streets the crew will close, kept by the roads office. Neither list was made with the other in mind. Read together at the same address, they pick out a set of houses that neither list holds on its own -- and change the word AND to the word OR and the notice goes to almost the whole town instead. Today you take questions like that apart and answer them exactly, from layers written out in words.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-layers-and-overlay',
      kind: 'concept',
      goal: 'Install the stack-and-conditions framework and the moves that go with it: line the layers up place by place, take the connector from the rule, run one condition per layer, count by elimination, and say when the stack cannot answer.',
      keyIdeas: [
        'LAYERS ARE SEPARATE RECORDS OF THE SAME GROUND, SO THE FIRST MOVE IS TO LINE THEM UP PLACE BY PLACE. A geographic information system, usually called a GIS, does not keep one map of everything. It keeps each kind of fact in its own LAYER -- one layer for the parcels of land, one for the roads, one for the flood zone, one for land use -- and every layer is tied to the same locations, so the same parcel carries a value in each of them. One layer read on its own answers a question about its own one topic, and that is not why the system exists. It exists because the layers line up: the first move in every question below is to go place by place and write down what each layer says about that place, before answering anything.',
        'AN OVERLAY IS ONE CONDITION PER LAYER, RUN AT EVERY PLACE. Turn the question into conditions -- one condition for each layer it touches -- then run each condition down the list of places separately and keep the places that pass. Run them in order and carry only the survivors into the next condition; that is less work and it makes the count checkable later. Two consequences are worth holding on to, because both are checks. Adding a condition can shrink the answer set or leave it the same size, and can never grow it. And the answer set is always part of the shortest list you ran, so an answer with more places in it than the shortest list is already wrong, before anyone looks at which places they are.',
        'THE CONNECTOR COMES FROM THE RULE, AND AND, OR AND AND NOT DO NOT GIVE THE SAME ANSWER. Say the connector out loud before touching the lists. Inside the flood zone AND fronting a paved road keeps only the places both layers name. Inside the flood zone OR fronting a paved road keeps every place either layer names, which is a far longer answer. Inside the flood zone AND NOT inside the wetland uses the wetland layer as an EXCLUSION: the places it names are the ones that fail. An AND rule run as OR is the most common wrong answer in this whole subject, and it gives itself away in the arithmetic before it gives itself away in the geography: two lists of 4 places and 5 places, in a town that holds 8 parcels, come to 9, and a town cannot hand back more parcels than it has. The extra came from counting the places on both lists twice.',
        'COUNT THE SURVIVORS, THEN CHECK THE COUNT BY ELIMINATION. A where-question usually wants a how-many alongside the which-ones, and the count is easy to get slightly wrong. Count each eliminated place out ONCE, at the first condition it fails, so that no place is counted out twice, and then the eliminated places plus the survivors have to come back to the total you started with. If they do not, either a place was dropped or one was counted out twice, and the second is the more likely of the two.',
        'THE STACK ANSWERS ONLY THE QUESTIONS ITS LAYERS WERE BUILT TO ANSWER. Every layer was collected by somebody, for a reason, and it records what that reason needed and nothing else. If no layer records what a question asks about, the honest answer is that this stack cannot answer it, and the fix is another layer, not a cleverer reading of the ones already there. Answering a question about who lives in a place by pointing at the layer that records what the land is used for is a guess about the world wearing the clothes of a reading of the data. One reading rule goes with this, and every layer in this lesson states it: a layer written as a list names every place it covers, so a place the list does not name is outside that layer, not unknown.',
        'THE ANSWER SET BELONGS TO THE LAYERS AND THE RULE, NOT TO THE PLACES. Correct one layer, or change one condition, and run the overlay again: places cross into the answer and out of it without moving a single meter. That is worth saying out loud whenever an overlay answer is handed to somebody, because "these are the parcels that were inside the flood zone and fronting a paved road when these layers were recorded" is a different sentence from "these are the risky parcels", and only the first one is what the overlay produced.',
      ],
      vocabulary: [
        {
          term: 'layer',
          definition:
            'one kind of fact recorded for every place across the same area and kept separately from the other kinds, so it can be read on its own or alongside them.',
        },
        {
          term: 'overlay',
          definition:
            'reading two or more layers at the same locations at once and keeping the places that satisfy a condition in each of them.',
        },
        {
          term: 'attribute',
          definition:
            'the value one layer records for one place -- vacant or built on, inside the zone or outside it, connected to the line or not.',
        },
        {
          term: 'condition',
          definition:
            'the test a rule sets for one layer, which every place either passes or fails; a rule has one condition for each layer it touches.',
        },
        {
          term: 'exclusion layer',
          definition:
            'a layer whose condition removes places instead of keeping them, so that the places the layer names are the ones that fail.',
        },
        {
          term: 'answer set',
          definition:
            'the places left once every condition has been run, belonging to the layers and the rule it was built from rather than to the places themselves.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-flood-and-road-overlay',
      kind: 'worked_example',
      problem:
        'Marden keeps its town records as a geographic information system. Answer the question the flood office asked, put a number on the answer, and then say what would change it.\n\n"The parcel layer holds eight parcels, numbered 1 through 8. The flood-zone layer names every parcel the mapped flood reaches: parcels 2, 3, 5 and 7. The road layer names every parcel that fronts a paved road: parcels 1, 2, 5, 6 and 8. A parcel a layer does not name is outside that layer."\n\nThe flood office needs the parcels that are inside the flood zone AND front a paved road, because those are the ones a truck can reach on a flood day. Which parcels are they, and what share of the town parcels is that?',
      steps: [
        'Say the connector before touching the lists. The rule carries the word AND, so a parcel has to be on the flood-zone list AND on the road list. WRONG: "Gather every parcel that either layer names." CORRECT: "Keep only the parcels that both layers name." The two readings give very different answers, and the rule, not the habit, decides which one is wanted.',
        'Run the first condition down the parcel layer. Inside the flood zone: parcels 2, 3, 5 and 7 pass. Parcels 1, 4, 6 and 8 fail. Four parcels survive the first condition.',
        'Run the second condition on those four only, not on the whole town -- that is what running them in order buys you. Parcel 2 is on the road list, so it passes. Parcel 3 is not on the road list, so it fails. Parcel 5 is on the road list and passes. Parcel 7 is not, so it fails. Two parcels are left: parcel 2 and parcel 5.',
        'Put a number on it. 2 parcels out of 8 is 2 divided by 8, which is 0.25, or 25 percent of the town parcels. Invert the division to check it: 0.25 times 8 is 2. The count comes back, so the share is right.',
        'Check the count a second way, by elimination, counting each parcel out once at the first condition it fails. Four parcels failed the flood condition: 1, 4, 6 and 8. Two more failed the road condition: 3 and 7. 4 plus 2 is 6 eliminated, and 8 minus 6 is 2 surviving, which is the answer already reached.',
        'Look at what the other connector would have done, because OR is the answer most people give. OR keeps every parcel either layer names: 4 on one list plus 5 on the other is 9, and Marden holds 8 parcels, so 9 is impossible. Parcels 2 and 5 sit on both lists and were counted twice, so the honest OR answer is 9 minus 2, which is 7 -- every parcel except parcel 4, which neither layer names. Seven parcels out of eight is useless to the flood office, and the arithmetic said something was wrong before anybody read a single parcel record.',
        'Rewind the input, then test a contrasting case. Read the two lists backwards to be sure nothing was misread: road 8, 6, 5, 2, 1; flood 7, 5, 3, 2. Parcels 2 and 5 appear on both, and no third parcel does. Now change ONE input. A survey finds that parcel 5 sits above the flood line, and the flood-zone layer is corrected to parcels 2, 3 and 7. Re-run: of those three, only parcel 2 is on the road list, so the answer set falls from two parcels to one. Elimination checks it: five parcels now fail the flood condition -- 1, 4, 5, 6 and 8 -- and two of the rest fail the road condition -- 3 and 7 -- so 5 plus 2 is 7 eliminated and 8 minus 7 is 1. Nothing moved. Parcel 5 is exactly where it always was; the layer changed, and the answer changed with it.',
      ],
      answer:
        'Parcels 2 and 5, the only two that the flood-zone layer and the road layer both name, which is 2 out of 8 parcels, or 25 percent. Elimination confirms the count: 4 parcels fail the flood condition, 2 more fail the road condition, and 8 minus 6 is 2. The same two layers read with OR give 7 parcels, because 4 plus 5 is 9 in a town of 8 and the two shared parcels were counted twice. If the flood-zone layer is corrected to parcels 2, 3 and 7, the answer set falls to parcel 2 alone.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-repair-the-connector-and-the-exclusion',
      kind: 'worked_example',
      problem:
        'A permit clerk in Thornbury ran an overlay and got it wrong twice. Find both mistakes, repair the analysis, and say which parcel survives.\n\n"Five parcels: A, B, C, D and E. The land-use layer records A vacant, B housing, C vacant, D vacant, E a workshop. The sewer layer names every parcel connected to the town sewer line: A, C and E. The wetland layer names every parcel inside the mapped wetland: C. A parcel a layer does not name is outside that layer."\n\nThe rule for a building permit: the parcel must be vacant AND connected to the sewer line AND NOT inside the wetland. The clerk wrote: "Vacant parcels are A, C and D. Sewer parcels are A, C and E. That gives A, C, D and E, so four parcels qualify. The wetland layer is a nature layer, so I left it out."',
      steps: [
        'Check the two lists the clerk read out, because a wrong answer does not always come from a misread layer. Vacant: A, C and D, which matches the land-use layer, since B is housing and E is a workshop. Connected to the sewer line: A, C and E. Both lists are read correctly. The mistakes are in what was done with them.',
        'First mistake: the connector. The rule says vacant AND connected, and the clerk kept every parcel on either list. The arithmetic shows it without any parcel letters at all: 3 vacant plus 3 on the sewer line is 6, in a town of 5 parcels. Parcels A and C are on both lists and were counted twice, so the clerk list is 6 minus 2, which is the 4 parcels written down. WRONG: "A, C, D and E, because each of them is vacant or on the sewer line." CORRECT: "A and C, because they are the only two that are vacant AND on the sewer line."',
        'Second mistake: the exclusion. A condition joined by AND NOT is not optional, and what a layer is "about" is not the test -- the rule named the wetland layer, so the wetland layer runs. It works in the opposite direction from the other two, which is its only difference: the parcels it names are the ones that fail. It names C, so C fails. Of A and C, only A is left.',
        'Count it by elimination, each parcel counted out once at the first condition it fails. Parcels B and E fail the vacancy condition: 2. Of A, C and D, parcel D fails the sewer condition: 1 more. Of A and C, parcel C fails the wetland exclusion: 1 more. 2 plus 1 plus 1 is 4 eliminated, and 5 minus 4 is 1 surviving. One parcel, A, which is what the conditions gave.',
        'Now the check to remember, and it is three clues of three different kinds at one location. The land-use layer says what parcel A is used for: nothing, it is vacant. The sewer layer says what service reaches it: the town line does. The wetland layer says what natural area covers it: none, because that layer names only C. Three offices collected those three facts separately, for three unrelated reasons, and all three agree at parcel A. One layer is a hunch; three layers that agree at the same place is an answer.',
        'Say what the stack cannot do, out loud, because the clerk is also asked which qualifying parcel has the most shade trees. No layer here records trees. The honest answer is that this stack cannot answer that question, and reading the land-use layer as a stand-in -- vacant, so probably bare -- would be a guess about the world dressed up as a reading of the data. The fix is a tree layer, not a cleverer reading of the layers already there.',
      ],
      answer:
        'Parcel A alone. The clerk made two mistakes. Reading AND as OR is the first, and the arithmetic exposes it: 3 vacant plus 3 on the sewer line is 6 names in a town of 5 parcels, because A and C were counted twice, which is how 4 parcels ended up on the list. Dropping the exclusion is the second, and it is what kept C, the one parcel inside the wetland. Vacant AND connected to the sewer line gives A and C; AND NOT inside the wetland removes C. Elimination checks it: 2 parcels fail vacancy, 1 fails the sewer condition, 1 fails the wetland exclusion, and 5 minus 4 is 1. Three different layers agree at parcel A, and the stack cannot say anything at all about trees, because no layer records them.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-two-layer-overlay',
      kind: 'try_yourself',
      problem:
        'Kesterly keeps two layers over the same six lots, numbered 1 through 6. The dry-slope layer names every lot on the dry slope: lots 1, 3, 4 and 6. The water-main layer names every lot connected to the town water main: lots 2, 3, 4 and 5. A lot a layer does not name is outside that layer. The fire marshal wants the lots that are on the dry slope AND connected to the water main. Which lots are they?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Lots 1, 2, 3, 4, 5 and 6, because every lot in town is named by at least one of the two layers and an overlay gathers every lot either layer names' },
        { id: 'b', text: 'Lots 1 and 6, because they are on the dry slope and the water-main layer does not name them, so they are the lots the two layers disagree about' },
        { id: 'c', text: 'Lots 3 and 4, because an AND rule keeps only the lots that clear both conditions, and they are the only two lots that both of these layers name', correct: true },
        { id: 'd', text: 'Lots 1, 3, 4 and 6, because a fire question is answered from the dry-slope layer and the water-main layer only records where the pipes run' },
      ],
      expectedAnswer: 'Lots 3 and 4, because an AND rule keeps only the lots that clear both conditions, and they are the only two lots that both of these layers name',
      hints: [
        'Write the two lists down and say the connector in the rule out loud. AND means a lot has to clear both conditions, so go lot by lot and ask which lots are named twice.',
        'An answer set can never be bigger than the shorter list it came from, so an answer holding every lot in town is the rule read with OR. Taking the dry-slope lots that the water layer leaves out answers a different question, and keeping the whole dry-slope list drops the second condition altogether.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-count-the-survivors',
      kind: 'try_yourself',
      problem:
        'Harrow keeps three layers over the same eight parcels, numbered 1 through 8. The flood layer names every parcel inside the flood zone: parcels 2, 4, 5, 7 and 8. The ownership layer names every parcel the town owns: parcels 1, 4, 5 and 7. The vacancy layer names every parcel that is vacant: parcels 4, 5 and 6. A parcel a layer does not name is outside that layer. The records office is asked how many parcels are inside the flood zone AND town-owned AND vacant. How many parcels is that?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Two parcels, because parcels 4 and 5 are the only ones that the flood layer, the ownership layer and the vacancy layer all three name', correct: true },
        { id: 'b', text: 'Three parcels, because parcels 4, 5 and 7 are inside the flood zone and town-owned, which is what a question about the town flood land needs' },
        { id: 'c', text: 'Seven parcels, because seven of the eight are named by at least one of the three layers, and only parcel 3 is named by none of them' },
        { id: 'd', text: 'Five parcels, because the flood layer names five and who owns a parcel and what it is used for do not change which land the flood zone covers' },
      ],
      expectedAnswer: 'Two parcels, because parcels 4 and 5 are the only ones that the flood layer, the ownership layer and the vacancy layer all three name',
      hints: [
        'Three conditions joined by AND means three tests, and a parcel has to pass all three. Run them in order: start from the flood list, keep only the parcels on it that the ownership layer also names, then keep only the ones left that the vacancy layer names.',
        'Check the survivors by elimination -- count each parcel out once at the first condition it fails, and the eliminated parcels plus the survivors have to come back to eight. Stopping after two conditions, gathering every parcel that any layer names, and answering from the flood layer alone are three ways of not running all three tests.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-the-stack-cannot-answer',
      kind: 'try_yourself',
      problem:
        'Alder keeps four layers over the same five blocks, numbered 1 through 5. The land-use layer records block 1 as a park, block 2 as housing, block 3 as shops, block 4 as offices and block 5 as workshops. The bus-stop layer names blocks 3 and 4. The flood layer names block 5. The school layer names block 4. A layer that does not name a block does not cover it. A council member asks the records office to overlay the layers and say which block has the most residents over the age of 65. What should the office answer?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Block 2, because the land-use layer records it as the housing block, and a question about the residents of a town is answered from the layer that records the housing' },
        { id: 'b', text: 'This stack cannot answer that question, because no layer in it records the ages of residents and a layer built to record something else cannot stand in for one nobody collected', correct: true },
        { id: 'c', text: 'No block can be named, because three of these four layers name only one or two blocks each and an overlay cannot be run until every layer names every block' },
        { id: 'd', text: 'Block 4, because three of the four layers name it and the block that the most layers name is the block where most of the town turns up' },
      ],
      expectedAnswer: 'This stack cannot answer that question, because no layer in it records the ages of residents and a layer built to record something else cannot stand in for one nobody collected',
      hints: [
        'Before running any overlay, go through the layers one at a time and ask what each one actually records. Then ask whether any of them records the thing the question is asking about.',
        'An overlay can only combine facts somebody collected. A layer that records what land is used for does not record who lives there or how old they are; counting how many layers name a block measures the layers rather than the block; and a layer that names only one block is complete as it stands, because a block it does not name is simply outside it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-or-for-and-and-the-dropped-exclusion',
      kind: 'misconception_check',
      question:
        'A student is given the Marden layers -- flood-zone parcels 2, 3, 5 and 7, road-front parcels 1, 2, 5, 6 and 8, eight parcels in all -- with the rule "inside the flood zone AND fronting a paved road", and writes: "Nine parcels, because four are in the flood zone and five front a road." Given the Thornbury rule "vacant AND connected to the sewer line AND NOT inside the wetland", the same student writes: "Parcel C qualifies. It is vacant and it is on the sewer line, and the wetland layer is a nature layer, so it does not belong in a building rule." What is wrong with each?',
      commonErrors: [
        {
          answer: 'Nine parcels are inside the flood zone and front a paved road, because four are in the flood zone and five front a road.',
          misconception:
            'Reading AND as OR and then adding the two lists, which both keeps parcels that pass only one condition and counts twice every parcel that passes both.',
          correctsTo:
            'Start with the arithmetic, because it fails before any parcel is looked up. Marden holds 8 parcels, and 4 plus 5 is 9, so a nine-parcel answer hands back more parcels than the town has. Parcels 2 and 5 are on both lists and were counted twice, so even the OR answer is 9 minus 2, which is 7. The rule, though, says AND, and AND keeps only the parcels both layers name: parcel 2 and parcel 5, which is 2 out of 8, or 25 percent. Elimination checks it: parcels 1, 4, 6 and 8 fail the flood condition and parcels 3 and 7 fail the road condition, so 4 plus 2 is 6 eliminated and 8 minus 6 is 2. WRONG: "Four plus five is nine parcels." CORRECT: "Both layers name parcels 2 and 5, so the answer is two parcels -- and an answer set is never bigger than the shortest list it came from."',
        },
        {
          answer: 'Parcel C qualifies, because the wetland layer is a nature layer and does not belong in a building rule.',
          misconception:
            'Treating an exclusion as optional, by deciding from a layer\'s subject matter whether it belongs in the rule instead of reading the rule, which named it.',
          correctsTo:
            'The rule is vacant AND connected to the sewer line AND NOT inside the wetland, and the third condition is a condition exactly like the other two. It runs in the opposite direction, and that is its only difference: the parcels the wetland layer names are the ones that fail. It names C, so C fails, and parcel A is the only parcel left. What a layer is "about" never decides whether it is in a rule; the rule decides, and an AND NOT condition is the one most often dropped, because removing places feels like a different kind of act from keeping them. Elimination checks it: B and E fail the vacancy condition, D fails the sewer condition, C fails the wetland exclusion, and 5 minus 4 is 1. WRONG: "The wetland layer is about nature, so leave it out." CORRECT: "The rule named the wetland layer, so the wetland layer runs, and it removes parcel C."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A geographic information system keeps each kind of fact in its own layer, all of them tied to the same locations, so the first move in any question is to go place by place and write down what each layer says about that place.',
        'An overlay is one condition per layer, run at every place. AND keeps only the places that pass every condition, adding a condition can never grow the answer set, and the answer set is always part of the shortest list you ran.',
        'Take the connector from the rule: AND keeps the places on both lists, OR keeps the places on either list, and AND NOT turns a layer into an exclusion whose named places fail. The same layers give different answers under each.',
        'An AND rule run as OR shows itself in the arithmetic: lists of 4 and 5 places in a town of 8 parcels come to 9, which is more parcels than exist, because the places on both lists were counted twice.',
        'Check a survivor count by elimination. Count each place out once, at the first condition it fails, and the eliminated places plus the survivors must return the total you started with.',
        'A stack answers only the questions its layers were built to answer. If no layer records what the question asks about, say so; a layer that records something else cannot stand in for one nobody collected.',
        'The answer set belongs to the layers and the rule, not to the places. Correct one layer and a parcel crosses in or out without moving a meter, so an overlay answer travels with the rule that produced it and the date of the layers behind it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'GIS Layers & Overlay Reasoning' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
