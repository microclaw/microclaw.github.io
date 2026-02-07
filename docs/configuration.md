---
id: configuration
title: Configuration
sidebar_position: 4
---

All configuration is via environment variables or a `.env` file.

## Required

| Variable | Description |
|---|---|
| `TELEGRAM_BOT_TOKEN` | chat bot token from @BotFather |
| `LLM_API_KEY` | LLM API key (`ANTHROPIC_API_KEY` also accepted for backward compatibility) |
| `BOT_USERNAME` | Bot username without the `@` |

## Optional

| Variable | Default | Description |
|---|---|---|
| `LLM_PROVIDER` | `anthropic` | Provider preset ID (or custom ID). `anthropic` uses native Anthropic API, others use OpenAI-compatible API |
| `LLM_MODEL` | provider-specific | Model name (`CLAUDE_MODEL` fallback supported) |
| `LLM_BASE_URL` | provider preset default | Optional custom base URL |
| `DATA_DIR` | `./data` | Directory for SQLite DB and memory files |
| `MAX_TOKENS` | `8192` | Max tokens per LLM response |
| `MAX_TOOL_ITERATIONS` | `25` | Max tool-use loop iterations per message |
| `MAX_HISTORY_MESSAGES` | `50` | Number of recent messages sent as context |

## Setup wizard

Run:

```sh
microclaw setup
```

Features:
- interactive terminal UI
- provider/model list pickers (visible choices, not blind cycling)
- local + online validation
- safe `.env` write with backup

Preset providers in setup wizard:
- `openai`
- `openrouter`
- `anthropic`
- `google`
- `alibaba`
- `deepseek`
- `moonshot`
- `mistral`
- `azure`
- `bedrock`
- `zhipu`
- `minimax`
- `cohere`
- `baidu`
- `tencent`
- `huawei`
- `xai`
- `huggingface`
- `together`
- `perplexity`
- `custom`

## Logging

Enable debug logging with:

```sh
RUST_LOG=debug microclaw start
```

Limit to MicroClaw logs:

```sh
RUST_LOG=microclaw=debug microclaw start
```
