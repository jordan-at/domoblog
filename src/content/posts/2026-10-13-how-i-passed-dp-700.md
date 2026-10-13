---
title: How I passed DP-700 without using Fabric at work
description: Studying for the Fabric Data Engineer exam when your day job is Power BI reports, not lakehouses
pubDatetime: 2026-10-13T12:10:00Z
modDatetime: 2026-10-13T12:10:00Z
author: Jordan
featured: false
draft: true
hideEditPost: false
timezone: Australia/Brisbane
tags: ["fabric", "certification", "data-engineering"]
---

On 12 August I passed DP-700, Microsoft's Fabric Data Engineer Associate exam, with a 740. The pass mark is 700, so it wasn't a blowout, but a pass is a pass.

The interesting part for me is that I don't do Fabric data engineering at work. My production experience is Power BI: reports, DAX, data modelling, Power Query, gateways, workspaces and refresh management. Lakehouses, notebooks, PySpark, pipelines and capacity management were all things I'd only touched in my own lab. So this is less "how to pass" and more how I closed the gap between what I do day to day and what the exam expects.

## Why bother

I hold PL-300 already, which covers the analyst side. I want to move towards data engineering, and eventually solutions architecture, and DP-700 is the cert that says you understand the layer underneath the reports. It also forced me to properly learn the parts of Fabric I'd been skimming past.

## Lab first, reading second

I learn by building things myself. I tried letting an AI agent drive a lab for me on another platform once, and it was useless for learning. The agent learned it and I watched. So for DP-700 I built it by hand in a Fabric trial:

- A lakehouse, loading files into it and turning them into Delta tables
- Notebooks in PySpark and Spark SQL, mixing languages cell by cell
- Dataflows Gen2, which I knew the idea of from Gen1 at work but had never used
- Querying the same tables through the SQL analytics endpoint

Doing it by hand is what made the theory stick. I wrote up a lot of what I learned about Spark, Parquet and Delta in [WTF is Spark](/posts/2026-07-27-wtf-is-spark/), so I won't repeat it here.

**TODO(Jordan): add anything else you built in the lab, e.g. pipelines, warehouse, eventstreams, real-time intelligence.**

## Where the gaps were

Coming from Power BI, the reporting and modelling side of the exam felt familiar. The engineering side didn't, and that's where most of my study time went.

**TODO(Jordan): which sections were hardest? Real-time intelligence/KQL, security and governance, monitoring and optimisation, or something else? One or two sentences on each is plenty.**

## Using the Microsoft Learn MCP server

I mentioned in my MCP post that I wanted to try Microsoft Learn's MCP server for study. The idea is that Claude can search and quote the actual Learn documentation instead of answering from memory, which matters for an exam where the details change as Fabric updates.

**TODO(Jordan): did you end up using it, and was it useful? If not, cut this section.**

## Exam day

**TODO(Jordan): online or test centre, how the time went, case studies, anything you'd warn someone about.**

## If you're in the same spot

If your job is Power BI and you're eyeing DP-700, the biggest thing I'd say is not to rely on your reporting experience to carry you. It covers less of the exam than you'd think. Spin up a trial, build a lakehouse end to end yourself, break it, and fix it. The lab is where it clicked for me, not the reading.
