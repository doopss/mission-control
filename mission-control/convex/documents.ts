import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Global search across all documents and memories
export const search = query({
  args: {
    query: v.string(),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withSearchIndex("search_documents", (q) =>
        args.type
          ? q.search("content", args.query).eq("type", args.type)
          : q.search("content", args.query)
      )
      .take(50);
  },
});

// Get document by path
export const getByPath = query({
  args: {
    path: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .first();
  },
});

// Index a document (for search)
export const index = mutation({
  args: {
    path: v.string(),
    title: v.string(),
    content: v.string(),
    type: v.string(),
    size: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if document already exists
    const existing = await ctx.db
      .query("documents")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .first();

    if (existing) {
      // Update existing document
      return await ctx.db.patch(existing._id, {
        ...args,
        lastModified: Date.now(),
      });
    } else {
      // Create new document
      return await ctx.db.insert("documents", {
        ...args,
        lastModified: Date.now(),
      });
    }
  },
});

// Get all documents by type
export const listByType = query({
  args: {
    type: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("documents")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .order("desc")
      .take(limit);
  },
});

// Get recent documents
export const recent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("documents")
      .order("desc")
      .take(limit);
  },
});
