#!/bin/bash
# Auto-update Kanban board to all locations

WORKSPACE="/Users/alexismendez/.openclaw/workspace"
KANBAN="$WORKSPACE/kanban.html"

# Update GitHub Pages
cd "$WORKSPACE/kanban-board"
cp "$KANBAN" index.html
git add index.html
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')" && git push origin main

# Update iCloud
cp "$KANBAN" ~/Library/Mobile\ Documents/com~apple~CloudDocs/HueleBicho-Kanban.html

echo "✅ Kanban board updated everywhere!"
echo "  - Local: http://localhost:8765/kanban.html"
echo "  - GitHub: https://doopss.github.io/kanban-board/"
echo "  - iCloud: HueleBicho-Kanban.html"
