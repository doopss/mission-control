"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import CardDetailModal, { CardData } from "./CardDetailModal";

const categoryColors: Record<string, string> = {
  development: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  research: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  communication: "bg-green-500/20 text-green-400 border-green-500/30",
  analysis: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  documentation: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

const categoryIcons: Record<string, string> = {
  development: "💻",
  research: "🔍",
  communication: "💬",
  analysis: "📊",
  documentation: "📝",
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
        <div className="text-zinc-400">Loading activities...</div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Activities"
          value={stats.total}
          icon="📊"
          color="emerald"
        />
        <StatCard
          title="Last 24 Hours"
          value={stats.last24h}
          icon="⏰"
          color="blue"
        />
        <StatCard
          title="Last Week"
          value={stats.lastWeek}
          icon="📈"
          color="purple"
        />
        <StatCard
          title="Categories"
          value={categories.length}
          icon="🏷️"
          color="yellow"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(undefined)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            !selectedCategory
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          All Activities
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedCategory === category
                ? categoryColors[category] || "bg-zinc-700 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            } border`}
          >
            {categoryIcons[category] || "📌"} {category} (
            {stats.byCategory[category]})
          </button>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-zinc-200">
          Activity Timeline
          <span className="text-sm text-zinc-500 ml-2 font-normal">• Click any activity for details</span>
        </h2>

        {activities.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <div className="text-6xl mb-4">📭</div>
            <p>No activities logged yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <ActivityCard 
                key={activity._id} 
                activity={activity} 
                onClick={() => setSelectedActivity(activityToCardData(activity))}
              />
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
  const colorClasses: Record<string, string> = {
    emerald: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30",
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    yellow: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-4`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <div className="text-sm text-zinc-300">{title}</div>
    </div>
  );
}

function ActivityCard({ activity, onClick }: { activity: any; onClick: () => void }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(activity.timestamp);
  const timeAgo = getTimeAgo(activity.timestamp);

  const categoryColor =
    categoryColors[activity.category] || "bg-zinc-700 text-white";
  const categoryIcon = categoryIcons[activity.category] || "📌";

  return (
    <div 
      className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 rounded text-xs border ${categoryColor}`}
            >
              {categoryIcon} {activity.category}
            </span>
            <span className="text-xs text-zinc-500">{timeAgo}</span>
            {activity.status && (
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  activity.status === "completed"
                    ? "bg-green-500/20 text-green-400"
                    : activity.status === "in_progress"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {activity.status}
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-white mb-1">
            {activity.title}
          </h3>

          <p className="text-sm text-zinc-400 mb-2">{activity.description}</p>

          {expanded && (
            <div className="mt-3 space-y-2">
              {activity.duration && (
                <div className="text-sm text-zinc-400">
                  ⏱️ Duration: {activity.duration} minutes
                </div>
              )}

              {activity.relatedFiles && activity.relatedFiles.length > 0 && (
                <div className="text-sm">
                  <div className="text-zinc-400 mb-1">📁 Related Files:</div>
                  <div className="space-y-1">
                    {activity.relatedFiles.map((file: string, i: number) => (
                      <div
                        key={i}
                        className="text-xs text-emerald-400 font-mono bg-zinc-800 px-2 py-1 rounded"
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
                      className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="text-zinc-500 hover:text-white transition-colors ml-4 p-1 hover:bg-zinc-800 rounded"
        >
          {expanded ? "▼" : "▶"}
        </button>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-zinc-600">
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
          className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline"
        >
          View details →
        </button>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
