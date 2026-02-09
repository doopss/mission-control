# Acne App - Wireframes

**Core User Flow:** Onboarding → Photo Analysis → Personalized Plan → Routine Builder

---

## Screen 1: Welcome / Hook

```
┌────────────────────────────────────┐
│                                    │
│         [App Logo/Icon]            │
│                                    │
│      "Find what works              │
│       for YOUR acne"               │
│                                    │
│   [Illustration: diverse faces]    │
│                                    │
│                                    │
│     • Budget-friendly options      │
│     • Personalized to you          │
│     • Science-backed results       │
│                                    │
│                                    │
│   [     Get Started     ]          │
│                                    │
│   Already have an account? Login   │
│                                    │
└────────────────────────────────────┘
```

**Key elements:**
- Welcoming, judgment-free tone
- Promise: personalized + affordable
- Social proof (optional): "10K+ clear skin journeys"

---

## Screen 2: Pain Point Selection

```
┌────────────────────────────────────┐
│  ← Back                            │
│                                    │
│  What's your biggest               │
│  acne struggle?                    │
│                                    │
│  Select all that apply:            │
│                                    │
│  [✓] Persistent breakouts          │
│  [ ] Acne scars won't fade         │
│  [✓] Hormonal breakouts            │
│  [ ] Cystic acne                   │
│  [ ] Texture/rough skin            │
│  [ ] Too sensitive for actives     │
│  [ ] Nothing works for me          │
│  [ ] Can't afford dermatologist    │
│                                    │
│                                    │
│        [    Continue    ]          │
│                                    │
│                    Progress: 1/4   │
└────────────────────────────────────┘
```

**Why this matters:** Drives personalization. "Hormonal breakouts" → different recs than "acne scars"

---

## Screen 3: Budget Selection

```
┌────────────────────────────────────┐
│  ← Back                            │
│                                    │
│  What's your monthly               │
│  skincare budget?                  │
│                                    │
│  We'll only recommend what         │
│  you can afford.                   │
│                                    │
│                                    │
│  ○ Under $50/month                 │
│     Drugstore + affordable brands  │
│                                    │
│  ● $50-$150/month                  │
│     Sephora-tier, mid-range        │
│                                    │
│  ○ $150+/month                     │
│     Premium + medical-grade        │
│                                    │
│  ○ I'm flexible                    │
│     Show me the best options       │
│                                    │
│                                    │
│        [    Continue    ]          │
│                                    │
│                    Progress: 2/4   │
└────────────────────────────────────┘
```

**Key:** Budget filters ALL recommendations. No showing $200 serums to someone on a $50 budget.

---

## Screen 4: Beauty Philosophy

```
┌────────────────────────────────────┐
│  ← Back                            │
│                                    │
│  What's your skincare              │
│  philosophy?                       │
│                                    │
│  This helps us match your          │
│  preferences.                      │
│                                    │
│  [   Korean Beauty (K-Beauty)   ]  │
│      Multi-step, gentle, hydration │
│                                    │
│  [   Western Clinical           ]  │
│      Active ingredients, targeted  │
│                                    │
│  [   Clean/Natural              ]  │
│      Non-toxic, sustainable        │
│                                    │
│  [   Minimalist                 ]  │
│      Simple 3-step routines        │
│                                    │
│  [   Medical-Grade Only         ]  │
│      Prescription-strength, derm   │
│                                    │
│        [    Continue    ]          │
│                                    │
│                    Progress: 3/4   │
└────────────────────────────────────┘
```

**Outcome:** K-Beauty user gets gentle BHA, not harsh benzoyl peroxide.

---

## Screen 5: What You've Tried

```
┌────────────────────────────────────┐
│  ← Back                            │
│                                    │
│  Have you tried these?             │
│                                    │
│  Tap what you've used:             │
│                                    │
│  [ Benzoyl Peroxide  ] ✓ Didn't work│
│  [ Salicylic Acid    ] ✓ Worked!    │
│  [ Retinoids/Tretinoin ]            │
│  [ Antibiotics       ]              │
│  [ Niacinamide       ] ✓ Worked!    │
│  [ Azelaic Acid      ]              │
│  [ Tea Tree Oil      ] ✓ Too harsh  │
│  [ Birth Control     ]              │
│  [ Other             ]              │
│                                    │
│  Tap again to mark:                │
│  ✓ Worked  /  ✗ Didn't work        │
│                                    │
│        [    Continue    ]          │
│                                    │
│                    Progress: 4/4   │
└────────────────────────────────────┘
```

