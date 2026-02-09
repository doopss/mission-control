# Acne App - Complete UX Flow with Updated Results Screen

**Updated:** 2026-02-08 3:35 AM EST  
**Changes:** Results screen redesigned to match social sharing card style

---

## End-to-End User Journey

### 🎯 Flow Overview
1. Welcome → 2. Pain Points → 3. Budget → 4. Philosophy → 5. What You've Tried → 6. Photo Upload → 7. Analyzing → **8. Results (NEW DESIGN)** → 9. Treatment Plan → 10. Dashboard

---

## Screen 8: Analysis Results (REDESIGNED)

**New style:** Social-shareable card with breakdown scores (inspired by attractiveness rating apps)

```
┌─────────────────────────────────────────┐
│  ← Back                    Share  ︙     │
│                                         │
│     Your Skin Analysis                  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │   ╔═══════════════════════════╗   │  │
│  │   ║                           ║   │  │
│  │   ║      YOUR SKIN SCORE      ║   │  │
│  │   ║                           ║   │  │
│  │   ║         72/100   📸       ║   │  │
│  │   ║      (Moderate Acne)      ║   │  │
│  │   ║                           ║   │  │
│  │   ║ ───────────────────────── ║   │  │
│  │   ║                           ║   │  │
│  │   ║ 💧 Hydration       8/10   ║   │  │
│  │   ║                           ║   │  │
│  │   ║ 🎯 Texture         6/10   ║   │  │
│  │   ║                           ║   │  │
│  │   ║ 🔴 Inflammation    4/10   ║   │  │
│  │   ║                           ║   │  │
│  │   ║ 🌟 Overall Clarity 7/10   ║   │  │
│  │   ║                           ║   │  │
│  │   ║ 🧴 Pores           5/10   ║   │  │
│  │   ║                           ║   │  │
│  │   ║ ⚫ Dark Spots      6/10   ║   │  │
│  │   ║                           ║   │  │
│  │   ╚═══════════════════════════╝   │  │
│  │                                   │  │
│  │   [📸] [📱] [💬]                  │  │
│  │   iMessage  Instagram  WhatsApp   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  🎯 Primary Concerns Detected:          │
│  • Inflammatory acne (moderate)         │
│  • T-zone congestion                    │
│  • Post-inflammatory marks              │
│                                         │
│  📍 Problem Areas:                      │
│  Forehead (mild), Cheeks (moderate),    │
│  Chin & Jaw (moderate-severe)           │
│                                         │
│  🤖 AI Confidence: 87%                  │
│  [Tap to see how we analyzed your skin]│
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  Based on your analysis + preferences:  │
│  • $50-150 budget ✓                    │
│  • Western clinical approach ✓         │
│  • Salicylic acid worked for you ✓     │
│                                         │
│  [   See Your Personalized Plan   ]    │
│                                         │
│  [   Retake Photo   ]                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Visual Design Specs for Results Card

### Card Gradient (Sage → Soft Blue)
- **Top:** #A8E6CF (Sage Green - healing)
- **Bottom:** #B4D4E1 (Soft Blue - clinical trust)
- **Gradient angle:** 135° (top-left to bottom-right)

### Score Display
- **Main score:** 72px font, bold, white
- **"/100" suffix:** 36px font, 70% opacity
- **Sub-label:** "Moderate Acne" - 18px, 80% opacity
- **Profile photo:** 80x80px circle, right-aligned

### Breakdown Metrics
- **Icon:** 24x24px emoji or SF Symbols
- **Label:** 16px, white, medium weight
- **Score:** 18px, bold, right-aligned
- **Divider:** 1px white, 20% opacity

### Metric Icons
- 💧 Hydration (how well-moisturized skin looks)
- 🎯 Texture (smoothness vs bumpiness)
- 🔴 Inflammation (redness, active breakouts)
- 🌟 Overall Clarity (general skin health)
- 🧴 Pores (enlarged pores, congestion)
- ⚫ Dark Spots (PIH, PIE marks)

### Share Buttons
- **Style:** Icon-only, 48x48px circular
- **Background:** White, 20% opacity
- **Hover:** White, 40% opacity
- **Icons:** System icons (Messages, Instagram, WhatsApp)

---

## Scoring Logic (How We Calculate)

### Overall Score (0-100)
```
Base score = 100
Deduct based on:
- Inflammatory lesions: -2 per lesion (max -30)
- Comedones: -1 per comedone (max -20)
- PIH/PIE marks: -1 per mark (max -15)
- Texture issues: -10 for rough texture
- Pore congestion: -10 for visible blackheads
- Redness: -5 for diffuse redness

Final score = Base - Total deductions
```

### Severity Mapping
- **85-100:** Clear / Excellent
- **70-84:** Mild Acne
- **50-69:** Moderate Acne
- **30-49:** Severe Acne
- **0-29:** Very Severe Acne

### Individual Metric Scores (0-10)
- **Hydration:** AI detects dryness/flakiness (10 = well-hydrated)
- **Texture:** Smoothness vs bumpiness (10 = smooth)
- **Inflammation:** Active breakouts, redness (10 = no inflammation)
- **Overall Clarity:** General skin health (10 = glowing)
- **Pores:** Enlarged pores, blackheads (10 = refined pores)
- **Dark Spots:** PIH/PIE marks (10 = no marks)

---

## Alternative Design: Dark Mode

```
┌─────────────────────────────────────────┐
│  ← Back                    Share  ︙     │
│                                         │
│     Your Skin Analysis                  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   Background: #1A1A1A             │  │
│  │                                   │  │
│  │   ╔═══════════════════════════╗   │  │
│  │   ║   Dark gradient:          ║   │  │
│  │   ║   #2D4A3E → #1E3A44       ║   │  │
│  │   ║                           ║   │  │
│  │   ║      YOUR SKIN SCORE      ║   │  │
│  │   ║                           ║   │  │
│  │   ║         72/100   📸       ║   │  │
│  │   ║      (Moderate Acne)      ║   │  │
│  │   ║                           ║   │  │
│  │   ║   [Same metrics layout]   ║   │  │
│  │   ║                           ║   │  │
│  │   ╚═══════════════════════════╝   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [Rest of screen same as light mode]   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Social Sharing Features

