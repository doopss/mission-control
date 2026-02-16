"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { motion } from "framer-motion";
import CardDetailModal, { CardData } from "./CardDetailModal";

// v2.0 Design System Colors
const categoryColors: Record<string, { bg: string; text: string; color: string }> = {
  development: { bg: "bg-[#00D4AA]/20", text: "text-[#00D4AA]", color: "#00D4AA" },
  research: { bg: "bg-[#A855F7]/20", text: "text-[#A855F7]", color: "#A855F7" },
  communication: { bg: "bg-[#4ADE80]/20", text: "text-[#4ADE80]", color: "#4ADE80" },
  analysis: { bg: "bg-[#FFD93D]/20", text: "text-[#FFD93D]", color: "#FFD93D" },
  documentation: { bg: "bg-[#EC4899]/20", text: "text-[#EC4899]", color: "#EC4899" },
  planning: { bg: "bg-[#3B82F6]/20", text: "text-[#3B82F6]", color: "#3B82F6" },
  design: { bg: "bg-[#F97316]/20", text: "text-[#F97316]", color: "#F97316" },
  testing: { bg: "bg-[#EF4444]/20", text: "text-[#EF4444]", color: "#EF4444" },
};

const defaultCategoryStyle = { bg: "bg-[#6B7280]/20", text: "text-[#6B7280]", color: "#6B7280" };

const categoryIcons: Record<string, string> = {
  development: "💻",
  research: "🔍",
  communication: "💬",
  analysis: "📊",
  documentation: "📝",
  planning: "📋",
  design: "🎨",
  testing: "🧪",
};

// Convert activity data to CardData for the modal
function activityToCardData(activity: any): CardData {
  return {
    id: activity._id,
    type: "activity",
    title: activity.title,
    description: activity.description,
    category: activity.category,
    timestamp: activity.timestamp,
    status: activity.status,
    relatedFiles: activity.relatedFiles,
    tags: activity.tags,
    duration: activity.duration,
    metadata: activity.metadata,
    fileContents: activity.fileContents,
  };
}

export default function ActivityFeed() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [selectedActivity, setSelectedActivity] = useState<CardData | null>(null);

  const activities = useQuery(api.activities.list, {
    limit: 100,
    category: selectedCategory,
  });

  const stats = useQuery(api.activities.stats);

  if (!activities || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#9CA3AF]">Loading activities...</div>
        </div>
      </div>
    );
  }

  const categories = Object.keys(stats.byCategory);

  return (
    <div className="space-y-6">
      {/* Detail Modal */}
      {selectedActivity && (
        <CardDetailModal
          card={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">🏠</span>
          Activity Feed
        </h2>
        <p className="text-sm text-[#9CA3AF] mt-1">
          Recent operations and completed tasks
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Activities"
          value={stats.total}
          icon="📊"
          color="#00D4AA"
        />
        <StatCard
          title="Last 24 Hours"
          value={stats.last24h}
          icon="⏰"
          color="#3B82F6"
        />
        <StatCard
          title="Last Week"
          value={stats.lastWeek}
          icon="📈"
          color="#A855F7"
        />
        <StatCard
          title="Categories"
          value={categories.length}
          icon="🏷️"
          color="#FFD93D"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(undefined)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !selectedCategory
              ? "bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30"
              : "bg-[#1A1A1A] text-[#9CA3AF] hover:text-white border border-[#2D2D2D]"
          }`}
        >
          All Activities
        </button>
        {categories.map((category) => {
          const style = categoryColors[category] || defaultCategoryStyle;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                selectedCategory === category
                  ? `${style.bg} ${style.text} border border-current/30`
                  : "bg-[#1A1A1A] text-[#9CA3AF] hover:text-white border border-[#2D2D2D]"
              }`}
            >
              {categoryIcons[category] || "📌"} {category} ({stats.byCategory[category]})
            </button>
          );
        })}
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          Activity Timeline
          <span className="text-xs text-[#6B7280] font-normal">• Click for details</span>
        </h3>

        {activities.length === 0 ? (
          <div className="text-center py-12 bg-[#1A1A1A] rounded-xl border border-[#2D2D2D]">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-white mb-2">No activities logged yet</h3>
            <p className="text-[#9CA3AF]">Activities will appear here as you work</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <motion.div
                key={activity._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
              >
                <ActivityCard 
                  activity={activity} 
                  onClick={() => setSelectedActivity(activityToCardData(activity))}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div
      className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-4 hover:border-[#3D3D3D] transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <div className="text-sm text-[#9CA3AF]">{title}</div>
      <div 
        className="h-1 rounded-full mt-3 opacity-30"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function ActivityCard({ activity, onClick }: { activity: any; onClick: () => void }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(activity.timestamp);
  const timeAgo = getTimeAgo(activity.timestamp);

  const style = categoryColors[activity.category] || defaultCategoryStyle;
  const categoryIcon = categoryIcons[activity.category] || "📌";

  return (
    <div 
      className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-4 hover:border-[#3D3D3D] transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text} capitalize`}>
              {categoryIcon} {activity.category}
            </span>
            <span className="text-xs text-[#6B7280]">{timeAgo}</span>
            {activity.status && (
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  activity.status === "completed"
                    ? "bg-[#4ADE80]/20 text-[#4ADE80]"
                    : activity.status === "in_progress"
                    ? "bg-[#FFD93D]/20 text-[#FFD93D]"
                    : activity.status === "blocked"
                    ? "bg-[#FF6B4A]/20 text-[#FF6B4A]"
                    : "bg-[#6B7280]/20 text-[#6B7280]"
                }`}
              >
                {activity.status}
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold text-white mb-1 line-clamp-2">
            {activity.title}
          </h3>

          <p className="text-sm text-[#9CA3AF] line-clamp-2">{activity.description}</p>

          {expanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 pt-3 border-t border-[#2D2D2D] space-y-2"
            >
              {activity.duration && (
                <div className="text-sm text-[#9CA3AF]">
                  ⏱️ Duration: {activity.duration} minutes
                </div>
              )}

              {activity.relatedFiles && activity.relatedFiles.length > 0 && (
                <div className="text-sm">
                  <div className="text-[#9CA3AF] mb-1">📁 Related Files:</div>
                  <div className="space-y-1">
                    {activity.relatedFiles.map((file: string, i: number) => (
                      <div
                        key={i}
                        className="text-xs text-[#00D4AA] font-mono bg-[#0D0D0D] px-2 py-1 rounded truncate"
                      >
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activity.tags && activity.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {activity.tags.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 bg-[#2D2D2D] text-[#9CA3AF] rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="text-[#6B7280] hover:text-white transition-colors ml-4 p-1.5 hover:bg-[#2D2D2D] rounded"
        >
          {expanded ? "▼" : "▶"}
        </button>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2D2D2D]/50">
        <div className="text-xs text-[#6B7280]">
          {date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="text-xs text-[#00D4AA] hover:text-[#00B894] hover:underline font-medium"
        >
          View details →
        </button>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
}
