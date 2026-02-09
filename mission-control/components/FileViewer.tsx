"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Highlight, themes } from "prism-react-renderer";

interface FileMetadata {
  path: string;
  fileName: string;
  extension: string;
  size: number;
  mimeType: string;
  lastModified: string;
}

interface FileViewerProps {
  filePath: string;
  onClose: () => void;
  activityId?: string; // Optional: if provided, fetches from Convex stored contents
}

type LoadingState = "idle" | "loading" | "success" | "error";

const languageMap: Record<string, string> = {
  ".js": "javascript",
  ".jsx": "jsx",
  ".ts": "typescript",
  ".tsx": "tsx",
  ".py": "python",
  ".json": "json",
  ".css": "css",
  ".scss": "css",
  ".html": "markup",
  ".xml": "markup",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".md": "markdown",
  ".sh": "bash",
  ".bash": "bash",
  ".sql": "sql",
  ".toml": "toml",
};

function getLanguage(extension: string): string {
  return languageMap[extension] || "text";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileViewer({ filePath, onClose, activityId }: FileViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchFile = useCallback(async () => {
    if (loadingState === "loading") return;
    
    setLoadingState("loading");
    setError(null);

    try {
      // Build URL with optional activityId param for Convex lookup
      const encodedPath = encodeURIComponent(filePath).replace(/%2F/g, "/");
      const url = activityId 
        ? `/api/files/${encodedPath}?activityId=${encodeURIComponent(activityId)}`
        : `/api/files/${encodedPath}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch file");
      }

      setContent(data.content);
      setMetadata(data.metadata);
      setLoadingState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load file");
      setLoadingState("error");
    }
  }, [filePath, loadingState, activityId]);

  const copyToClipboard = useCallback(async () => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy to clipboard");
    }
  }, [content]);

  // Auto-load on first render
  if (loadingState === "idle") {
    fetchFile();
  }

  const isMarkdown = metadata?.extension === ".md";
  const language = metadata ? getLanguage(metadata.extension) : "text";

  return (
    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 overflow-hidden animate-expand">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-800 border-b border-zinc-700">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <span className={`inline-block transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
              ▶
            </span>
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {isMarkdown ? "📄" : "📝"}
              </span>
              <span className="font-medium text-white truncate">
                {filePath.split("/").pop()}
              </span>
              {metadata && (
                <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded">
                  {metadata.extension.toUpperCase().replace(".", "")}
                </span>
              )}
            </div>
            <div className="text-xs text-zinc-500 truncate" title={filePath}>
              {filePath}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* File metadata */}
          {metadata && (
            <span className="text-xs text-zinc-500 hidden sm:inline">
              {formatFileSize(metadata.size)}
            </span>
          )}
          
          {/* Copy button */}
          {content && (
            <button
              onClick={copyToClipboard}
              className={`p-2 rounded-lg transition-all ${
                copied
                  ? "bg-green-500/20 text-green-400"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-700"
              }`}
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              {copied ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
            title="Close file viewer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="animate-slide-down">
          {/* Loading state */}
          {loadingState === "loading" && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-zinc-400">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading file...</span>
              </div>
            </div>
          )}

          {/* Error state */}
          {loadingState === "error" && (
            <div className="p-4">
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-medium">Failed to load file</div>
                  <div className="text-sm text-red-400/80">{error}</div>
                </div>
                <button
                  onClick={fetchFile}
                  className="ml-auto px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Success state - render content */}
          {loadingState === "success" && content && (
            <div className="max-h-[400px] overflow-auto">
              {isMarkdown ? (
                // Markdown rendering
                <div className="p-4 prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-zinc-300 prose-li:text-zinc-300 prose-code:bg-zinc-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-emerald-400 prose-pre:bg-zinc-800 prose-pre:border prose-pre:border-zinc-700 prose-a:text-emerald-400">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </div>
              ) : (
                // Code rendering with syntax highlighting and line numbers
                <Highlight
                  theme={themes.nightOwl}
                  code={content}
                  language={language}
                >
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                      className={`${className} text-sm p-4 overflow-x-auto`}
                      style={{ ...style, background: "transparent", margin: 0 }}
                    >
                      <code>
                        {tokens.map((line, i) => {
                          const lineProps = getLineProps({ line, key: i });
                          return (
                            <div key={i} {...lineProps} className="table-row">
                              <span className="table-cell pr-4 text-right text-zinc-600 select-none w-10 text-xs">
                                {i + 1}
                              </span>
                              <span className="table-cell">
                                {line.map((token, key) => {
                                  const tokenProps = getTokenProps({ token, key });
                                  return <span key={key} {...tokenProps} />;
                                })}
                              </span>
                            </div>
                          );
                        })}
                      </code>
                    </pre>
                  )}
                </Highlight>
              )}
            </div>
          )}
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes expand {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        .animate-expand {
          animation: expand 0.3s ease-out;
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
