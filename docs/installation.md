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

Release-only install (skip Homebrew/Cargo fallback):

```sh
curl -fsSL https://microclaw.ai/install.sh | MICROCLAW_INSTALL_METHOD=release bash
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
# Keep data/skills, remove everything else under data/
find ./data -mindepth 1 -maxdepth 1 ! -name skills -exec rm -rf {} +
rm -rf ~/.microclaw
```
