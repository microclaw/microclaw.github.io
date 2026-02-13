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

## Reflector (structured memories)

A background process that automatically extracts and persists structured memories from conversations — independently of the main chat loop.

As sessions grow longer, the model tends to deprioritize voluntary `write_memory` calls. The Reflector runs on a timer and extracts memories without relying on the model to remember to do so.

**How it works:**

1. Every `reflector_interval_mins` minutes (default 15), the Reflector scans recently-active chats
2. It calls the LLM directly with the last 30 messages and asks it to extract durable facts
3. Extracted memories are stored in the `memories` SQLite table (not in AGENTS.md)
4. Duplicates are filtered using Jaccard word-overlap before inserting

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
```

Both can be changed via the setup wizard (`microclaw setup`) or the Web UI settings panel.

## Example

```
You: Remember that I prefer Rust examples
Bot: Saved to chat memory.         # write_memory (file memory)

[15 minutes later, automatically]
Reflector: extracted "User prefers Rust code examples" → memories table

[Next session after /reset]
Bot: [has both AGENTS.md + structured memories in context]
```
