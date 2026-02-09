#!/usr/bin/env ts-node

/**
 * CLI script to log activities to Mission Control
 * 
 * Usage:
 *   npx ts-node scripts/log-activity.ts \
 *     --title "Task completed" \
 *     --description "Built the thing" \
 *     --category development \
 *     --status completed \
 *     --duration 60 \
 *     --files "src/index.ts,src/app.ts" \
 *     --tags "backend,api"
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const args = process.argv.slice(2);

function getArg(name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  if (index === -1 || index === args.length - 1) return undefined;
  return args[index + 1];
}

function getArrayArg(name: string): string[] | undefined {
  const value = getArg(name);
  if (!value) return undefined;
  return value.split(",").map((s) => s.trim());
}

async function main() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.error("Error: NEXT_PUBLIC_CONVEX_URL not set in environment");
    process.exit(1);
  }

  const client = new ConvexHttpClient(convexUrl);

  const title = getArg("title");
  const description = getArg("description");
  const category = getArg("category") || "general";
  const type = getArg("type") || "task_completed";
  const status = getArg("status");
  const durationStr = getArg("duration");
  const duration = durationStr ? parseInt(durationStr, 10) : undefined;
  const relatedFiles = getArrayArg("files");
  const tags = getArrayArg("tags");

  if (!title || !description) {
    console.error("Error: --title and --description are required");
    console.log("\nUsage:");
    console.log('  --title "Task title"');
    console.log('  --description "Task description"');
    console.log('  --category development|research|communication|analysis|documentation');
    console.log('  --type task_completed|file_created|research_done (optional)');
    console.log('  --status completed|in_progress|blocked (optional)');
    console.log("  --duration 60 (in minutes, optional)");
    console.log('  --files "file1.ts,file2.ts" (optional)');
    console.log('  --tags "tag1,tag2" (optional)');
    process.exit(1);
  }

  try {
    await client.mutation(api.activities.log, {
      type,
      title,
      description,
      category,
      status,
      duration,
      relatedFiles,
      tags,
    });

    console.log("✅ Activity logged successfully!");
    console.log(`Title: ${title}`);
    console.log(`Category: ${category}`);
    if (status) console.log(`Status: ${status}`);
    if (duration) console.log(`Duration: ${duration} minutes`);
  } catch (error) {
    console.error("❌ Error logging activity:", error);
    process.exit(1);
  }
}

main();
