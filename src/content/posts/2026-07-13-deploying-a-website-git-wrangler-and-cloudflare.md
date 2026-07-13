---
title: "Deploying a website: Git, Wrangler & Cloudflare"
description: Taking my website online
pubDatetime: 2026-07-13T14:17:00Z
modDatetime: 2026-07-13T14:17:00Z
featured: true
draft: false
hideEditPost: false
timezone: Australia/Brisbane
---
Last time, we got Pages CMS working so I didn't have to manually type out Markdown frontmatter anymore. The writing process was fixed, but the site was still just sitting on my local machine. 

If a recruiter actually clicks the link on my resume, it needs to go to a real website. I also don't want to manually build and upload files every time I fix a typo or publish a new post. 

Here is how to wire it all together to get the site live and slap a custom domain on it for that professional finish.

## Step 1: Prepping Astro for Cloudflare

By default, Astro builds a standard static site. To run it on Cloudflare's edge network, we need to add their adapter so Astro knows how to compile the project. 

Open your terminal in your project folder and run:

```bash
pnpm astro add cloudflare
```

This installs the required dependencies and automatically updates your `astro.config.mjs` file.

## Step 2: Building with pnpm

I prefer `pnpm` over `npm` because it's significantly faster and handles dependencies much more cleanly. 

To generate the production-ready static files for the blog, you just need to run:

```bash
pnpm run build
```

Astro will crank through the Markdown files and output everything into a `dist` folder.

## Step 3: Deploying with Wrangler

With the site built, it's time to push it to the edge. Cloudflare's Wrangler CLI makes this seamless. 

Instead of clicking through dashboards, the deployment is handled entirely from the command line:

```bash
npx wrangler deploy
```

Wrangler looks at your built project, packages it up, and pushes it directly to Cloudflare. Within seconds, it will spit out a live URL right in the terminal.

## Automating the Pipeline

Because this entire process is CLI-based, this workflow is incredibly easy to drop into a GitHub Action for full automation. 

By wiring this up in GitHub, the CI/CD pipeline becomes completely hands-off. When Pages CMS commits a new post to the repository, GitHub can automatically trigger a runner to execute `pnpm install`, `pnpm run build`, and finally `npx wrangler deploy`. 

## Step 4: Adding a Custom Domain

The deployment pipeline is running flawlessly. But right now, the site lives on a  `.workers.dev` subdomain. It works, but it doesn't have my name on it.

I already had a domain managed in Cloudflare that I had previously used for a Pages project (it was a button that returned a dog picture), so I just repurposed it for this Worker. Because the DNS is already in Cloudflare, tying it to the Worker took about thirty seconds. No messing with DNS propagation delays or manually provisioning SSL certificates.

1. In your Cloudflare dashboard, navigate to **Workers & Pages** and select your newly deployed Worker.
2. Click on the **Settings** tab, then select **Triggers** from the sidebar.
3. Scroll down to the **Custom Domains** section and click **Add Custom Domain**.
4. Type in your domain name and click **Add Custom Domain**.

At this point, Cloudflare does a quick check. Because it already controls the DNS for the domain, it automatically injects the correct routing records to point your domain to the Worker. It also instantly provisions a free SSL certificate so the site is served securely over HTTPS. Within seconds, the domain goes active.

## The Result

So, that's the full stack: An AstroPaper static site, edited throug a CMS web UI, committed directly to GitHub, built with `pnpm`, deployed via Wrangler, and hosted on a custom domain on Cloudflare's global edge network. 

Fast, free, and completely automated. 

Not bad.

