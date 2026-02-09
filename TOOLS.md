# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Google Workspace (gog CLI)

- **Account:** huelebicho.openclaw@gmail.com
- **Setup:** Complete (OAuth authorized)
- **Services:** Gmail, Calendar, Drive, Contacts, Docs, Sheets, Tasks, Chat, Classroom, People
- **Command:** `gog` (not gogcli)
- **Default usage:** Always include `--account huelebicho.openclaw@gmail.com` flag
- **Drive upload:** `gog drive upload <filepath> --account huelebicho.openclaw@gmail.com --parent <folderId>`

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
