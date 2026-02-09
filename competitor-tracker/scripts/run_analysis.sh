#!/bin/bash
# Main Runner Script for Competitor Analysis
# This is the entry point called by cron jobs
# UPDATED: Now focused on Instagram Reels only (YouTube removed)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_DIR/logs"
DATE_ONLY=$(date +%Y-%m-%d)
TIMESTAMP=$(date +%Y-%m-%d_%H%M%S)

mkdir -p "$LOG_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_DIR/run_$DATE_ONLY.log"
}

log "=========================================="
log "COMPETITOR ANALYSIS RUN STARTED"
log "Focus: Instagram Reels (Trailing 7 Days)"
log "=========================================="

# Step 1: Run Instagram Reels scraper
log "Step 1: Running Instagram Reels scraper..."
if python3 "$SCRIPT_DIR/instagram_reels_scraper.py"; then
    log "✓ Instagram Reels scraping completed"
else
    log "✗ Instagram Reels scraping failed (continuing anyway)"
fi

# Step 2: Run analyzer
log "Step 2: Running analysis..."
if python3 "$SCRIPT_DIR/analyzer.py"; then
    log "✓ Analysis completed"
else
    log "✗ Analysis failed"
    exit 1
fi

# Step 3: Generate report
log "Step 3: Generating report..."
if python3 "$SCRIPT_DIR/report_generator.py"; then
    log "✓ Report generated"
else
    log "✗ Report generation failed"
    exit 1
fi

# Step 4: Upload to Google Drive
log "Step 4: Uploading to Google Drive..."
if bash "$SCRIPT_DIR/upload_to_drive.sh"; then
    log "✓ Drive upload completed"
else
    log "⚠ Drive upload skipped or failed"
fi

log "=========================================="
log "COMPETITOR ANALYSIS RUN COMPLETED"
log "=========================================="

# Output the report path for the cron job to use
echo "$PROJECT_DIR/data/reports/latest_report.txt"
