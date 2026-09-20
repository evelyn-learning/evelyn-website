/**
 * Grade 8 English Language Arts — Unit 10 CED 10.4: Following a Standard Citation Format.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8ela.following-a-standard-citation-format.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8ELA_U10_FOLLOWING_A_STANDARD_CITATION_FORMAT: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8ela.following-a-standard-citation-format.v1',
  course: 'Grade 8 English Language Arts',
  cedUnit: 10,
  cedTopic: '10.4',
  cedTitle: 'Following a Standard Citation Format',
  planId: 'evelyn.ms.m8ela.following-a-standard-citation-format.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8ela.following-a-standard-citation-format.v1' }],
  theory: [
    { loId: 'm8ela.following-a-standard-citation-format', content: `A FORMAT IS AN AGREEMENT ABOUT ORDER. You already know what a citation carries: who made the source, what it is called, what larger thing it sits inside, when it came out, and how a reader gets back to it. A format takes those pieces and fixes their order and the marks between them, so that a reader can look at any line in any list and tell which piece is which without a single label. The format in this lesson is called MLA, and it is the one English classes usually ask for. A class may hand you a different one, and the move does not change: you follow the order you are given, exactly.` },
    { loId: 'm8ela.following-a-standard-citation-format', content: `THE ORDER, PIECE BY PIECE. Author. Title of the source. Container — the larger thing the source sits inside, such as the magazine that carried the article or the website that carried the page. Publisher. Date. Location. The author goes last name first: a comma, then the first name, then a period. A period also closes the title of the source. Everything after those two pieces is separated by commas, and one period ends the entry. Here is an article: Ruiz, Camila. "The Bay at Low Tide." Harbor Review, 14 Mar. 2022, pp. 18-23.` },
    { loId: 'm8ela.following-a-standard-citation-format', content: `A PART TAKES QUOTATION MARKS AND A WHOLE DOES NOT. An article and a page on a site are parts: each one sits inside something bigger, so its title goes in quotation marks, with the period tucked inside them. The container is the whole, and its title is italicized when you type it — the magazine, the website, the book. A book you read straight through is not a part of anything, so its own title is the italicized one and the entry has no container at all: Okafor, Daniel. Tide Pools of the Cold Coast. Marrow Hill Press, 2019. This lesson is spoken, and every entry below is printed plain, so what you are judging is never the slant of the letters. It is the order of the pieces and the marks between them.` },
    { loId: 'm8ela.following-a-standard-citation-format', content: `LOCATION MEANS WHERE THE SOURCE SITS INSIDE ITS CONTAINER, and it is the last thing in the entry. For an article on paper it is the page range, written pp. 18-23. For a page on a site it is the web address, written without the https:// on the front. A whole book has no location, because it is not sitting inside anything bigger; its entry stops at the publisher and the year. One more piece goes missing on purpose: the publisher is left out whenever it carries the same name as the website, because printing that name twice tells a reader nothing.` },
    { loId: 'm8ela.following-a-standard-citation-format', content: `DATES RUN DAY, MONTH, YEAR, and the month is abbreviated whenever its name runs longer than four letters: Jan., Feb., Mar., Apr., Aug., Sept., Oct., Nov., Dec. May, June and July are short enough to write out. An article printed on the twelfth of April in 2022 carries 12 Apr. 2022; a page posted on the third of June in 2021 carries 3 June 2021.` },
    { loId: 'm8ela.following-a-standard-citation-format', content: `THE IN-TEXT REFERENCE IS A SHORT POINTER INTO THAT LIST. Beside the borrowed material you put, in parentheses, the author's last name and the page the material came from, with nothing between them: (Ruiz 20). The parentheses sit after the closing quotation mark and before the period that ends your sentence. If the source carries no page numbers, which is ordinary for a page on a site, the last name stands alone: (Nandakumar). The name has to be the same word the works-cited entry begins with, because the list is in alphabetical order by that word. That match is the entire reason a pointer this short can work.` },
    { loId: 'm8ela.following-a-standard-citation-format', kind: 'definition', title: 'citation format', content: `an agreed order for the pieces of a citation, with agreed marks between them, so that every entry in a list can be read the same way. The one used here is called MLA.` },
    { loId: 'm8ela.following-a-standard-citation-format', kind: 'definition', title: 'works-cited entry', content: `the full listing of one source in the list at the end of a report, with its pieces laid down in the order the format fixes.` },
    { loId: 'm8ela.following-a-standard-citation-format', kind: 'definition', title: 'container', content: `the larger work a source sits inside: the magazine that carried the article, the website that carried the page.` },
    { loId: 'm8ela.following-a-standard-citation-format', kind: 'definition', title: 'location', content: `the last piece of an entry, saying where the source sits inside its container — a page range for something printed, a web address for a page online.` },
    { loId: 'm8ela.following-a-standard-citation-format', kind: 'definition', title: 'in-text reference', content: `the short pointer in parentheses beside the borrowed material, carrying the author's last name and, when the source has one, the page number.` },
  ],
  methods: [
    {
      title: 'Worked build a web page entry',
      steps: [
        `Start with the author, last name first, closed by a period: Nandakumar, Priya. The inversion is not decoration. The list at the end is put in alphabetical order by whatever word starts each entry, so the last name has to be that word.`,
        `Next comes the title of the source itself, which here is the page. A page on a site is a part sitting inside a whole, so its title takes quotation marks, and the period that closes it goes inside them: "How a Drawbridge Lifts."`,
        `Now the container, meaning the site the page sits on: Bridgeworks Explained. From this point on the pieces are separated by commas rather than periods. The publisher would come next, but the publisher is listed as Bridgeworks Explained too, the same name as the site, so it is left out.`,
        `Then the date, day, month, year: 3 June 2021. June is four letters, so it is written out rather than abbreviated. Then the location, which for a page online is the web address with the https:// stripped off the front: bridgeworksexplained.org/drawbridge. A period ends the entry.`,
        `Read the finished entry back and listen for the rhythm of the marks — period, period, then commas to the end:
Nandakumar, Priya. "How a Drawbridge Lifts." Bridgeworks Explained, 3 June 2021, bridgeworksexplained.org/drawbridge.`,
        `Now the in-text reference. The page has no page numbers, so the pointer is the last name by itself, in parentheses, after the closing quotation mark and before the period: One writer calls the counterweight "the reason a heavy span can be lifted by a small motor" (Nandakumar). A reader who wants the source scans the alphabetical list for N and lands on the entry above.`,
      ],
      example: { problem: `Build the works-cited entry for this source, then write the in-text reference for a sentence that borrows from it.

Author: Priya Nandakumar
Title of the page: How a Drawbridge Lifts
Website: Bridgeworks Explained
Publisher: Bridgeworks Explained
Date posted: 3 June 2021
Web address: https://bridgeworksexplained.org/drawbridge
The page runs about one screen long and has no page numbers.`, solution: `The entry is: Nandakumar, Priya. "How a Drawbridge Lifts." Bridgeworks Explained, 3 June 2021, bridgeworksexplained.org/drawbridge. The publisher is left out because it has the same name as the site, and the in-text reference is (Nandakumar), with no page number, because the page has none.` },
      relatedLoIds: ['m8ela.following-a-standard-citation-format'],
    },
    {
      title: 'Worked repair a book entry',
      steps: [
        `Check the author first, because the first word of the entry is the one the whole list is sorted by. WRONG FOR THIS FORMAT: Marcus Whitlow. CORRECT: Whitlow, Marcus. Last name, comma, first name, period.`,
        `Check what comes second. The student put the publisher there. In this format the second piece is always the title of the source, and the publisher waits its turn near the end. WRONG FOR THIS FORMAT: Whitlow, Marcus. Fenwick Press. CORRECT: Whitlow, Marcus. The Long Way Around the Lake.`,
        `Check the marks on that title. The student put it in quotation marks, and quotation marks are the mark for a part sitting inside something bigger. A whole book is not sitting inside anything, so its title takes none; it is the italicized one when you type it, and here it stands plain. The comma the student left after it is wrong for the same reason the marks are: a period closes the title of the source.`,
        `Check the tail. Publisher, then date, with a comma between them and a period at the end: Fenwick Press, 2018. The student had those two in the right order but ran them into the title and left the entry with no closing period at all.`,
        `Read the repaired entry back:
Whitlow, Marcus. The Long Way Around the Lake. Fenwick Press, 2018.
A book read straight through carries no location, so the entry stops at the year. Nothing was added and nothing was cut; four pieces moved and three marks changed.`,
        `Now the pointer. WRONG FOR THIS FORMAT: (Whitlow, page 112). CORRECT: (Whitlow 112). The last name and the page number sit side by side with nothing between them — no comma, and no word "page" — and the pointer starts with Whitlow because the entry starts with Whitlow.`,
        `Put it in a sentence, with the parentheses after the closing quotation mark and before the period: One hiking guide calls the north trail "two extra miles and one less hour of climbing" (Whitlow 112).`,
      ],
      example: { problem: `A student has all the right pieces in the wrong order. Repair the entry and the in-text reference.

The source: a book called The Long Way Around the Lake, written by Marcus Whitlow, published by Fenwick Press in 2018. The student quoted seven words from page 112.

The entry the student wrote:
Marcus Whitlow. Fenwick Press. "The Long Way Around the Lake," 2018

The in-text reference the student wrote:
(Whitlow, page 112)`, solution: `The entry is: Whitlow, Marcus. The Long Way Around the Lake. Fenwick Press, 2018. The in-text reference is (Whitlow 112), with no comma between the name and the number and no word "page".` },
      relatedLoIds: ['m8ela.following-a-standard-citation-format'],
    },
  ],
  pointers: [
    { content: `Students often say "The entry is complete, so it does not matter that the year sits before the publisher." — A format earns its keep by putting each piece where a reader already expects it, so that no piece needs a label saying what it is. A reader looking for the year of a book looks in one place: last, after the publisher and a comma. Swap the two and that reader has to stop and work out which of "2021" and "Larkspur Books" is the year. They can do it, and having to do it is the whole cost, multiplied by every entry in the list. WRONG FOR THIS FORMAT: Ashworth, Nadia. Rope Bridges of the High Valley. 2021, Larkspur Books. CORRECT: Ashworth, Nadia. Rope Bridges of the High Valley. Larkspur Books, 2021.`, kind: 'common-error' },
    { content: `Students often say "The pointer beside the quotation should carry the whole entry, because more information helps the reader more." — All of that information is already sitting in the list at the end. The reference beside the quotation only has to get a reader to the right line of that list, and the list is in alphabetical order by the first word of each entry. So the pointer is the last name and the page, side by side. WRONG FOR THIS FORMAT: (Ashworth, Nadia. Rope Bridges of the High Valley, page 47). CORRECT: (Ashworth 47). No first name, no title, no comma between the name and the number, and no word "page". A source with no page numbers at all takes the last name by itself.`, kind: 'common-error' },
    { content: `The order is author, title of the source, container, publisher, date, location. A period closes the author, a period closes the title of the source, commas separate everything after that, and one period ends the entry.`, kind: 'tip' },
    { content: `The author is written last name first: Ruiz, Camila. That word is what the list is alphabetized by, and it is what the in-text reference has to match.`, kind: 'tip' },
    { content: `A part takes quotation marks and a whole does not. An article or a page on a site sits inside a container, so its title is quoted; the magazine, the website or the book is the container, and its title is the italicized one when you type it.`, kind: 'tip' },
    { content: `Location is the last piece: a page range for something printed, written pp. 18-23, or the web address without the https:// on the front. A whole book has no location, so its entry stops at the publisher and the year, and a publisher with the same name as its website is left out.`, kind: 'tip' },
    { content: `Dates run day, month, year, and a month longer than four letters is abbreviated: 12 Apr. 2022, but 3 June 2021.`, kind: 'tip' },
    { content: `The in-text reference is the short pointer — the author's last name and the page with nothing between them, in parentheses after the closing quotation mark and before the period: (Ruiz 20). A source with no page numbers takes the last name alone: (Nandakumar).`, kind: 'tip' },
    { content: `The first word of your entry is what the whole list gets alphabetized by. Always invert the author's name — last name, comma, first name, period — so the last name comes first.`, kind: 'gotcha' },
    { content: `A part of something takes quotation marks around its title. A whole thing does not. Articles and web pages are parts (they sit inside magazines and websites), so quote them. Books you read straight through are wholes, so italicize them — here, write them plain.`, kind: 'common-error' },
    { content: `After the author and the source title, every piece is separated by a comma, not a period. One period ends the entire entry. Listen for the rhythm: period, period, then comma-comma-comma to the end.`, kind: 'tip' },
    { content: `Location is always last. For a printed article it's the page range: pp. 18-23. For a web page it's the address without https:// at the front. For a whole book there is no location — the entry just stops after the year.`, kind: 'edge-case' },
    { content: `Don't write out 'page' or 'pages' in your in-text reference. Write just the last name and number side by side with nothing between: (Ruiz 20), not (Ruiz, page 20).`, kind: 'common-error' },
    { content: `If your source has no page numbers — normal for web pages — put only the author's last name in parentheses: (Nandakumar). The reference stays short because the works-cited entry is where a reader looks up the full source.`, kind: 'vocab-note' },
    { content: `The last name in your in-text reference must match the first word of the works-cited entry exactly. The list is alphabetical by that first word, so the match is how a reader finds the right line.`, kind: 'gotcha' },
    { content: `Months longer than four letters get abbreviated: Jan., Feb., Mar., Apr., Aug., Sept., Oct., Nov., Dec. May, June, and July are short enough to write out: 12 Apr. 2022, but 3 June 2021.`, kind: 'vocab-note' },
  ],
};
