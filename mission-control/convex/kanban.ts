import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Time constants
const ONE_DAY = 24 * 60 * 60 * 1000;
const SEVEN_DAYS = 7 * ONE_DAY;

export type KanbanColumn = "backlog" | "blocked" | "now" | "next" | "done";

export interface KanbanCard {
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
  metadata?: Record<string, unknown>;
  fileContents?: Array<{
    path: string;
    content: string;
    size: number;
    mimeType: string;
    lastModified: number;
  }>;
}

// Get all items organized by Kanban columns
export const getKanbanData = query({
  args: {
    category: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const oneDayFromNow = now + ONE_DAY;
    const sevenDaysFromNow = now + SEVEN_DAYS;
    const sevenDaysAgo = now - SEVEN_DAYS;

    // Get all activities
    let activities = await ctx.db.query("activities").order("desc").collect();

    // Get all scheduled tasks
    let tasks = await ctx.db.query("scheduledTasks").collect();

    // Apply category filter
    if (args.category) {
      activities = activities.filter((a) => a.category === args.category);
      tasks = tasks.filter((t) => t.category === args.category);
    }

    // Apply search filter
    if (args.searchQuery && args.searchQuery.trim()) {
      const query = args.searchQuery.toLowerCase();
      activities = activities.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query)
      );
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    const columns: Record<KanbanColumn, KanbanCard[]> = {
      backlog: [],
      blocked: [],
      now: [],
      next: [],
      done: [],
    };

    // Process activities
    for (const activity of activities) {
      const card: KanbanCard = {
        id: activity._id,
        type: "activity",
        title: activity.title,
        description: activity.description,
        category: activity.category,
        timestamp: activity.timestamp,
        status: activity.status,
        relatedFiles: activity.relatedFiles,
        tags: activity.tags,
        duration: activity.duration,
        column: "done", // will be overwritten
        metadata: activity.metadata,
        fileContents: activity.fileContents,
      };

      if (activity.status === "backlog") {
        card.column = "backlog";
        columns.backlog.push(card);
      } else if (activity.status === "blocked") {
        card.column = "blocked";
        columns.blocked.push(card);
      } else if (
        activity.status === "completed" &&
        activity.timestamp > sevenDaysAgo
      ) {
        card.column = "done";
        columns.done.push(card);
      } else if (activity.status === "in_progress") {
        card.column = "now";
        columns.now.push(card);
      }
    }

    // Process scheduled tasks
    for (const task of tasks) {
      const card: KanbanCard = {
        id: task._id,
        type: "task",
        title: task.title,
        description: task.description,
        category: task.category,
        timestamp: task.scheduledFor,
        status: task.status,
        priority: task.priority,
        relatedFiles: task.relatedFiles,
        tags: task.tags,
        scheduledFor: task.scheduledFor,
        column: "next", // will be overwritten
      };

      if (task.status === "completed" && task.completedAt && task.completedAt > sevenDaysAgo) {
        card.column = "done";
        columns.done.push(card);
      } else if (task.status === "cancelled") {
        // Skip cancelled tasks
        continue;
      } else if (task.status === "pending") {
        // Categorize by scheduled time
        if (task.scheduledFor <= oneDayFromNow) {
          card.column = "now";
          columns.now.push(card);
        } else if (task.scheduledFor <= sevenDaysFromNow) {
          card.column = "next";
          columns.next.push(card);
        }
        // Tasks beyond 7 days are not shown
      }
    }

    // Sort each column
    columns.backlog.sort((a, b) => b.timestamp - a.timestamp);
    columns.blocked.sort((a, b) => b.timestamp - a.timestamp);
    columns.now.sort((a, b) => {
      // Sort by scheduledFor for tasks, timestamp for activities
      const aTime = a.scheduledFor || a.timestamp;
      const bTime = b.scheduledFor || b.timestamp;
      return aTime - bTime; // Earlier first for NOW
    });
    columns.next.sort((a, b) => {
      const aTime = a.scheduledFor || a.timestamp;
      const bTime = b.scheduledFor || b.timestamp;
      return aTime - bTime;
    });
    columns.done.sort((a, b) => b.timestamp - a.timestamp); // Most recent first

    return columns;
  },
});

