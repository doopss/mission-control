# Mission Control Dashboard

**Built for Alex by HueleBicho**

A real-time dashboard to track all AI assistant activities, scheduled tasks, and searchable workspace memory.

---

## 🎯 Features

### 1. **Activity Feed** 📊
Records EVERY action and task completed by the AI assistant:
- Task completions
- File creations
- Research completed
- Code written
- Communications sent
- Analysis performed

**Features:**
- Real-time activity log
- Category filtering (development, research, communication, etc.)
- Activity statistics (last 24h, last week, totals)
- Expandable cards with detailed metadata
- Related files tracking
- Duration tracking
- Tag-based organization

### 2. **Calendar View** 📅
Weekly view of all scheduled future tasks:
- Visual weekly calendar grid
- Task status tracking (pending/completed/cancelled)
- Priority levels (high/medium/low)
- Time-based organization
- Quick status toggle (mark complete/incomplete)
- Navigation (previous week, today, next week)

**Perfect for:**
- Seeing what's coming up
- Planning ahead
- Tracking recurring tasks
- Managing deadlines

### 3. **Kanban Board** 📋
Visual task management with drag-and-drop:
- Four columns: BLOCKED → NOW → NEXT → DONE
- Drag cards between columns to update status
- Category filtering and search
- **Clickable cards with detail modal:**
  - Full title and description (no truncation)
  - All metadata (category, status, timestamp, duration)
  - Related files with file type indicators
  - All tags
  - Markdown rendering for descriptions
  - Close with ESC or click outside
- **Inline file viewer:**
  - Click any related file to view its contents
  - Markdown files rendered with proper formatting
  - Code files with syntax highlighting + line numbers
  - Copy-to-clipboard button
  - Collapsible/expandable viewer sections

**Perfect for:**
- Quick task triage
- Visual workflow management
- Reviewing completed work in detail
- Reading documentation and code without leaving the app

### 4. **Global Search** 🔍
Search across ALL workspace data:
- Documents
- Memory files
- Scheduled tasks
- Past activities
- Code files
- Notes

**Search features:**
- Real-time search results
- Fuzzy matching
- Filter by type (documents, tasks, all)
- Highlighted search terms
- Recent documents when no query
- Context-aware excerpts

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Convex (real-time, serverless)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Hosting:** Vercel (recommended)

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd mission-control
npm install
```

### 2. Set Up Convex

```bash
# Login to Convex (creates account if needed)
npx convex dev
```

This will:
- Open a browser to log in
- Create a new Convex project
- Generate `.env.local` with your Convex URL
- Start the Convex dev server

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📊 Database Schema

### `activities` Table
```typescript
{
  timestamp: number,
  type: string, // "task_completed", "file_created", etc.
  title: string,
  description: string,
  category: string, // "development", "research", etc.
  status?: string, // "completed", "in_progress", "blocked"
  duration?: number, // minutes
  relatedFiles?: string[],
  tags?: string[],
  metadata?: any
}
```

### `scheduledTasks` Table
```typescript
{
  title: string,
  description: string,
  scheduledFor: number, // Unix timestamp
  status: string, // "pending", "completed", "cancelled"
  priority: string, // "high", "medium", "low"
  category: string,
  estimatedDuration?: number,
  recurrence?: string, // "daily", "weekly", etc.
  relatedFiles?: string[],
  tags?: string[]
}
```

### `documents` Table
```typescript
{
  path: string, // File path
  title: string,
  content: string, // Full text
  type: string, // "memory", "document", "code", "notes"
  lastModified: number,
  size?: number,
  tags?: string[],
  summary?: string
}
```

---

## 🔌 API Usage

### Logging an Activity

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const logActivity = useMutation(api.activities.log);

await logActivity({
  type: "task_completed",
  title: "Built Mission Control Dashboard",
  description: "Created activity feed, calendar, and search features",
  category: "development",
  status: "completed",
  duration: 120, // minutes
  relatedFiles: [
    "/mission-control/app/page.tsx",
    "/mission-control/components/ActivityFeed.tsx"
  ],
  tags: ["nextjs", "convex", "dashboard"]
});
```

### Creating a Scheduled Task

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const createTask = useMutation(api.scheduledTasks.create);

await createTask({
  title: "Review acne app progress",
  description: "Check QA results and user feedback",
  scheduledFor: Date.now() + 24 * 60 * 60 * 1000, // Tomorrow
  priority: "high",
  category: "development",
  estimatedDuration: 60,
  tags: ["acne-app", "qa"]
});
```

### Indexing a Document

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const indexDocument = useMutation(api.documents.index);

await indexDocument({
  path: "/workspace/memory/2026-02-08.md",
  title: "Memory Log - Feb 8, 2026",
  content: "...", // Full file content
  type: "memory",
  tags: ["daily-log", "2026"]
});
```

---

## 🎨 Customization

### Adding New Activity Types

Edit `components/ActivityFeed.tsx` and add to `categoryIcons` and `categoryColors`:

```typescript
const categoryIcons: Record<string, string> = {
  development: "💻",
  research: "🔍",
  communication: "💬",
  analysis: "📊",
  documentation: "📝",
  // Add your own:
  design: "🎨",
  testing: "🧪",
};
```

### Changing Color Scheme

Edit Tailwind config or update the color classes in components:
- Emerald (current primary): `emerald-500`
- Alternatives: `blue-500`, `purple-500`, `cyan-500`

---

## 📦 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy Convex to Production

```bash
npx convex deploy
```

Update `.env.local` with production Convex URL.

---

## 🔄 Integration with OpenClaw

To automatically log activities from OpenClaw sessions:

1. **Add a logging function** to your OpenClaw tools
2. **Call the Convex API** after each significant action
3. **Index workspace files** periodically (e.g., daily)

Example integration script:

```typescript
// scripts/log-to-mission-control.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "../mission-control/convex/_generated/api";

const client = new ConvexHttpClient(process.env.CONVEX_URL!);

export async function logActivity(activity: {
  type: string;
  title: string;
  description: string;
  category: string;
  // ... other fields
}) {
  await client.mutation(api.activities.log, activity);
}
```

---

## 🐛 Troubleshooting

### Convex Dev Server Won't Start
```bash
# Kill existing processes
npx convex dev --once --clear-all

# Restart
npx convex dev
```

### TypeScript Errors
```bash
# Regenerate Convex types
npx convex dev --once
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## ⚠️ Important Notes

### File Viewer Limitations

The **inline file viewer** feature works in **local development only**. When deployed to Vercel:

- Vercel serverless functions cannot access your local workspace directory
- File viewing will show a "local development only" message
- All other features (Kanban, search, activities) work normally in production

**For full file viewing support**, consider:
1. Running locally with `npm run dev`
2. Future: Integrating GitHub API to fetch files from repos
3. Future: Using Vercel Blob Storage for indexed files

---

## 📝 Todo / Future Enhancements

- [ ] Add activity charts/graphs (time spent per category)
- [ ] Export activities to CSV
- [ ] Task templates (recurring patterns)
- [x] Kanban board view for tasks
- [x] Kanban card detail modal with markdown rendering
- [x] Inline file viewer (local dev only)
- [ ] GitHub integration for file viewing in production
- [ ] Real-time notifications (when task is due)
- [ ] Integration with OpenClaw CLI
- [ ] Mobile responsive improvements
- [ ] Dark/light theme toggle
- [ ] Activity filtering by date range
- [ ] Document versioning (track changes)

---

## 📄 License

Built for personal use by HueleBicho for Alex.

---

**Questions or issues?** Tag me in Telegram! 🚀
