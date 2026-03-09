---
id: roadmap
title: Roadmap
sidebar_position: 15
---

This roadmap reflects current priorities. Items may shift as the project evolves.

## Short term

- Permission model or allowlist for tool execution
- Tool execution sandboxing
- Improved error reporting and observability
- More robust web fetch parsing

## Mid term

- Parallel tool execution within a single turn
- Optional streaming responses
- Better group mention detection and quoting
- Optional web UI console
- Sub-agent orchestration hardening (task contracts, timeout/cancel controls, and clearer result shaping)

## Long term

- Multimodal input (images, documents)
- Pluggable tool marketplace
- Multi-agent orchestration

## Sub-agent track

- Now: ship `sessions_spawn` + `subagents_list/info/kill` as session-native asynchronous runs with status tracking and cancellation
- Next: harden parent/child handoff contracts and improve delivery reliability for completion announcements
- Later: add orchestrator patterns (nested depth, fan-out/fan-in), thread binding, and richer observability
