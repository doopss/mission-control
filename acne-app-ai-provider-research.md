# Acne App - AI Provider Research & Technical Recommendations

**Research Date:** 2026-02-08 3:10 AM EST  
**Purpose:** Determine best AI approach for acne image analysis

---

## Executive Summary

**Recommendation:** Start with **Google Gemini Flash** for cost + quality balance.

**Cost per analysis:** ~$0.001-0.003 (1/10th the cost of GPT-4V)

**Fallback:** OpenAI GPT-4o-mini for simpler cases

**Long-term:** Build custom model once we have 10K+ labeled images

---

## AI Provider Options Compared

### Option 1: OpenAI GPT-4 Vision (GPT-4V / GPT-4o)

**Capabilities:**
- ✅ Image classification
- ✅ Visual question answering
- ✅ Object detection
- ✅ Can describe skin conditions in natural language

**Pricing:**
- **GPT-4o:** $2.50 input + $10 output per 1M tokens
- **GPT-4o-mini:** $0.15 input + $0.60 output per 1M tokens
- **Image cost:** ~$0.01-0.05 per analysis (depends on image size + output length)

**Pros:**
- Excellent at natural language explanations
- Easy to prompt engineer
- Widely used, well-documented
- Can handle follow-up questions

**Cons:**
- Higher cost than alternatives
- Not specifically trained on dermatology
- Slower than specialized models

**Best for:** Generating detailed, human-readable explanations

---

### Option 2: Google Gemini (Flash / Pro)

**Capabilities:**
- ✅ Multimodal (image + text)
- ✅ Long context windows
- ✅ Fast inference
- ✅ Good at structured output

**Pricing:**
- **Gemini 2.0 Flash:** $0.10 input + $0.30 output per 1M tokens (cheapest)
- **Gemini 2.0 Pro:** $1.25 input + $5.00 output per 1M tokens
- **Image cost:** ~$0.001-0.003 per analysis with Flash

**Pros:**
- **10x cheaper than GPT-4V** (Flash model)
- Fast (hence "Flash")
- Good quality for medical/skin analysis
- Supports structured JSON output

**Cons:**
- Less "personality" in responses
- Slightly less reliable than GPT-4 for edge cases

**Best for:** High-volume analysis with budget constraints (our use case)

---

### Option 3: Anthropic Claude 3.5 Sonnet (Vision)

**Capabilities:**
- ✅ Strong vision understanding
- ✅ Careful, nuanced analysis
- ✅ Good at following instructions

**Pricing:**
- **Claude 3.5 Sonnet:** $3.00 input + $15.00 output per 1M tokens
- **Image cost:** ~$0.02-0.08 per analysis

**Pros:**
- Excellent reasoning
- Strong safety/medical disclaimers
- High quality outputs

**Cons:**
- **Most expensive** of the three
- Overkill for simple detection tasks

**Best for:** Complex cases requiring nuanced judgment (not MVP)

---

### Option 4: Specialized Medical AI (Revieve, GlamAR)

**Capabilities:**
- ✅ Pre-trained on skin conditions
- ✅ Dermatologist-verified
- ✅ 200+ metrics (Revieve)
- ✅ Clinical-grade accuracy

**Pricing:**
- **$500-2000/month** (flat fee)
- OR: $0.10-0.50 per analysis (volume-based)

**Pros:**
- Medical-grade accuracy
- No training needed
- Instant credibility

**Cons:**
- **Expensive** for early-stage startup
- Less customization
- Vendor lock-in

**Best for:** Post-product-market-fit when we need clinical validation

---

## Cost Comparison (Per 1,000 Analyses)

| Provider | Cost per Analysis | Cost per 1K | Cost per 10K |
|----------|-------------------|-------------|--------------|
| **Gemini Flash** | $0.001-0.003 | $1-3 | $10-30 |
| **GPT-4o-mini** | $0.005-0.01 | $5-10 | $50-100 |
| **GPT-4o** | $0.01-0.05 | $10-50 | $100-500 |
| **Claude Sonnet** | $0.02-0.08 | $20-80 | $200-800 |
| **GlamAR SDK** | $0.10+ | $100+ | $1,000+ |

**At 10K analyses/month (realistic by Month 3):**
- Gemini Flash: **$10-30/month** ✅
- GPT-4o-mini: $50-100/month
- GPT-4o: $100-500/month
- Claude: $200-800/month
- GlamAR: $1,000+/month

**Winner:** Gemini Flash (10x cost advantage)

---

## Technical Implementation Strategy

### Phase 1: MVP (Month 1-2) - Use Gemini Flash

**Approach:**
```
1. User uploads photo
2. Send to Gemini 2.0 Flash with structured prompt:
   "Analyze this facial photo for acne. Return JSON with:
    - acne_type: [inflammatory, comedonal, cystic, hormonal]
    - severity: [mild, moderate, severe]
    - location: [forehead, cheeks, chin, jaw]
    - lesion_count: approximate count
    - scarring: [yes/no]
    - confidence: [0-100]"
3. Parse JSON response
4. Generate recommendations based on:
   - Analysis results
   - User's budget
   - User's beauty philosophy
   - What they've tried before
```

**Cost:** $10-30/month for 10K analyses

**Pros:**
- Fast to implement
- Cheap to scale
- Good enough quality

**Cons:**
- Not "medical-grade"
- May miss edge cases

---

### Phase 2: Validation (Month 3-4) - Add Manual Spot-Checks

**Approach:**
1. Sample 5-10% of analyses
2. Have dermatologist consultant review
3. Compare AI vs expert
4. Track accuracy over time

**Goal:** 80%+ agreement with dermatologist

**Cost:** $500-1000/month (derm consultant)

---

### Phase 3: Scale (Month 6+) - Custom Model

