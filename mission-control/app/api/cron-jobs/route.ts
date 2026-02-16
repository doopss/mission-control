import { NextResponse } from "next/server";

// Gateway API configuration
const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:3000";
const GATEWAY_TOKEN = process.env.GATEWAY_TOKEN;

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
    // Call OpenClaw Gateway cron list API via HTTP
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (GATEWAY_TOKEN) {
      headers["Authorization"] = `Bearer ${GATEWAY_TOKEN}`;
    }

    const response = await fetch(`${GATEWAY_URL}/api/cron/list`, {
      method: "POST",
      headers,
      body: JSON.stringify({ includeDisabled: true }),
    });

    if (!response.ok) {
      throw new Error(`Gateway returned ${response.status}`);
    }

    const data = await response.json();

    // Transform Gateway format to UI format
    const jobs = (data.jobs || []).map((job: any) => ({
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

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (GATEWAY_TOKEN) {
      headers["Authorization"] = `Bearer ${GATEWAY_TOKEN}`;
    }

    // Call Gateway update API
    const response = await fetch(`${GATEWAY_URL}/api/cron/update`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jobId,
        patch: {
          enabled: action === "enable",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gateway returned ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating cron job:", error);
    return NextResponse.json(
      { error: "Failed to update cron job" },
      { status: 500 }
    );
  }
}
