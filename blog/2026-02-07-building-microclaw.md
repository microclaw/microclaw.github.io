---
slug: /building-microclaw
title: "Building MicroClaw: A Practical Agentic Assistant for Telegram"
authors: [microclaw]
tags: [architecture, rust, telegram, agents]
---

MicroClaw is a Rust-based AI assistant that lives directly in your chats. It is built for one specific goal: turn chat into a reliable execution surface, not just a text interface.

MicroClaw can run shell commands, read and edit files, search code, browse the web, schedule recurring tasks, and maintain persistent memory. It is Telegram-first today, with optional WhatsApp and Discord paths, and it is designed to stay understandable as it grows.

This post is a full introduction to the project: where the idea came from, what design decisions shaped it, and how the architecture works in practice.

<!-- truncate -->

## Where the Idea Came From

MicroClaw was inspired by two things happening at the same time:

1. The rise of **NanoClaw**, which proved that personal AI assistants should be understandable, self-hostable, and opinionated.
2. The release wave around **Claude Opus 4.6**, which made long-context, tool-heavy assistant workflows feel much more practical for real daily use.

NanoClaw showed that small and focused systems can be powerful. Opus 4.6 showed that model capability had reached a point where multi-step reasoning with tools could be trustworthy enough to build on.

MicroClaw started as a question:  
Can we keep the spirit of NanoClaw, but build a Telegram-first assistant in Rust with stronger session continuity, operational stability, and practical built-ins?

The answer became this project.

## The Problem MicroClaw Solves

Most chat bots are still single-turn wrappers:

- user sends text
- model returns text
- conversation state is shallow
- no durable execution context

That is fine for Q&A, but weak for real work.

MicroClaw treats each message as an **agentic task loop**. For each incoming message, the model can:

1. Decide whether to answer directly or use tools
2. Execute one or more tools
3. Read tool outputs
4. Keep iterating until the task is done
5. Persist the state for the next turn

This turns chat from “ask and answer” into “plan, execute, and continue.”

## What Makes MicroClaw Different

MicroClaw is designed around four practical requirements.

### 1) Durable conversations, not stateless prompts

Sessions are persisted in SQLite with full tool context (`tool_use` and `tool_result` blocks).  
When a new message arrives, the assistant can resume from real prior execution state, not just a truncated chat summary.

### 2) Memory that can evolve over time

MicroClaw supports global and per-chat `CLAUDE.md` memory.  
The assistant can read and update memory through tools, so preferences and project context survive across days or weeks.

### 3) Operational features built in

It includes production-relevant features out of the box:

- context compaction for oversized sessions
- scheduled one-shot and recurring tasks
- continuous typing indicator during long tool loops
- group catch-up behavior for mention-based activation
- message splitting for platform limits

### 4) Controlled delegation

MicroClaw includes a `sub_agent` tool that launches a restricted inner agent with a reduced tool set.  
This allows decomposition of complex work while keeping clear safety boundaries.

## Core Capabilities

- Chat-native tool execution (`bash`, file operations, `glob`, `grep`, web search/fetch)
- Persistent session resume including tool interaction history
- Context compaction for long-running sessions
- Global + per-chat persistent memory via `CLAUDE.md`
- Scheduler for cron and one-time tasks
- Skill activation for domain-specific instructions
- Todo/plan tools for structured multi-step execution
- Optional cross-surface integrations (Telegram-first, plus optional WhatsApp/Discord)

## High-level architecture

At a high level, every message follows the same execution path:

1. Store message in SQLite
2. Load session state, recent history, and memory
3. Call LLM with tool definitions
4. If `tool_use` is requested, execute tool(s) and loop
5. If `end_turn`, send response and persist updated session

The scheduler reuses this same loop.  
That means scheduled tasks are not “dumb reminders” but full agent invocations with tools, reasoning, and memory access.

## Why Rust

MicroClaw is written in Rust for reliability and operational clarity:

- Single binary deployment (`cargo build --release`)
- Strong typing for protocol/message block structures
- Explicit shared-state boundaries (`Arc<Database>`)
- Predictable async behavior via Tokio
- Lower accidental complexity in long-running bot processes

Rust is not used for novelty. It is used because this project is a long-lived process that handles concurrency, persistence, and external APIs continuously.

## Design Principles

MicroClaw follows a few strict rules:

- **Execution-first**: a useful assistant must do work, not only generate text.
- **State is a feature**: preserving session and memory quality is as important as model quality.
- **Simple core, practical edges**: keep architecture small, but include features needed in real daily workflows.
- **Safety by layers**: combine tool-level checks, chat access controls, and deployment hardening.
- **Composable growth**: add capabilities via tools and skills without breaking the core loop.

## Example Workflows

Here are the kinds of tasks MicroClaw is designed for:

- “Search this repo for API breaking changes and draft release notes.”
- “Every weekday at 9am, send me an AI news briefing from selected sources.”
- “Read this error log, find likely root causes, and propose fixes.”
- “Remember that I prefer concise responses and Rust code examples.”
- “Break this migration into a todo plan and execute step by step.”

These are not one-shot prompts. They are iterative workflows with context and state.

## Project status

MicroClaw is under active development. Current priorities are:

1. Stronger default safety boundaries for tool execution
2. Better multi-channel consistency across Telegram/WhatsApp/Discord
3. Better observability for scheduler/session/tool failures
4. Smoother onboarding and configuration UX

If you want to explore the full docs, start here:

- https://microclaw.ai/docs/overview
- https://microclaw.ai/docs/architecture
- https://microclaw.ai/docs/tools
- Source code: https://github.com/microclaw/microclaw
