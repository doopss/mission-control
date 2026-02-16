#!/usr/bin/env ts-node
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.OPENCLAW_LOGGER_CONVEX_URL || "https://diligent-tortoise-263.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

async function queryActivities(startDate: string, endDate: string) {
  try {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate + "T23:59:59").getTime();
    
    console.log(`\n🔍 Querying activities from ${startDate} to ${endDate}...`);
    console.log(`Using Convex URL: ${CONVEX_URL}\n`);
    
    // Get all activities (there's no date filter in the schema, so we fetch recent and filter)
    const activities = await client.query(api.activities.list, { limit: 100 });
    
    // Filter by timestamp
    const filtered = activities.filter((a: any) => {
      const timestamp = a._creationTime || a.timestamp || 0;
      return timestamp >= start && timestamp <= end;
    });
    
    console.log(`📊 Found ${filtered.length} activities:\n`);
    
    filtered.forEach((activity: any) => {
      const date = new Date(activity._creationTime || activity.timestamp);
      console.log(`[${date.toISOString()}]`);
      console.log(`  Title: ${activity.title}`);
      console.log(`  Type: ${activity.type}`);
      console.log(`  Category: ${activity.category}`);
      console.log(`  Status: ${activity.status}`);
      if (activity.relatedFiles?.length) {
        console.log(`  Files: ${activity.relatedFiles.join(", ")}`);
      }
      console.log("");
    });
    
    return filtered;
  } catch (error) {
    console.error(`❌ Failed to query activities: ${error}`);
    throw error;
  }
}

const startDate = process.argv[2] || "2026-02-15";
const endDate = process.argv[3] || "2026-02-16";

queryActivities(startDate, endDate).then(() => process.exit(0));
