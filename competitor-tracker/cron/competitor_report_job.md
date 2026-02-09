# Competitor Analysis Cron Job Configuration

This file documents the cron job setup for the competitor analysis system.

## Schedule
- **Monday at 9:00 AM EST**: Weekly start report
- **Friday at 9:00 AM EST**: End-of-week report

## OpenClaw Cron Commands

To set up the cron jobs, run these commands in OpenClaw:

```
# Monday 9 AM EST report
openclaw cron add --name "competitor-monday" --schedule "0 9 * * 1" --timezone "America/New_York" --command "Run competitor analysis: bash /Users/alexismendez/.openclaw/workspace/competitor-tracker/scripts/run_analysis.sh && send report to Telegram 1838020956"

# Friday 9 AM EST report  
openclaw cron add --name "competitor-friday" --schedule "0 9 * * 5" --timezone "America/New_York" --command "Run competitor analysis: bash /Users/alexismendez/.openclaw/workspace/competitor-tracker/scripts/run_analysis.sh && send report to Telegram 1838020956"
```

## Cron Job Details

| Job Name | Schedule | Timezone | Description |
|----------|----------|----------|-------------|
| competitor-monday | `0 9 * * 1` | America/New_York | Monday 9 AM report |
| competitor-friday | `0 9 * * 5` | America/New_York | Friday 9 AM report |

## Manual Run

To run the analysis manually:
```bash
cd /Users/alexismendez/.openclaw/workspace/competitor-tracker
bash scripts/run_analysis.sh
```

Then send the report:
```bash
cat data/reports/latest_report.txt
# Copy and send via OpenClaw message tool to Telegram
```

## Telegram Delivery

- **Recipient**: @benjaminseda
- **User ID**: 1838020956
- **Channel**: telegram

The OpenClaw cron job will automatically use the message tool to deliver the report.
