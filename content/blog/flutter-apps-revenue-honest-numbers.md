---
title: "100,000 Downloads, $216 a Month: My Flutter Apps Revenue"
description: One app pays most of the bills, iOS users are worth 12x Android and my ads made $3.40 last month, the honest numbers behind 16 Flutter apps
date: 2026-10-13
keyword: flutter apps revenue
tags: [flutter, monetization, indie apps]
relatedDoc: track-what-matters
---

I have about 16 Flutter apps live on iOS and Android
Together they've been installed around 100,000 times

They make about $216 a month in recurring revenue
Not per app, in total

Most indie income posts show the chart that went up and to the right
This is the other kind
I pulled my RevenueCat, PostHog and AdMob numbers on October 12, 2026
They're rounded and approximate, but they're real

## The 30 second version

100,000 installs sounds like a business, it isn't one yet
One app makes most of the money, iOS users pay about 12 times more than Android users, and my full-screen ads barely show
So I'm going iOS first, aiming at richer markets, fixing one paywall and freezing the apps that don't earn

## The numbers, no filter

| Metric | Value |
|---|---|
| Apps live | About 16, all Flutter, most on Firebase |
| Lifetime installs | About 100,000 |
| Revenue, last 28 days | About $256 |
| MRR | About $216 from 104 active subscriptions |
| XLSheetAI share of MRR | About $140, roughly two thirds |
| Revenue per 1,000 new iOS users | About $234 |
| Revenue per 1,000 new Android users | About $19 |
| India | Almost two thirds of new users, under a third of revenue |
| AdMob, last month | About $3.40 across every app |

<figure>
<svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Revenue per 1,000 new users, iOS about 234 dollars versus Android about 19 dollars">
  <rect width="640" height="280" rx="16" fill="#FFFFFF" stroke="#E8E5E0"/>
  <text x="320" y="42" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#1A1A1A">Revenue per 1,000 new users</text>
  <text x="40" y="112" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1A1A1A">iOS</text>
  <rect x="130" y="88" width="400" height="36" rx="8" fill="#FF6B35"/>
  <text x="545" y="112" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1A1A1A">$234</text>
  <text x="40" y="182" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1A1A1A">Android</text>
  <rect x="130" y="158" width="33" height="36" rx="8" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="178" y="182" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1A1A1A">$19</text>
  <text x="320" y="245" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">My apps, RevenueCat, approximate, October 2026</text>
</svg>
<figcaption>One new iOS user is worth about 12 new Android users in my apps</figcaption>
</figure>

## What worked

### One app found a real job to do

XLSheetAI is an AI helper for spreadsheets
People open it when they're stuck on a formula at work
That's a problem with money attached, and it's the only app in my portfolio that earns something every month

### Retention can be built

JapMala, a prayer bead counter, keeps about 1 in 3 users on day one and about 1 in 5 into week two
That's my best retention by far

It earns almost nothing
But it proved I can make an app people come back to on their own

### Flutter was never the problem

One codebase let me ship 16 apps on two stores as a solo dev
No regrets there
Every problem below is a business problem, not a tech one

## What didn't work

### Counting installs instead of buyers

I chased downloads for years
Most of mine came from Android and from India
Those users are real, and I like building for them
But in my apps, one new iOS user is worth about 12 new Android users

It's not just me
RevenueCat's State of Subscription Apps 2026 puts median 14 day revenue per install at $0.38 in North America and $0.08 in India and Southeast Asia ([RevenueCat](https://www.revenuecat.com/state-of-subscription-apps))

### Shipping wide instead of deep

16 apps means 16 paywalls, 16 store listings and 16 sets of reviews to answer
Most of mine got one launch and then nothing
Eight of them make close to zero

### Trusting ads to fill the gap

I added interstitial and rewarded ads to pay for free users
They loaded fine, then they were shown about once in every 50 loads

So almost all my ad money came from small banners
And most of my ad traffic came from India, where my eCPM was about $0.16
In the US it was about $12.39

> Ads don't pay when they don't show, and when they do show, they pay by where your users live

### A paywall that loses buyers at the very last step

In XLSheetAI, 1,109 people saw the paywall in 30 days
275 tapped buy
About 26 finished

Roughly 5 out of every 6 of those purchase starts were cancelled on Apple's or Google's own payment sheet
These people wanted it enough to tap the button
Then something on that last screen changed their mind
I'm writing that funnel up in detail next

### Flying blind for a while

In PushPass, the PostHog key came from `--dart-define` only
From `v1.2.2` on, builds went out without it, `String.fromEnvironment` returned an empty string, and the SDK quietly switched itself off
Every analytics event after that was lost

Now release builds fall back to a bundled `.env` and shout when a key is missing:

```dart
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

const _fromDefine = String.fromEnvironment('POSTHOG_KEY');

String posthogKey() {
  final key = _fromDefine.isNotEmpty
      ? _fromDefine
      : (dotenv.env['POSTHOG_KEY'] ?? '');
  if (key.isEmpty) debugPrint('POSTHOG_KEY MISSING: analytics is OFF');
  return key;
}
```

If you take one thing from this post, take that
You can't fix a funnel you can't see

## What I'm changing next

- **iOS first**, new features and new apps ship on iOS first, and Android follows once the iOS version earns
- **Tier 1 markets**, listings, screenshots and tests aimed at the US, UK and Europe, instead of wherever installs happen to come from
- **Fix the one paywall that matters**, XLSheetAI gets a free trial on the yearly plan, a clearer price on the paywall itself and a cheaper intro offer, before I touch any other app
- **Freeze the tail**, Fitess, Forma, Repvolve, JSON View, NailMirror, Focuson, SparkMate and Habitide stay live, but get bug fixes only

Number 4 is the hard one
Each of those apps was a weekend I was proud of
But 16 half-loved apps lost to one app that people actually need

## Quick answers

### Should Flutter devs skip Android?

No
Android still brought most of my users and some of my revenue
One codebase means it costs almost nothing extra
I just stop building for it first

### Are ads worth it in a small Flutter app?

Only if full-screen ads actually show, and only if your users live in markets that pay
Check the show rate in AdMob, not just the match rate

### Why freeze apps instead of deleting them?

Live apps still pick up a few installs and cost me almost nothing to keep
Freezing stops the time drain without throwing anything away

### What would you do differently from day one?

Put events on the paywall before launch: paywall view, purchase start, purchase cancelled, purchase success
Launch on iOS
Build one app deep before starting a second

## The takeaway

100,000 downloads didn't make me a business
One app with a real job, users in markets that pay and a paywall that doesn't scare people at the last step might

Next goal: $500 MRR, mostly from iOS
I'll post the honest numbers again when I get there, or when I don't

The events I track in week one, and the ones I ignore, are all in one doc
