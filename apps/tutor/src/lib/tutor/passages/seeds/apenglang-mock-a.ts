import type { Passage } from '../types';

/**
 * AP English Language Form A (mock exam) — 7 original stimulus passages.
 * ORIGINAL content authored for this mock; not derived from any released AP
 * exam. rc1/rc2/rc3 are reading-analysis nonfiction prose (distinct voices);
 * wr1/wr2 are "student draft" passages with numbered sentences for
 * writing/revision MCQs; ra is the rhetorical-analysis FRQ stimulus (a
 * period-style public address by a clearly FICTIONAL speaker); syn is the
 * synthesis-FRQ packet (six short sources A-F, one a described table).
 */
export const APENGLANG_MOCK_A_PASSAGES: Passage[] = [
  {
    id: 'evelyn.passage.apenglang-mock-a-rc1.v1',
    title: 'The Apprenticeship of the Ear',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apenglang-mock-a',
    license: 'internal-original',
    genre: 'essay',
    fullText:
      `For a long time I believed that learning to write meant learning to fill a blank page. I collected words the way some children collect stones, turning each one over for its weight and gloss, and I assumed that a good sentence was simply a heap of good words arranged in a plausible order. It took me years to understand that I had the whole enterprise backward. Writing, I finally learned, is not first an act of the hand but an act of the ear.\n\n` +
      `My education began the summer I worked as a typist for my great-aunt, a woman who had spent forty years writing letters for people who could not, or would not, write their own. She dictated slowly, and she made me read every sentence back to her before I was allowed to move to the next. If a phrase sounded wrong to her — too pleased with itself, too eager, too flat — she would wave her hand and say, "Again." I resented this at first. The words were fine on the page; what more could she want? But she was not listening to the page. She was listening to the sound a sentence makes when it lands in another person's mind, and she could hear a false note the way a piano tuner hears a string gone slightly sharp.\n\n` +
      `What she was teaching me, though neither of us would have called it that, was patience. A sentence that reads well silently may still stumble when spoken, and the stumble is information. It tells you where the thought is muddy, where you have hidden a weak idea behind a handsome word, where you have asked the reader to hold too much in the air at once. The ear is an honest editor. It will not be flattered, and it cannot be argued with.\n\n` +
      `I have kept her habit. Every paragraph I write, I now read aloud, usually to an empty room, occasionally to a patient dog. My neighbors must think I am rehearsing for some perpetual performance. In a sense I am. Prose is a performance the reader gives silently, in the private theater of the skull, and the writer's job is to hand over a script that can be performed without tripping. When I forget this — when I write to impress rather than to be understood — the sentences grow ornate and airless, and the reading aloud exposes them at once.\n\n` +
      `I am wary now of advice that treats writing as a matter of rules to be memorized. Rules have their place; they are the scaffolding, not the building. What I trust instead is the slow, unglamorous apprenticeship of the ear, the daily discipline of listening to your own sentences as a stranger would hear them. It is humbling work. It asks you to admit, again and again, that what you meant is not yet what you have said. But there is no shortcut I have ever found, and I have looked. My great-aunt would have been amused that it took me so long to hear what she told me the first week: that the page is silent, but the sentence is not.`,
    lineNumbered: false,
    wordCount: 529,
  },
  {
    id: 'evelyn.passage.apenglang-mock-a-rc2.v1',
    title: 'Keep the Lights On: The Case for the Third Place',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apenglang-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `Every city budget season, the same tired argument returns: the public library, the community pool, the neighborhood recreation center are "nice to have" but not essential, the first line items to trim when revenue falls short. This reasoning is not merely shortsighted. It misunderstands what a city is for.\n\n` +
      `A city is not a collection of private addresses connected by roads. It is a place where strangers become, if not friends, at least familiar to one another — and that transformation does not happen at home or at work. It happens in what sociologists call the "third place," the free or nearly free public spaces where people gather without being customers or employees. The library is the purest example. You need not buy anything to enter. You need not explain why you have come. You may stay for an hour or a day, and no one will move you along.\n\n` +
      `Critics will say that in an age of screens, such spaces are obsolete. Why maintain a building full of books when the same information streams to every phone? But this objection mistakes the library's function. People do not go to the library only for information; they go to be among others while remaining themselves. A teenager without a quiet home finds a desk. A new arrival to the country finds a free class and a face that greets her by name. An older man, recently widowed, finds a reason to put on his coat and walk into the world. None of this appears on a spreadsheet, and all of it is the actual life of a city.\n\n` +
      `Consider what fills the vacuum when these places disappear. When the only spaces open to us are the ones that want our money, we learn to see one another chiefly as competitors and consumers. Isolation is not merely sad; it is expensive. The lonely are sicker, the disconnected more fearful, the community without shared ground more easily divided against itself. A city that closes its commons does not save money. It defers a larger bill, and it pays that bill in a currency harder to earn back than dollars.\n\n` +
      `I do not pretend that budgets are limitless or that every program deserves protection. Hard choices are real. But when we make them, we should be honest about what we are choosing. To shutter the third places is to decide, quietly, that the city will no longer be a place where a stranger can simply be — that belonging will henceforth require a purchase. That is a poorer city, whatever the ledger says.\n\n` +
      `So keep the lights on. Fund the branch that stays open late, the pool that lets the neighborhood cool off in August, the center where the chess players and the toddlers and the job-seekers share a room. These are not luxuries a city affords once it is rich. They are part of what makes a city worth being rich for.`,
    lineNumbered: false,
    wordCount: 489,
  },
  {
    id: 'evelyn.passage.apenglang-mock-a-rc3.v1',
    title: 'The Cartographers of Blank Spaces',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apenglang-mock-a',
    license: 'internal-original',
    genre: 'essay',
    fullText:
      `In an old atlas I inherited, the interiors of several continents are simply empty. Not blank in the sense of unfinished, but blank on purpose: the coastlines are drawn with confidence, the rivers traced a little way inland, and then the paper is left bare, as if the mapmaker had set down his pen at the edge of what he could honestly claim to know. I have come to think of those empty spaces as the most truthful part of the map.\n\n` +
      `It is tempting to read early maps as a record of ignorance, and in one sense they are. The cartographers did not know what lay beyond the coast. But there is a discipline in the way the better ones handled that ignorance. They did not invent. Where the evidence stopped, the drawing stopped. A lesser mapmaker might have filled the void with imagined mountains and hopeful rivers, and some did, decorating the unknown with sea monsters and speculative kingdoms. The mapmaker I admire left the space open, a standing admission that here his knowledge ended and someone else's would have to begin.\n\n` +
      `We do not honor this restraint as we should. We prize the map that answers, the account that explains everything, the confident voice that leaves no question dangling. A blank space feels like a failure, an unfinished job. Yet the honest blank is a kind of gift to whoever comes next. It marks the frontier precisely. It says: the known world ends here, and beyond this line you must rely on something other than my authority. To read such a map is to be trusted with the truth about its limits.\n\n` +
      `I think often of this when I read history, or science, or my own memory of events long past. The temptation is always to smooth the account, to fill the gaps with plausible invention until the story runs seamlessly from coast to coast. But the seamless story is usually the dishonest one. Real knowledge has ragged edges. It trails off where the records were lost, where the witnesses disagreed, where no one was watching. The writer who pretends otherwise has decorated the interior with monsters and called it a map.\n\n` +
      `There is a humility in the blank space that I would like to learn. It does not mean giving up the effort to know; the coastlines, after all, are drawn with care, and hard-won. It means being willing to stop at the edge of the evidence and to mark that edge clearly, so that the reader knows where the solid ground gives way. The old cartographers could not fill their continents, and to their lasting credit, most of them did not pretend to. They drew what they knew, confessed what they did not, and trusted the future to do the rest.\n\n` +
      `The atlas is useless now for finding one's way; the blanks have long since been surveyed and filled. But I keep it on the shelf as a lesson in a rarer kind of accuracy — the accuracy that knows the difference between the edge of the world and the edge of one's knowledge, and has the honesty to draw the line there.`,
    lineNumbered: false,
    wordCount: 528,
  },
  {
    id: 'evelyn.passage.apenglang-mock-a-wr1.v1',
    title: 'Student Draft: Later School Start Times',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apenglang-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `(1) At my high school, the first bell rings at 7:25 in the morning, and by the time it does, half the students in my first-period class are already slumped over their desks. (2) They are not lazy. (3) They are tired, and there is a growing body of research that explains why. (4) Adolescents undergo a biological shift in their sleep cycles that makes it difficult for them to fall asleep before eleven at night, no matter how early they climb into bed. (5) Asking a teenager to be alert at 7:25 is a little like asking an adult to think clearly at four in the morning.\n\n` +
      `(6) Sleep researchers have documented the consequences of this mismatch. (7) Students who are chronically short on sleep show measurable declines in memory, attention, and mood. (8) Some districts that have pushed their start times later report improvements in attendance and even in the number of car accidents involving teenage drivers. (9) The evidence points in one direction. (10) Later start times are better for adolescent health and learning.\n\n` +
      `(11) Critics raise practical objections, and these deserve a fair hearing. (12) A later start can change bus schedules, after-school jobs, and sports practices, which often depend on the current timetable. (13) Parents who leave for work early may worry about leaving younger children unsupervised. (14) These concerns are real. (15) They are also, in most cases, solvable with planning, and several districts have already shown that the schedule can be rearranged without disaster.\n\n` +
      `(16) I understand that changing the start time is not as simple as moving the hands of a clock. (17) But we should be honest about what the current schedule costs. (18) Every morning, we ask students to learn at the exact hour their bodies are least prepared to, and then we wonder why so many of them struggle. (19) The problem is not the students. (20) A schedule built for the routines of adults is being applied to the biology of teenagers, and the mismatch is doing real harm.\n\n` +
      `(21) I am not arguing that a later bell would solve every problem a student faces. (22) There will still be hard classes, long nights, and the ordinary difficulty of growing up. (23) But of all the obstacles a school places in a student's way, this one is unusual, because we know its cause, we know its cost, and we know how to fix it. (24) A school that claims to put learning first should be willing to start the day at an hour when learning is actually possible.`,
    lineNumbered: false,
    wordCount: 430,
  },
  {
    id: 'evelyn.passage.apenglang-mock-a-wr2.v1',
    title: 'Student Draft: The Vacant Lot',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apenglang-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `(1) For as long as I could remember, the lot at the corner of Third and Maple had been an eyesore. (2) It was a fenced rectangle of cracked concrete and stubborn weeds, collecting litter and little else. (3) Last spring, a group of neighbors decided to do something about it, and the transformation that followed taught me an important lesson about my neighborhood.\n\n` +
      `(4) The project began with a petition. (5) A retired teacher named Ms. Alvarez gathered signatures from nearly every household on the block, asking the city to lease the unused lot to the neighborhood for a community garden. (6) The city agreed, on the condition that residents maintain the space themselves. (7) That condition turned out to be the project's greatest strength. (8) Because the garden belonged to everyone who worked in it, everyone had a reason to care for it.\n\n` +
      `(9) The early weeks were not glamorous. (10) Volunteers hauled away broken concrete, trucked in soil, and built raised beds out of donated lumber. (11) Progress was slow. (12) By midsummer, the first vegetables appeared, and the lot that had been a symbol of neglect became a place people actually wanted to visit.\n\n` +
      `(13) What surprised me most was not the vegetables but the conversations. (14) Neighbors who had lived beside one another for years without speaking now traded gardening advice across the fence. (15) Children who had nowhere to play discovered a plot of their own to tend. (16) An elderly man who lived alone told Ms. Alvarez that the garden had given him a reason to leave his apartment each morning. (17) The garden gave the neighborhood more than vegetables.\n\n` +
      `(18) The project was not without setbacks. (19) A summer storm flattened half the tomato plants, and a dispute over watering schedules briefly divided the volunteers. (20) These problems were worked out in the same way the garden itself had been built, through argument, compromise, and shared labor. (21) The setbacks, in the end, became part of what bound the group together.\n\n` +
      `(22) I used to walk past that corner without a second glance. (23) Now I understand that a vacant lot is never really empty; it is a challenge the neighborhood has not yet answered. (24) Ours answered it with a garden, and in doing so we discovered that we were a neighborhood after all, and not merely a collection of people who happened to share a street.`,
    lineNumbered: false,
    wordCount: 406,
  },
  {
    id: 'evelyn.passage.apenglang-mock-a-ra.v1',
    title:
      'Address at the Opening of the Meridian Public Waterworks (fictional speaker: Mayor Adelaide Croft, 1897)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apenglang-mock-a',
    license: 'internal-original',
    genre: 'speech',
    fullText:
      `Friends and fellow citizens of Meridian,\n\n` +
      `We gather this morning beside a plain brick building and a length of iron pipe, and I would forgive the visitor who wondered why such a thing should call for speeches. Let me tell him. What we open today is not merely a waterworks. It is a promise, made in brick and iron, that the health of the poorest child on Canal Street shall no longer depend on the accident of which well his family can reach.\n\n` +
      `You will remember the summer of the fever. I need not describe it; too many of you buried what you loved that August, and the memory needs no ornament from me. But I will ask you to remember one fact above the rest. The fever did not fall upon us like weather, blind and impartial. It followed the bad water. It spared the streets that had clean wells and settled hardest upon the streets that had none. What we called an act of Providence was, in sober truth, an act of neglect — ours.\n\n` +
      `I have heard it said, in the council chamber and the newspaper alike, that a city cannot afford such works as these. I answer that a city cannot afford to be without them. We paid for dirty water already, and we paid in the only currency that cannot be recovered. Set the cost of these pipes beside the cost of that August, and tell me honestly which was the extravagance.\n\n` +
      `Some will say that each family should look to its own well, its own health, its own fortune, and that a city owes no man his water. It is a tidy philosophy. It has only one defect: the fever did not respect it. Disease bred in the crowded lanes does not stay in the crowded lanes. It rides the same streetcars we all ride; it drinks, so to speak, from the common cup. In a city, no man's health is entirely his own affair, and the sooner we govern as though we believed it, the fewer Augusts we shall have to bury.\n\n` +
      `Look, then, at what we have built. The water that will run through these pipes is drawn from above the town, filtered through sand and gravel, and carried to a public fountain within reach of every ward. The washerwoman on Canal Street will draw from the same source as the banker on the hill. I do not offer that fact as sentiment. I offer it as the plainest justice a city can perform: to make the first necessity of life a common right and not a private privilege.\n\n` +
      `I will not pretend the work is finished. Pipes crack; reservoirs silt; the appetites of a growing town outrun the plans of its founders. Those who come after us will have to mend and enlarge what we have begun, and I envy them the task, for it is the happiest labor a citizen can be given — to improve upon a good thing honestly started.\n\n` +
      `So I ask you not merely to applaud these pipes but to defend them: to pay for their keeping, to guard them against the false economy that would let them fall into ruin the moment the memory of the fever fades. Let it not fade. Let this plain brick building stand as long as the town stands, and let it say to every generation that once, when we were asked whether the health of the many was worth the cost to the many, Meridian answered yes.\n\n` +
      `I thank you, and I declare the waterworks open.`,
    lineNumbered: false,
    wordCount: 596,
  },
  {
    id: 'evelyn.passage.apenglang-mock-a-syn.v1',
    title: 'Synthesis Packet: Should Communities Restrict Nighttime Outdoor Lighting?',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apenglang-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The following sources address the debate over "dark-sky" ordinances — local rules that limit the brightness, direction, or hours of outdoor lighting at night. Read the sources carefully and use them to develop your own position.\n\n` +
      `Source A (Whitfield)\n\n` +
      `From an essay by an astronomy educator. For most of human history, anyone who looked up on a clear night saw thousands of stars and the pale arch of the Milky Way. Today, the majority of people in industrialized countries live under skies so washed out by artificial light that they have never seen it. Something is lost when a night sky becomes a blank orange haze — not only a scientific resource but a shared human inheritance. A dark-sky ordinance is not an attack on progress. It is an attempt to keep one small, cost-free wonder available to the children who come after us. We shield our historic buildings and our old-growth forests; the night sky deserves no less.\n\n` +
      `Source B (Ruiz)\n\n` +
      `From a public-safety official's testimony to a city council. I understand the appeal of darker skies, but my responsibility is the safety of residents on the ground. Well-lit streets, parking lots, and walkways help people see hazards, discourage certain kinds of crime, and allow drivers to spot pedestrians. Any lighting ordinance must be written carefully so that the pursuit of a prettier sky does not leave a stairwell or a crosswalk dangerously dark. I do not oppose all reform, but safety cannot be an afterthought.\n\n` +
      `Source C (Okafor)\n\n` +
      `From an article on lighting technology. Much of the debate rests on a false choice between "bright" and "dark." Modern fixtures make it possible to have both safety and darker skies. Fully shielded fixtures direct light downward, where it is needed, rather than sideways and up into the sky, where it is wasted. Warmer-toned bulbs scatter less. Motion sensors and timers keep lights off when no one is present. A well-designed ordinance does not demand that a town go dark; it demands that its light be aimed, timed, and colored intelligently.\n\n` +
      `Source D (table)\n\n` +
      `The following data are adapted from a survey of 40 municipalities in the three years after each adopted a dark-sky lighting ordinance. The table reports the median change in three measures. First row, average nighttime sky brightness: decreased 18 percent. Second row, municipal outdoor-lighting energy cost: decreased 23 percent. Third row, reported nighttime street-crime incidents: no statistically significant change. The survey's authors caution that the 40 municipalities volunteered their data and may not represent all communities.\n\n` +
      `Source E (Delacroix)\n\n` +
      `From a small-business owner's letter to a local newspaper. These ordinances sound harmless until you own a shop on Main Street. My illuminated sign is how customers find me after dark, and the parking lot lighting is what makes people feel safe coming to my door in the evening. When the town writes rules for "the sky," it is my electric bill and my livelihood that pay for the experiment. If the council wants darker nights, let it start with its own streetlights before it dims the businesses that keep this town alive.\n\n` +
      `Source F (Hollis)\n\n` +
      `From a review of research on artificial light and wildlife. The effects of nighttime lighting are not confined to human observers. Artificial light disorients migrating birds, which collide with illuminated buildings in large numbers; it draws insects to their deaths and disrupts the species that feed on them; it interferes with the nesting of sea turtles, whose hatchlings follow bright horizons in the wrong direction. Reducing unnecessary light at night is among the cheapest conservation measures available, requiring no new land and often saving money that would otherwise be spent on electricity.`,
    lineNumbered: false,
    wordCount: 611,
  },
];
