# Instagram Competitor Tracker - Execution Instructions

This document provides instructions for the cron agent to execute the competitor tracking task.

## Overview
Track reels from 10 Instagram accounts, collect engagement data, generate a formatted report, and deliver via Telegram + Google Drive.

## Accounts to Track
1. infinitesocial
2. basedaustindunham
3. datingwithgracie
4. david_meessen
5. wingman.plus
6. datingbyblaine
7. _erickronaldo_
8. johnkeeganlifestyle
9. shaymaxx.x
10. cristianomungioli

## Execution Steps

### 1. Start Browser
```
browser action=start profile=openclaw
```

### 2. Navigate to Instagram
```
browser action=open profile=openclaw targetUrl=https://www.instagram.com/
```

If login required, use:
- Username: HueleBicho.openclaw
- Password: Chicken93!

### 3. For Each Account
Navigate to: `https://www.instagram.com/{username}/reels/`

#### Extract from Grid:
- Reel URLs (format: /username/reel/CODE/)
- View counts (shown on hover/overlay)

#### For Each Reel (click to open):
- Likes count (button text like "28 likes")
- Caption (heading h1 after username)
- Posted time (e.g., "4h", "2d", "1w")
- Comments count (may need to look for "View all X comments")

#### Filter Criteria:
- Only include reels from last 7 days
- Skip if posted time shows weeks/months

### 4. Data Structure
For each reel collect:
```json
{
  "username": "infinitesocial",
  "profileUrl": "https://www.instagram.com/infinitesocial/",
  "reelUrl": "https://www.instagram.com/reel/DUbhFJ_DCU_/",
  "views": 3657,
  "likes": 28,
  "comments": 7,
  "caption": "#relationships",
  "postedTime": "4h",
  "collectedAt": "2026-02-06T19:40:00Z"
}
```

### 5. Report Format
For each reel, format as:

```
**[Caption Preview](reel_url)** | **[@username](profile_url)**
👁 {views} | ❤️ {likes} | 💬 {comments}

**Summary:** [2-3 sentence content summary based on caption]
**Key Insight:** [What makes this work/actionable takeaway]
```

### 6. Delivery

#### Telegram
Send to chat ID: 1838020956
Use message action=send

#### Google Drive
1. Save raw JSON to: data/raw-{date}.json
2. Save report to: reports/report-{date}.md
3. Upload both to folder ID: 1plSnEMj8h5uOWr9oIjz7YBUnXql20pz_

Command:
```bash
gogcli drive upload --account huelebicho.openclaw@gmail.com --file {filepath} --parent 1plSnEMj8h5uOWr9oIjz7YBUnXql20pz_
```

## Rate Limiting
- Wait 5 seconds between accounts
- Wait 2 seconds between reel clicks
- Act human-like with varied delays

## Error Handling
- If account not found, log and skip
- If login fails, abort and notify
- If rate limited, wait 60 seconds and retry

## Time Parsing
Convert relative times to absolute:
- "Xh" = X hours ago
- "Xd" = X days ago  
- "Xw" = X weeks ago (exclude these)
- "Xm" (minutes) = include

Only include if within 7 days (168 hours).
