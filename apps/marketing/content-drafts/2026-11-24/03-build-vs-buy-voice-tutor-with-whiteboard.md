---
title: Build vs Buy: What a Voice Tutor with a Whiteboard Takes to Build
slug: build-vs-buy-what-a-voice-tutor-with-a-whiteboard-takes-to-build
category: Industry Insights
tags: Build vs Buy, AI Tutor, Voice Tutor, AI Tutor with Whiteboard, EdTech Strategy, White-Label AI Tutor, AI Tutor API, AI Tutoring, Product Planning
metaTitle: Build vs Buy: What a Voice AI Tutor with a Whiteboard Takes
metaDescription: A plain look at the parts of a voice AI tutor with a live whiteboard, what building each one involves, and when buying a hosted tutor by the minute makes more sense.
excerpt: A voice tutor with a whiteboard looks like one feature and is really seven or eight systems that have to work together. This post lists them, says what building each involves, and sets out when buying a hosted tutor is the better call.
quickAnswer: A voice AI tutor with a whiteboard is several systems, not one: speech in and out, turn-taking, a teaching method, a whiteboard that draws in step with the voice, languages, homework photos, and the session records, metering and billing behind it. Building makes sense when tutoring itself is your product. Otherwise a hosted tutor such as Evelyn Learning's Voice Tutor API, embedded with one signed link and priced per minute, is usually the shorter path.
ctaProduct: voice-tutor
---

"Should we build our own AI tutor or buy one?" is a fair question, and most answers to it are either a sales pitch or a pile of invented cost figures.

This post tries something more useful. It lists what a voice tutor with a whiteboard is actually made of, part by part, and says what each part asks of the team that builds it. There are no engineering-month estimates here, because they depend on your team and would be guesses.

Then it describes what buying looks like, with real prices, so you can compare the two honestly.

---

## What Is a Voice Tutor with a Whiteboard Made Of?

From the student's side it is one thing: a tutor that talks, listens and writes on a board.

From the builder's side it is a chain of systems. Each one has to work, and they have to work together in real time. A lesson is only as good as the weakest link.

The sections below take them in the order a student would notice them failing.

## What Does It Take to Make a Tutor Listen and Speak?

Three things, not two.

**Hearing the student.** Speech has to become text accurately, for children as well as adults, with background noise, on a laptop microphone or a cheap tablet. Subject vocabulary is the hard part. A recogniser that mishears "denominator" derails a fractions lesson.

**Speaking back.** The voice has to be pleasant to listen to for a whole lesson and has to read maths and science correctly. "x squared plus three" must come out as that, not as a string of symbols.

**Taking turns.** This is the part teams underestimate. The tutor has to know when the student has finished a thought, wait while they think, stop talking when they interrupt, and not answer its own echo. Students pause in the middle of a sentence when they are working something out. A tutor that jumps in at every pause is tiring to use.

Each of these is a product decision as well as an engineering one, and each needs testing with real students, not with the team that built it.

## How Do You Make It Teach, Not Just Answer?

A general chat model answers questions. A tutor does something different. It decides what to ask next, checks the student's work, notices a misconception, and holds back the answer until the student has had a real go.

That takes a teaching method written down in enough detail for software to follow:

- A plan for the lesson, so that it goes somewhere.
- A way to check a student's answer that is right more often than a confident guess.
- Pacing rules: when to give a hint, when to move on, when to stop probing a student who has clearly understood.
- Guardrails for a young audience.

It also takes people who know how to teach. This is the part of the work that looks least like software, and it is usually where a home-built tutor feels thin.

We wrote about what separates useful tutoring behaviour from decoration in [AI Teacher with Voice: What It Is, How It Works, and What to Look for](/blog/ai-teacher-with-voice-what-it-is-how-it-works-and-what-to-look-for-in-2025).

## Why Is the Whiteboard Harder Than It Looks?

Because it is not a picture. It is a second channel that has to stay in step with the voice.

When the tutor says "now subtract three from both sides", that line has to appear on the board as it is said. Equations have to be typeset properly. Graphs have to be drawn from the real function. Diagrams have to be right, because a wrong diagram teaches the wrong thing.

Different subjects need different boards. Algebra needs worked steps. Geometry needs figures. Science needs diagrams and tables. Each kind is its own piece of work, and each has to look right on a phone as well as a laptop.

There is more on what a good board does for the student in [AI Tutor with Whiteboard: What It Is, How It Works, and What to Look for When Buying](/blog/ai-tutor-with-whiteboard-what-it-is-how-it-works-and-what-to-look-for-when-buying).

## What Changes When You Add a Second Language?

Almost everything above has to be done again.

Listening, speaking, the board, the on-screen labels and the lesson content all need to work in the new language. Translation of the interface is the small part. The tutor has to hear a student speaking that language, answer in a natural voice, and write the board in it.

Real classrooms add a further case: students who mix languages. A student in India may speak Hindi and English in the same sentence. Handling that is a design decision, not a setting.

## What About Homework and Worksheets?

Most students do not arrive with a topic. They arrive with a sheet of questions.

So a useful tutor has to take a photo of a worksheet, read it into separate numbered questions, keep any diagrams with the right question, and then tutor one question at a time. And it has to do that without simply giving the answer away, or it becomes a homework machine that teachers will not accept.

