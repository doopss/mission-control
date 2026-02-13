# Pet Influencer Research Guide

## Target Criteria

✅ **Good Fit:**
- 5K-50K followers (micro-influencers, higher engagement)
- 8%+ engagement rate (likes + comments / followers)
- Active posting (at least 2-3x per week)
- Funny/relatable pet content (not serious/educational only)
- Responds to comments (indicates they'll read DMs)
- Pet's name visible in bio or captions

❌ **Avoid:**
- Mega-influencers (1M+) - won't read DMs
- Brand accounts (not authentic)
- Inactive accounts (last post >2 weeks ago)
- Serious pet training/vet content (wrong vibe)
- Private accounts (can't analyze content)

## Instagram Research

### Search Strategy

**Hashtags to search:**
```
#dogsoftiktok (also works on IG)
#catsofinstagram
#funnypets
#pethumor
#dogmemes
#catmemes
#petsofig
#dogsofig
#catsofig
```

**How to filter:**
1. Search hashtag
2. Switch to "Top" posts
3. Click profile → check followers + engagement
4. Look for pet name in bio (e.g., "Meet Luna 🐶" or "Bella the golden retriever")
5. Scan recent posts for consistent pet content
6. Check comment section - do they reply?

### Profile Analysis Checklist

When evaluating a profile, check:

- [ ] Follower count: 5K-50K
- [ ] Bio mentions pet's name
- [ ] Pet type clear (dog, cat, etc.)
- [ ] Recent posts (within last 7 days)
- [ ] High engagement on posts (8%+)
- [ ] Replies to comments
- [ ] DMs enabled (not disabled for non-followers)

### Pet Name Extraction

**Common patterns in bio:**
- "Meet [Name]" → Name = pet name
- "[Name] the [breed]" → Name = pet name
- "🐾 [Name]" → Name = pet name
- "@[pet_handle]" → Check linked account bio

**Fallback:** Check last 3 post captions for repeated name mentions.

### Example Good Profile:

```
@luna.the.golden
📍 NYC | 🐶 Golden Retriever
Luna's mom documenting her chaos
Funny videos daily! 🎥
[email for collabs]

Followers: 32K
Engagement: ~3,500 likes per post = 10.9%
Last post: 2 days ago
Comments: Owner replies to most
Pet name: Luna ✅
```

## TikTok Research

### Search Strategy

**Hashtags:**
```
#dogsoftiktok
#catsoftiktok
#petsoftiktok
#funnypets
#petcomedy
#dogmom
#catmom
```

**How to filter:**
1. Search hashtag
2. Filter by follower count (not always visible upfront)
3. Click profile → check follower count + engagement
4. Look for pet name in bio or pinned video
5. Watch 2-3 recent videos to confirm vibe

### TikTok Profile Analysis

- [ ] Follower count: 5K-50K
- [ ] Bio mentions pet or pet name
- [ ] Consistent posting (at least 1-2x per week)
- [ ] High video views relative to followers (10-20% is good)
- [ ] Engaged audience (comments, duets, stitches)
- [ ] Replies to comments

### Pet Name Extraction (TikTok)

**Common patterns:**
- Bio: "Just [Name] being [Name] 🐾"
- Video captions: "[Name] when..." or "POV: You're [Name]..."
- Pinned video: Often introduces pet by name
- Username: "namethe[breed]" or "[petname]adventures"

**Fallback:** Watch 2-3 recent videos, name usually mentioned.

## Building the Target List

### Spreadsheet Tracking (Before Automation)

While researching, track in a simple spreadsheet:

| Username | Platform | Pet Name | Pet Type | Followers | Engagement% | Last Post | Notes |
|----------|----------|----------|----------|-----------|-------------|-----------|-------|
| luna.the.golden | instagram | Luna | Dog | 32K | 10.9% | 2 days ago | Funny content, replies to comments |

Once you have 20-50 accounts, transfer to `target-list.json`.

### Adding to target-list.json

Example entry:
```json
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
  "notes": "Funny content, very active, replies to comments"
}
```

## Automation-Ready Checklist

Before running `send-dms.ts`:

- [ ] At least 20 targets in `target-list.json`
- [ ] All targets have pet names extracted
- [ ] All targets meet follower/engagement criteria
- [ ] DM template reviewed and approved
- [ ] Test run on 3-5 accounts first (`--limit 5`)
- [ ] Monitor responses after 24h
- [ ] Adjust message based on feedback

## Response Tracking

After sending DMs, monitor for:

✅ **Positive signals:**
- Replies within 24-48h
- Asks questions about the app
- Wants early access
- Shares with friends

⚠️ **Neutral signals:**
- "Let me think about it"
- "I'll check it out"
- Likes message but doesn't reply

❌ **Negative signals:**
- "Not interested"
- No response after 7 days
- Blocks/reports (very rare if message is respectful)

Update `target-list.json` status field accordingly:
- `responded` → They replied (positive or neutral)
- `interested` → They want to try it
- `not_interested` → They declined

## Daily Workflow

**Day 1: Research (2-3 hours)**
- Find 20-30 accounts
- Extract pet names
- Add to target-list.json
- Verify all fields complete

**Day 2: Test Run (1 hour)**
- Send 3-5 test DMs manually or via script
- Monitor responses
- Adjust template if needed

**Day 3-7: Scale Up (30 min/day)**
- Send 10-15 DMs per platform per day
- Track responses
- Follow up after 3 days with non-responders
- Continue researching new accounts

**Week 2+: Optimize**
- Analyze what types of accounts respond best
- Refine targeting criteria
- Double down on high-response segments
- Build partnerships with interested influencers

## Tips

1. **Be genuine:** These are real people, not email addresses. Respectful, brief, valuable.
2. **Timing matters:** DMs sent 9am-5pm on weekdays get better response rates.
3. **Personalization wins:** Even small touches like using pet's name increase response 2-3x.
4. **Quality > Quantity:** 10 well-targeted DMs > 50 spray-and-pray messages.
5. **Follow up (once):** If no response after 3 days, send ONE brief follow-up. Then move on.

## Next Steps

1. Research 20 Instagram accounts (use this guide)
2. Research 20 TikTok accounts
3. Add all to target-list.json
4. Test send-dms.ts on 3 accounts (--dry-run first)
5. Monitor responses, iterate
