---
id: channel-setup
title: Channel Setup
sidebar_position: 4
---

This guide explains how to connect MicroClaw to Telegram and Discord.

MicroClaw can run with any combination of channels. You only need at least one of:
- Telegram
- Discord
- Web UI (`web_enabled: true`)

## Telegram

### 1. Create a bot token

1. Open Telegram and start a chat with `@BotFather`
2. Run `/newbot`
3. Enter a display name (for example `MicroClaw Dev Bot`)
4. Enter a username that ends with `bot` (for example `my_microclaw_bot`)
5. BotFather returns an HTTP API token (format like `123456:ABC...`) and your bot username
6. Copy the token immediately and keep it secret
7. Save token to your config as `telegram_bot_token`
8. Save username (without `@`) to your config as `bot_username`
9. Optional but useful in groups: run `/setprivacy` in BotFather and choose `Disable` if you want the bot to see non-mention group messages

### 2. Configure MicroClaw

```yaml
telegram_bot_token: "123456:ABC-DEF1234..."
bot_username: "my_microclaw_bot"
```

Notes:
- `bot_username` is required when Telegram is enabled.
- In group chats, mention `@bot_username` to trigger replies.
- `bot_username` should not include `@` in config.
- If you rotate token in BotFather (`/revoke`), update `telegram_bot_token` and restart MicroClaw.

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

Notes:
- If `discord_allowed_channels` is empty, MicroClaw listens in all channels it can access.
- In guild channels, MicroClaw replies when the bot is mentioned.
- If `Message Content Intent` is disabled, Discord may block message content in guilds.

### 3. Verify

1. Start MicroClaw: `microclaw start`
2. Send `/skills` in an allowed Discord channel
3. Confirm the bot replies

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

### Telegram responds in private but not group

- Confirm bot is added to the group
- Mention `@bot_username` in group messages
- Confirm `bot_username` matches BotFather username (without `@`)

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
