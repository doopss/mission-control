# Pet Psychic Outreach - Quick Start Guide

**Goal:** Send 20-30 personalized DMs per day to pet influencers on Instagram/TikTok.

## 🚀 Quick Start (30 Minutes)

### Step 1: Research 5 Test Accounts (15 min)

**Instagram:**
1. Search #dogsoftiktok or #catsofinstagram
2. Find 3 accounts with 5K-50K followers
3. Extract pet names from bios/captions
4. Note username, followers, pet name

**TikTok:**
1. Search #dogsoftiktok
2. Find 2 accounts with 5K-50K followers
3. Extract pet names
4. Note details

### Step 2: Add to Target List (5 min)

Edit `target-list.json`:

```json
{
  "targets": [
    {
      "username": "luna.the.golden",
      "platform": "instagram",
      "petName": "Luna",
      "petType": "dog",
      "followers": 32000,
      "engagementRate": 10.9,
      "lastPost": "2026-02-09",
      "contactMethod": "DM",
      "status": "not_contacted",
      "notes": "Funny content, active"
    }
  ],
  "metadata": {
    "totalTargets": 1,
    "contacted": 0,
    "responded": 0,
    "interested": 0,
    "notInterested": 0,
    "lastUpdated": "2026-02-11T04:30:00-05:00"
  }
}
```

### Step 3: Test Script (5 min)

Dry run to preview messages:

```bash
cd pet-psychic-outreach
npx tsx send-dms.ts --platform instagram --limit 3 --dry-run
```

This shows what messages would be sent WITHOUT actually sending them.

### Step 4: Send Test DMs (5 min)

**Option A: Manual (Recommended for first 3)**
1. Open Instagram/TikTok
2. Navigate to target profile
3. Click "Message"
4. Copy/paste personalized message from template
5. Send

**Option B: Automated (After manual testing)**
```bash
npx tsx send-dms.ts --platform instagram --limit 3
```

## 📋 Daily Workflow

**Morning (30 min):**
1. Research 10 new accounts
2. Add to target-list.json
3. Send 5 DMs on Instagram

**Afternoon (30 min):**
1. Research 10 more accounts
2. Send 5 DMs on TikTok
3. Check responses from yesterday

**Total:** 1 hour/day, 10 DMs sent, 20 new accounts researched

## 🎯 Week 1 Goals

- **Day 1:** 3-5 test DMs, validate approach
- **Day 2:** 10 DMs sent, monitor responses
- **Day 3:** 15 DMs sent, adjust messaging if needed
- **Day 4-7:** 20-30 DMs/day, scale up

**Target by Day 7:** 100+ DMs sent, 5-10 responses, 2-3 interested influencers

## 🔧 Files Overview

```
pet-psychic-outreach/
├── README.md              # Strategy overview
├── QUICK-START.md         # This file
├── research-guide.md      # How to find targets
├── dm-template.txt        # Message template
├── target-list.json       # Influencer database
├── send-dms.ts            # Automation script
└── outreach-log.json      # Activity tracking
```

## ✅ Pre-Flight Checklist

Before scaling up:

- [ ] Sent 3-5 test DMs manually
- [ ] Template feels natural and not spammy
- [ ] At least 1 positive response or neutral acknowledgment
- [ ] target-list.json has 20+ accounts
- [ ] Understand how to use send-dms.ts
- [ ] Dry-run tested successfully

## 🚨 Red Flags (Stop & Adjust)

❌ **If you see:**
- Multiple "not interested" or blocks → Message too pushy, revise
- Zero responses after 20 DMs → Wrong audience or bad timing
- Instagram warns about spam → Slow down, reduce volume
- DMs not sending → Account restrictions, wait 24h

✅ **Solution:**
- Refine targeting (better account selection)
- Adjust message tone (less salesy, more casual)
- Lower volume (10-15/day instead of 30)
- Personalize more (mention specific post/pet trait)

## 💡 Pro Tips

1. **Timing:** Send DMs 9am-5pm weekdays for better response rates
2. **Personalization:** Reference a specific post ("loved your recent video of Luna at the beach!")
3. **Follow-up:** Wait 3 days, then send ONE brief bump
4. **Value first:** Lead with "free reading for your pet" not "promote our app"
5. **Track everything:** Update target-list.json after each response

## 🎬 Next Actions

**Right now:**
1. Research 5 accounts (use research-guide.md)
2. Add to target-list.json
3. Run dry-run: `npx tsx send-dms.ts --platform instagram --limit 3 --dry-run`
4. Send 3 test DMs manually
5. Check back in 24h for responses

**Tomorrow:**
1. Check responses from today
2. Research 10 more accounts
3. Send 10 DMs (5 IG, 5 TikTok)
4. Update target-list.json with response status

**This week:**
1. Build list to 50 accounts
2. Send 100+ DMs total
3. Secure 3-5 interested influencers
4. Plan content collabs with responders

---

**Questions?** Check README.md for full strategy or research-guide.md for targeting help.

**Let's go! 🚀** Start with 5 test accounts and ship it.
