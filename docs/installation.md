---
id: installation
title: Installation
sidebar_position: 3
---

## System requirements

- Rust 1.70+ (2021 edition)
- macOS, Linux, or Windows
- Internet access for Telegram + your selected LLM provider API

## One-line installer (recommended)

```sh
curl -fsSL https://microclaw.ai/install.sh | bash
```

The installer tries prebuilt GitHub release binaries first, then falls back to Homebrew (macOS) or `cargo install`.

## Homebrew (macOS)

```sh
brew tap everettjf/tap
brew install microclaw
```

## Build from source

```sh
git clone https://github.com/microclaw/microclaw.git
cd microclaw
cargo build --release
```

Copy the binary somewhere on your PATH:

```sh
cp target/release/microclaw /usr/local/bin/
```

## Run from source (dev)

```sh
cargo run -- start
```

## Setup configuration

Recommended:

```sh
microclaw setup
```

Or manually create `.env`:

```
TELEGRAM_BOT_TOKEN=...
BOT_USERNAME=...
LLM_PROVIDER=anthropic
LLM_API_KEY=...
LLM_MODEL=claude-sonnet-4-20250514
```

Use `microclaw help` (or `cargo run -- help`) for CLI usage.

The setup wizard now includes provider/model list pickers and 20+ built-in provider presets, plus `custom` for manual configuration.
