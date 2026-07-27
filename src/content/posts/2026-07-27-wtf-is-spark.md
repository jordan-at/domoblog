---
title: WTF is Spark
description: Run down of Spark & Fabric
pubDatetime: 2026-07-27T16:11:00Z
modDatetime: 2026-07-27T16:11:00Z
author: Jordan
featured: false
draft: false
hideEditPost: false
timezone: Australia/Brisbane
---
Spark is a language that provides distributed analysis and manipulation of big data. It serves as a sort of interface that we can use to run scripts/manipulations/transformation of data across many different languages. There is a controller, and a group of spark nodes that will perform the actual work. Probably the most familiar of those will be across Python or SQL (at least in my case).

Through Spark's language we can orchestrate scripts against Spark dataframes (think a pandas dataframe, but distributed), and even use notebooks!

I'm familiar with notebooks from when I was studying my Masters of Data Science at UQ, but basically it's a file that can hold one to many cells that contain code. You can run cells individually, or all at once, and it's awesome in terms of how user-friendly it makes the development process. You can have one cell for loading, another for selecting/debugging, another for ML/analysis, etc, and only rerun the cell you're currently working on. Markdown cells let the notebook double as its own documentation.

Even cooler: each cell can be a different language. I can query a Fabric lakehouse via Python with PySpark, but for my database-inclined friends, they can run the same query using SQL — same session, same dataframes underneath, just a `%%sql` or `%%pyspark` tag at the top of the cell telling it which language to interpret that cell as.

## Parquet and Delta,

I want to slow down on this bit because it clicked for me late, and I don't think a lot of Spark explainers actually spell it out.

**Parquet** is just a file format, the same category as CSV or JSON, but built for analytics. CSV stores data row by row — all of row 1, then all of row 2. Parquet stores it column by column instead — every value in "sales_amount" together, every value in "date" together. Most analytics queries only touch a handful of columns out of many ("total sales by region," not every field), so a column-oriented format lets Spark skip straight to the columns it needs instead of reading whole rows just to discard most of each one. It also compresses well, since a column of similar values squashes down nicely.

**Delta** takes that Parquet file and sits a transaction log next to it — a `_delta_log` folder full of JSON files recording every change ever made: this file was added, that one removed, these rows updated. Like a running edit history, similar to a git log but for data. That log is what actually gives you:

- **ACID transactions** — a write either fully completes or doesn't happen, so you never end up with half-written data
- **Time travel** — query the table as it looked yesterday, or roll back a bad write
- **Safe concurrent access** — reads and writes don't step on each other

So: Parquet is the data, sitting in efficient columnar files. Delta is the bookkeeping layer on top that turns "a folder full of files" into something that behaves like a proper, trustworthy table.

## Two SQLs, one table

Here's a genuinely confusing bit of Fabric worth naming directly: there are two completely separate ways to run SQL against the same Delta table, and they go through different engines entirely.

**Spark SQL** — a `%%sql` cell inside a notebook. This runs on your Spark session, same engine as your PySpark cells, just SQL syntax instead of Python.

**T-SQL via the SQL analytics endpoint** — every lakehouse auto-provisions a read-only SQL endpoint, powered by Polaris (the same engine behind the Fabric Data Warehouse). No Spark session involved at all — it reads the Delta logs directly to stay in sync. It's read-only: to actually write data, you're back to Spark.

Same underlying Delta/Parquet files, two genuinely different compute engines reading them. "SQL in Fabric" isn't one thing, it's two different query surfaces that happen to share a name.

## Capacity and sessions

A notebook session has to run somewhere, and that's Fabric capacity. Every workspace sits on a capacity tier (F2, F4, F8... up to F2048), which provisions the Spark compute your notebook borrows when it runs — either a default "starter pool" that spins up fast, or a custom pool if you need specific node sizes.

I've been running mine on an F2, the smallest tier — a sandbox, basically. It's genuinely enough to learn and build real things on, but it's also taught me firsthand that a small capacity means a small pool of Spark VCores to go around.

One more thing that tripped me up: Spark is lazy. Write a filter, a join, a groupBy, and nothing actually happens yet — Spark just builds up a plan, and only executes when you hit an action like `.show()`, `.display()`, or a write. Coming from pandas, where every line runs the instant you write it, this caught me out at first.

## On-the-fly visuals

You don't have to wait until Power BI to actually look at your data. Off a dataframe in a notebook, Fabric gives you a built-in chart view — click through and throw together a quick bar or line chart directly against that dataframe. It won't replace a proper Power BI report, but it means you can sanity-check a transformation visually before building anything downstream.

## A gotcha I actually hit this week

I built a test notebook, ran it manually, worked fine. Wired it into a pipeline as an "ingest sales data" step, ran the pipeline — and it just sat there. Not failed, not erroring, just spinning indefinitely.

Turned out the cause was almost embarrassingly simple: I had an old interactive PySpark job still hanging in my capacity from earlier testing. On an F2 SKU, the pool of Spark VCores is small, and that hanging session was quietly sitting on capacity my pipeline's notebook needed to start its own session. The pipeline wasn't broken — it was queued behind a job I'd forgotten was still technically running.

Cancelled the hanging job, re-ran the pipeline, worked immediately.

The lesson: "works when I run it manually, hangs from a pipeline" isn't necessarily a code problem — check what else is sitting in your capacity first. The Fabric Monitoring Hub shows every active Spark session across the workspace, and on a small SKU, a forgotten session can quietly starve out anything new that tries to spin up.

