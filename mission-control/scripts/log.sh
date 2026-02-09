#!/bin/bash
# Simple wrapper for logging activities from shell

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Default category
CATEGORY="${4:-general}"

# Log the activity
ts-node "$SCRIPT_DIR/openclaw-logger.ts" log "$1" "$2" "$CATEGORY"
