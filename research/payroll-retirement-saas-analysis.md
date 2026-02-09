# Payroll & Retirement Account Automation SaaS
## Market Research & Feasibility Analysis

**Prepared:** February 7, 2026  
**Subject:** B2B SaaS for retirement contribution compliance automation

---

# Executive Summary

## The Verdict: Proceed with Extreme Caution

**Recommendation:** This opportunity is **not well-suited for a small team** in its full scope. However, a narrowly focused MVP targeting a specific niche could be viable.

### Key Findings

| Factor | Assessment |
|--------|------------|
| **Market Size** | Large ($1.3T in 403b assets alone) but fragmented |
| **Problem Validity** | Real, but partially solved by incumbents |
| **Competitive Moat** | Weak - easy for incumbents to add features |
| **Technical Complexity** | High - regulatory rules change annually |
| **Sales Cycle** | Long (6-12 months for enterprise) |
| **Capital Required** | $500K-$1.5M minimum for credible MVP |
| **Time to Revenue** | 18-36 months to meaningful ARR |
| **Team Size Needed** | 5-8 minimum (including compliance expertise) |

### The Brutal Truth

The core problem exists but is already **partially addressed** by major payroll providers:
- ADP, Paychex, Paylocity, and Paycom automatically cap 401k/403b contributions at IRS limits
- Recordkeepers (TIAA, Fidelity, Vanguard) handle most compliance reporting
- The "waterfall logic" use case (403b → 457b → 457f) is extremely niche

**Bottom Line:** This is a $500K+ bet with a 18-36 month runway before meaningful revenue, competing against well-resourced incumbents who can easily add these features.

---

# 1. Market Analysis

## 1.1 Total Addressable Market (TAM)

### Retirement Plan Market Size
- **Total US retirement assets:** $45.8 trillion (Q2 2025)
- **401(k) plan assets:** $7.3 trillion in single-employer plans
- **403(b) plan assets:** $1.3 trillion across 27 major recordkeepers
- **457(b) plan assets:** ~$400 billion (estimated)

### Number of Potential Customers

| Segment | Count | Notes |
|---------|-------|-------|
| US employers with retirement plans | ~730,000 | BLS/DOL data |
| Nonprofit hospitals/health systems | ~900 | Definitive Healthcare |
| Higher education institutions | ~3,900 | NCES degree-granting |
| State/local governments | ~87,000 | Census Bureau |
| 501(c)(3) nonprofits | ~1.5 million | IRS registered, ~15% have plans |

### TAM Calculation

**Target Market:** Organizations offering both 403(b) AND 457(b) plans (the waterfall use case)

Estimated target accounts:
- Large nonprofit hospitals: ~500
- Higher education with both plans: ~800
- Other qualifying nonprofits: ~2,000

**Realistic TAM: ~3,300 organizations**

At $500 PEPM average pricing × 500 employees average = $3M ARR potential per 1,000 customers

**TAM for narrow waterfall use case: ~$10M-15M annually**

This is a small market.

## 1.2 Serviceable Addressable Market (SAM)

Organizations with:
- 100+ employees
- Both 403(b) and 457(b) plans
- Complex compensation (physicians, executives)
- Current pain with manual tracking

**SAM: ~1,000-1,500 organizations = $5-8M annually**

## 1.3 Serviceable Obtainable Market (SOM)

Realistic first 3 years:
- Year 1: 5-10 customers = $150-300K ARR
- Year 2: 25-50 customers = $750K-1.5M ARR
- Year 3: 75-150 customers = $2.25-4.5M ARR

## 1.4 Customer Segmentation

### Primary Targets

1. **Nonprofit Hospital Systems**
   - Offer 403(b) + 457(b) to physicians/executives
   - High-compensation employees with complex needs
   - Understaffed HR/benefits teams
   - Example: Ascension (106,000 employees), Kaiser, Sutter

2. **Higher Education**
   - TIAA-dominant (legacy complexity)
   - Multiple vendor relationships
   - 15-year service catch-up rules
   - Example: State universities, large private colleges

3. **Large Nonprofits**
   - Museums, foundations, research organizations
   - Executive compensation concerns
   - Limited benefits staff

