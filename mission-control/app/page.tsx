"use client";

import { useState } from "react";
import ActivityFeed from "@/components/ActivityFeed";
import CalendarView from "@/components/CalendarView";
import KanbanView from "@/components/KanbanView";
import GlobalSearch from "@/components/GlobalSearch";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Home() {
  return (
    <ConvexProvider client={convex}>
      <MissionControl />
    </ConvexProvider>
  );
}

function MissionControl() {
  const [activeTab, setActiveTab] = useState<"feed" | "calendar" | "kanban" | "search">(
    "feed"
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mission Control</h1>
                <p className="text-sm text-zinc-400">
                  HueleBicho Activity Dashboard
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveTab("feed")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "feed"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                📊 Activity Feed
              </button>
              <button
                onClick={() => setActiveTab("calendar")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "calendar"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                📅 Calendar
              </button>
              <button
                onClick={() => setActiveTab("kanban")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "kanban"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                📋 Kanban
              </button>
              <button
                onClick={() => setActiveTab("search")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "search"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                🔍 Search
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === "feed" && <ActivityFeed />}
        {activeTab === "calendar" && <CalendarView />}
        {activeTab === "kanban" && <KanbanView />}
        {activeTab === "search" && <GlobalSearch />}
      </main>
    </div>
  );
}
