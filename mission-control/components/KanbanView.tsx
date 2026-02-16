"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useCallback, DragEvent, useRef } from "react";
import CardDetailModal, { CardData } from "./CardDetailModal";

// Types
type KanbanColumn = "backlog" | "blocked" | "now" | "next" | "done";

interface KanbanCard {
  id: string;
  type: "activity" | "task";
  title: string;
  description: string;
  category: string;
  timestamp: number;
  status?: string;
  priority?: string;
  relatedFiles?: string[];
  tags?: string[];
  duration?: number;
  scheduledFor?: number;
  column: KanbanColumn;
  metadata?: Record<string, unknown>;
  fileContents?: Array<{
    path: string;
    content: string;
    size: number;
    mimeType: string;
    lastModified: number;
  }>;
}

// Category styling
const categoryColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  development: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", icon: "💻" },
  research: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30", icon: "🔍" },
  communication: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30", icon: "💬" },
  analysis: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30", icon: "📊" },
  documentation: { bg: "bg-pink-500/20", text: "text-pink-400", border: "border-pink-500/30", icon: "📝" },
  planning: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30", icon: "📋" },
  design: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30", icon: "🎨" },
  testing: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30", icon: "🧪" },
};

const defaultCategoryStyle = { bg: "bg-zinc-500/20", text: "text-zinc-400", border: "border-zinc-500/30", icon: "📌" };

// Column config
const columnConfig: Record<KanbanColumn, { title: string; icon: string; color: string; description: string }> = {
  backlog: {
    title: "BACKLOG",
    icon: "📝",
    color: "border-zinc-500/50",
    description: "Planned but not prioritized",
  },
  blocked: {
    title: "BLOCKED",
    icon: "🚫",
    color: "border-red-500/50",
    description: "Waiting on dependencies",
  },
  now: {
    title: "NOW",
    icon: "🔥",
    color: "border-orange-500/50",
    description: "In progress or due within 24h",
  },
  next: {
    title: "NEXT",
    icon: "📋",
    color: "border-blue-500/50",
    description: "Due within 7 days",
  },
  done: {
    title: "DONE",
    icon: "✅",
    color: "border-emerald-500/50",
    description: "Completed in last 7 days",
  },
};

// Convert KanbanCard to CardData for the modal
function toCardData(card: KanbanCard): CardData {
  return {
    id: card.id,
    type: card.type,
    title: card.title,
    description: card.description,
    category: card.category,
    timestamp: card.timestamp,
    status: card.status,
    priority: card.priority,
    relatedFiles: card.relatedFiles,
    tags: card.tags,
    duration: card.duration,
    scheduledFor: card.scheduledFor,
    column: card.column,
    metadata: card.metadata,
    fileContents: card.fileContents,
  };
}

