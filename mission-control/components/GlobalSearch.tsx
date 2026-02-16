"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { motion } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";
import CardDetailModal, { CardData } from "./CardDetailModal";

// v2.0 Design System Colors
const categoryColors: Record<string, { bg: string; text: string }> = {
  development: { bg: "bg-[#00D4AA]/20", text: "text-[#00D4AA]" },
  research: { bg: "bg-[#A855F7]/20", text: "text-[#A855F7]" },
  communication: { bg: "bg-[#4ADE80]/20", text: "text-[#4ADE80]" },
  analysis: { bg: "bg-[#FFD93D]/20", text: "text-[#FFD93D]" },
  documentation: { bg: "bg-[#EC4899]/20", text: "text-[#EC4899]" },
  planning: { bg: "bg-[#3B82F6]/20", text: "text-[#3B82F6]" },
  design: { bg: "bg-[#F97316]/20", text: "text-[#F97316]" },
  testing: { bg: "bg-[#EF4444]/20", text: "text-[#EF4444]" },
};

const defaultCategoryStyle = { bg: "bg-[#6B7280]/20", text: "text-[#6B7280]" };

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

// Convert task data to CardData for the modal
function taskToCardData(task: any): CardData {
  return {
    id: task._id,
    type: "task",
    title: task.title,
    description: task.description || "",
    category: task.category,
    timestamp: task._creationTime || task.scheduledFor,
    status: task.status,
    priority: task.priority,
    relatedFiles: task.relatedFiles,
    tags: task.tags,
    scheduledFor: task.scheduledFor,
    metadata: task.metadata,
  };
}

// Convert document data to CardData for the modal
function documentToCardData(doc: any): CardData {
  return {
    id: doc._id,
    type: "activity",
    title: doc.title,
    description: `📁 ${doc.path}\n\n**File Type:** ${doc.type} | **Size:** ${(doc.size / 1024).toFixed(1)} KB\n\n---\n\n${doc.content.substring(0, 500)}${doc.content.length > 500 ? '...' : ''}`,
    category: "documentation",
    timestamp: doc.lastModified,
    status: "completed",
    tags: doc.tags || [doc.type, "workspace-file"],
    relatedFiles: [doc.path],
    fileContents: [
      {
        path: doc.path,
        content: doc.content,
        size: doc.size,
        mimeType: getMimeTypeFromType(doc.type),
        lastModified: doc.lastModified,
      }
    ],
    metadata: {
      fileType: doc.type,
      filePath: doc.path,
    }
  };
}

