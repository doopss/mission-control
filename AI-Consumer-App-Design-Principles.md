# UX/Design Principles for AI-Enabled Consumer Apps
## Comprehensive Research Guide (2025-2026)

*Last Updated: February 2025*

---

## Table of Contents
1. [Liquid Glass Effect & Glassmorphism](#1-liquid-glass-effect--glassmorphism)
2. [Modern Design Philosophy for AI Apps](#2-modern-design-philosophy-for-ai-apps)
3. [UX Patterns Across Niches](#3-ux-patterns-across-niches)
4. [AI-Specific Design Considerations](#4-ai-specific-design-considerations)
5. [Top Reference Apps](#5-top-reference-apps)
6. [Actionable Checklist](#6-actionable-checklist)

---

## 1. Liquid Glass Effect & Glassmorphism

### What It Is

**Glassmorphism** is a visual design style that utilizes translucency, background blur, and layered depth to create a frosted glass appearance. It became mainstream with Apple's macOS Big Sur in 2020 and has evolved into **Liquid Glass** in 2025 with iOS 26/macOS Tahoe.

#### Key Characteristics
- **Opacity/Transparency**: Semi-transparent fills (typically 10-30% opacity)
- **Background Blur**: Gaussian blur (25-100px) that creates frosted effect
- **Strokes & Borders**: Subtle light borders (1px, low opacity) to define edges
- **Gradients**: Light gradients mimicking glass reflection
- **Depth & Layering**: Multiple layers creating spatial hierarchy

### When To Use It

✅ **Best Use Cases**
- Onboarding screens (highlights important elements, reduces complexity)
- Modal overlays and cards
- Navigation panels and menus
- Control centers and quick settings
- AR/VR interfaces (maintains 3D experience)
- Premium/luxury brand apps
- Creative tools and dashboards

❌ **When To Avoid**
- Text-heavy interfaces where readability is critical
- Complex data visualization
- Apps targeting users with visual impairments
- When backgrounds are unpredictable/busy
- Low-end devices (performance concerns)

### Best Practices (Nielsen Norman Group + Apple HIG)

#### 1. Meet Contrast Requirements
```
- Always check contrast ratios (WCAG 4.5:1 minimum for text)
- Text over glass panels may fall across multiple colors
- Use Figma plugin "Contrast" by WillowTree for checking
- Add semi-transparent solid overlay (10-30% white/dark tint)
```

#### 2. More Blur is Better
```
- Don't try too hard to keep background elements distinguishable
- Overwhelming backgrounds hurt readability and focus
- High-blur (100px+) for unpredictable backgrounds
- Lower blur (25-50px) only when you control the background
```

#### 3. Let Users Adjust Transparency
```
- Support "Reduce Transparency" accessibility setting
- Support "Increase Contrast" mode
- Provide solid-color fallbacks for accessibility
- Test with accessibility features enabled
```

### Technical Implementation Tips

#### CSS Glassmorphism
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Dark mode variant */
.glass-panel-dark {
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

#### React Native Implementation
```javascript
// Use @react-native-community/blur or expo-blur
import { BlurView } from 'expo-blur';

<BlurView 
  intensity={80} 
  tint="light"
  style={styles.glassContainer}
>
  {children}
</BlurView>
```

### Glassmorphism vs Liquid Glass (2025)

| Aspect | Traditional Glassmorphism | Apple Liquid Glass |
|--------|--------------------------|-------------------|
| Blur | Static | Real-time adaptive |
| Depth | Fixed layers | Physically accurate lensing |
| Motion | Minimal | Responds to device tilt/motion |
| Contrast | Manual adjustment | Auto-adapts to background |
| Performance | CSS-based | GPU-accelerated |

### Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|----------|
| Use consistent blur across similar elements | Use different blur levels inconsistently |
| Test on various backgrounds | Assume it looks good everywhere |
| Provide accessibility fallbacks | Ignore reduced-motion preferences |
| Keep text highly legible | Sacrifice readability for aesthetics |
| Use subtle, light borders | Rely solely on blur for definition |
| Combine with simple/controlled backgrounds | Layer over complex imagery without heavy blur |

---

## 2. Modern Design Philosophy for AI Apps

### Color Palettes & Gradients

#### 2025-2026 Color Trends for AI Apps

**Primary Approaches:**
1. **Calming Neutrals + Accent Colors** - Soft grays, off-whites with vibrant accents
2. **Deep/Dark Tones** - Navy, deep purple, charcoal (signals sophistication)
3. **Soft Pastels** - Mint, lavender, peach (wellness, approachability)
4. **Neon on Dark** - Electric accents on dark backgrounds (tech-forward)

**AI-Specific Color Meanings:**
- **Blue**: Trust, intelligence, reliability (ChatGPT, LinkedIn)
- **Purple**: Innovation, creativity, AI/magic (Anthropic, creative tools)
- **Green**: Success, confirmation, positive outcomes
- **Orange/Yellow**: Energy, attention, warnings
- **Gradient Blue→Purple**: AI processing, transformation

#### Dark Mode Considerations

**Essential Dark Mode Rules:**
```
Background Colors:
- Avoid pure black (#000000) - too harsh
- Use dark gray (#121212, #1E1E1E) - softer, modern
- Navy/deep purple variants for brand differentiation

Text Colors:
- Primary text: rgba(255,255,255,0.87) - not pure white
- Secondary text: rgba(255,255,255,0.60)
- Disabled text: rgba(255,255,255,0.38)

Accent Colors:
- Reduce saturation by 10-20% from light mode
- Increase brightness slightly for dark backgrounds
- Test contrast ratios in both modes
```

### Typography & Spacing

#### Mobile Typography Guidelines

| Element | iOS (pts) | Android (sp) | Mobile Web (px) |
|---------|-----------|--------------|-----------------|
| Large Title | 34 | 57 | 32-36 |
| Title 1 | 28 | 45 | 28-32 |
| Title 2 | 22 | 36 | 24-28 |
| Body | 17 | 16 | 16-18 |
| Caption | 12 | 12 | 12-14 |
| Minimum touch target | 44×44 | 48×48 | 44×44 |

**Typography Best Practices:**
- Use **humanist sans-serif** fonts (SF Pro, Roboto, Inter) for readability
- Minimum **16px** for text inputs (prevents iOS zoom)
- Line height: **1.4-1.6x** font size for body text
- Limit to **2-3 font weights** per app
- Support Dynamic Type / system font scaling

#### Spacing System

**8-Point Grid System:**
```
- Base unit: 8px
- Spacing scale: 4, 8, 16, 24, 32, 48, 64, 80
- Padding: 16px minimum for interactive elements
- Card margins: 16px (mobile), 24px (tablet)
- Section spacing: 32-48px between major sections
```

### Motion & Animation Principles

#### When to Use Animation

**✅ Use Animation For:**
1. **Feedback** - Confirming user actions (button press, form submit)
2. **State Changes** - Mode transitions, loading states
3. **Navigation Metaphors** - Spatial orientation (slide, zoom)
4. **Attention Direction** - Guiding eye to important changes
5. **Brand Personality** - Subtle character-building moments

**❌ Avoid Animation When:**
- It distracts from content
- It delays task completion
- Users have "reduce motion" enabled
- On low-powered devices
- For purely decorative purposes

#### Timing Guidelines (NN/g)

| Animation Type | Duration | Easing |
|---------------|----------|--------|
| Micro-feedback (button) | 100-200ms | ease-out |
| Card transitions | 200-300ms | ease-in-out |
| Modal open/close | 250-350ms | ease-out |
| Page transitions | 300-500ms | ease-in-out |
| Loading indicators | Continuous | linear |

#### Key Animation Principles

1. **Easing**: Never use linear for UI motion (use ease-out, spring)
2. **Purposeful**: Every animation should communicate something
3. **Consistent**: Same element = same animation everywhere
4. **Interruptible**: Users should be able to skip/interrupt
5. **Accessible**: Respect `prefers-reduced-motion`

### Depth & Layering

**Modern Depth Hierarchy:**
```
Layer 0: Background (wallpaper, images)
Layer 1: Base content (cards, lists)
Layer 2: Elevated content (selected items, floating buttons)
Layer 3: Overlays (modals, sheets)
Layer 4: Critical UI (alerts, notifications)

Each layer uses:
- Subtle shadow progression
- Background blur (for glass effects)
- Z-index management
```

---

## 3. UX Patterns Across Niches

### Health & Wellness Apps (Skin Analysis, Fitness, Mental Health)

#### Design Principles for Health Apps

**1. Calm, Trust-Building Interface**
- Soft, rounded shapes (not sharp corners)
- Muted color palettes (blues, greens, soft purples)
- Generous white space
- Gentle, reassuring copy

**2. Progressive Disclosure**
- Don't overwhelm with all data at once
- Show summary → tap for details
- Hide clinical details behind "Learn More"
- Use collapsible sections

**3. Privacy & Trust Signals**
- Visible security indicators
- Clear data usage explanations
- Easy-to-find privacy settings
- HIPAA/GDPR compliance badges

#### Key UX Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| **Habit Tracking** | Visual streaks, check-ins, progress rings | Calm, Headspace |
| **Personalization** | Adapt content based on user goals/mood | Balance (meditation) |
| **Gentle Nudges** | Non-judgmental reminders | Gentler Streak |
| **Visual Progress** | Charts, graphs, before/after | Noom, MyFitnessPal |
| **Gamification** | Achievements, levels, rewards | Waterllama, Duolingo |

#### Specific Patterns for Skin Analysis Apps

```
1. CAMERA INTERFACE
   - Clear framing guides
   - Lighting indicators
   - Tips for best photo quality
   - Privacy reassurance

2. ANALYSIS RESULTS
   - Simple severity scale (not clinical jargon)
   - Visual highlighting of areas
   - Confidence indicators
   - Actionable next steps

3. PROGRESS TRACKING
   - Before/after comparisons
   - Timeline of improvements
   - Correlation with treatments
   - Sharable progress reports
```

#### Reference Apps: Health/Wellness

| App | Why It Works | Key Design Element |
|-----|--------------|-------------------|
| **Calm** | Calm visuals, sleep-focused | Serene imagery, slow animations |
| **Headspace** | Playful illustrations, clear journeys | Character-driven, structured paths |
| **Balance** | Hyper-personalization | Daily adaptation to feedback |
| **Gentler Streak** | Recovery-first fitness | Protection, not punishment |
| **Noom** | Psychology-based behavior change | Daily coaching, habit loops |

### Productivity Apps (ADHD/Task Management, Focus Tools)

#### Neurodivergent-Friendly Design Principles

**1. Reduce Friction**
- Minimal steps to start a task
- One-tap actions for common tasks
- No shame for missed tasks
- Easy task reschedule/carry-over

**2. Visual Structure**
- Time-blocking visualization
- Color-coded categories
- Visual timers (not just numbers)
- Calendar integration

**3. Dopamine-Conscious Design**
- Micro-rewards for completion
- Satisfying completion animations
- Progress visualization
- No overwhelming to-do lists

**4. Flexible Over Rigid**
- Easy to modify routines
- No punishment for changes
- Support for variable energy levels
- "Good enough" vs perfection

#### ADHD-Specific UX Patterns

| Pattern | Description | Why It Works |
|---------|-------------|--------------|
| **Body Doubling** | Virtual co-working, presence | Accountability without pressure |
| **Time Blindness Aids** | Visual countdown, time left indicators | External time awareness |
| **Task Breaking** | Auto-split large tasks into steps | Reduces overwhelm |
| **Hyperfocus Protection** | Break reminders, time limits | Prevents burnout |
| **Context Switching** | Quick task swap without losing progress | Supports natural attention shifts |
| **Shame-Free Rollover** | Missed tasks auto-move, no red marks | Reduces anxiety |

#### Reference Apps: Productivity/ADHD

| App | Key Feature | Design Strength |
|-----|-------------|-----------------|
| **Tiimo** | Visual planner for neurodivergent | Icons, colors, gentle interface |
| **Focus Bear** | Built by/for ADHD+ASD | Path of least resistance design |
| **Amazing Marvin** | Customizable workflows | Adapts to how you think |
| **Sunsama** | Calm daily planning | Realistic workload, no overwhelm |
| **Structured** | Visual time blocking | Timeline-based, not list-based |

### Creative Tools (Image Generation, Editing)

#### Design Principles for Creative Apps

**1. Canvas-Centric Interface**
- Maximize workspace
- Tools available but not intrusive
- Context-sensitive toolbars
- Quick toggle for UI hide

**2. Iteration-Friendly**
- Easy variation generation
- History/version navigation
- Quick undo/redo
- Comparison views

**3. Progressive Complexity**
- Basic options visible
- Advanced in expandable panels
- Presets for quick starts
- Power user shortcuts

#### Key Patterns

| Pattern | Implementation |
|---------|---------------|
| **Prompt Assistance** | Suggestions, autocomplete, examples |
| **Gallery View** | Multiple outputs side-by-side |
| **Variation Controls** | Sliders for "creativity" vs "accuracy" |
| **Reference Images** | Easy upload, drag-and-drop |
| **Style Presets** | One-click aesthetic changes |

#### Reference Apps: Creative

- **Midjourney** - Gallery-first, iteration-focused
- **Adobe Firefly** - Integrated workflow, professional tools
- **Canva AI** - Approachable, template-based
- **Runway** - Video generation, timeline interface

### Cross-Niche Transferable Patterns

| Pattern | Works Across | Implementation |
|---------|--------------|----------------|
| **Onboarding Personalization** | All niches | Questions → customized experience |
| **Progress Visualization** | Health, Productivity, Learning | Streaks, graphs, milestones |
| **Empty State Guidance** | All niches | What to do first, examples |
| **Undo/Recovery** | Creative, Productivity | Easy mistake recovery |
| **Celebration Moments** | All niches | Confetti, animations for achievements |
| **Dark Mode** | All niches | System preference respect |

---

## 4. AI-Specific Design Considerations

### Loading States: Analyzing, Thinking, Processing

#### The Problem
AI operations take time (1-30+ seconds). Unlike traditional loading, users don't know what's happening or how long to wait.

#### Solutions & Patterns

**1. Skeleton Screens with Animation**
```
- Show placeholder UI matching final layout
- Animated shimmer/glare effect
- Indicates "content coming" not "stuck"
```

**2. Progress Communication**
```
- Show stages: "Analyzing image..." → "Finding patterns..." → "Generating report..."
- Use progress bars when duration is predictable
- Indeterminate spinners for unknown duration
```

**3. Chain of Thought Display**
```
- Show real-time thinking process
- "Researching..." "Comparing sources..." "Synthesizing..."
- Builds trust, reduces perceived wait time
- Example: Perplexity, Claude "thinking" blocks
```

**4. Meaningful Wait Content**
```
For waits >3 seconds:
- Tips about the feature
- Fun facts related to query
- Value proposition reinforcement
- Previous results to review
```

**5. Time Estimates**
```
"Usually takes 10-15 seconds"
"About 80% complete"
"Processing large image - may take a moment"
```

#### Implementation Examples

```jsx
// AI Loading State Component
const AILoadingState = ({ stage, progress }) => {
  const stages = [
    { key: 'analyzing', label: 'Analyzing your photo...', icon: '🔍' },
    { key: 'processing', label: 'Processing patterns...', icon: '⚙️' },
    { key: 'generating', label: 'Generating insights...', icon: '✨' }
  ];
  
  return (
    <div className="ai-loading">
      <ProgressRing progress={progress} />
      <StageIndicator current={stage} stages={stages} />
      <TipCarousel /> {/* Shows tips during wait */}
    </div>
  );
};
```

### Confidence Visualization

#### Why Show Confidence?
Users need to understand when AI is certain vs uncertain to make informed decisions and build appropriate trust.

#### Confidence Display Patterns

**1. Visual Indicators**
```
High (85-100%): Green checkmark, solid styling
Medium (50-84%): Orange/yellow, dotted styling  
Low (<50%): Red warning, "Review recommended"
```

**2. Verbal Qualifiers**
```
Instead of: "You have acne" (too definitive)
Use: "This appears to be acne (high confidence)"
Or: "This may be acne, but we recommend professional confirmation"
```

**3. Confidence Bars/Meters**
```
[████████░░] 80% confident
"Most likely: Inflammatory acne"
"Also consider: Rosacea (15%), Contact dermatitis (5%)"
```

**4. Uncertainty Ranges**
```
"Expected improvement: 40-60% over 8 weeks"
(shows range, not false precision)
```

#### Do's and Don'ts for Confidence

| ✅ Do | ❌ Don't |
|-------|----------|
| Use consistent color schemes | Show false precision (99.73%) |
| Explain what drives confidence | Hide uncertainty when model is unsure |
| Provide confidence calibration | Use confidence as only decision factor |
| Show ranges, not just point estimates | Overwhelm with technical probability details |
| Guide action during low confidence | Make low confidence visually alarming |

### Explainability: Showing Why AI Made a Decision

#### The Importance
Users trust AI more when they understand the reasoning. Explainability builds trust, enables learning, and helps users correct mistakes.

#### Explainability Patterns

**1. Source Attribution**
```
Answer: "Vitamin C serums can help with acne scarring."
Sources: 
  [1] Journal of Dermatology, 2024
  [2] American Academy of Dermatology
  [3] Mayo Clinic
```

**2. Highlighted Evidence**
```
"Based on your photo, we noticed:
  • Redness around nose and cheeks [highlighted on image]
  • Visible inflammation in T-zone [highlighted on image]
  • Texture changes suggesting dehydration [highlighted on image]"
```

**3. Reasoning Steps**
```
"Here's how I arrived at this recommendation:
  1. Your skin shows signs of oiliness → suggests sebaceous activity
  2. Breakouts concentrated in T-zone → common acne pattern
  3. No signs of infection → likely hormonal or environmental
  Recommendation: Salicylic acid cleanser + niacinamide serum"
```

**4. Comparison to Similar Cases**
```
"Users with similar skin profiles saw:
  • 73% improvement with this routine
  • Average time to results: 6-8 weeks"
```

### Progressive Disclosure

#### The Principle
Don't overwhelm users with all information at once. Reveal complexity gradually based on user need and expertise.

#### Implementation Patterns

**1. Summary → Detail Expansion**
```
[Default View]
Skin Analysis: Moderate Acne
Overall Score: 6.5/10
▼ See detailed breakdown

[Expanded View]
Hydration: 7/10
Oil Balance: 5/10
Inflammation: 4/10
Pore Visibility: 6/10
...
```

**2. Beginner → Advanced Modes**
```
Beginner: "Try this routine" (simple list)
Advanced: "Try this routine" + ingredient details + timing + alternatives
```

**3. Layered Information Architecture**
```
Level 1: Simple answer
Level 2: Supporting details
Level 3: Technical/scientific backing
Level 4: Raw data/sources
```

**4. Contextual Details**
```
Show info icons (ℹ️) that expand on tap
Tool-tips for unfamiliar terms
"Why this?" explanatory links
```

### Error States & Graceful Degradation

#### Types of AI Errors

| Error Type | User Message | Recovery Action |
|------------|--------------|-----------------|
| **Processing Failed** | "We couldn't analyze your photo. This sometimes happens with unusual lighting." | "Try again" button, photo tips |
| **Low Confidence** | "We're not confident in these results." | "Get human review" or "Try different angle" |
| **Timeout** | "This is taking longer than usual." | Progress indicator, cancel option |
| **Partial Results** | "We found some insights, but couldn't complete the full analysis." | Show partial results + retry option |
| **Content Policy** | "We can't analyze this type of image." | Explain why, suggest alternatives |

#### Error Message Best Practices

```
❌ Bad: "Error 500: AI inference failed"
✅ Good: "Something went wrong on our end. We're on it! Please try again in a moment."

❌ Bad: "Invalid input"
✅ Good: "The photo seems blurry. For best results, try taking it in natural light."

❌ Bad: "Model confidence below threshold"
✅ Good: "We need a bit more information to give you accurate results. Could you try uploading a closer photo?"
```

#### Graceful Degradation Strategy

```
1. Full AI → 2. Simplified AI → 3. Rule-based fallback → 4. Human handoff

Example:
1. Full: Complete skin analysis with 12 factors
2. Simplified: Basic skin type + top 3 concerns
3. Rule-based: "Based on your answers, you might have oily skin"
4. Human: "Connect with a dermatologist for personalized advice"
```

### Memory & Personalization

#### Why It Matters
AI products that remember user context reduce friction and feel more intelligent.

#### Memory Types

**1. Session Memory (Short-term)**
- Context from current conversation
- Recently viewed items
- In-progress tasks

**2. Persistent Memory (Long-term)**
- User preferences
- Past interactions and feedback
- Goals and progress
- Learned patterns

#### Implementation Patterns

```
1. EXPLICIT MEMORY
   User: "I have sensitive skin"
   System: [Stores preference, applies to all recommendations]
   Later: "Since you have sensitive skin, I'm recommending fragrance-free options"

2. IMPLICIT MEMORY
   [User frequently asks about acne]
   System: [Prioritizes acne-related content in recommendations]

3. MEMORY MANAGEMENT
   - Show users what you remember
   - Let them edit/delete memories
   - Explain how memories influence results
```

---

## 5. Top Reference Apps

### Tier 1: Exceptional AI UX

#### 1. Perplexity AI
**Category:** Research/Search  
**Why It's Exceptional:**
- Search-like simplicity (works with keywords, not just prompts)
- Sources shown prominently at top of results
- Follow-up questions suggested (reduces friction)
- Fast, focused on single use case

**Key Design Decisions:**
- Input looks like search box (familiar mental model)
- No anthropomorphization (it's a tool, not a friend)
- Clear information hierarchy
- Mobile-first responsive design

**Screenshot Analysis:**
```
┌─────────────────────────────┐
│ [Search/Ask anything...]    │  ← Familiar search pattern
├─────────────────────────────┤
│ Sources: [1][2][3][4][5]    │  ← Trust-building
├─────────────────────────────┤
│ Answer text with [1] inline │  ← Attributed information
│ citations throughout...      │
├─────────────────────────────┤
│ Related: [?] [?] [?]        │  ← Easy exploration
└─────────────────────────────┘
```

#### 2. Claude (Anthropic)
**Category:** General AI Assistant  
**Why It's Exceptional:**
- Artifacts feature (code, documents render in-app)
- Cleaner, less verbose responses
- "Thinking" blocks show reasoning
- Distinct visual language from ChatGPT

**Key Design Decisions:**
- Side-by-side artifact view
- Subtle brand colors (terra cotta accent)
- Structured response formatting
- Clear conversation boundaries

#### 3. ChatGPT
**Category:** General AI Assistant  
**Why It's Exceptional:**
- Pioneer of conversational AI UX
- Voice mode with natural interaction
- Plugin ecosystem (extensibility)
- Canvas feature for editing

**Key Design Decisions:**
- Simple chat interface
- Dark mode by default
- Suggested prompts for new users
- Clear model selection

### Tier 2: Excellent Niche Design

#### 4. Headspace
**Category:** Mental Health/Meditation  
**Design Strengths:**
- Playful illustration system
- Structured journeys (not overwhelming choice)
- Calming color palette
- Clear progress tracking

#### 5. Calm
**Category:** Sleep/Relaxation  
**Design Strengths:**
- Immersive visual experiences
- Sleep-focused dark mode
- Audio-first design
- Premium feel

#### 6. Midjourney
**Category:** Image Generation  
**Design Strengths:**
- Gallery-centric layout
- Iteration-focused (variations easy)
- Community inspiration built-in
- Strong aesthetic consistency

#### 7. Notion AI
**Category:** Productivity + AI  
**Design Strengths:**
- AI integrated into existing workflow
- Non-intrusive suggestions
- Document-native AI features
- Clean, minimal interface

#### 8. Vik by Wefight
**Category:** Health (Chronic Disease Support)  
**Design Strengths:**
- Conversational health companion
- Condition-specific AI
- 24/7 availability
- Simple, accessible design

### Design Lessons from Top Apps

| App | Key Lesson |
|-----|------------|
| Perplexity | **Familiarity wins** - Use known patterns (search box) for new technology |
| Claude | **Show your work** - Transparency builds trust (thinking blocks, artifacts) |
| ChatGPT | **Keep it simple** - Chat is universally understood |
| Headspace | **Guide the journey** - Structure prevents overwhelm |
| Calm | **Atmosphere matters** - Design for the emotional state you want to create |
| Midjourney | **Embrace iteration** - Make trying again frictionless |

---

## 6. Actionable Checklist

### Pre-Design Checklist

- [ ] Define the single core user problem to solve
- [ ] Identify the level of automation (assist vs automate)
- [ ] Determine confidence visibility requirements
- [ ] Map the error states and fallbacks
- [ ] Define memory/personalization scope
- [ ] Establish accessibility requirements

### Visual Design Checklist

**Colors & Themes:**
- [ ] Primary color palette defined (3-5 colors max)
- [ ] Dark mode variant created
- [ ] Contrast ratios meet WCAG AA (4.5:1 text)
- [ ] Semantic colors for states (success, error, warning)
- [ ] Tested with color blindness simulators

**Typography:**
- [ ] Type scale defined (2-3 sizes mobile, 4-5 desktop)
- [ ] Minimum 16px for input fields
- [ ] Line height 1.4-1.6x for body text
- [ ] Supports system font scaling
- [ ] Limited to 2-3 font weights

**Spacing & Layout:**
- [ ] 8-point grid system implemented
- [ ] Consistent padding/margins
- [ ] Touch targets 44x44pt minimum
- [ ] Responsive breakpoints defined

**Glassmorphism (if using):**
- [ ] Blur value appropriate for background
- [ ] Semi-transparent overlay added
- [ ] Border definition present
- [ ] Contrast meets requirements
- [ ] Fallback for accessibility modes

### Animation Checklist

- [ ] Every animation has a purpose
- [ ] Timing under 500ms for UI transitions
- [ ] Uses easing (not linear)
- [ ] Respects `prefers-reduced-motion`
- [ ] Doesn't block interaction
- [ ] Consistent across similar elements

### AI-Specific UX Checklist

**Loading States:**
- [ ] Visual feedback for AI processing
- [ ] Stage indicators for multi-step processes
- [ ] Time estimate or progress indicator
- [ ] Meaningful wait content for long operations
- [ ] Cancel option available

**Confidence & Explainability:**
- [ ] Confidence levels visualized appropriately
- [ ] Sources/reasoning accessible
- [ ] Low-confidence guidance provided
- [ ] "Why this?" explanations available

**Error Handling:**
- [ ] User-friendly error messages
- [ ] Clear recovery paths
- [ ] Graceful degradation plan
- [ ] Human fallback option

**Memory & Personalization:**
- [ ] Memory visible to users
- [ ] Edit/delete options available
- [ ] Privacy controls clear
- [ ] Value of personalization explained

### Accessibility Checklist

- [ ] Screen reader compatible
- [ ] Keyboard navigable
- [ ] High contrast mode supported
- [ ] Reduce motion mode supported
- [ ] Reduce transparency mode supported
- [ ] Dynamic type supported
- [ ] Color not sole indicator of state

---

## Quick Reference: Do's and Don'ts Summary

### Universal Do's
1. ✅ Keep it simple - complexity is the enemy
2. ✅ Show loading/thinking states clearly
3. ✅ Provide confidence when AI is uncertain
4. ✅ Use familiar UI patterns (search box, chat)
5. ✅ Support dark mode properly
6. ✅ Test with real users early and often
7. ✅ Build trust through transparency
8. ✅ Allow users to correct/override AI

### Universal Don'ts
1. ❌ Over-animate or distract
2. ❌ Hide uncertainty from users
3. ❌ Use pure black (#000) for dark mode
4. ❌ Require perfect prompts from users
5. ❌ Show technical errors to users
6. ❌ Forget accessibility
7. ❌ Anthropomorphize unnecessarily
8. ❌ Prioritize aesthetics over usability

---

## Resources & Further Reading

### Design Systems
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design 3](https://m3.material.io/)
- [Microsoft Fluent Design](https://fluent2.microsoft.design/)

### AI UX Patterns
- [The Shape of AI](https://www.shapeof.ai/) - AI UX pattern library
- [Agentic Design Patterns](https://agentic-design.ai/) - Confidence, handoff patterns
- [NN/g AI Articles](https://www.nngroup.com/topic/artificial-intelligence/)

### Glassmorphism Resources
- [Glassmorphism CSS Generator](https://ui.glass/generator/)
- [NN/g Glassmorphism Best Practices](https://www.nngroup.com/articles/glassmorphism/)

### Tools
- [Figma Contrast Plugin](https://www.figma.com/community/plugin/748533339900865323/contrast)
- [Coolors](https://coolors.co/) - Color palette generator
- [GSAP](https://greensock.com/gsap/) - Animation library
- [Lottie](https://lottiefiles.com/) - Animation files

---

*This document is a living resource. Update as design trends evolve and new patterns emerge.*
