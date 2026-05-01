---
slug: /hermes-catchup
title: "Hermes Catch-up: User Model, Skill Lifecycle, Multimedia, and Defensive Defaults"
authors: [microclaw]
tags: [release, runtime, skills, memory, multimedia, security]
description: "MicroClaw's largest single-branch release adds a per-chat user model, end-to-end skill lifecycle, cross-channel voice, multimedia tools, cross-conversation search, and a defensive-by-default web fetch — inspired by hermes-agent v0.10.0."
---

The Hermes Catch-up release is MicroClaw's largest single-branch update so far: 37 commits, 8400 lines, 53 files. The headline number is misleading, though — what matters is which layers of the agent runtime got filled in.

The inspiration is [hermes-agent](https://github.com/nousresearch/hermes-agent) v0.10.0. Hermes runs on Python; several of its design decisions land more naturally on a Rust + SQLite stack: FTS5 ships with bundled SQLite, `cargo audit` / `cargo deny` lock dependency posture at compile time, and the artifact pattern (large tool result on disk, fetch slices by id) costs almost nothing in a single-binary deploy.

So this isn't a port — it's a re-application of patterns hermes already validated, drawn against MicroClaw's engineering boundaries.

<!-- truncate -->

## Per-chat user model (USER.md)

Memory in MicroClaw used to be one-dimensional: AGENTS.md plus structured rows, all retrieved on demand. But "who this user is" and "what this user is doing this week" should be different layers.

This release splits them:

- **per-chat USER.md** — a curated narrative of the user in this chat, written to `runtime/groups/{chat_id}/USER.md`, injected into the system prompt under a dedicated `<user_model>` block.
- **Reflector owns curation** — the agent doesn't write USER.md directly. The reflector runs an LLM call each tick that folds new signal into the existing narrative, returning `null` when nothing warrants rewriting.
- **`/user` command** — show the current narrative, or `/user clear` to reset.

USER.md has a hard cap (default 1500 chars, hermes uses 1375) so the curator is forced to summarize rather than append.

The split matters because user identity is high-reuse, low-update; specific memories are high-frequency and fragmentary. Mixing them either bloats the prompt or makes it hard to reliably recall the durable constraints. With the split, the user model lives at the top of the prompt; memories stay retrieval-on-demand.

Memory itself also gained:

- **Per-row TTL** — set an expiration on a memory; it stops surfacing after that. "Meeting on Sunday" shouldn't keep coming back two months later.
- **Recency decay** (default half-life 30 days) — older memories get down-ranked at retrieval time so newer signal naturally surfaces.

Both USER.md writes and memory writes go through a PII redact module first — emails, phone numbers, API key shapes, and card numbers are masked before persistence.

## Skill lifecycle

Skills used to be: agent activates, SKILL.md gets loaded into the prompt. End of story. This release pushes it into a real lifecycle:

- **agentskills.io spec compatibility** — SKILL.md frontmatter aligns to the [agentskills.io](https://agentskills.io) spec; legacy field names emit warnings.
- **Review at end of turn** — instead of waiting for the reflector tick, every turn triggers a review pass that decides whether the conversation produced a reusable skill.
- **Patch existing skills, not just create** — review can recognize that a solution overlaps with an existing skill and emit an edit instead of a duplicate.
- **Success-signal filter** — review only fires when the turn actually completed something, so we don't burn LLM calls on failed attempts.
- **Structured tool trajectory** — the review LLM reads a structured `(tool_name, input shape, success/fail)` trace, not the chat log. Signal density is much higher.
- **Activation tracking + auto-archive** — every activation is logged; skills idle for 30 days (default, configurable) auto-archive.
- **Retrieval-gated catalog** — the prompt-side catalog only includes the top-K best matches for the current query (default 3) instead of the full list.
- **Autonomous review default on** — previously opt-in.

The end-to-end loop is: user asks → agent solves with tools → end-of-turn review checks if it's worth a new skill or a patch → catalog retrieval surfaces the right skill next time → unused skills age out. What used to be ad-hoc decisions scattered across the codebase is now a single pipeline.

## Multimedia: hear, see, speak, draw

A complete multimedia tool suite:

| Tool | Purpose |
|---|---|
| `generate_image` | Text-to-image via OpenAI-compat `/images` |
| `describe_image` | Vision via vision-capable model |
| `text_to_speech` | TTS via OpenAI-compat `/audio/speech` |
| `transcribe_audio` | STT via OpenAI-compat `/audio/transcriptions` |

More important: voice goes all the way to channel ingress and egress.

- **Cross-channel inbound voice transcription** — Telegram, Discord, Slack, and Feishu adapters all transcribe inbound voice and feed the text into the agent loop as a normal user message. Mobile users get parity with text users.
- **Outbound TTS round-trip** (opt-in) — when the inbound was voice, the agent's reply gets synthesized to audio and shipped back through the same channel (Telegram uses native `send_voice` bubbles; Discord/Slack attach the file).

Round-trip is opt-in because each turn burns one extra TTS call.

A new `media.allowed_read_dirs` allowlist gates every media tool's local-file reads — preventing flows where the agent gets coaxed into feeding `~/.ssh` to a vision model.

## Cross-conversation recall + structured clarification

Two new tools, complementary:

- **`session_search`** — SQLite FTS5 full-text search over stored messages. The agent can find a project name or error string the user mentioned weeks ago. Schema migration adds the `messages_fts` virtual table plus INSERT/UPDATE/DELETE triggers, and backfills existing rows. Default scope is the caller's chat; cross-chat search requires explicit control.
- **`clarify`** — when a request is ambiguous, the agent asks a structured question: up to four predefined choices plus an automatic "Other". The question goes through the channel and the turn ends — the next user message is the answer. More controllable than free-form "do you mean A or B" because the channel can render it as buttons later.

`session_search` is exposed to subagents (read-only); `clarify` is main-agent only because it touches channel UI.

## Defensive-by-default

Several defaults shifted toward safer-out-of-the-box. Operators upgrading should review these:

- **`web_fetch.block_private_ips: true`** — refuses loopback / RFC1918 / CGNAT / link-local / ULA / cloud-metadata (169.254.169.254). Intranet deploys must add hosts to `allowlist_hosts` or set this `false`.
- **Redirect hook re-validates SSRF on every hop** — the initial URL isn't enough; every 302/307 is re-checked, defeating "public domain redirects to internal address" attacks.
- **robots.txt consultation** — `web_fetch` consults the target site's robots.txt before fetching.
- **`bash_dangerous_patterns`** — seven default regexes guard against `sudo`, `rm -rf /`, pipe-to-shell installers, `mkfs`, forkbombs, raw `dd if=`, and recursive root chmod/chown.
- **PII redact** — emails, phones, API key shapes, and card numbers are masked before USER.md / memory writes.
- **Bash command-content gate** — high-risk commands now show their literal contents in the approval preview, not an abstract risk classifier.

## Performance and cost control

- **Tool result cache** (schema v22) — keyed on `SHA256(tool_name + normalized input)`, opt-in per tool (e.g. `osv_check`). LRU + TTL.
- **Oversized result truncation + `fetch_artifact`** — when a tool returns more than 4000 chars (default), head and tail are kept inline and the full payload goes to `tool_result_artifacts` with a TTL. The agent calls `fetch_artifact` to slice into it. No more 100 MB grep results filling the context window.
- **Per-tool duplicate-call circuit breaker** — same tool with same input more than three times in a 10-step window is rejected. Breaks death loops.
- **Autonomous session titles** — a background LLM call titles each session after the first few user messages. Web UI history isn't a wall of "Untitled" anymore.

## Other new tools

- **`osv_check`** — queries [osv.dev](https://osv.dev) for advisories across npm / PyPI / crates.io / RubyGems / Maven / NuGet / Packagist / Hex / Pub / Go. MAL-* malware advisories are flagged separately.
- **`insights`** — usage summary over a trailing window: top tools, skill activations, token cost distribution.
- **`fetch_artifact`** — pairs with the truncation feature above.

## Operator quality of life

- **`doctor` diagnostics expanded** — now checks context cap, USER.md cap, and bash dangerous patterns config sanity, not just "the YAML parses".
- **Project-level context files** — drop any `.md` into `data_dir/runtime/groups/{channel}/{chat_id}/` and it gets concatenated into the system prompt (capped by `context_max_chars`, default 8000). A first-class home for "things this chat should always know".
- **New provider preset: Xiaomi MiMo** — five models (`mimo-v2.5-pro`, `mimo-v2.5`, `mimo-v2-pro`, `mimo-v2-flash`, `mimo-v2-omni`), OpenAI-compat protocol.

## Upgrade notes

A few things to check before merging into your deployment:

1. **DB schema advances irreversibly to v25** (migrations 21–25 are forward-only). On first start, v21 backfills the FTS5 index — large message tables can take a few minutes. **Back up `data_dir/`'s SQLite file before upgrade.**
2. **If you use `web_fetch` against intranet services**, add hosts to `web_fetch_url_validation.allowlist_hosts` or set `block_private_ips: false`.
3. **If you have bash workflows that use `sudo` or `rm -rf`**, either change the workflow or set `bash_dangerous_patterns: []`.
4. **Autonomous skill review is on by default** — each turn now incurs an extra LLM call at the end. To disable, set `autonomous_skill_review: false` or `reflector_enabled: false`.

Existing `microclaw.config.yaml` files do not need changes — every new field has `#[serde(default)]` and the defaults match the descriptions above.

## How to think about this release

It isn't "we added N tools". It's MicroClaw moving from "a runtime that can call tools" toward "a runtime with a user model, a skill lifecycle, cross-conversation memory, multimedia ingress, and explicit safety defaults."

A lot of these look like quality-of-life polish (auto-titled sessions, voice ingress, the user model). On long-running bots, they accumulate into the reason an operator is willing to keep MicroClaw in production.

Source: [microclaw/microclaw](https://github.com/microclaw/microclaw) · PR [#335](https://github.com/microclaw/microclaw/pull/335)
