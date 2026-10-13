---
title: I built a Spotify app from a chat window
description: Spotify won't rotate its player on Android, so I asked Claude to build me one. It wrote it, tested it, and pushed it to this site.
pubDatetime: 2026-10-13T11:10:00Z
modDatetime: 2026-10-13T11:10:00Z
author: Jordan
featured: false
draft: false
hideEditPost: false
timezone: Australia/Brisbane
tags: ["ai", "claude", "web-dev"]
---

This one's a bit different. No Fabric, no Spark. Just a small annoyance, fixed in a way that still feels a bit ridiculous to me.

## The problem

I like having my phone sitting sideways in a stand with Spotify's Now Playing screen up. Big cover art, controls I can tap without picking the phone up. On Android though, the Now Playing screen refuses to rotate. The rest of the app turns to landscape fine, but the second you open the player it snaps back to portrait. People have been complaining about it on Spotify's community forum for years, and the request is sitting at "Not Right Now".

## The ask

So I opened Claude on my phone and basically said: I want an app that goes landscape and full screen so I can control Spotify with it.

It came back with three options. Force the rotation and live with a stretched layout, use some third-party now-playing app, or build my own on the Spotify Web API. I picked the last one, told it the cover art was the bit I cared about, and that was about the extent of my input.

## What it actually did

It wrote the whole thing as a single-page web app that installs to the home screen and launches full screen in landscape. Spotify login, play/pause/skip, scrubbing, shuffle, repeat, liking songs, volume, picking which device to play on, and a background that tints itself to match the album art. It even keeps the screen awake.

Then it tested it. It doesn't have my Spotify account, so it faked Spotify's API responses, rendered the page at phone size in a headless browser, looked at the screenshots, and fixed what it didn't like (a squashed play button and a muddy accent colour) before showing me anything.

I asked if it could just run as an artifact inside Claude, since I was at work and couldn't deploy anything. It said no, and explained why. Spotify's login has to redirect back to a fixed page, and that doesn't work from inside a frame on claude.ai. Fair enough. Instead it offered to push it straight into the repo for this site, since Astro copies anything in `public/` straight into the build.

I linked my GitHub account, installed the Claude GitHub app on this repo, and it committed the files and pushed. Cloudflare picked up the change like it does for any of my posts, and a couple of minutes later Claude fetched the page itself to check it was live. I never opened an editor.

The only real hiccup was mine. Spotify threw a `redirect_uri: Not matching configuration` error at me, and Claude walked me through what has to match character for character in the Spotify developer dashboard.

## Round two

Once it was working I asked for more. Pick a playlist, and something that plays songs it thinks I'll like. Spotify shut off its recommendations endpoints for new developer apps a while back, so Claude built the mixes from my own data instead: top tracks over different time ranges, recently played, and a sample of my Liked Songs. That gives On Repeat, Heavy Rotation, a Rediscover mix of old favourites I haven't played lately, a Liked Shuffle, and a mix for each of the artists I've been playing most. It also fixed the portrait layout, which I'd said wasn't scaling well.

Then I asked it to write this post and push that too. So, full disclosure, Claude wrote the first draft of what you're reading.

## Why I think it's a big deal

None of the individual pieces are hard. OAuth with PKCE, a few API calls, some CSS. A decent web dev could knock this out in an afternoon. What gets me is that I did it from a chat window on my phone, in between other things, without writing a line or opening an IDE. It went from idea to live on my domain in a single morning, and that included it testing its own work.

It's not magic. I still had to create a Spotify developer app, Spotify still needs Premium for playback control, and there are things the API just doesn't expose, like those looping canvas videos. But the gap between "I wish this existed" and "it exists" has basically closed for small things like this.

If you want to try it, it lives at [/nowplaying/](/nowplaying/). You'll need your own Spotify developer app (free, takes five minutes) because new Spotify apps only let in the users you add. The setup screen walks you through it.
