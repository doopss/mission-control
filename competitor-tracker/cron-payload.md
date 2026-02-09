# Instagram Competitor Analysis - Scheduled Report

Execute the Instagram competitor tracking workflow:

1. **Read config** from `/Users/alexismendez/.openclaw/workspace/competitor-tracker/config.json`

2. **Start browser** with profile="openclaw" and verify Instagram login (credentials in config if needed)

3. **For each account in config.accounts:**
   - Navigate to `https://www.instagram.com/{account}/reels/`
   - Wait 3 seconds for page load
   - Take snapshot to get reel grid with URLs and view counts
   - For each reel visible (up to 12 recent):
     - Check posted time - only process if within last 7 days
     - Click reel to open modal
     - Extract: likes, caption, comments count
     - Close modal (press Escape or click Close)
     - Wait 2 seconds
   - Wait 5 seconds before next account

4. **Generate report** in this format for each reel:
   ```
   **[Caption/Title](full_reel_url)** | **[@username](profile_url)**
   👁 Views | ❤️ Likes | 💬 Comments
   
   **Summary:** [2-3 sentence summary of what the reel is about]
   **Key Insight:** [What makes this content effective/actionable takeaway]
   ```

5. **Save data locally:**
   - Raw JSON: `/Users/alexismendez/.openclaw/workspace/competitor-tracker/data/raw-YYYY-MM-DD.json`
   - Report MD: `/Users/alexismendez/.openclaw/workspace/competitor-tracker/reports/report-YYYY-MM-DD.md`

6. **Upload to Google Drive:**
   ```bash
   gogcli drive upload --account huelebicho.openclaw@gmail.com --file {filepath} --parent 1plSnEMj8h5uOWr9oIjz7YBUnXql20pz_
   ```

7. **Send report to Telegram:**
   - Recipient: Chat ID 1838020956
   - Use message tool: action=send, target=1838020956
   - Split into multiple messages if needed (Telegram has 4096 char limit)

8. **Close browser** when done

Report should be organized by account, showing top performing reels first (sorted by views).