### Secondary Targets

4. **State/Local Governments**
   - Governmental 457(b) plans
   - Less complex (no 457f)
   - More competitive market

## 1.5 Current Solutions & Pain Points

### What Exists Today

| Solution | Capabilities | Limitations |
|----------|--------------|-------------|
| **ADP/Paychex** | Auto-stop at 401k/403b limits | No waterfall logic, no 457f |
| **TIAA/Fidelity** | Recordkeeping, compliance reports | No payroll integration, reactive |
| **Vestwell/Human Interest** | Modern 401k admin | Focus on SMB, no 403b/457 |
| **Payroll Integrations** | Unified API for payroll-retirement | Middleware only, no calculations |
| **Spreadsheets** | Manual tracking | Error-prone, no real-time |

### Key Pain Points

1. **Mid-year compensation changes** - Raises break contribution calculations
2. **Age-based catch-ups** - New 60-63 "super catch-up" adds complexity
3. **Secure 2.0 Roth requirements** - Must track $150K wage threshold
4. **Waterfall contributions** - No automated 403b → 457b → 457f routing
5. **Multi-employer tracking** - Employees with multiple jobs
6. **15-year catch-up** - Complex eligibility requirements

### Market Readiness

**Urgency Drivers:**
- Secure 2.0 Roth catch-up requirement effective January 1, 2026 ✓
- New 60-63 "super catch-up" creates confusion ✓
- IRS enforcement increasing ✓

**Counter-factors:**
- Incumbents are adding compliance features
- Pain is not acute enough for most organizations
- Budgets for new software are tight

---

# 2. Competitive Landscape

## 2.1 Incumbent Payroll Providers

### ADP
- **Market position:** #1 HCM provider globally (10.8% market share)
- **Retirement offerings:** ADP Retirement Services, integrated payroll
- **API:** Developer portal exists, partner program required
- **Threat level:** HIGH - could add waterfall features easily
- **Weakness:** Complex, expensive, legacy technology

### Paychex
- **Market position:** #2 in SMB payroll
- **Retirement offerings:** Paychex Retirement Services (403b, 401k)
- **API:** Developer program available
- **Threat level:** HIGH - focused on retirement integration
- **Weakness:** Less enterprise-focused

### Paylocity/Paycom
- **Market position:** Fast-growing mid-market
- **Retirement offerings:** Integrated contribution tracking
- **Threat level:** MEDIUM - could partner or build
- **Weakness:** Less nonprofit/healthcare expertise

### Gusto/Rippling
- **Market position:** Modern SMB platforms
- **Retirement offerings:** 401k integration via partners
- **Threat level:** LOW - different market segment
- **Weakness:** No 403b/457 focus

## 2.2 Retirement Recordkeepers

### TIAA
- **Dominance:** Higher education market leader
- **Assets:** $1+ trillion under management
- **Threat level:** HIGH - trusted incumbent
- **Weakness:** Legacy tech, slow innovation

### Fidelity/Vanguard
- **Position:** Growing in 403b market
- **Threat level:** MEDIUM - focused on investment side
- **Weakness:** Not compliance-first

### Empower/Ascensus
- **Position:** Third-party administrators
- **Threat level:** MEDIUM - could add features
- **Weakness:** Fragmented offerings

## 2.3 Standalone Compliance Tools

### Payroll Integrations
- **Focus:** Unified API for payroll-to-retirement data
- **Pricing:** Not public
- **Threat level:** HIGH - directly adjacent
- **Weakness:** Middleware only, no calculation engine

### ASC (Actuarial Systems Corporation)
- **Focus:** TPA software, compliance testing
- **Users:** Third-party administrators
- **Threat level:** LOW - different user base
- **Weakness:** Not real-time, not employer-facing

### Plan Sponsor software (various)
- **Examples:** Pontera, 401k Optimizer
- **Focus:** Advisor tools, not employer tools
- **Threat level:** LOW

## 2.4 Competitive Gaps

**Potential Differentiation:**

1. **Real-time waterfall routing** - No one does automated 403b → 457b → 457f
2. **Secure 2.0 Roth automation** - Emerging need, incumbents scrambling
3. **Age-based catch-up logic** - Complex rules not fully automated
4. **Unified view across plans** - Most track plans in silos

