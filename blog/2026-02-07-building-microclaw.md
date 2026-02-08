---
slug: /building-microclaw
title: "Introducing MicroClaw: An Agentic AI Assistant for Telegram"
authors: [microclaw]
tags: [architecture, rust, telegram, agents]
---

MicroClaw is a Rust-based AI assistant that lives directly in your Telegram chats. Instead of only answering text prompts, it can use tools to complete multi-step tasks: run shell commands, read and edit files, search code, browse the web, schedule jobs, and keep persistent memory.

This post is a short project introduction: what MicroClaw is, how it works, and why the architecture is built this way.

<!-- truncate -->

## What problem it solves

Most chat bots are single-turn wrappers around an LLM API: send user text in, send model text out.

MicroClaw uses an agent loop. For each user message, the model can:

1. Decide whether to answer directly or call a tool
2. Execute one or more tools
3. Read tool results
4. Continue iterating until the task is complete

That loop turns chat from Q&A into execution.

## Core capabilities

- Tool execution in chat (`bash`, file ops, `glob`, `grep`, web tools)
- Session resume with full tool-call context persisted in SQLite
- Context compaction when sessions grow large
- Persistent memory via global and per-chat `CLAUDE.md`
- Scheduled tasks (one-shot and cron)
- Sub-agent execution with a restricted tool set

## High-level architecture

At a high level, each message flows through the same pipeline:

1. Store message in SQLite
2. Load session/history + memory
3. Call LLM with tool definitions
4. If tool use is requested, execute tool and loop
5. When LLM ends turn, return response to chat

The same agent loop is reused by the scheduler, so scheduled jobs can also use tools and reasoning.

## Why Rust

MicroClaw is written in Rust for operational simplicity and reliability:

- Single binary deployment (`cargo build --release`)
- Strong typing for message blocks (`text`, `tool_use`, `tool_result`)
- Clear shared-state boundaries (`Arc<Database>`)
- Predictable async runtime behavior with Tokio

## Project status

MicroClaw is under active development. Current focus areas are improving onboarding, hardening runtime safety defaults, and making multi-chat operations more robust.

If you want to explore the full docs, start here:

- https://microclaw.ai/docs/overview
- https://microclaw.ai/docs/architecture
- https://microclaw.ai/docs/tools
