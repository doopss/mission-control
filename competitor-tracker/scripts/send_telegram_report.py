#!/usr/bin/env python3
"""
Send Competitor Analysis Report to Telegram
Uses OpenClaw message tool for delivery
Recipient: @benjaminseda (ID: 1838020956)
"""

import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime

PROJECT_DIR = Path(__file__).parent.parent
REPORTS_DIR = PROJECT_DIR / "data" / "reports"
TELEGRAM_USER_ID = "1838020956"

def get_latest_report():
    """Load the latest report text"""
    latest_file = REPORTS_DIR / "latest_report.txt"
    
    if not latest_file.exists():
        return None
    
    with open(latest_file, 'r') as f:
        return f.read()

def send_via_openclaw(message):
    """
    Send message via OpenClaw message tool
    This is designed to be called from an OpenClaw cron context
    """
    # In cron context, the message tool is available directly
    # This script outputs the message for the cron job to send
    print("TELEGRAM_MESSAGE_START")
    print(message)
    print("TELEGRAM_MESSAGE_END")
    print(f"TELEGRAM_TARGET:{TELEGRAM_USER_ID}")
    return True

def main():
    report = get_latest_report()
    
    if not report:
        print("ERROR: No report found. Run the analysis first.")
        sys.exit(1)
    
    # Split report if too long (Telegram has 4096 char limit)
    MAX_LENGTH = 4000
    
    if len(report) <= MAX_LENGTH:
        send_via_openclaw(report)
    else:
        # Split into parts
        parts = []
        current = ""
        
        for line in report.split('\n'):
            if len(current) + len(line) + 1 > MAX_LENGTH:
                parts.append(current)
                current = line
            else:
                current += '\n' + line if current else line
        
        if current:
            parts.append(current)
        
        for i, part in enumerate(parts, 1):
            header = f"📄 Part {i}/{len(parts)}\n\n" if len(parts) > 1 else ""
            send_via_openclaw(header + part)

if __name__ == '__main__':
    main()
