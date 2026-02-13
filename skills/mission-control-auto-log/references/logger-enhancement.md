# Mission Control Logger Enhancement

The `openclaw-logger.ts` already supports file uploads via the `logTask()` function, but the CLI needs flag support.

## Current State

**Function signature supports:**
```typescript
logTask(title, description, category, {
  files?: string[];
  tags?: string[];
  duration?: number;
  status?: string;
})
```

**CLI only supports:**
```bash
npx tsx scripts/openclaw-logger.ts log "Title" "Description" "category"
```

## Enhancement Needed

Add CLI flag parsing for:
- `--files "file1.md,file2.ts"` (comma-separated)
- `--tags "tag1,tag2"` (comma-separated)
- `--duration 60` (minutes)
- `--status "completed|in_progress|blocked"`

## Example Enhanced CLI

```bash
npx tsx scripts/openclaw-logger.ts log \
  "Budge Timer Fix" \
  "Fixed state persistence between tasks" \
  "development" \
  --files "hooks/useTimer.ts,app/focus.tsx" \
  --tags "budge,bug-fix" \
  --duration 15
```

## Implementation Notes

Parse flags after positional args:

```typescript
const args = process.argv.slice(2);
const command = args[0];

if (command === "log") {
  const title = args[1];
  const description = args[2];
  const category = args[3] || "general";
  
  // Parse flags
  const filesFlag = args.find(a => a === "--files");
  const files = filesFlag ? args[args.indexOf(filesFlag) + 1]?.split(",") : undefined;
  
  const tagsFlag = args.find(a => a === "--tags");
  const tags = tagsFlag ? args[args.indexOf(tagsFlag) + 1]?.split(",") : undefined;
  
  logTask(title, description, category, { files, tags });
}
```

## Priority

Medium - The functionality exists, CLI is just less convenient without flags. Can work around by using the function directly or calling from TypeScript.
