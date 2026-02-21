---
id: commands
title: Slash Commands
sidebar_position: 6
---

MicroClaw supports the following slash commands in chat channels.

Supported channels: Telegram, Discord, Slack, Feishu/Lark, IRC.

## Commands

| Command | Description |
|---|---|
| `/reset` | Clear current chat context (session + chat history for that chat). |
| `/skills` | List all currently available skills discovered by runtime. |
| `/reload-skills` | Reload skills from disk and return the reloaded count. |
| `/archive` | Archive current in-memory session as a markdown conversation file. |
| `/usage` | Show usage and memory observability summary for current chat. |
| `/status` | Show current provider/model (effective for this bot account) and current-chat status summary. |
| `/model` | Show current provider/model (effective for this bot account). |

## Notes

- Commands are matched exactly (for example, `/reset`).
- Scope is per chat/channel conversation, not global across all chats.
- `/archive` is manual; automatic archive may also happen before context compaction.
- `/model <name>` is currently informational and reports that runtime model switching is not yet supported.
