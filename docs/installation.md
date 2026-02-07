---
id: installation
title: Installation
sidebar_position: 3
---

## System requirements

- Rust 1.70+ (2021 edition)
- macOS, Linux, or Windows
- Internet access for Telegram + Anthropic APIs

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

## Environment file

Create a `.env` file with required variables:

```
TELEGRAM_BOT_TOKEN=...
ANTHROPIC_API_KEY=...
BOT_USERNAME=...
```

Use `cargo run -- help` to see CLI usage.
