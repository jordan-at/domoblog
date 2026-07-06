---
title: MY WEBSITE WORKS NOW
description: ": D"
pubDatetime: 2026-07-07T00:12:00Z
modDatetime: 2026-07-07T00:12:00Z
author: Jordan
featured: true
draft: false
hideEditPost: false
timezone: Australia/Brisbane
---
Spent the night/afternoon going somewhat insane trying to work out the flow of setting up babies first website. Locally building the site and deploying was easy. But then apparently Cloudflare does a bunch of automatic validation? How dare they! When building/checking, Tailwind and Astro depend on Vite, but during typescript validation each dependency maps back to a slightly different version.

Spent a little bit getting annoyed, and Claude told me to typecast as any, so I did it, and it worked, and now I will need to go back tomorrow to figure out what the fuck I did and why it worked. Cool!  

Anyway, I guess this means I need to read up on TypeScript, because apparently, it's a different thing to JavaScript.

Irregardless (yeah, I know it's not a word), I now have:

1. Page CMS - Interface that I can write markdown content and hit save, where the markdown is put nicely in the website's repository. Nice little editor that I can type out my things, mark them as drafts, put in images, whatever.
2. GitHub Repository - Storage, when my website is updated, or if I add a new post through Page, it will go here.
3. Cloudflare Worker - Place that hosts and builds my page. In configuration settings you can link it to a git repo, so that every time a git commit happens (code is changed), it needs to re-deploy the website with the fresh code. Happens automatically and is pretty damn quick which is cool.

I need to go through the site and update the about section and whatever because as of current it will be a bunch of placeholder things, but that can be something for tomorrow Jordan because its 12:30AM right now and I think my girlfriend will hurt me if I don't switch the displays off

Lots of Love,  
Jordan