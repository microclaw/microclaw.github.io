---
id: memory
title: Memory System
sidebar_position: 7
---

MicroClaw has two complementary memory systems that are both injected into the system prompt on every request.

## File memory (AGENTS.md)

Manually written key-value style notes in `AGENTS.md` files. The LLM writes these via the `write_memory` tool.

```
microclaw.data/runtime/groups/
    AGENTS.md                 # Global memory (shared across all chats)
    {chat_id}/
        AGENTS.md             # Per-chat memory
```

- LLM can read and write memory using `read_memory` and `write_memory`
- Memory is wrapped in `<global_memory>` and `<chat_memory>` tags
- The memory files live under `DATA_DIR/runtime` (default `./microclaw.data/runtime`)
- `write_memory` to `scope: "global"` requires the caller chat to be in `control_chat_ids`
- `write_memory` also persists a structured memory row into SQLite (`memories` table)
- Explicit commands like `remember ...` / `记住...` also use a deterministic fast path into structured memory

## Chat identity mapping

SQLite stores chats with two identities:

- `chat_id`: internal primary key used by sessions/messages/tasks
- `channel + external_chat_id`: source identity from Telegram/Discord/Web

This prevents cross-channel collisions when numeric IDs overlap. Existing databases are migrated automatically at startup. Structured memories also store `chat_channel` and `external_chat_id` for easier debugging.

## Reflector (structured memories)

A background process that automatically extracts and persists structured memories from conversations — independently of the main chat loop.

As sessions grow longer, the model tends to deprioritize voluntary `write_memory` calls. The Reflector runs on a timer and extracts memories without relying on the model to remember to do so.

**How it works:**

1. Every `reflector_interval_mins` minutes (default 15), the Reflector scans recently-active chats
2. Per chat, it reads messages incrementally from a persisted cursor (`memory_reflector_state`) instead of rescanning full windows
3. It calls the LLM directly and extracts durable facts with strict category validation (`PROFILE`, `KNOWLEDGE`, `EVENT`)
4. Extracted memories are stored in SQLite (`memories`)
5. Dedup strategy:
   - with `sqlite-vec` feature + runtime embedding configured: semantic nearest-neighbor check (cosine distance)
   - otherwise: Jaccard overlap fallback
6. Quality gate:
   - low-signal / uncertain snippets are filtered before writing
7. Lifecycle:
   - rows track confidence + last-seen
   - stale low-confidence rows can be soft-archived

**Memory categories:**

| Category | Description |
|---|---|
| `PROFILE` | User attributes and preferences |
| `KNOWLEDGE` | Facts and areas of expertise |
| `EVENT` | Significant things that happened |

**Injected in system prompt as:**

```
<structured_memories>
[PROFILE] [chat] User is a Rust developer based in Tokyo
[KNOWLEDGE] [chat] User prefers functional programming style
</structured_memories>
```

**Configuration:**

```yaml
reflector_enabled: true         # enable/disable background reflector
reflector_interval_mins: 15     # how often to run (minutes)
memory_token_budget: 1500       # structured-memory injection budget

# optional semantic memory runtime config (requires --features sqlite-vec build)
# embedding_provider: "openai"  # openai | ollama
# embedding_api_key: "..."
# embedding_base_url: "..."
# embedding_model: "text-embedding-3-small"
# embedding_dim: 1536
```

Both can be changed via the setup wizard (`microclaw setup`) or the Web UI settings panel.

When `memory_token_budget` is exceeded during prompt construction, MicroClaw stops adding memories and appends `(+N memories omitted)`.

## Semantic memory behavior

Two-level safety model:

- Compile-time: `sqlite-vec` feature is **off by default**
- Runtime: `embedding_provider` is **unset by default**

Runtime outcomes:

- `sqlite-vec` enabled + embedding configured: semantic KNN retrieval and semantic dedup
- `sqlite-vec` enabled + embedding not configured: vector table may exist but retrieval/dedup still falls back
- `sqlite-vec` disabled: keyword retrieval + Jaccard dedup (stable baseline)

## Memory observability

MicroClaw records memory operations for diagnostics:

- `memory_reflector_runs`: per-run extracted/inserted/updated/skipped counts
- `memory_injection_logs`: candidate/selected/omitted counts during prompt injection

You can inspect these from:

- `/usage` output (text summary)
- Web UI → **Usage Panel** → **Memory Observability** cards

The panel highlights:

- memory pool health (active/archived/low-confidence)
- reflector throughput in last 24h
- injection coverage (`selected / candidates`) in last 24h

## Example

```
You: Remember that I prefer Rust examples
Bot: Noted. Saved memory #123: I prefer Rust examples.

[15 minutes later, automatically]
Reflector: extracted "User prefers Rust code examples" → memories table

[Next session after /reset]
Bot: [has both AGENTS.md + structured memories in context]
```
