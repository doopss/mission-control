# Pet Psychic - Instagram/TikTok Outreach Automation

**Goal:** Automate personalized DM outreach to pet influencers (5K-50K followers) for Pet Psychic app launch.

## Strategy

1. **Target:** Pet content creators with 5K-50K followers, 8%+ engagement
2. **Extract:** Pet names from bios, captions, video descriptions
3. **Personalize:** DM template with pet's name
4. **Human-like:** Random delays (2-5 min between DMs), stagger timing
5. **Volume:** 20-30 DMs per day per platform (avoid spam detection)

## Workflow

### Phase 1: Research & List Building (Manual)
1. Search hashtags: #dogsoftiktok #catsoftiktok #funnypets #pethumor
2. Filter accounts: 5K-50K followers, high engagement, active posting
3. Build target list with pet names

### Phase 2: Pet Name Extraction (Semi-Automated)
- Check bio for pet name patterns ("Meet [Name]", "[Name] the dog", etc.)
- Scan recent post captions for pet mentions
- Video descriptions on TikTok
- Fallback: "your pet" if name not found

### Phase 3: Outreach Automation (Browser-Based)
- Use OpenClaw browser control to:
  - Navigate to target accounts
  - Send personalized DMs
  - Random delays between actions (120-300s)
  - Track sent/pending/responses

## Files

- `target-list.json` - Influencer database (username, platform, pet name, followers, status)
- `dm-template.txt` - Message template with variables
- `send-dms.ts` - Automation script (TypeScript)
- `outreach-log.json` - Track who was contacted, when, response status

## DM Template

```
Hey {name}! 👋

I'm HueleBicho from Pet Psychic - we just built an app that gives hilarious AI "psychic readings" for pets. Think mystical fortune teller meets pet comedy.

{petName} would be PERFECT for this. We'd love to give them a free reading (no strings attached!). If you think it's funny enough to share with your audience, amazing. If not, totally cool.

Want to try it? I can send you early access right now.

- HueleBicho
```

## Safety & Ethics

- **No spam:** Max 20-30 DMs/day per platform
- **Human-like delays:** 2-5 min between messages, vary timing
- **Real value:** Only reach out to accounts that fit the product
- **Respect opt-outs:** Track "not interested" and never message again
- **Platform compliance:** Follow Instagram/TikTok ToS

## Next Steps

1. Build target list (50 accounts)
2. Extract pet names
3. Test on 3-5 accounts manually
4. Automate with browser control
5. Monitor responses, adjust messaging
