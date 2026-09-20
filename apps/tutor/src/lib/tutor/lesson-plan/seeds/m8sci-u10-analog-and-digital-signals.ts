/**
 * Grade 8 Science (Physical Science) — Light, Sound & Information: Analog &
 * Digital Signals.
 *
 * CONCEPT-LED row 10.4 (NGSS MS-PS4-3), and the LAST row of the course. There
 * is no procedure waiting here. The lesson builds one distinction --
 * information carried as a copied SHAPE against information carried as a
 * pattern of on-and-off SLOTS -- and then makes that distinction do work, by
 * arguing from described evidence why the second survives being copied and
 * sent a long way and the first does not.
 *
 * The argument is the hard part, and it has a trap on each side. On one side,
 * "digital is better because it is the newer technology", which explains
 * nothing and is not even true about the history: a lamp flashed in an agreed
 * pattern is a digital signal. On the other side, "a digital signal cannot be
 * damaged at all", which is the belief a student walks away with if the
 * mechanism is left vague. The file answers both by making the mechanism
 * explicit and bounded: a reader that only has to decide on-or-off in each
 * slot throws the fuzz away at every step, and that advantage is a claim
 * about SMALL fuzz, never a promise.
 *
 * SCOPE GUARD: this plan states that a wave can carry information, separates
 * an analog signal (a signal whose shape copies the original continuously)
 * from a digital one (information carried as a pattern of on and off pulses),
 * and argues from given descriptions that a digital signal is copied and
 * transmitted more reliably because a small unwanted change does not move a
 * slot across the on-or-off line. The scope cell has only TWO of the three
 * usual parts: part (i), copied verbatim into `los[0].description`, and a
 * withheld clause, verbatim -- "Withholds binary arithmetic, sampling rate
 * and compression." The cell carries NO lineage clause, and none is invented
 * here. What the boundary means at each edge, and what is deliberately
 * ALLOWED there:
 *   - BURNED EXAMPLES. Part (i) names "a voice on a phone" and "a picture
 *     over wifi", and part (i) is student-facing, so both are burned as item
 *     specimens. Both phrases occur exactly once each, inside
 *     `los[0].description`, where the verbatim-copy rule puts them; neither
 *     appears in any SEGMENT, and no item uses a telephone call or a home
 *     network. The three items run on a hilltop weather station, a bike-race
 *     speed sensor and a storm-hit link.
 *   - GRADE 8 NEIGHBORS. Row 10.3 (light versus sound and the electromagnetic
 *     spectrum) is the prerequisite and is assumed, not re-taught: no member
 *     of the electromagnetic spectrum is named in any segment, nothing is
 *     placed in order of wavelength, the word wavelength does not occur, and
 *     the speed of light is never compared with the speed of sound. (The
 *     string "electromagnetic-spectrum" does occur once, in the
 *     `prerequisites` loId, which is a chain reference and not authored
 *     prose.) In the segments, light appears only as the lamp of the first
 *     worked example, where all that matters about it is bright against
 *     dark. Rows 9.2 and 9.4 supply the wave measures: "amplitude" and
 *     "frequency" appear once each, in the first concept keyIdea, as words
 *     the student already holds -- neither is read off a description, neither
 *     is measured, and amplitude is never related to energy, which is row 9.4.
 *     Rows 10.1 and 10.2 are untouched: reflection, absorption and
 *     refraction do not appear, and nothing bends at a boundary. The word
 *     "transmitted" does occur, but only inside the scope cell's own phrase
 *     "copied and transmitted" and the sentences that argue it -- never as
 *     row 10.1's third outcome for a wave meeting a material.
 *   - THE ONE THING BORROWED FROM ROW 9.3, and it is borrowed as a stated
 *     fact rather than taught: a wave in a given material travels at the
 *     speed that material sets. It is used once, in a hint, to kill the
 *     distractor claiming pulses outrun a smooth wave down the same cable. No
 *     wave speed is computed, and no distance is ever worked out from a speed
 *     and a time.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears. The mist in the valley, the
 *     hilltop weather station and the storm are settings a signal has to
 *     cross; this file explains nothing about weather, air masses, climate,
 *     the ocean, plates or orbits, and none of those words is used as content.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - HS CHEMISTRY boundary: this row has no chemistry surface at all. No
 *     substance, particle, atom, element or reaction appears.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog, so
 *     that is the course above), and the row's own withheld clause on top of
 *     it. BINARY ARITHMETIC: no number is written in base two, no place value
 *     is used, and nothing is added, counted or converted -- the digits 1 and
 *     0 appear only as the two names written down for an on slot and an off
 *     slot, which is what the scope cell asks for. The word "bit" occurs
 *     nowhere in the file except in this guard, naming bit rate as something
 *     withheld. SAMPLING RATE: no segment says how often anything is
 *     measured, sampled or read, and no rate of measurement is stated for
 *     anything; the only two per-second phrases in the file are the clause
 *     naming frequency as a word the student already holds, and the
 *     one-second slots of the first worked example, and neither is a
 *     sampling rate. COMPRESSION: absent. Also stopped short of, because
 *     they are the next things an author would reach for: photon energy and
 *     wave-particle duality (`ap-physics2-modern.ts`); bit rate, bandwidth
 *     and error-correcting codes, which are the information-theory
 *     continuation and belong to no course in this catalog; and any voltage,
 *     current or circuit -- the pulses are described as "full strength" and
 *     "nothing at all", never in volts, because current electricity is
 *     excluded from this course entirely. The three allowed formulas are not
 *     needed by this row and none of them is written. The only arithmetic in
 *     the file is a comparison of fractions of full strength against one
 *     half, done in words.
 *   - THE LIMIT IS TAUGHT, NOT HIDDEN. The reliability claim is stated with
 *     its condition attached every time it appears, and the third item and
 *     the second half of the misconception check exist specifically to stop a
 *     student leaving with "digital cannot be damaged".
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every signal
 * in this file is written out in words -- what varies, what stays fixed, what
 * the receiver has to decide -- and every item is solvable from the text
 * printed inside it. Never write "look at the waveform", and never assume the
 * student has a lamp, a cable or a recording machine in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 10.3 -> 10.4 ->
 * nothing. `followUps` is empty because 10.4 is the LAST row of the course,
 * which is the curriculum table saying so -- it is not the registration-order
 * artifact that left the two exemplars with empty arrays.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U10_ANALOG_AND_DIGITAL_SIGNALS: LessonPlan = {
  id: 'evelyn.ms.m8sci.analog-and-digital-signals.v1',
  title: 'Analog & Digital Signals',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.analog-and-digital-signals',
      standard: 'M8SCI-10.4',
      description:
        'Explain that waves can carry information (a voice on a phone, a picture over wifi), distinguish an analog signal (a wave whose shape copies the original continuously) from a digital one (the information encoded as a pattern of on/off pulses -- 1s and 0s), and use given information to argue that digital signals are more reliably copied and transmitted because small distortions do not change which pulses are "on" and "off" (NGSS MS-PS4-3).',
    },
  ],
  prerequisites: ['m8sci.light-versus-sound-and-the-electromagnetic-spectrum'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put the whisper game beside the written-note version of the same game, so the student feels the difference between copying a shape and copying a decision before either one is named.',
      script:
        'You have probably played the game where a message goes around a circle in a whisper. "Meet at the blue gate" sets off, and ten people later it arrives as something like "eat the new skate". Nobody was trying to wreck it. Each person heard the sound a little wrong, passed on what they thought they heard, and the small mistakes piled up on top of one another until the message underneath was gone. Now change one thing about the game and play it again. This time the first person writes the message on a scrap of paper, and each person copies it out in their own handwriting before passing it on. Some of that handwriting is messy. It does not matter at all. The tenth person still reads "Meet at the blue gate", because every copier only had to decide, letter by letter, which letter it was -- and then write a fresh clean one. The whisper game is only a comparison, and here is where the comparison stops: a cable is not a person and nothing inside it is guessing. But the shape of the problem is exactly the same, and it is everywhere. Every recording and every message that reaches you travels as a wave at some point on its way, and every wave picks up unwanted fuzz. Some signals handle that fuzz the way the whisperers did, and some handle it the way the copiers did. By the end of today you will be able to tell which kind of signal you are dealing with from a description alone, and say exactly why one of them survives being copied over and over while the other does not.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-analog-digital-and-fuzz',
      kind: 'concept',
      goal: 'Install the two ways a wave can carry information, the fuzz that lands on both, the on-or-off decision that throws fuzz away, and the condition the whole reliability claim depends on.',
      keyIdeas: [
        'A WAVE CAN CARRY INFORMATION, AND IT DOES IT BY BEING CHANGED IN A PATTERN. On its own a wave carries energy from place to place and nothing more. To make it carry information as well, the sender deliberately changes something about the wave in a pattern that the receiver knows how to read, and then the receiver reads that pattern back out at the far end. What gets changed is usually how tall the wave is -- its amplitude, which you already know -- or how many times it wiggles each second, its frequency. The wave is the delivery. The pattern of changes is the message. There are exactly two ways of building that pattern, and the whole lesson is the difference between them.',
        'AN ANALOG SIGNAL COPIES THE SHAPE OF THE ORIGINAL, CONTINUOUSLY. In an analog signal the thing that varies rises and falls in step with the original, moment by moment, so that tracing the signal out over time would trace the very same shape as the thing it is standing in for. If the original doubles, the signal doubles. If the original wavers a little, the signal wavers a little. Two words in that sentence are doing real work. STAND IN FOR: the word analog comes from the idea of one thing being a faithful stand-in for another. CONTINUOUSLY: the signal can take any value in between, there are no steps and no gaps, and it never pauses. The wiggle cut into an old vinyl record is the clearest case there is -- the groove wanders from side to side in the same shape as the air was pushed and pulled by the music, and the needle simply traces it back.',
        'A DIGITAL SIGNAL CARRIES THE INFORMATION AS A PATTERN OF ON AND OFF PULSES. In a digital signal the time is divided into short slots of equal length, and in each slot the signal is put at one of only two settings: full strength, which is called on and is written with the digit 1, or nothing at all, which is called off and is written with the digit 0. The information is in WHICH slots are on and which are off. It is not in how tall the on pulses happen to be. Sender and receiver agree in advance on a code, and an agreed pattern of on and off slots can stand for any one of a great many different readings, in the same way that a handful of agreed letters can spell out any one of a great many different words. A lamp flashed in an agreed pattern of short and long flashes is a digital signal, and people were signaling that way from ship to ship long before any electronic machine existed. Digital does not mean new and it does not mean electronic. It means the information is carried by separate, agreed symbols instead of by a copied shape.',
        'EVERY SIGNAL PICKS UP FUZZ, AND THAT IS WHERE THE TWO KINDS PART COMPANY. Any real signal collects small unwanted changes as it travels and as it is copied: a hiss, a crackle, a rough edge added to what was smooth. Those unwanted changes are called noise, and neither kind of signal escapes them. What differs is what the receiver can do about them. In an analog signal the shape IS the information, so noise added to the shape is now part of the information, and nothing at the far end can tell a genuine wiggle from an added one, because there is no rule that says which wiggles belong to the original. Copy that copy and the next lot of noise adds on top. In a digital signal the receiver never has to reproduce a shape. It has to answer one question in each slot: on or off? A simple way to answer it is to compare the signal in the slot with a level halfway between nothing and full strength, and call anything above that line on. A small amount of noise cannot move a slot across that line, so the receiver reads the pattern that was sent, and can then send onward a fresh set of full-strength pulses with none of the old noise on them. The noise is thrown away at every step instead of building up.',
        'THE ADVANTAGE IS REAL, AND IT IS CONDITIONAL. Say the claim with its condition attached, every time: a digital signal is copied and transmitted more reliably than an analog one BECAUSE a small unwanted change does not change which side of the halfway line a slot sits on. Read that backwards and you have the limit. If the noise grows large enough to drag an on slot below the halfway line, or to lift an off slot above it, the receiver writes down the wrong symbol -- and that mistake does not arrive as a gentle hiss you can still hear through. It arrives as a different message, with nothing about it to show that anything went wrong. WRONG: "Digital is better because it is the newer technology." CORRECT: "Digital is copied more reliably because a reader only has to decide on or off, and small changes do not change that decision." Both of those sentences reach the same verdict. Only one of them is a reason.',
        'HOW TO ANSWER ANY QUESTION IN THIS LESSON, IN ORDER. First, ask what is actually carrying the information. Is it the exact size of something that varies smoothly, with every value in between allowed? That is analog. Is it which slots are on and which are off, with only two settings allowed? That is digital. Second, add a small unwanted change and follow it. In the analog signal it lands on the shape, and the shape was the message, so the message has changed and cannot be cleaned up. In the digital signal it lands on the pulses, but every slot is still on the same side of the halfway line, so the message is read correctly and can be passed on clean. Third, before you claim digital always wins, compare the SIZE of the change with the gap between on and off. The argument only runs while the change is the smaller of the two.',
      ],
      vocabulary: [
        { term: 'signal', definition: 'something sent from one place to another that carries information, such as a wave whose height is changed in a pattern a receiver knows how to read.' },
        { term: 'analog signal', definition: 'a signal that varies continuously and whose shape copies the shape of the original, so that every value in between is allowed.' },
        { term: 'digital signal', definition: 'a signal that carries its information as a pattern of separate slots, each set to one of only two settings, on or off.' },
        { term: 'pulse', definition: 'a short burst of signal at full strength, filling one slot of a digital signal; a slot with no pulse in it is off.' },
        { term: 'noise', definition: 'small unwanted changes that a signal picks up as it travels or is copied, such as a hiss on a recording or a rough edge on a smooth wave.' },
        { term: 'encode', definition: 'to turn information into a pattern that a signal can carry, using a code the sender and the receiver have agreed on in advance.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-lamp-across-the-valley',
      kind: 'worked_example',
      problem:
        'A rescue team on one ridge signals to a base camp on the ridge opposite using a very bright lamp. They can work it two ways. In METHOD ONE the signaler turns a dial that makes the lamp brighten and dim smoothly, and the brightness at every instant copies how hard the wind is blowing past the ridge at that instant, so a gust makes the lamp brighter by the same share that the wind rose. In METHOD TWO the signaler uses a code the two camps agreed on beforehand: during each one-second slot the lamp is either fully on or fully off, and the pattern of on and off seconds spells out the reading. Thin mist then drifts into the valley, and everything arriving at base camp is about one tenth dimmer than it was. For each method, say what base camp ends up with, and why.',
      steps: [
        'Name what is carrying the information in each method, because everything else follows from that. In method one it is the brightness itself, at every instant, and the brightness can take any value in between -- that is an analog signal, a stand-in whose shape copies the wind. In method two it is which one-second slots are on and which are off. How bright an on slot happens to be is not the information in method two. All that matters is that base camp can tell an on slot from an off one.',
        'Send the mist through method one. Every brightness arriving at base camp is reduced by about a tenth. Base camp reads the brightness, because the brightness is the message -- so every reading it writes down is now a little low. Worse, there is nothing base camp can do about it. A strong gust dimmed by the mist arrives looking exactly like a slightly weaker gust with no mist, and nothing in the signal itself says which one it was. The message has changed, and the change is now indistinguishable from the message.',
        'Send the same mist through method two. Base camp is not measuring brightness. It is applying one rule to each slot: if the light in this slot is more than halfway to the brightness of a clear on, write down on, and otherwise write down off. Take one tenth away from full brightness and nine tenths of full brightness is left, and nine tenths is more than one half, so every on slot is still read as on. An off slot was dark to begin with and the mist only makes it darker, so it stays well under one half and is still read as off. Base camp writes down exactly the pattern that was sent. It can then relay that pattern onward at full brightness, with no mist on it at all.',
        'WRONG: "The mist dimmed both signals, so both messages arrived a little wrong." CORRECT: "The mist dimmed both signals. Only one of them was carrying its information in the brightness, so only one of them was damaged. The coded flashes only had to land on the right side of halfway, and they did."',
        'Now run the two checks a science answer needs, because there is almost no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. (i) What carries the information: a continuously varying brightness in one method, a two-way decision in the other. (ii) The size of the disturbance set against what the receiver has to survive: a tenth of full brightness against a halfway line, and a tenth is much the smaller of the two. (iii) What the receiver can DO with what arrived: base camp can write down a clean pattern and pass it on fresh in method two, and has nothing to restore in method one, because it never knew what the undimmed brightness was. Three different kinds of clue, one answer.',
        'Second, change exactly one condition and check that the answer moves the way it should. Keep method two exactly as it is -- same lamp, same one-second slots, same mist -- but change base camp\'s rule from "decide on or off" to "write down exactly how bright each slot was". Now method two is damaged by the mist just as badly as method one, because base camp is back to reading a brightness that the mist changed. Nothing about the lamp moved. The advantage was never in the flashes. It was in the fact that the receiver only had to make a two-way decision, and the mist was far too small to change it.',
      ],
      answer:
        'Method one is analog: the brightness copies the wind continuously, so the mist changes the brightness and therefore changes the message, and base camp cannot separate the dimming from the reading. Method two is digital: the information is which one-second slots are on and which are off, base camp only has to decide whether each slot is above or below halfway, and a tenth of full brightness is nowhere near enough to move a slot across that line -- so the pattern arrives exactly as sent and can be relayed onward clean.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-relay-chain-argument',
      kind: 'worked_example',
      problem:
        'A team tests two ways of sending the same recording of a bell along a very long cable that has five relay stations spaced out along it, each one reading what arrives and sending it onward. The evidence they write down is this. METHOD A, a smooth wave whose height copies the sound of the bell: at station one a faint hiss can be heard behind the bell; at station three the hiss is louder; at station five the hiss is loud enough to cover the quietest part of the ring. METHOD B, the same bell sent as a string of slots that are each either full strength or nothing: at station one the arriving pulses have rough, fuzzy edges, but every slot is clearly above or below the halfway level, and the station sends onward a fresh set of full-strength pulses; the same thing happens at stations two, three, four and five; and the pattern of on and off slots that comes out of station five is the same pattern that went in at the start. Use this evidence to argue for or against the claim that digital signals are copied and transmitted more reliably.',
      steps: [
        'State the claim precisely before you test it, because a vague claim cannot be argued for or against. The claim is: a digital signal is copied and transmitted more reliably than an analog one. Evidence that would support it has to show the two kinds treated the SAME WAY and coming out differently. This test does exactly that -- same bell, same cable, same five stations -- so the comparison is fair and the evidence is worth something.',
        'Read the evidence for method A and say what mechanism produces it. The hiss grows from station one to station five. That is what has to happen when the shape is the information: each station receives a shape that already has noise on it, has no rule for telling the bell from the noise, copies the whole thing faithfully, and adds its own noise on top. Nothing in the chain removes anything. Five stages of small additions is a large addition.',
        'Read the evidence for method B, and notice the sentence that matters most: the arriving pulses have rough, fuzzy edges. The noise reached method B too. So whatever explains the difference, it is NOT that pulses avoid noise. The difference is in what each station has to do. A station only has to decide, slot by slot, above halfway or below. Every slot arrived clearly on the correct side of that line, so every decision was right, and the station then sent onward a set of fresh full-strength pulses carrying that decision and nothing else. The noise from the previous stretch of cable was discarded rather than copied.',
        'Now write the argument in one sentence, claim first and reasoning attached. The evidence supports the claim: the same noise landed on both signals, and only the digital one arrived unchanged, because its receivers had only to make a two-way decision that the noise was too small to change, while the analog receivers had to copy a shape that the noise had already become part of.',
        'WRONG: "Method B is more reliable because the pulses did not pick up any noise." CORRECT: "Both picked up noise -- the evidence says so in as many words. Method B is more reliable because its noise was thrown away at every station, and method A copied its noise onward and added more."',
        'Run the two checks. First, three clues of different kinds agreeing. (i) The trend across the stations: method A gets steadily worse stage by stage and method B does not change at all, which is the signature of noise accumulating in one and being discarded in the other. (ii) The mechanism, which explains that trend rather than just restating it: a shape has to be copied, a decision does not. (iii) The direct end-to-end check: the pattern out of station five matches the pattern that went in, which is a different kind of evidence again, because it tests the output against the input rather than watching the trend.',
        'Second, change exactly one condition and see whether the answer moves. Take the five relay stations out and send method B down one enormously long cable with nothing in the middle. Now the noise builds the whole way with nothing to discard it, and by the far end some slots have drifted to the wrong side of the halfway line, so the pattern that is read out is not the pattern that was sent. Same pulses, same code, same cable material -- and the advantage is gone. That tells you what the advantage actually rests on: the chance to read the pattern and re-send it clean while the noise is still small. Take that chance away and digital has no magic left.',
      ],
      answer:
        'The evidence supports the claim. Both signals picked up noise in the same cable, which the evidence states directly for method B, so the advantage is not that pulses avoid noise. It is that every relay station only had to decide whether each slot sat above or below the halfway level, and the noise was too small to change that decision, so each station could send onward fresh full-strength pulses and discard the noise -- while each station on method A had to copy a shape that the noise had already joined, and added its own noise to it, five times over.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-classify-two-signals',
      kind: 'try_yourself',
      problem:
        'A weather station on a hilltop sends its air-temperature reading down to a screen in the town below, and the engineers describe two ways of doing it. In the FIRST way, the station sends a wave whose height at every instant copies the air temperature at that instant: as the air warms, the wave grows taller by the same share, and as the air cools, the wave shrinks, smoothly and with no steps in between. In the SECOND way, the station divides the time into short slots and puts the signal in each slot at either full strength or nothing at all, and a pattern of on and off slots that both ends agreed on beforehand stands for each reading. Which statement classifies the two signals correctly, and for the right reason?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The first way is the digital one, because its height can take any value at all and every value is a number, and working in numbers is what the word digital means; the second way is the analog one, because it only ever uses whole slots.' },
        { id: 'b', text: 'Both ways are digital, because both are produced by electronic equipment on the hilltop and read by electronic equipment in the town, and any signal that an electronic machine makes and reads counts as a digital signal.' },
        { id: 'c', text: 'The first way is the analog one, because the height of its wave copies the air temperature continuously, and the second way is the digital one, because its information is carried by which slots are on and which are off rather than by a copied shape.', correct: true },
        { id: 'd', text: 'The second way cannot carry an air-temperature reading at all, because a slot that is only ever fully on or fully off has just two settings, and two settings cannot stand for the many different temperatures that the air on a hilltop can have.' },
      ],
      expectedAnswer: 'The first way is the analog one, because the height of its wave copies the air temperature continuously, and the second way is the digital one, because its information is carried by which slots are on and which are off rather than by a copied shape.',
      hints: [
        'Ask what is actually carrying the information in each case. Is it the exact size of something that varies smoothly, with every value in between allowed, or is it which slots are on and which are off?',
        'Neither word says anything about how new or how electronic the equipment is. One of them means the signal is a stand-in whose shape copies the original; the other means the information is carried as a pattern of separate agreed symbols. And remember that a handful of agreed symbols, arranged in enough different patterns, can stand for a great many different readings.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-argue-from-the-cable-test',
      kind: 'try_yourself',
      problem:
        'At a mountain bike race, a sensor beside the trail measures the speed of each rider as they pass and sends that reading down a long cable to the finish tent. The organizers test two ways of sending it along that same cable. In the first test the signal is a smooth wave whose height copies the measured speed, and it arrives at the tent with a rough, fuzzy edge added to it, so the readings come out slightly wrong and there is no way to tell which part of the height came from the rider and which part came from the fuzz. In the second test the reading is sent as a string of slots that are each either full strength or nothing, and those pulses arrive with the same fuzzy edge added to them -- but every slot is still clearly above or below the halfway level, so the tent reads back exactly the pattern that was sent. Which conclusion does this evidence support, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It supports the claim that a digital signal is copied and transmitted more reliably, because a string of short pulses travels down a cable faster than a smooth wave does, so the pulses spend less time inside the cable, and a signal that is inside the cable for a shorter time is exposed to whatever adds the fuzz for a shorter time.' },
        { id: 'b', text: 'It supports the claim that a digital signal is copied and transmitted more reliably, because the pulses arrived with no fuzz added to them at all, which shows that a signal built out of full-strength pulses is unable to pick up unwanted changes as it travels: a pulse either arrives at its full strength or it does not arrive at all.' },
        { id: 'c', text: 'It supports no conclusion about the two kinds of signal, because the real problem here is a worn-out cable: a cable in good condition would carry the smooth wave just as cleanly as it carries the pulses, so the organizers should replace the cable rather than change how the reading is coded, and once it was replaced the two tests would come out exactly the same as each other.' },
        { id: 'd', text: 'It supports the claim that a digital signal is copied and transmitted more reliably, because the same fuzz was added to both signals and only the pulses could still be read back correctly: the tent has to decide only whether each slot sits above or below halfway, while in the smooth wave the height is the reading, so the fuzz became part of it.', correct: true },
      ],
      expectedAnswer: 'It supports the claim that a digital signal is copied and transmitted more reliably, because the same fuzz was added to both signals and only the pulses could still be read back correctly: the tent has to decide only whether each slot sits above or below halfway, while in the smooth wave the height is the reading, so the fuzz became part of it.',
      hints: [
        'Both signals came out of the same cable with the same fuzz added, and the description says so for each of them. So whatever explains the difference cannot be that one of them avoided the fuzz. Ask what the finish tent has to do with each signal once it arrives.',
        'A wave in a given material travels at the speed that material sets, so both signals spent the same time inside that cable. The difference is that one of them carries its information in a height that the fuzz changed, and the other in a decision that a small amount of fuzz cannot change.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-when-the-noise-is-large',
      kind: 'try_yourself',
      problem:
        'A digital link sends its information in short time slots. A slot sent at full strength means on, and a slot sent at nothing at all means off. The machine at the far end uses one rule to read them: if the signal in a slot is more than halfway to full strength, write down on, and otherwise write down off. During a storm the link picks up heavy electrical fuzz, and that fuzz adds as much as seven tenths of full strength to some of the slots. What does this evidence tell you about the claim that digital signals are more reliably copied and transmitted?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It tells you that the claim holds only while the added fuzz stays small next to the gap between on and off. Fuzz that adds seven tenths of full strength can lift a slot that was sent as nothing up past the halfway level, so the far end writes down on where off was sent, and the pattern it records is not the pattern that was sent.', correct: true },
        { id: 'b', text: 'It tells you nothing about the claim, because a digital signal carries its information as a pattern of on and off slots rather than as a copied shape, and a pattern of separate symbols cannot be altered by fuzz however large that fuzz grows, because each slot is either sent or not sent and there is nothing in between for the fuzz to take hold of.' },
        { id: 'c', text: 'It tells you the message will arrive slightly rough and muffled, in the same way a recording with a hiss on it does, because heavy fuzz wears a digital signal down a little at a time rather than changing which slots get read as on, so the pattern itself still comes through and only its quality suffers.' },
        { id: 'd', text: 'It tells you the claim is wrong, and that a smooth wave copying the original would have been the more reliable choice on this link, because a smooth wave has no halfway level anywhere in it for the fuzz to push it across, so its readings would have come out gently wrong instead of jumping to a completely different value.' },
      ],
      expectedAnswer: 'It tells you that the claim holds only while the added fuzz stays small next to the gap between on and off. Fuzz that adds seven tenths of full strength can lift a slot that was sent as nothing up past the halfway level, so the far end writes down on where off was sent, and the pattern it records is not the pattern that was sent.',
      hints: [
        'Work the reading rule through with the numbers you were given, and start from a slot that was sent as off. It leaves at nothing. Add seven tenths of full strength to it, then compare what is left with the halfway level of one half.',
        'The reliability of a digital signal is a claim about SMALL unwanted changes, not a promise that nothing can go wrong. Ask how big a change the on-or-off decision can survive, and what has happened once a change is bigger than that.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-newer-and-untouchable',
      kind: 'misconception_check',
      question:
        'A student writes: "Digital signals are better because digital is the new technology and analog is the old technology. And once a signal is digital, fuzz cannot touch it at all." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'Digital signals are better because digital is the new technology and analog is the old technology.',
          misconception:
            'Reading the two words as points on a timeline of equipment rather than as two different ways of carrying information, because most of the digital things a student meets are recent and most of the analog ones they have heard of are not.',
          correctsTo:
            'The two words describe HOW the information is carried, and nothing else. Analog means the signal is a stand-in whose shape copies the original continuously. Digital means the information is carried as a pattern of separate agreed symbols, such as slots that are each on or off. Age has nothing to do with it: a lamp flashed in an agreed pattern of short and long flashes is a digital signal, and people signaled that way from ship to ship long before any electronic machine existed. Nor is analog broken. An analog signal that is fresh and undisturbed carries the shape of the original faithfully, which is exactly what it is for. The advantage digital has is narrow and specific, and the reason is the whole of it: a receiver only has to decide on or off in each slot, and a small unwanted change does not change that decision, so the noise can be thrown away at every copy instead of building up. WRONG: "It is better because it is newer." CORRECT: "It is copied and transmitted more reliably because the receiver only has to make a two-way decision."',
        },
        {
          answer: 'Once a signal is digital, fuzz cannot touch it at all.',
          misconception:
            'Turning a conditional advantage into an absolute one, because "the noise does not change the answer" is easy to remember as "there is no noise" once the halfway line has been dropped from the sentence.',
          correctsTo:
            'A digital signal picks up noise exactly as an analog one does -- it travels through the same cable or the same air, and the pulses arrive with rough, fuzzy edges on them. Nothing protects them from that. What the noise cannot do, while it stays small, is move a slot from one side of the halfway line to the other, so the receiver still reads the same pattern and can send it onward clean. Once the noise grows larger than that gap, it wins: an on slot dragged below halfway is read as off, an off slot lifted above halfway is read as on, and the message is now a different message. And a digital failure is the harsher of the two when it comes, because an analog signal buried in noise still arrives as a hissy version of the original, while a digital signal read wrongly arrives as something else entirely, with nothing about it to show that anything went wrong. WRONG: "Fuzz cannot touch a digital signal." CORRECT: "Fuzz lands on a digital signal too. It just does not change the on-or-off decision, as long as it stays small next to the gap between on and off."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A wave carries information when the sender changes something about it -- how tall it is, or how many times it wiggles each second -- in a pattern the receiver knows how to read.',
        'An ANALOG signal varies continuously and its shape copies the shape of the original, with every value in between allowed. The groove on a vinyl record is the clearest case.',
        'A DIGITAL signal divides the time into slots and puts each slot at one of only two settings: full strength, called on and written with the digit 1, or nothing at all, called off and written with the digit 0.',
        'In a digital signal the information is WHICH slots are on, not how tall the on pulses happen to be. Sender and receiver agree the code in advance.',
        'Digital does not mean new and it does not mean electronic. A lamp flashed in an agreed pattern is a digital signal.',
        'Every signal picks up noise as it travels and as it is copied. Digital signals are not exempt from this.',
        'In an analog signal the shape is the information, so noise becomes part of the message and cannot be separated from it; copy the copy and the noise builds up.',
        'In a digital signal the receiver only has to decide, for each slot, above halfway or below. Small noise does not change that decision, so the receiver can send onward fresh full-strength pulses and throw the noise away.',
        'That is the reason digital signals are copied and transmitted more reliably -- and it is the whole reason, so say it with its condition: it holds while the noise stays small next to the gap between on and off.',
        'Once the noise is large enough to push a slot across the halfway line, the pattern is read wrongly, and the result is not a hissy message but a different one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Analog & Digital Signals' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
