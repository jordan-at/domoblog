---
title: Making A Website
description: What is Astro & why I chose it
pubDatetime: 2026-07-09T14:05:00Z
modDatetime: 2026-07-09T14:05:00Z
author: Jordan
featured: false
draft: false
hideEditPost: false
timezone: Australia/Brisbane
---
So, its job-hunting season for me after my last project/contract ended, and I thought it was time that I make myself a website where I can write about the things I have learnt so far in my career and talk about any technical/niche things. I can put the URL in my resume, I can learn a bit, and I enjoy stuff like this.

I read this article by Alejandro Torres where they talk about the framework, and pretty quickly knew it was going to be a match.

[When to use Astro and when not: my experience | Medium]([https://medium.com/@aletorres1102/when-to-use-astro-and-when-not-my-experience-137820ff85e9](https://medium.com/@aletorres1102/when-to-use-astro-and-when-not-my-experience-137820ff85e9))

## Astro

Up until a couple days ago I also had never heard of Astro. A quick google gives us the following:

> **Astro** is a modern, web development framework designed to build content-heavy websites (like blogs, portfolios, and e-commerce stores) that are incredibly fast and search-engine friendly==. It achieves this by generating static HTML on the server and shipping zero JavaScript to the user's browser by default.

For all my non-technical friends out there, HTML is the foundational language that defines content on your webpage, and JavaScript is a way that websites can integrate logic inside of said page. Also please note that Java is different to JavaScript. Java makes Minecraft, and JavaScript makes webpages do stuff. (Horrid analogy, but don't care, it's my website, what are you going to do about it).

So, if you want something with lots of interaction Astro probably isn't what you are looking for. But in my case for a simple blog its perfect.

## Astropaper

Another thing that I found was a blog [Starting With AstroPaper: A Theme Built for Reading | Kruno Golubić]([https://kgolubic.com/posts/starting-with-astropaper/](https://kgolubic.com/posts/starting-with-astropaper/)) that I liked the look of, AstroPaper, a theme built over the top of Astro. A Rather nifty/minimalist techy vibe which is what I am going for with support for adding blogposts via markdown (cool).  If I decide I don't like the site anymore I can simply bring my markdown articles with me to whatever site I want. 

I don't really like frontend as visual design is not something that I'm greatest at as you can never really be sure when something is completed. Rather I am more of a backend type where success is somewhat binary (It works, or it doesn't). So, when I found something where I wouldn't need to build any UI or frontend, and I could just "repurpose" (steal - thank god for opensource)I was sold.

## So how do I actually make a website do a website

So, I found something I like the look of, and I want to claim it as my own. How do I do this? The bottom of the GitHub page for Astro paper says to run:

```powershell
# npm
npm create astro@latest --template satnaing/astro-pape
```

I run the command, it doesnt work.

I google "what is npm".

[!note]
Astro is a package manager, and it installs dependencies required to run projects. 

I install npm, then it works. Yay!

Now I can navigate to the directory, and run npm run dev

![image.png](/assets/image.png)

![image.png](/assets/image-1.png)

So now I have a website running on local host (my computer) and I can see edits happen in real time. After I edit some of the content/add some copy, I'm somewhat happy with it and its time to figure out how to push it online.

Next, I need to determine the following

1. How can I add future posts?
2. How can I deploy the website online?
3. How can it be automatic?

The answer to these questions is two things. Pages CMS, and Cloudflare Workers.

Things that will be great for another post because this one is starting to get a little long.

Till next time.