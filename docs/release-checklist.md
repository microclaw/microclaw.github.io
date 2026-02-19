---
id: release-checklist
title: PR & Release Checklist
sidebar_position: 13
---

Use this checklist before merge and release.

## PR Readiness

- Scope is clear and bounded.
- Migration changes reviewed for compatibility.
- API changes documented.
- Security-sensitive paths reviewed.
- Docs synced between `docs/` and `website/docs/`.

## Validation Commands

```sh
cargo fmt
cargo clippy --all-targets
cargo test
npm --prefix web run build
npm --prefix website run build
node scripts/generate_docs_artifacts.mjs --check
```

## Release Gate

- Upgrade test from previous DB schema passed.
- Auth/API-key/session-cookie flows verified.
- Session fork + tree endpoints verified.
- Hooks lifecycle verified.
- Metrics + history + OTLP path verified.
- `/api/config/self_check` reviewed and high-risk warnings resolved.

## Rollback Prep

- Backup SQLite DB.
- Keep previous binary/image for rollback.
- Record release SHA and config diff.
