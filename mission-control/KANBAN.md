# Kanban Board - Mission Control

A production-ready Kanban board view for the Mission Control dashboard.

## Features

### 📋 Four Columns
- **BLOCKED** 🚫 - Items with `status = "blocked"` or missing dependencies
- **NOW** 🔥 - In-progress activities + tasks due within 24 hours
- **NEXT** 📋 - Pending tasks due within 1-7 days
- **DONE** ✅ - Completed items from the last 7 days

### 🎯 Data Integration
- Pulls from both `activities` and `scheduledTasks` tables
- Real-time updates via Convex subscriptions
- Auto-categorization based on status and scheduled time

### 🎨 Visual Design
- Color-coded categories (development, research, communication, etc.)
- Priority badges for tasks (high/medium/low)
- File badges showing related files
- Expandable cards for full details
- Matches existing dark theme (zinc-950 bg, emerald accents)

### 🖱️ Drag & Drop
- HTML5 native drag and drop (no extra dependencies)
- Visual feedback during drag
- Automatic status updates on drop:
  - Drop in **BLOCKED** → status: "blocked"
  - Drop in **NOW** → status: "in_progress" / schedules to now
  - Drop in **NEXT** → status: "pending" / schedules to tomorrow
  - Drop in **DONE** → status: "completed"

### 🔍 Filtering & Search
- Filter by category
- Real-time search across titles and descriptions
- Card counts per column

### 📱 Responsive
- 4 columns on desktop (xl+)
- 2 columns on tablet (md)
- 1 column on mobile

## File Structure

```
mission-control/
├── app/
│   └── page.tsx              # Updated with Kanban tab
├── components/
│   └── KanbanView.tsx        # Main Kanban component
└── convex/
    └── kanban.ts             # Convex queries/mutations
```

## Convex Functions

### Queries

#### `kanban.getKanbanData`
```typescript
getKanbanData({
  category?: string,      // Filter by category
  searchQuery?: string,   // Search title/description
})
// Returns: { blocked: KanbanCard[], now: KanbanCard[], next: KanbanCard[], done: KanbanCard[] }
```

#### `kanban.getCategories`
```typescript
getCategories()
// Returns: string[] - All unique categories
```

### Mutations

#### `kanban.moveCard`
```typescript
moveCard({
  cardId: string,
  cardType: "activity" | "task",
  targetColumn: "blocked" | "now" | "next" | "done",
})
```

#### `kanban.updateActivityStatus`
```typescript
updateActivityStatus({
  activityId: Id<"activities">,
  status: string,
})
```

## Card Types

### KanbanCard Interface
```typescript
interface KanbanCard {
  id: string;
  type: "activity" | "task";
  title: string;
  description: string;
  category: string;
  timestamp: number;
  status?: string;
  priority?: string;
  relatedFiles?: string[];
  tags?: string[];
  duration?: number;
  scheduledFor?: number;
  column: KanbanColumn;
}
```

## Categorization Logic

### Activities
| Status | Column |
|--------|--------|
| `"blocked"` | BLOCKED |
| `"in_progress"` | NOW |
| `"completed"` (last 7 days) | DONE |

### Scheduled Tasks
| Condition | Column |
|-----------|--------|
| Due within 24h | NOW |
| Due 1-7 days | NEXT |
| Completed (last 7 days) | DONE |
| Cancelled | Hidden |

## Category Colors

| Category | Color | Icon |
|----------|-------|------|
| development | Blue | 💻 |
| research | Purple | 🔍 |
| communication | Green | 💬 |
| analysis | Yellow | 📊 |
| documentation | Pink | 📝 |
| planning | Cyan | 📋 |
| design | Orange | 🎨 |
| testing | Red | 🧪 |

## Usage

1. Navigate to Mission Control
2. Click the **📋 Kanban** tab
3. Cards are automatically sorted into columns
4. Drag cards between columns to update status
5. Click expand button (▶) on cards for full details
6. Use the search bar to find specific items
7. Filter by category using the category buttons

## Future Enhancements

- [ ] Add @dnd-kit/core for smoother drag animations
- [ ] Keyboard accessibility for drag operations
- [ ] Custom column ordering
- [ ] Card creation directly from Kanban
- [ ] Due date editing inline
- [ ] Bulk operations (select multiple cards)
- [ ] Export/import functionality
