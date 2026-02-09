"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FileViewer from "./FileViewer";

// Shared types for the modal
export interface CardData {
  id: string;
  type: "activity" | "task";
  title: string;
  description: string;
  category?: string;
  timestamp: number;
  status?: string;
  priority?: string;
  relatedFiles?: string[];
  tags?: string[];
  duration?: number;
  scheduledFor?: number;
  column?: string;
  metadata?: Record<string, unknown>;
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

// Status colors
const statusColors: Record<string, { bg: string; text: string }> = {
  completed: { bg: "bg-green-500/20", text: "text-green-400" },
  in_progress: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  blocked: { bg: "bg-red-500/20", text: "text-red-400" },
  pending: { bg: "bg-blue-500/20", text: "text-blue-400" },
  cancelled: { bg: "bg-zinc-500/20", text: "text-zinc-400" },
};

// Priority colors
const priorityColors: Record<string, string> = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

// Column config (optional, for Kanban display)
const columnConfig: Record<string, { title: string; icon: string; color: string }> = {
  blocked: { title: "BLOCKED", icon: "🚫", color: "border-red-500/50" },
  now: { title: "NOW", icon: "🔥", color: "border-orange-500/50" },
  next: { title: "NEXT", icon: "📋", color: "border-blue-500/50" },
  done: { title: "DONE", icon: "✅", color: "border-emerald-500/50" },
};

interface CardDetailModalProps {
  card: CardData;
  onClose: () => void;
}

export default function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const style = card.category ? (categoryColors[card.category] || defaultCategoryStyle) : defaultCategoryStyle;
  const columnInfo = card.column ? columnConfig[card.column] : null;
  const [viewingFile, setViewingFile] = useState<string | null>(null);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Close on click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Format full timestamp
  const formatFullTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Check if description looks like markdown
  const isMarkdown = (text: string) => {
    return /^#+\s|^\*\*|^-\s|^\d+\.\s|```|^\|.*\|$|^\[.*\]\(.*\)/m.test(text);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b border-zinc-700 ${style.bg}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {card.category && (
                  <span className={`px-2 py-0.5 rounded text-xs border ${style.bg} ${style.text} ${style.border}`}>
                    {style.icon} {card.category}
                  </span>
                )}
                {columnInfo && (
                  <span className={`px-2 py-0.5 rounded text-xs border ${columnInfo.color} text-zinc-300`}>
                    {columnInfo.icon} {columnInfo.title}
                  </span>
                )}
                {card.type === "task" && card.priority && (
                  <span className={`px-2 py-0.5 rounded text-xs border ${priorityColors[card.priority] || ""}`}>
                    {card.priority.toUpperCase()}
                  </span>
                )}
                <span className="text-xs text-zinc-500 border border-zinc-600 px-2 py-0.5 rounded">
                  {card.type === "task" ? "📅 Task" : "⚡ Activity"}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{card.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
          {/* Description */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Description</h3>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
              {isMarkdown(card.description) ? (
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-zinc-300 prose-li:text-zinc-300 prose-code:bg-zinc-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-emerald-400 prose-pre:bg-zinc-800 prose-pre:border prose-pre:border-zinc-700">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {card.description}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-zinc-300 whitespace-pre-wrap">{card.description}</p>
              )}
            </div>
          </section>

          {/* Metadata Grid */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Details</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Timestamp */}
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <div className="text-xs text-zinc-500 mb-1">📅 Created</div>
                <div className="text-sm text-white">{formatFullTimestamp(card.timestamp)}</div>
              </div>

              {/* Status */}
              {card.status && (
                <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                  <div className="text-xs text-zinc-500 mb-1">🔄 Status</div>
                  <span className={`inline-block px-2 py-0.5 rounded text-sm ${statusColors[card.status]?.bg || "bg-zinc-700"} ${statusColors[card.status]?.text || "text-zinc-300"}`}>
                    {card.status.replace(/_/g, " ")}
                  </span>
                </div>
              )}

              {/* Duration */}
              {card.duration && (
                <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                  <div className="text-xs text-zinc-500 mb-1">⏱️ Duration</div>
                  <div className="text-sm text-white">
                    {card.duration >= 60
                      ? `${Math.floor(card.duration / 60)}h ${card.duration % 60}m`
                      : `${card.duration} minutes`}
                  </div>
                </div>
              )}

              {/* Scheduled For (Tasks) */}
              {card.scheduledFor && (
                <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                  <div className="text-xs text-zinc-500 mb-1">📆 Scheduled For</div>
                  <div className="text-sm text-white">{formatFullTimestamp(card.scheduledFor)}</div>
                </div>
              )}

              {/* Priority (Tasks) */}
              {card.priority && (
                <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                  <div className="text-xs text-zinc-500 mb-1">🎯 Priority</div>
                  <span className={`inline-block px-2 py-0.5 rounded text-sm border ${priorityColors[card.priority] || "bg-zinc-700 text-zinc-300"}`}>
                    {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
                  </span>
                </div>
              )}

              {/* Card ID */}
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <div className="text-xs text-zinc-500 mb-1">🆔 ID</div>
                <div className="text-sm text-zinc-400 font-mono truncate" title={card.id}>{card.id}</div>
              </div>
            </div>
          </section>

          {/* Related Files */}
          {card.relatedFiles && card.relatedFiles.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                Related Files ({card.relatedFiles.length})
              </h3>
              <div className="space-y-2">
                {card.relatedFiles.map((file, i) => {
                  const fileName = file.split("/").pop() || file;
                  const isMarkdownFile = file.endsWith(".md");
                  const isCodeFile = /\.(ts|tsx|js|jsx|py|go|rs|java|c|cpp|h|css|scss|json|yaml|yml|toml)$/.test(file);
                  const isViewable = isMarkdownFile || isCodeFile || file.endsWith(".txt");
                  const isCurrentlyViewing = viewingFile === file;
                  
                  return (
                    <div key={i} className="space-y-2">
                      <button
                        onClick={() => setViewingFile(isCurrentlyViewing ? null : file)}
                        disabled={!isViewable}
                        className={`w-full flex items-center gap-3 bg-zinc-800/50 rounded-lg p-3 border transition-all text-left ${
                          isCurrentlyViewing
                            ? "border-emerald-500/50 bg-emerald-500/10"
                            : isViewable
                            ? "border-zinc-700 hover:border-emerald-500/30 hover:bg-zinc-800/70 cursor-pointer"
                            : "border-zinc-700 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <span className="text-lg">
                          {isMarkdownFile ? "📄" : isCodeFile ? "📝" : "📁"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white font-medium truncate">{fileName}</div>
                          <div className="text-xs text-zinc-500 truncate" title={file}>{file}</div>
                        </div>
                        {isViewable && (
                          <span className={`text-xs px-2 py-1 rounded transition-colors ${
                            isCurrentlyViewing
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-zinc-700 text-zinc-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400"
                          }`}>
                            {isCurrentlyViewing ? "Hide" : "View"}
                          </span>
                        )}
                        {isMarkdownFile && (
                          <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                            MD
                          </span>
                        )}
                        {isCodeFile && !isMarkdownFile && (
                          <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                            {file.split(".").pop()?.toUpperCase()}
                          </span>
                        )}
                      </button>
                      
                      {/* File Viewer */}
                      {isCurrentlyViewing && (
                        <FileViewer
                          filePath={file}
                          onClose={() => setViewingFile(null)}
                          activityId={card.type === "activity" ? card.id : undefined}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-full text-sm border border-zinc-700 hover:border-zinc-600 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Additional Metadata */}
          {card.metadata && Object.keys(card.metadata).length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Additional Metadata</h3>
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <pre className="text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap font-mono">
                  {JSON.stringify(card.metadata, null, 2)}
                </pre>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-700 bg-zinc-900/80 backdrop-blur-sm flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
