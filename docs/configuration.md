---
id: configuration
title: Configuration
sidebar_position: 4
---

All configuration is via `microclaw.config.yaml`.

For anti-drift defaults, use [Generated Config Defaults](./generated-config-defaults) and [Generated Provider Matrix](./generated-provider-matrix), produced from code by `scripts/generate_docs_artifacts.mjs`.

## Required

| Key | Description |
|---|---|
| `api_key` | LLM API key (`ollama` can be empty; `openai-codex` supports OAuth or `api_key`) |

At runtime, at least one channel must be enabled:
- Telegram (`telegram_bot_token` + `bot_username`)
- Discord (`discord_bot_token`)
- Web UI (`web_enabled: true`)

## Optional

| Key | Default | Description |
|---|---|---|
| `telegram_bot_token` | `""` | Telegram bot token from @BotFather (required only if Telegram is enabled) |
| `bot_username` | `""` | Telegram bot username without `@` (required only if Telegram is enabled) |
| `discord_bot_token` | unset | Discord bot token (required only if Discord is enabled) |
| `web_enabled` | `true` | Enable local Web UI channel |
| `llm_provider` | `anthropic` | Provider preset ID (or custom ID). `anthropic` uses native Anthropic API, others use OpenAI-compatible API |
| `model` | provider-specific | Model name |
| `llm_base_url` | provider preset default | Optional custom base URL |
| `data_dir` | `./microclaw.data` | Data root (`runtime` data in `data_dir/runtime`, skills in `data_dir/skills`) |
| `working_dir` | `./tmp` | Default working directory for `bash/read_file/write_file/edit_file/glob/grep`; relative paths resolve from here |
| `max_tokens` | `8192` | Max tokens per LLM response |
| `max_tool_iterations` | `100` | Max tool-use loop iterations per message |
| `max_document_size_mb` | `100` | Maximum allowed inbound Telegram document size (files above limit are rejected with a hint message) |
| `max_history_messages` | `50` | Number of recent messages sent as context |
| `control_chat_ids` | `[]` | Chat IDs allowed to perform cross-chat tool actions |
| `max_session_messages` | `40` | Message threshold that triggers context compaction |
| `compact_keep_recent` | `20` | Number of recent messages kept verbatim during compaction |
| `reflector_enabled` | `true` | Enable the background memory reflector (see [Memory System](./memory)) |
| `reflector_interval_mins` | `15` | How often the reflector runs (minutes) |
| `memory_token_budget` | `1500` | Estimated token budget for injecting structured memories into prompt context |
| `embedding_provider` | unset | Runtime embedding provider (`openai` or `ollama`) for semantic memory; leave unset to disable |
| `embedding_api_key` | unset | API key for embedding provider (if required) |
| `embedding_base_url` | unset | Optional custom embedding API base URL |
| `embedding_model` | provider default | Embedding model name |
| `embedding_dim` | provider default | Embedding vector dimension used by sqlite-vec index |
| `soul_path` | unset | Path to a `SOUL.md` file that defines bot personality, voice, and values. If unset, checks `data_dir/SOUL.md` then `./SOUL.md` |

## Channel-specific required fields

- Telegram enabled: `telegram_bot_token` and `bot_username` are required.
- Discord enabled: `discord_bot_token` is required.
- Web-only mode is valid: keep `web_enabled: true` (default) and leave other channel tokens empty.

## Supported `llm_provider` values

`openai`, `openai-codex`, `openrouter`, `anthropic`, `ollama`, `google`, `alibaba`, `deepseek`, `moonshot`, `mistral`, `azure`, `bedrock`, `zhipu`, `minimax`, `cohere`, `tencent`, `xai`, `huggingface`, `together`, `custom`.

`ollama` is supported as a local OpenAI-compatible provider. Recommended defaults:
- `llm_base_url`: `http://127.0.0.1:11434/v1`
- `api_key`: optional
- `model`: one of your local pulled models (for example `llama3.2`)

`openai-codex` supports two auth modes:
- run `codex login` before `microclaw start`
- OAuth token source: `~/.codex/auth.json` (or `$CODEX_HOME/auth.json`)
- or configure `api_key` for your OpenAI-compatible proxy endpoint

## Multi-chat permissions

`control_chat_ids` defines which chats can perform cross-chat tool actions.

- non-control chats: only their own `chat_id`
- control chats: can operate across chats
- global memory writes require control-chat privileges

See [Multi-Chat Permissions](./permissions) for setup and verification steps.

## Semantic memory switches (two-layer)

Semantic memory is intentionally guarded by two independent switches:

1. **Compile-time switch (default off):** build with `--features sqlite-vec`
2. **Runtime switch (default off):** set `embedding_provider` in config

If either switch is off, MicroClaw degrades gracefully to keyword retrieval + Jaccard dedup.

### Build examples

Default safe build (no sqlite-vec):

```sh
cargo build --release
```

Enable sqlite-vec explicitly:

```sh
cargo build --release --features sqlite-vec
```

### Runtime example

```yaml
memory_token_budget: 1500

# optional semantic memory runtime config (requires --features sqlite-vec build)
embedding_provider: "openai"      # openai | ollama
embedding_api_key: "sk-..."
# embedding_base_url: "http://127.0.0.1:11434/v1"
embedding_model: "text-embedding-3-small"
# embedding_dim: 1536
```

## Setup Wizard

Run the recommended interactive Q&A flow:

```sh
microclaw setup
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