**BUT:** These gaps are features, not products. Incumbents can copy.

---

# 3. Regulatory Deep Dive

## 3.1 IRS Contribution Limits

### 2024-2026 Limits

| Limit Type | 2024 | 2025 | 2026 |
|------------|------|------|------|
| 401k/403b/457b elective deferral | $23,000 | $23,500 | $24,500 |
| Catch-up (age 50+) | $7,500 | $7,500 | $8,000 |
| Super catch-up (ages 60-63) | N/A | $11,250 | $11,250 |
| Annual additions (415c) | $69,000 | $70,000 | $72,000 |
| Compensation limit (401a17) | $345,000 | $350,000 | $360,000 |

### Projected 2027 (based on inflation)
- Elective deferral: ~$25,000-$25,500
- Catch-up (50+): ~$8,000-$8,500
- Annual additions: ~$73,000-$74,000

## 3.2 Account Types and Rules

### 403(b) Tax-Sheltered Annuities
- **Eligible employers:** Public schools, 501(c)(3) organizations
- **Investments:** Annuities and mutual funds only (CITs pending)
- **Special rules:** 15-year catch-up for long-tenure employees
- **Universal availability:** Must offer to all eligible employees

### 457(b) Eligible Deferred Compensation
- **Government 457(b):** State/local governments
  - Separate limit from 403b (can max both)
  - 3-year catch-up before retirement
  - Funds held in trust (protected)
  
- **Non-governmental 457(b):** Tax-exempt organizations
  - For "top-hat" highly compensated employees only
  - Separate limit from 403b (can max both)
  - UNFUNDED - subject to creditors
  - Must distribute within 60 days of separation

### 457(f) Ineligible Plans
- **Purpose:** Exceed 457(b) limits for executives
- **No contribution limits** (unlimited)
- **Taxation:** On vesting, not distribution
- **Substantial risk of forfeiture required**
- **Subject to Section 409A rules**

## 3.3 Secure 2.0 Act Key Provisions

### Mandatory Roth Catch-Up (Effective Jan 1, 2026)
- Applies to participants earning >$150,000 (indexed) in prior year
- ALL catch-up contributions must be Roth
- Applies to 401k, 403b, governmental 457(b)
- **Implementation complexity:** High

### Super Catch-Up for Ages 60-63
- $11,250 instead of $8,000 (2026)
- Optional for plans to adopt
- Increases tracking complexity

### Other Provisions
- Long-term part-time worker eligibility
- Emergency savings accounts
- Student loan matching
- Auto-enrollment mandate for new plans

## 3.4 Penalty Structure

### Excess Contributions
- **6% excise tax** annually until corrected
- **Double taxation** if not corrected by April 15
- **10% early withdrawal penalty** if under 59½
- **Plan disqualification risk** for systemic failures

### Correction Programs
- **Self-correction (SCP):** Minor failures, no IRS filing
- **Voluntary Correction (VCP):** File with IRS, pay fee
- **Audit Closing Agreement:** During IRS examination

### Employer Liability
- Fiduciary breach potential
- Class action risk
- DOL investigation

## 3.5 Annual Management Burden

What changes every year:
1. All contribution limits (inflation adjusted)
2. Compensation limits
3. Catch-up amounts
4. Phase-out ranges
5. Testing thresholds
6. New regulatory guidance

**Typical update timeline:** IRS announces limits in October-November for following year

---

# 4. Technical Feasibility

## 4.1 Payroll API Landscape

### Direct APIs

| Provider | API Availability | Access Requirements |
|----------|-----------------|---------------------|
| ADP | Yes (developer.adp.com) | Partner application required |
| Paychex | Yes (developer.paychex.com) | Partner agreement |
| Paylocity | Limited | Direct partnership only |
| Gusto | Yes (public) | Developer registration |
| Rippling | Yes (limited) | Partner program |
| Workday | Yes | Enterprise partnership |

### Unified API Providers

