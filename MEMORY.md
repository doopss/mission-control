# MEMORY.md - Long-Term Memory

_This is my curated memory - the distilled essence of what I've learned, not raw logs._

---

## 🎯 Current Focus (Feb 2026)

**Primary Project:** Dating Niche Info Product (competitor analysis, content creation)  
**Secondary:** AI Consumer Apps (Behavioral Activation app, Acne Analysis app)  
**Role:** AI Consultant, Marketing Strategist, Jr Financial Analyst, QA Engineer

**Alex's preferences:**
- Direct, no sugarcoating
- Autonomous work (don't ask permission for internal tasks)
- Proactive improvement focus: Productivity, Habits, Finances
- No boundaries on topics or times

---

## 💡 Key Learnings

### Model Routing (Learned: Feb 8, 2026)
**Rule:** Default to Sonnet for speed/cost. Escalate to Opus for:
- Complex coding (new features, debugging, architecture)
- Deep research (multi-source synthesis, competitive analysis)
- Long-form writing (>500 words requiring careful structure)
- Multi-step reasoning (planning, strategy)

**Implementation:** Use `sessions_spawn(task="...", model="opus")` to delegate heavy work.

**Lesson learned:** Initially used Sonnet for everything. Alex corrected me after I delivered shallow research. Now I check task complexity before choosing model.

---

### Just Fix It - Don't Ask (Learned: Feb 9, 2026)
**Problem:** Logger script broke when run standalone (couldn't find .env.local). I asked "Want me to patch that?" instead of just fixing it.

**Alex's feedback:** "Why wouldn't I want you to solve this patch? Feel like something you should have pro actively done"

**Solution:** Added `dotenv` package + auto-load `.env.local` at script startup. Committed and pushed.

**Lesson learned:** Bug fixes, internal improvements, and obvious optimizations = just do it. Don't ask permission for things that are clearly beneficial and low-risk. Per AGENTS.md: "Be bold with internal ones (reading, organizing, learning)." Code fixes fall under this.

---

### Dev vs Prod Environments (Learned: Feb 9, 2026)
**Problem:** Mission Control Kanban wasn't showing logged activities with files in production.

**Root cause:** Convex has TWO deployments:
- Dev: `good-lemming-768.convex.cloud` (local dev, .env.local default)
- Prod: `diligent-tortoise-263.convex.cloud` (live Vercel site)

Was logging to dev, production reads from prod.

**Solution:** Updated logger to use prod by default. When working with backend services, always check dev vs prod config.

**Lesson learned:** Don't assume .env.local is what production uses. Check environment-specific configs (Vercel env vars, Convex deployments, etc.) when debugging "works locally, fails in prod" issues.

---

### React Query Infinite Re-renders (Learned: Feb 9, 2026)
**Problem:** Usage Dashboard tab had infinite loading - 2000+ renders in 15 seconds.

**Root cause:** `endTime: Date.now()` passed directly to Convex query parameters.
- Every render, `Date.now()` returned a slightly different timestamp
- Convex saw each as a **new query** (different params)
- Component re-rendered waiting for result → infinite loop

**Solution:** Removed `endTime` from query params, let server calculate it once per query execution.

**Lesson learned:** Never pass `Date.now()`, `new Date()`, or any volatile function call directly as query parameters in React. Always memoize with `useMemo(() => Date.now(), [])` or use server-side defaults. This applies to React Query, Convex, Apollo, or any reactive query system.

---

### Dual Kanban System (Learned: Feb 8, 2026)
**Problem:** I kept forgetting to update project status, leaving Alex without visibility.

**Solution:** Two complementary tracking systems:

1. **Static Kanban** (https://doopss.github.io/kanban-board/)
   - Quick visual reference
   - Manual HTML updates + git push
   - Good for: High-level project status

2. **Mission Control** (https://doopss-mission-control.vercel.app)
   - Real-time activity feed + searchable Kanban
   - Convex database
   - Good for: Detailed work logging, filtering, search

**Protocol:** Update BOTH when completing work. Don't choose one - they serve different purposes.

**Script for Mission Control logging:**
```bash
cd ~/.openclaw/workspace/mission-control
npx tsx scripts/openclaw-logger.ts \
  --type "development" \
  --title "Task Name" \
  --status "completed" \
  --tags "project-name"
```

---

### Project Documentation
**Always create:**
- README.md with setup instructions
- .env.example (never commit real credentials)
- Clear folder structure
- Test instructions

**For apps:** Include both local testing + deployment steps.

---

## 🚀 Completed Projects

### Acne App (Feb 8, 2026)
**What:** AI-powered acne analysis app with product recommendations  
**Stack:** React Native (Expo) + Supabase + Google Gemini 2.0 Flash  
**Status:** ✅ Complete - ready for Expo Go testing  
**Repo:** https://github.com/doopss/acne_app

**Key decisions:**
- Gemini Flash over GPT-4V (10x cheaper for image analysis)
- Supabase for backend (RLS policies, storage, auth)
- K-beauty inspired UI (soft pink/lavender palette)
- 7 core features: onboarding, camera, AI analysis, recommendations, progress tracking, auth, profile

**Database:** 6 tables (user_profiles, products, analyses, recommendations, user_history, progress_tracking)

---

### Mission Control Dashboard (Feb 8, 2026)
**What:** Real-time activity tracking dashboard for OpenClaw work  
**Stack:** Next.js 16 + Convex + TypeScript  
**Features:** Activity Feed, Calendar View, Kanban Board, Global Search  
**Status:** ✅ Deployed to Vercel  
**URL:** https://doopss-mission-control.vercel.app

**Integration:** Use `openclaw-logger.ts` script to log activities from OpenClaw sessions.

---

### Pet Psychic (Feb 8, 2026)
**What:** AI pet readings for entertainment/engagement  
**Status:** ✅ Marketing assets complete (launch plan, content, visuals)  
**Deliverables:**
- 14-day launch plan (56KB)
- 5 Instagram carousels (40 slides)
- 10 sample pet readings
- 3 TikTok storyboards
- Design system

---

### Budge (ADHD Behavioral Activation)
**What:** Task-breaking app to help users get unstuck  
**Status:** ✅ All user feedback fixes pushed (Feb 9), waiting for testing  
**Recent work (Feb 9, 2026):**
- Fixed 6 user feedback items: notifications crash, sound unmute, keep going nav, timer position, stronger haptics, orb improvements
- Branch: `feature/focus-sounds-haptics` 
- Orb now breathes 2-3x more, warmer focus mode, no outline
**Deliverables:**
- Code review report
- 10 TikTok scripts with timing
- Marketing strategy

---

## 🛠️ Tools & Setup

### Workspace
**Location:** `~/.openclaw/workspace`  
**Structure:**
```
workspace/
├── kanban-board/        # GitHub Pages static Kanban
├── mission-control/     # Activity dashboard (Convex)
├── acne_app/           # Acne analysis app (Expo + Supabase)
├── memory/             # Daily logs (YYYY-MM-DD.md)
├── AGENTS.md           # System instructions
├── SOUL.md             # Persona & tone
├── HEARTBEAT.md        # Proactive work protocols
└── MEMORY.md           # This file
```

### GitHub Repos
- **Kanban:** https://github.com/doopss/kanban-board
- **Acne App:** https://github.com/doopss/acne_app

### Key Services
- **Supabase:** Acne App backend (PostgreSQL + Storage + Auth)
- **Convex:** Mission Control database (real-time)
- **Vercel:** Frontend deployments
- **Google Gemini:** AI image analysis (cost-effective)

---

## 📅 Daily Routines

### Morning (7-9 AM EST)
**Jr Financial Analyst:** Market digest for Alex + Benjamin
- Stock market overview (indices, notable movers)
- Crypto trends (BTC, ETH, altcoins)
- Key news/events

### Nightly (11 PM - 7 AM EST)
**Autonomous work block:**
- Continue current projects (check Kanban for IN PROGRESS)
- Proactive improvements (code review, optimization, research)
- Planning ahead (prep resources, draft proposals)
- **Update Kanban only** (no Telegram unless urgent)

### Throughout Day (2-4x)
**Heartbeat checks:**
- Review recent work for optimization opportunities
- Check productivity/habit patterns
- Spot financial opportunities or risks
- **Update both Kanbans** when work completes

---

## 🔐 Security Notes

**Credentials management:**
- Never commit real API keys or passwords
- Use .env.example as template
- Service role keys are secrets (don't log publicly)
- Anon keys are safe to commit

**Data handling:**
- MEMORY.md contains personal context → only load in main session
- Don't share private info in group chats
- RLS policies protect user data in Supabase

---

## 🎯 Active Context (Updated: Feb 8, 2026)

**Waiting on Alex:**
- Budge functional testing (needs to run app)
- Acne App Expo Go testing (needs Gemini API key)
- Mission Control Convex account (2-min setup) [DONE: Feb 8]

**Blocked:**
- Mission Control full deployment (waiting on Convex) [UNBLOCKED: Feb 8, 6 PM]

**Ready to start:**
- MEMORY.md maintenance (this task - DONE)
- Dating niche competitor analysis (Priority #1 next)

**Deprioritized:**
- FlareGuard (chronic pain app) - removed from roadmap Feb 8

---

## 📊 Performance Notes

**What works:**
- Spawning Opus sub-agents for heavy work (research, long-form writing)
- Proactive updates without asking permission
- Direct, concise communication
- Dual Kanban tracking (different use cases)

**What needs improvement:**
- Remember to update tracking systems immediately (not retroactively)
- Don't assume - check model requirements before starting research/coding
- Log activities to Mission Control when completing significant work

---

## 🧠 Meta-Notes

**This file is for:**
- Long-term patterns and learnings
- Project context that spans multiple days
- Decisions and their rationale
- Relationships and preferences

**This file is NOT for:**
- Raw logs (use memory/YYYY-MM-DD.md)
- Temporary todos (use Kanban)
- Secrets (unless explicitly asked)

**Maintenance:** Review daily logs during heartbeats, update MEMORY.md with distilled insights. Keep it concise - quality over quantity.

---

_Last updated: Feb 8, 2026, 6:11 PM EST_
