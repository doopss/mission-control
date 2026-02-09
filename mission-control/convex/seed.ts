import { mutation } from "./_generated/server";

// Seed the database with today's actual work (2026-02-08)
export const seedTodaysWork = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const today = new Date(2026, 1, 8); // Feb 8, 2026
    
    // Helper to get timestamp for today at specific time
    const getTime = (hour: number, minute: number = 0) => {
      const d = new Date(today);
      d.setHours(hour, minute, 0, 0);
      return d.getTime();
    };

    // COMPLETED ACTIVITIES (DONE column)
    const completedActivities = [
      {
        timestamp: getTime(7, 12),
        type: "communication_sent",
        title: "Morning Market Digest",
        description: "Crypto + stock market summary for Alex & Benjamin. BTC ~$68.9K (-1.4%), ETH ~$2,080 (+2.0%), NVIDIA +7.87%",
        category: "communication",
        status: "completed",
        duration: 15,
        tags: ["market-digest", "crypto", "stocks", "daily"],
      },
      {
        timestamp: getTime(9, 20),
        type: "file_created",
        title: "Acne App Database Schema",
        description: "Designed complete Supabase schema with 6 tables, RLS policies, and performance indexes",
        category: "development",
        status: "completed",
        duration: 45,
        relatedFiles: ["/workspace/acne-app-backend/supabase/migrations/20260208_initial_schema.sql"],
        tags: ["acne-app", "database", "supabase"],
      },
      {
        timestamp: getTime(10, 0),
        type: "task_completed",
        title: "Mission Control Dashboard Built",
        description: "Created full NextJS dashboard with Activity Feed, Calendar View, and Global Search features",
        category: "development",
        status: "completed",
        duration: 120,
        relatedFiles: [
          "/workspace/mission-control/app/page.tsx",
          "/workspace/mission-control/components/ActivityFeed.tsx",
          "/workspace/mission-control/components/CalendarView.tsx",
          "/workspace/mission-control/components/GlobalSearch.tsx"
        ],
        tags: ["nextjs", "convex", "dashboard", "mission-control"],
      },
      {
        timestamp: getTime(11, 17),
        type: "research_completed",
        title: "Acne Product Database v2 (Opus)",
        description: "Compiled 100 products (vs 50) across all budget tiers, philosophies, with affiliate URLs and effectiveness ratings",
        category: "research",
        status: "completed",
        duration: 420, // 7 minutes but deep research
        relatedFiles: ["/workspace/acne-app-product-database-v2.json"],
        tags: ["opus", "acne-app", "product-research", "skincare"],
      },
      {
        timestamp: getTime(11, 15),
        type: "file_created",
        title: "Budge TikTok Scripts (Opus)",
        description: "10 fully-scripted videos with second-by-second timing, emotional arcs, and strategy framework",
        category: "documentation",
        status: "completed",
        duration: 280, // 5 minutes but comprehensive
        relatedFiles: ["/workspace/budge-tiktok-scripts-opus.md"],
        tags: ["opus", "budge", "tiktok", "content-strategy"],
      },
      {
        timestamp: getTime(11, 17),
        type: "file_created",
        title: "Pet Psychic Launch Plan (Opus)",
        description: "56KB comprehensive 14-day launch plan with 3-hour quickstart, 25+ content pieces, and influencer templates",
        category: "documentation",
        status: "completed",
        duration: 360, // 6 minutes
        relatedFiles: ["/workspace/pet-psychic-14-day-launch-plan.md"],
        tags: ["opus", "pet-psychic", "marketing", "launch-plan"],
      },
      {
        timestamp: getTime(15, 10),
        type: "task_completed",
        title: "Mission Control Integration System",
        description: "Built auto-logging system with CLI interface, examples, and session transcript watcher",
        category: "development",
        status: "completed",
        duration: 60,
        relatedFiles: [
          "/workspace/mission-control/scripts/openclaw-logger.ts",
          "/workspace/mission-control/scripts/integration-examples.md",
          "/workspace/mission-control/INTEGRATION.md"
        ],
        tags: ["mission-control", "logging", "integration"],
      },
      {
        timestamp: getTime(15, 11),
        type: "file_created",
        title: "Pet Psychic Content Assets (Opus)",
        description: "5 Instagram carousels (40 slides), 10 sample readings, 3 TikTok storyboards, complete design system",
        category: "documentation",
        status: "completed",
        duration: 240, // 4 minutes
        relatedFiles: ["/workspace/pet-psychic-visual-content-assets.md"],
        tags: ["opus", "pet-psychic", "content", "design"],
      },
      {
        timestamp: getTime(16, 13),
        type: "task_completed",
        title: "Kanban Board Added to Mission Control",
        description: "Built full Kanban view with drag-drop, auto-categorization, and mobile responsive design",
        category: "development",
        status: "completed",
        duration: 150, // 2.5 minutes
        relatedFiles: [
          "/workspace/mission-control/components/KanbanView.tsx",
          "/workspace/mission-control/convex/kanban.ts"
        ],
        tags: ["mission-control", "kanban", "opus"],
      },
      {
        timestamp: getTime(10, 20),
        type: "research_completed",
        title: "Acne Product Database v1 (Sonnet)",
        description: "Initial 50-product database (later upgraded by Opus to 100)",
        category: "research",
        status: "completed",
        duration: 120,
        relatedFiles: ["/workspace/acne-app-product-database.json"],
        tags: ["sonnet", "acne-app", "products"],
      },
      {
        timestamp: getTime(10, 35),
        type: "file_created",
        title: "Budge TikTok Scripts v1 (Sonnet)",
        description: "Initial 10 TikTok scripts (later upgraded by Opus)",
        category: "documentation",
        status: "completed",
        duration: 90,
        relatedFiles: ["/workspace/budge-tiktok-scripts.md"],
        tags: ["sonnet", "budge", "tiktok"],
      },
      {
        timestamp: getTime(10, 45),
        type: "file_created",
        title: "Pet Psychic Action Plan v1 (Sonnet)",
        description: "Initial 14-day launch plan (later upgraded by Opus)",
        category: "documentation",
        status: "completed",
        duration: 60,
        relatedFiles: ["/workspace/pet-psychic-action-plan.md"],
        tags: ["sonnet", "pet-psychic", "planning"],
      },
    ];

    for (const activity of completedActivities) {
      await ctx.db.insert("activities", activity);
    }

    // IN PROGRESS ACTIVITIES (NOW column)
    const inProgressActivities = [
      {
        timestamp: getTime(17, 20),
        type: "task_in_progress",
        title: "Seeding Mission Control with Today's Work",
        description: "Populating dashboard with all completed activities and scheduled tasks",
        category: "development",
        status: "in_progress",
        tags: ["mission-control", "seed-data"],
      },
    ];

    for (const activity of inProgressActivities) {
      await ctx.db.insert("activities", activity);
    }

    // BLOCKED ACTIVITIES (BLOCKED column)
    const blockedActivities = [
      {
        timestamp: getTime(9, 15),
        type: "task_blocked",
        title: "Mission Control - Convex Setup",
        description: "Dashboard fully built, waiting for Convex account setup (COMPLETED NOW)",
        category: "development",
        status: "blocked",
        tags: ["mission-control", "convex", "setup"],
        metadata: { blocker: "Needs browser + account setup", resolved: true },
      },
      {
        timestamp: getTime(9, 20),
        type: "task_blocked",
        title: "Acne App - Supabase Credentials",
        description: "Backend schema complete, need Supabase project credentials to proceed",
        category: "development",
        status: "blocked",
        tags: ["acne-app", "supabase", "credentials"],
        metadata: { blocker: "Waiting for Alex's decision on Supabase account" },
      },
      {
        timestamp: getTime(10, 0),
        type: "task_blocked",
        title: "Budge QA - Functional Testing",
        description: "Code review complete, waiting for Alex to run app for functional testing",
        category: "analysis",
        status: "blocked",
        relatedFiles: ["/workspace/budge-qa-report.md"],
        tags: ["budge", "qa", "testing"],
        metadata: { blocker: "Need Alex to run app on device" },
      },
    ];

    for (const activity of blockedActivities) {
      await ctx.db.insert("activities", activity);
    }

    // SCHEDULED TASKS (NOW and NEXT columns)
    const tomorrow = now + 24 * 60 * 60 * 1000;
    const dayAfter = now + 2 * 24 * 60 * 60 * 1000;
    const nextWeek = now + 7 * 24 * 60 * 60 * 1000;

    const scheduledTasks = [
      // NOW (within 24h)
      {
        title: "Deploy Mission Control to Vercel",
        description: "Set up Vercel deployment for remote access on mobile",
        scheduledFor: now + 2 * 60 * 60 * 1000, // 2 hours from now
        status: "pending",
        priority: "high",
        category: "development",
        estimatedDuration: 30,
        tags: ["mission-control", "deployment", "vercel"],
      },
      {
        title: "Daily Market Digest",
        description: "Send crypto + stock market summary to Alex & Benjamin",
        scheduledFor: tomorrow + 7 * 60 * 60 * 1000, // Tomorrow 7 AM
        status: "pending",
        priority: "high",
        category: "communication",
        estimatedDuration: 20,
        recurrence: "daily",
        tags: ["market-digest", "recurring", "morning"],
      },
      {
        title: "Set Up Supabase Project",
        description: "Once Alex decides, configure Supabase for acne app backend",
        scheduledFor: tomorrow + 10 * 60 * 60 * 1000, // Tomorrow 10 AM
        status: "pending",
        priority: "high",
        category: "development",
        estimatedDuration: 60,
        tags: ["acne-app", "supabase", "backend"],
      },
      {
        title: "Budge Functional Testing",
        description: "Complete QA testing once Alex runs the app",
        scheduledFor: tomorrow + 14 * 60 * 60 * 1000, // Tomorrow 2 PM
        status: "pending",
        priority: "medium",
        category: "analysis",
        estimatedDuration: 90,
        tags: ["budge", "qa", "testing"],
      },

      // NEXT (2-7 days)
      {
        title: "Acne App Backend Development",
        description: "Build API endpoints, integrate Gemini AI, wire up product recommendations",
        scheduledFor: dayAfter + 9 * 60 * 60 * 1000, // Day after tomorrow
        status: "pending",
        priority: "high",
        category: "development",
        estimatedDuration: 240, // 4 hours
        tags: ["acne-app", "backend", "api"],
      },
      {
        title: "FlareGuard Deep-Dive",
        description: "Flesh out chronic pain app - full product specs, wireframes, MVP scope",
        scheduledFor: dayAfter + 15 * 60 * 60 * 1000,
        status: "pending",
        priority: "medium",
        category: "research",
        estimatedDuration: 180, // 3 hours
        tags: ["flare-guard", "product-spec", "research"],
      },
      {
        title: "Pet Psychic Content Creation",
        description: "Create Instagram carousels in Figma/Canva using design specs",
        scheduledFor: dayAfter + 2 * 24 * 60 * 60 * 1000, // 4 days from now
        status: "pending",
        priority: "medium",
        category: "documentation",
        estimatedDuration: 120,
        tags: ["pet-psychic", "content", "design"],
      },
      {
        title: "Budge Marketing Execution",
        description: "Film TikTok videos, start influencer outreach, launch social accounts",
        scheduledFor: dayAfter + 3 * 24 * 60 * 60 * 1000, // 5 days from now
        status: "pending",
        priority: "medium",
        category: "communication",
        estimatedDuration: 180,
        tags: ["budge", "marketing", "tiktok"],
      },
      {
        title: "Update MEMORY.md",
        description: "Review daily logs, distill key learnings, update long-term memory",
        scheduledFor: nextWeek,
        status: "pending",
        priority: "low",
        category: "documentation",
        estimatedDuration: 30,
        recurrence: "weekly",
        tags: ["memory", "maintenance", "weekly"],
      },
      {
        title: "Acne App Frontend Build",
        description: "Start React Native app with Expo once backend is live",
        scheduledFor: nextWeek + 2 * 24 * 60 * 60 * 1000,
        status: "pending",
        priority: "high",
        category: "development",
        estimatedDuration: 360, // 6 hours
        tags: ["acne-app", "frontend", "react-native"],
      },
      {
        title: "Weekly Progress Review",
        description: "Analyze completed tasks, update Kanban, plan next week",
        scheduledFor: nextWeek + 3 * 24 * 60 * 60 * 1000,
        status: "pending",
        priority: "medium",
        category: "analysis",
        estimatedDuration: 45,
        recurrence: "weekly",
        tags: ["weekly-review", "planning"],
      },
    ];

    for (const task of scheduledTasks) {
      await ctx.db.insert("scheduledTasks", task);
    }

    return {
      success: true,
      activitiesCreated: completedActivities.length + inProgressActivities.length + blockedActivities.length,
      tasksCreated: scheduledTasks.length,
      summary: {
        completed: completedActivities.length,
        inProgress: inProgressActivities.length,
        blocked: blockedActivities.length,
        scheduled: scheduledTasks.length,
      }
    };
  },
});
