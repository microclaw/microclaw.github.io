---
slug: /microclaw-vs-nanoclaw
title: "MicroClaw vs NanoClaw: A Practical Comparison"
authors: [microclaw]
tags: [architecture, rust, chat, agents]
---

MicroClaw was inspired by [NanoClaw](https://github.com/gavrielc/nanoclaw/). They share the same core idea: an AI assistant that can execute tools from chat.

This post compares the two projects from an engineering and product perspective, based on current public documentation.

<!-- truncate -->

## Scope note

The NanoClaw side of this comparison is based on its official README as of February 8, 2026. If NanoClaw changes later, some rows may evolve.

## Comparison table

| Dimension | NanoClaw | MicroClaw |
|---|---|---|
| Project orientation | Minimal, single-user, "small enough to understand" | Broader chat-agent feature set for practical daily use |
| Relationship | Original project | Inspired by NanoClaw and expanded for Rust + Telegram workflows |
| Default channel | WhatsApp-first | Telegram-first (with optional WhatsApp Cloud webhook support) |
| Multi-channel philosophy | Prefer transformation skills (for example `/add-telegram`) over built-in multi-channel complexity | Built as a chat-surface bot with Telegram as primary experience |
| Primary stack | Node.js + Claude Agent SDK + container runtime | Rust + Tokio + teloxide + reqwest |
| Model/provider strategy | Tied to Claude Code / Agent SDK workflow | Native Anthropic + OpenAI-compatible provider abstraction |
| Tool system | README describes major capabilities (web, scheduling, etc.) | Explicit tool registry with file, shell, web, memory, scheduler, export, sub-agent, todo, and skills tools |
| Agent execution loop | Agent runs through containerized Claude workflow | Explicit `tool_use` / `tool_result` loop with iteration cap |
| Security posture emphasis | OS-level isolation via Apple Container/Docker sandboxes | In-app tool authorization + deployment hardening strategies |
| Host access model | Commands run inside container with mounted scope | Commands/tools run in runtime environment; boundaries enforced by auth and ops controls |
| Persistence | SQLite | SQLite (messages, chats, sessions, scheduled tasks, etc.) |
| Session continuity | Persistent behavior implied; less emphasis on tool-block replay details in README | Full session resume including tool interaction context |
| Context compaction | Mentioned as a skill direction (`/add-clear`) | Built-in context compaction for oversized sessions |
| Memory structure | Per-group `CLAUDE.md` with isolation focus | Global + per-chat `AGENTS.md` scopes |
| Scheduler | Recurring task support | One-shot + cron recurring tasks with management tools |
| Sub-agent capability | Not explicitly documented in README | Built-in `sub_agent` with restricted tool set |
| Planning/todo tools | Not explicitly documented in README | Built-in todo read/write tools |
| Extensibility model | "Skills over features" is a core principle | Supports skill activation while also shipping broader built-in capabilities |
| Configuration philosophy | Fewer knobs; customize by code changes | Config-driven runtime with provider/model/authorization options |
| Deployment shape | Claude Code-centric + container requirements | Single-binary Rust deployment path (`cargo build --release`) |
| Best fit | Users who want container-isolated, minimal, deeply personalized forks | Users who want rich Telegram-native agent workflows with built-in operational features |

## Bottom line

NanoClaw optimizes for minimalism and container isolation first.

MicroClaw optimizes for built-in capability breadth and Telegram-first agent workflows.

Both are valid choices. The right one depends on whether your top priority is minimal isolated substrate (NanoClaw) or broader integrated functionality out of the box (MicroClaw).

## References

- NanoClaw repository: https://github.com/gavrielc/nanoclaw/
- NanoClaw README (raw): https://raw.githubusercontent.com/gavrielc/nanoclaw/main/README.md
- MicroClaw repository: https://github.com/microclaw/microclaw
- MicroClaw docs: https://microclaw.ai/docs/overview
