"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Sidebar, { TabId } from "@/components/Sidebar";
import ActivityFeed from "@/components/ActivityFeed";
import CalendarView from "@/components/CalendarView";
import KanbanView from "@/components/KanbanView";
import GlobalSearch from "@/components/GlobalSearch";
import UsageView from "@/components/UsageView";
import CronJobsView from "@/components/CronJobsView";
import CreateTaskModal from "@/components/CreateTaskModal";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Home() {
  return (
    <ConvexProvider client={convex}>
      <MissionControl />
    </ConvexProvider>
  );
}

function MissionControl() {
  const [activeTab, setActiveTab] = useState<TabId>("feed");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleTabChange = (tab: TabId) => {
    if (tab === "search") {
      setSearchOpen(true);
      setActiveTab("search");
    } else if (tab === "settings") {
      // Settings can open a modal or redirect
      // For now, just show an alert or navigate
      setActiveTab("settings");
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="h-screen bg-[#0D0D0D] text-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-[60px] bg-[#0D0D0D] border-b border-[#2D2D2D] flex items-center justify-between px-4 flex-shrink-0 z-50">
        {/* Left: Hamburger + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#1A1A1A] transition-colors text-[#9CA3AF] hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#00D4AA] to-[#00B894] rounded-lg flex items-center justify-center shadow-lg shadow-[#00D4AA]/20">
              <span className="text-lg">🚀</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">Mission Control</h1>
              <p className="text-xs text-[#6B7280] -mt-0.5">HueleBicho Dashboard</p>
            </div>
          </div>
        </div>

        {/* Right: Search + Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab("search");
              setSearchOpen(true);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#1A1A1A] transition-colors text-[#9CA3AF] hover:text-white"
          >
            🔍
          </button>
          
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#2D2D2D] hover:border-[#00D4AA] transition-colors">
            <span className="text-sm">👤</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#0D0D0D]">
          <div className="p-6 max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "feed" && <ActivityFeed />}
                {activeTab === "calendar" && <CalendarView />}
                {activeTab === "kanban" && (
                  <KanbanView onNewTask={() => setIsCreateModalOpen(true)} />
                )}
                {activeTab === "search" && <GlobalSearch />}
                {activeTab === "cron" && <CronJobsView />}
                {activeTab === "settings" && <SettingsView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#00D4AA] hover:bg-[#00B894] rounded-full flex items-center justify-center shadow-lg shadow-[#00D4AA]/30 transition-colors z-40"
      >
        <span className="text-2xl text-[#0D0D0D] font-bold">+</span>
      </motion.button>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

// Simple Settings View placeholder
function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">⚙️</span>
          Settings
        </h2>
        <p className="text-sm text-[#9CA3AF] mt-1">
          Configure your Mission Control preferences
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Theme Card */}
        <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            🎨 Theme
          </h3>
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30 rounded-lg font-medium">
              Dark
            </button>
            <button className="flex-1 py-3 bg-[#2D2D2D] text-[#9CA3AF] rounded-lg font-medium opacity-50 cursor-not-allowed">
              Light (Soon)
            </button>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            🔔 Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-[#9CA3AF]">Task reminders</span>
              <div className="w-12 h-6 bg-[#00D4AA] rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </label>
            <label className="flex items-center justify-between">
              <span className="text-[#9CA3AF]">Cron job alerts</span>
              <div className="w-12 h-6 bg-[#00D4AA] rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </label>
          </div>
        </div>

        {/* API Connection Card */}
        <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            🔗 API Connection
          </h3>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#4ADE80] rounded-full animate-pulse" />
            <span className="text-[#4ADE80] font-medium">Connected to Convex</span>
          </div>
          <p className="text-sm text-[#6B7280] mt-2">
            Real-time sync enabled. Data updates automatically.
          </p>
        </div>
      </div>

      {/* Version Info */}
      <div className="text-center py-8 border-t border-[#2D2D2D]">
        <p className="text-[#6B7280] text-sm">
          Mission Control v2.0 • Built with Next.js, Convex & Framer Motion
        </p>
      </div>
    </div>
  );
}
