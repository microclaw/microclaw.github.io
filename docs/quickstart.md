---
id: quickstart
title: Quickstart
sidebar_position: 2
---

Get MicroClaw running in a few minutes.

## 1. Prerequisites

- Rust 1.70+ (2021 edition)
- chat bot token (from @BotFather)
- LLM API key (Anthropic/OpenAI/OpenRouter/DeepSeek/etc.)

## 2. Install

### One-line installer (recommended)

```sh
curl -fsSL https://microclaw.ai/install.sh | bash
```

This installer only installs prebuilt GitHub release binaries.

### Homebrew (macOS)

```sh
brew tap everettjf/tap
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

Use the interactive config flow:

```sh
microclaw config
```

<!-- Placeholder: replace with real screenshot later -->
![Setup Wizard (placeholder)](/img/setup-wizard.svg)

It validates required fields, tests chat/LLM connectivity, and writes `microclaw.config.yaml` with backup.
It also includes provider/model list pickers (`Enter` open list, `↑/↓` move, `Enter` confirm, `Esc` close).

Built-in provider presets:
- `openai`, `openrouter`, `anthropic`, `ollama`, `google`, `alibaba`
- `deepseek`, `moonshot`, `mistral`, `azure`, `bedrock`
- `zhipu`, `minimax`, `cohere`, `tencent`
- `xai`, `huggingface`, `together`
- `custom` (manual provider/model/base URL)

For `ollama`, `llm_base_url` defaults to `http://127.0.0.1:11434/v1`, `api_key` is optional, and the config flow attempts to detect local models.

These are also the valid values for `llm_provider` in `microclaw.config.yaml`.

Manual `microclaw.config.yaml` configuration is also supported:

```
telegram_bot_token: "123456:ABC-DEF1234..."
bot_username: "my_bot"
llm_provider: "anthropic"
api_key: "sk-ant-..."
model: "claude-sonnet-4-20250514"
data_dir: "./microclaw.data"
working_dir: "./tmp"
```

## 4. Run

```sh
microclaw start
```

That is it. On first launch, if required config is missing, `start` will auto-open the config flow.
After setup, the bot initializes SQLite, starts scheduler, and begins listening for messages.

## 5. Optional: run as persistent gateway service

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