function getMimeTypeFromType(type: string): string {
  const mimeTypes: Record<string, string> = {
    md: "text/markdown",
    txt: "text/plain",
    json: "application/json",
    js: "text/javascript",
    ts: "text/typescript",
    tsx: "text/tsx",
    jsx: "text/jsx",
    css: "text/css",
    html: "text/html",
    py: "text/x-python",
    sh: "text/x-shellscript",
  };
  return mimeTypes[type] || "text/plain";
}

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | "documents" | "tasks">("all");
  const [selectedItem, setSelectedItem] = useState<CardData | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  const documentResults = useQuery(
    api.documents.search,
    debouncedQuery.length >= 2 ? { query: debouncedQuery } : "skip"
  );

  const taskResults = useQuery(
    api.scheduledTasks.search,
    debouncedQuery.length >= 2 ? { query: debouncedQuery } : "skip"
  );

  const activityResults = useQuery(
    api.activities.search,
    debouncedQuery.length >= 2 ? { query: debouncedQuery } : "skip"
  );

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
    searchType === "all" || searchType === "documents" ? documentResults || [] : [];
  const filteredTasks =
    searchType === "all" || searchType === "tasks" ? taskResults || [] : [];

  const totalResults =
    (documentResults?.length || 0) +
    (taskResults?.length || 0) +
    (activityResults?.length || 0);

  return (
    <div className="space-y-6">
      {/* Detail Modal */}
      {selectedItem && (
        <CardDetailModal
          card={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">🔍</span>
          Global Search
        </h2>
        <p className="text-sm text-[#9CA3AF] mt-1">
          Search across all memories, documents, and tasks
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search memories, documents, tasks..."
          className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-4 py-4 pl-12 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#00D4AA] transition-colors text-lg"
          autoFocus
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-xl">
          🔍
        </span>

        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors p-1 hover:bg-[#2D2D2D] rounded"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2">
        <button
          onClick={() => setSearchType("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            searchType === "all"
              ? "bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30"
              : "bg-[#1A1A1A] text-[#9CA3AF] hover:text-white border border-[#2D2D2D]"
          }`}
        >
          All Results
        </button>
        <button
          onClick={() => setSearchType("documents")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            searchType === "documents"
              ? "bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30"
              : "bg-[#1A1A1A] text-[#9CA3AF] hover:text-white border border-[#2D2D2D]"
          }`}
        >
          📝 Documents
        </button>
        <button
          onClick={() => setSearchType("tasks")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            searchType === "tasks"
              ? "bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30"
              : "bg-[#1A1A1A] text-[#9CA3AF] hover:text-white border border-[#2D2D2D]"
          }`}
        >
          ✅ Tasks
        </button>
      </div>

      {/* Results Count */}
      {hasQuery && (
        <div className="text-sm text-[#9CA3AF]">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
              Searching...
            </span>
          ) : (
            <span>
              {totalResults} result{totalResults !== 1 ? "s" : ""} for "{searchQuery}"
            </span>
          )}
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {/* Recent Documents (no search) */}
        {!hasQuery && recentDocuments && recentDocuments.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              📚 Recent Documents
              <span className="ml-2 px-2 py-0.5 bg-[#6B7280]/20 text-[#6B7280] text-xs rounded-full">
                {recentDocuments.length}
              </span>
            </h3>
            <div className="space-y-2">
              {recentDocuments.map((doc, index) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <DocumentCard
                    document={doc}
                    onClick={() => setSelectedItem(documentToCardData(doc))}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {hasQuery && !isLoading && totalResults === 0 && (
          <div className="text-center py-12 bg-[#1A1A1A] rounded-xl border border-[#2D2D2D]">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
            <p className="text-[#9CA3AF]">Try different keywords or check your spelling</p>
          </div>
        )}

        {/* Document Results */}
        {hasQuery && !isLoading && filteredDocuments.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              📁 Workspace Files
              <span className="ml-2 px-2 py-0.5 bg-[#EC4899]/20 text-[#EC4899] text-xs rounded-full">
                {documentResults?.length || 0}
              </span>
            </h3>
            <div className="space-y-2">
              {filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <DocumentCard
                    document={doc}
                    highlight={searchQuery}
                    onClick={() => setSelectedItem(documentToCardData(doc))}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Task Results */}
        {hasQuery && !isLoading && filteredTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              ✅ Tasks
              <span className="ml-2 px-2 py-0.5 bg-[#4ADE80]/20 text-[#4ADE80] text-xs rounded-full">
                {taskResults?.length || 0}
              </span>
            </h3>
            <div className="space-y-2">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <TaskCard
                    task={task}
                    highlight={searchQuery}
                    onClick={() => setSelectedItem(taskToCardData(task))}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Results */}
        {hasQuery && !isLoading && activityResults && activityResults.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              📊 Activities
              <span className="ml-2 px-2 py-0.5 bg-[#00D4AA]/20 text-[#00D4AA] text-xs rounded-full">
                {activityResults.length}
              </span>
            </h3>
            <div className="space-y-2">
              {activityResults.map((activity, index) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <ActivityCard
                    activity={activity}
                    highlight={searchQuery}
                    onClick={() => setSelectedItem(activityToCardData(activity))}
                  />
                </motion.div>
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
  onClick,
}: {
  document: any;
  highlight?: string;
  onClick: () => void;
}) {
  const typeIcons: Record<string, string> = {
    md: "📝",
    txt: "📄",
    json: "📋",
    js: "💛",
    ts: "💙",
    tsx: "💙",
    jsx: "💛",
    css: "🎨",
    html: "🌐",
    py: "🐍",
    sh: "⚡",
  };

  const typeColors: Record<string, string> = {
    md: "bg-[#3B82F6]/20 text-[#3B82F6]",
    txt: "bg-[#6B7280]/20 text-[#6B7280]",
    json: "bg-[#FFD93D]/20 text-[#FFD93D]",
    js: "bg-[#FFD93D]/20 text-[#FFD93D]",
    ts: "bg-[#3B82F6]/20 text-[#3B82F6]",
    tsx: "bg-[#3B82F6]/20 text-[#3B82F6]",
    jsx: "bg-[#FFD93D]/20 text-[#FFD93D]",
    css: "bg-[#EC4899]/20 text-[#EC4899]",
    html: "bg-[#F97316]/20 text-[#F97316]",
    py: "bg-[#4ADE80]/20 text-[#4ADE80]",
    sh: "bg-[#A855F7]/20 text-[#A855F7]",
  };

  const excerpt = getExcerpt(document.content, highlight);

  return (
    <div
      onClick={onClick}
      className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-4 hover:border-[#3D3D3D] transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              typeColors[document.type] || "bg-[#6B7280]/20 text-[#6B7280]"
            }`}
          >
            {typeIcons[document.type] || "📌"} {document.type}
          </span>
          <span className="text-xs text-[#6B7280]">
            {new Date(document.lastModified).toLocaleDateString()}
          </span>
        </div>
      </div>

      <h4 className="text-white font-semibold mb-1">{document.title}</h4>
      <p className="text-sm text-[#6B7280] mb-2 font-mono truncate">{document.path}</p>

      {excerpt && (
        <div
          className="text-sm text-[#9CA3AF] line-clamp-2"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      )}

      {document.tags && document.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mt-2">
          {document.tags.slice(0, 3).map((tag: string, i: number) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-[#2D2D2D] text-[#9CA3AF] rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskCard({
  task,
  highlight,
  onClick,
}: {
  task: any;
  highlight?: string;
  onClick: () => void;
}) {
  const priorityColors = {
    high: { bg: "bg-[#FF6B4A]/20", text: "text-[#FF6B4A]" },
    medium: { bg: "bg-[#FFD93D]/20", text: "text-[#FFD93D]" },
    low: { bg: "bg-[#3B82F6]/20", text: "text-[#3B82F6]" },
  };

  const style = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium;

  return (
    <div
      onClick={onClick}
      className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-4 hover:border-[#3D3D3D] transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text} uppercase`}>
          {task.priority} priority
        </span>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            task.status === "completed"
              ? "bg-[#4ADE80]/20 text-[#4ADE80]"
              : task.status === "pending"
              ? "bg-[#FFD93D]/20 text-[#FFD93D]"
              : "bg-[#FF6B4A]/20 text-[#FF6B4A]"
          }`}
        >
          {task.status}
        </span>
      </div>

      <h4 className="text-white font-semibold mb-1">{task.title}</h4>
      <p className="text-sm text-[#9CA3AF] mb-3 line-clamp-2">{task.description}</p>

      <div className="text-xs text-[#6B7280]">
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
  onClick,
}: {
  activity: any;
  highlight?: string;
  onClick: () => void;
}) {
  const style = categoryColors[activity.category] || defaultCategoryStyle;

  return (
    <div
      onClick={onClick}
      className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-4 hover:border-[#3D3D3D] transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text} capitalize`}>
          {activity.category}
        </span>
        <span className="text-xs text-[#6B7280]">
          {new Date(activity.timestamp).toLocaleDateString()}
        </span>
        {activity.status && (
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              activity.status === "completed"
                ? "bg-[#4ADE80]/20 text-[#4ADE80]"
                : activity.status === "in_progress"
                ? "bg-[#FFD93D]/20 text-[#FFD93D]"
                : "bg-[#FF6B4A]/20 text-[#FF6B4A]"
            }`}
          >
            {activity.status}
          </span>
        )}
      </div>

      <h4 className="text-white font-semibold mb-1">{activity.title}</h4>
      <p className="text-sm text-[#9CA3AF] line-clamp-2">{activity.description}</p>

      {activity.relatedFiles && activity.relatedFiles.length > 0 && (
        <div className="mt-2 text-xs text-[#6B7280]">
          📁 {activity.relatedFiles.length} file{activity.relatedFiles.length !== 1 ? "s" : ""}
        </div>
      )}
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

  const regex = new RegExp(`(${highlight})`, "gi");
  excerpt = excerpt.replace(
    regex,
    '<span class="bg-[#FFD93D]/30 text-[#FFD93D] px-1 rounded">$1</span>'
  );

  return excerpt;
}