**Approach:**
1. Collect 10K+ labeled images (from users + public datasets)
2. Fine-tune open-source vision model (e.g., CLIP, BiomedCLIP)
3. Host on cheap GPU ($50-100/month)
4. Cost per analysis: ~$0.0001 (100x cheaper)

**Benefits:**
- Full control
- Ultra-low cost at scale
- Customizable for our specific needs (budget/philosophy matching)

**When:** Only after product-market-fit proven

---

## Prompt Engineering Strategy

### Example Prompt (Gemini Flash):

```
You are a dermatology AI assistant analyzing facial acne.

Analyze this photo and return ONLY valid JSON (no markdown, no explanation):

{
  "acne_present": true/false,
  "primary_type": "inflammatory" | "comedonal" | "cystic" | "hormonal" | "mixed",
  "severity": "mild" | "moderate" | "severe",
  "zones": {
    "forehead": 0-10,
    "cheeks": 0-10,
    "chin": 0-10,
    "jaw": 0-10
  },
  "features": {
    "pustules": 0-10,
    "papules": 0-10,
    "comedones": 0-10,
    "cysts": 0-10
  },
  "scarring": true/false,
  "hyperpigmentation": true/false,
  "confidence": 0-100,
  "notes": "brief clinical observation"
}

Be conservative with severity. If unsure, recommend professional consultation.
```

**Result:** Structured data we can easily parse and use.

---

## Quality Assurance Strategy

### Confidence Thresholds:
- **>90% confidence:** Show results directly
- **70-90% confidence:** Show results + "AI confidence: 85%"
- **<70% confidence:** "Results unclear. Consider retaking photo or consulting dermatologist"

### Edge Cases to Handle:
- No face in photo → reject with helpful message
- Makeup/filters → detect and warn
- Poor lighting → suggest better lighting
- Multiple faces → ask to crop to one face

### Medical Disclaimers:
- Always include: "This is not medical advice. Consult a dermatologist for diagnosis."
- For severe cases (>50 lesions, cystic acne): "Recommend seeing a dermatologist - this may require prescription treatment"

---

## Recommended MVP Tech Stack

**Frontend:**
- React Native (Expo) - cross-platform
- expo-image-picker - photo upload
- expo-camera - in-app photo capture

**Backend:**
- Supabase - auth + database + file storage
- Edge Functions (Deno) - API endpoints
- Supabase Storage - encrypted photo storage

**AI:**
- Google Gemini 2.0 Flash API
- Fallback: OpenAI GPT-4o-mini

**Database Schema:**
```sql
-- users table
id, email, created_at, subscription_tier, budget_range, beauty_philosophy

-- analyses table
id, user_id, photo_url, results_json, confidence, created_at

-- recommendations table
id, analysis_id, product_name, product_url, price, reasoning

-- user_history table
id, user_id, ingredient, worked (true/false), notes
```

---

## Security & Privacy

### Photo Storage:
- **Encrypt at rest** (Supabase built-in)
- **Encrypt in transit** (HTTPS)
- **Auto-delete after 90 days** (GDPR compliance)
- User can delete anytime

### AI Processing:
- Gemini doesn't store images (per Google policy)
- No training on user data without explicit consent
- HIPAA consideration: photos are health data (be careful)

### Compliance:
- Privacy policy: explain what we do with photos
- Terms of service: this is not medical advice
- Age gate: 13+ only (or 18+ to be safe)

---

## Testing Plan (Before Launch)

### Week 1: Synthetic Testing
- Test with 100 public acne images
- Verify JSON parsing works
- Check confidence scores are reasonable

### Week 2: Beta Testing
- 20 real users upload photos
- Compare AI results to user's self-assessment
- Track any failures/edge cases

### Week 3: Dermatologist Validation
- Hire derm consultant ($500)
- Review 50 random analyses
- Document accuracy

**Goal:** 80%+ accuracy before public launch

---

## Cost Projections

### Month 1 (100 users, 500 analyses):
- Gemini API: $0.50-1.50
- Supabase: $0 (free tier)
- Total: **~$2/month**

### Month 3 (1,000 users, 10K analyses):
- Gemini API: $10-30
- Supabase: $25/month
- Dermatologist spot-checks: $500/month
- Total: **~$535/month**

### Month 6 (5,000 users, 50K analyses):
- Gemini API: $50-150
- Supabase: $25/month
- Dermatologist: $500/month
- Total: **~$675/month**

**Revenue at Month 6:**
- 5,000 users × 5% conversion × $10/month = **$2,500 MRR**
- Gross margin: ~73% ($675 cost / $2,500 revenue)

**Scalable:** Yes, costs grow linearly with usage but so does revenue.

---

## Recommended Next Steps

### Immediate:
1. ✅ Sign up for Google Gemini API (free tier)
2. ✅ Test with 10 sample acne photos
3. ✅ Validate JSON output quality
4. Draft medical disclaimers (consult lawyer if budget allows)

### Next Week:
5. Build MVP backend (Supabase + Gemini integration)
6. Create product database (100 budget-friendly products)
7. Implement recommendation logic (budget + philosophy filtering)

### Next Month:
8. Beta launch with 20-50 users
9. Collect feedback
10. Iterate

---

## Conclusion

**Recommended AI Stack:**
- **Primary:** Google Gemini 2.0 Flash ($0.001-0.003 per analysis)
- **Fallback:** OpenAI GPT-4o-mini (if Gemini fails)
- **Long-term:** Custom fine-tuned model (once we have data)

**Confidence:** High - Gemini Flash is proven, cheap, and fast.

**Risk:** Low - easy to switch providers if quality isn't good enough.

---

**Research Complete:** 3:25 AM EST  
**Time Spent:** 15 minutes  
**Next:** Weekly work plan draft
