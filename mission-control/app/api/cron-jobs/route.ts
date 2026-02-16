import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Format next run timestamp as human-readable string
function formatNextRun(nextRunAtMs: number): string {
  const now = Date.now();
  const diff = nextRunAtMs - now;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 1) {
    return `in ${days}d`;
  } else if (hours > 1) {
    return `in ${hours}h`;
  } else if (hours === 1) {
    return "in 1h";
  } else {
    return "soon";
  }
}

// Extract model from payload
function extractModel(payload: any): string {
  if (payload?.model) {
    const model = payload.model.toLowerCase();
    if (model.includes("opus")) return "opus";
    if (model.includes("sonnet")) return "sonnet";
    if (model.includes("haiku")) return "haiku";
    return model;
  }
  return "default";
}

export async function GET() {
  try {
    // Call OpenClaw Gateway cron list API
    const { stdout } = await execAsync("openclaw cron list --json");
    const data = JSON.parse(stdout);
    
    // Transform Gateway format to UI format
    const jobs = data.jobs.map((job: any) => ({
      id: job.id,
      name: job.name,
      description: job.description,
      schedule: job.schedule?.expr || "unknown",
      timezone: job.schedule?.tz || "America/New_York",
      nextRun: job.state?.nextRunAtMs ? formatNextRun(job.state.nextRunAtMs) : "not scheduled",
      nextRunTimestamp: job.state?.nextRunAtMs,
      model: extractModel(job.payload),
      enabled: job.enabled,
      prompt: job.payload?.message,
      channel: job.delivery?.channel || "telegram",
      agentId: job.agentId || "default",
      sessionTarget: job.sessionTarget || "isolated",
    }));

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching cron jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch cron jobs from Gateway", jobs: [] },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { jobId, action } = body;
    
    if (!jobId || !action) {
      return NextResponse.json(
        { error: "Missing jobId or action" },
        { status: 400 }
      );
    }
    
    let command = "";
    if (action === "enable") {
      command = `openclaw cron enable ${jobId}`;
    } else if (action === "disable") {
      command = `openclaw cron disable ${jobId}`;
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'enable' or 'disable'" },
        { status: 400 }
      );
    }
    
    await execAsync(command);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating cron job:", error);
    return NextResponse.json(
      { error: "Failed to update cron job" },
      { status: 500 }
    );
  }
}
