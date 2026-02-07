---
id: configuration
title: Configuration
sidebar_position: 4
---

All configuration is via environment variables or a `.env` file.

## Required

| Variable | Description |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Telegram bot token from @BotFather |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `BOT_USERNAME` | Bot username without the `@` |

## Optional

| Variable | Default | Description |
|---|---|---|
| `CLAUDE_MODEL` | `claude-sonnet-4-20250514` | Claude model to use |
| `DATA_DIR` | `./data` | Directory for SQLite DB and memory files |
| `MAX_TOKENS` | `8192` | Max tokens per Claude response |
| `MAX_TOOL_ITERATIONS` | `25` | Max tool-use loop iterations per message |
| `MAX_HISTORY_MESSAGES` | `50` | Number of recent messages sent as context |

## Logging

Enable debug logging with:

```sh
RUST_LOG=debug microclaw start
```

Limit to MicroClaw logs:

```sh
RUST_LOG=microclaw=debug microclaw start
```
