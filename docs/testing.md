---
id: testing
title: Testing Guide
sidebar_position: 11
---

MicroClaw testing is primarily manual because it depends on external services.

## Prerequisites

1. A working `.env` file
2. `cargo build` succeeds
3. Bot is running: `cargo run -- start`
4. A Telegram account
5. (For group tests) A Telegram group with the bot added

## Core tests

1. Basic startup
2. Typing indicator stays active during tool use
3. Bash tool executes commands
4. File read/write/edit tools
5. Glob + grep search
6. Memory read/write
7. Web search and fetch
8. Mid-conversation send_message
9. Scheduling (cron and one-shot)
10. Group chat catch-up
11. Long responses split at 4096 chars

## Example checks

```
You: Run `echo hello world` in bash
Expected: "hello world"

You: Search the web for "Rust programming language"
Expected: DuckDuckGo results with titles and snippets

You: Schedule a task to say "Ping" every minute
Expected: Task created and runs within 60-90 seconds
```

## Database verification

```sh
sqlite3 data/microclaw.db
SELECT COUNT(*) FROM messages;
SELECT * FROM scheduled_tasks;
SELECT * FROM chats;
```

## Cleanup

```sh
rm -f /tmp/microclaw_test.txt /tmp/todos.txt
sqlite3 data/microclaw.db "UPDATE scheduled_tasks SET status='cancelled' WHERE status='active';"
```
