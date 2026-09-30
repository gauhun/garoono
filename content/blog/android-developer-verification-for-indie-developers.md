---
title: "Android Developer Verification for Indie Developers: 2026 Guide"
description: Android now requires verified developers for installs in 4 countries and globally from 2027, here is what indie devs in India and elsewhere must do
date: 2026-09-30
keyword: android developer verification for indie developers
tags: [android, google play, indie developers]
relatedDoc: app-store-launch-guide
---

From today, some Android phones will refuse to install apps from developers Google has not verified
Next year that goes global, India included
If you only publish on Google Play, you are probably fine, but "probably" is not a plan

Here is what changed, what you actually need to do, and the one mistake that can lock you out of your own app

## What changed on September 30, 2026

Google now requires apps to be registered by verified developers before they can be installed or updated on certified Android devices in Brazil, Indonesia, Singapore and Thailand ([Android Developers Blog](https://android-developers.googleblog.com/2026/03/android-developer-verification-rolling-out-to-all-developers.html))
Google says it will roll the requirement out globally from 2027 ([Android Developers Blog](https://android-developers.googleblog.com/2026/03/android-developer-verification-rolling-out-to-all-developers.html))

For now it covers installs from the participating stores, Google Play among them
Apps sideloaded directly or shipped through other stores are not affected yet, but Google recommends verifying before the global rollout ([Android developer verification FAQ](https://developer.android.com/developer-verification/guides/faq))

<figure>
<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Android developer verification timeline">
  <rect width="640" height="220" rx="16" fill="#FFFFFF" stroke="#E8E5E0"/>
  <line x1="60" y1="110" x2="580" y2="110" stroke="#1A1A1A" stroke-width="2"/>
  <circle cx="140" cy="110" r="10" fill="#FF6B35"/>
  <text x="140" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1A1A1A">30 Sept 2026</text>
  <text x="140" y="145" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">Brazil, Indonesia,</text>
  <text x="140" y="163" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">Singapore, Thailand</text>
  <circle cx="480" cy="110" r="10" fill="#1A1A1A"/>
  <text x="480" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1A1A1A">2027 onwards</text>
  <text x="480" y="145" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">Global rollout,</text>
  <text x="480" y="163" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">India included</text>
</svg>
<figcaption>Source: Android Developers Blog, March 2026</figcaption>
</figure>

## Do you need to do anything?

### If you publish only on Google Play
Google says that if you have completed Play Console's developer verification, your identity is already verified and eligible Play apps are registered for you automatically ([Android Developers Blog](https://android-developers.googleblog.com/2026/03/android-developer-verification-rolling-out-to-all-developers.html))
Open Play Console, confirm your account verification is complete, and check that each app shows as registered
That is a two minute job, do it today

### If you use Play App Signing
Good news, Google says apps using Play App Signing are part of the automatic registration ([Android developer verification FAQ](https://developer.android.com/developer-verification/guides/faq))

### If you share APKs outside Play
This is where indie devs get caught
Direct APK downloads from your website, betas shared on Telegram, or builds on other stores all need a verified developer once the global rollout reaches your users

> The mistake that locks you out: Google says if you lose your signing key, you won't be able to register your packages ([Android developer verification FAQ](https://developer.android.com/developer-verification/guides/faq))

Back up your signing and upload keys somewhere safe tonight
If an old app was never enrolled in Play App Signing, check where its key lives before 2027

## Which account type do you need?

| Your situation | What to use | Cost |
|---|---|---|
| Apps only on Google Play | Your existing Play Console account | Nothing new |
| APKs on your site or other stores | Full distribution Android Developer Console account | $25 fee |
| Apps for family, friends or a small group | Limited distribution account, up to 20 devices, no government ID | Free |
| Publishing as a company | Organisation account with a D-U-N-S number | Takes up to 28 days |

Sources for the table: the $25 fee, the 20 device limit and the D-U-N-S timing all come from Google's help centre ([Android Developer Console Help](https://support.google.com/android-developer-console/answer/16561738?hl=en))
If you plan to register as a company, start the D-U-N-S request now, not in December 2026

## What developers in India should do now

India is not in the first four countries, so nothing changes for your users this year
It is part of the 2027 global rollout, so use the quiet months to get ready

For individual developers in India, Google Play accepts an Indian passport, driving licence, voter ID or PAN card as photo ID ([Google Play Help](https://support.google.com/googleplay/android-developer/answer/15633622?hl=en&co=GENIE.CountryCode%3DIN))
Your proof of address has to show your name and address exactly as they appear on your developer profile ([Google Play Help](https://support.google.com/googleplay/android-developer/answer/15633622?hl=en&co=GENIE.CountryCode%3DIN))
A mismatch between the name on your PAN and your profile name is an easy way to get stuck, so fix that first

## Can I still test and sideload?

Yes, for development
Google says developers are free to install apps without verification using ADB ([Android developer verification FAQ](https://developer.android.com/developer-verification/guides/faq))
For a handful of real testers outside Play, the free limited distribution account covers up to 20 devices ([Android Developer Console Help](https://support.google.com/android-developer-console/answer/16561738?hl=en))

## Why so many developers are angry

Google frames this as anti malware, citing an analysis of apps from internet sideloaded sources
F-Droid says it has not seen that analysis and calls developer verification an existential threat to free software distribution platforms like F-Droid and to emerging Play Store competitors ([F-Droid](https://f-droid.org/en/2025/10/28/sideloading.html))

My take as someone shipping on Play: for Play only indies this is mostly paperwork
The real cost lands on people who distribute outside Play, and on anyone who lost a signing key years ago

## Your checklist before 2027

- Confirm Play Console developer verification is complete
- Check every app shows as registered
- Back up signing and upload keys in two places
- Enroll old apps in Play App Signing where possible
- Match your profile name and address to your ID and address proof
- Decide your account type if you ship APKs outside Play
- Start a D-U-N-S request early if you publish as a company

## Ship without surprises

Verification is one more box between you and a live app
I keep a full launch guide with the store rules that trip up solo developers most in the docs
