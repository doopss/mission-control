#!/usr/bin/env ts-node
/**
 * Log Acne App completion activities to Mission Control
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL not set in environment");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function logActivities() {
  console.log("📊 Logging Acne App activities to Mission Control...\n");

  const activities = [
    {
      type: "development",
      title: "Acne App - Supabase Setup Complete",
      description: "Configured Supabase credentials, applied database migrations (6 tables + RLS policies). Database fully operational.",
      category: "development",
      status: "completed",
      duration: 15,
      relatedFiles: [
        "acne-app-backend/supabase/migrations/20260208_initial_schema_fixed.sql",
        "acne-app-backend/.env.local"
      ],
      tags: ["acne-app", "supabase", "backend", "database"],
      metadata: {
        project: "acne_app",
        completedAt: Date.now() - 3 * 60 * 1000, // 3 minutes ago
      },
    },
    {
      type: "development",
      title: "Acne App - React Native Development Complete",
      description: "Complete Expo app with 7 features: onboarding, camera, AI analysis (Gemini 2.0 Flash), product recommendations, progress tracking, auth, profile. K-beauty themed UI. Pushed to GitHub.",
      category: "development",
      status: "completed",
      duration: 11,
      relatedFiles: [
        "acne_app/app/",
        "acne_app/supabase/",
        "acne_app/README.md"
      ],
      tags: ["acne-app", "react-native", "expo", "frontend", "opus"],
      metadata: {
        project: "acne_app",
        subAgent: "opus",
        completedAt: Date.now() - 5 * 60 * 1000, // 5 minutes ago
        githubRepo: "https://github.com/doopss/acne_app",
      },
    },
  ];

  for (const activity of activities) {
    try {
      const result = await client.mutation(api.activities.log, activity);
      console.log(`✅ Logged: ${activity.title}`);
      console.log(`   ID: ${result}\n`);
    } catch (error) {
      console.error(`❌ Failed to log: ${activity.title}`);
      console.error(`   Error: ${error}\n`);
    }
  }

  console.log("✨ Done!");
}

logActivities().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
