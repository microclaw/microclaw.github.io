---
id: faq
title: FAQ
sidebar_position: 14
---

## Is MicroClaw production-ready?

MicroClaw is under active development. It is stable enough for personal and small-team use, but you should review the security model and run it on a locked-down host.

## Does it support images, voice, or files?

Not yet. MicroClaw currently supports text messages only.

## Can I restrict who can run commands?

There is no permission model today. If you need access control, run the bot behind a user allowlist or add a permission check in the chat handler.

## How does memory work?

Memory is stored in `CLAUDE.md` files under `data/groups/` and injected into the system prompt for every request. There is a global memory file and a per-chat memory file.

## How do scheduled tasks work?

The scheduler polls every 60 seconds for due tasks, runs the same agent loop as normal messages, sends the result, and updates the next run time.

## Can I add custom tools?

Yes. Implement the `Tool` trait in `src/tools/`, register it in `ToolRegistry::new()`, and it becomes available to LLM automatically.

## What model is used by default?

`CLAUDE_MODEL` defaults to `claude-sonnet-4-20250514`. You can override it via `.env`.
