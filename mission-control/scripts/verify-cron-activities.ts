#!/usr/bin/env npx tsx
import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL not found in .env.local");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function verifyCronActivities() {
  console.log("🔍 Checking for cron job activities in Convex...\n");

  try {
    // Query activities with automation category
    const activities = await client.query("activities:list" as any, {
      category: "automation",
      limit: 100,
    });

    const cronActivities = activities.filter((a: any) => 
      a.tags?.includes("cron")
    );

    console.log(`✅ Found ${cronActivities.length} cron job activities:\n`);

    for (const activity of cronActivities) {
      const tags = activity.tags?.join(", ") || "none";
      const timestamp = new Date(activity.timestamp).toLocaleString();
      console.log(`  📅 ${activity.title}`);
      console.log(`     Status: ${activity.status || "unknown"}`);
      console.log(`     Tags: ${tags}`);
      console.log(`     Created: ${timestamp}`);
      console.log();
    }

    // Expected cron jobs
    const expectedJobs = [
      "daily-wake-up-call",
      "daily-end-of-day-summary",
      "Morning Work Summary",
      "daily-task-list",
      "daily-market-digest",
      "daily-twitter-intelligence",
      "competitor-tracker-friday",
      "competitor-tracker-monday",
      "weekly-memory-review",
    ];

    const foundJobs = cronActivities.map((a: any) => 
      a.title.replace("Cron Job: ", "")
    );

    console.log("📊 Summary:");
    console.log(`   Expected: ${expectedJobs.length} cron jobs`);
    console.log(`   Found: ${cronActivities.length} cron job activities`);

    const missing = expectedJobs.filter(job => 
      !foundJobs.includes(job)
    );

    if (missing.length > 0) {
      console.log(`\n⚠️  Missing cron jobs:`);
      missing.forEach(job => console.log(`   - ${job}`));
    } else {
      console.log(`\n✅ All 9 cron jobs are logged!`);
    }

  } catch (error) {
    console.error("❌ Error querying Convex:", error);
    process.exit(1);
  }
}

verifyCronActivities();
