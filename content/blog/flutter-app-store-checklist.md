---
title: "Apple Blocked My Flutter Apps 3 Times: My App Store Checklist"
description: An AI data question, a missing EULA link and a Screen Time entitlement, the three App Store blockers I hit in 2026 and the checklist I run now
date: 2026-10-14
keyword: flutter app store checklist
tags: [flutter, app store, app review]
relatedDoc: will-your-app-get-rejected-audit
---

All three builds compiled, signed and uploaded without a single warning
Then App Review stopped them anyway

I'm a solo dev with about 16 Flutter apps live on iOS and Android
This year two of them, PushPass and GetUp, ran into three different App Store blockers
No crashes, no bugs Flutter could have caught
Just policy, metadata and one entitlement Xcode never complained about

Apple says over 40% of unresolved issues relate to guideline 2.1, App Completeness ([Apple](https://developer.apple.com/distribute/app-review/))
That matches my year, so here's what each blocker looked like, and the checklist that now runs before every iOS release

## The 30 second version

If your app sends user data to any AI model, answer "who, what, where" in App Review Notes and ask for consent in the app before the first upload

If you sell auto-renewable subscriptions, every App Store description in every locale ends with a Terms of Use (EULA) link

If you use Screen Time APIs, request the Family Controls Distribution entitlement for the app and every extension on the day you add the feature

<figure>
<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three App Store blockers that a clean build does not catch">
  <rect width="640" height="260" rx="16" fill="#FFFFFF" stroke="#E8E5E0"/>
  <text x="320" y="42" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#1A1A1A">Build passes, review blocks</text>
  <rect x="30" y="70" width="180" height="150" rx="12" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="120" y="105" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1A1A1A">AI data</text>
  <text x="120" y="135" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">Guideline 2.1</text>
  <text x="120" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">Information Needed</text>
  <text x="120" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#FF6B35">Fix: notes + consent</text>
  <rect x="230" y="70" width="180" height="150" rx="12" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="320" y="105" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1A1A1A">EULA link</text>
  <text x="320" y="135" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">Subscriptions</text>
  <text x="320" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">every locale</text>
  <text x="320" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#FF6B35">Fix: script check</text>
  <rect x="430" y="70" width="180" height="150" rx="12" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="520" y="105" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1A1A1A">Family Controls</text>
  <text x="520" y="135" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">Screen Time APIs</text>
  <text x="520" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">app + every extension</text>
  <text x="520" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#FF6B35">Fix: request on day one</text>
</svg>
<figcaption>Three blockers, none of them a build error</figcaption>
</figure>

## Blocker 1: Information Needed on an AI feature

GetUp 1.1.2, October 2026
Not a hard rejection, a Guideline 2.1 "Information Needed" message

Apple asked three things:

- Who hosts the AI model?
- Is it third-party AI?
- Does user data go to it?

It lines up with a rule Apple changed on November 13, 2025 ([Apple](https://developer.apple.com/news/?id=ey6d8onl))
Guideline 5.1.2(i) now says you must disclose where personal data is shared with third parties, "including with third-party AI, and obtain explicit permission before doing so" ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#data-use-and-sharing))

That sentence has two jobs in it
Disclosure, and permission

Here's what I now put in App Review Notes for any app that touches a model, before Apple has to ask:

- Which parts run on device and which run in the cloud
- The provider's name, for example Google's Gemini through Firebase AI Logic
- Exactly what data is sent, field by field
- How long the provider keeps it and whether it's used for training
- Where the consent screen is and how a reviewer reaches it

Then the in-app part
The AI provider goes into the third-party list in your privacy policy, by name
And the user agrees before the first upload, on a screen that says what goes where

> A Settings toggle that's on by default is not consent

One more lesson from that review
When you reply to an Information Needed message, describe the build Apple actually reviewed, not the one on your laptop
If that build has no consent screen, don't promise one in your reply
Remove it from review, ship the fixed build, and put the answer in its Review Notes

Here's a minimal consent gate with `flutter_bloc`, default is false, always

```dart
class AiConsentCubit extends Cubit<bool> {
  AiConsentCubit(this._prefs) : super(_prefs.getBool(_key) ?? false);
  static const _key = 'ai_consent_v1';
  final SharedPreferences _prefs;

  Future<void> grant() async {
    await _prefs.setBool(_key, true);
    emit(true);
  }
}

Future<void> analyzePhoto(BuildContext context, Uint8List photo) async {
  final consent = context.read<AiConsentCubit>();
  final ai = context.read<AiRepository>();
  if (!consent.state) {
    final agreed = await showAiConsentSheet(context);
    if (agreed != true) return;
    await consent.grant();
  }
  await ai.analyze(photo);
}
```

Every call to the model goes through that one function
If someone adds a second path that skips it, code review catches it because it's the only place `AiRepository` gets called

## Blocker 2: The EULA link nobody puts in the description

This one is boring and it still blocked a submission

If your app has auto-renewable subscriptions, Apple says your app and your App Store metadata must include links to your Terms of Use and Privacy Policy ([Apple](https://developer.apple.com/app-store/subscriptions/))

Privacy has its own field in App Store Connect
Terms of Use, if you use Apple's standard EULA, doesn't
So it goes at the end of the App Store description

Miss it and automated review blocks the submission before a human ever looks

The trap is the words "every locale"
Localize into eight languages and you have eight descriptions
Someone rewrites the German one for a keyword push and drops the footer, and that's enough

So don't paste it by hand
Bake the link into your listing source, and let a tiny script check every locale before upload
If you keep metadata in fastlane, it's this:

```dart
import 'dart:io';

const eula =
    'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

void main() {
  final missing = Directory('fastlane/metadata')
      .listSync()
      .whereType<Directory>()
      .map((d) => File('${d.path}/description.txt'))
      .where((f) => f.existsSync() && !f.readAsStringSync().contains(eula))
      .map((f) => f.parent.path)
      .toList();
  if (missing.isNotEmpty) {
    stderr.writeln('EULA link missing in: ${missing.join(', ')}');
    exit(1);
  }
  stdout.writeln('EULA link found in every locale');
}
```

That's the standard Apple EULA URL
If you wrote your own terms, check for your URL instead

And don't forget the paywall
The same Apple page lists what the sign-up screen itself must show: the subscription name and length, the full renewal price, and a way to restore purchases ([Apple](https://developer.apple.com/app-store/subscriptions/))
Put the two links there too

## Blocker 3: Family Controls, the entitlement that sails through TestFlight

This is the nasty one, it hit both PushPass and GetUp

If your app uses Screen Time APIs (FamilyControls, ManagedSettings, DeviceActivity, shield extensions), you need the Family Controls entitlement
There's a Development version and a Distribution version

The Development capability builds, it signs, it uploads, and TestFlight is happy
Then App Review blocks it

Apple's Family Controls setup guide covers the part people miss: the Screen Time extensions, like Device Activity Monitor, Device Activity Report, Shield Action and Shield Configuration, need the capability on their own App IDs too ([Apple](https://developer.apple.com/documentation/xcode/configuring-family-controls))
A blocker app can easily have four bundle IDs, which can mean four requests through the [distribution request form](https://developer.apple.com/contact/request/family-controls-distribution)

Flutter makes this easy to miss
Those extensions live in the `ios` folder as native targets
`flutter build ipa` builds them, signs them, and never says a word about distribution

And approvals are not fast
Developers on Apple's forums report requests sitting in "Submitted" for weeks ([Apple Developer Forums](https://developer.apple.com/forums/thread/824193))

One update worth knowing
In a 2026 forum reply, Apple said approval can now be scoped to the whole team instead of each bundle ID ([Apple Developer Forums](https://developer.apple.com/forums/thread/828085))
That wasn't how mine went, so don't assume either way
Open Certificates, Identifiers & Profiles and check that every single identifier shows Family Controls as assigned for distribution

My rule now: request it the same day the Screen Time feature gets added, not the day before submitting

## The checklist I run before every iOS submit

| Check | Pass when |
|---|---|
| AI calls | Review Notes answer is written and the provider is in the privacy policy |
| AI consent | Fresh install shows consent before the first upload, and "no" means no upload |
| Toggles | No consent toggle defaults to on |
| EULA script | Every locale ends with the Terms of Use link and the privacy link |
| Paywall | Plan name, length, full price, restore and both links are visible |
| Screen Time | Every bundle ID, app and each extension, shows Family Controls Distribution |
| Login | Demo account details are in Review Notes |
| Replies | An Information Needed answer describes the build under review, not the next one |

Eight lines, much cheaper than another round of review

## Quick answers

### Does on-device AI count as third-party AI?

The rule is about sharing personal data with third parties
Data that never leaves the phone isn't shared
But say in Review Notes which parts run on device and which don't, it answers the question before it's asked

### Can I just use Apple's standard EULA?

Yes, link the standard EULA URL in the description
If you wrote custom terms, you can add them in App Store Connect instead

### Is Family Controls approval per app or per team?

Apple's setup guide puts the capability on each extension, and a newer forum reply talks about team-wide approval
Check the portal for every identifier before you submit

### Will TestFlight catch any of this?

No
TestFlight tests your binary
These were about metadata, consent and entitlements, and the Family Controls build installs and runs fine from TestFlight

## My takeaway

None of these were hard
Each one was a single line, a single link or a single form

What made them expensive was finding out at review time
So the checklist runs before the upload, every time, for every app

I put the full 30 minute pre-submit audit, with every check that gets small apps rejected, into one doc
