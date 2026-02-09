"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | "documents" | "tasks">(
    "all"
  );

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Search documents
  const documentResults = useQuery(
    api.documents.search,
    debouncedQuery.length >= 2
      ? { query: debouncedQuery }
      : "skip"
  );

  // Search tasks
  const taskResults = useQuery(
    api.scheduledTasks.search,
    debouncedQuery.length >= 2
      ? { query: debouncedQuery }
      : "skip"
  );

  // Search activities
  const activityResults = useQuery(
    api.activities.search,
    debouncedQuery.length >= 2
      ? { query: debouncedQuery }
      : "skip"
  );

  // Get recent documents if no search query
  const recentDocuments = useQuery(
    api.documents.recent,
    debouncedQuery.length < 2 ? { limit: 10 } : "skip"
  );

  const isLoading =
    documentResults === undefined ||
    taskResults === undefined ||
    activityResults === undefined;

  const hasQuery = debouncedQuery.length >= 2;

  const filteredDocuments =
    searchType === "all" || searchType === "documents"
      ? documentResults || []
      : [];
  const filteredTasks =
    searchType === "all" || searchType === "tasks" ? taskResults || [] : [];

  const totalResults =
    (documentResults?.length || 0) +
    (taskResults?.length || 0) +
    (activityResults?.length || 0);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories, documents, tasks..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 pl-12 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            autoFocus
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xl">
            🔍
          </span>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          <button
            onClick={() => setSearchType("all")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              searchType === "all"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setSearchType("documents")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              searchType === "documents"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            📝 Documents
          </button>
          <button
            onClick={() => setSearchType("tasks")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              searchType === "tasks"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            ✅ Tasks
          </button>
        </div>

        {/* Results Count */}
        {hasQuery && (
          <div className="text-sm text-zinc-400">
            {isLoading ? (
              <span>Searching...</span>
            ) : (
              <span>
                {totalResults} result{totalResults !== 1 ? "s" : ""} for "
                {searchQuery}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-6">
        {!hasQuery && recentDocuments && recentDocuments.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              📚 Recent Documents
            </h3>
            <div className="space-y-2">
              {recentDocuments.map((doc) => (
                <DocumentCard key={doc._id} document={doc} />
              ))}
            </div>
          </div>
        )}

        {hasQuery && !isLoading && totalResults === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-zinc-400 mb-2">No results found</p>
            <p className="text-sm text-zinc-500">
              Try different keywords or check your spelling
            </p>
          </div>
        )}

        {hasQuery && !isLoading && filteredDocuments.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              📝 Documents ({documentResults?.length || 0})
            </h3>
            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  document={doc}
                  highlight={searchQuery}
                />
              ))}
            </div>
          </div>
        )}

        {hasQuery && !isLoading && filteredTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              ✅ Tasks ({taskResults?.length || 0})
            </h3>
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <TaskCard key={task._id} task={task} highlight={searchQuery} />
              ))}
            </div>
          </div>
        )}

        {hasQuery &&
          !isLoading &&
          activityResults &&
          activityResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                📊 Activities ({activityResults.length})
              </h3>
              <div className="space-y-2">
                {activityResults.map((activity) => (
                  <ActivityCard
                    key={activity._id}
                    activity={activity}
                    highlight={searchQuery}
                  />
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

function DocumentCard({
  document,
  highlight,
}: {
  document: any;
  highlight?: string;
}) {
  const typeIcons: Record<string, string> = {
    memory: "🧠",
    document: "📄",
    code: "💻",
    notes: "📝",
  };

  const typeColors: Record<string, string> = {
    memory: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    document: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    code: "bg-green-500/20 text-green-400 border-green-500/30",
    notes: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  const excerpt = getExcerpt(document.content, highlight);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-xs border ${
              typeColors[document.type] || "bg-zinc-700 text-white"
            }`}
          >
            {typeIcons[document.type] || "📌"} {document.type}
          </span>
          <span className="text-xs text-zinc-500">
            {new Date(document.lastModified).toLocaleDateString()}
          </span>
        </div>
      </div>

      <h4 className="text-white font-semibold mb-1">{document.title}</h4>

      <p className="text-sm text-zinc-400 mb-2 font-mono">{document.path}</p>

      {excerpt && (
        <div
          className="text-sm text-zinc-300"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      )}

      {document.tags && document.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mt-2">
          {document.tags.map((tag: string, i: number) => (
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
  );
}

function TaskCard({ task, highlight }: { task: any; highlight?: string }) {
  const priorityColors = {
    high: "text-red-400",
    medium: "text-yellow-400",
    low: "text-blue-400",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <span
          className={`text-sm font-medium ${
            priorityColors[task.priority as keyof typeof priorityColors]
          }`}
        >
          {task.priority.toUpperCase()} PRIORITY
        </span>
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            task.status === "completed"
              ? "bg-green-500/20 text-green-400"
              : task.status === "pending"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {task.status}
        </span>
      </div>

      <h4 className="text-white font-semibold mb-1">{task.title}</h4>
      <p className="text-sm text-zinc-400 mb-2">{task.description}</p>

      <div className="text-xs text-zinc-500">
        Scheduled for{" "}
        {new Date(task.scheduledFor).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

function ActivityCard({
  activity,
  highlight,
}: {
  activity: any;
  highlight?: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {activity.category}
        </span>
        <span className="text-xs text-zinc-500">
          {new Date(activity.timestamp).toLocaleDateString()}
        </span>
      </div>

      <h4 className="text-white font-semibold mb-1">{activity.title}</h4>
      <p className="text-sm text-zinc-400">{activity.description}</p>
    </div>
  );
}

function getExcerpt(content: string, highlight?: string): string {
  if (!highlight) {
    return content.slice(0, 200) + (content.length > 200 ? "..." : "");
  }

  const index = content.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) {
    return content.slice(0, 200) + (content.length > 200 ? "..." : "");
  }

  const start = Math.max(0, index - 100);
  const end = Math.min(content.length, index + highlight.length + 100);
  let excerpt = content.slice(start, end);

  if (start > 0) excerpt = "..." + excerpt;
  if (end < content.length) excerpt = excerpt + "...";

  // Highlight the search term
  const regex = new RegExp(`(${highlight})`, "gi");
  excerpt = excerpt.replace(
    regex,
    '<span class="bg-yellow-500/30 text-yellow-300 px-1 rounded">$1</span>'
  );

  return excerpt;
}
