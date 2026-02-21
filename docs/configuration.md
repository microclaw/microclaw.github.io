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
- Telegram (legacy: `telegram_bot_token`; recommended: `channels.telegram.accounts.<id>.bot_token`)
- Discord (legacy: `discord_bot_token`; recommended: `channels.discord.accounts.<id>.bot_token`)
- Slack (legacy: `channels.slack.bot_token` + `channels.slack.app_token`; recommended: per-account tokens under `channels.slack.accounts.<id>`)
- Feishu/Lark (legacy: `channels.feishu.app_id` + `channels.feishu.app_secret`; recommended: per-account credentials under `channels.feishu.accounts.<id>`)
- IRC (`channels.irc.server` + `channels.irc.nick` + `channels.irc.channels`)
- Web UI (`web_enabled: true`)

## Optional

| Key | Default | Description |
|---|---|---|
| `telegram_bot_token` | `""` | Telegram bot token from @BotFather (required only if Telegram is enabled) |
| `channels.telegram.default_account` | unset | Default Telegram account ID in multi-account mode. If unset, uses `default` when present, otherwise first account key (sorted) |
| `channels.telegram.accounts.<id>.bot_token` | unset | Telegram bot token for a specific account (recommended multi-account mode) |
| `channels.telegram.accounts.<id>.bot_username` | unset | Telegram username for a specific account (without `@`) |
| `channels.telegram.accounts.<id>.allowed_groups` | `[]` | Optional Telegram group allowlist scoped to that account |
| `channels.discord.default_account` | unset | Default Discord account ID in multi-account mode. If unset, uses `default` when present, otherwise first account key (sorted) |
| `channels.discord.accounts.<id>.bot_token` | unset | Discord bot token for a specific account |
| `channels.discord.accounts.<id>.allowed_channels` | `[]` | Optional Discord channel allowlist scoped to that account |
| `channels.discord.accounts.<id>.no_mention` | `false` | If true, that Discord account replies in guild channels without mention |
| `channels.slack.default_account` | unset | Default Slack account ID in multi-account mode |
| `channels.slack.accounts.<id>.bot_token` | unset | Slack bot token for a specific account |
| `channels.slack.accounts.<id>.app_token` | unset | Slack app token (Socket Mode) for a specific account |
| `channels.slack.accounts.<id>.allowed_channels` | `[]` | Optional Slack channel allowlist scoped to that account |
| `channels.feishu.default_account` | unset | Default Feishu/Lark account ID in multi-account mode |
| `channels.feishu.accounts.<id>.app_id` | unset | Feishu/Lark app ID for a specific account |
| `channels.feishu.accounts.<id>.app_secret` | unset | Feishu/Lark app secret for a specific account |
| `channels.feishu.accounts.<id>.domain` | `feishu` | Domain for that account (`feishu`, `lark`, or custom URL) |
| `channels.feishu.accounts.<id>.allowed_chats` | `[]` | Optional Feishu chat allowlist scoped to that account |
| `bot_username` | `""` | Global default bot username (used by all channels unless overridden) |
| `discord_bot_token` | unset | Discord bot token (required only if Discord is enabled) |
| `web_enabled` | `true` | Enable local Web UI channel |
| `llm_provider` | `anthropic` | Provider preset ID (or custom ID). `anthropic` uses native Anthropic API, others use OpenAI-compatible API |
| `model` | provider-specific | Model name |
| `llm_base_url` | provider preset default | Optional custom base URL |
| `data_dir` | `~/.microclaw` | Data root (`runtime` data in `data_dir/runtime`, skills in `data_dir/skills`) |
| `working_dir` | `~/.microclaw/working_dir` | Default working directory for `bash/read_file/write_file/edit_file/glob/grep`; relative paths resolve from here |
| `working_dir_isolation` | `chat` | Working directory isolation mode for `bash/read_file/write_file/edit_file/glob/grep`: `shared` uses `working_dir/shared`, `chat` isolates each chat under `working_dir/chat/<channel>/<chat_id>` |
| `sandbox.mode` | `off` | Bash execution mode: `off` runs on host; `all` routes bash tool calls to Docker containers |
| `sandbox.backend` | `auto` | Sandbox backend (`auto`/`docker`) |
| `sandbox.image` | `ubuntu:25.10` | Base image used for sandbox containers |
| `sandbox.container_prefix` | `microclaw-sandbox` | Prefix for sandbox container names |
| `sandbox.no_network` | `true` | If true, sandbox containers run with `--network=none` |
| `sandbox.require_runtime` | `false` | If true and Docker is unavailable while `sandbox.mode=all`, command fails fast instead of host fallback |
| `sandbox.mount_allowlist_path` | unset | Optional external mount allowlist file (one allowed root path per line) |
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

