---
id: architecture
title: Architecture
sidebar_position: 9
---

## Data flow

```
chat message
       |
       v
    Store in SQLite (message + chat metadata)
       |
       v
    Determine response: private=always, group=@mention only
       |
       v
    Start typing indicator (tokio::spawn, every 4s)
       |
       v
    Load history:
       - Private: last N messages
       - Group: all messages since last bot response
       |
       v
    Build system prompt (bot identity + memory context + chat_id)
       |
       v
    Agentic loop (up to MAX_TOOL_ITERATIONS):
       1. Call LLM API with messages + tool definitions
       2. If stop_reason == "tool_use" -> execute tools -> append results -> loop
       3. If stop_reason == "end_turn" -> extract text -> return
       |
       v
    Abort typing indicator
       |
       v
    Send response (split if > 4096 chars)
       |
       v
    Store bot response in SQLite
```

## Key modules

```
src/
    main.rs          # CLI entry point
    config.rs        # Environment variable loading
    error.rs         # Error types
    telegram.rs      # Message handler + agent loop
    claude.rs        # Anthropic API client
    db.rs            # SQLite tables + queries
    memory.rs        # CLAUDE.md memory system
    scheduler.rs     # Background scheduler
    tools/           # Tool trait + implementations
```

## Agentic loop

The core logic lives in `process_with_claude`:

1. Load history and memory
2. Call LLM with tool definitions
3. If `stop_reason` is `tool_use`, run tools and feed results back
4. If `end_turn`, return the text response

The loop is capped to prevent infinite tool chains.
