"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  nextRun: string;
  model: string;
  enabled: boolean;
  prompt?: string;
  channel?: string;
}

export default function CronJobsView() {
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCronJobs();
  }, []);

  const fetchCronJobs = async () => {
    try {
      setLoading(true);
      // Try to fetch from OpenClaw gateway
      const response = await fetch('/api/cron-jobs');
      if (response.ok) {
        const data = await response.json();
        setCronJobs(data.jobs || []);
      } else {
        // Fallback: Show sample data for demo
        setCronJobs([
          {
            id: "1",
            name: "Morning Work Summary",
            schedule: "0 7 * * *",
            nextRun: "Tomorrow 7:00 AM",
            model: "sonnet",
            enabled: true,
            prompt: "Summarize pending tasks and priorities for the day",
          },
          {
            id: "2",
            name: "Daily Task List",
            schedule: "0 8 * * *",
            nextRun: "Tomorrow 8:00 AM",
            model: "sonnet",
            enabled: true,
            prompt: "Generate and send daily task list",
          },
          {
            id: "3",
            name: "Market Digest",
            schedule: "0 9 * * 1-5",
            nextRun: "Tomorrow 9:00 AM",
            model: "opus",
            enabled: false,
            prompt: "Analyze and summarize market trends",
          },
          {
            id: "4",
            name: "Weekly Review",
            schedule: "0 18 * * 5",
            nextRun: "Friday 6:00 PM",
            model: "sonnet",
            enabled: true,
            prompt: "Generate weekly progress report",
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch cron jobs:", err);
      setError("Could not connect to OpenClaw Gateway");
      // Still show sample data
      setCronJobs([
        {
          id: "1",
          name: "Morning Work Summary",
          schedule: "0 7 * * *",
          nextRun: "Tomorrow 7:00 AM",
          model: "sonnet",
          enabled: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleJob = async (jobId: string) => {
    setCronJobs(jobs =>
      jobs.map(job =>
        job.id === jobId ? { ...job, enabled: !job.enabled } : job
      )
    );
    // TODO: Call API to actually toggle the job
  };

  const parseSchedule = (schedule: string): string => {
    const parts = schedule.split(" ");
    if (parts.length !== 5) return schedule;
    
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    
    // Simple parsing
    if (dayOfWeek === "1-5") {
      return `Weekdays at ${hour}:${minute.padStart(2, "0")}`;
    }
    if (dayOfWeek === "*" && dayOfMonth === "*" && month === "*") {
      return `Daily at ${hour}:${minute.padStart(2, "0")}`;
    }
    if (dayOfWeek === "5") {
      return `Fridays at ${hour}:${minute.padStart(2, "0")}`;
    }
    return schedule;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#9CA3AF]">Loading cron jobs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">⏰</span>
            Cron Jobs
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-1">
            {cronJobs.length} scheduled job{cronJobs.length !== 1 ? "s" : ""}
            {error && <span className="text-[#FF6B4A] ml-2">• {error}</span>}
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-[#00D4AA] hover:bg-[#00B894] text-[#0D0D0D] rounded-lg transition-colors font-semibold">
          <span>+</span>
          New Job
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {cronJobs.length === 0 ? (
          <div className="text-center py-12 bg-[#1A1A1A] rounded-xl border border-[#2D2D2D]">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-white mb-2">No cron jobs configured</h3>
            <p className="text-[#9CA3AF]">
              Create a cron job to schedule recurring tasks
            </p>
          </div>
        ) : (
          cronJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-5 hover:border-[#3D3D3D] transition-all ${
                !job.enabled ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">🕐</span>
                    <h3 className="text-lg font-semibold text-white">{job.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
                    <span className="flex items-center gap-1">
                      <span className="text-[#6B7280]">📆</span>
                      {parseSchedule(job.schedule)}
                    </span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      job.enabled 
                        ? "bg-[#4ADE80]/20 text-[#4ADE80]" 
                        : "bg-[#6B7280]/20 text-[#6B7280]"
                    }`}>
                      {job.enabled ? "Enabled" : "Disabled"}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 bg-[#00D4AA]/10 text-[#00D4AA] rounded text-xs font-medium">
                      {job.model}
                    </span>
                  </div>
                  
                  {job.prompt && (
                    <p className="mt-3 text-sm text-[#6B7280] line-clamp-1">
                      {job.prompt}
                    </p>
                  )}
                  
                  <div className="mt-3 text-xs text-[#6B7280]">
                    Next run: <span className="text-[#9CA3AF]">{job.nextRun}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleJob(job.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      job.enabled ? "bg-[#00D4AA]" : "bg-[#2D2D2D]"
                    }`}
                  >
                    <motion.div
                      animate={{ x: job.enabled ? 24 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                    />
                  </button>
                  
                  {/* Edit */}
                  <button className="p-2 text-[#9CA3AF] hover:text-white hover:bg-[#2D2D2D] rounded-lg transition-colors">
                    ✏️
                  </button>
                  
                  {/* Delete */}
                  <button className="p-2 text-[#9CA3AF] hover:text-[#FF6B4A] hover:bg-[#FF6B4A]/10 rounded-lg transition-colors">
                    🗑️
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Info Card */}
      <div className="bg-[#0D0D0D] border border-[#2D2D2D] rounded-xl p-5">
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <span>💡</span>
          About Cron Jobs
        </h4>
        <p className="text-sm text-[#6B7280]">
          Cron jobs are scheduled tasks managed by OpenClaw Gateway. They run automatically at specified times
          and can use different AI models. Use the{" "}
          <code className="px-1.5 py-0.5 bg-[#1A1A1A] rounded text-[#00D4AA] text-xs">
            openclaw cron
          </code>{" "}
          command to manage jobs from the terminal.
        </p>
      </div>
    </div>
  );
}
