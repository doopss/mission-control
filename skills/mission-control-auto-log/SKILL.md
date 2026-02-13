---
name: mission-control-auto-log
description: Automatically log completed tasks and associated files to Mission Control dashboard for remote access. Use after completing any deliverable (research, code, design, analysis) that should be accessible remotely. Handles file upload and activity tracking.
---

# Mission Control Auto-Log

Automatically upload completed work + associated files to Mission Control so Alex can access documents remotely.

## When to Use

**After completing ANY deliverable work:**
- Research documents
- Code changes
- Design files
- Analysis reports
- Documentation
- Bug fixes
- Feature implementations

**Do NOT use for:**
- Routine file edits without context
- In-progress work
- Test/debug files

## Workflow

### Step 1: Complete the work

Finish the task and ensure files are saved.

### Step 2: Log to Mission Control

Use the helper script:

```bash
cd ~/.openclaw/workspace
./skills/mission-control-auto-log/scripts/log-task.sh
```

**Or manually:**

```bash
cd ~/.openclaw/workspace/mission-control
npx tsx scripts/openclaw-logger.ts log \
  "Task Title" \
  "Description of what was done" \
  "category"
```

**Categories:** `development`, `research`, `design`, `analysis`, `documentation`, `communication`

### Step 3: Include Files

**Currently:** CLI doesn't support `--files` flag yet. Use the interactive helper script which handles file uploads automatically.

**Or call the function directly in TypeScript:**

```typescript
import { logTask } from "./scripts/openclaw-logger";

await logTask(
  "Task Title",
  "Description",
  "category",
  {
    files: ["file1.md", "file2.ts"],
    tags: ["tag1", "tag2"]
  }
);
```

**Enhancement needed:** Add CLI flag support. See `references/logger-enhancement.md`

## Automatic Integration

**In your workflow:**

1. When completing substantial work (research, features, fixes)
2. Before announcing completion to Alex
3. Run the log command with relevant files
4. Then announce to Alex (he can access remotely)

## File Upload Details

**Supported formats:**
- Text files: `.md`, `.txt`, `.json`, `.js`, `.ts`, `.py`, etc.
- Max size: 500KB per file
- Multiple files supported

**What gets uploaded:**
- File path
- Full content
- Size, MIME type, last modified

**Where files are stored:**
- Convex database (Mission Control backend)
- Accessible via web UI at https://doopss-mission-control.vercel.app

## Examples

**Using helper script (recommended):**

```bash
cd ~/.openclaw/workspace
./skills/mission-control-auto-log/scripts/log-task.sh

# Interactive prompts:
# Title: AI Design Principles Research
# Description: Liquid glass, glassmorphism, UX patterns for AI apps
# Category: research
# Files: AI-Consumer-App-Design-Principles.md
# Tags: ai,design,ux
```

**Direct CLI (simple, no files):**

```bash
cd ~/.openclaw/workspace/mission-control
npx tsx scripts/openclaw-logger.ts log \
  "Budge Timer Fix" \
  "Fixed state persistence bug" \
  "development"
```

**From OpenClaw (programmatic with files):**

```typescript
import { logTask } from "~/.openclaw/workspace/mission-control/scripts/openclaw-logger";

// After completing research
await logTask(
  "AI Design Research Complete",
  "29KB guide on modern AI app design principles",
  "research",
  {
    files: ["AI-Consumer-App-Design-Principles.md"],
    tags: ["ai", "design", "research"],
    duration: 18  // minutes
  }
);
```

## Kanban Update

**Also update the static Kanban:**

```bash
cd ~/.openclaw/workspace/kanban-board
# Edit index.html (add completed card)
git add index.html && git commit -m "Add: Task name" && git push origin main
```

## Tips

- **Descriptive titles**: "Budge Timer Fix" not "Fixed bug"
- **Clear descriptions**: What was done, why it matters
- **Include all relevant files**: Don't cherry-pick, include context
- **Use proper category**: Helps with filtering/search later
- **Tag appropriately**: Use `--tags` for searchability

## Integration with AGENTS.md

Per `AGENTS.md` Definition of Done:

> **4. Documentation Updated** ✓
> - Both Kanbans updated (if applicable)

This skill ensures Mission Control is updated. Still need to manually update static Kanban board.
