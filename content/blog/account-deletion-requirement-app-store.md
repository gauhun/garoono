---
title: Account Deletion Requirement on the App Store and Google Play
description: If your app has sign-in, Apple and Google both want a real Delete account button inside the app, here is what it must do and how to show it to review
date: 2026-10-22
keyword: account deletion requirement app store
tags: [app store, google play, app review, firebase]
relatedDoc: legal-checklist-before-you-submit
---

If people can create an account in your app, both stores want them to be able to delete it from inside the app
Apple checks it under guideline 5.1.1(v), Google checks it through its User Data policy and the Data safety form
Deactivating the account does not count on either store
Deleting must remove the account and the data tied to it, and Google also wants a web link that works without the app

That's the whole rule
The rest of this post is how to build it once, properly, and how to prove it to App Review

In October 2026 one of my apps got rejected under 5.1.1(v) for exactly this
It had sign-in and no in-app account deletion
After I added it, Apple asked for a screen recording on a physical device showing the full flow
So this is written from the fix, not from theory

## What Apple requires

Guideline 5.1.1(v) says that if your app supports account creation, you must also offer account deletion within the app ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage))

Apple's account deletion page spells out the details ([Apple](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion))

- Make the option easy to find, usually in account settings
- Delete the entire account record and the personal data tied to it
- Only offering to deactivate or disable the account is not enough
- If deletion finishes on your website, link straight to that page, not your home page
- If deletion takes time, tell the user how long and confirm when it's done
- If the law makes you keep some data, say what you keep and what you delete

Two details catch indie devs

Guest accounts count
Apple says people should be able to delete automatically generated accounts and their data too ([Apple](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion))

Subscriptions need a warning
If the user has an auto-renewable subscription, Apple wants you to tell them billing continues through Apple and ask them to cancel first ([Apple](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion))

You may ask the user to confirm, or enter a code sent to their email
But Apple says apps that make deletion unnecessarily difficult will not pass review, and unless you're in a highly regulated industry, don't make people call, email or chat with support to delete ([Apple](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion))

## What Google Play requires

Google's rule is close, with one extra piece

