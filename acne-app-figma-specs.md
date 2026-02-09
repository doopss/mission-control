# Acne App - Figma Design Specifications

**For Designer/Developer:** Use these specs to create high-fidelity Figma mockups

---

## Design System

### Color Palette

**Primary Colors:**
```
Sage Green (Healing):    #A8E6CF
Soft Blue (Trust):       #8BB8D8  
Off-White (Background):  #F9F9F9
Charcoal (Text):         #2C2C2C
```

**Secondary Colors:**
```
Coral (Warnings):        #FF6B6B
Pale Yellow (Highlight): #FFE066
Light Gray (Cards):      #FFFFFF
Muted Gray (Secondary):  #7A7A7A
```

**Status Colors:**
```
Success Green:  #4CAF50
Warning Orange: #FF9800
Error Red:      #F44336
Info Blue:      #2196F3
```

---

### Typography

**Headings:**
- Font: Inter Bold / SF Pro Display Bold
- H1: 28px, -0.5px letter-spacing, 1.2 line-height
- H2: 24px, -0.3px letter-spacing, 1.3 line-height
- H3: 20px, -0.2px letter-spacing, 1.4 line-height

**Body:**
- Font: Inter Regular / SF Pro Text
- Large: 17px, 1.5 line-height
- Regular: 15px, 1.6 line-height
- Small: 13px, 1.4 line-height
- Caption: 11px, 1.3 line-height

**Product Names:**
- Font: Inter Semi-Bold
- Size: 16px, -0.1px letter-spacing

---

### Spacing System

```
4px   = xs   (tight spacing, icon padding)
8px   = sm   (element padding)
12px  = md   (card padding)
16px  = lg   (section spacing)
24px  = xl   (screen margins)
32px  = xxl  (major sections)
48px  = huge (hero spacing)
```

**Screen Margins:** 24px horizontal, 16px top (below safe area)

---

### Component Library

#### Button Styles

**Primary (CTA):**
```
Background: Linear gradient (Sage Green #A8E6CF → #7EC8A3)
Text: Charcoal (#2C2C2C)
Height: 54px
Border-radius: 12px
Shadow: 0px 4px 12px rgba(168, 230, 207, 0.3)
Font: Inter Semi-Bold 16px
States: Default → Pressed (scale 0.98, opacity 0.8)
```

**Secondary:**
```
Background: White with 1px border (#E0E0E0)
Text: Charcoal (#2C2C2C)
Height: 54px
Border-radius: 12px
Font: Inter Medium 16px
```

**Tertiary (Text Only):**
```
No background
Text: Soft Blue (#8BB8D8)
Underline on hover
Font: Inter Medium 15px
```

---

#### Card Styles

**Option Card (Multi-select):**
```
Background: White
Border: 1.5px solid #E8E8E8
Border-radius: 16px
Padding: 20px
Shadow: 0px 2px 8px rgba(0,0,0,0.04)

Selected State:
Border: 2px solid Sage Green (#A8E6CF)
Background: rgba(168, 230, 207, 0.05)
Checkmark icon (top-right)
```

**Product Card:**
```
Background: White
Border: 1px solid #F0F0F0
Border-radius: 12px
Padding: 16px
Shadow: 0px 2px 6px rgba(0,0,0,0.06)

Layout:
[Product Image] - 60x60px, rounded 8px
[Brand Name]    - Inter Semi-Bold 14px, Gray
[Product Name]  - Inter Regular 15px, Charcoal
[Price]         - Inter Bold 16px, Sage Green
[Buy Button]    - Tertiary style, right-aligned
```

---

#### Progress Bar

```
Background: #E8E8E8
Fill: Sage Green (#A8E6CF)
Height: 4px
Border-radius: 2px
Animation: Smooth fill 0.3s ease
```

---

## Screen-by-Screen Specifications

### 1. Welcome Screen

**Layout:**
```
[Safe Area]
  
  [Logo/Icon - centered]
    - Size: 80x80px
    - Style: Minimal, healing aesthetic
    - Position: 25% from top

  [Headline - centered]
    "Find what works for YOUR acne"
    - H1 style
    - Max-width: 280px
    - Color: Charcoal

  [Illustration]
    - Diverse skin tones represented
    - Minimalist line art style
    - Position: Center
    - Size: 240x180px

  [Value Props - left-aligned]
    • Budget-friendly options
    • Personalized to you
    • Science-backed results
    - Font: 15px Regular
    - Spacing: 12px between items
    - Bullets: Sage Green dots

  [CTA Button]
    "Get Started"
    - Primary style
    - Full-width minus 48px margin
    - Position: 80% from top

  [Login Link]
    "Already have an account? Login"
    - Tertiary style
    - Below CTA, 16px spacing
```

