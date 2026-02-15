---
id: architecture
title: Architecture - Core Principles
sidebar_position: 9
---

This section explains how MicroClaw is designed for long-running agent workflows while staying maintainable as channels/tools/models grow.

## Design goals

- Platform-agnostic agent core: conversation + tool loop should not be tightly coupled to Telegram/Discord/Web handlers.
- Safe-by-default execution: tool permissions, risk levels, and explicit approval for dangerous operations.
- Durable state: sessions, messages, tasks, and memory persisted in SQLite/filesystem.
- Single-binary operations: no required Python runtime, predictable deployment model.
- Extensibility: MCP tools + local skills + built-in tools, with clear boundaries.

## High-level runtime flow

```text
Channel event -> Gateway adapter -> Agent engine -> LLM + Tools loop
                 |                                 |
                 v                                 v
           channel persistence               state + memory + sessions
```

## Core modules

- `core` (current: spread across `channels/*`, `tools/*`, `llm.rs`): agent loop, tool orchestration, context handling.
- `storage` (`db.rs`, memory files): chat/task/session persistence.
- `skills` (`skills.rs`, tool activation/sync): skill discovery and loading.
- `gateway/channel adapters` (`channels/telegram.rs`, `channels/discord.rs`, `channels/slack.rs`, `channels/feishu.rs`, `web.rs`): platform-specific ingress/egress.
- `channel boundary` (`channel.rs`, `channels/delivery.rs`): chat routing, dispatch policy, and per-channel delivery.
- `runtime` (`main.rs`, `runtime.rs`, `scheduler.rs`, `gateway.rs`, `doctor.rs`): process boot, background jobs, diagnostics.

## Recommended reading order

1. [Context Lifecycle](./architecture-context)
2. [Skills Architecture](./architecture-skills)
3. [MCP Architecture](./architecture-mcp)
4. [Channels and Gateway](./architecture-channels)
