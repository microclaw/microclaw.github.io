---
id: skills
title: Skills
sidebar_position: 7
---

MicroClaw auto-discovers local skills from `microclaw.data/skills/*/SKILL.md`.

Use `/skills` in chat to list all available skills.  
When a request matches a skill, the model can call `activate_skill` to load and follow that skill's full workflow.

## Current bundled skills

MicroClaw currently ships with 10 bundled skills:

1. `pdf`
2. `docx`
3. `xlsx`
4. `pptx`
5. `skill-creator`
6. `apple-notes`
7. `apple-reminders`
8. `apple-calendar`
9. `weather`
10. `find-skills`

## New skills in this release

### `apple-notes`

- Purpose: manage Apple Notes on macOS
- Typical tasks: create/search/edit/move/delete/export notes
- Dependency: `memo`

Install:

```bash
brew tap antoniorodr/memo
brew install antoniorodr/memo/memo
```

Examples:

```bash
memo notes
memo notes -s "weekly plan"
memo notes -a "Project Ideas"
memo notes -e
```

### `apple-reminders`

- Purpose: manage Apple Reminders on macOS
- Typical tasks: list/add/edit/complete/delete reminders and manage lists
- Dependency: `remindctl`

Install:

```bash
brew install steipete/tap/remindctl
```

Examples:

```bash
remindctl today
remindctl add "Buy milk"
remindctl complete 1
remindctl list
```

### `apple-calendar`

- Purpose: read and create Apple Calendar events on macOS
- Typical tasks: query upcoming events and create events
- Dependencies: `icalBuddy` (query), `osascript` (built-in on macOS)

Install:

```bash
brew install ical-buddy
```

Examples:

```bash
icalBuddy eventsToday
icalBuddy eventsFrom:today to:7 days from now
osascript -e 'tell application "Calendar" to tell calendar "Work" to make new event with properties {summary:"Team Sync", start date:date "Monday, February 10, 2026 10:00:00", end date:date "Monday, February 10, 2026 10:30:00"}'
```

### `weather`

- Purpose: quick weather lookup without API keys
- Typical tasks: current weather and short forecast by city
- Dependency: `curl`

Examples:

```bash
curl -s "wttr.in/San+Francisco?format=3"
curl -s "wttr.in/San+Francisco?format=%l:+%c+%t+%h+%w"
curl -s "wttr.in/San+Francisco?m"
```

### `find-skills`

- Purpose: discover reusable skills from [vercel-labs/skills](https://github.com/vercel-labs/skills) and map them into MicroClaw-compatible workflows
- Typical tasks: search by keyword, compare candidates, recommend best-fit + fallback, propose adaptation steps
- Dependency: `curl`

Examples:

```bash
curl -sL "https://raw.githubusercontent.com/vercel-labs/skills/main/README.md"
curl -s "https://api.github.com/search/code?q=repo:vercel-labs/skills+playwright"
```

## Notes

- Apple-related skills are macOS-only.
- First use may require granting Terminal automation/privacy permissions in macOS System Settings.
- You can add your own skills by creating a new subdirectory under `microclaw.data/skills/` with a `SKILL.md` file.