| Provider | Coverage | Best For |
|----------|----------|----------|
| **Finch** | 200+ systems | Read access, employee data |
| **Payroll Integrations** | Retirement-specific | Payroll-to-recordkeeper |
| **Merge** | HR/payroll focus | Multiple categories |

**Recommendation:** Start with Finch for broad coverage, build direct integrations for top 3 providers later.

## 4.2 Integration Complexity

### Data Requirements
- Employee demographics (name, DOB, SSN)
- Compensation (YTD, projected annual)
- Current contributions (all plan types)
- Employment history (for 15-year catch-up)
- Separation dates (for 457b distribution)

### Data Flow Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Payroll   │────▶│  Calculation │────▶│ Recordkeeper│
│   System    │◀────│    Engine    │◀────│   Systems   │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  Employer   │
                    │  Dashboard  │
                    └─────────────┘
```

### Real-Time Challenges
- Payroll data often batch (not real-time)
- Recordkeeper updates delayed 1-3 days
- Mid-pay-period changes complex
- Retroactive corrections needed

## 4.3 Waterfall Logic Implementation

### Algorithm Complexity

```
For each payroll:
  1. Calculate YTD contributions (all plans, all employers)
  2. Determine age-based catch-up eligibility
  3. Check prior-year wages for Roth requirement
  4. Calculate remaining 403b room
  5. If 403b maxed → route to 457b
  6. If 457b maxed → route to 457f
  7. Apply employer contribution limits
  8. Handle mid-year compensation changes
  9. Reproject for year-end accuracy