**Smart filtering:** Don't recommend what already failed. Double down on what worked.

---

## Screen 6: Photo Upload

```
┌────────────────────────────────────┐
│  ← Back                            │
│                                    │
│  Let's see your skin               │
│                                    │
│  Our AI will analyze:              │
│  • Acne type & severity            │
│  • Problem areas                   │
│  • Scarring/texture                │
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │    [  Camera Icon  ]         │  │
│  │                              │  │
│  │   Take Photo / Upload        │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  Tips for best results:            │
│  • Natural lighting                │
│  • No makeup                       │
│  • Front-facing                    │
│                                    │
│     [   Skip for now   ]           │
│                                    │
└────────────────────────────────────┘
```

**Privacy note:** "Your photos are encrypted and never shared"

---

## Screen 7: Analyzing (Loading)

```
┌────────────────────────────────────┐
│                                    │
│                                    │
│     [Animated spinner/orb]         │
│                                    │
│    Analyzing your skin...          │
│                                    │
│    Detected: Mild inflammatory     │
│    Analyzing severity...           │
│    Checking for scarring...        │
│                                    │
│                                    │
│    This usually takes 10-15 sec    │
│                                    │
└────────────────────────────────────┘
```

**Transparent progress:** Show what AI is detecting in real-time.

---

## Screen 8: Analysis Results

```
┌────────────────────────────────────┐
│  ← Back        Share  ︙            │
│                                    │
│  Your Skin Analysis                │
│                                    │
│  ┌──────────────────────────────┐  │
│  │   [Your photo with overlays] │  │
│  │    • Inflammatory acne (12)  │  │
│  │    • Comedones (8)           │  │
│  │    • PIE marks (5)           │  │
│  └──────────────────────────────┘  │
│                                    │
│  Severity: Moderate                │
│  Primary concern: Jaw/chin area    │
│                                    │
│  AI Confidence: 85%                │
│  [Tap to see how we analyzed]      │
│                                    │
│                                    │
│  Based on your:                    │
│  • Moderate inflammatory acne      │
│  • $50-150 budget                  │
│  • Western clinical preference     │
│  • Salicylic acid worked for you   │
│                                    │
│  [  See Your Personalized Plan  ]  │
│                                    │
└────────────────────────────────────┘
```

**Transparency:** Show confidence, let user correct if wrong.

---

## Screen 9: Personalized Plan

```
┌────────────────────────────────────┐
│  ← Back        Save Plan  ︙        │
│                                    │
│  Your Treatment Plan               │
│                                    │
│  💡 Focus: Inflammatory acne       │
│     Expected results: 6-8 weeks    │
│                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                    │
│  Morning Routine                   │
│                                    │
│  1. [CeraVe Hydrating Cleanser]    │
│     $15  |  Gentle, won't dry out  │
│     [Buy on Amazon →]              │
│                                    │
│  2. [Paula's Choice 2% BHA]        │
│     $32  |  Your fave ingredient!  │
│     [Buy on Sephora →]             │
│                                    │
│  3. [La Roche-Posay Moisturizer]   │
│     $20  |  Hydrates without clog  │
│     [Buy on Amazon →]              │
│                                    │
│  4. [EltaMD SPF 46]                │
│     $38  |  Non-comedogenic        │
│     [Buy on Dermstore →]           │
│                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                    │
│  Night Routine                     │
│  (Tap to expand)                   │
│                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                    │
│  Total: $142/month                 │
│  (Within your budget ✓)            │
│                                    │
│  [  Start This Routine  ]          │
│  [  Adjust Products     ]          │
│                                    │
└────────────────────────────────────┘
```

**Key features:**
- Budget-conscious (shows total)
- Explains WHY each product
- Affiliate links (transparent)
- Can adjust if something doesn't work

---

## Screen 10: Home Dashboard

