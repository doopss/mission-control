import { NextRequest, NextResponse } from "next/server";
import { readFile, stat, access } from "fs/promises";
import path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// Workspace root - all file access is restricted to this directory
// In production (Vercel), this won't exist - feature works locally only
const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT || path.join(process.env.HOME || "", ".openclaw/workspace");

// Check if we're in a serverless environment without file system access
const isServerless = process.env.VERCEL === "1";

// Convex client for fetching stored file contents
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convexClient = convexUrl ? new ConvexHttpClient(convexUrl) : null;

// Allowed file extensions for security
const ALLOWED_EXTENSIONS = [
  ".md",
  ".txt",
  ".json",
  ".js",
  ".ts",
  ".tsx",
  ".jsx",
  ".css",
  ".scss",
  ".html",
  ".yaml",
  ".yml",
  ".toml",
  ".py",
  ".sh",
  ".env",
  ".gitignore",
  ".sql",
];

// Max file size (1MB)
const MAX_FILE_SIZE = 1024 * 1024;

interface FileMetadata {
  path: string;
  fileName: string;
  extension: string;
  size: number;
  mimeType: string;
  lastModified: string;
}

function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    ".md": "text/markdown",
    ".txt": "text/plain",
    ".json": "application/json",
    ".js": "text/javascript",
    ".ts": "text/typescript",
    ".tsx": "text/tsx",
    ".jsx": "text/jsx",
    ".css": "text/css",
    ".scss": "text/scss",
    ".html": "text/html",
    ".yaml": "text/yaml",
    ".yml": "text/yaml",
    ".toml": "text/toml",
    ".py": "text/x-python",
    ".sh": "text/x-shellscript",
    ".env": "text/plain",
    ".gitignore": "text/plain",
    ".sql": "text/x-sql",
  };
  return mimeTypes[extension] || "text/plain";
}

function isPathSafe(requestedPath: string, basePath: string): boolean {
  // Resolve the full path
  const fullPath = path.resolve(basePath, requestedPath);
  
  // Ensure the resolved path starts with the base path
  // This prevents path traversal attacks (e.g., ../../../etc/passwd)
  return fullPath.startsWith(basePath);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.path;
    
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json(
        { error: "No file path provided" },
        { status: 400 }
      );
    }

    // Reconstruct the file path from segments
    const filePath = pathSegments.join("/");
    
    // Check for activityId query param - if provided, fetch from Convex
    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get("activityId");
    
    if (activityId && convexClient) {
      // Try to fetch from Convex stored file contents
      try {
        const activity = await convexClient.query(api.activities.get, {
          id: activityId as Id<"activities">
        });
        
        if (activity?.fileContents) {
          // Find the file in stored contents
          const storedFile = activity.fileContents.find(
            (f: { path: string }) => f.path === filePath || f.path.endsWith(filePath)
          );
          
          if (storedFile) {
            return NextResponse.json({
              content: storedFile.content,
              metadata: {
                path: storedFile.path,
                fileName: path.basename(storedFile.path),
                extension: path.extname(storedFile.path).toLowerCase(),
                size: storedFile.size,
                mimeType: storedFile.mimeType,
                lastModified: new Date(storedFile.lastModified).toISOString(),
              },
              source: "convex"
            });
          }
        }
        
        // File not found in Convex, fall through to filesystem (for local dev)
      } catch (convexError) {
        console.warn("Failed to fetch from Convex:", convexError);
        // Fall through to filesystem
      }
    }

    // Check if workspace is accessible (won't be on Vercel serverless)
    if (isServerless) {
      return NextResponse.json(
        { 
          error: "File not available. This file was not stored when the activity was logged.",
          hint: "Files are only available if they were stored in the activity's fileContents."
        },
        { status: 503 }
      );
    }

    // Verify workspace directory exists
    try {
      await access(WORKSPACE_ROOT);
    } catch {
      return NextResponse.json(
        { 
          error: "Workspace directory not accessible",
          hint: `Expected workspace at: ${WORKSPACE_ROOT}`
        },
        { status: 503 }
      );
    }

    // Security check: validate path is within workspace
    if (!isPathSafe(filePath, WORKSPACE_ROOT)) {
      return NextResponse.json(
        { error: "Access denied: Path outside workspace" },
        { status: 403 }
      );
    }

    const fullPath = path.resolve(WORKSPACE_ROOT, filePath);
    const extension = path.extname(fullPath).toLowerCase();

    // Security check: validate file extension
    if (!ALLOWED_EXTENSIONS.includes(extension) && extension !== "") {
      return NextResponse.json(
        { error: `File type not allowed: ${extension}` },
        { status: 403 }
      );
    }

    // Get file stats
    let fileStat;
    try {
      fileStat = await stat(fullPath);
    } catch {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Check if it's a directory
    if (fileStat.isDirectory()) {
      return NextResponse.json(
        { error: "Cannot read directory" },
        { status: 400 }
      );
    }

    // Check file size
    if (fileStat.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: `File too large (${Math.round(fileStat.size / 1024)}KB). Max size is ${MAX_FILE_SIZE / 1024}KB`,
          metadata: {
            path: filePath,
            fileName: path.basename(fullPath),
            extension,
            size: fileStat.size,
            mimeType: getMimeType(extension),
            lastModified: fileStat.mtime.toISOString(),
          } as FileMetadata
        },
        { status: 413 }
      );
    }

    // Read file content
    const content = await readFile(fullPath, "utf-8");

    const metadata: FileMetadata = {
      path: filePath,
      fileName: path.basename(fullPath),
      extension,
      size: fileStat.size,
      mimeType: getMimeType(extension),
      lastModified: fileStat.mtime.toISOString(),
    };

    return NextResponse.json({
      content,
      metadata,
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return NextResponse.json(
      { error: "Failed to read file" },
      { status: 500 }
    );
  }
}
