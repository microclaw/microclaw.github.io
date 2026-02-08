---
id: faq
title: FAQ
sidebar_position: 14
---

## Is MicroClaw production-ready?

MicroClaw is under active development. It is stable enough for personal and small-team use, but you should review the security model and run it on a locked-down host.

## Does it support images, voice, or files?

Telegram supports text + images. Voice messages are transcribed when `openai_api_key` is configured. File operations are available through tools (`read_file`, `write_file`, `edit_file`).

## Can I restrict who can run commands?

Yes. Configure `control_chat_ids` in `microclaw.config.yaml`:

- non-control chats can only operate on their own `chat_id`
- control chats can perform cross-chat actions
- global memory writes are limited to control chats

## How does memory work?

Memory is stored in `CLAUDE.md` files under `microclaw.data/runtime/groups/` and injected into the system prompt for every request. There is a global memory file and a per-chat memory file.

## How do scheduled tasks work?

The scheduler polls every 60 seconds for due tasks, runs the same agent loop as normal messages, sends the result, and updates the next run time.

## Can I add custom tools?

Yes. Implement the `Tool` trait in `src/tools/`, register it in `ToolRegistry::new()`, and it becomes available to LLM automatically.

## What model is used by default?

`model` defaults to `claude-sonnet-4-20250514`. You can override it in `microclaw.config.yaml`.
