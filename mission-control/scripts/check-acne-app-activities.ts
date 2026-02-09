#!/usr/bin/env ts-node
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL not set");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function checkActivities() {
  const activities = await client.query(api.activities.list, { limit: 100 });
  
  const acneAppActivities = activities.filter(a => 
    a.title.toLowerCase().includes("acne") || 
    (a.tags && a.tags.some((t: string) => t.includes("acne")))
  );

  console.log(`\n📊 Found ${acneAppActivities.length} Acne App activities:\n`);
  
  for (const activity of acneAppActivities) {
    console.log(`Title: ${activity.title}`);
    console.log(`Status: ${activity.status}`);
    console.log(`ID: ${activity._id}`);
    console.log(`Timestamp: ${new Date(activity.timestamp).toLocaleString()}`);
    console.log(`---\n`);
  }
}

checkActivities().catch(console.error);
