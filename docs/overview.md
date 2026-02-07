---
id: overview
title: Overview
sidebar_position: 1
---

# MicroClaw

MicroClaw is a Rust Telegram bot that connects Claude to your chats with agentic tool execution. It can run shell commands, read and edit files, search codebases, browse the web, schedule tasks, and keep persistent memory across conversations. It is a Rust rewrite of nanoclaw (TypeScript/WhatsApp) with additional capabilities and a single-binary deployment model.

## What makes it different

- Agentic loop with tool execution, not just a single API call
- Full file system and shell tooling from inside Telegram
- Long-lived memory backed by CLAUDE.md files
- Built-in scheduler for cron and one-time tasks
- Group chat catch-up: reads all messages since last reply

## How it works

```
Telegram message
    |
    v
 Store in SQLite --> Load chat history + memory
                         |
                         v
                   Claude API (with tools)
                         |
                    stop_reason?
                   /            \
              end_turn        tool_use
                 |               |
                 v               v
           Send reply      Execute tool(s)
                              |
                              v
                        Feed results back
                        to Claude (loop)
```

MicroClaw enters an agentic loop for every message. Claude can call tools, inspect results, call more tools, and reason through multi-step tasks before responding. The loop is capped by `MAX_TOOL_ITERATIONS` for safety.

## Core capabilities

- Agentic tool use (bash, file I/O, glob, grep)
- Web search and fetch
- Scheduling with cron expressions
- Mid-conversation messaging for progress updates
- Persistent memory (global + per-chat)
- Typing indicator that stays active during tool use

Continue with the Quickstart to get a bot running in minutes.
