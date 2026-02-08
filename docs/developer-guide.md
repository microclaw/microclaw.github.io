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
    main.rs          # CLI, bootstraps app
    config.rs        # Loads microclaw.config.yaml
    error.rs         # MicroClawError
    telegram.rs      # Message handler + agent loop
    claude.rs        # Anthropic Messages API client
    db.rs            # SQLite tables + queries
    memory.rs        # AGENTS.md memory manager
    scheduler.rs     # Background scheduler
    tools/           # Tool trait + implementations
```

## Key types

| Type | Location | Description |
|---|---|---|
| `AppState` | `telegram.rs` | Shared config, bot, db, memory, tools |
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
