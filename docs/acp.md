---
id: acp
title: ACP Stdio Mode
sidebar_position: 8
---

MicroClaw can run as an Agent Client Protocol (ACP) server over stdio.

Use this mode when you want a local tool or editor integration to talk to MicroClaw as a sessioned chat runtime without going through Telegram, Discord, Slack, or the Web UI.

## Start ACP mode

```sh
microclaw acp
```

The process stays attached to stdio and serves ACP until the client disconnects or the process exits.

## What ACP mode gives you

- One shared MicroClaw runtime behind ACP stdio transport
- Sessioned chat behavior, including resumed context by session key
- The same tool loop used by normal chat surfaces
- Slash command support for `/stop` to cancel the current in-flight run

## Typical use cases

- local editor or IDE integrations
- terminal agents that want a stdio chat backend
- thin local wrappers around the MicroClaw runtime

## Runtime behavior

- ACP mode uses the normal MicroClaw config file and provider setup
- conversations are persisted like other channels
- each ACP session is mapped into MicroClaw chat/session storage
- cancellation is supported through `/stop`

## Quick verification

Before testing ACP, make sure your config is valid:

```sh
microclaw doctor
```

Then start ACP:

```sh
microclaw acp
```

Recommended validation flow:

1. open a session from your ACP client
2. send a normal prompt and confirm you get a reply
3. send a second prompt in the same session and confirm context is preserved
4. start a long-running request, then issue `/stop`
5. reconnect and confirm the runtime still accepts new requests

## When not to use ACP mode

Use `microclaw start` instead if you want:

- Telegram / Discord / Slack / Feishu / IRC / Web adapters
- Web UI and Web operator APIs
- webhook-triggered automation endpoints

ACP mode is specifically the stdio server entry point.
