#!/usr/bin/env ts-node
/**
 * OpenClaw Activity Logger for Mission Control
 * 
 * Automatically logs activities from OpenClaw sessions to Mission Control dashboard
 * Can be called from OpenClaw tools or run as a background service
 * 
 * Also handles usage/cost tracking for API calls
 */

import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local from mission-control directory
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as fs from "fs";
import * as readline from "readline";

// Use NEXT_PUBLIC_CONVEX_URL from .env.local by default
// Can be overridden with OPENCLAW_LOGGER_CONVEX_URL environment variable
const CONVEX_URL = process.env.OPENCLAW_LOGGER_CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL || "https://diligent-tortoise-263.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

// Workspace root for resolving file paths
const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT || path.join(process.env.HOME || "", ".openclaw/workspace");

// Max file size for storage (500KB per file to stay within Convex limits)
const MAX_FILE_SIZE = 500 * 1024;

// Allowed text-based extensions for file storage
const TEXT_EXTENSIONS = [
  ".md", ".txt", ".json", ".js", ".ts", ".tsx", ".jsx",
  ".css", ".scss", ".html", ".yaml", ".yml", ".toml",
  ".py", ".sh", ".env", ".gitignore", ".sql"
];

interface FileContent {
  path: string;
  content: string;
  size: number;
  mimeType: string;
  lastModified: number;
}

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
  fileContents?: FileContent[];
}

function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    ".md": "text/markdown",
    ".txt": "text/plain",
    ".json": "application/json",
    ".js": "text/javascript",
    ".ts": "text/typescript",
    ".tsx": "text/tsx",
    ".jsx": "text/jsx",
    ".css": "text/css",
    ".scss": "text/scss",
    ".html": "text/html",
    ".yaml": "text/yaml",
    ".yml": "text/yaml",
    ".toml": "text/toml",
    ".py": "text/x-python",
    ".sh": "text/x-shellscript",
    ".env": "text/plain",
    ".gitignore": "text/plain",
    ".sql": "text/x-sql",
  };
  return mimeTypes[extension] || "text/plain";
}

/**
 * Read file contents for storage in Convex
 * Returns null if file can't be read or is too large/binary
 */
function readFileForStorage(filePath: string): FileContent | null {
  try {
    // Resolve the full path
    let fullPath = filePath;
    if (!path.isAbsolute(filePath)) {
      fullPath = path.resolve(WORKSPACE_ROOT, filePath);
    }
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return null;
    }
    
    const stats = fs.statSync(fullPath);
    
    // Skip directories
    if (stats.isDirectory()) {
      console.warn(`⚠️  Skipping directory: ${filePath}`);
      return null;
    }
    
    // Check file size
    if (stats.size > MAX_FILE_SIZE) {
      console.warn(`⚠️  File too large (${Math.round(stats.size / 1024)}KB > ${MAX_FILE_SIZE / 1024}KB): ${filePath}`);
      return null;
    }
    
    // Check extension
    const ext = path.extname(fullPath).toLowerCase();
    if (!TEXT_EXTENSIONS.includes(ext) && ext !== "") {
      console.warn(`⚠️  Skipping binary file: ${filePath}`);
      return null;
    }
    
    // Read file content
    const content = fs.readFileSync(fullPath, "utf-8");
    
    // Get the relative path for storage
    let relativePath = filePath;
    if (fullPath.startsWith(WORKSPACE_ROOT)) {
      relativePath = fullPath.slice(WORKSPACE_ROOT.length + 1);
    }
    
    return {
      path: relativePath,
      content,
      size: stats.size,
      mimeType: getMimeType(ext),
      lastModified: stats.mtimeMs
    };
  } catch (error) {
    console.warn(`⚠️  Failed to read file ${filePath}: ${error}`);
    return null;
  }
}

/**
 * Read all related files and return their contents
 */
function readRelatedFiles(filePaths: string[]): FileContent[] {
  const contents: FileContent[] = [];
  
  for (const filePath of filePaths) {
    const fileContent = readFileForStorage(filePath);
    if (fileContent) {
      contents.push(fileContent);
      console.log(`📄 Stored file: ${fileContent.path} (${Math.round(fileContent.size / 1024)}KB)`);
    }
  }
  
  return contents;
}

/**
 * Log an activity to Mission Control
 * Automatically reads and stores file contents for relatedFiles
 */
