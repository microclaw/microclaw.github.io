---
id: web-operator-api
title: Web Operator API
sidebar_position: 6
---

This page summarizes the Web control-plane APIs and observability settings.

## Authentication

MicroClaw Web supports:

- Session cookie login (`POST /api/auth/login`, `POST /api/auth/logout`)
- Scoped API keys (`/api/auth/api_keys`)
- Legacy bearer token (`web_auth_token`) for compatibility

Password bootstrap behavior:

- If no operator password exists at startup, MicroClaw initializes a temporary default password: `helloworld`.
- `GET /api/auth/status` includes `has_password`, `authenticated`, and `using_default_password`.
- Web UI prompts the operator to replace the default password after sign-in (skip is allowed for testing).
- CLI helpers:
  - `microclaw web` (show usage)
  - `microclaw web password <value>`
  - `microclaw web password-generate`
  - `microclaw web password-clear`

Available scopes:

- `operator.read`
- `operator.write`
- `operator.admin`
- `operator.approvals`

## Session APIs

- `GET /api/sessions`
- `GET /api/history?session_key=<key>`
- `POST /api/reset`
- `POST /api/delete_session`
- `POST /api/sessions/fork`
- `GET /api/sessions/tree`

## HTTP Hook Trigger APIs

- `POST /hooks/agent` (`/api/hooks/agent` alias)
- `POST /hooks/wake` (`/api/hooks/wake` alias)

These endpoints are designed for webhook/automation ingress and use a dedicated
token (`channels.web.hooks_token`) rather than operator API key scopes.

For request payloads, session key policy, and examples, see
[HTTP Hook Trigger](/docs/http-hook-trigger).

## Streaming Chat APIs

- `POST /api/send_stream` (`/api/chat_stream` alias)
- `GET /api/stream?run_id=<id>`
- `GET /ws` (Mission Control-compatible WebSocket bridge)

`POST /api/send_stream` starts an async run and returns a `run_id`. Consume progress, tool events, deltas, and final output with SSE from `GET /api/stream`.

Request shape:

```json
{
  "session_key": "ops-bot",
  "sender_name": "automation",
  "message": "Summarize the latest incidents"
}
```

Accepted response shape:

```json
{
  "ok": true,
  "run_id": "6f4c2b1d-...",
  "session_key": "ops-bot",
  "chat_id": 123
}
```

Typical SSE event types:

- `status`
- `tool_start`
- `tool_result`
- `delta`
- `done`
- `error`

## Mission Control WebSocket Bridge

MicroClaw now exposes a thin OpenClaw-style WebSocket bridge at `GET /ws`.
It is intended for Mission Control-style operators that expect:

- a `connect.challenge` event on socket open
- a `connect` request frame
- `chat.send` request/response flow
- live `chat` events for `delta`, `final`, and `error`
- `chat.history` reads for session transcripts

Current bridge scope is intentionally narrow: it covers chat dispatch and live updates,
not the full OpenClaw control plane.

Example connect frame:

```json
{
  "type": "req",
  "id": "connect-1",
  "method": "connect",
  "params": {
    "minProtocol": 3,
    "maxProtocol": 3,
    "auth": { "token": "mc_..." }
  }
}
```

Example `chat.send`:

```json
{
  "type": "req",
  "id": "send-1",
  "method": "chat.send",
  "params": {
    "sessionKey": "ops-bot",
    "message": "Summarize the latest incidents",
    "idempotencyKey": "idem-1"
  }
}
```

Example `chat` event:

```json
{
  "type": "event",
  "event": "chat",
  "payload": {
    "runId": "6f4c2b1d-...",
    "sessionKey": "ops-bot",
    "seq": 1,
    "state": "final",
    "message": {
      "role": "assistant",
      "content": [{ "type": "text", "text": "..." }]
    }
  }
}
```

## Config APIs

- `GET /api/config`
- `POST /api/config`
- `GET /api/config/self_check`

`GET /api/config` returns:
- redacted `config` payload
- `soul_files`: discovered `*.md` filenames from `./souls` and `<data_dir>/souls` (used by Web Settings per-bot `soul_path` picker)
- `requires_restart`

## Metrics APIs

- `GET /api/metrics`
- `GET /api/metrics/summary`
- `GET /api/metrics/history?minutes=1440&limit=2000`

Metrics history is persisted in SQLite and trimmed by `channels.web.metrics_history_retention_days`.

## OTLP Export

Optional OTLP/HTTP protobuf export:

```yaml
channels:
  observability:
    otlp_enabled: true
    otlp_endpoint: "http://127.0.0.1:4318/v1/metrics"
    service_name: "microclaw"
    otlp_export_interval_seconds: 15
    otlp_queue_capacity: 256
    otlp_retry_max_attempts: 3
    otlp_retry_base_ms: 500
    otlp_retry_max_ms: 8000
```

Exporter behavior:

- bounded queue with drop-on-full
- retry with exponential backoff

## Config Self-check

`GET /api/config/self_check` returns startup risk warnings and `risk_level` (`none` / `medium` / `high`) to quickly spot unsafe settings.
