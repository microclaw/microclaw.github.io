---
id: quickstart
title: Quickstart
sidebar_position: 2
---

Get MicroClaw running in a few minutes.

## 1. Prerequisites

- Rust 1.70+ (2021 edition)
- at least one channel entry point:
  - Telegram bot token (from @BotFather), or
  - Discord bot token, or
  - Slack app token + bot token (Socket Mode), or
  - Feishu/Lark app credentials (app_id + app_secret), or
  - local Web UI mode (`web_enabled: true`)
- LLM API key (Anthropic/OpenAI/OpenRouter/DeepSeek/etc.)
  - `openai-codex` supports OAuth (`codex login`) or `api_key` (for OpenAI-compatible proxy endpoints)

## 2. Install

### One-line installer (recommended)

```sh
curl -fsSL https://microclaw.ai/install.sh | bash
```

This installer only installs prebuilt GitHub release binaries.

### Homebrew (macOS)

```sh
brew tap microclaw/tap
brew install microclaw
```

### From source

```sh
git clone https://github.com/microclaw/microclaw.git
cd microclaw
cargo build --release
cp target/release/microclaw /usr/local/bin/
```

## 3. Configure (recommended)

Use the interactive setup wizard:

```sh
microclaw setup
```

<!-- Placeholder: replace with real screenshot later -->
![Setup Wizard (placeholder)](/img/setup-wizard.png)

It validates required fields, tests chat/LLM connectivity, and writes `microclaw.config.yaml` with backup.
It also includes provider/model list pickers (`Enter` open list, `↑/↓` move, `Enter` confirm, `Esc` close).

Built-in provider presets:
- `openai`, `openai-codex`, `openrouter`, `anthropic`, `ollama`, `google`, `alibaba`
- `deepseek`, `moonshot`, `mistral`, `azure`, `bedrock`
- `zhipu`, `minimax`, `cohere`, `tencent`
- `xai`, `huggingface`, `together`
- `custom` (manual provider/model/base URL)

For `ollama`, `llm_base_url` defaults to `http://127.0.0.1:11434/v1`, `api_key` is optional, and the config flow attempts to detect local models.
For `openai-codex`, you can run `codex login` first (OAuth from `~/.codex/auth.json` or `$CODEX_HOME/auth.json`), or use `api_key` with an OpenAI-compatible proxy endpoint.

These are also the valid values for `llm_provider` in `microclaw.config.yaml`.

Manual `microclaw.config.yaml` configuration is also supported:

```
llm_provider: "anthropic"
api_key: "sk-ant-..."
model: "claude-sonnet-4-5-20250929"
data_dir: "./microclaw.data"
working_dir: "./tmp"
working_dir_isolation: "chat" # optional; defaults to "chat"
max_document_size_mb: 100

# Pick one or more channels:
telegram_bot_token: "123456:ABC-DEF1234..."
bot_username: "my_bot"
# discord_bot_token: "..."
web_enabled: true
```

### Optional: run `bash` tool in Docker sandbox

Default behavior is host execution (`sandbox.mode: "off"`).  
To route `bash` tool calls into Docker containers:

```yaml
sandbox:
  mode: "all"
  backend: "auto"
  image: "ubuntu:25.10"
  container_prefix: "microclaw-sandbox"
  no_network: true
  require_runtime: false
```

Quick verification:

```sh
docker info
docker run --rm ubuntu:25.10 echo ok
```

Then start MicroClaw and ask it to run:
- `cat /etc/os-release`
- `pwd`

## 4. Preflight diagnostics (recommended)

```sh
microclaw doctor
```

For support tickets, attach JSON output:

```sh
microclaw doctor --json
```

Text output includes clear status markers:

```text
[✅ PASS] ...
[⚠️ WARN] ...
[❌ FAIL] ...
```

## 5. Run

```sh
microclaw start
```

That is it. On first launch, if required config is missing, `start` will auto-open the config flow.
After setup, the runtime initializes SQLite, starts scheduler, and boots configured adapters (Telegram/Discord/Slack/Feishu/Web).

If `web_enabled: true` (default), local Web UI is available at:

```text
http://127.0.0.1:10961
```

## 6. Optional: run as persistent gateway service

```sh
microclaw gateway install
microclaw gateway status
```

Lifecycle commands:

```sh
microclaw gateway start
microclaw gateway stop
microclaw gateway logs 200
microclaw gateway uninstall
```

## Next

- Read Configuration to see all config keys
- Explore Tools to understand what the agent can do
- Review Usage Examples for common workflows
