# MicroClaw Website

This folder contains the MicroClaw docs website (Docusaurus), published at https://microclaw.org.
It includes docs + blog content and can be developed/deployed independently from the Rust bot.

## Install

```sh
npm install
```

## Local development

```sh
npm start
```

## Build

```sh
npm run build
```

The production build validates every configured locale.

## Languages

The site supports English, Simplified Chinese, Hindi, Spanish, Arabic, French,
Bengali, Portuguese, Indonesian, and Urdu. The landing page, navigation, and
footer are localized; technical reference pages fall back to the canonical
English source until a maintained translation is available.

Preview a locale locally with:

```sh
npm start -- --locale zh-CN
```

Landing-page copy lives in `src/home-i18n.js`. Theme labels live under
`i18n/<locale>/docusaurus-theme-classic/`. Keep technical content in `docs/`
as the single source of truth unless a translation is actively maintained.

## Serve build output

```sh
npm run serve
```
