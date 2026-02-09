# Mission Control Integration Examples

How to log activities from OpenClaw sessions to Mission Control dashboard.

## Quick Start

### 1. Set Environment Variable

```bash
export NEXT_PUBLIC_CONVEX_URL="https://your-project.convex.cloud"
```

### 2. Log Activities Manually

```typescript
import logger from "./openclaw-logger";

// Log a completed task
await logger.logTask(
  "Built Mission Control Dashboard",
  "Created activity feed, calendar, and search features",
  "development",
  {
    duration: 120, // minutes
    files: [
      "/mission-control/app/page.tsx",
      "/mission-control/components/ActivityFeed.tsx"
    ],
    tags: ["nextjs", "convex", "dashboard"],
    status: "completed"
  }
);

// Log research
await logger.logResearch(
  "Acne App Competitive Analysis",
  "Researched 10+ competitors, identified market gap",
  "No competitor does budget-first filtering OR beauty philosophy matching",
  ["/workspace/acne-app-competitive-analysis.md"]
);

// Log communication
await logger.logCommunication(
  "Market Digest Sent",
  "Daily crypto + stock market summary to Alex & Benjamin",
  "telegram"
);

// Log analysis
await logger.logAnalysis(
  "AI Provider Cost Analysis",
  "Compared OpenAI GPT-4V vs Google Gemini",
  "Gemini Flash is 10x cheaper - recommended",
  ["/workspace/acne-app-ai-provider-research.md"]
);
```

## Integration Patterns

### Pattern 1: Post-Task Logging

Add to your task completion:

```typescript
// After completing a task
const result = await buildFeature();

await logger.logTask(
  "Feature X Complete",
  "Built and tested feature X",
  "development",
  { duration: 45, tags: ["feature-x"] }
);
```

### Pattern 2: Automatic Tool Call Logging

Hook into OpenClaw tool calls:

```typescript
import { detectActivityType } from "./openclaw-logger";

// After tool execution
const toolName = "web_search";
const args = { query: "best acne products 2026" };

const activity = detectActivityType(toolName, args);
if (activity) {
  await logActivity(activity);
}
```

### Pattern 3: Session Transcript Parsing

Watch session JSONL files and auto-log:

```bash
# Run as background service
ts-node openclaw-logger.ts watch /Users/alexismendez/.openclaw/agents/main/sessions
```

This will:
- Monitor session transcript files
- Parse tool calls
- Auto-log activities to Mission Control
- Run continuously in background

### Pattern 4: End-of-Session Summary

Log a summary when sessions complete:

```typescript
// Count activities from session
const activities = await parseSessionTranscript(sessionFile);

await logger.logTask(
  "Session Complete",
  `Completed ${activities.length} activities`,
  "general",
  {
    tags: ["session-summary"],
    metadata: { sessionId: "...", totalActivities: activities.length }
  }
);
```

## CLI Usage

### Log from command line:

```bash
# Log a task
ts-node openclaw-logger.ts log \
  "Built acne app database" \
  "Compiled 100 products with affiliate links" \
  "research"

# Start background watcher
ts-node openclaw-logger.ts watch
```

### Use in shell scripts:

```bash
#!/bin/bash

# Do work
npm run build

# Log it
ts-node openclaw-logger.ts log \
  "Build complete" \
  "Frontend built successfully" \
  "development"
```

## Activity Categories

- **development**: Code, builds, deployments
- **research**: Web searches, competitive analysis
- **communication**: Messages, emails, notifications
- **analysis**: Data analysis, comparisons, insights
- **documentation**: Writing docs, READMEs, guides

## Activity Types

- `task_completed`: General task completion
- `file_created`: New file written
- `file_edited`: Existing file modified
- `research_completed`: Research or data gathering
- `communication_sent`: Message/email sent
- `analysis_completed`: Analysis or evaluation done
- `command_executed`: Shell command run
- `task_delegated`: Sub-agent spawned

## Custom Activity Logging

For complex activities:

```typescript
import { logActivity } from "./openclaw-logger";

await logActivity({
  type: "custom_activity",
  title: "Complex Task",
  description: "Did something special",
  category: "development",
  status: "completed",
  duration: 90,
  relatedFiles: ["/path/to/file.ts"],
  tags: ["custom", "special"],
  metadata: {
    customField: "value",
    metrics: { linesOfCode: 500 }
  }
});
```

## Batching Activities

Log multiple activities at once:

```typescript
const activities = [
  { type: "task_completed", title: "Task 1", ... },
  { type: "task_completed", title: "Task 2", ... },
  { type: "task_completed", title: "Task 3", ... },
];

await Promise.all(
  activities.map(activity => logActivity(activity))
);
```

## Error Handling

```typescript
try {
  await logger.logTask("...", "...", "...");
} catch (error) {
  console.error("Failed to log activity:", error);
  // Continue execution - logging failures shouldn't break workflow
}
```

## Performance Tips

1. **Don't await in hot paths**: Fire and forget for non-critical logging
2. **Batch when possible**: Group related activities
3. **Use background watcher**: Let it auto-log instead of manual calls
4. **Set reasonable timeouts**: Don't block on slow API calls

## Integration with OpenClaw Skills

Add to your `SKILL.md`:

```typescript
// At end of skill execution
import logger from "../../mission-control/scripts/openclaw-logger";

await logger.logTask(
  "Skill X Complete",
  "Executed skill successfully",
  "development",
  { tags: ["skill-x"] }
);
```

## Debugging

Check Convex dashboard to see if activities are being logged:
- https://dashboard.convex.dev
- Look in `activities` table
- Verify timestamps and data

## Future Enhancements

Ideas for expanding the integration:

1. **Real-time streaming**: WebSocket connection for instant logging
2. **Smart categorization**: ML to auto-categorize activities
3. **Duplicate detection**: Avoid logging the same thing twice
4. **Priority tagging**: Auto-detect high-impact activities
5. **Cost tracking**: Log API costs per activity
6. **Performance metrics**: Track execution times automatically

---

**Ready to use once Convex is set up!** 🚀
