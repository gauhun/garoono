---
title: "App Rejected for Guideline 4.3 Spam? What It Means and What to Do"
description: Guideline 4.3 Spam means Apple sees your app as a duplicate, of your own apps or of the store, here is what the rule says and the three ways out
date: 2026-10-22
keyword: app rejected guideline 4.3 spam
tags: [app store, app review, rejection]
relatedDoc: app-store-launch-guide
---

A guideline 4.3 Spam rejection means Apple thinks your app is a duplicate
Either a copy of another app on your own account, or one more variant of something the store already has plenty of
Fixing a bug won't help, because nothing is broken
You get out in one of three ways: merge it into an app you already have, change it until it's clearly different, or answer Apple's questions honestly and show why it isn't spam

I got this one on October 13, 2026
Two of my apps were rejected one minute apart, both under 4.3 Spam plus 4.2.6
One of them overlapped with another app on the same account
Here's what the rules actually say and what I'd do differently

## What guideline 4.3 Spam says

Guideline 4.3 has two parts, and it helps to know which one you hit ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#spam))

### 4.3(a): your own duplicates
Apple's words: "Don't create multiple Bundle IDs of the same app"
The example is a separate map app for every city instead of one map app that searches any city
Apple's suggested fix is right in the rule: submit a single app and provide the variations using in-app purchase

### 4.3(b): the store's duplicates
Apple's words: "Don't submit apps that are indistinguishable from what's already widely available"
It names categories it considers saturated: dating, flashlight, sound effects, wallpaper, simple timers and fortune telling
New apps there are only accepted if they offer "a meaningfully different or improved experience"
And the same paragraph warns that repeated submissions of low-effort apps may lead to removal from the Apple Developer Program

### 4.2.6: template apps
This one sits under Minimum Functionality ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#minimum-functionality))
It says apps "created from a commercialized template or app generation service will be rejected" unless the provider of the app's content submits them
The allowed alternative is one app that hosts every client's content, like a restaurant finder with a page per restaurant

## What my rejection said

Apple's message on my two apps used three phrases that stuck with me

- The app "duplicates functionality" already on the App Store
- It "could be an in-app purchase in another app on your account"
- It "shares code with your other apps"

Read those again and you'll notice none of them are about the app alone
They compare it to my other apps

That's the part most indie devs miss
4.3(a) is about your account, so Apple looks at your app next to everything else you've shipped
Two rejections landing one minute apart told me the reviewer was looking at my catalogue, not at one binary

## Why indie devs get hit

You don't need to be a spammer to look like one

- **Several similar apps**, a viewer for one file type, then another viewer for a similar one, each in its own listing
- **A shared starter kit**, same onboarding, same paywall, same settings screen, same code underneath
- **Template or white label apps**, one codebase, many clients, many bundle IDs, which is exactly what 4.2.6 describes
- **Crowded categories**, a simple timer or wallpaper app built fast with AI lands in a list Apple already called full
- **Copy paste metadata**, same description structure and release notes across apps make the overlap even easier to spot

Reusing code is normal, every solo dev does it
The problem is when the reused code is also the whole product

<figure>
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Decision flow after a guideline 4.3 Spam rejection">
  <rect width="640" height="300" rx="16" fill="#FFFFFF" stroke="#E8E5E0"/>
  <text x="320" y="38" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#1A1A1A">Rejected under 4.3, now what</text>
  <rect x="30" y="65" width="250" height="56" rx="12" fill="#F3F4F6" stroke="#E8E5E0"/>
  <text x="155" y="90" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#1A1A1A">Close to one of your apps?</text>
  <text x="155" y="108" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">same job, same users</text>
  <line x1="280" y1="93" x2="370" y2="93" stroke="#1A1A1A" stroke-width="2"/>
  <text x="325" y="85" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">yes</text>
  <rect x="370" y="65" width="240" height="56" rx="12" fill="#E9F9EE" stroke="#15803D"/>
  <text x="490" y="90" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#15803D">Merge it</text>
  <text x="490" y="108" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#1A1A1A">a feature or IAP in the other app</text>
  <line x1="155" y1="121" x2="155" y2="150" stroke="#1A1A1A" stroke-width="2"/>
  <text x="168" y="140" font-family="Inter, sans-serif" font-size="11" fill="#555">no</text>
  <rect x="30" y="150" width="250" height="56" rx="12" fill="#F3F4F6" stroke="#E8E5E0"/>
  <text x="155" y="175" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#1A1A1A">Like many apps on the store?</text>
  <text x="155" y="193" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">crowded category, template</text>
  <line x1="280" y1="178" x2="370" y2="178" stroke="#1A1A1A" stroke-width="2"/>
  <text x="325" y="170" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">yes</text>
  <rect x="370" y="150" width="240" height="56" rx="12" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="490" y="175" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#1A1A1A">Change it for real</text>
  <text x="490" y="193" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#1A1A1A">features, UI, metadata</text>
  <line x1="155" y1="206" x2="155" y2="235" stroke="#1A1A1A" stroke-width="2"/>
  <text x="168" y="225" font-family="Inter, sans-serif" font-size="11" fill="#555">no</text>
  <rect x="30" y="235" width="580" height="48" rx="12" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="320" y="264" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#1A1A1A">Answer every question honestly, then appeal if Apple got it wrong</text>
