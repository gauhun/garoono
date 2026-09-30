# Daily blog routine

Runs every evening at 7:30pm IST. Writes one post, opens a PR, and waits for Gautam to say "go ahead" before anything goes live.

## 1. Setup

- Repo `gauhun/garoono`, start from the latest `main`
- `npm ci`
- Read `BRAND.md` fully. The facts section is the only first-hand material you may use
- Read `content/blog/_topics.md` and the titles of every post in `content/blog/`

## 2. Pick the topic

- Take the first row with status `todo`
- Skip it if an existing post already covers the same search intent, and take the next one

## 3. Research

- Search the web for the keyword and read the top results to learn what searchers expect and what they miss
- Prefer primary sources: Apple and Google developer docs and policies, Firebase docs, official statistics, named surveys
- Open every page you cite and confirm the exact number or rule is on it. Drop anything you cannot confirm
- Never invent stats, quotes, case studies or personal stories. First-hand claims come only from `BRAND.md`

## 4. Write `content/blog/<slug>.md`

Slug: the keyword in kebab case, lowercase, a to z, 0 to 9 and hyphens only.

```yaml
---
title: <= 65 characters, contains every word of the keyword
description: 70 to 165 characters, the takeaway in one line
date: YYYY-MM-DD (today, IST)
keyword: <the keyword from the topic row>
tags: [2 to 4 short tags]
relatedDoc: <the Related doc slug from the topic row>
---
```

Body:
- 900 to 1,500 words, practical, for someone with 1 to 2 hours a night
- Open with 3 to 5 short lines that state the problem and the payoff, no throat clearing
- `##` sections, `###` for steps, one table or checklist
- 1 or 2 inline SVG figures inside `<figure>` with a `<figcaption>`, following the palette in the existing post (white card, #E8E5E0 border, #FF6B35 accent, #1A1A1A text, Inter font). Diagrams, flows or charts of sourced numbers only
- A `>` callout for the single most important rule
- End with a short section that points to the related doc in one line
- House style: one sentence per line, no full stop at the end, no em or en dash, none of the banned phrases, every stat with a source link on the same line

## 5. Check

- `npm run blog:lint` must pass
- `npx vitest run` must pass
- `npm run build` must pass
- Fix and repeat until all three pass. Never weaken the rules to make a post pass

## 6. Hand off

- Change the topic row status to `done: <slug>`
- Branch `blog/<YYYY-MM-DD>-<slug>`, commit the post and the topic plan, push
- Open a PR to `main` titled `Blog: <title>` with: keyword, word count, the list of sources, and anything you were unsure about
- Notify Gautam: `New post ready: <title>. Reply "go ahead" to publish or tell me what to change`

## 7. Wait for Gautam

- "go ahead": squash merge the PR. The site deploys by itself in about a minute. Confirm the post URL `https://garoono.in/blog/<slug>/` returns 200 once deploy finishes
- Edit requests: change the post, run the checks again, push to the same PR, and notify again
- "skip": close the PR and set the topic row back to `todo`
