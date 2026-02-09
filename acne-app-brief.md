# Acne Analysis App - Product Brief

**Date:** 2026-02-07 11:25 PM EST  
**Status:** UX/UI Design Phase

---

## Vision

**The premier acne analysis app that drives meaningful results.**

Not just another skin scanner - a personalized acne treatment companion that adapts to:
- User's budget
- Beauty philosophy (Korean, Western, minimalist, etc.)
- Specific pain points and concerns
- Skin type and acne severity

---

## Core Differentiators

### 1. Budget-Conscious Recommendations
- **Drugstore Budget:** <$50/month solutions
- **Mid-Range:** $50-150/month (Sephora-tier)
- **Premium:** $150+/month (medical-grade, derm recommended)
- **DIY/Natural:** Home remedies, ingredient-based

### 2. Beauty Philosophy Matching
- **Korean Beauty (K-Beauty):** Multi-step routines, gentle ingredients, hydration-first
- **Western Clinical:** Active ingredients, targeted treatment, results-focused
- **Clean Beauty:** Natural, non-toxic, sustainable
- **Minimalist:** 3-step routines, multi-taskers, no-fuss
- **Medical-Grade:** Prescription-strength, derm-vetted only

### 3. Pain Point-Driven
Not "scan your acne" → generic advice.
Instead: "Why are you here?" → personalized solution.

**Common pain points:**
- "Nothing works for me"
- "Too expensive / can't afford dermatologist"
- "Overwhelmed by options"
- "Scars won't fade"
- "Hormonal breakouts"
- "Sensitive skin reactions"

---

## User Flow (MVP)

### 1. Onboarding
**Question 1:** "What's your biggest acne struggle?"
- Options: Persistent breakouts, scarring, texture, hormonal, cystic, etc.

**Question 2:** "What's your monthly skincare budget?"
- <$50 | $50-150 | $150+ | I'm flexible

**Question 3:** "What's your beauty philosophy?"
- K-Beauty | Western Clinical | Clean/Natural | Minimalist | Medical-Grade

**Question 4:** "Have you tried these before?"
- Checklist: Benzoyl peroxide, salicylic acid, retinoids, antibiotics, etc.
- Mark what worked / didn't work

### 2. Photo Analysis
**Upload/take photo of face**
- AI analyzes:
  - Acne type (inflammatory, comedonal, cystic)
  - Severity (mild, moderate, severe)
  - Distribution (forehead, cheeks, chin, jaw)
  - Scarring/texture issues

### 3. Personalized Plan
**Based on:**
- Pain point
- Budget
- Beauty philosophy
- Photo analysis
- What's already been tried

**Delivers:**
- 3-5 product recommendations (with purchase links)
- Routine order + timing
- Expected timeline for results
- What to avoid
- When to see a derm (if severe)

### 4. Progress Tracking
- Weekly photo check-ins
- AI compares progress
- Adjust recommendations if not improving
- Celebrate wins (clearing, fading scars)

### 5. Community (Optional)
- Anonymous before/after sharing
- Product reviews from people with similar skin
- Routine swaps

---

## Key Features

### AI Analysis
- **Acne detection:** Type, severity, location
- **Skin tone analysis:** For hyperpigmentation risk
- **Progress tracking:** Compare photos over time
- **Trigger detection:** "Your breakouts correlate with [timing/stress/diet]"

### Smart Recommendations
- **Budget filters:** Only show what user can afford
- **Philosophy filters:** K-Beauty users don't see harsh actives
- **Conflict detection:** "Don't use retinol + benzoyl peroxide together"
- **Ingredient education:** "This has niacinamide - good for fading scars"

### Routine Builder
- Morning vs night routines
- Step-by-step order
- Wait times between products
- Reminders

### Product Database
- Linked to Amazon, Sephora, Ulta, iHerb, YesStyle (K-Beauty)
- Affiliate revenue model
- Price tracking
- Alternative suggestions (cheaper dupes)

---

## Monetization

### Free Tier
- 1 photo analysis/month
- Basic routine recommendations
- Limited product database

### Premium ($9.99/month or $79/year)
- Unlimited photo analysis
- Progress tracking + comparisons
- Full product database
- Personalized routine adjustments
- Priority support
- Early access to new features

### Affiliate Revenue
- Amazon, Sephora, Ulta, etc.
- 5-10% commission on product purchases
- Transparent: "We earn a small commission if you buy through our links"

---

## Design Principles

### 1. Judgment-Free Zone
- No before/after shaming
- Language: "treating" not "fixing"
- Celebrate progress, not perfection

### 2. Transparent AI
- Show confidence levels ("80% confident this is inflammatory acne")
- Explain why recommendations were made
- Let users adjust if AI is wrong

### 3. Education-First
- Teach ingredients, not just products
- Explain why routines are ordered that way
- Build skincare literacy

### 4. Budget-Conscious
- Always show price/value
- Highlight when something is worth splurging on
- Suggest dupes

---

## Competitive Analysis (Brief)

**Existing apps:**
- **Curology:** Medical-grade, expensive ($20-60/month), prescription-based
- **Face Reality:** Acne-specific but not AI-driven
- **Skin Analytics apps:** Generic, not acne-focused
- **Reddit SCA:** Free but overwhelming, not personalized

**Our advantage:**
- Budget-first approach
- Philosophy matching (K-Beauty, minimalist, etc.)
- Pain point-driven (not just "scan your face")
- Transparent AI
- Progress tracking + routine adjustment

---

## MVP Scope (6-Week Build)

### Must-Have
1. Onboarding flow (pain point, budget, philosophy)
2. Photo upload + basic AI analysis
3. Personalized product recommendations (manual curation for MVP)
4. Routine builder
5. Subscription paywall
6. Product affiliate links

### Nice-to-Have (Post-MVP)
- Progress tracking photos
- Community features
- Advanced AI (scarring analysis, texture)
- Derm consultations integration
- AR try-on for products

---

## Tech Stack (Recommendation)

- **Frontend:** React Native (Expo) - cross-platform
- **Backend:** Supabase (auth, database, storage for photos)
- **AI:** OpenAI Vision API or Clarifai for image analysis
- **Payments:** RevenueCat (subscription management)
- **Affiliate:** Amazon Product Advertising API, Sephora API (if available), custom links

---

## Next Steps

1. ✅ Product brief (this doc)
2. 🚧 Wireframes (core screens)
3. 🚧 High-fidelity mockups (Figma)
4. 🚧 Interactive prototype
5. User testing with 10-20 people
6. Dev handoff

---

**Goal:** Premier acne app that actually helps people - not just another face scanner.
