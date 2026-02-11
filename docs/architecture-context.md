---
id: architecture-context
title: Architecture - Context Lifecycle
sidebar_position: 10
---

Context quality determines agent quality. MicroClaw uses layered context management to keep long conversations useful and bounded.

## Context layers

- Live turn context: latest user input + immediate tool outputs.
- Session history: persisted conversation blocks (including tool_use/tool_result).
- Compacted summary context: when session grows beyond threshold.
- Long-term memory: `AGENTS.md` global + per-chat memory.

## Lifecycle

1. Load session from `sessions` table when available.
2. Append new user messages since `updated_at`.
3. Inject memory context (`global` + `chat`).
4. If message count exceeds `max_session_messages`, compact older blocks.
5. Run tool loop, then persist updated session state.

## Compaction strategy

- Keep recent messages verbatim (`compact_keep_recent`).
- Summarize older conversation into a compact summary block.
- Fallback to truncation if summarization fails.
- Strip large image payloads before session persistence.

## Sub-agent inheritance and isolation

Current model:

- Sub-agent gets restricted tool registry.
- No recursive sub-agent calls.
- No side-effect scheduling/memory-write/send-message tools.

Recommended next step:

- Explicit inheritance policy by field (`history`, `memory`, `tool results`, `working_dir`).
- Context provenance markers in debug output.

## Debugging context behavior

Use:

- `RUST_LOG=debug cargo run -- start`
- Web stream/tool events for per-iteration tool traces.
- `microclaw doctor` for environment/dependency issues that often masquerade as context problems.
