# Pet Psychic TikTok - Hybrid Automation Setup Guide
## Week 1: Build the Machine with Human Oversight

**Philosophy:** Automate the repeatable, human judges the creative.

---

## PRE-WORK: What You Need Ready

Before starting:
- [ ] Pet Psychic app with working prompt
- [ ] Postiz account with TikTok connected
- [ ] Folder: `pet_psychic_content/`
- [ ] 5 curated pet photos with rights

**Time estimate:** 4-6 hours total for Week 1 setup

---

## STEP 1: Automate Reading Generation (30 min)

**What to build:** Script/system that takes a pet photo and returns the reading.

### Option A: Manual App Workflow (Start here)
1. Open Pet Psychic app
2. Upload pet photo
3. Screenshot the result
4. Save to: `generated_content/pet_001/reading.txt`

**Checkpoint 1:**
- [ ] Can generate reading in <2 minutes
- [ ] Reading is saved to correct folder
- [ ] Quality: Would you share this reading? (Yes/No)

**If No:** Fix your prompt before continuing. Don't automate bad readings.

---

### Option B: API Automation (Do this after Option A works)
If Pet Psychic has API or you can script the process:

```python
# pseudo-code
def generate_reading(pet_photo_path):
    # Upload to app/API
    # Get reading text
    # Save to file
    return reading_text
```

**Checkpoint 2:**
- [ ] Script runs without errors
- [ ] Generates same quality as manual
- [ ] Saves to correct location

---

## STEP 2: Create Caption Template (15 min)

**Template structure:**
```
{hook}

{reading_preview_or_context}

#getpetreading #{pet_type}tok #{trending_hashtag} #{breed_or_type}
```

**Example:**
```
My boyfriend didn't believe in pet psychics until I showed him his dog's reading 😂

The accuracy is scary

#getpetreading #dogtok #trending #goldenretriever
```

**Automated part:** Caption template with variables
**Manual part:** You write the hook (this is where the magic is)

**Checkpoint 3:**
- [ ] Template created
- [ ] You can fill in variables in <30 seconds
- [ ] Hashtags are appropriate

---

## STEP 3: Build File Organization System (20 min)

**Folder structure:**
```
pet_psychic_content/
├── curated_pets/
│   ├── pet_001_dog_max/
│   │   ├── main_photo.jpg
│   │   ├── reaction_photo.jpg
│   │   └── source.txt
│   └── ...
└── generated_content/
    ├── 2026-02-12_pet001/
    │   ├── slide_1_hook.jpg (you create)
    │   ├── slide_2_upload.jpg (screenshot)
    │   ├── slide_3_loading.jpg (screenshot)
    │   ├── slide_4_result.jpg (screenshot)
    │   ├── slide_5_reaction.jpg (you pick)
    │   ├── slide_6_cta.jpg (you create)
    │   ├── caption.txt
    │   ├── reading.txt
    │   └── status.txt (draft/posted)
    └── ...
```

**Automation script:**
```bash
# create_content_folder.sh
DATE=$(date +%Y-%m-%d)
PET_ID=$1
mkdir -p "generated_content/${DATE}_${PET_ID}"
touch "generated_content/${DATE}_${PET_ID}/caption.txt"
touch "generated_content/${DATE}_${PET_ID}/reading.txt"
touch "generated_content/${DATE}_${PET_ID}/status.txt"
echo "Created folder for ${PET_ID} on ${DATE}"
```

**Checkpoint 4:**
- [ ] Folder structure exists
- [ ] Script creates new folders automatically
- [ ] You know where everything goes

---

## STEP 4: Build Content Generation Workflow (45 min)

**Daily Workflow (Hybrid):**

### Morning: Generate Content (15 min)
**Automated/Assisted:**
1. Pick pet from curated library
2. Run reading generation (manual or scripted)
3. Create folder structure
4. Save reading to folder

**Human:**
5. Read the generated reading
6. Decide: Emotional or funny?
7. Pick hook formula based on reading tone
8. Write hook text
9. Save to `caption.txt`

**Output:** Complete folder with reading + hook + caption ready

**Checkpoint 5:**
- [ ] Can generate 1 complete content package in <15 min
- [ ] Reading quality is good
- [ ] Hook is specific and engaging
- [ ] Everything saved correctly

---

### Afternoon: Create TikTok (15 min)
**Human (creative decisions):**
1. Open Canva/Figma
2. Create 6 slides using templates
3. Add hook text to slide 1
4. Add reading to slide 4
5. Export video