</svg>
<figcaption>Resubmitting the same build with a nicer note is not on this chart</figcaption>
</figure>

## What to do after a 4.3 rejection

### Option 1: merge it into an app you already have
If the rejected app does the same job for the same people as one of your other apps, this is the honest answer
Apple's own rule suggests shipping variations as in-app purchases inside a single app
You keep one listing, one set of reviews and one codebase to maintain, which is less work anyway

### Option 2: make substantial changes
If the app really is its own product, make that visible
New core features, a different interface, its own onboarding and screenshots, a description that isn't a copy of your other listings
Renaming the app and swapping colours is not substantial

### Option 3: answer Apple's questions honestly
My rejection came with a list of questions from Apple
Answer every one of them, plainly, with no spin
If the app shares code with your other apps, say so, and explain what is different for the user
Then submit an appeal if you think Apple misread the app

Apple says you can appeal to the App Review Board if you feel they misunderstood your app's concept and functionality ([Apple](https://developer.apple.com/distribute/app-review/))
Its tips: give specific reasons the app complies, submit only one appeal per rejected submission, and answer any requests for information first
You can also book a 30 minute App Review appointment over Webex to ask about guidelines and common rejections ([Apple](https://developer.apple.com/distribute/app-review/))

> Resubmitting the same build unchanged gets the same rejection

That last line isn't just my opinion
One developer on Apple's forums reports two 4.3(a) rejections in a row and then a warning about account removal for repeated noncompliance ([Apple Developer Forums](https://developer.apple.com/forums/thread/847013))

## Check this before you build the next app

| Question | If yes |
|---|---|
| Does one of my apps already do this job? | Add it as a feature or in-app purchase there |
| Is it a timer, wallpaper, flashlight or similar? | Find a real difference first, or skip it |
| Is it built from a template I sell or reuse for clients? | Ship one app that hosts every client |
| Are screens and paywall copied from my starter kit? | Change the core flow, not just the colours |
| Does the description read like my other listings? | Rewrite it for this app's users |

I now run this table before I start a new app, not after review
It's cheaper to kill an idea at the start than to argue for it later

For the other reasons new apps get rejected and the step by step way to ship, see [Don't Get Rejected: App Store Launch Guide](/docs/#app-store-launch-guide)
My [App Store checklist](/blog/flutter-app-store-checklist/) covers three blockers a clean build never catches, and [the account deletion post](/blog/account-deletion-requirement-app-store/) covers the 5.1.1(v) one

## FAQ

### What does guideline 4.3 Spam mean?

It means Apple thinks your app duplicates another app
Under 4.3(a) that's multiple bundle IDs of the same app on your account, and under 4.3(b) it's an app indistinguishable from what's already widely available on the store

### What is the difference between 4.3(a) and 4.3(b)?

4.3(a) is about your own apps, for example one app per city instead of one app for all cities
4.3(b) is about the whole store, for example another simple flashlight or wallpaper app without a meaningfully different experience

### What is guideline 4.2.6?

It is the rule against apps made from a commercialized template or app generation service
Those apps are rejected unless the provider of the app's content submits them, or all clients live inside one app

### Can I fix a 4.3 rejection by resubmitting?

Not with the same build
Merge the app into one you already have, make substantial changes, or answer Apple's questions honestly and appeal if they misread the app

### Can a 4.3 rejection affect my developer account?

It can if it keeps happening
Apple's guideline says repeated submissions of low-effort apps may lead to removal from the Apple Developer Program
