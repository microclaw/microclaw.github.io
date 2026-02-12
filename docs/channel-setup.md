---
id: channel-setup
title: Channel Setup
sidebar_position: 4
---

This guide explains how to connect MicroClaw to Telegram, Discord, and WhatsApp Cloud API.

MicroClaw can run with any combination of channels. You only need at least one of:
- Telegram
- Discord
- WhatsApp (full webhook credentials)
- Web UI (`web_enabled: true`)

## Telegram

### 1. Create a bot token

1. Open Telegram and chat with `@BotFather`
2. Run `/newbot`
3. Copy the token (`123456:ABC...`)
4. Set a username (for example `my_microclaw_bot`)

### 2. Configure MicroClaw

```yaml
telegram_bot_token: "123456:ABC-DEF1234..."
bot_username: "my_microclaw_bot"
```

Notes:
- `bot_username` is required when Telegram is enabled.
- In group chats, mention `@bot_username` to trigger replies.

### 3. Verify

1. Start MicroClaw: `microclaw start`
2. Send `/skills` in Telegram
3. Confirm the bot replies

## Discord

### 1. Create a Discord bot

1. Go to Discord Developer Portal
2. Create an Application
3. Create a Bot and copy the bot token
4. In OAuth2 URL Generator:
   - Scopes: `bot`
   - Bot permissions: `View Channels`, `Send Messages`, `Read Message History` (and others as needed)
5. In **Bot -> Privileged Gateway Intents**, enable **Message Content Intent** (recommended)
6. Invite the bot to your server

### 2. Configure MicroClaw

```yaml
discord_bot_token: "YOUR_DISCORD_BOT_TOKEN"

# Optional: restrict processing to specific channel IDs
# discord_allowed_channels:
#   - 123456789012345678
#   - 987654321098765432
```

Notes:
- If `discord_allowed_channels` is empty, MicroClaw listens in all channels it can access.
- In guild channels, MicroClaw replies when the bot is mentioned.
- If `Message Content Intent` is disabled, Discord may block message content in guilds.

### 3. Verify

1. Start MicroClaw: `microclaw start`
2. Send `/skills` in an allowed Discord channel
3. Confirm the bot replies

## WhatsApp Cloud API

WhatsApp integration runs a webhook server inside MicroClaw.

### 1. Prepare Meta credentials

From Meta Developer Dashboard (WhatsApp Cloud API), collect:
- `whatsapp_access_token`
- `whatsapp_phone_number_id`
- `whatsapp_verify_token` (your chosen verify token)

### 2. Configure MicroClaw

```yaml
whatsapp_access_token: "EAAG..."
whatsapp_phone_number_id: "123456789012345"
whatsapp_verify_token: "my_verify_token"
whatsapp_webhook_port: 8080 # optional, default 8080
```

### 3. Configure Meta Webhook callback

Set webhook URL in Meta to:

```text
https://<your-public-host>/webhook
```

MicroClaw exposes:
- `GET /webhook` for verification
- `POST /webhook` for incoming messages

### 4. Verify

1. Ensure your webhook URL is publicly reachable
2. Start MicroClaw: `microclaw start`
3. Complete webhook verification in Meta
4. Send a WhatsApp message to your business number and confirm reply

## Multi-channel Example

```yaml
# LLM
llm_provider: "anthropic"
api_key: "sk-ant-..."
model: "claude-sonnet-4-5-20250929"

# Channels (any combination)
telegram_bot_token: "123456:ABC..."
bot_username: "my_microclaw_bot"
discord_bot_token: "..."
whatsapp_access_token: "..."
whatsapp_phone_number_id: "..."
whatsapp_verify_token: "..."
web_enabled: true
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
- for WhatsApp, all three credentials are set

### Telegram responds in private but not group

- Confirm bot is added to the group
- Mention `@bot_username` in group messages
- Confirm `bot_username` matches BotFather username (without `@`)

### Discord bot is online but silent

- Check bot has `View Channels`, `Send Messages`, and `Read Message History` permissions
- In guild channels, mention the bot (for example `@my_bot hello`)
- If using `discord_allowed_channels`, verify channel IDs are correct
- Enable **Message Content Intent** in Discord Developer Portal (`Bot -> Privileged Gateway Intents`)

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

### WhatsApp verification fails

- Confirm verify token in Meta exactly matches `whatsapp_verify_token`
- Confirm callback URL ends with `/webhook`
- Confirm your endpoint is publicly reachable (not localhost only)