### When User Taps "Share"

**Option 1: Share Card Image**
- Generate PNG of just the card
- No personal info (just scores)
- Watermark: "Made with [App Name]"

**Option 2: Share Link**
- "I analyzed my skin with [App Name]! Check it out: [link]"
- Link → App Store / landing page

**Option 3: Compare with Friends**
- "My skin score is 72. What's yours?"
- Drives virality (like attractiveness apps)

### Privacy Controls
- **Default:** Sharing disabled (medical info)
- **Opt-in:** User can enable sharing in settings
- **Anonymous mode:** Share scores without photo

---

## Full UX Flow (Updated)

### 1. Welcome Screen
**Goal:** Hook user with value prop  
**CTA:** "Get Started"  
**Time:** 5 seconds

---

### 2. Pain Point Selection
**Goal:** Understand user's primary struggle  
**Options:** 8 checkboxes (multi-select)  
**Time:** 20 seconds

---

### 3. Budget Selection
**Goal:** Filter all recs by affordability  
**Options:** 4 radio buttons  
**Time:** 10 seconds

---

### 4. Beauty Philosophy
**Goal:** Match skincare approach preferences  
**Options:** 5 buttons (single-select)  
**Time:** 15 seconds

---

### 5. What You've Tried
**Goal:** Don't recommend what failed  
**Interaction:** Tap once = tried, tap again = worked/didn't  
**Time:** 30 seconds

---

### 6. Photo Upload
**Goal:** Capture face for AI analysis  
**Options:** Camera or upload from gallery  
**Time:** 30 seconds

---

### 7. Analyzing (Loading)
**Goal:** Build anticipation, show transparency  
**Display:** Real-time progress updates  
**Time:** 10-15 seconds

---

### 8. Results (NEW DESIGN)
**Goal:** Celebrate user, show detailed breakdown  
**Key elements:**
- Overall score (72/100)
- 6 metric breakdowns (hydration, texture, inflammation, etc.)
- Social share buttons
- Primary concerns summary
- AI confidence score

**CTA:** "See Your Personalized Plan"  
**Time:** 60-90 seconds (user reads scores)

---

### 9. Treatment Plan
**Goal:** Actionable product recommendations  
**Display:**
- Morning routine (4 products)
- Night routine (4 products)
- Total cost (must be within budget)
- Buy links (affiliate)

**CTA:** "Start This Routine"  
**Time:** 2-3 minutes

---

### 10. Dashboard (Home)
**Goal:** Daily habit tracking + progress monitoring  
**Sections:**
- Progress graph (Day 1 vs Today)
- Today's routine checklist
- Quick actions (upload photo, reorder, ask AI)
- Community wins

**Time:** 30 seconds (daily check-in)

---

## Key Interactions

### Results Screen Gestures
- **Tap metric:** Expands detail ("What does this mean?")
- **Tap confidence:** Shows AI analysis breakdown
- **Tap share:** Opens share sheet
- **Swipe down:** Dismiss card, see detailed view
- **Tap photo:** View full-size analysis with overlays

---

## Accessibility

### Screen Reader Support
- "Your skin score is 72 out of 100. Moderate acne."
- "Hydration score: 8 out of 10. Good."
- "Inflammation score: 4 out of 10. Needs attention."

### Color Contrast
- WCAG AA compliant (4.5:1 minimum)
- Dark mode: lighter text (#E0E0E0)
- Icons: clear against gradient

### Font Sizes
- Minimum 14px body text
- Adjustable via system settings

---

## Technical Implementation

### Results Card Generation
```javascript
// Pseudocode
function generateScoreCard(analysis) {
  const scores = {
    overall: calculateOverallScore(analysis),
    hydration: analyzeHydration(analysis.texture),
    texture: analyzeTexture(analysis.surface),
    inflammation: countInflammation(analysis.lesions),
    clarity: calculateClarity(analysis),
    pores: analyzePores(analysis.blackheads),
    darkSpots: countPIH(analysis.marks)
  };
  
  return renderCard(scores, analysis.photo);
}
```

### Share Image Export
```javascript
// Generate shareable PNG
function exportCardImage() {
  const card = document.getElementById('score-card');
  html2canvas(card).then(canvas => {
    const image = canvas.toDataURL('image/png');
    shareImage(image);
  });
}
```

---

## Next Steps

### Design Phase:
1. ✅ Wireframes complete
2. ✅ Results screen redesigned (new style)
3. 🔄 Create Figma mockups (high-fidelity)
4. 🔄 Interactive prototype
5. 🔄 User testing (10-20 people)

### Development Phase:
1. Backend setup (Supabase)
2. AI integration (Gemini Flash)
3. Frontend build (React Native)
4. Scoring algorithm implementation
5. Share feature integration

**Ready for Figma mockups now!**

---

## Questions for Alex

1. **Results card gradient:** Sage→Blue or different colors?
2. **Profile photo:** Include or just scores?
3. **Sharing:** Enable by default or opt-in only?
4. **Metric selection:** Keep these 6 or add/remove any?
5. **Tone:** Keep "Your Skin Score" or something else ("Skin Health Report")?

---

**File Updated:** 2026-02-08 3:40 AM EST  
**Status:** Ready for high-fidelity design
