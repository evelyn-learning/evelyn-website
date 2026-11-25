---
title: AI Voice Tutor API Pricing: Per-Minute Cost Worked Through for 100, 1,000 and 10,000 Students
slug: ai-voice-tutor-api-pricing-per-minute-cost-worked-through-for-100-1000-and-10000-students
category: Research & Data
tags: AI Tutor API Pricing, Voice Tutor, AI Tutoring Cost, Per-Minute Pricing, EdTech Budgeting, White-Label AI Tutor, AI Tutoring, EdTech
metaTitle: AI Voice Tutor API Pricing: Cost for 100 to 10,000 Students
metaDescription: What an AI voice tutor API costs at $0.20 per voice minute and $0.16 per typed minute, worked through for 100, 1,000 and 10,000 students with every assumption shown.
excerpt: Per-minute pricing is easy to state and hard to budget. This post takes the public prices of Evelyn Learning's Voice Tutor API and works them through for 100, 1,000 and 10,000 students, with the assumptions written down so you can change them.
quickAnswer: Evelyn Learning's Voice Tutor API costs $0.20 per voice minute and $0.16 per typed minute, with prepaid packs that bring the voice rate down to $0.16. If half of your students use the tutor for 40 minutes a month, three quarters of it by voice, 1,000 students cost between $3,040 and $3,800 a month depending on the pack. The free sandbox includes 300 tutoring minutes.
ctaProduct: voice-tutor
---

A per-minute price looks simple. "$0.20 per voice minute" fits on one line.

The hard part is turning it into a budget. How many minutes will your students really use? What does that come to for 100 students, or 10,000? Does a larger pack change the answer?

This post does the arithmetic for Evelyn Learning's Voice Tutor API. The prices are public and current as of 24 November 2026. The usage figures are assumptions, and each one is stated so you can swap in your own.

---

## What Does the Voice Tutor API Cost Per Minute?

There are two rates:

- **$0.20 per voice minute**
- **$0.16 per typed minute**

Voice and typed sessions draw from the same balance of minutes. A typed minute draws 0.8 of a minute from it, which is where $0.16 comes from: 0.8 × $0.20.

You are charged for tutoring time. Signing a session link costs nothing, and minutes are counted only while a session is running.

## What Are the Prepaid Packs, and What Is the Real Rate in Each?

Minutes are bought in prepaid packs. The larger the pack, the lower the rate per minute.

| Pack | Price | Per voice minute | Per typed minute (0.8 of a minute) |
|---|---|---|---|
| 500 minutes | $100 | $0.20 | $0.16 |
| 2,500 minutes | $450 | $0.18 | $0.144 |
| 10,000 minutes | $1,600 | $0.16 | $0.128 |

The 2,500-minute pack is 10% below the 500-minute rate. The 10,000-minute pack is 20% below it.

Three rules affect planning:

- **Pack minutes are valid for 12 months.** A pack bought for a pilot does not expire at the end of the month.
- **Free minutes are used first.** The 300 sandbox minutes are drawn down before anything you paid for.
- **Automatic top-up is optional.** You can turn it on, or buy each pack by hand.

## What Usage Should You Assume?

The price is fixed. Usage is the unknown, so it deserves the most care. Three numbers drive the bill:

1. **The share of students who are active in a month.** Not every enrolled student opens the tutor.
2. **Minutes per active student per month.**
3. **The split between voice and typed sessions.**

This post uses one base case throughout:

| Assumption | Base case |
|---|---|
| Active share | 50% of enrolled students use the tutor in a month |
| Minutes per active student | 40 minutes a month (for example, four 10-minute sessions) |
| Voice and typed split | 75% voice, 25% typed |

These are planning assumptions, not measurements. Replace them with your own figures as soon as you have a pilot.

With this split, an active student uses 30 voice minutes and 10 typed minutes. The typed minutes draw 10 × 0.8 = 8 minutes. So each active student draws **38 minutes of balance** for 40 minutes of tutoring.

The general formula is:

**Monthly cost = students × active share × minutes per active student × (voice share + 0.8 × typed share) × rate per minute**

## What Does It Cost for 100, 1,000 and 10,000 Students?

Here is the base case at each size.

| Enrolled students | Active (50%) | Tutoring minutes | Voice minutes | Typed minutes | Balance minutes drawn |
|---|---|---|---|---|---|
| 100 | 50 | 2,000 | 1,500 | 500 | 1,900 |
| 1,000 | 500 | 20,000 | 15,000 | 5,000 | 19,000 |
| 10,000 | 5,000 | 200,000 | 150,000 | 50,000 | 190,000 |

And the monthly cost at each pack's rate:

| Enrolled students | At $0.20 (500 pack) | At $0.18 (2,500 pack) | At $0.16 (10,000 pack) |
|---|---|---|---|
| 100 | $380 | $342 | $304 |
| 1,000 | $3,800 | $3,420 | $3,040 |
| 10,000 | $38,000 | $34,200 | $30,400 |

