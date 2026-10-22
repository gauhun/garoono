---
title: "Privacy Policy for App Store Submission: Apple and Google Rules"
description: Both stores want a public privacy policy URL, a link inside the app and a data form that matches it, here is exactly what Apple and Google check
date: 2026-10-22
keyword: privacy policy for app store submission
tags: [privacy policy, app store, google play, app review]
relatedDoc: legal-checklist-before-you-submit
---

Every app needs a privacy policy to get through review on the App Store and Google Play, even one that collects nothing
Both stores want the link in two places: a field in the developer console, and inside the app itself
Then each has its own data form, App Privacy details on Apple and the Data safety form on Google, and the policy has to agree with it
If your app has accounts, both stores also want account deletion, and Google wants a web link for it

The rest is the detail, so your policy passes on the first round

## What Apple checks

### The rule
Guideline 5.1.1(i) says all apps must include a privacy policy link "in the App Store Connect metadata field and within the app in an easily accessible manner" ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage))

The same guideline lists what the policy must say ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)):

- What data the app collects, how it collects it, and every use of it
- That any third party you share data with, like analytics tools, ad networks and SDKs, gives the same protection your policy promises
- How long you keep data, how you delete it, and how a user can revoke consent or ask for deletion

Free templates often skip that last point, so check yours

### Where the URL goes
In App Store Connect, open your app, pick App privacy in the sidebar, and click Edit next to Privacy Policy ([App Store Connect Help](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy))
Apple says a privacy policy URL is required for all apps, and the user privacy choices URL next to it is optional ([App Store Connect Help](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy))
One catch: a change to these URLs goes live with your next app version

### App Privacy details
This is the privacy label on your product page
Apple says it's required to submit new apps and app updates, and it must include the practices of third-party partners whose code is in your app ([Apple](https://developer.apple.com/app-store/app-privacy-details/))

Apple defines collect as sending data off the device in a way that lets you or your partners access it for longer than it takes to handle the request in real time ([Apple](https://developer.apple.com/app-store/app-privacy-details/))
So the Firebase, crash reporting or ads SDK you added in ten minutes counts, even if you never look at that data

You can update these answers any time without shipping a new build ([Apple](https://developer.apple.com/app-store/app-privacy-details/))
And guideline 2.3 asks that your metadata, privacy information included, matches what the app really does ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#accurate-metadata))

AI features add one more step on Apple, see [my App Store checklist](/blog/flutter-app-store-checklist/)

## What Google checks

### The rule
Google's User Data policy says all apps must post a privacy policy link in the designated field in Play Console, and a link or the text inside the app ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en))
Apps that don't access any personal or sensitive data still need one ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en))

Google's list of what the policy must cover ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en)):

- Who you are, and a way to contact you about privacy
- The types of personal and sensitive data the app accesses, collects, uses and shares, and who it's shared with
- How you handle that data securely
- How long you keep data and how you delete it
- A clear label, like a title that says privacy policy

### The URL rules
Google wants the policy on an active, public, non-geofenced URL, not a PDF, and not editable by visitors ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en))
The developer name on your Play listing has to appear in the policy, or the app has to be named in it ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en))

### The Data safety form
Every app published on Google Play needs a Data safety form, even if it collects no user data ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en))
It has to include data handled by third-party libraries and SDKs in your app ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en))

Google says you alone are responsible for complete and accurate declarations, and apps that don't comply face enforcement ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en))

<figure>
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Where Apple and Google check your privacy policy">
  <rect width="640" height="300" rx="16" fill="#FFFFFF" stroke="#E8E5E0"/>
  <text x="320" y="40" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#1A1A1A">One policy, checked in four places</text>
  <text x="170" y="75" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#FF6B35">Apple</text>
  <text x="470" y="75" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#FF6B35">Google</text>
  <rect x="40" y="90" width="260" height="40" rx="10" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="170" y="115" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#1A1A1A">URL in App Store Connect</text>
  <rect x="40" y="140" width="260" height="40" rx="10" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="170" y="165" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#1A1A1A">Link inside the app</text>
  <rect x="40" y="190" width="260" height="40" rx="10" fill="#F3F4F6" stroke="#E8E5E0"/>
  <text x="170" y="215" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#1A1A1A">App Privacy details</text>
  <rect x="40" y="240" width="260" height="40" rx="10" fill="#F3F4F6" stroke="#E8E5E0"/>
  <text x="170" y="265" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#1A1A1A">Delete account in the app</text>
  <rect x="340" y="90" width="260" height="40" rx="10" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="470" y="115" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#1A1A1A">URL in Play Console</text>
  <rect x="340" y="140" width="260" height="40" rx="10" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="470" y="165" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#1A1A1A">Link or text inside the app</text>
  <rect x="340" y="190" width="260" height="40" rx="10" fill="#F3F4F6" stroke="#E8E5E0"/>
  <text x="470" y="215" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#1A1A1A">Data safety form</text>
  <rect x="340" y="240" width="260" height="40" rx="10" fill="#F3F4F6" stroke="#E8E5E0"/>
  <text x="470" y="265" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#1A1A1A">Delete account in the app and on the web</text>
