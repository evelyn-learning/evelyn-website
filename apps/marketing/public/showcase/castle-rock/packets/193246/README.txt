SOLARO AI Solution packet - Item 193246 (Chemistry 30, multiple choice)
Prototype prepared by Evelyn Learning for Castle Rock Research technical review.

CONTENTS
  solution.html      The solution. XHTML 1.0 Transitional, UTF-8, one <div class="ai-solution">.
  img/fig-1.png      Figure for step 1. Displayed at 240 x 170 px (file is 480 x 340 for sharp screens).
  img/fig-2.png      Figure for step 4. Displayed at 240 x 200 px (file is 480 x 400).
  audio/step-1.mp3   Tutor voice for each step (MP3, mono, 96 kbps). One file per step so a
  ... step-5.mp3     student can replay a single step.

WHAT IT DOES AND DOES NOT DO
  - Everything is inside this folder. There are no scripts, no web fonts, no tracking and no
    requests to any other server. All paths are relative.
  - The text is flat and reflows to any width. No image is wider than 240 px.
  - The answer is stated first, then the steps.
  - Chemical formulas use ordinary subscript markup, not images.
  - To place it inside an existing item screen, copy the contents of <div class="ai-solution">
    and the short style block. The class prefix keeps the styles from touching anything else.

QUESTIONS FOR YOUR TEAM
  1. Voice uses the HTML audio element, which is newer than XHTML 1.0. Where a renderer does not
     support it, the plain link inside it is shown instead. Is the audio element acceptable, or
     should voice be a link only?
  2. Are PNG images right for you, or would you prefer SVG or GIF? What file-size limit applies?
  3. How do your items mark up maths (fractions, roots, exponents)? Images, MathML or something
     else? This item needs none, but Math and Physics items will.
  4. Is a small script allowed? Without one the solution is static, as here. With one, the steps
     can appear in time with the voice.
  5. How would you like packets named and delivered (one folder or one zip per item id)?

(c) 2026 Evelyn Learning