Per student, the base case comes to:

| | At $0.20 | At $0.18 | At $0.16 |
|---|---|---|---|
| Per enrolled student per month | $3.80 | $3.42 | $3.04 |
| Per active student per month | $7.60 | $6.84 | $6.08 |

To check one line by hand: 100 students, 1,500 voice minutes at $0.20 is $300, and 500 typed minutes at $0.16 is $80. That is $380, the same as 1,900 balance minutes at $0.20.

### Which pack fits which size?

- **100 students** draw about 1,900 minutes a month. One 2,500-minute pack ($450) covers a month with 600 minutes left over, and those minutes carry forward.
- **1,000 students** draw about 19,000 minutes a month. Two 10,000-minute packs ($3,200) cover a month with 1,000 minutes to spare.
- **10,000 students** draw about 190,000 minutes a month, which is 19 packs of 10,000 minutes ($30,400). At that volume it is worth talking to us before you buy.

## How Much Does the Bill Move When the Assumptions Change?

A lot. That is why the assumptions matter more than the rate.

Because the formula is a straight multiplication, each input moves the cost in proportion:

- **Active share.** If 25% of students are active instead of 50%, every figure above halves. If every student is active, every figure doubles. For 100 students at $0.20, that is a range from $190 to $760 a month.
- **Minutes per active student.** At 20 minutes a month the cost halves. At 80 minutes it doubles.
- **Voice and typed split.** This one moves the bill less. If every session is voice, 100 students draw 2,000 balance minutes, which is $400 at $0.20. If every session is typed, they draw 1,600, which is $320. The base case of $380 sits between the two.

Put the two big inputs together and the spread is wide. A cautious case of 25% active at 20 minutes costs a quarter of the base case. A heavy case of 100% active at 80 minutes costs four times the base case. For 1,000 students at the 10,000-pack rate, that is $760 a month against $12,160.

The practical point: do not argue about the rate. Measure the active share and the minutes in a pilot, then put real numbers into the formula.

## What Does One Pack Buy?

It helps to think of a pack as tutoring time for real students, not as a number.

| | Voice minutes | Or typed minutes | 10-minute voice sessions | Active students for a month (base case) |
|---|---|---|---|---|
| Free sandbox, 300 minutes | 300 | 375 | 30 | 7 |
| 500-minute pack | 500 | 625 | 50 | 13 |
| 2,500-minute pack | 2,500 | 3,125 | 250 | 65 |
| 10,000-minute pack | 10,000 | 12,500 | 1,000 | 263 |

The typed column is the pack divided by 0.8. The last column is the pack divided by the 38 balance minutes one active student draws in the base case, rounded down.

So a 500-minute pack is enough for a small class to use the tutor for a month. A 10,000-minute pack covers about 260 active students for a month, or a smaller group for a term.

## How Do You Test Your Own Numbers for Free?

Use the [free sandbox](https://tutor.evelynlearning.com/sandbox). It includes 300 tutoring minutes. Your keys are shown as soon as you confirm your email, and no card is needed.

Sandbox sessions end at 15 minutes. After a first purchase the limit is 60 minutes.

Three hundred minutes is enough to run a small trial and learn the two numbers that matter: how many of your students come back, and how long they stay. The partner dashboard shows usage and each session, so you do not have to estimate.

If you have not seen the integration yet, it is short. [AI Tutor API: How to Embed a Voice Tutor with One Signed Link](/blog/ai-tutor-api-how-to-embed-a-voice-tutor-with-one-signed-link) covers it from the first token to webhooks.

---

## Frequently Asked Questions

### How much does an AI voice tutor API cost per student?

It depends on usage, not on a per-seat fee. In the base case here (half of students active, 40 minutes a month each, 75% voice), it comes to between $3.04 and $3.80 per enrolled student per month with the Voice Tutor API.

### Are typed sessions cheaper than voice sessions?

Yes. A typed minute is $0.16 against $0.20 for a voice minute, because it draws 0.8 of a minute from the same balance.

### Do unused minutes expire?

Pack minutes are valid for 12 months. Free minutes are used before paid ones.

### Is there a free trial?

Yes. The sandbox includes 300 free tutoring minutes, with keys shown as soon as you confirm your email and no card needed.

### Is it cheaper to build a tutor ourselves?

That depends on what you count. We list what a voice tutor with a whiteboard takes to build, without putting invented numbers on it, in [Build vs Buy: What a Voice Tutor with a Whiteboard Takes to Build](/blog/build-vs-buy-what-a-voice-tutor-with-a-whiteboard-takes-to-build).

---

## The Short Version

The rate is $0.20 per voice minute, falling to $0.16 in the largest pack, and typed minutes cost 20% less than voice. What decides your bill is how many students use the tutor and for how long.

Start with the formula, run a trial in the sandbox, and replace the assumptions with what you measure. Current prices are on the [API pricing page](https://tutor.evelynlearning.com/pricing), and you can hear the tutor itself in the [live demo](/products/voice-tutor).
