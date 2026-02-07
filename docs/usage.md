---
id: usage
title: Usage Examples
sidebar_position: 5
---

A few common workflows.

## Web search

```
You: Search the web for the latest Rust release notes
Bot: [searches DuckDuckGo, returns top results]
```

## Web fetch

```
You: Fetch https://example.com and summarize it
Bot: [fetches page, strips HTML, summarizes content]
```

## Scheduling

```
You: Every morning at 9am, check the weather in Tokyo and send me a summary
Bot: Task #1 scheduled. Next run: 2025-06-15T09:00:00+00:00
```

## Mid-conversation messaging

```
You: Analyze all log files in /var/log and give me a security report
Bot: [sends progress updates]
Bot: [final report]
```

## Memory

```
You: Remember that the production database is on port 5433
Bot: Saved to chat memory.

[Three days later]
You: What port is the prod database on?
Bot: Port 5433.
```

## Group chat catch-up

```
Alice: We changed the database port to 5433
Bob: And updated config
Charlie: @microclaw summarize what happened

Bot: [summarizes all messages since last reply]
```