// Move a card to a different column (update status)
export const moveCard = mutation({
  args: {
    cardId: v.string(),
    cardType: v.union(v.literal("activity"), v.literal("task")),
    targetColumn: v.union(
      v.literal("backlog"),
      v.literal("blocked"),
      v.literal("now"),
      v.literal("next"),
      v.literal("done")
    ),
  },
  handler: async (ctx, args) => {
    const { cardId, cardType, targetColumn } = args;

    if (cardType === "activity") {
      // Update activity status
      let newStatus: string;
      switch (targetColumn) {
        case "backlog":
          newStatus = "backlog";
          break;
        case "blocked":
          newStatus = "blocked";
          break;
        case "now":
          newStatus = "in_progress";
          break;
        case "next":
          newStatus = "in_progress"; // Activities don't have a "next" status
          break;
        case "done":
          newStatus = "completed";
          break;
      }

      await ctx.db.patch(cardId as any, { status: newStatus });
    } else {
      // Update task status
      let newStatus: string;
      let completedAt: number | undefined;

      switch (targetColumn) {
        case "backlog":
          newStatus = "pending";
          // Clear scheduledFor to indicate no timeline
          await ctx.db.patch(cardId as any, {
            status: newStatus,
            scheduledFor: undefined,
          });
          return;
        case "blocked":
          // Tasks don't have a blocked status by default, keep as pending
          newStatus = "pending";
          break;
        case "now":
          newStatus = "pending";
          // Optionally update scheduledFor to now
          await ctx.db.patch(cardId as any, {
            status: newStatus,
            scheduledFor: Date.now(),
          });
          return;
        case "next":
          newStatus = "pending";
          // Set scheduledFor to tomorrow
          await ctx.db.patch(cardId as any, {
            status: newStatus,
            scheduledFor: Date.now() + 24 * 60 * 60 * 1000,
          });
          return;
        case "done":
          newStatus = "completed";
          completedAt = Date.now();
          await ctx.db.patch(cardId as any, {
            status: newStatus,
            completedAt,
          });
          return;
      }

      await ctx.db.patch(cardId as any, { status: newStatus });
    }
  },
});

// Update activity status
export const updateActivityStatus = mutation({
  args: {
    activityId: v.id("activities"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.activityId, { status: args.status });
  },
});

// Get all unique categories for filtering
export const getCategories = query({
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();
    const tasks = await ctx.db.query("scheduledTasks").collect();

    const categories = new Set<string>();

    for (const activity of activities) {
      categories.add(activity.category);
    }
    for (const task of tasks) {
      categories.add(task.category);
    }

    return Array.from(categories).sort();
  },
});

// Create a new task from the UI
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    priority: v.string(),
    column: v.union(
      v.literal("backlog"),
      v.literal("blocked"),
      v.literal("now"),
      v.literal("next"),
      v.literal("done")
    ),
  },
  handler: async (ctx, args) => {
    const { title, description, category, priority, column } = args;
    const now = Date.now();

    // Map column to activity status
    let status: string;
    switch (column) {
      case "backlog":
        status = "backlog";
        break;
      case "blocked":
        status = "blocked";
        break;
      case "now":
        status = "in_progress";
        break;
      case "next":
        status = "in_progress";
        break;
      case "done":
        status = "completed";
        break;
    }

    // Create as an activity (since activities are the primary card type)
    const activityId = await ctx.db.insert("activities", {
      title,
      description,
      category,
      status,
      timestamp: now,
      type: "task_created",
      relatedFiles: [],
      tags: [],
      metadata: {
        priority,
        createdFrom: "mission-control-ui",
      },
    });

    return activityId;
  },
});
