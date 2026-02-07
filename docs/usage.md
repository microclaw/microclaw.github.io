---
id: usage
title: Usage Manual
sidebar_position: 5
---

A complete guide to using MicroClaw. Each section includes exact messages you can send to test the corresponding feature.

## Basics

### Private chat

In a private chat with the bot, every text message triggers a response. Just open a conversation and type.

```
You: Hello
Bot: Hi! How can I help you today?
```

### Group chat

In a group, the bot only responds when you @mention it. All messages are still stored for context.

```
Alice: I updated the config
Bob: @microclaw summarize what happened
Bot: Alice updated the config...
```

---

## Shell Commands (bash)

Run any shell command on the host machine. The bot returns stdout, stderr, and exit code.

```
You: Run `uname -a` for me
Bot: [executes bash, returns system info]
```

```
You: List all files in the current directory
Bot: [runs ls, returns file listing]
```

```
You: Run `echo hello && sleep 2 && echo done`
Bot: hello
     done
```

**Timeout**: Default 120 seconds. LLM can set a custom timeout for long-running commands.

**Output truncation**: Output longer than 30,000 characters is truncated.

---

## File Operations

### Read a file

Reads file content with line numbers. Supports offset and limit for large files.

```
You: Read the file /etc/hosts
Bot: [displays file with line numbers]
```

```
You: Show me lines 10-20 of /var/log/system.log
Bot: [displays lines 10-20 with line numbers]
```

### Write a file

Creates or overwrites a file. Automatically creates parent directories.

```
You: Create a file /tmp/hello.txt with the content "Hello, World!"
Bot: Successfully wrote to /tmp/hello.txt
```

```
You: Write a Python script to /tmp/greet.py that prints "Hello from MicroClaw"
Bot: [writes the script]
```

### Edit a file

Finds an exact string in a file and replaces it. The old string must appear exactly once.

```
You: In /tmp/hello.txt, change "World" to "MicroClaw"
Bot: Successfully edited /tmp/hello.txt
```

```
You: In /tmp/greet.py, replace the print message with "Goodbye"
Bot: [edits the file]
```

---

## File Search

### Glob (find files by pattern)

Finds files matching a glob pattern. Supports `**` for recursive matching.

```
You: Find all .rs files in the current directory
Bot: [lists matching files]
```

```
You: Search for files matching **/*.toml
Bot: [lists all .toml files recursively]
```

### Grep (search file contents)

Searches file contents with regex patterns. Returns matching lines with file paths and line numbers.

```
You: Search for "TODO" in all files in the current directory
Bot: [shows matching lines with file:line format]
```

```
You: Find all occurrences of "fn main" in .rs files
Bot: [searches with glob filter *.rs]
```

---

## Web Search

Searches the web via DuckDuckGo. Returns titles, URLs, and snippets for the top 8 results.

```
You: Search the web for "Rust async programming best practices"
Bot: 1. Title...
     URL...
     Snippet...

     2. Title...
     ...
```

```
You: What's the latest news about Anthropic?
Bot: [searches and summarizes results]
```

---

## Web Fetch

Fetches a URL and returns plain text (HTML tags stripped). Maximum 20KB.

```
You: Fetch https://example.com and tell me what it says
Bot: [fetches page, strips HTML, returns text content]
```

```
You: Go to https://httpbin.org/get and show me the response
Bot: [fetches and displays the JSON response]
```

---

## Memory System

MicroClaw has persistent memory stored in `CLAUDE.md` files. Two scopes:

- **Global memory**: Shared across all chats (`data/groups/CLAUDE.md`)
- **Chat memory**: Specific to one chat (`data/groups/{chat_id}/CLAUDE.md`)

Memory is automatically injected into the system prompt on every request.

### Write memory

```
You: Remember that my preferred programming language is Rust
Bot: Saved to chat memory.
```

```
You: Save to global memory: The production server IP is 10.0.1.50
Bot: Memory saved to global scope.
```

### Read memory

```
You: What do you remember about me?
Bot: [reads memory and responds with stored info]
```

```
You: Show me your global memory
Bot: [reads and displays CLAUDE.md content]
```

### Memory persists across conversations

```
[Session 1]
You: Remember that the deploy key is in /home/deploy/.ssh/id_ed25519

[Session 2 — hours or days later]
You: Where's the deploy key?
Bot: The deploy key is in /home/deploy/.ssh/id_ed25519
```

---

## Mid-Conversation Messaging (send_message)

