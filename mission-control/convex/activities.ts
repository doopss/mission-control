import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all activities (paginated)
export const list = query({
  args: {
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    if (args.category !== undefined) {
      return await ctx.db
        .query("activities")
        .withIndex("by_category", (q) => q.eq("category", args.category as string))
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("activities")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit);
  },
});

// Search activities
export const search = query({
  args: {
    query: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activities")
      .withSearchIndex("search_activities", (q) =>
        args.category
          ? q.search("title", args.query).eq("category", args.category)
          : q.search("title", args.query)
      )
      .take(20);
  },
});

// Log a new activity
export const log = mutation({
  args: {
    type: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    status: v.optional(v.string()),
    duration: v.optional(v.number()),
    relatedFiles: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", {
      timestamp: Date.now(),
      ...args,
    });
  },
});

// Get activity statistics
export const stats = query({
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const last24h = activities.filter((a) => a.timestamp > oneDayAgo);
    const lastWeek = activities.filter((a) => a.timestamp > oneWeekAgo);

    const byCategory = activities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: activities.length,
      last24h: last24h.length,
      lastWeek: lastWeek.length,
      byCategory,
    };
  },
});
