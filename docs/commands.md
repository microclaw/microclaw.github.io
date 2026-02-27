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
| `/reset` | Clear current chat context (session + chat history) and remove scheduled tasks for that chat. |
| `/stop` | Abort the active run in the current chat. Does not clear session or chat history. |
| `/skills` | List all currently available skills discovered by runtime. |
| `/reload-skills` | Reload skills from disk and return the reloaded count. |
| `/archive` | Archive current in-memory session as a markdown conversation file. |
| `/usage` | Show usage and memory observability summary for current chat. |
| `/status` | Show current provider/model (effective for this bot account) and current-chat status summary. |
| `/model` | Show current provider/model (effective for this bot account). |

## Notes

- Any input starting with `/` is treated as a command.
- Inputs with leading mentions before slash are also treated as commands (for example `@bot /status`, `<@U123> /status`).
- Commands are matched exactly (for example, `/reset`).
- Scope is per chat/channel conversation, not global across all chats.
- Slash command inputs are not appended to agent conversation history/session context.
- Unknown slash commands return `Unknown command.`.
- `/stop` only aborts in-flight work for the current chat; it does not clear context.
- In group/server/channel chats, slash commands are mention-gated by default.
- To disable mention-gating for group slash commands, set `allow_group_slash_without_mention: true`.
- `/archive` is manual; automatic archive may also happen before context compaction.
- `/model <name>` is currently informational and reports that runtime model switching is not yet supported.
