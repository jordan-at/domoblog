---
title: "Deploying a website: The bits that broke"
description: pnpm, a Vite type clash, a worker name with a space in it, and a timezone bug that put my posts in the future
pubDatetime: 2026-10-13T12:00:00Z
modDatetime: 2026-10-13T12:00:00Z
author: Jordan
featured: false
draft: true
hideEditPost: false
timezone: Australia/Brisbane
tags: ["web-dev", "astro", "cloudflare"]
---

The first three posts in this series make it sound like the site went up cleanly. It didn't. The whole thing went live in one long night in July, and most of that night was spent on four problems that had nothing to do with writing a website. This is the honest version.

## 1. npm, then pnpm

The AstroPaper template ships with npm. Locally that was fine. Cloudflare's build was not happy with it, and after some back and forth I switched the project to pnpm. The commit message from that night is literally "Changing to pnpm for some reason", which tells you how well I understood it at the time.

What the switch actually involved:

- Deleting `package-lock.json` (all 10,000 lines of it) and generating `pnpm-lock.yaml`
- Pinning the package manager in `package.json` with `"packageManager": "pnpm@11.10.0"`, so Cloudflare uses the same version I do
- Adding `workerd` to the `allowBuilds` list in `pnpm-workspace.yaml`

That last one caught me out. pnpm doesn't run install scripts for dependencies unless you allow them, and Wrangler's local runtime (`workerd`) needs its install script to fetch a binary. Without it on the list, things fail in ways that don't point at the cause.

## 2. Two Vites, one config

This is the one from the "MY WEBSITE WORKS NOW" post where I said I'd figure out what I did tomorrow. Tomorrow took a while.

Astro and the Tailwind Vite plugin both depend on Vite, but not necessarily the same version. When Cloudflare builds the site it type-checks the config, and TypeScript sees the plugin's type coming from one copy of Vite and Astro's expected type coming from another. Same shape, different packages, so it refuses to match them.

The fix I went with was one line in `astro.config.ts`:

```ts
plugins: [tailwindcss() as any],
```

`as any` tells TypeScript to stop checking that value. It works because nothing is actually wrong at runtime, the types just come from two different places. It's still a workaround, not a fix. The proper fix is getting both packages onto the same Vite version, which should happen naturally as Astro and Tailwind update. When that happens I can delete the cast.

## 3. The worker name

My first `wrangler.jsonc` had `"name": "Jordan Website"`. Cloudflare worker names have to be lowercase with no spaces, so that went nowhere. A few commits titled "website name with no space!" later, I ended up merging a pull request that renamed it to the auto-generated `billowing-frogas-06b8`. Not pretty, but nobody sees it except me.

## 4. Posts from the future

This one was the most satisfying to fix.

Pages CMS saves the publish time as whatever I type in, which is Brisbane time, but it labels it with a `Z` on the end. `Z` means UTC. So a post I wrote at 11pm Brisbane time was saved as 11pm UTC, which is 9am the next day here. Posts were showing up with the wrong dates, and some looked like they were scheduled for the future.

The fix lives in `src/content.config.ts`, where Astro validates every post's frontmatter with Zod. Instead of trusting the date, I subtract ten hours from it:

```ts
const AEST_OFFSET_MS = 10 * 60 * 60 * 1000; // Pages CMS writes local wall time labeled Z; recover true instant

pubDatetime: z.coerce.date().transform(d => new Date(d.getTime() - AEST_OFFSET_MS)),
```

A hardcoded ten hours would be a bug almost anywhere else in Australia, because of daylight saving. Queensland doesn't do daylight saving, so Brisbane is UTC+10 all year and the shortcut holds. If I ever move to Sydney, this line is going to bite me.

I also changed the CMS's timezone field from free text to a dropdown defaulting to Brisbane, so I can't typo it.

## What I took from it

None of these were hard problems once I understood them. The hard part was that the error messages pointed somewhere else every time. A package manager install script, a type-only mismatch, a naming rule, and a date that was technically valid but wrong.

I leaned on Claude a lot that night, and I'll be honest that I applied at least one fix before I understood it. Writing this post was me going back and making sure I actually do now.
