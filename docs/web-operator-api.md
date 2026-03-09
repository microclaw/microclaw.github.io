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
