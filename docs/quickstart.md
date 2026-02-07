---
id: quickstart
title: Quickstart
sidebar_position: 2
---

Get MicroClaw running in a few minutes.

## 1. Prerequisites

- Rust 1.70+ (2021 edition)
- Telegram bot token (from @BotFather)
- Anthropic API key

## 2. Install

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

## 3. Configure

```sh
cp .env.example .env
```

Edit `.env`:

```
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234...
ANTHROPIC_API_KEY=sk-ant-...
BOT_USERNAME=my_bot
```

## 4. Run

```sh
microclaw start
```

That is it. The bot will initialize its SQLite database, start the scheduler, and begin listening for messages.

## Next

- Read Configuration to see all environment variables
- Explore Tools to understand what the agent can do
- Review Usage Examples for common workflows
