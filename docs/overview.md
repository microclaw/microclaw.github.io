---
id: overview
title: Overview
sidebar_position: 1
---

# MicroClaw

MicroClaw is a Rust multi-channel agent runtime for Telegram, Discord, Slack, Feishu/Lark, IRC, Web, and ACP-connected local clients. It combines one shared agent loop, one provider abstraction, persistent memory, background scheduling, and a local web control plane in a single binary.

## What makes it different

- Channel-agnostic agent loop instead of separate bot implementations per surface
- Session-native subagents with both native and ACP-backed external runtimes
- Long-lived memory backed by `AGENTS.md` files plus structured SQLite memory
- Built-in scheduler for cron and one-time tasks
- Multi-chat permission model (`control_chat_ids`) for cross-chat tool authorization
- Skills, MCP tool federation, and a local web operator API
- Config self-check and observability surfaces for operational drift
- Customizable personality via `SOUL.md` files (global + per-chat)

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

MicroClaw enters an agentic loop for every message. LLM can call tools, inspect results, call more tools, and reason through multi-step tasks before responding. The same loop also powers resumed sessions, background subagents, and ACP-connected clients. The loop is capped by `max_tool_iterations` for safety.

## Core capabilities

- Agentic tool use (bash, file I/O, glob, grep)
- Web search, fetch, and browser automation
- Scheduling with cron expressions
- ACP stdio server mode plus ACP-backed external subagent workers
- Mid-conversation messaging for progress updates
- Persistent memory (global + per-chat)
- Structured memory with reflector extraction, dedupe, and observability
- Personality customization via SOUL.md
- Conversation archiving (automatic before compaction, manual via `/archive`)
- Typing indicator that stays active during tool use
- Local Web UI with session controls, config editing, and self-checks

Continue with the Quickstart to get a bot running in minutes.