export async function logActivity(activity: ActivityLog) {
  try {
    // Read file contents if there are related files and no contents provided
    let fileContents = activity.fileContents;
    if (activity.relatedFiles && activity.relatedFiles.length > 0 && !fileContents) {
      console.log(`📂 Reading ${activity.relatedFiles.length} related file(s)...`);
      fileContents = readRelatedFiles(activity.relatedFiles);
    }
    
    await client.mutation(api.activities.log, {
      ...activity,
      fileContents: fileContents && fileContents.length > 0 ? fileContents : undefined,
    });
    console.log(`✅ Logged activity: ${activity.title}${fileContents ? ` (with ${fileContents.length} file(s))` : ""}`);
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

/**
 * ==========================================
 * USAGE TRACKING FUNCTIONS
 * ==========================================
 */

interface UsageEvent {
  model: string;
  tokensIn: number;
  tokensOut: number;
  sessionId?: string;
  activityType?: string;
  metadata?: any;
  timestamp?: number;
}

/**
 * Log a single usage event to Mission Control
 */
export async function logUsage(event: UsageEvent) {
  try {
    await client.mutation(api.usage.logUsage, event);
    console.log(`📊 Logged usage: ${event.model} - ${event.tokensIn}in/${event.tokensOut}out`);
  } catch (error) {
    console.error(`❌ Failed to log usage: ${error}`);
  }
}

/**
 * Log multiple usage events in batch
 */
export async function logUsageBatch(events: UsageEvent[]) {
  try {
    await client.mutation(api.usage.logUsageBatch, { events });
    console.log(`📊 Logged ${events.length} usage events`);
  } catch (error) {
    console.error(`❌ Failed to log usage batch: ${error}`);
  }
}

/**
 * Parse a session JSONL file and extract usage data
 */
interface ParsedUsage {
  model: string;
  tokensIn: number;
  tokensOut: number;
  timestamp: number;
  sessionId: string;
}

async function parseSessionJSONL(filePath: string): Promise<ParsedUsage[]> {
  const usageEvents: ParsedUsage[] = [];
  const sessionId = path.basename(filePath, ".jsonl");
  
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    
    rl.on("line", (line) => {
      try {
        const entry = JSON.parse(line);
        
        // Look for assistant messages with usage data
        if (entry.role === "assistant" && entry.usage) {
          const usage = entry.usage;
          const model = entry.model || "unknown";
          
          usageEvents.push({
            model,
            tokensIn: usage.input_tokens || usage.prompt_tokens || 0,
            tokensOut: usage.output_tokens || usage.completion_tokens || 0,
            timestamp: entry.timestamp || Date.now(),
            sessionId,
          });
        }
        
        // Also check for completion entries
        if (entry.type === "completion" || entry.type === "response") {
          const usage = entry.usage || entry.response?.usage;
          if (usage) {
            usageEvents.push({
              model: entry.model || entry.response?.model || "unknown",
              tokensIn: usage.input_tokens || usage.prompt_tokens || 0,
              tokensOut: usage.output_tokens || usage.completion_tokens || 0,
              timestamp: entry.timestamp || Date.now(),
              sessionId,
            });
          }
        }
      } catch (e) {
        // Skip invalid lines
      }
    });
    
    rl.on("close", () => resolve(usageEvents));
    rl.on("error", reject);
  });
}

/**
 * Scan a directory of session files and log all usage
 */
