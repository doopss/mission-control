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

// Mock cron jobs data (fallback when Gateway unavailable)
const MOCK_CRON_JOBS = [
  {
    id: "daily-wake-up-call",
    name: "daily-wake-up-call",
    description: "Daily wake-up call at 8 AM with market digest",
    schedule: "0 8 * * *",
    timezone: "America/New_York",
    nextRun: "tomorrow 8:00 AM",
    nextRunTimestamp: Date.now() + 24 * 60 * 60 * 1000,
    model: "sonnet",
    enabled: true,
    prompt: "Generate morning wake-up call with market digest",
    channel: "telegram",
    agentId: "main",
    sessionTarget: "isolated",
  },
  {
    id: "daily-end-of-day-summary",
    name: "daily-end-of-day-summary", 
    description: "Daily end-of-day summary call at 10 PM",
    schedule: "0 22 * * *",
    timezone: "America/New_York",
    nextRun: "tonight 10:00 PM",
    nextRunTimestamp: Date.now() + 12 * 60 * 60 * 1000,
    model: "sonnet",
    enabled: true,
    prompt: "Generate end-of-day summary call",
    channel: "telegram",
    agentId: "main",
    sessionTarget: "isolated",
  },
  {
    id: "daily-market-digest",
    name: "daily-market-digest",
    description: "Daily market digest at 9 AM",
    schedule: "0 9 * * *",
    timezone: "America/New_York",
    nextRun: "tomorrow 9:00 AM",
    nextRunTimestamp: Date.now() + 25 * 60 * 60 * 1000,
    model: "opus",
    enabled: true,
    prompt: "Execute daily market digest",
    channel: "telegram",
    agentId: "main",
    sessionTarget: "isolated",
  },
  {
    id: "daily-twitter-intelligence",
    name: "daily-twitter-intelligence",
    description: "Daily Twitter Intelligence Report at 9 AM",
    schedule: "0 9 * * *",
    timezone: "America/New_York",
    nextRun: "tomorrow 9:00 AM",
    nextRunTimestamp: Date.now() + 25 * 60 * 60 * 1000,
    model: "opus",
    enabled: true,
    prompt: "Generate Daily Twitter Intelligence Report",
    channel: "telegram",
    agentId: "main",
    sessionTarget: "isolated",
  },
  {
    id: "daily-task-list",
    name: "daily-task-list",
    description: "Daily prioritized task list at 8 AM",
    schedule: "0 8 * * *",
    timezone: "America/New_York",
    nextRun: "tomorrow 8:00 AM",
    nextRunTimestamp: Date.now() + 24 * 60 * 60 * 1000,
    model: "sonnet",
    enabled: true,
    prompt: "Execute daily-task-list skill",
    channel: "telegram",
    agentId: "main",
    sessionTarget: "isolated",
  },
  {
    id: "morning-work-summary",
    name: "Morning Work Summary",
    description: "Morning work summary at 7 AM",
    schedule: "0 7 * * *",
    timezone: "America/New_York",
    nextRun: "tomorrow 7:00 AM",
    nextRunTimestamp: Date.now() + 23 * 60 * 60 * 1000,
    model: "sonnet",
    enabled: true,
    prompt: "Generate morning work summary",
    channel: "telegram",
    agentId: "main",
    sessionTarget: "isolated",
  },
  {
    id: "weekly-memory-review",
    name: "weekly-memory-review",
    description: "Weekly memory review on Sundays at 10 AM",
    schedule: "0 10 * * 0",
    timezone: "America/New_York",
    nextRun: "Sunday 10:00 AM",
    nextRunTimestamp: Date.now() + 5 * 24 * 60 * 60 * 1000,
    model: "sonnet",
    enabled: true,
    prompt: "Execute weekly MEMORY.md review",
    channel: "telegram",
    agentId: "main",
    sessionTarget: "isolated",
  },
  {
    id: "competitor-tracker-monday",
    name: "competitor-tracker-monday",
    description: "Instagram competitor analysis - Monday delivery",
    schedule: "0 9 * * 1",
    timezone: "America/New_York",
    nextRun: "next Monday 9:00 AM",
    nextRunTimestamp: Date.now() + 6 * 24 * 60 * 60 * 1000,
    model: "sonnet",
    enabled: true,
    prompt: "Execute Instagram competitor tracking workflow",
    channel: "telegram",
    agentId: "main",
    sessionTarget: "isolated",
  },
  {
    id: "competitor-tracker-friday",
    name: "competitor-tracker-friday",
    description: "Instagram competitor analysis - Friday delivery",
    schedule: "0 9 * * 5",
    timezone: "America/New_York",
    nextRun: "next Friday 9:00 AM",
    nextRunTimestamp: Date.now() + 3 * 24 * 60 * 60 * 1000,
    model: "sonnet",
    enabled: true,
    prompt: "Execute Instagram competitor tracking workflow",
    channel: "telegram",
    agentId: "main",
    sessionTarget: "isolated",
  },
];

export async function GET() {
  try {
    // Try to call OpenClaw Gateway cron list API via HTTP
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (GATEWAY_TOKEN) {
      headers["Authorization"] = `Bearer ${GATEWAY_TOKEN}`;
    }

    // Set a short timeout for the Gateway request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(`${GATEWAY_URL}/api/cron/list`, {
        method: "POST",
        headers,
        body: JSON.stringify({ includeDisabled: true }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

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

      return NextResponse.json({ jobs, source: "gateway" });
    } catch (gatewayError) {
      // Gateway unavailable, return mock data
      console.log("Gateway unavailable, returning mock data:", gatewayError);
      return NextResponse.json({ 
        jobs: MOCK_CRON_JOBS, 
        source: "mock",
        notice: "Gateway not connected. Set GATEWAY_URL env var to enable live updates."
      });
    }
  } catch (error) {
    console.error("Error fetching cron jobs:", error);
    // Return mock data as fallback
    return NextResponse.json({ 
      jobs: MOCK_CRON_JOBS,
      source: "mock",
      notice: "Gateway not connected. Set GATEWAY_URL env var to enable live updates."
    });
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

    // Check if Gateway URL is configured
    if (!process.env.GATEWAY_URL) {
      return NextResponse.json(
        { error: "Gateway not configured. Set GATEWAY_URL env var to enable job updates." },
        { status: 503 }
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
      { error: "Failed to update cron job. Gateway may be offline." },
      { status: 503 }
    );
  }
}
