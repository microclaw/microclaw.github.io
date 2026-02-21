---
id: channel-setup-feishu-lark
title: Channel Setup - Feishu / Lark
---

## Official Links

- [Feishu Open Platform](https://open.feishu.cn/app)
- [Lark Developer](https://open.larksuite.com/app)
- [Feishu docs center](https://open.feishu.cn/document/)
- [Lark docs center](https://open.larksuite.com/document/)

## Credential Provisioning

1. Create custom app.
2. Copy `App ID` and `App Secret`.
3. Add permissions/scopes needed for bot messaging.
4. Configure event mode:
   - local/dev: **Long Connection (websocket)**
   - public endpoint: **Webhook**
5. Add receive-message event subscriptions.
6. Publish and approve app per org policy.

## Single-token Single-bot

Feishu/Lark uses `app_id` + `app_secret` credentials.

```yaml
channels:
  feishu:
    enabled: true
    app_id: "cli_xxx"
    app_secret: "xxx"
    connection_mode: "websocket"  # or "webhook"
    domain: "feishu"              # "feishu" | "lark" | custom URL
    # Optional
    # allowed_chats: []
    # webhook_path: "/feishu/events"
    # verification_token: ""
```

## Multi-token Multi-bot

Use multiple app credentials as accounts:

```yaml
channels:
  feishu:
    enabled: true
    default_account: "main"
    accounts:
      main:
        enabled: true
        app_id: "cli_xxx"
        app_secret: "xxx"
        domain: "feishu"
      intl:
        enabled: true
        app_id: "cli_yyy"
        app_secret: "yyy"
        domain: "lark"
        # Optional per-account chat filter
        # allowed_chats: ["oc_xxx"]
```

Notes:

- For international tenants, set `domain: "lark"`.
- Webhook mode needs public ingress; websocket mode does not.

## Verify

1. `microclaw start`
2. DM each bot `/skills`
3. Confirm replies in intended chats.
