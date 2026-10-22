---
title: "Google Play 12 Testers 14 Days Requirement: How Solo Devs Pass"
description: New personal Play accounts need 12 testers opted in for 14 days in a row before production, here is the exact rule and a plan that passes first time
date: 2026-10-22
keyword: google play 12 testers 14 days requirement
tags: [google play, closed testing, android]
relatedDoc: stuck-at-12-testers
---

If you made a personal Google Play developer account after November 13, 2023, you can't go straight to production
You first run a closed test with at least 12 testers who stay opted in for at least 14 days in a row ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en))
Then you apply for production access from the Play Console Dashboard and answer questions about that test
Google reviews your answers, and if the test looks thin, it asks you to keep testing

Finding 12 names is the easy part
Keeping 12 real people opted in, and showing they actually used the app, is where solo devs lose weeks
Here's the exact rule, what counts, why access gets refused, and a plan that fits into 1 to 2 hours a night

## Who the rule applies to

The testing requirement covers personal developer accounts created after November 13, 2023 ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en))
Google's account setup page labels that section "Personal accounts only" ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en))

So three cases:

| Your account | Closed test needed before production? |
|---|---|
| Personal, created after November 13, 2023 | Yes, 12 testers for 14 days in a row |
| Personal, created on or before November 13, 2023 | No, the rule is for newer accounts |
| Organization | Not covered by the rule as Google writes it |

Organization accounts come with their own paperwork, so don't switch types just to skip testing
I covered which account type fits a solo dev in [Android developer verification for indie developers](/blog/android-developer-verification-for-indie-developers/)

Until you get production access, Production and Pre-registration stay locked in Play Console ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en))

## The exact rule, in Google's words

Google asks for a closed test with "a minimum of 12 testers who have been opted in continuously for at least 14 days" ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en))

The word that trips people up is continuously
Google's FAQ says testers who opt in, test for fewer than 14 days and then opt out don't count ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en))
And if a tester opts out and later opts back in, only a fresh run of 14 consecutive days counts

So 15 testers who drift in and out can still leave you short
12 who join on day one and never leave is a pass on the numbers

<figure>
<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Timeline from closed test to production access">
  <rect width="640" height="260" rx="16" fill="#FFFFFF" stroke="#E8E5E0"/>
  <text x="320" y="42" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#1A1A1A">From closed test to production</text>
  <line x1="60" y1="130" x2="580" y2="130" stroke="#E8E5E0" stroke-width="4"/>
  <line x1="60" y1="130" x2="400" y2="130" stroke="#FF6B35" stroke-width="4"/>
  <circle cx="60" cy="130" r="10" fill="#FF6B35"/>
  <circle cx="400" cy="130" r="10" fill="#FF6B35"/>
  <circle cx="580" cy="130" r="10" fill="#15803D"/>
  <text x="60" y="95" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1A1A1A">Day 0</text>
  <text x="60" y="165" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">12+ testers</text>
  <text x="60" y="183" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">opt in</text>
  <text x="230" y="95" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#FF6B35">14 days in a row</text>
  <text x="230" y="165" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">nobody opts out</text>
  <text x="230" y="183" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">ship builds, collect feedback</text>
  <text x="400" y="95" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1A1A1A">Apply</text>
  <text x="400" y="165" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">answer the</text>
  <text x="400" y="183" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">production form</text>
  <text x="580" y="95" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#15803D">Access</text>
  <text x="580" y="165" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">review, usually</text>
  <text x="580" y="183" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">7 days or less</text>
</svg>
<figcaption>The 14 day clock only counts testers who stay opted in the whole time</figcaption>
</figure>

## What counts as an opted in tester

Adding an email to a list is not the same as having a tester
Each tester has to open your opt-in link and accept it ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/9845334?hl=en))

A few details from Google's testing setup page:

- You add testers by email list or by Google Group
- Testers need a Google Account or a Google Workspace account
- With a Google Group, people must join the group before they can opt in
- The opt-in link only shows once the closed track status is Published
- After your first publish, the link can take several hours to work for testers

All of that is on the same [Play Console Help page](https://support.google.com/googleplay/android-developer/answer/9845334?hl=en)

> A tester only counts after they tap your opt-in link and accept, and only while they stay opted in

My advice: ask each tester to send you a screenshot of the "you're a tester" screen
It takes them ten seconds and it saves you guessing on day 14

## Why production access gets refused

Google names two reasons for asking you to keep testing: fewer than 12 opted in testers, or not enough tester engagement ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en))

The first is just counting
The second is where the form matters

When you apply, Google asks three groups of questions ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)):

- About your closed test: how easy recruiting was, whether testers used all the features, how usage compared to what you expect in production, and a summary of the feedback and how you collected it
- About your app: who it's for, why it's useful, and how many installs you expect in year one
- About production readiness: what you changed because of the test, and how you decided it was ready

Read that list again
Google wants evidence that people used the app and that you acted on what they said
A test where 12 strangers installed once and never opened it again gives you nothing to write

That's why I'm wary of tester swap groups and paid tester packages
They can get you to 12, but they rarely give you feedback worth putting in the form

## A plan that fits after work

### Before day 0, line up 15 to 20 people
Ask more than 12 so one or two dropping out doesn't reset you
Start with people who would use the app anyway: friends, coworkers, family, people who asked you about the idea
If you already have apps live, a short note to those users can find people who like your work
The same channels I use to find [the first 100 app users](/blog/how-to-get-your-first-100-app-users/) work here too

### Day 0, publish the closed track and send the link
Use a Google Group, it's easier to manage than a list of emails
Send one message with the group link, the opt-in link, and what to try first
Collect the opt-in screenshots the same evening

### Days 1 to 14, give testers a reason to open it
Set up a feedback channel, Google suggests email, a website or a messaging group
Ask for one small thing every few days, like trying a single feature
Ship at least one update during the test, Google itself recommends updating your app in closed testing before production
Keep a simple note of every piece of feedback and what you changed

### Day 15, apply with real answers
Count opted in testers in Play Console before you click Apply for production
Fill the form from your notes, name the features people used and the fixes you shipped
Then wait, Google says review usually takes seven days or less ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en))

## Quick checklist

- [ ] Personal account created after November 13, 2023, so the rule applies
- [ ] 15 to 20 people lined up before you publish the closed track
- [ ] Every tester accepted the opt-in link, with a screenshot to prove it
- [ ] Nobody opted out for 14 days in a row
- [ ] A feedback channel testers actually use
- [ ] At least one update shipped during the test
- [ ] Form answers written from real feedback, not guesses

## Get past it in one go

I wrote down how to get Play production access on the first try, with testers who actually test, in [Stuck at 12 Testers](/docs/#stuck-at-12-testers)

## FAQ

### Does the 12 testers rule apply to organization accounts?

Google's rule covers personal developer accounts created after November 13, 2023
Organization accounts are not covered by it as Google writes it

### What happens if a tester opts out before 14 days?

That tester stops counting toward the requirement
If they opt back in, they need a new run of 14 consecutive days to count

### Do testers have to install the app or just join the list?

Each tester has to accept your opt-in link, being on the email list or Google Group is not enough
Google also checks engagement, so testers should install the app and use it

### Can I use paid testers or tester exchange groups?

They can get you to 12 opted in testers
Google asks about tester engagement and feedback when you apply, so testers who never use the app make it harder to get access

### How long does the production access review take?

Google says review usually takes seven days or less, and occasionally longer
If Google asks you to keep testing, run the closed test longer and apply again
