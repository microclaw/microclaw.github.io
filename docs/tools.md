---
id: tools
title: Tools
sidebar_position: 6
---

MicroClaw exposes tools to Claude through JSON Schema definitions.

## Tool list

| Tool | Description |
|---|---|
| `bash` | Execute shell commands with configurable timeout |
| `read_file` | Read files with line numbers, optional offset/limit |
| `write_file` | Create or overwrite files (auto-creates directories) |
| `edit_file` | Find-and-replace editing with uniqueness validation |
| `glob` | Find files by pattern (`**/*.rs`, `src/**/*.ts`) |
| `grep` | Regex search across file contents |
| `read_memory` | Read persistent CLAUDE.md memory (global or per-chat) |
| `write_memory` | Write persistent CLAUDE.md memory |
| `web_search` | Search the web via DuckDuckGo |
| `web_fetch` | Fetch a URL and return plain text (HTML stripped, max 20KB) |
| `send_message` | Send a Telegram message mid-conversation |
| `schedule_task` | Schedule a recurring (cron) or one-time task |
| `list_scheduled_tasks` | List active/paused tasks for a chat |
| `pause_scheduled_task` | Pause a scheduled task |
| `resume_scheduled_task` | Resume a paused task |
| `cancel_scheduled_task` | Cancel a scheduled task |

## Adding a new tool

1. Create `src/tools/my_tool.rs`
2. Implement the `Tool` trait (`name`, `definition`, `execute`)
3. Add `pub mod my_tool;` to `src/tools/mod.rs`
4. Register it in `ToolRegistry::new()`
