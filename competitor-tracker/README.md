# Instagram Competitor Tracker

Automated Instagram competitor analysis system that tracks reels from 10 accounts, generates engagement reports, and delivers them via Telegram + Google Drive.

## 📋 Overview

This tracker monitors the following dating/relationship coach accounts on Instagram:

1. [@infinitesocial](https://www.instagram.com/infinitesocial/) - Xander Reynolds (Break-Up Coach)
2. [@basedaustindunham](https://www.instagram.com/basedaustindunham/) - Austin Dunham (Online Dating Coach)
3. [@datingwithgracie](https://www.instagram.com/datingwithgracie/) - Gracie (Dating Advice)
4. [@david_meessen](https://www.instagram.com/david_meessen/)
5. [@wingman.plus](https://www.instagram.com/wingman.plus/)
6. [@datingbyblaine](https://www.instagram.com/datingbyblaine/)
7. [@_erickronaldo_](https://www.instagram.com/_erickronaldo_/)
8. [@johnkeeganlifestyle](https://www.instagram.com/johnkeeganlifestyle/)
9. [@shaymaxx.x](https://www.instagram.com/shaymaxx.x/)
10. [@cristianomungioli](https://www.instagram.com/cristianomungioli/)

## 🔧 Configuration

### Files
- `config.json` - Account list, credentials, and settings
- `TRACKER-INSTRUCTIONS.md` - Detailed execution instructions for the agent
- `cron-payload.md` - Agent turn payload for cron jobs

### Credentials
- **Instagram:** HueleBicho.openclaw / Chicken93!
- **Google Drive:** huelebicho.openclaw@gmail.com
- **Drive Folder:** Competitor-Analysis-Tracker (ID: 1plSnEMj8h5uOWr9oIjz7YBUnXql20pz_)

## 📅 Schedule

Reports are delivered twice weekly:
- **Monday at 9:00 AM EST**
- **Friday at 9:00 AM EST**

### Cron Jobs
```
competitor-tracker-monday:  0 9 * * 1 (America/New_York)
competitor-tracker-friday:  0 9 * * 5 (America/New_York)
```

To list cron jobs:
```bash
openclaw cron list
```

To run manually:
```bash
openclaw cron run --name competitor-tracker-monday
```

## 📊 Report Format

Each reel entry follows this format:

```
**[Caption/Title](reel_url)** | **[@username](profile_url)**
👁 Views | ❤️ Likes | 💬 Comments

**Summary:** [2-3 sentence content summary]
**Key Insight:** [What makes this work/actionable takeaway]
```

## 📁 Output Files

### Local Storage
- `data/raw-YYYY-MM-DD.json` - Raw extracted data
- `reports/report-YYYY-MM-DD.md` - Formatted markdown report

### Google Drive
All files are uploaded to: [Competitor-Analysis-Tracker](https://drive.google.com/drive/folders/1plSnEMj8h5uOWr9oIjz7YBUnXql20pz_)

## 🛠 Manual Execution

To run the tracker manually:

1. **Start browser:**
   ```
   browser action=start profile=openclaw
   ```

2. **Navigate to account reels:**
   ```
   browser action=navigate targetUrl=https://www.instagram.com/{username}/reels/
   ```

3. **Extract data using JavaScript:**
   ```javascript
   // Get reel URLs and views from grid
   document.querySelectorAll('a[href*="/reel/"]')
   ```

4. **Click individual reels for details (likes, comments, caption)**

5. **Generate report and deliver**

## 📨 Delivery

- **Primary:** Telegram to @benjaminseda (Chat ID: 1838020956)
- **Backup:** Reports saved to Google Drive

## ⚠️ Rate Limiting

The tracker implements human-like delays:
- 5 seconds between accounts
- 2 seconds between reel clicks
- Random variation to avoid detection

## 🔄 Troubleshooting

### Login Issues
The browser profile `openclaw` maintains session cookies. If login expires:
1. Run browser manually
2. Navigate to Instagram
3. Re-enter credentials (in config.json)
4. Session will be saved

### Rate Limiting
If Instagram blocks requests:
- Wait 60 seconds and retry
- Reduce number of reels extracted per account
- Increase delays between requests

### Cron Not Running
```bash
openclaw gateway status  # Check gateway is running
openclaw cron list       # Verify jobs are enabled
openclaw cron runs       # Check recent run history
```

## 📝 Changelog

### 2026-02-06
- Initial setup
- Test report sent successfully
- Cron jobs configured for Monday/Friday
- Google Drive integration verified

---

*Built with OpenClaw Browser Automation*
