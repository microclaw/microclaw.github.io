---
id: channel-setup
title: Channel Setup
sidebar_position: 4
---

This section provides detailed setup guides per channel.

## What You Will Get

Each channel guide includes:

- token/credential provisioning
- single-token single-bot setup
- multi-token multi-bot setup
- verification checklist
- official external links

## Channel Guides

- [Telegram](./channel-setup-telegram)
- [Discord](./channel-setup-discord)
- [Slack](./channel-setup-slack)
- [Feishu / Lark](./channel-setup-feishu-lark)
- [IRC](./channel-setup-irc)

## Web UI

Web UI does not require token or bot-account setup.

Use normal startup and open your local web address from runtime logs.

```bash
microclaw start
```

Default local address:

- `http://127.0.0.1:10961`

## Before You Start

1. Prepare `microclaw.config.yaml`.
2. Configure LLM keys (`llm_provider`, `api_key`, `model`).
3. Restart MicroClaw after channel config changes.
