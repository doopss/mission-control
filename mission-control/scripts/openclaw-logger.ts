#!/usr/bin/env ts-node
/**
 * OpenClaw Activity Logger for Mission Control
 * 
 * Automatically logs activities from OpenClaw sessions to Mission Control dashboard
 * Can be called from OpenClaw tools or run as a background service
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as fs from "fs";
import * as path from "path";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const client = new ConvexHttpClient(CONVEX_URL);

interface ActivityLog {
  type: string;
  title: string;
  description: string;
  category: string;
  status?: string;
  duration?: number;
  relatedFiles?: string[];
  tags?: string[];
  metadata?: any;
}

/**
 * Log an activity to Mission Control
 */
export async function logActivity(activity: ActivityLog) {
  try {
    await client.mutation(api.activities.log, activity);
    console.log(`✅ Logged activity: ${activity.title}`);
  } catch (error) {
    console.error(`❌ Failed to log activity: ${error}`);
  }
}

/**
 * Auto-detect activity type from OpenClaw tool calls
 */
export function detectActivityType(toolName: string, args: any): ActivityLog | null {
  const timestamp = Date.now();

  // File operations
  if (toolName === "write") {
    return {
      type: "file_created",
      title: `Created ${path.basename(args.file_path || args.path)}`,
      description: `Wrote ${args.content?.length || 0} bytes`,
      category: "development",
      status: "completed",
      relatedFiles: [args.file_path || args.path],
      tags: ["file-operation", "write"],
    };
  }

  if (toolName === "edit") {
    return {
      type: "file_edited",
      title: `Edited ${path.basename(args.file_path || args.path)}`,
      description: `Modified file content`,
      category: "development",
      status: "completed",
      relatedFiles: [args.file_path || args.path],
      tags: ["file-operation", "edit"],
    };
  }

  // Research
  if (toolName === "web_search") {
    return {
      type: "research_completed",
      title: `Searched: ${args.query}`,
      description: `Web research on "${args.query}"`,
      category: "research",
      status: "completed",
      tags: ["web-search", "research"],
      metadata: { query: args.query },
    };
  }

  if (toolName === "web_fetch") {
    return {
      type: "research_completed",
      title: `Fetched: ${new URL(args.url).hostname}`,
      description: `Retrieved content from ${args.url}`,
      category: "research",
      status: "completed",
      tags: ["web-fetch", "research"],
      metadata: { url: args.url },
    };
  }

  // Communication
  if (toolName === "message") {
    return {
      type: "communication_sent",
      title: `Sent message via ${args.channel || "default"}`,
      description: args.message?.substring(0, 100) || "Message sent",
      category: "communication",
      status: "completed",
      tags: ["messaging", args.channel || "telegram"],
    };
  }

  // Exec commands
  if (toolName === "exec") {
    return {
      type: "command_executed",
      title: `Executed: ${args.command.substring(0, 50)}...`,
      description: `Shell command execution`,
      category: "development",
      status: "completed",
      tags: ["shell", "exec"],
      metadata: { command: args.command },
    };
  }

  // Sub-agent spawns
  if (toolName === "sessions_spawn") {
    return {
      type: "task_delegated",
      title: `Spawned sub-agent: ${args.label || "unnamed"}`,
      description: args.task?.substring(0, 100) || "Task delegated",
      category: "development",
      status: "in_progress",
      tags: ["sub-agent", "delegation", args.model || "default"],
      metadata: { task: args.task, model: args.model },
    };
  }

  return null;
}

/**
 * Watch OpenClaw session transcripts and auto-log activities
 */
export async function watchSessionTranscripts(sessionDir: string) {
  console.log(`👀 Watching for OpenClaw sessions in ${sessionDir}`);

  // This would be a proper file watcher in production
  // For now, just scan periodically
  setInterval(() => {
    try {
      const sessions = fs.readdirSync(sessionDir);
      const jsonlFiles = sessions.filter((f) => f.endsWith(".jsonl"));

      jsonlFiles.forEach((file) => {
        const filePath = path.join(sessionDir, file);
        // Process new lines in JSONL
        // Implementation would tail the file and process new tool calls
      });
    } catch (error) {
      // Session dir might not exist yet
    }
  }, 5000);
}

/**
 * Manually log a completed task
 */
export async function logTask(
  title: string,
  description: string,
  category: string,
  options: {
    duration?: number;
    files?: string[];
    tags?: string[];
    status?: string;
  } = {}
) {
  await logActivity({
    type: "task_completed",
    title,
    description,
    category,
    status: options.status || "completed",
    duration: options.duration,
    relatedFiles: options.files,
    tags: options.tags,
  });
}

/**
 * Log a research activity
 */
export async function logResearch(
  title: string,
  description: string,
  findings?: string,
  files?: string[]
) {
  await logActivity({
    type: "research_completed",
    title,
    description,
    category: "research",
    status: "completed",
    relatedFiles: files,
    tags: ["research"],
    metadata: { findings },
  });
}

/**
 * Log a communication activity
 */
export async function logCommunication(
  title: string,
  description: string,
  channel: string
) {
  await logActivity({
    type: "communication_sent",
    title,
    description,
    category: "communication",
    status: "completed",
    tags: [channel, "messaging"],
  });
}

/**
 * Log an analysis activity
 */
export async function logAnalysis(
  title: string,
  description: string,
  results?: string,
  files?: string[]
) {
  await logActivity({
    type: "analysis_completed",
    title,
    description,
    category: "analysis",
    status: "completed",
    relatedFiles: files,
    tags: ["analysis"],
    metadata: { results },
  });
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "log") {
    const title = args[1];
    const description = args[2];
    const category = args[3] || "general";

    logTask(title, description, category).then(() => {
      console.log("✅ Activity logged");
      process.exit(0);
    });
  } else if (command === "watch") {
    const sessionDir = args[1] || "/Users/alexismendez/.openclaw/agents/main/sessions";
    watchSessionTranscripts(sessionDir);
  } else {
    console.log("Usage:");
    console.log('  openclaw-logger.ts log "Title" "Description" "category"');
    console.log("  openclaw-logger.ts watch [sessionDir]");
  }
}

export default {
  logActivity,
  logTask,
  logResearch,
  logCommunication,
  logAnalysis,
  detectActivityType,
  watchSessionTranscripts,
};
