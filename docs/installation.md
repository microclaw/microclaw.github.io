---
id: installation
title: Installation
sidebar_position: 3
---

## System requirements

- Rust 1.70+ (2021 edition)
- macOS, Linux, or Windows
- Internet access for chat + your selected LLM provider API

## One-line installer (recommended)

```sh
curl -fsSL https://microclaw.ai/install.sh | bash
```

The installer only installs prebuilt GitHub release binaries.
It does not fall back to Homebrew or Cargo automatically.


## Windows (PowerShell)

Install using PowerShell:

```powershell
iwr https://microclaw.ai/install.ps1 -UseBasicParsing | iex
```

What this script does:

- Downloads the latest matching Windows release (`microclaw.exe`)
- Installs into `%USERPROFILE%\.local\bin` by default
- Adds install dir to your **user PATH** if missing

Optional browser automation dependency (for `browser` tool):

```powershell
npm install -g agent-browser
agent-browser install
```

On Windows, MicroClaw will invoke `agent-browser.cmd` when available.

### Preflight diagnostics (all platforms)

Run diagnostics before first start, and include output in support tickets:

```sh
microclaw doctor
```

JSON output (for issue templates / copy-paste):

```sh
microclaw doctor --json
```

Unified check output format across macOS/Linux/Windows:

```text
[✅ PASS] <title> (<check_id>) <detail>
[⚠️ WARN] <title> (<check_id>) <detail>
[❌ FAIL] <title> (<check_id>) <detail>
Summary: pass=<n> warn=<n> fail=<n>
```

`doctor` checks:

- PATH/install dir visibility
- Shell runtime (`bash/sh` or `pwsh/powershell`)
- Node.js + npm + `agent-browser`
- PowerShell execution policy (Windows)
- MCP dependency commands from `~/.microclaw/mcp.json` (or your configured `data_dir`)

### PowerShell execution policy notes

If your environment blocks script execution, run PowerShell as your user and temporarily allow signed/local scripts:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

If your organization enforces policy via Group Policy, use local source build instead of remote script execution.

### Common Windows issues (native non-WSL flow)

Use this triage path when running in native Windows terminals (PowerShell / CMD, not WSL):

1. Confirm environment and run diagnostics:
   - `microclaw doctor`
   - If this fails, run with full path: `%USERPROFILE%\.local\bin\microclaw.exe doctor`
2. If `path.install_dir` is `WARN`:
   - add `%USERPROFILE%\.local\bin` to user PATH
   - restart terminal
3. If `powershell.policy` is `FAIL` (`Restricted`):
   - `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
4. If `deps.node` / `deps.npm` / `deps.agent_browser` is `WARN`:
   - install Node.js LTS
   - run `npm install -g agent-browser` and `agent-browser install`
5. If any `mcp.<name>.command` is `FAIL`:
   - install that command (or use absolute path in `~/.microclaw/mcp.json`)
6. Re-run `microclaw doctor` until `fail=0`, then start:
   - `microclaw start`

Quick symptom map:

- `microclaw` command not found: PATH problem (`path.install_dir`)
- `browser` spawn failure: missing `agent-browser.cmd`
- script blocked by policy: `powershell.policy` failure
- MCP tool unavailable: `mcp.*` dependency failure

## Homebrew (macOS)

```sh
brew tap microclaw/tap
brew install microclaw
```

## Build from source

```sh
git clone https://github.com/microclaw/microclaw.git
cd microclaw
cargo build --release
```

Copy the binary somewhere on your PATH:

```sh
cp target/release/microclaw /usr/local/bin/
```

## Run from source (dev)

Runtime boot behavior:
- starts scheduler
- starts configured adapters (Telegram/Discord/Slack/Feishu/IRC/Web)
- can run without Telegram when other channels are enabled

```sh
cargo run -- start
```

## Setup configuration

Recommended:

```sh
microclaw setup
```

Or manually create `microclaw.config.yaml`:

```
llm_provider: "anthropic"
api_key: "..."
model: "claude-sonnet-4-5-20250929"
data_dir: "~/.microclaw"
working_dir: "~/.microclaw/working_dir"
max_document_size_mb: 100

# Enable at least one channel:
telegram_bot_token: "..."
bot_username: "..."
# Optional channel overrides:
# channels:
#   telegram:
#     bot_username: "..."
# discord_bot_token: "..."
# channels:
#   slack:
#     bot_token: "..."
#     app_token: "..."
#   feishu:
#     app_id: "..."
#     app_secret: "..."
#   irc:
#     server: "irc.example.com"
#     nick: "microclaw"
#     channels: "#general"
web_enabled: true
```

Use `microclaw help` (or `cargo run -- help`) for CLI usage.

For full Telegram / Discord / Slack / Feishu / IRC onboarding (token provisioning, connection setup, verification), see [Channel Setup](./channel-setup).

The interactive setup wizard supports provider/model selection (including `ollama`) and uses sensible defaults with Enter-to-confirm prompts.

## Gateway persistent service

MicroClaw supports a persistent gateway service manager:

```sh
microclaw gateway install
microclaw gateway install --force
microclaw gateway status
microclaw gateway status --json --deep
microclaw gateway start
microclaw gateway stop
microclaw gateway restart
microclaw gateway logs 200
microclaw gateway uninstall
```

Platform behavior:
- macOS: `launchd` user agent
- Linux: `systemd --user` unit
- Logs: gateway service stdout/stderr in `~/.microclaw/runtime/logs/` as `microclaw-gateway.log` and `microclaw-gateway.error.log`
- Retention: files older than 30 days are auto-deleted

## Optional: browser automation

To enable the `browser` tool (headless browser automation), install [agent-browser](https://github.com/vercel-labs/agent-browser):

```sh
npm install -g agent-browser
agent-browser install
```

This lets MicroClaw interact with JavaScript-rendered pages, fill forms, click buttons, and navigate multi-step web flows. If `agent-browser` is not installed, the `browser` tool will return an error when called — all other tools work normally.

## Uninstall

Installer-script uninstall (recommended):

macOS/Linux:

```sh
curl -fsSL https://microclaw.ai/uninstall.sh | bash
```

Windows PowerShell:

```powershell
iwr https://microclaw.ai/uninstall.ps1 -UseBasicParsing | iex
```

Windows PATH cleanup (optional):

```powershell
iwr https://microclaw.ai/uninstall.ps1 -UseBasicParsing | iex -CleanPath
```

If installed via Homebrew:

```sh
brew uninstall microclaw
brew untap microclaw/tap
```

Optional cleanup (remove local runtime data):

```sh
rm -rf ~/.microclaw/runtime
rm -rf ~/.microclaw
```
