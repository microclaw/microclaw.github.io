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

## Notes

- Commands are matched exactly (for example, `/reset`).
- Scope is per chat/channel conversation, not global across all chats.
- `/archive` is manual; automatic archive may also happen before context compaction.