export default function KanbanView() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [draggingCard, setDraggingCard] = useState<KanbanCard | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<KanbanColumn | null>(null);

  const columns = useQuery(api.kanban.getKanbanData, {
    category: selectedCategory,
    searchQuery: searchQuery || undefined,
  });

  const categories = useQuery(api.kanban.getCategories);
  const moveCard = useMutation(api.kanban.moveCard);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>, card: KanbanCard) => {
    setDraggingCard(card);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify({ id: card.id, type: card.type }));
    
    // Add drag image styling
    if (e.currentTarget) {
      e.currentTarget.classList.add("opacity-50");
    }
  }, []);

  const handleDragEnd = useCallback((e: DragEvent<HTMLDivElement>) => {
    setDraggingCard(null);
    setDragOverColumn(null);
    if (e.currentTarget) {
      e.currentTarget.classList.remove("opacity-50");
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>, column: KanbanColumn) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(column);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>, targetColumn: KanbanColumn) => {
      e.preventDefault();
      setDragOverColumn(null);

      if (!draggingCard || draggingCard.column === targetColumn) {
        return;
      }

      try {
        await moveCard({
          cardId: draggingCard.id,
          cardType: draggingCard.type,
          targetColumn,
        });
      } catch (error) {
        console.error("Failed to move card:", error);
      }
    },
    [draggingCard, moveCard]
  );

  // Handle card click (opens detail modal)
  const handleCardClick = useCallback((card: KanbanCard) => {
    setSelectedCard(card);
  }, []);

  // Loading state
  if (!columns || !categories) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-zinc-400">Loading Kanban board...</div>
        </div>
      </div>
    );
  }

  const totalCards =
    columns.backlog.length +
    columns.blocked.length +
    columns.now.length +
    columns.next.length +
    columns.done.length;

  return (
    <div className="space-y-6">
      {/* Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={toCardData(selectedCard)}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {/* Header Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Kanban Board</h2>
          <p className="text-sm text-zinc-400">
            {totalCards} total item{totalCards !== 1 ? "s" : ""} across all columns
            <span className="text-zinc-500 ml-2">• Click any card for details</span>
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 pl-10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 w-64 transition-colors"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(undefined)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
            !selectedCategory
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              : "bg-zinc-800 text-zinc-400 hover:text-white border-zinc-700"
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => {
          const style = categoryColors[category] || defaultCategoryStyle;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                selectedCategory === category
                  ? `${style.bg} ${style.text} ${style.border}`
                  : "bg-zinc-800 text-zinc-400 hover:text-white border-zinc-700"
              }`}
            >
              {style.icon} {category}
            </button>
          );
        })}
      </div>

      {/* Kanban Board - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {(["backlog", "blocked", "now", "next", "done"] as KanbanColumn[]).map((columnId) => {
          const config = columnConfig[columnId];
          const cards = columns[columnId];
          const isDragOver = dragOverColumn === columnId;

          return (
            <div
              key={columnId}
              className={`bg-zinc-900/50 border-2 ${
                isDragOver ? config.color + " bg-zinc-800/50" : "border-zinc-800"
              } rounded-xl p-4 min-h-[400px] transition-all duration-200`}
              onDragOver={(e) => handleDragOver(e, columnId)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{config.icon}</span>
                  <div>
                    <h3 className="font-bold text-white">{config.title}</h3>
                    <p className="text-xs text-zinc-500">{config.description}</p>
                  </div>
                </div>
                <span className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full text-sm font-medium">
                  {cards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {cards.length === 0 ? (
                  <div className="text-center py-8 text-zinc-600">
                    <div className="text-3xl mb-2">📭</div>
                    <p className="text-sm">No items</p>
                  </div>
                ) : (
                  cards.map((card) => (
                    <KanbanCardComponent
                      key={card.id}
                      card={card}
                      isExpanded={expandedCard === card.id}
                      onToggleExpand={() =>
                        setExpandedCard(expandedCard === card.id ? null : card.id)
                      }
                      onClick={() => handleCardClick(card)}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      isDragging={draggingCard?.id === card.id}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {totalCards === 0 && (
        <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white mb-2">No items to display</h3>
          <p className="text-zinc-400">
            {searchQuery
              ? "No items match your search criteria"
              : selectedCategory
              ? `No items in the "${selectedCategory}" category`
              : "Start logging activities or creating tasks to see them here"}
          </p>
        </div>
      )}
    </div>
  );
}

// Individual Card Component
function KanbanCardComponent({
  card,
  isExpanded,
  onToggleExpand,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  card: KanbanCard;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClick: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, card: KanbanCard) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
}) {
  const style = categoryColors[card.category] || defaultCategoryStyle;
  const timeDisplay = formatTimeDisplay(card);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const priorityColors: Record<string, string> = {
    high: "bg-red-500/20 text-red-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    low: "bg-blue-500/20 text-blue-400",
  };

  // Handle mouse down to track potential drag
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  // Handle click - only trigger if not dragging
  const handleClick = (e: React.MouseEvent) => {
    if (dragStartPos.current) {
      const dx = Math.abs(e.clientX - dragStartPos.current.x);
      const dy = Math.abs(e.clientY - dragStartPos.current.y);
      // Only trigger click if mouse hasn't moved significantly (not a drag)
      if (dx < 5 && dy < 5) {
        onClick();
      }
    }
    dragStartPos.current = null;
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card)}
      onDragEnd={onDragEnd}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={`bg-zinc-800 border border-zinc-700 rounded-lg p-3 cursor-pointer active:cursor-grabbing hover:border-zinc-600 transition-all duration-200 ${
        isDragging ? "opacity-50 scale-95" : ""
      } hover:shadow-lg hover:shadow-black/20 hover:bg-zinc-800/80`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-xs border ${style.bg} ${style.text} ${style.border}`}>
            {style.icon} {card.category}
          </span>
          {card.type === "task" && card.priority && (
            <span className={`px-2 py-0.5 rounded text-xs ${priorityColors[card.priority] || ""}`}>
              {card.priority}
            </span>
          )}
          <span className="text-xs text-zinc-500">
            {card.type === "task" ? "📅" : "⚡"} {card.type}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="text-zinc-500 hover:text-white transition-colors text-sm p-1 hover:bg-zinc-700 rounded"
          title="Quick expand"
        >
          {isExpanded ? "▼" : "▶"}
        </button>
      </div>

      {/* Title */}
      <h4 className="font-semibold text-white mb-1 line-clamp-2">{card.title}</h4>

      {/* Description (truncated) */}
      <p className={`text-sm text-zinc-400 mb-2 ${isExpanded ? "" : "line-clamp-2"}`}>
        {card.description}
      </p>

      {/* Timestamp */}
      <div className="text-xs text-zinc-500 mb-2">{timeDisplay}</div>

      {/* Related Files Badges */}
      {card.relatedFiles && card.relatedFiles.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {(isExpanded ? card.relatedFiles : card.relatedFiles.slice(0, 2)).map((file, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-mono truncate max-w-[150px]"
              title={file}
            >
              📁 {file.split("/").pop()}
            </span>
          ))}
          {!isExpanded && card.relatedFiles.length > 2 && (
            <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded">
              +{card.relatedFiles.length - 2} more
            </span>
          )}
        </div>
      )}

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-zinc-700 space-y-2">
          {card.duration && (
            <div className="text-xs text-zinc-400">⏱️ Duration: {card.duration} minutes</div>
          )}

          {card.scheduledFor && (
            <div className="text-xs text-zinc-400">
              📆 Scheduled:{" "}
              {new Date(card.scheduledFor).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          )}

          {card.tags && card.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {card.tags.map((tag, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {card.status && (
            <div className="text-xs">
              <span className="text-zinc-500">Status: </span>
              <span
                className={`${
                  card.status === "completed"
                    ? "text-green-400"
                    : card.status === "in_progress"
                    ? "text-yellow-400"
                    : card.status === "blocked"
                    ? "text-red-400"
                    : "text-zinc-400"
                }`}
              >
                {card.status}
              </span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              View full details →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to format time display
function formatTimeDisplay(card: KanbanCard): string {
  const now = Date.now();
  const timestamp = card.scheduledFor || card.timestamp;
  const diff = timestamp - now;

  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  // For future tasks
  if (diff > 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `📅 ${dateStr} at ${timeStr} (in ${days}d)`;
    } else if (hours > 0) {
      return `⏰ ${dateStr} at ${timeStr} (in ${hours}h)`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return `🔥 ${timeStr} (in ${minutes}m)`;
    }
  }

  // For past activities
  const seconds = Math.floor((now - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${dateStr} at ${timeStr}`;
}
