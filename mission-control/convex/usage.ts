import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getModelPricing, calculateCost } from "./pricing";

/**
 * Log a usage event
 */
export const logUsage = mutation({
  args: {
    model: v.string(),
    tokensIn: v.number(),
    tokensOut: v.number(),
    sessionId: v.optional(v.string()),
    activityType: v.optional(v.string()),
    metadata: v.optional(v.any()),
    timestamp: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const timestamp = args.timestamp || Date.now();
    const cost = calculateCost(args.model, args.tokensIn, args.tokensOut);
    
    return await ctx.db.insert("usageEvents", {
      timestamp,
      model: args.model,
      tokensIn: args.tokensIn,
      tokensOut: args.tokensOut,
      cost,
      sessionId: args.sessionId,
      activityType: args.activityType,
      metadata: args.metadata,
    });
  },
});

/**
 * Batch log multiple usage events
 */
export const logUsageBatch = mutation({
  args: {
    events: v.array(v.object({
      model: v.string(),
      tokensIn: v.number(),
      tokensOut: v.number(),
      sessionId: v.optional(v.string()),
      activityType: v.optional(v.string()),
      metadata: v.optional(v.any()),
      timestamp: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const event of args.events) {
      const timestamp = event.timestamp || Date.now();
      const cost = calculateCost(event.model, event.tokensIn, event.tokensOut);
      
      const id = await ctx.db.insert("usageEvents", {
        timestamp,
        model: event.model,
        tokensIn: event.tokensIn,
        tokensOut: event.tokensOut,
        cost,
        sessionId: event.sessionId,
        activityType: event.activityType,
        metadata: event.metadata,
      });
      ids.push(id);
    }
    return ids;
  },
});

/**
 * Get usage events within a time range
 */
export const list = query({
  args: {
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    model: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 1000;
    const endTime = args.endTime || Date.now();
    const startTime = args.startTime || 0;
    
    let query = ctx.db
      .query("usageEvents")
      .withIndex("by_timestamp")
      .order("desc");
    
    const events = await query.collect();
    
    // Filter in memory for now (Convex range queries are limited)
    return events
      .filter(e => e.timestamp >= startTime && e.timestamp <= endTime)
      .filter(e => !args.model || e.model === args.model)
      .slice(0, limit);
  },
});

/**
 * Get aggregated stats for a time period
 */
export const getStats = query({
  args: {
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const endTime = args.endTime || Date.now();
    const startTime = args.startTime || 0;
    
    const events = await ctx.db
      .query("usageEvents")
      .withIndex("by_timestamp")
      .collect();
    
    const filtered = events.filter(
      e => e.timestamp >= startTime && e.timestamp <= endTime
    );
    
    // Calculate totals
    const totalCost = filtered.reduce((sum, e) => sum + e.cost, 0);
    const totalTokensIn = filtered.reduce((sum, e) => sum + e.tokensIn, 0);
    const totalTokensOut = filtered.reduce((sum, e) => sum + e.tokensOut, 0);
    const eventCount = filtered.length;
    
    // By model
    const byModel: Record<string, { 
      cost: number; 
      tokensIn: number; 
      tokensOut: number; 
      count: number;
    }> = {};
    
    for (const event of filtered) {
      const pricing = getModelPricing(event.model);
      const displayName = pricing.displayName;
      
      if (!byModel[displayName]) {
        byModel[displayName] = { cost: 0, tokensIn: 0, tokensOut: 0, count: 0 };
      }
      byModel[displayName].cost += event.cost;
      byModel[displayName].tokensIn += event.tokensIn;
      byModel[displayName].tokensOut += event.tokensOut;
      byModel[displayName].count += 1;
    }
    
    // By activity type
    const byActivityType: Record<string, { cost: number; count: number }> = {};
    
    for (const event of filtered) {
      const type = event.activityType || "unknown";
      if (!byActivityType[type]) {
        byActivityType[type] = { cost: 0, count: 0 };
      }
      byActivityType[type].cost += event.cost;
      byActivityType[type].count += 1;
    }
    
    // Daily breakdown
    const byDay: Record<string, { 
      cost: number; 
      tokensIn: number; 
      tokensOut: number; 
      count: number;
    }> = {};
    
    for (const event of filtered) {
      const date = new Date(event.timestamp).toISOString().split("T")[0];
      if (!byDay[date]) {
        byDay[date] = { cost: 0, tokensIn: 0, tokensOut: 0, count: 0 };
      }
      byDay[date].cost += event.cost;
      byDay[date].tokensIn += event.tokensIn;
      byDay[date].tokensOut += event.tokensOut;
      byDay[date].count += 1;
    }
    
    // Sort daily data
    const dailyData = Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }));
    
    return {
      totalCost,
      totalTokensIn,
      totalTokensOut,
      eventCount,
      byModel,
      byActivityType,
      dailyData,
    };
  },
});

/**
 * Get current month stats
 */
export const getCurrentMonthStats = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
    
    const events = await ctx.db
      .query("usageEvents")
      .withIndex("by_timestamp")
      .collect();
    
    const filtered = events.filter(
      e => e.timestamp >= startOfMonth && e.timestamp <= endOfMonth
    );
    
    const totalCost = filtered.reduce((sum, e) => sum + e.cost, 0);
    const totalTokensIn = filtered.reduce((sum, e) => sum + e.tokensIn, 0);
    const totalTokensOut = filtered.reduce((sum, e) => sum + e.tokensOut, 0);
    
    // Calculate daily burn rate (cost / days elapsed in month)
    const daysElapsed = Math.max(1, now.getDate());
    const dailyBurnRate = totalCost / daysElapsed;
    
    // Project monthly total
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const projectedMonthly = dailyBurnRate * daysInMonth;
    
    return {
      currentMonthCost: totalCost,
      totalTokensIn,
      totalTokensOut,
      dailyBurnRate,
      projectedMonthly,
      daysElapsed,
      daysInMonth,
    };
  },
});

/**
 * Get all-time total cost
 */
export const getTotalCost = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db
      .query("usageEvents")
      .collect();
    
    return events.reduce((sum, e) => sum + e.cost, 0);
  },
});

/**
 * Delete usage events (for testing/cleanup)
 */
export const deleteAll = mutation({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("usageEvents").collect();
    for (const event of events) {
      await ctx.db.delete(event._id);
    }
    return events.length;
  },
});