export async function importUsageFromSessions(
  sessionDir: string,
  options: {
    since?: number;  // Only process files modified after this timestamp
    dryRun?: boolean;
  } = {}
) {
  console.log(`🔍 Scanning sessions in ${sessionDir}...`);
  
  const files = fs.readdirSync(sessionDir);
  const jsonlFiles = files.filter(f => f.endsWith(".jsonl"));
  
  console.log(`📁 Found ${jsonlFiles.length} session files`);
  
  let totalEvents = 0;
  const allEvents: UsageEvent[] = [];
  
  for (const file of jsonlFiles) {
    const filePath = path.join(sessionDir, file);
    const stat = fs.statSync(filePath);
    
    // Skip files older than 'since' timestamp
    if (options.since && stat.mtimeMs < options.since) {
      continue;
    }
    
    try {
      const events = await parseSessionJSONL(filePath);
      
      if (events.length > 0) {
        console.log(`  📄 ${file}: ${events.length} usage events`);
        allEvents.push(...events);
        totalEvents += events.length;
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${file}: ${error}`);
    }
  }
  
  console.log(`\n📊 Total events found: ${totalEvents}`);
  
  if (options.dryRun) {
    console.log("🔍 Dry run - not logging to database");
    console.log("Sample events:", allEvents.slice(0, 3));
    return;
  }
  
  if (allEvents.length > 0) {
    // Log in batches of 100
    for (let i = 0; i < allEvents.length; i += 100) {
      const batch = allEvents.slice(i, i + 100);
      await logUsageBatch(batch);
    }
    console.log(`✅ Logged ${allEvents.length} usage events to Mission Control`);
  }
}

/**
 * Get usage stats summary for CLI
 */
async function getUsageStats() {
  try {
    const stats = await client.query(api.usage.getCurrentMonthStats, {});
    const totalCost = await client.query(api.usage.getTotalCost, {});
    
    console.log("\n📊 Usage Stats:");
    console.log("================");
    console.log(`Total Spent (All Time): $${totalCost.toFixed(2)}`);
    console.log(`Current Month: $${stats.currentMonthCost.toFixed(2)}`);
    console.log(`Daily Burn Rate: $${stats.dailyBurnRate.toFixed(2)}/day`);
    console.log(`Projected Monthly: $${stats.projectedMonthly.toFixed(2)}`);
    console.log(`Input Tokens: ${(stats.totalTokensIn / 1_000_000).toFixed(2)}M`);
    console.log(`Output Tokens: ${(stats.totalTokensOut / 1_000_000).toFixed(2)}M`);
  } catch (error) {
    console.error(`❌ Failed to get usage stats: ${error}`);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "log") {
    const title = args[1];
    const description = args[2];
    const category = args[3] || "general";
    
    // Parse optional flags
    const statusFlag = args.find(arg => arg.startsWith("--status"));
    const tagsFlag = args.find(arg => arg.startsWith("--tags"));
    const durationFlag = args.find(arg => arg.startsWith("--duration"));
    const filesFlag = args.find(arg => arg.startsWith("--files"));
    
    const status = statusFlag ? args[args.indexOf(statusFlag) + 1] : "completed";
    const tags = tagsFlag ? args[args.indexOf(tagsFlag) + 1]?.split(",") : undefined;
    const duration = durationFlag ? parseInt(args[args.indexOf(durationFlag) + 1]) : undefined;
    const files = filesFlag ? args[args.indexOf(filesFlag) + 1]?.split(",") : undefined;

    logTask(title, description, category, { status, tags, duration, files }).then(() => {
      console.log("✅ Activity logged");
      process.exit(0);
    });
  } else if (command === "watch") {
    const sessionDir = args[1] || "/Users/alexismendez/.openclaw/agents/main/sessions";
    watchSessionTranscripts(sessionDir);
  } else if (command === "usage") {
    // Usage tracking commands
    const subCommand = args[1];
    
    if (subCommand === "import") {
      const sessionDir = args[2] || "/Users/alexismendez/.openclaw/agents/main/sessions";
      const dryRun = args.includes("--dry-run");
      importUsageFromSessions(sessionDir, { dryRun }).then(() => process.exit(0));
    } else if (subCommand === "log") {
      // Manual usage log: usage log <model> <tokensIn> <tokensOut> [activityType]
      const model = args[2] || "claude-sonnet-4";
      const tokensIn = parseInt(args[3]) || 0;
      const tokensOut = parseInt(args[4]) || 0;
      const activityType = args[5];
      
      logUsage({ model, tokensIn, tokensOut, activityType }).then(() => process.exit(0));
    } else if (subCommand === "stats") {
      getUsageStats().then(() => process.exit(0));
    } else {
      console.log("Usage tracking commands:");
      console.log("  openclaw-logger.ts usage import [sessionDir] [--dry-run]");
      console.log("  openclaw-logger.ts usage log <model> <tokensIn> <tokensOut> [activityType]");
      console.log("  openclaw-logger.ts usage stats");
      process.exit(0);
    }
  } else {
    console.log("Usage:");
    console.log('  openclaw-logger.ts log "Title" "Description" "category"');
    console.log("  openclaw-logger.ts watch [sessionDir]");
    console.log("  openclaw-logger.ts usage import [sessionDir] [--dry-run]");
    console.log("  openclaw-logger.ts usage log <model> <tokensIn> <tokensOut> [activityType]");
    console.log("  openclaw-logger.ts usage stats");
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
  // Usage tracking
  logUsage,
  logUsageBatch,
  importUsageFromSessions,
};