Path compatibility:
- If users already configured `data_dir` / `skills_dir` / `working_dir`, those values keep working unchanged.
- If not configured, defaults are `data_dir=~/.microclaw`, `skills_dir=<data_dir>/skills`, `working_dir=~/.microclaw/working_dir`.

## Docker sandbox

To run `bash` tool calls in containers, set:

```yaml
sandbox:
  mode: "all"
  backend: "auto"
  image: "ubuntu:25.10"
  container_prefix: "microclaw-sandbox"
  no_network: true
  require_runtime: false
```

Behavior:
- `sandbox.mode: "off"` (default): host execution.
- `sandbox.mode: "all"` + Docker unavailable:
  - `require_runtime: false`: fallback to host with warning.
  - `require_runtime: true`: fail fast.

Quick opt-in:

```sh
microclaw setup --enable-sandbox
microclaw doctor sandbox
```

Optional hardening files:
- mount allowlist: `~/.microclaw/sandbox-mount-allowlist.txt`
- file path allowlist: `~/.microclaw/sandbox-path-allowlist.txt`

Each file supports one absolute path per line (`#` comments allowed).

## Channel-specific required fields

`channels.<name>.bot_username` is optional for all channels.  
If set, it overrides global `bot_username` for that channel.

- Telegram enabled:
  - Legacy single-account: `telegram_bot_token` + username (`bot_username` or `channels.telegram.bot_username`)
  - Multi-account: at least one enabled `channels.telegram.accounts.<id>.bot_token`
- Discord enabled:
  - Legacy single-account: `discord_bot_token`
  - Multi-account: at least one enabled `channels.discord.accounts.<id>.bot_token`
- Slack enabled:
  - Legacy single-account: `channels.slack.bot_token` and `channels.slack.app_token`
  - Multi-account: at least one enabled account with both `channels.slack.accounts.<id>.bot_token` and `channels.slack.accounts.<id>.app_token`
- Feishu/Lark enabled:
  - Legacy single-account: `channels.feishu.app_id` and `channels.feishu.app_secret`
  - Multi-account: at least one enabled account with `channels.feishu.accounts.<id>.app_id` and `channels.feishu.accounts.<id>.app_secret`
- IRC enabled: `channels.irc.server`, `channels.irc.nick`, and `channels.irc.channels` are required. Optional: `port`, `password`, `mention_required`, `tls`, `tls_server_name`, `tls_danger_accept_invalid_certs`.
- Web-only mode is valid: keep `web_enabled: true` (default) and leave other channel tokens empty.

### IRC channel keys

| Key | Default | Description |
|---|---|---|
| `channels.irc.server` | unset | IRC server host or IP |
| `channels.irc.port` | `"6667"` | IRC port |
| `channels.irc.nick` | unset | IRC bot nick |
| `channels.irc.username` | unset | IRC username (defaults to nick when empty) |
| `channels.irc.real_name` | `"MicroClaw"` | IRC real name sent in USER command |
| `channels.irc.channels` | unset | Comma-separated channel list (for example `#general,#ops`) |
| `channels.irc.password` | unset | Optional IRC server password |
| `channels.irc.mention_required` | `"true"` | Whether channel messages require mention to trigger reply |
| `channels.irc.tls` | `"false"` | Enable IRC TLS connection |
| `channels.irc.tls_server_name` | unset | Optional TLS SNI/server name override |
| `channels.irc.tls_danger_accept_invalid_certs` | `"false"` | Accept invalid TLS certs (testing only) |

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
