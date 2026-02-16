import { NextResponse } from "next/server";

// This endpoint would normally connect to OpenClaw Gateway
// For now, return sample data
export async function GET() {
  try {
    // In production, this would call OpenClaw Gateway API
    // const response = await fetch('http://localhost:4242/api/cron');
    
    // Sample data for demonstration
    const jobs = [
      {
        id: "1",
        name: "Morning Work Summary",
        schedule: "0 7 * * *",
        nextRun: "Tomorrow 7:00 AM",
        model: "sonnet",
        enabled: true,
        prompt: "Summarize pending tasks and priorities for the day",
        channel: "telegram",
      },
      {
        id: "2",
        name: "Daily Task List",
        schedule: "0 8 * * *",
        nextRun: "Tomorrow 8:00 AM",
        model: "sonnet",
        enabled: true,
        prompt: "Generate and send daily task list",
        channel: "telegram",
      },
      {
        id: "3",
        name: "Market Digest",
        schedule: "0 9 * * 1-5",
        nextRun: "Tomorrow 9:00 AM",
        model: "opus",
        enabled: false,
        prompt: "Analyze and summarize market trends",
        channel: "telegram",
      },
      {
        id: "4",
        name: "Weekly Review",
        schedule: "0 18 * * 5",
        nextRun: "Friday 6:00 PM",
        model: "sonnet",
        enabled: true,
        prompt: "Generate weekly progress report",
        channel: "telegram",
      },
    ];

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching cron jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch cron jobs", jobs: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In production, this would create a cron job via OpenClaw Gateway
    console.log("Create cron job:", body);
    
    return NextResponse.json({ success: true, id: Date.now().toString() });
  } catch (error) {
    console.error("Error creating cron job:", error);
    return NextResponse.json(
      { error: "Failed to create cron job" },
      { status: 500 }
    );
  }
}
