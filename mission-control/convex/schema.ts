import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Activity Feed - Records every action/task completed
  activities: defineTable({
    timestamp: v.number(),
    type: v.string(), // "task_completed", "file_created", "research_done", etc.
    title: v.string(),
    description: v.string(),
    metadata: v.optional(v.any()), // Additional context (file path, task ID, etc.)
    category: v.string(), // "development", "research", "communication", "analysis"
    status: v.optional(v.string()), // "completed", "in_progress", "blocked"
    duration: v.optional(v.number()), // Time spent in minutes
    relatedFiles: v.optional(v.array(v.string())), // Array of file paths
    tags: v.optional(v.array(v.string())), // Searchable tags
    // Stored file contents for Vercel deployment (filesystem not accessible)
    fileContents: v.optional(v.array(v.object({
      path: v.string(),
      content: v.string(),
      size: v.number(),
      mimeType: v.string(),
      lastModified: v.number()
    }))),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_category", ["category", "timestamp"])
    .index("by_type", ["type", "timestamp"])
    .searchIndex("search_activities", {
      searchField: "title",
      filterFields: ["category", "type"],
    }),

  // Scheduled Tasks - Future tasks for calendar view
  scheduledTasks: defineTable({
    title: v.string(),
    description: v.string(),
    scheduledFor: v.number(), // Unix timestamp
    status: v.string(), // "pending", "completed", "cancelled"
    priority: v.string(), // "high", "medium", "low"
    category: v.string(), // "development", "research", etc.
    estimatedDuration: v.optional(v.number()), // Minutes
    recurrence: v.optional(v.string()), // "daily", "weekly", "monthly"
    relatedFiles: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    completedAt: v.optional(v.number()),
  })
    .index("by_scheduled_time", ["scheduledFor"])
    .index("by_status", ["status", "scheduledFor"])
    .searchIndex("search_tasks", {
      searchField: "title",
      filterFields: ["status", "category"],
    }),

  // Documents/Memory Index - For global search
  documents: defineTable({
    path: v.string(), // File path
    title: v.string(),
    content: v.string(), // Full text content
    type: v.string(), // "memory", "document", "code", "notes"
    lastModified: v.number(),
    size: v.optional(v.number()), // File size in bytes
    tags: v.optional(v.array(v.string())),
    summary: v.optional(v.string()), // AI-generated summary
  })
    .index("by_path", ["path"])
    .index("by_type", ["type", "lastModified"])
    .searchIndex("search_documents", {
      searchField: "content",
      filterFields: ["type"],
    }),
});
