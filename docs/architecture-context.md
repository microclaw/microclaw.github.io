---
id: architecture-context
title: Architecture - Context Lifecycle
sidebar_position: 10
---

Context quality determines agent quality. MicroClaw uses layered context management to keep long conversations useful and bounded.

## Context layers

- **Live turn context:** latest user input + immediate tool outputs.
- **Session history:** persisted conversation blocks (including tool_use/tool_result).
- **Compacted summary context:** when session grows beyond threshold.
- **File memory:** `AGENTS.md` global + per-chat memory (written by `write_memory` tool).
- **Structured memories:** rows extracted from the `memories` table by the background Reflector.

## Lifecycle

1. Load session from `sessions` table when available.
2. Append new user messages since `updated_at`.
3. Inject memory context: file memory (`AGENTS.md`) + structured memories from DB.
4. If message count exceeds `max_session_messages`, compact older blocks.
5. Run tool loop, then persist updated session state.

Structured memory injection is budgeted by `memory_token_budget` (default `1500`, estimated as `content.len()/4 + 10` per memory). When budget is hit, remaining rows are omitted and a summary suffix is appended.

## Background Reflector

Runs independently of the main chat loop every `reflector_interval_mins` (default 15 min). For each chat it tracks a cursor in `memory_reflector_state`, processes only unseen messages, calls the LLM to extract structured facts, validates categories, deduplicates, and persists to the `memories` table. This decouples memory extraction from model attention while avoiding repeated scans.

Dedup mode:

- semantic mode: `sqlite-vec` feature + runtime embedding config
- fallback mode: Jaccard similarity

See [Memory System](./memory) for details.

## Compaction strategy

- Keep recent messages verbatim (`compact_keep_recent`).
- Summarize older conversation into a compact summary block.
- Fallback to truncation if summarization fails.
- Strip large image payloads before session persistence.

## Structured-memory retrieval modes

At prompt build time, structured memories are ordered by:

- semantic KNN (`sqlite-vec` + configured embedding provider)
- fallback keyword relevance scoring (CJK-aware tokenizer) with recency tie-break

This preserves baseline behavior when semantic memory is not available.

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