**Colors:**
- Background: Off-White (#F9F9F9)
- Gradient overlay (subtle): White → transparent from top

---

### 2. Pain Point Selection

**Header:**
```
[Back Button] ← (Soft Blue, 18px icon)
Progress Bar: 1/4 (top, below safe area)
```

**Content:**
```
[Headline]
"What's your biggest acne struggle?"
- H2 style, left-aligned
- Margin-top: 32px

[Subhead]
"Select all that apply:"
- Body Regular, Gray
- Margin-top: 8px

[Option Cards - Stack]
Each card:
  [ ] Persistent breakouts
  [✓] Acne scars won't fade    (selected example)
  [ ] Hormonal breakouts
  [ ] Cystic acne
  [ ] Texture/rough skin
  [ ] Too sensitive for actives
  [ ] Nothing works for me
  [ ] Can't afford dermatologist

Spacing: 12px between cards
Checkmark: 20px icon, Sage Green, top-right of card
```

**Footer:**
```
[Continue Button]
- Primary style
- Full-width minus 48px
- Disabled state: Gray, no shadow (if none selected)
```

---

### 3. Budget Selection

**Radio Button Cards:**
```
○ Under $50/month
  Drugstore + affordable brands
  - Icon: 💰 (emoji or custom icon)

● $50-$150/month   (selected example)
  Sephora-tier, mid-range
  - Icon: 💳

○ $150+/month
  Premium + medical-grade
  - Icon: 👑

○ I'm flexible
  Show me the best options
  - Icon: ✨
```

**Card Style (Radio):**
```
Height: 92px
Border: 1.5px
Selected: Sage Green border, filled radio dot
Unselected: Gray border, empty circle
Radio position: Left side, vertically centered
Text layout: Multiline, left-aligned, 16px from radio
```

---

### 4. Beauty Philosophy

**Large Selection Cards:**
```
[Korean Beauty (K-Beauty)]
Multi-step, gentle, hydration
- Icon: 🌸 or illustration
- Card height: 88px

[Western Clinical]
Active ingredients, targeted
- Icon: 🔬

[Clean/Natural]
Non-toxic, sustainable
- Icon: 🌿

[Minimalist]
Simple 3-step routines
- Icon: ⚪

[Medical-Grade Only]
Prescription-strength, derm
- Icon: 💊
```

**Card Style:**
```
Same as option cards
Full-width
Icon: 32px, left-aligned, 16px from left
Text: Two-line, icon right-side
Tap-to-select (single choice)
```

---

### 5. What You've Tried

**Chip-Based Selection:**
```
Grid layout (2 columns on mobile)

Each chip:
[ Benzoyl Peroxide ]
State: Unselected (gray border)

[ Salicylic Acid ✓ ]
State: Selected - Worked (green border + checkmark)

[ Retinoids ✗ ]
State: Selected - Didn't work (red border + X)
```

**Chip Styles:**
```
Height: 44px
Border-radius: 22px (pill shape)
Padding: 12px 16px
Font: Inter Medium 14px

States:
- Unselected: White bg, gray border
- Worked: White bg, green border, green checkmark icon
- Didn't work: White bg, red border, red X icon

Tap behavior:
First tap: "Worked" (green)
Second tap: "Didn't work" (red)
Third tap: Unselected (gray)
```

**Legend (bottom):**
```
"Tap again to mark:"
✓ Worked  /  ✗ Didn't work
- Caption text, centered
```

---

### 6. Photo Upload

**Camera Frame:**
```
Centered square frame: 280x280px
Border: 2px dashed Sage Green
Border-radius: 16px
Background: White

Inside frame:
  [Camera Icon] - 64px, centered
  "Take Photo / Upload"
  - Body text, below icon

States:
- Empty (above)
- Uploading (spinner)
- Preview (shows photo with retake option)
```

**Tips Section:**
```
"Tips for best results:"
• Natural lighting
• No makeup
• Front-facing

- Caption text
- Bullet list
- Position: Below frame, 24px spacing
```

**Skip Button:**
```
[Skip for now]
- Tertiary style
- Bottom of screen
```

---

### 7. Analyzing (Loading)

**Center Content:**
```
[Animated Spinner/Orb]
- Size: 120px
- Style: Pulsing Sage Green orb
- Animation: Breathe effect (1.5s loop)

[Status Text]
"Analyzing your skin..."
- H3 style, centered, below orb

[Progress Steps]
✓ Detected: Mild inflammatory
→ Analyzing severity...
  Checking for scarring...

- Each line fades in as it completes
- Checkmark: Sage Green
- Arrow: Soft Blue (current step)
- Gray: Pending

[Time Estimate]
"This usually takes 10-15 sec"
- Caption, bottom of content area
```

---

### 8. Analysis Results

**Photo Display:**
```
[Your Photo with Overlays]
- Full-width (minus 24px margins)
- Border-radius: 16px
- Overlay: Transparent dots marking acne spots
  - Red dots: Inflammatory (larger)
  - Yellow dots: Comedones (smaller)
  - Purple dots: PIE marks (faint)
```

**Results Card:**
```
White card below photo:

Severity: Moderate
Primary concern: Jaw/chin area
- Body Bold for labels
- Body Regular for values
- Spacing: 8px between items

AI Confidence: 85%
[Tap to see how we analyzed →]
- Caption, Soft Blue link
```

**Context Summary:**
```
"Based on your:"
• Moderate inflammatory acne
• $50-150 budget
• Western clinical preference  
• Salicylic acid worked for you

- Bullet list
- Font: Body Regular
- Accent color for key terms (Sage Green)
```

**CTA:**
```
[See Your Personalized Plan]
- Primary button
- Full-width
```

---

### 9. Personalized Plan

**Plan Header:**
```
💡 Focus: Inflammatory acne
Expected results: 6-8 weeks

- Light sage background card
- Icon: 20px, left-aligned
- Text: Body Regular
```

**Routine Section:**
```
Morning Routine

[Product Card 1]
  [60x60 image] CeraVe Hydrating Cleanser
  $15  |  Gentle, won't dry out
  [Buy on Amazon →]

[Product Card 2]
  [60x60 image] Paula's Choice 2% BHA
  $32  |  Your fave ingredient! ⭐
  [Buy on Sephora →]

... repeat for each product

Night Routine (collapsed)
[Tap to expand]
```

**Product Card Style:**
```
White background
1px border #F0F0F0
Border-radius: 12px
Padding: 16px
Spacing: 12px between cards

Layout:
┌────────────────────────────┐
│ [Img] Brand Name           │
│       Product Name         │
│       $XX | Description    │
│       [Buy on → ]          │
└────────────────────────────┘
```

**Budget Summary:**
```
Total: $142/month
(Within your budget ✓)

- Positioned above CTA
- Green checkmark if within budget
- Orange warning if over budget
```

**CTAs:**
```
[Start This Routine] - Primary
[Adjust Products]     - Secondary (below, 12px gap)
```

---

### 10. Home Dashboard

**Header:**
```
☰ Menu (left)          + Add Photo (right)
- Icons: 24px

"Hi Alex 👋"
"Day 12 of your routine"
- H2 + Caption
```

**Progress Card:**
```
White card, shadow
┌──────────────────────────────┐
│ Progress                     │
│ ┌────┬────┬────┐   [Graph]  │
│ │ D1 │ D7 │D12 │            │
│ └────┴────┴────┘            │
│ Improving! Keep going.       │
└──────────────────────────────┘

- Thumbnail images: 60x60px, rounded 8px
- Graph: Simple line chart, Sage Green
```

**Routine Status:**
```
Today's Routine
Morning: 2/4 completed ✓

[Continue Routine] - Primary button (compact)
```

**Quick Actions Grid:**
```
2x2 grid of action cards

📸 Upload Progress Photo
🛒 Reorder Products
💬 Ask a Question
📚 Learn About Ingredients

Each card:
- 160x100px (on mobile)
- White background
- Icon: 32px, centered top
- Label: Body Regular, centered bottom
```

**Community Section:**
```
"Community Wins"
"My PIE marks faded!" - Sarah
[See more →]

- Light sage background
- Scroll horizontal (carousel)
```

---

### 11. Routine Tracker

**Timeline Layout:**
```
✓ 1. Cleanser
  CeraVe Hydrating
  Completed at 8:15 AM
  - Green checkmark, gray text

✓ 2. Treatment
  Paula's Choice BHA
  Completed at 8:17 AM
  [Wait 5 min before next step] ← info box
  - Green checkmark

→ 3. Moisturizer      ← current step
  La Roche-Posay Toleriane
  [Mark as Done] - Primary button (compact)
  - Sage Green arrow

□ 4. Sunscreen
  EltaMD UV Clear
  - Empty checkbox
```

**Info Box Style:**
```
Background: rgba(255, 230, 102, 0.1)
Border-left: 3px solid #FFE066
Padding: 12px
Font: Caption
Icon: ℹ️ (14px, left)
```

**Tip Section:**
```
💡 Tip: Wait 20 min after BHA before applying moisturizer for best absorption.

- Light blue background
- Border-radius: 8px
- Padding: 16px
- Font: Body Small
```

---

### 12. Progress Comparison

**Side-by-Side Photos:**
```
┌────────────┬────────────┐
│  Day 1     │  Day 14    │
│  Feb 1     │  Feb 14    │
│            │            │
│  [Photo]   │  [Photo]   │
│            │            │
└────────────┴────────────┘

- Equal width
- Border-radius: 12px
- 8px gap between
- Date labels: Caption, centered above
```

**Improvements List:**
```
Improvements Detected:
✓ 30% reduction in inflammation
✓ 22% fewer new breakouts
✓ Skin texture smoother

- Green checkmarks
- Body Regular
- Percentage: Bold

Still seeing:
• Hormonal breakouts on jawline

- Warning icon (orange)
- Body Regular
```

**CTAs:**
```
[Adjust Treatment Plan] - Primary
[Upload New Photo]      - Secondary
[Share Progress]        - Tertiary (icon + text)
```

---

## Animations & Interactions

### Page Transitions
```
Type: Slide from right
Duration: 300ms
Easing: ease-out
```

### Button Press
```
Scale: 0.98
Opacity: 0.9
Duration: 100ms
```

### Card Selection
```
Border color: Fade to Sage Green (200ms)
Background: Fade to rgba(168, 230, 207, 0.05)
Checkmark: Scale from 0 to 1 (spring, 300ms)
```

### Loading States
```
Spinner: Rotate 360° continuous
Skeleton: Pulse opacity 0.4 → 0.6 (1.5s loop)
```

### Photo Upload
```
Preview: Fade in 400ms
Overlay dots: Stagger fade-in, 50ms delay each
```

---

## Responsive Breakpoints

**Mobile (320-428px):**
- Single column
- Full-width cards minus 24px margins
- Stack all elements

**Tablet (768px+):**
- Two-column grids for cards
- Wider max-width (600px centered)
- Larger images (80x80px product photos)

---

## Accessibility

### Minimum Touch Targets
```
Buttons: 44x44px minimum
Cards: Full-width, 60px minimum height
Radio/Checkbox: 32x32px minimum
```

### Color Contrast
```
Text on White: 7:1 (AAA)
Text on Sage Green: 4.5:1 (AA)
Links: Underline + color
```

### Focus States
```
2px solid Soft Blue outline
4px offset from element
Border-radius matches element
```

---

## Export Specifications

**Assets Needed:**
- App icon (1024x1024px)
- Product placeholder images (120x120px)
- Illustration assets (SVG preferred)
- Icons (24px, 32px, 64px)

**Figma Export Settings:**
- @1x, @2x, @3x for images
- SVG for icons
- PNG for photos
- WebP for web version

---

## Next Steps

1. Create Figma file with:
   - Design system (colors, typography, components)
   - 12 key screens (high-fidelity)
   - Component library
   - Interactive prototype flows

2. Prototype interactions:
   - Onboarding flow (5 screens)
   - Photo → Analysis → Plan (3 screens)
   - Home → Routine Tracker (2 screens)

3. User testing:
   - 10-20 participants
   - Task-based scenarios
   - Iterate based on feedback

---

**Design Specs Complete:** 12:40 AM EST  
**Ready for:** Figma implementation  
**Estimated Time:** 6-8 hours for full high-fidelity mockups
