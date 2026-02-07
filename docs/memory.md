---
id: memory
title: Memory System
sidebar_position: 7
---

MicroClaw keeps persistent memory in `CLAUDE.md` files and injects that content into the system prompt on every request.

## Scopes

```
data/groups/
    CLAUDE.md                 # Global memory (shared across all chats)
    {chat_id}/
        CLAUDE.md             # Per-chat memory
```

## How it works

- Claude can read and write memory using `read_memory` and `write_memory`
- Memory is wrapped in `<global_memory>` and `<chat_memory>` tags
- The memory files live under `DATA_DIR` (default `./data`)

## Example

```
You: Remember that I prefer Rust examples
Bot: Saved to chat memory.

[Later]
You: Give me a code sample
Bot: [prefers Rust]
```
