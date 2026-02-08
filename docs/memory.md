---
id: memory
title: Memory System
sidebar_position: 7
---

MicroClaw keeps persistent memory in `AGENTS.md` files and injects that content into the system prompt on every request.

## Scopes

```
microclaw.data/runtime/groups/
    AGENTS.md                 # Global memory (shared across all chats)
    {chat_id}/
        AGENTS.md             # Per-chat memory
```

## How it works

- LLM can read and write memory using `read_memory` and `write_memory`
- Memory is wrapped in `<global_memory>` and `<chat_memory>` tags
- The memory files live under `DATA_DIR/runtime` (default `./microclaw.data/runtime`)
- `write_memory` to `scope: "global"` requires the caller chat to be in `control_chat_ids`

## Example

```
You: Remember that I prefer Rust examples
Bot: Saved to chat memory.

[Later]
You: Give me a code sample
Bot: [prefers Rust]
```
