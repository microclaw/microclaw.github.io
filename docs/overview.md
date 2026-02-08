---
id: overview
title: Overview
sidebar_position: 1
---

# MicroClaw

MicroClaw is a Rust chat bot that connects LLM to your chats with agentic tool execution. It can run shell commands, read and edit files, search codebases, browse the web, schedule tasks, and keep persistent memory across conversations. It is a Rust rewrite of nanoclaw (TypeScript/WhatsApp) with additional capabilities and a single-binary deployment model.

## What makes it different

- Agentic loop with tool execution, not just a single API call
- Full file system and shell tooling from inside chat
- Long-lived memory backed by AGENTS.md files
- Built-in scheduler for cron and one-time tasks
- Group chat catch-up: reads all messages since last reply
- Multi-chat permission model (`control_chat_ids`) for cross-chat tool authorization
- Agent skills system with bundled skills (including macOS Apple Notes/Reminders/Calendar helpers)

## How it works

```
chat message
    |
    v
 Store in SQLite --> Load chat history + memory
                         |
                         v
                   LLM API (with tools)
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
                        to LLM (loop)
```

MicroClaw enters an agentic loop for every message. LLM can call tools, inspect results, call more tools, and reason through multi-step tasks before responding. The loop is capped by `MAX_TOOL_ITERATIONS` for safety.

## Core capabilities

- Agentic tool use (bash, file I/O, glob, grep)
- Web search, fetch, and browser automation
- Scheduling with cron expressions
- Mid-conversation messaging for progress updates
- Persistent memory (global + per-chat)
- Conversation archiving (automatic before compaction, manual via `/archive`)
- Typing indicator that stays active during tool use

Continue with the Quickstart to get a bot running in minutes.