</svg>
<figcaption>The orange rows are the policy itself, the grey rows have to say the same thing</figcaption>
</figure>

## If your app has accounts

Apple says apps that support account creation must let people start account deletion inside the app ([Apple](https://developer.apple.com/support/offering-account-deletion-in-your-app/))
Only offering to deactivate or disable the account is not enough, and the option should be easy to find, usually in account settings ([Apple](https://developer.apple.com/support/offering-account-deletion-in-your-app/))
With Sign in with Apple, Apple also asks you to revoke the user's tokens through its REST API

Google wants the same in-app option, plus a way to request deletion outside the app, like a page on your website ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en))
That web link goes into the Data safety form in Play Console ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en))

Google's rules for that page ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)):

- It loads without errors
- It names the app or developer as shown on your Play listing
- The deletion steps are easy to find on the page
- Users can request deletion without reinstalling the app
- It says what data you keep, if any, and why

Freezing or deactivating the account doesn't count as deletion, and you must delete the user data tied to the account too ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en))

> Your privacy policy, your data form and your app have to tell the same story, a policy that's fine on its own still fails if the form says something else

## Where solo devs slip

None of these are hard, just easy to forget at 1am

- The policy came from a generator and never mentions the SDKs you added later
- The data forms say "no data collected" while Firebase Analytics or an ads SDK runs in the background
- The policy is a PDF or a doc link, which Google rules out
- The policy names a different developer than your store listing
- The in-app link is buried three screens deep, or missing from the logged out state

If your policy promises secure data handling, make it true first with [the RLS checklist](/blog/supabase-rls-checklist-for-vibe-coded-apps/)

## The checklist

| Check | Apple | Google |
|---|---|---|
| Public policy URL in the console | App privacy page in App Store Connect | Privacy policy field in Play Console |
| Link inside the app | Easy to reach | Link or text in the app |
| Says what you collect and why | Required | Required |
| Covers third-party SDKs | Required | Required |
| Retention and deletion explained | Required | Required |
| Contact details and policy title | Good practice | Required |
| Format | Public web page | Public web page, no PDF, not geofenced |
| Data form filled and matches | App Privacy details | Data safety form |
| Account deletion, if you have accounts | In the app | In the app, plus a web URL in Data safety |

Run it once per app, then again any time you add an SDK

## The full legal pass

The privacy policy is one of seven things stores check before approving an app, all seven are in [Before You Submit: Legal Checklist](/docs/#legal-checklist-before-you-submit)

## FAQ

### Do I need a privacy policy if my app collects no data?

Yes, Apple requires a privacy policy link for all apps
Google says apps that do not access any personal or sensitive user data must still submit a privacy policy

### Where do I add the privacy policy URL in App Store Connect?

Open your app in App Store Connect, select App privacy in the sidebar, and click Edit next to Privacy Policy
Changes to the URL go live with your next app version

### Can my privacy policy be a PDF or a Google Doc?

Not for Google Play, the policy must be on an active, public, non-geofenced URL, no PDFs, and not editable
A plain page on your own website works for both stores

### Does the privacy policy have to mention third-party SDKs?

Yes, Apple asks you to confirm that third parties like analytics tools, ad networks and SDKs give user data the same protection
Apple's App Privacy details and Google's Data safety form must also include data collected by SDKs in your app

### Do I need an account deletion link for Google Play?

Only if your app lets users create an account
Then you need a delete option inside the app and a web link for deletion requests, entered in the Data safety form
