---
id: quickstart
title: Quickstart
sidebar_position: 2
---

Get MicroClaw running in a few minutes.

## 1. Prerequisites

- Rust 1.70+ (2021 edition)
- Telegram bot token (from @BotFather)
- LLM API key (Anthropic/OpenAI/OpenRouter/DeepSeek/etc.)

## 2. Install

### One-line installer (recommended)

```sh
curl -fsSL https://microclaw.ai/install.sh | bash
```

Release-only install (skip Homebrew/Cargo fallback):

```sh
curl -fsSL https://microclaw.ai/install.sh | MICROCLAW_INSTALL_METHOD=release bash
```

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

Use the interactive setup wizard:

```sh
microclaw setup
```

<!-- Placeholder: replace with real screenshot later -->
![Setup Wizard (placeholder)](/img/setup-wizard.svg)

It validates required fields, tests Telegram/LLM connectivity, and writes `.env` with backup.
It also includes provider/model list pickers (`Enter` open list, `↑/↓` move, `Enter` confirm, `Esc` close).

Built-in provider presets:
- `openai`, `openrouter`, `anthropic`, `google`, `alibaba`
- `deepseek`, `moonshot`, `mistral`, `azure`, `bedrock`
- `zhipu`, `minimax`, `cohere`, `baidu`, `tencent`
- `huawei`, `xai`, `huggingface`, `together`, `perplexity`
- `custom` (manual provider/model/base URL)

Manual `.env` configuration is still supported:

```
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234...
BOT_USERNAME=my_bot
LLM_PROVIDER=anthropic
LLM_API_KEY=sk-ant-...
LLM_MODEL=claude-sonnet-4-20250514
```

## 4. Run

```sh
microclaw start
```

That is it. On first launch, if required config is missing, `start` will auto-open setup wizard.
After setup, the bot initializes SQLite, starts scheduler, and begins listening for messages.

## Next

- Read Configuration to see all environment variables
- Explore Tools to understand what the agent can do
- Review Usage Examples for common workflows
