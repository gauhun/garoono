---
title: Supabase RLS Checklist for Vibe Coded Apps After 16,326 Leaks
description: Researchers found 16,326 Supabase databases with readable tables, here is the 9 step RLS checklist to run on your AI built app tonight
date: 2026-09-30
keyword: supabase rls checklist for vibe coded apps
tags: [supabase, app security, vibe coding]
relatedDoc: 20-security-checks-before-launch
---

Your AI agent built the app in a weekend
It also may have left your users table open to anyone with a browser
This is not a scare story, it is a fresh study, and the fix takes about an hour

This post is the checklist I would run on any Supabase backed app before shipping it
It works whether you wrote the code or Claude, Cursor or Lovable did

## What the research found

On September 25, 2026, UpGuard published a study of roughly 300,000 domains that use Supabase ([UpGuard](https://www.upguard.com/blog/everything-everywhere-systemic-data-exposure-in-supabase-apps))
It found 16,326 databases exposing readable tables to anyone ([UpGuard](https://www.upguard.com/blog/everything-everywhere-systemic-data-exposure-in-supabase-apps))
Over half of those databases had indicators of personal data ([UpGuard](https://www.upguard.com/blog/everything-everywhere-systemic-data-exposure-in-supabase-apps))

Indie makers are not immune
A January 2026 scan of 20,052 products listed on indie launch directories found 11.04% of domains exposing Supabase credentials ([SupaExplorer report](https://supaexplorer.com/cybersecurity-insight-report-january-2026))
TrustMRR listings had the highest rate at 23.76% ([SupaExplorer report](https://supaexplorer.com/cybersecurity-insight-report-january-2026))

> The pattern is almost always the same: a table without Row Level Security, reached with a key that was meant to be public

## Why vibe coded apps leak

Supabase turns on Row Level Security by default for tables you create in its Table Editor
UpGuard points out the gap: tables created programmatically through the API, which is how coding agents talk to Supabase, do not get RLS by default ([UpGuard](https://www.upguard.com/blog/everything-everywhere-systemic-data-exposure-in-supabase-apps))

So the agent creates `profiles`, `orders` and `messages`, the app works, and every row is readable
Nothing looks broken, which is exactly why nobody notices

<figure>
<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="How a request reaches your rows with and without RLS">
  <rect width="640" height="300" rx="16" fill="#FFFFFF" stroke="#E8E5E0"/>
  <rect x="30" y="110" width="140" height="70" rx="12" fill="#FFF3ED" stroke="#FF6B35"/>
  <text x="100" y="140" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1A1A1A">Anyone</text>
  <text x="100" y="160" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">publishable key</text>
  <line x1="170" y1="145" x2="240" y2="145" stroke="#1A1A1A" stroke-width="2"/>
  <rect x="240" y="110" width="140" height="70" rx="12" fill="#F3F4F6" stroke="#E8E5E0"/>
  <text x="310" y="140" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1A1A1A">Supabase API</text>
  <text x="310" y="160" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#555">table grants</text>
  <line x1="380" y1="130" x2="450" y2="70" stroke="#15803D" stroke-width="2"/>
  <line x1="380" y1="160" x2="450" y2="225" stroke="#B91C1C" stroke-width="2"/>
  <rect x="450" y="35" width="165" height="70" rx="12" fill="#E9F9EE" stroke="#15803D"/>
  <text x="532" y="65" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#15803D">RLS on</text>
  <text x="532" y="85" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#1A1A1A">only rows the policy allows</text>
  <rect x="450" y="190" width="165" height="70" rx="12" fill="#FDEBEB" stroke="#B91C1C"/>
  <text x="532" y="220" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#B91C1C">RLS off</text>
  <text x="532" y="240" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#1A1A1A">every row, to anyone</text>
</svg>
<figcaption>The publishable key is public by design, Row Level Security is what actually protects the rows</figcaption>
</figure>

## Is the Supabase anon key safe in my app?

Yes, if RLS is on
Supabase says the publishable key is safe to expose in a web page, a mobile app or source code, and that it only reaches what Row Level Security allows ([Supabase docs](https://supabase.com/docs/guides/api/api-keys))

The secret key is a different animal
Supabase says a secret key bypasses every Row Level Security policy you have, and to never put one in a browser, a shipped application or source control ([Supabase docs](https://supabase.com/docs/guides/api/api-keys))
If your AI agent pasted a secret or `service_role` key into client code, treat it as leaked and rotate it

## The October 30, 2026 change you should know about

Until now, new tables in the `public` schema were automatically exposed to the `anon`, `authenticated` and `service_role` roles ([Supabase changelog](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically))
From October 30, 2026, existing projects stop getting those automatic grants, and new tables need explicit grants to be reachable through the API ([Supabase changelog](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically))

This is good for security, but it can break an app that silently relied on the old behaviour
Add grants on purpose, table by table, and only the ones each role needs

## The 9 step checklist

### 1 Find every table without RLS
Run this in the Supabase SQL editor

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by rowsecurity, tablename;
```

Any row with `rowsecurity = false` is open to whatever the grants allow

### 2 Turn RLS on for all of them

```sql
alter table public.profiles enable row level security;
```

With RLS on and no policies, the API returns nothing, which is the safe starting point

### 3 Write the narrowest policy that works
The most common one: a signed in user can read only their own rows

```sql
create policy "Users read own rows"
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);
```

### 4 Add separate policies for insert, update and delete
Use `with check` so a user cannot write rows that belong to someone else
Skip any operation your app does not need

### 5 Grant access on purpose
Give `anon` only what logged out users truly need, often nothing
Give `authenticated` only the operations your policies cover

### 6 Test like an attacker
Call the REST endpoint for each table with only the publishable key and no user session

```bash
curl "https://YOUR_PROJECT.supabase.co/rest/v1/profiles?select=*" \
  -H "apikey: YOUR_PUBLISHABLE_KEY"
```

You want an empty list or an error, never real rows

### 7 Keep secret keys on the server
Secret keys belong in Edge Functions or your own server, never in a Flutter build, a React bundle or a public repo
Anything shipped inside an app can be extracted

### 8 Move AI provider keys behind a function
The same rule applies to OpenAI or Gemini keys in AI wrapper apps
Even Firebase, whose normal API keys are fine to ship, says a Gemini Developer API key should never be included in your code or configuration files ([Firebase docs](https://firebase.google.com/docs/projects/api-keys))

### 9 Tell your agent the rules up front
Paste this into your project rules file so every new table starts locked

> Every table you create in Supabase must have Row Level Security enabled in the same migration
> Add an explicit policy for each operation the app uses, and explicit grants per role
> Never use or print the service role key in client code

## Quick reference

| Check | Pass when |
|---|---|
| RLS on every public table | The SQL above shows no `false` rows |
| Policies per operation | Select, insert, update and delete each have a policy or are not granted |
| Anon test | Publishable key alone returns no real data |
| Secret key | Only in server code, rotated if it was ever shipped |
| AI keys | Called from a server function, not the app |
| Grants after Oct 30 | Added on purpose for each table and role |

## Using Firebase instead?

The idea is the same with different names
Firebase says its API keys do not need to be treated as secrets, and that data security is enforced by Firebase Security Rules, not by hiding the key ([Firebase docs](https://firebase.google.com/docs/projects/api-keys))
So the Firebase version of this checklist is: no test mode rules in production, rules that check `request.auth` on every collection, and App Check for extra protection

## Before you ship

Run steps 1 and 6 tonight, they take ten minutes and catch most leaks
Then work through the rest before your next release

I keep a longer launch checklist with 20 security checks, including the Firebase side, in the docs
