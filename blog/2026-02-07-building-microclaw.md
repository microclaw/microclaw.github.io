---
slug: /building-microclaw
title: "Building MicroClaw: An Agentic AI Assistant in Rust That Lives in Your Chats"
authors: [microclaw]
tags: [architecture, rust, chat, agents]
---

What if your chat was a terminal? Not a dumbed-down chatbot that responds with canned text, but an actual AI agent that can run commands on your server, edit your files, search your codebase, browse the web, schedule recurring tasks, and remember what you told it three weeks ago?

That's MicroClaw -- a Rust implementation of the agentic AI-in-a-chat pattern, connecting LLM to chat with full tool execution. It started as a rewrite of nanoclaw (TypeScript/WhatsApp), but was rebuilt from scratch in Rust with a focus on simplicity and additional capabilities.

<!-- truncate -->

## The idea

Most AI chatbot integrations are thin wrappers. They take a message, forward it to an API, and return the response. One turn, no state, no agency.

MicroClaw is different. When you send it a message, it enters an agentic loop: LLM receives your message along with a set of tools, decides whether it needs to take action, executes tools if necessary, reads the results, decides if it needs to do more, and keeps going -- up to 25 iterations -- before finally composing a response.

Ask it to "find all TODO comments in the project and create a summary" and it will:

1. Run a grep search across your codebase
2. Read the matching files for context
3. Synthesize the results into a structured summary
4. Respond in your chat

All of that happens in a single message exchange. You send one message, you get back one answer. The multi-step reasoning happens behind the scenes.

## Why Rust?

The original nanoclaw is TypeScript. It works. But I wanted something I could deploy as a single static binary with no runtime dependencies. `cargo build --release` gives you one file. Copy it to a server, create a config file, and it runs.

Rust also turned out to be a surprisingly good fit for this kind of project:

- Enums for the API protocol. LLM's content blocks come in three flavors: text, tool_use, and tool_result. Rust's tagged enums with serde map to this perfectly. No stringly-typed checks, no runtime type confusion.
- Trait objects for tools. Each tool implements a `Tool` trait. The registry holds `Vec<Box<dyn Tool>>`. Adding a new tool is four lines of wiring.
- Async without drama. Tokio + reqwest + teloxide all play nicely together. The entire bot is a single async binary.
- Shared state is explicit. `Arc<Database>` makes it clear exactly which components share database access. The scheduler, the tools, and the message handler all hold their own arc -- no hidden global state.

## Architecture

The system has eight modules, and the data flows in one direction:

```
chat message
       |
       v
    SQLite (store message, load history)
       |
       v
    System prompt (inject memories + chat_id)
       |
       v
    LLM API -----> tool_use? -----> Execute tool
       ^                                    |
       |                                    |
       +---- feed result back --------------+
       |
       v
    end_turn? --> Send response to chat
```

Meanwhile, running in the background:

```
Scheduler (every 60s)
       |
       v
    Query due tasks from SQLite
       |
       v
    For each: run agentic loop --> send result to chat
```

### The agentic loop

The heart of MicroClaw lives in one function: `process_with_claude`. Here's what it does:

1. Load history from SQLite. In private chats, this is the last N messages. In groups, it's everything since the bot's last reply -- the catch-up mechanism that makes group interactions feel natural.
2. Read any saved memories (global and per-chat CLAUDE.md files) and inject them into the system prompt.
3. If there's an override prompt (from the scheduler), append it as a user message.
4. Convert the message history into LLM's message format.
5. Enter the loop: call the LLM API. If LLM responds with `stop_reason: "tool_use"`, execute the requested tools, append the results as a `tool_result` message, and call LLM again. If LLM responds with `stop_reason: "end_turn"`, extract the text and return it.

The loop has a safety cap (default 25 iterations). In practice, most interactions use 0-3 tool calls. Complex tasks like "refactor this file" might use 5-10.

### The typing indicator

