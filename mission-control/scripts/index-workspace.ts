#!/usr/bin/env ts-node
/**
 * Index workspace files for searchability in Mission Control
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as fs from "fs";
import * as path from "path";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT || path.join(process.env.HOME || "", ".openclaw/workspace");

const client = new ConvexHttpClient(CONVEX_URL);

// Directories to skip
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".vercel",
  ".DS_Store",
  "__pycache__",
  ".cache"
]);

// File extensions to index
const INDEXABLE_EXTENSIONS = new Set([
  ".md", ".txt", ".json", ".js", ".ts", ".tsx", ".jsx",
  ".css", ".scss", ".html", ".yaml", ".yml", ".py", ".sh"
]);

// Max file size to index (100KB)
const MAX_FILE_SIZE = 100 * 1024;

interface WorkspaceFile {
  path: string;
  content: string;
  size: number;
  type: string;
  lastModified: number;
}

function shouldSkipDir(dirName: string): boolean {
  return SKIP_DIRS.has(dirName) || dirName.startsWith(".");
}

function shouldIndexFile(filePath: string, stats: fs.Stats): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return (
    INDEXABLE_EXTENSIONS.has(ext) &&
    stats.size <= MAX_FILE_SIZE &&
    stats.isFile()
  );
}

function walkDirectory(dir: string, relativeTo: string = dir): WorkspaceFile[] {
  const files: WorkspaceFile[] = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(relativeTo, fullPath);
      
      if (entry.isDirectory()) {
        if (!shouldSkipDir(entry.name)) {
          files.push(...walkDirectory(fullPath, relativeTo));
        }
      } else if (entry.isFile()) {
        const stats = fs.statSync(fullPath);
        
        if (shouldIndexFile(fullPath, stats)) {
          try {
            const content = fs.readFileSync(fullPath, "utf8");
            const ext = path.extname(fullPath).toLowerCase();
            
            files.push({
              path: relativePath,
              content,
              size: stats.size,
              type: ext.slice(1), // Remove leading dot
              lastModified: stats.mtimeMs
            });
          } catch (err) {
            console.warn(`Skipped ${relativePath}: ${err}`);
          }
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err);
  }
  
  return files;
}

async function indexWorkspace() {
  console.log(`📁 Indexing workspace: ${WORKSPACE_ROOT}\n`);
  
  const files = walkDirectory(WORKSPACE_ROOT);
  
  console.log(`Found ${files.length} indexable files\n`);
  
  let indexed = 0;
  let skipped = 0;
  
  for (const file of files) {
    try {
      await client.mutation(api.documents.upsert, {
        path: file.path,
        content: file.content,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      
      indexed++;
      if (indexed % 10 === 0) {
        console.log(`Indexed ${indexed}/${files.length}...`);
      }
    } catch (err) {
      console.error(`Failed to index ${file.path}:`, err);
      skipped++;
    }
  }
  
  console.log(`\n✅ Indexed ${indexed} files`);
  if (skipped > 0) {
    console.log(`⚠️  Skipped ${skipped} files (errors)`);
  }
}

// CLI
if (require.main === module) {
  indexWorkspace().then(() => {
    console.log("\n🎉 Workspace indexing complete!");
    process.exit(0);
  }).catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}

export { indexWorkspace };
