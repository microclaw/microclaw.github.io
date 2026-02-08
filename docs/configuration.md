---
id: configuration
title: Configuration
sidebar_position: 4
---

All configuration is via `microclaw.config.yaml`.

## Required

| Key | Description |
|---|---|
| `telegram_bot_token` | chat bot token from @BotFather |
| `api_key` | LLM API key |
| `bot_username` | Bot username without the `@` |

## Optional

| Key | Default | Description |
|---|---|---|
| `llm_provider` | `anthropic` | Provider preset ID (or custom ID). `anthropic` uses native Anthropic API, others use OpenAI-compatible API |
| `model` | provider-specific | Model name |
| `llm_base_url` | provider preset default | Optional custom base URL |
| `data_dir` | `./microclaw.data` | Data root (`runtime` data in `data_dir/runtime`, skills in `data_dir/skills`) |
| `max_tokens` | `8192` | Max tokens per LLM response |
| `max_tool_iterations` | `25` | Max tool-use loop iterations per message |
| `max_history_messages` | `50` | Number of recent messages sent as context |

## Supported `llm_provider` values

`openai`, `openrouter`, `anthropic`, `google`, `alibaba`, `deepseek`, `moonshot`, `mistral`, `azure`, `bedrock`, `zhipu`, `minimax`, `cohere`, `tencent`, `xai`, `huggingface`, `together`, `custom`.

## Setup wizard

Run:

```sh
microclaw setup
```

Features:
- interactive terminal UI
- provider/model list pickers (visible choices, not blind cycling)
- local + online validation
- safe `microclaw.config.yaml` write with backup

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
- `tencent`
- `xai`
- `huggingface`
- `together`
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