A small quality-of-life feature that makes a big difference: the typing indicator stays active for the entire duration of processing. A spawned Tokio task sends `ChatAction::Typing` every 4 seconds. When the response is ready, the task is aborted.

Without this, the typing indicator would flash once when the message is received and then disappear, even if LLM is midway through a 10-tool chain. With it, the user always knows the bot is working.

### Tools

MicroClaw ships with sixteen tools across five categories:

File system: `bash`, `read_file`, `write_file`, `edit_file`, `glob`, `grep`

Memory: `read_memory`, `write_memory`

Web: `web_search`, `web_fetch`

Messaging: `send_message`

Scheduling: `schedule_task`, `list_scheduled_tasks`, `pause_scheduled_task`, `resume_scheduled_task`, `cancel_scheduled_task`

### Memory

Tell it "remember that I'm working on project Atlas and the deploy target is staging.example.com" and it will write that to a CLAUDE.md file. Next time you message it, that context is right there in the system prompt.

Two scopes:

- Global memory: `microclaw.data/runtime/groups/CLAUDE.md`
- Per-chat memory: `microclaw.data/runtime/groups/{chat_id}/CLAUDE.md`

### The scheduler

The scheduler is a background Tokio task that wakes up every 60 seconds and checks for due tasks. When it finds one:

1. It calls the same `process_with_claude` function that handles regular messages, but with the task's prompt as an override.
2. The agent runs its full tool loop -- a scheduled task can use web search, bash, file operations, anything.
3. The result is sent to the originating chat.
4. For cron tasks, the next run time is computed from the cron expression. For one-shot tasks, the status is set to "completed".

### Group chat catch-up

In groups, the bot only responds when @mentioned. But it stores every message. When mentioned, it loads all messages since its last reply in that group.

This means if 50 messages flew by in a group discussion and someone tags the bot asking "summarize what just happened", the bot sees all 50 messages, not just the most recent ones.

## Setup

Getting started takes about two minutes:

```sh
git clone https://github.com/microclaw/microclaw.git
cd microclaw
cp microclaw.config.example.yaml microclaw.config.yaml
```

Edit `microclaw.config.yaml` with three required values:

- `telegram_bot_token` -- get one from @BotFather
- `api_key` -- from your LLM provider
- `bot_username` -- your bot's username (without the @)

Then:

```sh
cargo run -- start
```

Or build a release binary:

```sh
cargo build --release
./target/release/microclaw start
```

The binary is self-contained. No database server to install (SQLite is bundled), no external dependencies to configure. It creates its `microclaw.data/` directory on first run, starts the scheduler automatically, and begins listening for messages.

## What's different from the original nanoclaw

MicroClaw started as a port but has grown beyond feature parity:

| Feature | nanoclaw (TS/WhatsApp) | MicroClaw (Rust/chat) |
|---------|----------------------|--------------------------|
| Platform | WhatsApp | chat |
| Language | TypeScript | Rust |
| Deployment | Node.js runtime | Single binary |
| Tools | Similar core set | 16 tools (8 original + 8 new) |
| Web search | -- | DuckDuckGo search + URL fetch |
| Scheduling | Cron reminders | Full agentic scheduled tasks |
| Mid-message sending | -- | send_message tool |
| Group catch-up | -- | Loads all messages since last reply |
| Typing indicator | Single flash | Continuous (every 4s) |

## Limitations

- No image/voice/document support (text messages only)
- No streaming (responses arrive all at once)
- No permission model (lock down the host machine)
- Single-threaded tool execution per turn
- Scheduler granularity (60-second polling)

## Final thoughts

The interesting thing about building MicroClaw wasn't the Rust or the chat integration -- those are just plumbing. The interesting thing is how little code it takes to go from a chatbot that echoes API responses to an agent that can actually do things.

The difference is one loop and a tool registry. Everything else -- the database, the memory system, the scheduler, the message handling -- is supporting infrastructure.

Swap chat for Slack, Discord, or a web UI. Swap the tools for whatever your domain needs. The core loop stays the same: receive message, call LLM with tools, execute tools in a loop, return response.
