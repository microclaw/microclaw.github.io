---
id: installation
title: Installation
sidebar_position: 3
---

## System requirements

- Rust 1.70+ (2021 edition)
- macOS, Linux, or Windows
- Internet access for chat + your selected LLM provider API

## One-line installer (recommended)

```sh
curl -fsSL https://microclaw.ai/install.sh | bash
```

The installer only installs prebuilt GitHub release binaries.
It does not fall back to Homebrew or Cargo automatically.

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
microclaw config
```

Or manually create `microclaw.config.yaml`:

```
telegram_bot_token: "..."
bot_username: "..."
llm_provider: "anthropic"
api_key: "..."
model: "claude-sonnet-4-5-20250929"
data_dir: "./microclaw.data"
working_dir: "./tmp"
max_document_size_mb: 100
```

Use `microclaw help` (or `cargo run -- help`) for CLI usage.

The interactive config flow supports provider/model selection (including `ollama`) and uses sensible defaults with Enter-to-confirm prompts.

## Gateway persistent service

MicroClaw supports a persistent gateway service manager:

```sh
microclaw gateway install
microclaw gateway status
microclaw gateway start
microclaw gateway stop
microclaw gateway logs 200
microclaw gateway uninstall
```

Platform behavior:
- macOS: `launchd` user agent
- Linux: `systemd --user` unit
- Logs: hourly files in `microclaw.data/runtime/logs/` as `microclaw-YYYY-MM-DD-HH.log`
- Retention: files older than 30 days are auto-deleted

## Optional: browser automation

To enable the `browser` tool (headless browser automation), install [agent-browser](https://github.com/vercel-labs/agent-browser):

```sh
npm install -g agent-browser
agent-browser install
```

This lets MicroClaw interact with JavaScript-rendered pages, fill forms, click buttons, and navigate multi-step web flows. If `agent-browser` is not installed, the `browser` tool will return an error when called — all other tools work normally.

## Uninstall

If you installed with the one-line installer, remove the binary from your PATH location:

```sh
which microclaw
rm -f "$(which microclaw)"
```

If installed via Homebrew:

```sh
brew uninstall microclaw
brew untap everettjf/tap
```

Optional cleanup (remove local runtime data):

```sh
rm -rf ./microclaw.data/runtime
rm -rf ~/.microclaw
```
