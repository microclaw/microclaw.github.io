---
id: channel-setup
title: Channel Setup
sidebar_position: 4
---

This guide explains how to connect MicroClaw to Telegram, Discord, Slack, Feishu/Lark, and IRC.

MicroClaw can run with any combination of channels. You only need at least one of:
- Telegram
- Discord
- Slack
- Feishu / Lark
- IRC
- Web UI (`web_enabled: true`)

## Telegram

### 1. Create a bot token

1. Open Telegram and start a chat with `@BotFather`
2. Run `/newbot`
3. Enter a display name (for example `MicroClaw Dev Bot`)
4. Enter a username that ends with `bot` (for example `my_microclaw_bot`)
5. BotFather returns an HTTP API token (format like `123456:ABC...`) and your bot username
6. Copy the token immediately and keep it secret
7. Save token to your config as `telegram_bot_token` (legacy single-account mode) or `channels.telegram.accounts.<id>.bot_token` (recommended multi-account mode)
8. Save username (without `@`) to your config as global `bot_username`, `channels.telegram.bot_username`, or per-account `channels.telegram.accounts.<id>.bot_username`
9. Optional but useful in groups: run `/setprivacy` in BotFather and choose `Disable` if you want the bot to see non-mention group messages

### 2. Configure MicroClaw

Legacy single-account:

```yaml
telegram_bot_token: "123456:ABC-DEF1234..."
bot_username: "my_microclaw_bot"
```

Recommended multi-account (multi-token, multi-bot):

```yaml
channels:
  telegram:
    enabled: true
    default_account: "main"
    accounts:
      main:
        enabled: true
        bot_token: "123456:ABC-DEF1234..."
        bot_username: "my_microclaw_bot"
      support:
        enabled: true
        bot_token: "987654:XYZ-DEF9999..."
        bot_username: "my_support_bot"
        # Optional group allowlist for this account only
        # allowed_groups: [-1001234567890]
```

Notes:
- In group chats, mention that account's username (for example `@my_support_bot`) to trigger replies.
- In multi-account mode, each configured account runs as a separate Telegram bot in the same MicroClaw process.
- `bot_username` should not include `@` in config.
- If you rotate token in BotFather (`/revoke`), update the corresponding `bot_token` and restart MicroClaw.

### 3. Verify

1. Start MicroClaw: `microclaw start`
2. Send `/skills` in Telegram
3. Confirm the bot replies

## Discord

### 1. Create a Discord bot

1. Open the Discord Developer Portal: `https://discord.com/developers/applications`
2. Optional reference: Discord Developers intro docs `https://docs.discord.com/developers/intro`
3. Click **New Application**, enter a name, then click **Create**
4. In the left sidebar, open **Bot**
5. Click **Add Bot**, then confirm
6. Under the bot profile, click **Reset Token** (or **Copy** if token is already shown), then copy the bot token
7. Save that token to your MicroClaw config as `discord_bot_token`
8. Still in the Developer Portal, open **OAuth2 -> URL Generator**
9. In **Scopes**, check:
   - `bot`
   - `applications.commands` (recommended, enables slash commands)
10. In **Bot Permissions**, select at least:
   - `View Channels`
   - `Send Messages`
   - `Read Message History`
   - `Mention Everyone` is not required
11. Scroll to the bottom, find **GENERATED URL**, then click **Copy**
12. Paste the copied URL into your browser and open it
13. In the Discord authorization page:
   - Choose your target server
   - Click **Continue**
   - Review permissions
   - Click **Authorize**
14. In the Developer Portal under **Bot -> Privileged Gateway Intents**, enable **Message Content Intent** (recommended), then save changes
15. Restart MicroClaw after intent changes

### 2. Configure MicroClaw

```yaml
discord_bot_token: "YOUR_DISCORD_BOT_TOKEN"

# Optional: restrict processing to specific channel IDs
# discord_allowed_channels:
#   - 123456789012345678
#   - 987654321098765432
```

Recommended multi-account mode:

```yaml
channels:
  discord:
    default_account: "main"
    accounts:
      main:
        bot_token: "DISCORD_TOKEN_MAIN"
      ops:
        bot_token: "DISCORD_TOKEN_OPS"
        no_mention: true
        # Optional channel restriction for this account
        # allowed_channels: [123456789012345678]
```

Notes:
- If `discord_allowed_channels` is empty, MicroClaw listens in all channels it can access.
- In guild channels, MicroClaw replies when the bot is mentioned.
- If `Message Content Intent` is disabled, Discord may block message content in guilds.

### 3. Verify

1. Start MicroClaw: `microclaw start`
2. Send `/skills` in an allowed Discord channel
3. Confirm the bot replies

## Slack

### 1. Create a Slack app

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and click **Create New App**
2. Choose **From scratch**, enter a name, and select your workspace
3. In the left sidebar, open **Socket Mode** and enable it
4. Create an app-level token with `connections:write` scope -- this is your `app_token` (starts with `xapp-`)
5. In the left sidebar, open **OAuth & Permissions**
6. Under **Bot Token Scopes**, add: `chat:write`, `channels:history`, `groups:history`, `im:history`, `mpim:history`, `app_mentions:read`
7. Click **Install to Workspace** and authorize -- copy the **Bot User OAuth Token** (starts with `xoxb-`) as your `bot_token`
8. In the left sidebar, open **Event Subscriptions** and enable events
9. Under **Subscribe to bot events**, add: `message.channels`, `message.groups`, `message.im`, `message.mpim`, `app_mention`
10. Save changes

### 2. Configure MicroClaw

```yaml
channels:
  slack:
    bot_token: "xoxb-..."
    app_token: "xapp-..."
    # Optional: restrict to specific channel IDs
    # allowed_channels: []
```

Recommended multi-account mode:

```yaml
channels:
  slack:
    default_account: "main"
    accounts:
      main:
        bot_token: "xoxb-main..."
        app_token: "xapp-main..."
      support:
        bot_token: "xoxb-support..."
        app_token: "xapp-support..."
        # Optional account-specific channel filter
        # allowed_channels: ["C123ABC456"]
```

### 3. Verify

1. Start MicroClaw: `microclaw start`
2. Send `/skills` in a Slack DM with the bot
3. Confirm the bot replies

## Feishu / Lark

### 1. Create a Feishu app