```

### Edge Cases
- Employee turns 50/60/64 mid-year
- Compensation decrease mid-year
- Leave of absence
- Prior-employer contributions
- Roth vs. pre-tax splits
- Employer true-up contributions

**Estimate:** 3-6 months of engineering for core logic, ongoing maintenance for rule changes.

## 4.4 Audit Trail Requirements

- Full history of all calculations
- Change logs with timestamps
- User actions recorded
- Integration sync status
- Error logs and alerts
- Annual archive for 7+ years

## 4.5 Security & Compliance Requirements

### Mandatory
- **SOC 2 Type II:** Required for enterprise sales
  - Cost: $20,000-$80,000 first year
  - Timeline: 6-12 months
  
- **Data encryption:** At rest and in transit
- **Access controls:** Role-based, audit logged
- **PII handling:** SSN, DOB, compensation data

### Recommended
- **HIPAA considerations:** For healthcare clients
- **State privacy laws:** California, others
- **Penetration testing:** Annual minimum

---

# 5. Revenue Model

## 5.1 Pricing Strategies

### Option A: Per-Employee Per Month (PEPM)
- Industry standard for HR software
- **Range:** $2-10 PEPM for compliance add-ons
- **Pros:** Scales with customer, predictable
- **Cons:** Pushback from large employers

### Option B: Flat Monthly Fee + PEPM
- Base fee covers fixed costs
- PEPM for variable
- **Example:** $500/month base + $3 PEPM

### Option C: Tiered by Employee Count
- <100 employees: $500/month
- 100-500: $1,500/month
- 500-2,000: $3,500/month
- 2,000+: Custom

### Option D: Per-Plan Fee
- $X per retirement plan administered
- Better for organizations with many plans

**Recommendation:** Option B or C - provides stable base with scaling

## 5.2 Comparable SaaS Pricing

| Product | Pricing Model | Range |
|---------|---------------|-------|
| Gusto | Base + PEPM | $40 + $6 PEPM |
| Rippling | PEPM | $15-50 PEPM |
| Justworks | PEPM | $59-99 PEPM |
| Human Interest | Assets + PEPM | 0.5% AUM + fees |
| Vestwell | Base + PEPM | $1,200/yr + $4-8 PEPM |

## 5.3 Projected ARPU by Segment

| Segment | Avg Employees | Monthly Price | ARPU/Year |
|---------|---------------|---------------|-----------|
| Small nonprofit (100-500) | 300 | $1,500 | $18,000 |
| Mid hospital (500-2,000) | 1,200 | $5,000 | $60,000 |
| Large health system (2,000+) | 5,000 | $15,000 | $180,000 |
| Higher ed (1,000-5,000) | 2,500 | $7,500 | $90,000 |

**Blended ARPU target:** $40,000-$60,000 annually

## 5.4 Revenue Projections

### Conservative Scenario

| Year | Customers | Avg ARPU | ARR |
|------|-----------|----------|-----|
| 1 | 8 | $30,000 | $240,000 |
| 2 | 35 | $40,000 | $1,400,000 |
| 3 | 100 | $50,000 | $5,000,000 |

### Aggressive Scenario

| Year | Customers | Avg ARPU | ARR |
|------|-----------|----------|-----|
| 1 | 15 | $35,000 | $525,000 |
| 2 | 60 | $45,000 | $2,700,000 |
| 3 | 180 | $55,000 | $9,900,000 |

## 5.5 Unit Economics

### Customer Acquisition Cost (CAC)
- B2B HR/benefits SaaS: $410-$6,754 depending on segment
- **Assumed CAC:** $8,000-$15,000 for enterprise nonprofit
- **CAC Payback:** 3-6 months at target ARPU

### Lifetime Value (LTV)
- **Churn assumption:** 5-10% annually (sticky category)
- **Customer lifetime:** 10-20 years
- **LTV:** $400,000-$1,200,000
- **LTV:CAC ratio:** 30-80x (excellent if achieved)

### Gross Margin
- SaaS benchmark: 70-80%
- **Estimated:** 75% (API costs, compliance staff)

---

# 6. Go-To-Market Strategy

## 6.1 Customer Acquisition Channels

### Primary Channels

1. **Consultant/TPA Partnerships**
   - Benefits consultants advise on retirement plans
   - Third-party administrators (TPAs) manage compliance
   - Referral fees or revenue share model
   - **Effort:** HIGH (relationship building)
   - **Potential:** HIGH

2. **Industry Conferences**
   - SHRM (HR professionals)
   - PLANSPONSOR conferences
   - HFMA (Healthcare Finance)
   - NACUBO (Higher Ed Finance)
   - **Cost:** $10,000-$50,000 per event
   - **Potential:** MEDIUM (long sales cycle)

3. **Content Marketing/SEO**
   - "Secure 2.0 compliance guide"
   - "403b vs 457b calculator"
   - "Catch-up contribution rules 2026"
   - **Cost:** $3,000-$10,000/month
   - **Potential:** MEDIUM-HIGH

4. **Webinars/Education**
   - Partner with industry associations
   - CPE/SHRM credits
   - **Cost:** $2,000-$5,000 per webinar
   - **Potential:** MEDIUM

### Secondary Channels

5. **Payroll Provider Partnerships**
   - Integration marketplace listing
   - Co-marketing agreements
   - **Challenge:** They could build it themselves

6. **Outbound Sales**
   - Target list of ideal customers
   - SDR/AE team
   - **CAC:** High ($10,000-$20,000)

## 6.2 Sales Cycle

### Expected Timeline
- **Initial contact to demo:** 2-4 weeks
- **Demo to pilot:** 4-8 weeks
- **Pilot to contract:** 4-12 weeks
- **Contract to implementation:** 4-8 weeks

**Total:** 4-8 months typical

### Decision Makers
- VP/Director of Human Resources
- Benefits Manager
- CFO/Controller (for larger deals)
- Legal/Compliance (for 457f involvement)

### Procurement Challenges
- RFP processes at large organizations
- Security questionnaires
- Legal review of contracts
- IT integration approval
- Budget cycles (often annual)

## 6.3 Implementation Process

1. **Discovery** (Week 1-2)
   - Current plan structures
   - Payroll system assessment
   - Data mapping

2. **Integration Setup** (Week 2-4)
   - API connections
   - Data validation
   - Historical import

3. **Configuration** (Week 3-5)
   - Plan rules entry
   - Contribution formulas
   - Notification settings

4. **Testing** (Week 4-6)
   - Parallel run with existing process
   - Edge case validation
   - User acceptance testing

5. **Go-Live** (Week 6-8)
   - Training
   - Cutover
   - Support handoff

## 6.4 Partnership Opportunities

### Tier 1: Strategic
- **TIAA:** Dominant in higher ed, could white-label
- **Fidelity/Vanguard:** Growing 403b presence
- **ADP:** Integration partner potential

### Tier 2: Distribution
- **Benefits brokers:** Mercer, Aon, WTW
- **TPAs:** Ascensus, Principal, Transamerica
- **Consultants:** Cammack, CAPTRUST

### Tier 3: Technology
- **Finch:** Unified payroll API
- **Payroll Integrations:** Retirement data specialist

## 6.5 Marketing Positioning

### Messaging Options

**Option A: Compliance Fear**
> "Avoid $100K+ penalties from contribution limit errors"
- Plays on fear of IRS
- Risk: Can feel negative

**Option B: Efficiency Savings**
> "Save 100+ hours per year on retirement compliance"
- Positive ROI message
- Quantifiable

**Option C: Employee Benefit**
> "Help your employees maximize retirement savings"
- Mission-aligned for nonprofits
- Differentiated

**Recommendation:** Lead with Option B, support with A

---

# 7. Build Requirements

## 7.1 MVP Scope (6-Month Roadmap)

### Month 1-2: Foundation
- Core contribution calculation engine
- Basic employer dashboard
- User authentication/authorization
- Database schema

### Month 3-4: Integration
- Finch API integration (payroll data)
- Manual data upload fallback
- Employee data sync
- Basic notifications

### Month 5-6: Polish
- Reporting (YTD, projections)
- Alert system
- Audit trail
- User documentation
- Security hardening

### Out of MVP Scope
- 457f logic (complex, niche)
- Multiple payroll system support
- Custom integrations
- Mobile app
- Advanced analytics

## 7.2 Team Composition

### Minimum Viable Team (5-6 people)

| Role | Count | Notes |
|------|-------|-------|
| Founder/CEO | 1 | Sales, strategy, fundraising |
| Full-stack Engineer | 2 | Core product development |
| Product Manager | 0.5 | Could be founder initially |
| Compliance Expert | 1 | ERISA/IRS expertise (can be consultant) |
| Sales/Customer Success | 1 | Once product ready |

**Total:** 5-6 FTEs + contractors

### Ideal Team (8-10 people)

- +1 Backend/API engineer
- +1 Dedicated security engineer
- +1 Marketing/content
- +1 Additional sales rep

## 7.3 Technology Stack Recommendations

### Backend
- **Language:** Python or Node.js (rapid development)
- **Framework:** FastAPI or Express
- **Database:** PostgreSQL (ACID compliance critical)
- **Queue:** Redis/Celery for async processing

### Frontend
- **Framework:** React or Vue
- **Styling:** Tailwind CSS
- **Charting:** Recharts or Chart.js

### Infrastructure
- **Cloud:** AWS or GCP
- **Monitoring:** Datadog or New Relic
- **Error tracking:** Sentry
- **CI/CD:** GitHub Actions

### Third-Party Services
- **Payroll data:** Finch
- **Authentication:** Auth0 or Clerk
- **Notifications:** SendGrid, Twilio

## 7.4 Integration Priorities

### Phase 1 (MVP)
1. **Finch** - Covers 200+ payroll systems
2. **Manual upload** - CSV fallback

### Phase 2 (Post-MVP)
1. **ADP direct** - Largest market share
2. **Paychex direct** - #2 player

### Phase 3 (Scale)
1. **Workday** - Enterprise segment
2. **Recordkeeper APIs** - TIAA, Fidelity

## 7.5 Legal/Insurance Requirements

### Essential
- **General liability:** $1M+ coverage
- **E&O/Professional liability:** $1-2M (Tech E&O)
  - Cost: ~$67-200/month
- **Cyber liability:** $1M+
- **Directors & Officers:** If taking investment

### Legal Setup
- **Terms of Service:** Limit liability for calculation errors
- **Privacy Policy:** GDPR/CCPA compliant
- **Business Associate Agreement:** For HIPAA clients
- **Customer contracts:** Legal review required

### Compliance
- **SOC 2 Type I** within 12 months
- **SOC 2 Type II** within 24 months
- **Penetration testing** annually

---

# 8. Risk Assessment

## 8.1 Regulatory/Liability Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Calculation error causes over-contribution | MEDIUM | HIGH | Extensive testing, insurance, liability caps |
| IRS rule changes break logic | HIGH | MEDIUM | Annual review process, rapid update capability |
| New Secure 2.0 guidance changes requirements | HIGH | MEDIUM | Monitor IRS guidance, flexible architecture |
| Customer blames software for their error | MEDIUM | MEDIUM | Clear ToS, audit trails, training |

**Liability Concern:** If your software miscalculates and an employee over-contributes, who is liable?
- **Mitigation:** Clear ToS disclaiming guarantee, E&O insurance, limit liability to subscription fees

## 8.2 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Finch API reliability issues | MEDIUM | HIGH | Direct integrations as backup |
| Payroll provider API changes | MEDIUM | MEDIUM | Version monitoring, quick response |
| Data sync delays cause issues | MEDIUM | MEDIUM | Clear SLAs, manual override options |
| Security breach | LOW | CRITICAL | SOC 2, encryption, monitoring |

## 8.3 Market Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| ADP/Paychex builds competitive feature | HIGH | CRITICAL | Move fast, target niches they ignore |
| Sales cycles longer than expected | HIGH | HIGH | Plan for 12+ month cycles, bridge financing |
| Market smaller than estimated | MEDIUM | HIGH | Validate with pilots before scaling |
| Economic downturn reduces budgets | MEDIUM | MEDIUM | Prove ROI, focus on cost savings |

## 8.4 Resource Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Funding runs out before revenue | MEDIUM | CRITICAL | Conservative burn, milestone-based raises |
| Can't hire compliance expert | MEDIUM | HIGH | Use consultants, partner with TPA |
| Key engineer leaves | MEDIUM | HIGH | Documentation, equity vesting |
| Founder burnout | MEDIUM | HIGH | Realistic timeline, support system |

## 8.5 Risk Mitigation Summary

**Critical risks to address:**
1. **Incumbent response** - This is the #1 killer. Differentiate hard.
2. **Liability** - Get insurance, limit contractually, test extensively.
3. **Sales cycle** - Plan for 18-24 months to meaningful revenue.
4. **Capital** - Need $500K-$1.5M runway minimum.

---

# 9. Build vs. Buy vs. Partner

## 9.1 Build from Scratch

**Pros:**
- Full control over roadmap
- Custom for target market
- Equity upside

**Cons:**
- 18-36 month timeline
- $500K-$1.5M+ cost
- High execution risk
- No existing customer base

**Verdict:** Only if you have significant runway and strong team

## 9.2 Acquisition Targets

### Potential Acqui-hires/Assets

| Company | Notes | Challenge |
|---------|-------|-----------|
| Small TPA firms | Have compliance expertise, customer base | Technology usually poor |
| Compliance consultants | Domain expertise | No product |
| Failed fintech startups | Technology, team | Wrong product |

**Reality:** There's no obvious acquisition target in this space. Most compliance tools are built into larger platforms.

## 9.3 Partnership Models

### Option A: Payroll Provider Add-On
- Partner with ADP/Paychex as integration
- **Pros:** Distribution, credibility
- **Cons:** Dependent on partner, margin compression

### Option B: Recordkeeper White-Label
- Build for TIAA/Fidelity to offer clients
- **Pros:** Built-in distribution
- **Cons:** White-label = low margin, no brand

### Option C: TPA Software
- Sell to TPAs who serve employers
- **Pros:** B2B2B leverage
- **Cons:** TPA market fragmented

### Option D: Benefits Consultant Tool
- Arm consultants with better tech
- **Pros:** Trusted advisors drive adoption
- **Cons:** Consultants are slow adopters

**Recommendation:** Pursue Option D as GTM strategy while building Option A capability

## 9.4 White-Label Opportunities

TIAA, Fidelity, and Vanguard all partner with technology providers. A white-label deal could provide:
- Guaranteed customer base
- Faster time to revenue
- Credibility

**Tradeoffs:**
- Lower margins (50-70% vs 90%)
- Less control
- Brand not built

---

# 10. Final Recommendation

## 10.1 Should You Pursue This?

### If You Have:
- ✅ $750K+ runway
- ✅ 2+ years patience
- ✅ ERISA/retirement plan expertise on team
- ✅ Relationships in nonprofit healthcare/higher ed
- ✅ Tolerance for long sales cycles

**Then:** Proceed with narrow MVP focus

### If You Don't Have Those:
**Then:** This is not the right opportunity

## 10.2 If Yes: Recommended Approach

### Narrow the Focus
- **Target:** Large nonprofit hospitals ONLY (initially)
- **Problem:** 403b + 457b waterfall automation
- **Ignore:** 457f, government 457, 401k (initially)

### MVP in 6 Months
- Single payroll integration (via Finch)
- Core contribution calculation
- Basic employer dashboard
- Manual data upload fallback

### Validate Before Building
1. Talk to 20 hospital CFOs/HR directors
2. Confirm willingness to pay $3,000-5,000/month
3. Identify 3-5 pilot customers before writing code

### Team
- 1 founder (sales/product)
- 2 engineers
- 1 compliance consultant (part-time)
- Total: ~$400K/year burn

### Timeline
- Months 1-3: Validation, design
- Months 4-9: MVP build
- Months 10-15: Pilot customers
- Months 16-24: Initial revenue

### Budget
- Year 1: $500K
- Year 2: $750K
- Total: $1.25M to meaningful revenue

## 10.3 If No: Alternative Paths

### Alternative A: Compliance Consulting
- Offer manual contribution tracking as a service
- Lower tech investment, faster revenue
- Test market before building product

### Alternative B: Content/Education Business
- Build the "Secure 2.0 compliance guide" website
- Monetize through ads, lead gen
- Validate demand and build audience first

### Alternative C: Different Market Entirely
- Consumer apps have faster iteration cycles
- B2C retirement apps (rollover, education)
- Lower CAC, faster validation

## 10.4 Comparison to Consumer App Opportunity

| Factor | Retirement Compliance SaaS | Consumer App |
|--------|---------------------------|--------------|
| Time to first revenue | 12-18 months | 3-6 months |
| Capital required | $500K-$1.5M | $50K-$200K |
| Sales cycle | 4-12 months | Minutes |
| Technical complexity | High | Varies |
| Regulatory risk | High | Low-Medium |
| Market size | Small ($15M TAM) | Potentially large |
| Competition | Incumbents strong | Varies |
| Iteration speed | Slow (annual rules) | Fast |

**Bottom Line:** Consumer apps offer faster validation and lower risk, but smaller potential upside per customer. Retirement SaaS has higher potential ARPU but much higher barriers.

## 10.5 Key Questions to Answer

Before proceeding, answer these:

1. **Do you have a compliance expert** who can stay current on IRS rules?
2. **Have you talked to 10+ potential customers** and confirmed willingness to pay?
3. **Do you have 24 months of runway** or ability to raise it?
4. **Can you tolerate 6-12 month sales cycles** with 50%+ loss rate?
5. **Do you have relationships** in nonprofit healthcare or higher ed?

If you can't answer "yes" to at least 3 of these, this is probably not the right opportunity for you.

---

# Appendix

## A. Key Sources

- IRS.gov - Contribution limits, plan rules
- PLANSPONSOR 2024 403(b) Market Survey
- Investment Company Institute - Retirement statistics
- Secure 2.0 Act of 2022 legislation
- Industry interviews and analysis

## B. Glossary

- **403(b):** Tax-sheltered annuity for nonprofits/schools
- **457(b):** Deferred compensation for government/nonprofits
- **457(f):** Ineligible deferred comp (no limits)
- **ERISA:** Employee Retirement Income Security Act
- **PEPM:** Per Employee Per Month pricing
- **TPA:** Third Party Administrator
- **ARPU:** Average Revenue Per User
- **CAC:** Customer Acquisition Cost
- **LTV:** Lifetime Value

## C. IRS Resources

- Form 5500: Annual retirement plan filing
- Publication 571: 403(b) guide
- Notice 2024-2: Secure 2.0 guidance
- Revenue Procedure 2021-30: EPCRS correction

---

*This analysis represents a point-in-time assessment. Market conditions, regulations, and competitive landscape may change.*
