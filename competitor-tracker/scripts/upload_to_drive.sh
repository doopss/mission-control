#!/bin/bash
# Upload analysis data to Google Drive using gogcli
# Account: huelebicho.openclaw@gmail.com

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DATA_DIR="$PROJECT_DIR/data"
LOG_DIR="$PROJECT_DIR/logs"
DATE_ONLY=$(date +%Y-%m-%d)

GOG_CMD="/opt/homebrew/bin/gog"
GOOGLE_ACCOUNT="huelebicho.openclaw@gmail.com"
DRIVE_FOLDER="Competitor-Analysis-Tracker"
DRIVE_FOLDER_ID="1plSnEMj8h5uOWr9oIjz7YBUnXql20pz_"  # Pre-created folder ID

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [DRIVE] $1" | tee -a "$LOG_DIR/drive_$DATE_ONLY.log"
}

# Check if gogcli is available
if ! command -v "$GOG_CMD" &> /dev/null; then
    log "Warning: gogcli (gog) not found. Skipping Drive upload."
    exit 0
fi

log "Starting Google Drive upload..."

# Ensure drive folder exists (create if needed)
ensure_folder() {
    local folder_name="$1"
    
    # Check if folder exists
    folder_id=$($GOG_CMD drive ls --account "$GOOGLE_ACCOUNT" --query "name='$folder_name' and mimeType='application/vnd.google-apps.folder' and trashed=false" --json 2>/dev/null | python3 -c "import json,sys; files=json.load(sys.stdin).get('files',[]); print(files[0]['id'] if files else '')" 2>/dev/null || echo "")
    
    if [ -z "$folder_id" ]; then
        log "Creating folder: $folder_name"
        folder_id=$($GOG_CMD drive mkdir --account "$GOOGLE_ACCOUNT" "$folder_name" --json 2>/dev/null | python3 -c "import json,sys; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || echo "")
    fi
    
    echo "$folder_id"
}

# Upload a file to drive
upload_file() {
    local local_path="$1"
    local drive_folder_id="$2"
    local filename=$(basename "$local_path")
    
    if [ ! -f "$local_path" ]; then
        log "File not found: $local_path"
        return 1
    fi
    
    log "Uploading: $filename"
    $GOG_CMD drive upload --account "$GOOGLE_ACCOUNT" --parent "$drive_folder_id" "$local_path" 2>/dev/null || {
        log "Failed to upload: $filename"
        return 1
    }
    log "✓ Uploaded: $filename"
}

main() {
    # Use pre-created folder ID (more reliable)
    main_folder_id="$DRIVE_FOLDER_ID"
    
    if [ -z "$main_folder_id" ]; then
        # Fallback to creating folder
        main_folder_id=$(ensure_folder "$DRIVE_FOLDER")
    fi
    
    if [ -z "$main_folder_id" ]; then
        log "Failed to get/create Drive folder. Aborting."
        exit 1
    fi
    
    log "Using Drive folder ID: $main_folder_id"
    
    # Upload latest analysis
    if [ -f "$DATA_DIR/analysis/latest_analysis.json" ]; then
        # Rename with date for historical tracking
        cp "$DATA_DIR/analysis/latest_analysis.json" "$DATA_DIR/analysis/analysis_$DATE_ONLY.json"
        upload_file "$DATA_DIR/analysis/analysis_$DATE_ONLY.json" "$main_folder_id"
    fi
    
    # Upload latest report
    if [ -f "$DATA_DIR/reports/latest_report.txt" ]; then
        cp "$DATA_DIR/reports/latest_report.txt" "$DATA_DIR/reports/report_$DATE_ONLY.txt"
        upload_file "$DATA_DIR/reports/report_$DATE_ONLY.txt" "$main_folder_id"
    fi
    
    log "Drive upload completed"
}

main "$@"