**Automated:**
6. Upload to Postiz as SELF_ONLY draft
7. Save draft URL to folder

**Human:**
8. Send yourself WhatsApp: "Pet001 ready: [draft link]"

**Checkpoint 6:**
- [ ] TikTok creation takes <15 min
- [ ] All 6 slides look good
- [ ] Draft appears in TikTok app
- [ ] You have the link

---

### Evening: Publish (2 min)
**Human (final creative control):**
1. Open TikTok draft
2. Pick trending sound (check what's trending TODAY)
3. Review - does this feel right?
4. Hit publish
5. Update `status.txt` to "posted"

**Checkpoint 7:**
- [ ] Publishing takes <2 min
- [ ] Sound matches reading emotion
- [ ] Posted successfully
- [ ] Status tracked

---

## STEP 5: Daily Tracking System (15 min)

**Create tracking spreadsheet:**
```csv
date,pet_id,hook_formula,reading_tone,sound_type,views_24h,views_72h,likes,shares,comments,would_repeat
2026-02-12,pet_001,relationship,funny,cartoon,450,1200,32,8,5,yes
```

**Daily task (5 min):**
- Check previous day's post metrics
- Fill in spreadsheet
- Note observations

**Checkpoint 8:**
- [ ] Spreadsheet created
- [ ] You're tracking all posts
- [ ] You review metrics daily

---

## WEEK 1 SCHEDULE

### Day 1: Setup
- [ ] Complete Steps 1-4
- [ ] Generate 1 test TikTok end-to-end
- [ ] Post it
- [ ] Pass all 8 checkpoints

### Day 2-3: Build Library
- [ ] Generate 3 TikToks per day
- [ ] All pass your quality check
- [ ] Post 2 per day
- [ ] Track metrics

### Day 4-7: Ramp Up
- [ ] Generate 5 TikToks per day
- [ ] Post 2-3 per day
- [ ] Identify patterns in metrics
- [ ] Update skill file with learnings

---

## DAILY TIME COMMITMENT

| Task | Time | Automated? |
|------|------|------------|
| Generate readings | 10 min | Semi (app workflow) |
| Write hooks | 15 min | No (human creative) |
| Create TikToks | 15 min | No (templates help) |
| Upload to Postiz | 5 min | Yes (API/script) |
| Publish with sound | 10 min | No (human judgment) |
| Track metrics | 5 min | Semi (spreadsheet) |
| **Total per day** | **60 min** | **30% automated** |

**Goal:** Get to 2-3 TikToks per day in 60 minutes.

---

## CHECKPOINT SUMMARY (Week 1)

| Day | Checkpoint | Criteria |
|-----|-----------|----------|
| 1 | Setup complete | Can generate 1 TikTok end-to-end |
| 2 | First 2 posts | Both posted, metrics tracked |
| 3 | Quality maintained | 3rd post as good as 1st |
| 4 | Speed improved | <60 min for 2 TikToks |
| 5 | Pattern emerging | You see what's working |
| 6 | Skill file updated | Documented learnings |
| 7 | Week 1 review | Know your winning formula |

---

## WEEK 1 SUCCESS CRITERIA

**Pass (proceed to Week 2):**
- [ ] 10-14 TikToks posted
- [ ] Average 200+ views per post
- [ ] You enjoy the process
- [ ] Clear winning hook formula identified
- [ ] Can create TikTok in <20 min

**Fail (fix before proceeding):**
- [ ] Readings aren't shareable
- [ ] Average <50 views per post
- [ ] Process takes >90 min per day
- [ ] No clear pattern in what's working

---

## WEEK 2+: INCREASE AUTOMATION

Once Week 1 passes:

**Automate more:**
- Hook selection from proven formulas
- Caption generation with variables
- Batch upload to Postiz (queue 3 days)

**Keep manual:**
- Final review before publish
- Sound selection (trending changes)
- Responding to comments

**Target:** 60% automated by Week 2, 80% by Week 3.

---

## START NOW

**Your first task:** Complete Step 1 (Reading Generation).

Generate 1 reading for your best pet photo.

**Checkpoint:** Would you share this reading? 

**If Yes:** Proceed to Step 2.
**If No:** Fix prompt. Repeat until Yes.

Don't build anything else until the reading quality is there.

---

*Quality first. Speed second. Automation third.*
