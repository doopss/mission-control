#!/bin/bash
# Mission Control Task Logger - Interactive Helper
# Prompts for task details and logs to Mission Control with file uploads

set -e

MISSION_CONTROL_DIR="$HOME/.openclaw/workspace/mission-control"

echo "📊 Mission Control Task Logger"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Task title
read -p "📝 Task Title: " TITLE
if [ -z "$TITLE" ]; then
  echo "❌ Title required"
  exit 1
fi

# Description
read -p "📄 Description: " DESCRIPTION
if [ -z "$DESCRIPTION" ]; then
  echo "❌ Description required"
  exit 1
fi

# Category
echo ""
echo "Categories: development, research, design, analysis, documentation, communication"
read -p "🏷️  Category: " CATEGORY
if [ -z "$CATEGORY" ]; then
  CATEGORY="development"
fi

# Files (optional)
echo ""
echo "Files (comma-separated paths, or press Enter to skip):"
read -p "📂 Files: " FILES

# Tags (optional)
echo ""
echo "Tags (comma-separated, or press Enter to skip):"
read -p "🏷️  Tags: " TAGS

# Build command
CMD="cd $MISSION_CONTROL_DIR && npx tsx scripts/openclaw-logger.ts log \"$TITLE\" \"$DESCRIPTION\" \"$CATEGORY\""

if [ -n "$FILES" ]; then
  CMD="$CMD --files \"$FILES\""
fi

if [ -n "$TAGS" ]; then
  CMD="$CMD --tags \"$TAGS\""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Running:"
echo "$CMD"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Execute
eval "$CMD"

echo ""
echo "✅ Task logged to Mission Control"
echo "🌐 View at: https://doopss-mission-control.vercel.app"
echo ""
echo "💡 Don't forget to update static Kanban if applicable!"
