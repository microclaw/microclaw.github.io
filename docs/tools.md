---
id: tools
title: Tools Reference
sidebar_position: 6
---

MicroClaw exposes 16 tools to LLM through JSON Schema definitions. LLM selects and calls tools automatically based on your request.

## Tool List

| # | Tool | Category | Description |
|---|---|---|---|
| 1 | `bash` | Shell | Execute shell commands with configurable timeout |
| 2 | `read_file` | File I/O | Read files with line numbers, optional offset/limit |
| 3 | `write_file` | File I/O | Create or overwrite files (auto-creates directories) |
| 4 | `edit_file` | File I/O | Find-and-replace with uniqueness validation |
| 5 | `glob` | Search | Find files by glob pattern (`**/*.rs`) |
| 6 | `grep` | Search | Regex search across file contents |
| 7 | `read_memory` | Memory | Read persistent CLAUDE.md memory |
| 8 | `write_memory` | Memory | Write persistent CLAUDE.md memory |
| 9 | `web_search` | Web | Search via DuckDuckGo (top 8 results) |
| 10 | `web_fetch` | Web | Fetch a URL and return plain text (max 20KB) |
| 11 | `send_message` | chat | Send a message mid-conversation |
| 12 | `schedule_task` | Scheduler | Create a recurring or one-time task |
| 13 | `list_scheduled_tasks` | Scheduler | List active/paused tasks for a chat |
| 14 | `pause_scheduled_task` | Scheduler | Pause a scheduled task |
| 15 | `resume_scheduled_task` | Scheduler | Resume a paused task |
| 16 | `cancel_scheduled_task` | Scheduler | Cancel a scheduled task |

---

## Detailed Parameters

### bash

Execute a shell command.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `command` | string | Yes | The bash command to execute |
| `timeout_secs` | integer | No | Timeout in seconds (default: 120) |

**Behavior**: Returns stdout + stderr. Output truncated at 30,000 characters. Non-zero exit codes are reported as errors.

---

### read_file

Read file content with line numbers.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `path` | string | Yes | File path to read |
| `offset` | integer | No | Line number to start from (1-based) |
| `limit` | integer | No | Maximum lines to read (default: 2000) |

**Output format**: `{line_number}\t{content}` per line.

---

### write_file

Create or overwrite a file.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `path` | string | Yes | File path to write |
| `content` | string | Yes | Content to write |

**Behavior**: Creates parent directories automatically if they don't exist.

---

### edit_file

Replace an exact string in a file.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `path` | string | Yes | File path to edit |
| `old_string` | string | Yes | Exact string to find (must be unique) |
| `new_string` | string | Yes | Replacement string |

**Validation**: Fails if `old_string` is not found or appears more than once.

---

### glob

Find files matching a glob pattern.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `pattern` | string | Yes | Glob pattern (e.g., `**/*.rs`, `src/*.ts`) |
| `path` | string | No | Base directory (default: current directory) |

**Behavior**: Results sorted alphabetically. Truncated at 500 matches.

---

### grep

Search file contents with regex.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `pattern` | string | Yes | Regex pattern to search for |
| `path` | string | No | File or directory (default: current directory) |
| `glob` | string | No | Glob filter for filenames (e.g., `*.rs`) |

**Behavior**: Recursively searches directories. Skips hidden directories (`.git`, `.hidden`), `node_modules`, and `target`. Results truncated at 500 matches. Max 10,000 files scanned.

---

### read_memory

Read persistent CLAUDE.md memory file.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `scope` | string | Yes | `"global"` or `"chat"` |
| `chat_id` | integer | For chat scope | Chat ID for chat-scoped memory |

---

### write_memory

Write to CLAUDE.md memory file.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `scope` | string | Yes | `"global"` or `"chat"` |
| `chat_id` | integer | For chat scope | Chat ID for chat-scoped memory |
| `content` | string | Yes | Content to write (replaces existing) |

---

### web_search

Search the web via DuckDuckGo.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | Yes | Search query |

**Returns**: Top 8 results with title, URL, and snippet.

---

### web_fetch

Fetch a URL and return plain text.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | string | Yes | URL to fetch |

**Behavior**: Strips HTML tags, collapses whitespace, truncates at 20KB. Follows up to 5 redirects. 15-second timeout.

---

### send_message

Send a chat message mid-conversation.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `chat_id` | integer | Yes | Chat ID to send to |
| `text` | string | Yes | Message text |

**Use case**: Progress updates during multi-step tasks.

---

### schedule_task

Create a scheduled task.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `chat_id` | integer | Yes | Chat ID for results |
| `prompt` | string | Yes | Prompt to execute at scheduled time |
| `schedule_type` | string | Yes | `"cron"` or `"once"` |
| `schedule_value` | string | Yes | 6-field cron expression or ISO 8601 timestamp |

---

### list_scheduled_tasks

List tasks for a chat.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `chat_id` | integer | Yes | Chat ID to list tasks for |

**Returns**: Active and paused tasks with ID, status, prompt, schedule, and next run time.

---

### pause_scheduled_task / resume_scheduled_task / cancel_scheduled_task

Manage a scheduled task by ID.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `task_id` | integer | Yes | Task ID to pause/resume/cancel |

---

## Adding a New Tool

1. Create `src/tools/my_tool.rs` implementing the `Tool` trait:
   - `name()` — tool name string
   - `definition()` — `ToolDefinition` with JSON Schema
   - `execute(input)` — async execution returning `ToolResult`
2. Add `pub mod my_tool;` to `src/tools/mod.rs`
3. Register in `ToolRegistry::new()` with `Box::new(my_tool::MyTool::new(...))`

If your tool needs shared state (Bot, Database), add a constructor that accepts the dependency.
