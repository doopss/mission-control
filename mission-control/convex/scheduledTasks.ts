import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get tasks for a date range (for calendar view)
export const getTasksInRange = query({
  args: {
    startTime: v.number(),
    endTime: v.number(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let tasksQuery = ctx.db
      .query("scheduledTasks")
      .withIndex("by_scheduled_time", (q) =>
        q.gte("scheduledFor", args.startTime).lte("scheduledFor", args.endTime)
      );

    const tasks = await tasksQuery.collect();

    if (args.status) {
      return tasks.filter((t) => t.status === args.status);
    }

    return tasks;
  },
});

// Get upcoming tasks
export const upcoming = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const limit = args.limit ?? 10;

    return await ctx.db
      .query("scheduledTasks")
      .withIndex("by_scheduled_time", (q) => q.gte("scheduledFor", now))
      .order("asc")
      .take(limit);
  },
});

// Create a scheduled task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    scheduledFor: v.number(),
    priority: v.string(),
    category: v.string(),
    estimatedDuration: v.optional(v.number()),
    recurrence: v.optional(v.string()),
    relatedFiles: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("scheduledTasks", {
      ...args,
      status: "pending",
    });
  },
});

// Update task status
export const updateStatus = mutation({
  args: {
    taskId: v.id("scheduledTasks"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.taskId, {
      status: args.status,
      ...(args.status === "completed" ? { completedAt: Date.now() } : {}),
    });
  },
});

// Search tasks
export const search = query({
  args: {
    query: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("scheduledTasks")
      .withSearchIndex("search_tasks", (q) =>
        args.category
          ? q.search("title", args.query).eq("category", args.category)
          : q.search("title", args.query)
      )
      .take(20);
  },
});
