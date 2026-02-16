"use client";

import { motion, AnimatePresence } from "framer-motion";

export type TabId = "feed" | "kanban" | "calendar" | "cron" | "search" | "settings";

interface SidebarProps {
  isCollapsed: boolean;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const navItems: { id: TabId; icon: string; label: string }[] = [
  { id: "feed", icon: "🏠", label: "Feed" },
  { id: "kanban", icon: "📋", label: "Kanban" },
  { id: "calendar", icon: "📅", label: "Calendar" },
  { id: "cron", icon: "⏰", label: "Cron Jobs" },
  { id: "search", icon: "🔍", label: "Search" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

export default function Sidebar({ isCollapsed, activeTab, onTabChange }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full bg-[#0D0D0D] border-r border-[#2D2D2D] flex flex-col py-4 overflow-hidden"
    >
      <nav className="flex-1 flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "bg-[#00D4AA]/10 text-[#00D4AA]"
                  : "text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A]"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00D4AA] rounded-r-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A1A1A] text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-[#2D2D2D]">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section - Version/Status */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-4 py-2 border-t border-[#2D2D2D] mt-2"
          >
            <div className="text-xs text-[#6B7280]">
              Mission Control v2.0
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