```
┌────────────────────────────────────┐
│  ☰ Menu                 + Add Photo│
│                                    │
│  Hi Alex 👋                        │
│  Day 12 of your routine            │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Progress                    │  │
│  │  ┌────┬────┬────┐           │  │
│  │  │ D1 │ D7 │D12 │  [Graph]  │  │
│  │  └────┴────┴────┘           │  │
│  │  Improving! Keep going.      │  │
│  └──────────────────────────────┘  │
│                                    │
│  Today's Routine                   │
│  Morning: 2/4 completed ✓          │
│  [   Continue Routine   ]          │
│                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                    │
│  Quick Actions                     │
│  📸 Upload Progress Photo          │
│  🛒 Reorder Products               │
│  💬 Ask a Question                 │
│  📚 Learn About Ingredients        │
│                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                    │
│  Community Wins                    │
│  "My PIE marks faded!" - Sarah     │
│  [See more →]                      │
│                                    │
└────────────────────────────────────┘
```

**Habit-building focus:** Track routine completion, not just skin progress.

---

## Screen 11: Routine Tracker

```
┌────────────────────────────────────┐
│  ← Back                            │
│                                    │
│  Morning Routine                   │
│  Feb 7, 2026                       │
│                                    │
│  ✓ 1. Cleanser                     │
│     CeraVe Hydrating               │
│     Completed at 8:15 AM           │
│                                    │
│  ✓ 2. Treatment                    │
│     Paula's Choice BHA             │
│     Completed at 8:17 AM           │
│     [Wait 5 min before next step]  │
│                                    │
│  → 3. Moisturizer                  │
│     La Roche-Posay Toleriane       │
│     [   Mark as Done   ]           │
│                                    │
│  [ ] 4. Sunscreen                  │
│     EltaMD UV Clear                │
│                                    │
│                                    │
│  Need to reorder something?        │
│  [   Shop Products   ]             │
│                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                    │
│  💡 Tip: Wait 20 min after BHA     │
│  before applying moisturizer for   │
│  best absorption.                  │
│                                    │
└────────────────────────────────────┘
```

**Habit-forming:** Checkboxes + timing guidance + education.

---

## Screen 12: Progress Comparison

```
┌────────────────────────────────────┐
│  ← Back        Share  ︙            │
│                                    │
│  Your Progress                     │
│                                    │
│  ┌─────────────┬─────────────┐    │
│  │   Day 1     │   Day 14    │    │
│  │   Feb 1     │   Feb 14    │    │
│  │             │             │    │
│  │  [Photo]    │  [Photo]    │    │
│  │             │             │    │
│  └─────────────┴─────────────┘    │
│                                    │
│  Improvements Detected:            │
│  ✓ 30% reduction in inflammation   │
│  ✓ Fewer new breakouts             │
│  ✓ Skin texture smoother           │
│                                    │
│  ⚠️ Still seeing:                  │
│  • Hormonal breakouts on jawline   │
│                                    │
│  [  Adjust Treatment Plan  ]       │
│                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                    │
│  Keep it up! Results take time.    │
│  Most people see major improvement │
│  around week 6-8.                  │
│                                    │
│  [  Upload New Photo  ]            │
│  [  Share Progress    ]            │
│                                    │
└────────────────────────────────────┘
```

**Celebration + adjustment:** Highlight wins, offer to tweak if stagnant.

---

## Design Notes

### Color Palette (Calming, Clinical)
- **Primary:** Sage Green (#A8E6CF) - healing, calm
- **Secondary:** Soft Blue (#B4D4E1) - trust, medical
- **Background:** Off-white (#F9F9F9) or dark mode (#0A0A0A)
- **Text:** Charcoal (#2C2C2C) or White (#FFFFFF)
- **Accent:** Coral (#FF6B6B) - for warnings/important

### Typography
- **Headings:** Inter / DM Sans (clean, modern)
- **Body:** System font (readable, accessible)
- **Product names:** Semi-bold for scannability

### Photography
- Real skin, not airbrushed
- Diverse skin tones
- Before/afters (with permission)
- No shame, no stigma

---

## Next: High-Fidelity Mockups

Create Figma designs for:
1. Onboarding flow (5 screens)
2. Photo analysis + results (2 screens)
3. Personalized plan (1 screen)
4. Home dashboard (1 screen)
5. Routine tracker (1 screen)

Then: Interactive prototype for user testing.