This is a separate system from the tutoring itself, with its own ways of going wrong: bad lighting, handwriting, two columns, a question that runs over a page.

## What Are the Parts Nobody Budgets For?

The lesson is the visible part. A product also needs everything around it:

- **Session records and replays**, so that a teacher or a support person can see what happened in a lesson.
- **Usage metering**, accurate to the minute, because that is what you will be charging or paying for.
- **Billing**, with balances, top-ups and what happens when minutes run out in the middle of a lesson.
- **Keys and security**: issuing credentials, rotating them, signing requests.
- **Events for the host product**, so that your own system knows a lesson ended.
- **Mobile**: microphone permissions inside a WebView, autoplay rules, older devices.
- **Upkeep.** Speech and language technology changes quickly. Whatever you build has to be re-tested each time one of its parts changes.

None of these is exciting. All of them are needed before a school can use the product.

## What Does Buying Look Like?

Buying means embedding a tutor that someone else runs. Here is what that involves with Evelyn Learning's Voice Tutor API, as a concrete example.

**The integration.** The tutor is hosted. Your server signs a short-lived token with your partner secret, and your app opens one link in an iframe or a mobile WebView. It is white-label, so it sits under your brand. The steps are in [AI Tutor API: How to Embed a Voice Tutor with One Signed Link](/blog/ai-tutor-api-how-to-embed-a-voice-tutor-with-one-signed-link).

**What comes with it.** Voice, a live whiteboard and typed chat. Lessons taught entirely in English, Hindi, Hinglish, Spanish, French, Japanese, Traditional Chinese or Simplified Chinese. Worksheet photos read into numbered questions and tutored one at a time. A partner dashboard with usage, API keys and rotation, a no-code test lesson, sessions with replays, students, an API log, signed webhooks and billing.

**The price.** $0.20 per voice minute and $0.16 per typed minute. Prepaid packs are 500 minutes for $100, 2,500 minutes for $450 and 10,000 minutes for $1,600, and pack minutes are valid for 12 months. We work those numbers through for different sizes in [AI Voice Tutor API Pricing: Per-Minute Cost Worked Through for 100, 1,000 and 10,000 Students](/blog/ai-voice-tutor-api-pricing-per-minute-cost-worked-through-for-100-1000-and-10000-students).

**The trade.** You get a working tutor without building one, and you pay per minute of use. You give up control of the internals. You can choose the subject, topic, language and length of each session, but you are not designing the teaching method yourself.

## When Does Building Still Make Sense?

Buying is not always right. Building is the better choice when:

- **Tutoring is your product.** If the way your tutor teaches is the thing customers pay you for, you should own it.
- **You need something no vendor offers.** A subject, an age group, a language or a teaching approach that hosted tutors do not cover.
- **You already have the people.** A team with speech, real-time and teaching experience, and the budget to keep it on the work after launch.
- **Your rules require it.** Some organisations cannot place a third-party service in front of students at all.

There is a middle path too: buy the tutor, and spend your own engineering on what surrounds it, such as your courses, your reporting and your relationship with schools. School districts weighing the same question from the other side may find [Khanmigo vs. Building a Custom AI Tutor](/blog/khanmigo-vs-building-a-custom-ai-tutor-what-should-a-school-district-actually-choose) useful.

## What Is a Cheap Way to Decide?

Run one of your own lessons through a hosted tutor before you plan a build.

The [free sandbox](https://tutor.evelynlearning.com/sandbox) includes 300 tutoring minutes. Keys are shown as soon as you confirm your email, and no card is needed. Pick a topic your students find hard, give the session to a few of them, and watch the replays.

You will learn two things. First, whether a hosted tutor is good enough for your students. Second, if it is not, exactly which part you would need to do better. Either answer is worth having before you commit a team.

---

## Frequently Asked Questions

### Is it cheaper to build or buy an AI tutor?

It depends on how much tutoring your students will use and on what your team costs, so no single figure is honest. Buying has a known price per minute. Building has a cost that is mostly people, before launch and after it.

### What is the hardest part of building a voice AI tutor?

Usually not the part people expect. Getting a model to explain something is easy. Turn-taking in speech, a board that stays in step with the voice, and a teaching method that holds back the answer are the hard parts.

### Can we buy now and build later?

Yes. Because a hosted tutor is embedded with a link, it does not tie your product's design to it. Starting with a hosted tutor is also a way to learn what your students need.

### Does a white-label tutor show the vendor's brand?

With a white-label tutor the student sees your product and your brand. Our guide to [choosing a white-label AI tutoring platform](/blog/best-white-label-ai-tutoring-platform-for-test-prep-companies-a-side-by-side-buyers-guide) lists what to ask a vendor.

### Where can I see the tutor working?

There is a [live demo on the AI Voice Tutor page](/products/voice-tutor), and the technical details are in the [API docs](https://tutor.evelynlearning.com/docs). Other ways to connect our products are on the [integrations page](/integrations).

---

## The Bottom Line

A voice tutor with a whiteboard is seven or eight systems that must work together while a student is waiting. Build it if tutoring is what you sell and you have the people to keep it good. Otherwise, embed one, measure how your students use it, and put your own effort into the parts of your product that only you can make.