Its User Data policy says apps that allow account creation must offer deletion both inside the app and through a web resource outside it ([Google Play policy](https://support.google.com/googleplay/android-developer/answer/10144311))
The same policy says temporary deactivation, disabling or freezing the account does not qualify as deletion

Google's help page on the requirement adds what the web link needs ([Google Play Help](https://support.google.com/googleplay/android-developer/answer/13327111))

- It must load without errors
- It must reference your app or developer name as shown on your Play listing
- The user must be able to actually request deletion through it
- You put the link in the Data safety form in Play Console

Why a web link if the app already has a button?
Google's answer is that a user who already uninstalled your app shouldn't have to download it again just to delete their account ([Google Play Help](https://support.google.com/googleplay/android-developer/answer/13327111))

You can keep some data for security, fraud prevention or legal reasons, as long as you tell users clearly what you keep ([Google Play Help](https://support.google.com/googleplay/android-developer/answer/13327111))

A simple page on your site with a short form, or a page that tells signed in users to tap Delete account and logged out users how to request it, is enough for a small app

## What a deletion flow must actually do

The button is the easy part
What happens after the tap is what makes it real

<figure>
<svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Five steps of an account deletion flow in order">
  <rect width="640" height="230" rx="16" fill="#FFFFFF" stroke="#E8E5E0"/>
  <text x="320" y="40" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="700" fill="#1A1A1A">Order matters</text>
  <rect x="20" y="70" width="108" height="100" rx="12" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="74" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#1A1A1A">1 Confirm</text>
  <text x="74" y="132" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">warn about</text>
  <text x="74" y="148" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">subscriptions</text>
  <line x1="128" y1="120" x2="142" y2="120" stroke="#1A1A1A" stroke-width="2"/>
  <rect x="142" y="70" width="108" height="100" rx="12" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="196" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#1A1A1A">2 Sign in</text>
  <text x="196" y="132" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">again, fresh</text>
  <text x="196" y="148" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">credential</text>
  <line x1="250" y1="120" x2="264" y2="120" stroke="#1A1A1A" stroke-width="2"/>
  <rect x="264" y="70" width="108" height="100" rx="12" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="318" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#1A1A1A">3 Revoke</text>
  <text x="318" y="132" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">Sign in with</text>
  <text x="318" y="148" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">Apple token</text>
  <line x1="372" y1="120" x2="386" y2="120" stroke="#1A1A1A" stroke-width="2"/>
  <rect x="386" y="70" width="108" height="100" rx="12" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="440" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#1A1A1A">4 Data</text>
  <text x="440" y="132" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">docs, files,</text>
  <text x="440" y="148" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">user content</text>
  <line x1="494" y1="120" x2="508" y2="120" stroke="#1A1A1A" stroke-width="2"/>
  <rect x="508" y="70" width="112" height="100" rx="12" fill="#E9F9EE" stroke="#15803D"/>
  <text x="564" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#15803D">5 Auth user</text>
  <text x="564" y="132" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">delete it</text>
  <text x="564" y="148" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">last</text>
  <text x="320" y="205" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">Delete the auth user first and your security rules lock you out of the data</text>
</svg>
<figcaption>The auth user goes last, everything that needs it goes first</figcaption>
</figure>

### 1 Confirm and warn
One screen, one clear button, and a line about active subscriptions with a link to manage them

### 2 Re-authenticate
Firebase says deleting an account is a security-sensitive action that needs a recent sign-in, and fails with an error otherwise ([Firebase docs](https://firebase.google.com/docs/auth/web/manage-users))
So ask the user to sign in again right before deleting, instead of waiting for the error

### 3 Revoke Sign in with Apple
Apple says apps that support Sign in with Apple should use its REST API to revoke user tokens ([Apple](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion))
Firebase does not store Apple tokens, so the user signs in with Apple again, you take the fresh authorization code, and Firebase revokes it for you ([Firebase docs](https://firebase.google.com/docs/auth/ios/apple))

### 4 Delete the server data
Firestore documents, Storage files, anything the user posted
Apple says people expect shared content like photos, posts and reviews to go too ([Apple](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion))

### 5 Delete the auth user
Last, because your security rules probably check `request.auth` before letting anyone delete those documents

Here's the short Flutter version for an Apple sign-in user

```dart
Future<void> deleteAccount() async {
  final auth = FirebaseAuth.instance;
  final user = auth.currentUser!;

  // Fresh sign-in: satisfies recent-login and gives a new Apple auth code
  final cred = await user.reauthenticateWithProvider(AppleAuthProvider());
  final code = cred.additionalUserInfo?.authorizationCode;
  if (code != null) await auth.revokeTokenWithAuthorizationCode(code);

  // Server data before the auth user, while rules still see request.auth
  await FirebaseFirestore.instance.doc('users/${user.uid}').delete();

  await user.delete();
}
```

The `revokeTokenWithAuthorizationCode` call is straight from the FlutterFire docs ([Firebase docs](https://firebase.google.com/docs/auth/flutter/federated-auth))
For Google or email users, swap the reauthenticate step for that provider and skip the revoke

If a user has subcollections or Storage files, one document delete is not enough
Move the data part into a Cloud Function that deletes everything under the user's ID, and call it from the app

## How to show it to App Review

This is the part Apple came back to me about

Apple's review prep page says to give working demo account credentials in App Store Connect, and to use the Notes field for anything extra reviewers need ([Apple](https://developer.apple.com/help/app-review/before-submitting-for-review/complete-review))
For account deletion, add these to Review Notes before Apple asks

- A demo account that is safe to delete, and a second one in case they delete the first
- The exact path, for example Settings, Account, Delete account
- What gets deleted and how long it takes
- A screen recording on a real iPhone: sign in, find Delete account, finish the deletion

In my case Apple asked for that recording after the rejection
Recording it up front costs five minutes and can save you a full review cycle

> Deleting the account, not hiding it, is the rule on both stores

## Pre-submit checklist

| Check | Pass when |
|---|---|
| In-app button | Delete account is easy to find in account settings |
| Real deletion | Account record and user data are gone, not just flagged |
| Re-auth | Fresh sign-in happens before the delete call |
| Apple token | Revoked for Sign in with Apple users |
| Subscriptions | User is told billing continues and how to cancel |
| Google web link | Loads, names the app, accepts a request, is in Data safety |
| Review Notes | Demo account, path to the button and a device recording |

If you want the other legal checks stores run before approving an app, they're in [Before You Submit: Legal Checklist](/docs/#legal-checklist-before-you-submit)
And my [App Store checklist](/blog/flutter-app-store-checklist/) covers three other blockers that a clean build never catches

## FAQ

### Is account deletion required on the App Store?

Yes, if your app lets people create an account
Guideline 5.1.1(v) requires that those apps also let people delete the account from inside the app

### Is deactivating an account enough?

No
Apple and Google both say that only deactivating, disabling or freezing an account does not count as deletion

### Does Google Play need a web link for account deletion?

Yes
Google wants a working web page where users can request deletion without reinstalling the app, and that link goes in the Data safety form in Play Console

### Do I have to revoke Sign in with Apple tokens when deleting an account?

Apple says apps that support Sign in with Apple should revoke user tokens through its REST API
With Firebase, sign the user in with Apple again and pass the new authorization code to the revoke method before deleting the user

### Can I keep some user data after the account is deleted?

Yes, if the law or fraud prevention requires it
Both stores want you to tell users clearly what you keep
