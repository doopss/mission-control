"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useCallback, DragEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardDetailModal, { CardData } from "./CardDetailModal";

// Types - Display uses 4 columns, but data may have 5
type DisplayColumn = "backlog" | "blocked" | "now" | "done";
type DataColumn = "backlog" | "blocked" | "now" | "next" | "done";

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
  column: DataColumn;
  metadata?: Record<string, unknown>;
  fileContents?: Array<{
    path: string;
    content: string;
    size: number;
    mimeType: string;
    lastModified: number;
  }>;
}

// Category styling - v2.0 design system
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

// Column config - v2.0 (4 columns)
const columnConfig: Record<DisplayColumn, { 
  title: string; 
  icon: string; 
  color: string; 
  bgColor: string;
  borderColor: string;
}> = {
  backlog: {
    title: "BACKLOG",
    icon: "📝",
    color: "#6B7280",
    bgColor: "bg-[#6B7280]/10",
    borderColor: "border-[#6B7280]/30",
  },
  blocked: {
    title: "BLOCKED",
    icon: "🚫",
    color: "#FF6B4A",
    bgColor: "bg-[#FF6B4A]/10",
    borderColor: "border-[#FF6B4A]/30",
  },
  now: {
    title: "IN PROGRESS",
    icon: "🔥",
    color: "#FFD93D",
    bgColor: "bg-[#FFD93D]/10",
    borderColor: "border-[#FFD93D]/30",
  },
  done: {
    title: "COMPLETED",
    icon: "✅",
    color: "#4ADE80",
    bgColor: "bg-[#4ADE80]/10",
    borderColor: "border-[#4ADE80]/30",
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

interface KanbanViewProps {
  onNewTask?: () => void;
}

export default function KanbanView({ onNewTask }: KanbanViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [draggingCard, setDraggingCard] = useState<KanbanCard | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<DisplayColumn | null>(null);

  const columns = useQuery(api.kanban.getKanbanData, {
    category: selectedCategory,
    searchQuery: searchQuery || undefined,
  });

  const categories = useQuery(api.kanban.getCategories);
  const moveCard = useMutation(api.kanban.moveCard);

  // Map data to 4 columns (merge now+next into now, keep done)
  const mappedColumns = columns ? {
    backlog: columns.backlog,
    blocked: columns.blocked,
    now: [...columns.now, ...columns.next], // Merge in progress
    done: columns.done,
  } : null;

  // Drag and drop handlers
  const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>, card: KanbanCard) => {
    setDraggingCard(card);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify({ id: card.id, type: card.type }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingCard(null);
    setDragOverColumn(null);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>, column: DisplayColumn) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(column);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>, targetColumn: DisplayColumn) => {
      e.preventDefault();
      setDragOverColumn(null);

      // Check if card is already in target column (handle "next" mapping to "now")
      const cardDisplayColumn = draggingCard?.column === "next" ? "now" : draggingCard?.column;
      if (!draggingCard || cardDisplayColumn === targetColumn) {
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
  if (!mappedColumns || !categories) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#9CA3AF]">Loading Kanban board...</div>
        </div>
      </div>
    );
  }

  const totalCards =
    mappedColumns.backlog.length +
    mappedColumns.blocked.length +
    mappedColumns.now.length +
    mappedColumns.done.length;

  return (
    <div className="space-y-6">
      {/* Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={toCardData(selectedCard)}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📋</span>
            Active Operations
            <span className="ml-2 px-3 py-1 bg-[#00D4AA]/20 text-[#00D4AA] text-sm rounded-full font-medium">
              {totalCards}
            </span>
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Drag cards between columns to update status
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg px-4 py-2 pl-9 text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#00D4AA] transition-colors"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">🔍</span>
          </div>

          {/* New Task Button */}
          {onNewTask && (
            <button
              onClick={onNewTask}
              className="flex items-center gap-2 px-4 py-2 bg-[#00D4AA] hover:bg-[#00B894] text-[#0D0D0D] rounded-lg transition-colors font-semibold text-sm"
            >
              <span className="text-lg">+</span>
              New Task
            </button>
          )}
        </div>
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
          All
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
              {category}
            </button>
          );
        })}
      </div>

      {/* Kanban Board - 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {(["backlog", "blocked", "now", "done"] as DisplayColumn[]).map((columnId) => {
          const config = columnConfig[columnId];
          const cards = mappedColumns[columnId];
          const isDragOver = dragOverColumn === columnId;

          return (
            <motion.div
              key={columnId}
              layout
              className={`bg-[#0D0D0D] border rounded-xl min-h-[500px] flex flex-col transition-all duration-200 ${
                isDragOver 
                  ? `${config.borderColor} bg-[#1A1A1A]` 
                  : "border-[#2D2D2D]"
              }`}
              onDragOver={(e) => handleDragOver(e, columnId)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-[#2D2D2D]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{config.icon}</span>
                    <h3 className="font-semibold text-sm text-white tracking-wide">
                      {config.title}
                    </h3>
                  </div>
                  <span 
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config.bgColor}`}
                    style={{ color: config.color }}
                  >
                    {cards.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {cards.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-[#6B7280]"
                    >
                      <div className="text-3xl mb-2 opacity-50">📭</div>
                      <p className="text-xs">No items</p>
                    </motion.div>
                  ) : (
                    cards.map((card) => (
                      <KanbanCardComponent
                        key={card.id}
                        card={card}
                        onClick={() => handleCardClick(card)}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        isDragging={draggingCard?.id === card.id}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {totalCards === 0 && (
        <div className="text-center py-12 bg-[#1A1A1A] rounded-xl border border-[#2D2D2D]">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white mb-2">No items to display</h3>
          <p className="text-[#9CA3AF]">
            {searchQuery
              ? "No items match your search"
              : selectedCategory
              ? `No items in "${selectedCategory}"`
              : "Create a task to get started"}
          </p>
        </div>
      )}
    </div>
  );
}

// Individual Card Component - v2.0 Design
function KanbanCardComponent({
  card,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  card: KanbanCard;
  onClick: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, card: KanbanCard) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  const style = categoryColors[card.category] || defaultCategoryStyle;
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const priorityColors: Record<string, { bg: string; text: string }> = {
    high: { bg: "bg-[#FF6B4A]/20", text: "text-[#FF6B4A]" },
    medium: { bg: "bg-[#FFD93D]/20", text: "text-[#FFD93D]" },
    low: { bg: "bg-[#3B82F6]/20", text: "text-[#3B82F6]" },
  };

  const priority = (card.metadata?.priority as string) || card.priority;
  const priorityStyle = priority ? priorityColors[priority] : null;

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent) => {
    if (dragStartPos.current) {
      const dx = Math.abs(e.clientX - dragStartPos.current.x);
      const dy = Math.abs(e.clientY - dragStartPos.current.y);
      if (dx < 5 && dy < 5) {
        onClick();
      }
    }
    dragStartPos.current = null;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        scale: isDragging ? 0.98 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, borderColor: "#3D3D3D" }}
      transition={{ duration: 0.15 }}
      draggable
      onDragStart={(e) => onDragStart(e as unknown as DragEvent<HTMLDivElement>, card)}
      onDragEnd={onDragEnd}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg p-3 cursor-grab active:cursor-grabbing transition-colors"
    >
      {/* Tags Row */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {/* Category Tag */}
        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${style.bg} ${style.text} capitalize`}>
          {card.category}
        </span>
        
        {/* Priority Tag */}
        {priorityStyle && (
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${priorityStyle.bg} ${priorityStyle.text} capitalize`}>
            {priority}
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="font-medium text-white text-sm mb-1 line-clamp-2 leading-snug">
        {card.title}
      </h4>

      {/* Description */}
      {card.description && (
        <p className="text-[13px] text-[#9CA3AF] line-clamp-2 mb-3 leading-relaxed">
          {card.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
        <span>{formatTimeAgo(card.timestamp)}</span>
        <div className="flex items-center gap-2">
          {card.relatedFiles && card.relatedFiles.length > 0 && (
            <span className="flex items-center gap-1">
              📁 {card.relatedFiles.length}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Helper function
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);
  
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
