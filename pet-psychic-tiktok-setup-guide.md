# Pet Psychic TikTok System - Step-by-Step Setup Guide

**Goal:** Build a working TikTok content system with testing at every stage.
**Rule:** Don't proceed to next step until current step passes quality check.

---

## PHASE 1: Foundation (Day 1)

### Step 1.1: Curate Your First 5 Pets

**What to do:**
1. Find 5 high-quality pet photos with rights to use
2. Save to: `pet_psychic_content/curated_pets/`
3. Name folders: `pet_001_dog_name/`, `pet_002_cat_name/`, etc.
4. Each folder should contain:
   - `main_photo.jpg` (expressive face)
   - `reaction_photo.jpg` (doing something funny/cute)
   - `source.txt` (where you got it, rights status)

**Quality Check:**
- [ ] All 5 photos are high-res (not blurry)
- [ ] All 5 pets have expressive faces
- [ ] You have rights to use all 5
- [ ] Mix of dogs/cats (3 dogs, 2 cats recommended)

**Go/No-Go:** If you can't find 5 quality pets with rights, stop. Source more before continuing.

---

### Step 1.2: Test Your Prompt (Critical)

**What to do:**
1. Run all 5 pet photos through Pet Psychic app
2. Get readings for each
3. Rate each reading 1-5 stars
4. Answer: "Would I share this?" (Yes/No)

**Quality Check:**
- [ ] At least 3/5 readings rated 4+ stars
- [ ] At least 3/5 you'd actually share
- [ ] Mix of funny and emotional (not all same tone)
- [ ] Readings are specific (not generic)

**Go/No-Go:** If less than 3/5 are shareable, iterate on your prompt first. Don't proceed.

**Prompt iteration tracking:**
```
prompt_tests/
├── v1_baseline.md (your current prompt)
├── v1_results.md (5 readings + ratings)
└── v2_improved.md (if needed)
```

---

### Step 1.3: Create Your First TikTok (Manual Test)

**What to do:**
1. Pick your best pet/reading combo from Step 1.2
2. Create 6-slide carousel manually:
   - Slide 1: Pet photo + hook text
   - Slide 2: Screenshot of upload screen
   - Slide 3: Loading screen
   - Slide 4: Result screen
   - Slide 5: Reaction photo
   - Slide 6: CTA (app screenshot)
3. Post to TikTok (personal or test account)

**Quality Check:**
- [ ] Hook stops your scroll (ask a friend)
- [ ] Text is readable on mobile
- [ ] Flow makes sense (6 slides tell a story)
- [ ] Sound matches reading emotion

**Go/No-Go:** If the TikTok feels "off" or boring, fix it. Don't automate garbage.

**Metrics to hit:**
- At least 100 views in 24 hours
- At least 5 likes
- If it bombs (<50 views), fix the hook before proceeding

---

## PHASE 2: Semi-Automation (Days 2-3)

### Step 2.1: Create Templates

