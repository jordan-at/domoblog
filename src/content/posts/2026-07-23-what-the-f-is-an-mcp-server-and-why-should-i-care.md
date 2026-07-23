---
title: What the f*** is an MCP server and why should I care
description: Tokenmaxxing to the max
pubDatetime: 2026-07-23T13:33:00Z
modDatetime: 2026-07-23T13:33:00Z
author: Jordan
featured: true
draft: false
tags:
  - MCP
  - AI
  - PowerBI
  - Fabric
hideEditPost: false
timezone: Australia/Brisbane
---
Every few months something arrives that the internet decides is either the future or a scam, with no middle ground. MCP is currently taking its turn. So let's cut through it: what is an MCP server actually doing, and is it worth wiring into your workflow?

## The short version

An MCP (Model Context Protocol) server is a program that exposes a list of tools to a language model, described in JSON Schema. That's genuinely most of it.

The model asks the server "what can you do?" The server replies with a manifest — a list of tool names, descriptions, and typed input schemas. The model reads that, decides which tool fits the task, and emits a structured call. The server executes it against the real system and hands back a result.

A tool definition looks roughly like this:

```json
{
  "name": "run_dax_query",
  "description": "Execute a DAX query against a semantic model and return the result set.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "database": {
        "type": "string",
        "description": "Name of the semantic model to query."
      },
      "query": {
        "type": "string",
        "description": "The DAX query to execute."
      }
    },
    "required": ["database", "query"]
  }
}

```

The model never touches your data directly. It writes a function call; the server does the work. Auth, connection strings, and permissions stay on the server side where they belong.

## So it's just function calling with extra steps?

Sort of, and that's the point. Function calling already existed — every vendor had their own flavour of it, which meant every integration was bespoke. Write a Power BI tool for one client, rewrite it for another.

MCP is the standardisation layer. Same transport, same schema format, same discovery handshake, regardless of which model or client is on the other end. It's the same reason ODBC mattered more than any individual database driver. Boring infrastructure that stops you writing the same adapter fifteen times.

If you've spent time in the Microsoft ecosystem you'll recognise the shape of this immediately. It's a contract-first interface definition. We've been doing this for decades.

## Is it a fad to generate more tokens?

**The case for cynicism:** MCP servers do consume tokens. Tool manifests get injected into context on every request. A bloated MCP server with forty tools and verbose descriptions can eat a meaningful chunk of your context window before you've asked anything. Some servers return enormous unfiltered blobs — dump a full model schema into context and you've burned thousands of tokens to answer one question. And yes, the companies selling inference are also the ones promoting the protocol. That's a real alignment problem worth noticing.

**The case against:** the alternative is worse. Without tool access, the model guesses. Ask it about your semantic model and it will invent plausible table names with total confidence. You then spend your own tokens — and your own time — correcting it. Grounding the model in real system state usually costs *fewer* tokens than the correction loop it replaces.

The honest answer sits in the middle. MCP is a genuinely useful pattern with a real token cost that gets worse when servers are badly designed. The fix isn't rejecting the protocol, it's being selective about which servers you load and how much they return. Turn off what you're not using. A well-scoped server with focused tools is cheap; a kitchen-sink server that dumps everything is expensive. That's a design problem, not a protocol problem.

## How I actually use it

Two cases, one live and one starting.

### Power BI modelling

The Power BI MCP server connects a model directly to semantic models in Fabric or Power BI Desktop. Tools cover the things you'd otherwise click through: inspecting tables, columns, relationships, measures, running DAX queries, editing model objects, managing calculation groups and roles.

The value isn't "AI writes my measures." It's that the model can *see the model*. Before MCP, helping with a DAX problem meant pasting schema fragments into a chat window and hoping I'd included the relevant relationship. Now it reads the actual structure — cardinality, filter direction, existing measures — and reasons against reality instead of my description of reality.

Where this earns its keep for me:

- **Auditing inherited models.** Walking through relationships and measure dependencies on a model someone else built, faster than clicking through the modelling view.
- **Debugging DAX.** Running a query, seeing the actual result, iterating. The feedback loop tightens considerably.
- **Consistency passes.** Naming conventions, missing descriptions, format strings — tedious to check manually, quick to enumerate programmatically.

What it doesn't do: replace understanding your data model. It's a faster way to interrogate a model you already need to understand. Treat its output as a draft that needs review, especially anything that writes.

### DP-700 study

The next experiment is Microsoft Learn's MCP server for DP-700 (Implementing Data Engineering Solutions Using Microsoft Fabric) prep.

The problem with asking a model about Fabric is that Fabric changes constantly. Training cutoffs mean confident answers about features that have been renamed, deprecated, or replaced. For an exam graded on *current* behaviour, that's a real risk — you'll study something plausible and wrong.

Pointing the model at Microsoft Learn as a live source changes the failure mode. It retrieves from current official documentation rather than recalling documentation as it existed months ago. The plan:

- Generate practice questions grounded in the actual skills-measured outline rather than a hallucinated version of it.
- Query specific behaviours — Spark job definitions, pipeline orchestration, medallion patterns in Lakehouse — and get answers with citations I can follow.
- Use the citation trail as the actual study path. The answer is the index; the linked doc is the material.

The failure mode to watch for is obvious in hindsight: it's very easy to feel productive reading generated summaries and never build the hands-on ability the exam actually tests. Retrieval solves accuracy, not competence. I'll report back on whether that discipline holds.  

I would be worried about this but it's pretty easy to spin up your own Azure tenant to mess around with, and the free account gives you 200$ credit off rip. Personally, I am playing around with a cheap instance of fabric with an entry SKU that I can pause whenever I am not using it.

## Where I've landed

MCP is a JSON-schema-shaped contract between a model and a system, standardised so you write the integration once. That's the whole idea, and it's a good one.

It costs tokens. Badly built servers cost a lot of tokens. But the pattern solves a problem that genuinely existed, and the alternative — a model confidently guessing at your infrastructure — costs more in rework than it saves in context.

I'd hold it loosely. The protocol will likely change, the current crop of servers will be superseded, and something will replace the name. But the underlying idea — models calling typed, discoverable tools against real systems instead of pattern-matching from memory is something that will be here for the near future.