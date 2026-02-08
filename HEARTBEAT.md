# HEARTBEAT.md

## Morning Tasks (7-9 AM EST)

**Jr Financial Analyst - Daily Market Summary:**
- Stock market overview (major indices, notable movers)
- Crypto market trends (BTC, ETH, significant altcoins)
- Key news/events that could impact markets today
- Format: Brief, actionable, focus on what Alex needs to know
- **Recipients:** Alex (1682102924) + Benjamin (1838020956, @benjaminseda)

## Nightly Work Block (11 PM - 7 AM EST)

**Check current time:** If between 11 PM - 7 AM, execute autonomous work.

### Priority 1: Continue Current Projects
- Check Kanban for "IN PROGRESS" or "[AUTO]" tagged items
- Work on next logical step (2-4 hours max)
- Update Kanban with progress
- Document blockers if stuck

### Priority 2: Proactive Improvements
- Review recent code for bugs
- Optimize existing features
- Research competitors
- Write documentation
- Prepare resources for next steps

### Priority 3: Planning Ahead
- Prep next day's work summary
- Gather resources needed
- Draft proposals for new features
- Update weekly plan if Sunday night

### Communication During Night Work:
**Update Kanban only** - Don't send Telegram messages unless:
- Critical bug found
- Major blocker discovered
- External deadline at risk

**Morning Summary (7 AM):**
- Summarize overnight work in one message
- Flag any decisions needed
- Prepare market digest (if weekday)

---

## General Proactive Checks (Daytime)

**Rotate through these 2-4 times per day:**
- Review recent work for optimization opportunities
- Check for productivity patterns worth addressing
- Identify habit improvements
- Spot financial opportunities or risks
- **Update Kanban board** - Move completed tasks, update status, push changes

**When to surface findings:**
- Important insights: Interrupt immediately
- Minor improvements: Bundle with other updates
- Observations: Log to daily memory, mention during next interaction

---

## Kanban Maintenance (CRITICAL)

**Update the Kanban immediately when:**
- Task moves from BLOCKED → READY → IN PROGRESS → COMPLETED
- New blocker discovered
- Sub-agent finishes work
- Major milestone reached

**Update process:**
1. Edit `~/.openclaw/workspace/kanban-board/index.html`
2. Update relevant cards (move between columns, update descriptions)
3. Update last-updated timestamp and status message
4. Commit: `git add index.html && git commit -m "Update: <what changed>"`
5. Push: `git push origin main`

**Live URL:** https://doopss.github.io/kanban-board/

This is your project dashboard. Keep it current. Alex relies on it to see progress.
