---
id: changelog
title: Changelog
sidebar_position: 16
---

All notable changes will be documented here.

## Unreleased

- Initial public documentation site
- Core docs for configuration, tools, memory, scheduler, and architecture
- Setup wizard docs updated for provider/model list pickers
- Added 20+ preset provider references plus `custom` option guidance
- Multi-chat permission model via `control_chat_ids`
- Cross-chat authorization for `send_message`, scheduler tools, `export_chat`, `todo_*`, and chat-scoped memory
- Added permission-focused unit tests for deny/allow paths
- Added new bundled skills: `apple-notes`, `apple-reminders`, `apple-calendar`, and `weather`

## 2025-06-01

- Initial Rust rewrite from nanoclaw
- Agentic tool-use loop with 16 tools
- SQLite-backed memory and scheduling
