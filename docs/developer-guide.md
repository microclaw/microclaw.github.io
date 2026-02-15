---
id: developer-guide
title: Developer Guide
sidebar_position: 10
---

This guide summarizes the internal structure and extension points.

## Quick start

```sh
git clone <repo-url>
cd microclaw
cp microclaw.config.example.yaml microclaw.config.yaml
# Edit microclaw.config.yaml with your credentials
cargo run -- start
```

## Project structure

```
src/
    main.rs             # CLI entrypoint
    runtime.rs          # Runtime bootstrap + adapter startup
    channel.rs          # Chat routing + channel dispatcher orchestration
    channels/delivery.rs# Channel-specific text delivery clients
    channels/telegram.rs# Telegram adapter
    channels/discord.rs # Discord adapter
    channels/slack.rs   # Slack adapter (Socket Mode)
    channels/feishu.rs  # Feishu/Lark adapter (WS or webhook)
    config.rs           # Loads microclaw.config.yaml
    llm.rs              # Provider adapters (Anthropic/OpenAI-compatible/Codex)
    llm_types.rs        # Shared message/tool protocol types
    db.rs               # SQLite tables + queries
    memory.rs           # AGENTS.md memory manager
    scheduler.rs        # Background scheduler
    tools/              # Tool trait + implementations
```

## Key types

| Type | Location | Description |
|---|---|---|
| `AppState` | `runtime.rs` | Shared runtime state for all adapters |
| `Database` | `db.rs` | SQLite wrapper with `Mutex<Connection>` |
| `ToolRegistry` | `tools/mod.rs` | `Vec<Box<dyn Tool>>` dispatch |
| `LlmProvider` | `llm.rs` | Provider abstraction for Anthropic and OpenAI-compatible APIs |

## Adding a new tool

1. Create `src/tools/my_tool.rs`
2. Implement the `Tool` trait
3. Add `pub mod my_tool;` to `src/tools/mod.rs`
4. Register it in `ToolRegistry::new()`

If your tool needs shared state (Bot or Database), add a constructor and pass it in at registration time.

## Debugging

```sh
RUST_LOG=debug cargo run -- start
RUST_LOG=microclaw=debug cargo run -- start
```

## Build

```sh
cargo build
cargo build --release
cargo run -- start
```


## Extension tutorial

For a step-by-step extension workflow, see: [Skills + MCP Tutorial](./skills-mcp-tutorial).