LLM can send messages to the chat during tool execution, useful for progress updates on long tasks.

```
You: Analyze all log files in /var/log and give me a summary
Bot: [sends "Scanning log files..." as a progress update]
Bot: [sends "Found 15 log files, analyzing..." as another update]
Bot: [final summary response]
```

You don't need to explicitly ask for this. LLM uses it automatically when working on multi-step tasks.

---

## Scheduling

MicroClaw has a background scheduler that polls every 60 seconds.

### Schedule a recurring task (cron)

Uses 6-field cron format: `sec min hour dom month dow`

```
You: Every 5 minutes, tell me a random fun fact
Bot: Task #1 scheduled. Next run: 2025-06-15T12:05:00+00:00
```

```
You: Schedule a daily task at 9am UTC to check https://news.ycombinator.com and summarize the top 3 stories
Bot: Task #2 scheduled. Next run: 2025-06-16T09:00:00+00:00
```

Common cron patterns:
| Pattern | Meaning |
|---|---|
| `0 */5 * * * *` | Every 5 minutes |
| `0 0 * * * *` | Every hour |
| `0 0 9 * * *` | Daily at 9:00 AM |
| `0 0 9 * * 1-5` | Weekdays at 9:00 AM |
| `0 30 */2 * * *` | Every 2 hours at :30 |

### Schedule a one-time task

```
You: At 2025-12-31T23:59:00+00:00, send me a New Year countdown message
Bot: Task #3 scheduled. Next run: 2025-12-31T23:59:00+00:00
```

### List scheduled tasks

```
You: List my scheduled tasks
Bot: #1 [active] tell a fun fact | cron '0 */5 * * * *' | next: ...
     #2 [active] check HN | cron '0 0 9 * * *' | next: ...
```

### Pause / Resume / Cancel tasks

```
You: Pause task #1
Bot: Task #1 paused.

You: Resume task #1
Bot: Task #1 resumed.

You: Cancel task #2
Bot: Task #2 cancelled.
```

---

## Group Chat Catch-up

In group chats, when someone @mentions the bot, it loads all messages since its last reply for full context.

```
Alice: We need to migrate from PostgreSQL to MySQL
Bob: I think we should also update the ORM
Charlie: Let's use SQLAlchemy
Dave: @microclaw What do you think about this migration plan?

Bot: [has full context of Alice, Bob, and Charlie's messages]
     Based on your discussion, here's my take on the migration...
```

---

## Long Response Splitting

chat has a 4096-character message limit. MicroClaw automatically splits long responses at newline boundaries.

```
You: Give me a detailed explanation of the Rust ownership system with examples
Bot: [message 1 — first ~4096 chars, split at a newline]
Bot: [message 2 — remaining content]
```

---

## Typing Indicator

While processing your message (calling LLM API, executing tools), the bot shows a "typing..." indicator in the chat. The indicator refreshes every 4 seconds until the response is ready.

---

## Combined Workflows

MicroClaw chains tools automatically. A single message can trigger multiple tool calls.

### Code review

```
You: Read the file src/main.rs, find any potential issues, and write a summary to /tmp/review.txt
Bot: [reads file -> analyzes -> writes summary -> reports back]
```

### Research + save

```
You: Search for the latest Rust async runtime benchmarks, fetch the most relevant page, and save a summary to global memory
Bot: [web_search -> web_fetch -> write_memory -> responds with summary]
```

### Deploy check

```
You: Check if port 8080 is in use, read the nginx config, and tell me if everything looks correct
Bot: [bash: lsof -i :8080 -> read_file: /etc/nginx/nginx.conf -> analysis]
```

---

## CLI Reference

```sh
microclaw start       # Start the bot
microclaw help        # Show help and all configuration options
```

### Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Yes | - | Bot token from @BotFather |
| `ANTHROPIC_API_KEY` | Yes | - | Anthropic API key |
| `BOT_USERNAME` | Yes | - | Bot username (without @) |
| `CLAUDE_MODEL` | No | `claude-sonnet-4-20250514` | LLM model ID |
| `DATA_DIR` | No | `./data` | Data directory for DB and memory |
| `MAX_TOKENS` | No | `8192` | Max tokens per response |
| `MAX_TOOL_ITERATIONS` | No | `25` | Max tool loop iterations |
| `MAX_HISTORY_MESSAGES` | No | `50` | Chat history context size |
| `RUST_LOG` | No | `info` | Log level (debug, info, warn, error) |
