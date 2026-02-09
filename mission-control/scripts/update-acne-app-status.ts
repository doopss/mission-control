#!/usr/bin/env ts-node
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL not set");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function updateStatus() {
  const activityId = "j57e5sg19qmy5tva8b9x8jn2fx80shbb" as any; // Old blocked activity
  
  console.log("✅ Updating old 'Acne App - Supabase Credentials' to completed...\n");
  
  await client.mutation(api.kanban.updateActivityStatus, {
    activityId,
    status: "completed"
  });
  
  console.log("✨ Done! Status updated to 'completed'");
}

updateStatus().catch(console.error);
