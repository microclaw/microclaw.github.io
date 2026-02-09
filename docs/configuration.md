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
| `api_key` | LLM API key (`ollama` can be empty) |
| `bot_username` | Bot username without the `@` |

## Optional

| Key | Default | Description |
|---|---|---|
| `llm_provider` | `anthropic` | Provider preset ID (or custom ID). `anthropic` uses native Anthropic API, others use OpenAI-compatible API |
| `model` | provider-specific | Model name |
| `llm_base_url` | provider preset default | Optional custom base URL |
| `data_dir` | `./microclaw.data` | Data root (`runtime` data in `data_dir/runtime`, skills in `data_dir/skills`) |
| `working_dir` | `./tmp` | Default working directory for `bash/read_file/write_file/edit_file/glob/grep`; relative paths resolve from here |
| `max_tokens` | `8192` | Max tokens per LLM response |
| `max_tool_iterations` | `100` | Max tool-use loop iterations per message |
| `max_history_messages` | `50` | Number of recent messages sent as context |
| `control_chat_ids` | `[]` | Chat IDs allowed to perform cross-chat tool actions |
| `max_session_messages` | `40` | Message threshold that triggers context compaction |
| `compact_keep_recent` | `20` | Number of recent messages kept verbatim during compaction |

## Supported `llm_provider` values

`openai`, `openrouter`, `anthropic`, `ollama`, `google`, `alibaba`, `deepseek`, `moonshot`, `mistral`, `azure`, `bedrock`, `zhipu`, `minimax`, `cohere`, `tencent`, `xai`, `huggingface`, `together`, `custom`.

`ollama` is supported as a local OpenAI-compatible provider. Recommended defaults:
- `llm_base_url`: `http://127.0.0.1:11434/v1`
- `api_key`: optional
- `model`: one of your local pulled models (for example `llama3.2`)

## Multi-chat permissions

`control_chat_ids` defines which chats can perform cross-chat tool actions.

- non-control chats: only their own `chat_id`
- control chats: can operate across chats
- global memory writes require control-chat privileges

See [Multi-Chat Permissions](./permissions) for setup and verification steps.

## Interactive Config

Run the recommended interactive Q&A flow:

```sh
microclaw config
```

Features:
- interactive terminal UI
- provider/model list pickers (visible choices, not blind cycling)
- local + online validation
- safe `microclaw.config.yaml` write with backup

Preset providers:
- `openai`
- `openrouter`
- `anthropic`
- `ollama`
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