**What to do:**
1. Create Canva/Figma templates for each slide type:
   - `template_slide1_hook.psd` (pet photo + text overlay)
   - `template_slide3_loading.psd` (your app's loading screen)
   - `template_slide6_cta.psd` (app screenshot + text)
2. Lock in font sizes (6.5% rule)
3. Lock in text positioning (bottom 15%)

**Quality Check:**
- [ ] Templates look professional
- [ ] Text is readable on phone screen
- [ ] Brand colors consistent
- [ ] Can create a new TikTok in <10 minutes using templates

**Test:** Create 2 more TikToks using templates. Time yourself. Should be <10 min each.

---

### Step 2.2: Set Up Postiz (TikTok API)

**What to do:**
1. Sign up for Postiz account
2. Connect TikTok account
3. Get API credentials
4. Test posting one TikTok as SELF_ONLY draft via API

**Quality Check:**
- [ ] Postiz account created
- [ ] TikTok connected successfully
- [ ] Can upload video via API
- [ ] Draft appears in TikTok app

**Go/No-Go:** If API connection fails or drafts don't appear, troubleshoot before proceeding.

**Test script:**
```bash
# Test Postiz API
curl -X POST "https://postiz.api.endpoint" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "video=@test_video.mp4" \
  -F "caption=Test post" \
  -F "privacy_level=SELF_ONLY"
```

---

### Step 2.3: Create Content Library Structure

**What to do:**
1. Create folder structure:
```
pet_psychic_content/
├── curated_pets/           # Your 5+ pet photos
├── generated_content/      # Where TikToks go
├── analytics/              # Performance tracking
└── templates/              # Canva/Figma templates
```

2. Create tracking spreadsheet:
```csv
date,pet_id,hook_formula,reading_tone,views,likes,shares,rating
```

**Quality Check:**
- [ ] Folder structure exists
- [ ] Can save files to correct locations
- [ ] Tracking spreadsheet works

---

## PHASE 3: Content Pipeline (Days 4-5)

### Step 3.1: Generate 7 Days of Content

**What to do:**
1. Create 14-21 TikToks (2-3 per day for 7 days)
2. Use your 5 curated pets (some pets can have multiple angles)
3. Mix hook formulas:
   - 5 relationship dynamic
   - 5 secret exposed
   - 4 emotional reveal
   - 4 funny/relatable
3. Save all to `generated_content/`

**Quality Check:**
- [ ] All 14-21 TikToks pass your quality bar
- [ ] Each has different hook
- [ ] Mix of emotions (not all funny or all sad)
- [ ] All have proper captions + hashtags

**Go/No-Go:** If you can't make 14 quality TikToks, you need more pet photos or better prompts.

---

### Step 3.2: Schedule First Week

**What to do:**
1. Upload all 14-21 TikToks to Postiz as SELF_ONLY drafts
2. Schedule posting times:
   - Morning: 8-9 AM
   - Afternoon: 12-1 PM
   - Evening: 7-9 PM
3. Test 3 different times, see what works

**Quality Check:**
- [ ] All drafts uploaded successfully
- [ ] Scheduled times are saved
- [ ] You can see drafts in TikTok app

**Test:** Manually publish one draft. Make sure it works end-to-end.

---

### Step 3.3: Document Everything

**What to do:**
1. Write down your exact process
2. Note what tools you use
3. Time each step
4. Identify bottlenecks

**Example documentation:**
```
Current workflow:
1. Select pet photo (2 min)
2. Write hook (3 min)
3. Generate reading via app (1 min)
4. Create 6 slides in Canva (10 min)
5. Export video (2 min)
6. Upload to Postiz (2 min)
Total: 20 min per TikTok
```

**Quality Check:**
- [ ] Process is documented
- [ ] You can hand this to someone else
- [ ] You know exactly how long each step takes

---

## PHASE 4: Launch & Learn (Days 6-14)

### Step 4.1: Start Posting (Week 1)

**What to do:**
1. Post 2x per day for 7 days
2. Track metrics in spreadsheet after each post
3. Note which hooks/formulas perform best

**Daily tracking:**
```
Day 1:
- Post 1 (relationship dynamic): 1,200 views, 85 likes → Good
- Post 2 (emotional): 3,400 views, 210 likes → Great

Pattern: Emotional > Funny so far
```

**Quality Check:**
- [ ] All posts go out on schedule
- [ ] Metrics are being tracked
- [ ] At least 50 views per post (if less, fix hooks)

**Go/No-Go:** If average views <100 after 7 days, your hooks aren't working. Iterate before scaling.

---

### Step 4.2: Analyze & Iterate (End of Week 1)

**What to do:**
1. Review all metrics
2. Identify top 3 performing posts
3. Analyze what they have in common
4. Update skill file with learnings

**Questions to answer:**
- Which hook formula performed best?
- Which pet type got most engagement?
- What time of day worked?
- Which reading tone (sassy/emotional) won?

**Quality Check:**
- [ ] You have data on 14 posts
- [ ] You can identify clear winners
- [ ] You've updated your approach based on data

**Update skill file with:**
```
## Week 1 Learnings
- Emotional hooks perform 3x better than funny
- Dogs > Cats for engagement
- 8 PM posts outperform morning
- "Rescue dog" angle gets most shares
```

---

### Step 4.3: Double Down (Week 2)

**What to do:**
1. Create 21 more TikToks (3/day for Week 2)
2. Focus on winning formulas from Week 1
3. Source 10 more pets in winning category
4. Increase to 3x daily posting

**Quality Check:**
- [ ] Average views increasing vs Week 1
- [ ] At least 1 post over 10K views
- [ ] Profile visits converting to app clicks

**Go/No-Go:** If metrics aren't improving, don't scale. Fix the content first.

---

## PHASE 5: Full Automation (Week 3+)

### Step 5.1: Build AI Agent Integration

**Now** you automate — but only after you know what works manually.

**What to automate:**
1. Pet photo selection from curated library
2. Hook generation using winning formulas
3. Reading generation (if you have API access)
4. Slide creation (if you have image generation API)
5. Postiz upload
6. WhatsApp notification to you

**What stays manual:**
1. Sound selection (must be trending)
2. Final approval before post goes live
3. Responding to comments

**Quality Check:**
- [ ] AI-generated content matches manual quality
- [ ] You review before posting
- [ ] System runs without errors

**Test:** Let AI generate 5 TikToks. Compare to your manual ones. Quality match?

---

### Step 5.2: Scale Content Production

**What to do:**
1. Build database of 50+ curated pets
2. Generate 30 days of content in advance
3. Schedule entire month
4. Review weekly performance

**Quality Check:**
- [ ] 30 days of content ready
- [ ] Mix of formulas (not repetitive)
- [ ] Can sustain 3-4x daily posting

---

### Step 5.3: Optimize for Virality

**What to do:**
1. Analyze top 10% of posts
2. Create templates from winners
3. A/B test variations
4. Double down on what works

**Target metrics (Month 2):**
- 100K+ views per week
- 10%+ profile visit rate
- 50+ app downloads per week
- Consistent viral hits

---

## QUALITY CHECKPOINTS SUMMARY

| Phase | Checkpoint | Pass Criteria |
|-------|-----------|---------------|
| 1.1 | 5 pets curated | 5 high-quality photos with rights |
| 1.2 | Prompt quality | 3/5 readings shareable (4+ stars) |
| 1.3 | First TikTok | 100+ views, feels "right" |
| 2.1 | Templates work | <10 min to create new TikTok |
| 2.2 | Postiz works | API uploads successful |
| 3.1 | Content library | 14+ quality TikToks ready |
| 4.1 | Week 1 performance | 50+ views per post average |
| 4.2 | Data analysis | Clear winners identified |
| 4.3 | Week 2 performance | Views increasing vs Week 1 |
| 5.1 | AI quality | Matches manual quality |
| 5.2 | Scale ready | 30 days content scheduled |
| 5.3 | Viral hits | 100K+ views per week |

---

## RED FLAGS (Stop and Fix)

**Don't proceed if:**
- ❌ Prompt produces generic readings (<3/5 shareable)
- ❌ First TikTok gets <50 views in 24 hours
- ❌ Week 1 average <100 views per post
- ❌ Engagement declining over time
- ❌ Can't find quality pet photos with rights
- ❌ Process takes >30 min per TikTok (won't scale)

**Fix these before continuing.**

---

## SUCCESS SIGNALS (Green Light to Scale)

**Proceed to next phase if:**
- ✅ 3/5 readings are genuinely funny/emotional
- ✅ First TikTok hits 100+ views
- ✅ Week 1 average 500+ views per post
- ✅ Clear winning formula emerges
- ✅ Views increasing week-over-week
- ✅ People commenting "I need this for my pet"

---

## TIMELINE SUMMARY

| Week | Phase | Key Deliverable |
|------|-------|-----------------|
| Day 1 | Foundation | 5 curated pets + working prompt |
| Days 2-3 | Semi-Auto | Templates + Postiz working |
| Days 4-5 | Pipeline | 14+ TikToks ready to post |
| Days 6-12 | Launch | 2x daily posting, learning |
| Days 13-14 | Iterate | Analysis + double down |
| Week 3 | Automation | AI agent handling creation |
| Week 4+ | Scale | 3-4x daily, viral growth |

---

## START NOW

**Your first task:** Find 5 pet photos with rights.

**Don't do anything else until that's done.**

Quality at each step. No shortcuts.

---

*Test everything. Iterate fast. Build what works.*