1. Go to [Feishu Open Platform](https://open.feishu.cn/app) (or [Lark Developer](https://open.larksuite.com/app) for international)
2. Click **Create Custom App**
3. In **Credentials & Basic Info**, copy the `App ID` and `App Secret`
4. In **Permissions & Scopes**, add: `im:message`, `im:message:send_as_bot`, `im:resource`
5. In **Events & Callbacks**, select **Long Connection** mode (recommended) or configure a webhook URL
6. Under **Event Subscriptions**, add: `im.message.receive_v1`
7. Publish the app version and approve it in your organization admin panel

### 2. Configure MicroClaw

```yaml
channels:
  feishu:
    app_id: "cli_xxx"
    app_secret: "xxx"
    # "websocket" (default, no public URL needed) or "webhook"
    connection_mode: "websocket"
    # "feishu" (China), "lark" (international), or custom URL
    domain: "feishu"
    # Optional: restrict to specific chat IDs
    # allowed_chats: []
    # Webhook-only settings:
    # webhook_path: "/feishu/events"
    # verification_token: ""
```

Recommended multi-account mode:

```yaml
channels:
  feishu:
    default_account: "main"
    accounts:
      main:
        app_id: "cli_xxx"
        app_secret: "xxx"
        domain: "feishu"
      intl:
        app_id: "cli_yyy"
        app_secret: "yyy"
        domain: "lark"
        # Optional account-specific chat filter
        # allowed_chats: ["oc_xxx"]
```

Notes:
- WebSocket mode (default) requires no public URL -- works behind NAT/firewall, ideal for local development.
- Webhook mode requires a publicly accessible URL. Configure `webhook_path` and optionally `verification_token`.
- Set `domain: "lark"` for international Lark accounts.

### 3. Verify

1. Start MicroClaw: `microclaw start`
2. Send `/skills` in a Feishu DM with the bot
3. Confirm the bot replies

## IRC

### 1. Prepare server details

1. Confirm reachable IRC host and port
2. Reserve a bot nick (and optional server password)
3. Prepare one or more channels to auto-join (for example `#general,#ops`)
4. If your network requires TLS, use `port: "6697"` and set `tls: "true"`

### 2. Configure MicroClaw

```yaml
channels:
  irc:
    server: "irc.example.com"
    port: "6667"
    nick: "microclaw"
    channels: "#general,#ops"
    # Optional:
    # username: "microclaw"
    # real_name: "MicroClaw"
    # password: ""
    # mention_required: "true"
    # tls: "false"
    # tls_server_name: ""
    # tls_danger_accept_invalid_certs: "false"
```

Notes:
- In IRC private messages, MicroClaw replies to every message.
- In IRC channels, default behavior is mention-triggered replies (`mention_required: "true"`).
- For TLS deployments, keep certificate validation enabled unless you are testing locally.

### 3. Verify

1. Start MicroClaw: `microclaw start`
2. In an IRC channel, mention your bot nick and send `/skills`
3. Confirm the bot replies

## Multi-channel Example

```yaml
# LLM
llm_provider: "anthropic"
api_key: "sk-ant-..."
model: "claude-sonnet-4-5-20250929"

# Channels (any combination)
# Telegram legacy single-account (optional alternative to accounts):
# telegram_bot_token: "123456:ABC..."
# bot_username: "my_microclaw_bot"
discord_bot_token: "..."
web_enabled: true

channels:
  telegram:
    default_account: "main"
    accounts:
      main:
        bot_token: "123456:ABC..."
        bot_username: "my_microclaw_bot"
      ops:
        bot_token: "345678:XYZ..."
        bot_username: "my_ops_bot"
  discord:
    bot_username: "my_discord_bot"
  slack:
    bot_token: "xoxb-..."
    app_token: "xapp-..."
    bot_username: "my_slack_bot"
  feishu:
    app_id: "cli_xxx"
    app_secret: "xxx"
    domain: "feishu"
    bot_username: "my_feishu_bot"
  irc:
    server: "irc.example.com"
    nick: "my_irc_bot"
    channels: "#general"
  web:
    bot_username: "my_web_bot"
```

## Troubleshooting

### No channel starts

Run:

```sh
microclaw doctor
```

Then check:
- token fields are non-empty
- at least one channel is enabled

### Telegram responds in private but not group

- Confirm bot is added to the group
- Mention the active account username in group messages (for example `@my_microclaw_bot` or `@my_ops_bot`)
- Confirm configured username matches BotFather username (without `@`)

### Discord bot is online but silent

- Check bot has `View Channels`, `Send Messages`, and `Read Message History` permissions
- In guild channels, mention the bot (for example `@my_bot hello`)
- If using `discord_allowed_channels`, verify channel IDs are correct
- Enable **Message Content Intent** in Discord Developer Portal (`Bot -> Privileged Gateway Intents`)
- If you could not select your server during invite, verify your Discord account has `Manage Server` permission in that server
- If `GENERATED URL` does not appear, re-check that `bot` is selected in OAuth2 scopes

### Discord shows `4014 Disallowed intent(s)`

This means Discord rejected one or more requested gateway intents, usually `MESSAGE_CONTENT`.

What to do:
- Open Discord Developer Portal -> your app -> `Bot`
- Under `Privileged Gateway Intents`, enable `Message Content Intent`
- Save changes and restart MicroClaw

Current MicroClaw behavior:
- MicroClaw first starts with `MESSAGE_CONTENT`
- If Discord returns `4014`, MicroClaw automatically falls back to non-privileged intents so the bot can still run
- Full guild message-content behavior requires `Message Content Intent`
