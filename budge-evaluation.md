# Budge App - Code Evaluation & Next Steps

**Evaluated:** 2026-02-07 5:52 PM EST

---

## ✅ What's Built (70% Complete)

### **Screens (Complete)**
- ✅ Onboarding flow (hook, problems, promise, timing)
- ✅ Paywall
- ✅ Home (orb + text input)
- ✅ Task (micro-step display with Start/Smaller/Different)
- ✅ Focus (timer with pause, +1min, done, distracted)
- ✅ Complete (celebration + continue/break options)
- ✅ Break
- ✅ Distracted
- ✅ Momentum (weekly dots)
- ✅ Return screen (though Alex mentioned it was removed in favor of LastSessionHint)

### **Components (Complete)**
- ✅ Orb (5-layer animated SVG, multiple states: calm/thinking/focus/complete)
- ✅ TaskCard
- ✅ MomentumDots (7-day activity, no streaks)
- ✅ VoiceInput (UI complete, animations working)
- ✅ Button, Chip, TimePill, ProgressBar

### **Core Features (Complete)**
- ✅ AI task breakdown (Anthropic Claude API, ADHD-tuned system prompt)
- ✅ "Make it smaller" loop with 3+ shrink detection
- ✅ Task continuation flow (complete → continue same task)
- ✅ State management (Zustand)
- ✅ Persistence (AsyncStorage)
- ✅ Last session tracking
- ✅ Completed tasks history
- ✅ Onboarding selections storage

### **Infrastructure (Complete)**
- ✅ Expo Router navigation
- ✅ Config-driven design system (comprehensive JSON config)
- ✅ Custom hooks (useTimer, useOrb, useGreeting, useHaptics)
- ✅ Typography system (DM Sans, Fraunces)
- ✅ Theme with dark mode colors

---

## ❌ What's Missing (30% - Priority 1)

### **1. Dopamine Hit** ❗ **PRIORITY**
**Current state:** 
- `useHaptics.complete()` exists but is **NOT called** in CompleteScreen
- Existing pattern: Heavy-Light-Heavy (200ms spacing)
- No visual orb transition on completion
- No audio feedback

**Issue:** Your existing `complete()` haptic is a triple-tap pattern (heavy-light-heavy). This conflicts with our design decision to go **single medium impact** for consistency.

**Decision needed:**
- Keep triple-tap (more dramatic but potentially game-like)
- Switch to single medium impact (more minimal, aligned with "warm not cheery")
- Which visual feedback: orb glow transition duration?

### **2. Orb Dynamism Improvements**
**Current state:**
- 4 states implemented (calm, thinking, focus, complete)
- Animations working but could be more responsive
- Transitions between states are functional

**What could improve:**
- Smoother state transitions (currently 1200ms)
- More personality in breathing patterns
- Response to user interaction (task shrinking, etc.)

**Low priority unless specific issues observed.**

### **3. Focus Sounds Audio Playback** ❗ **PRIORITY**
**Current state:**
- SoundPicker component **not found in codebase** (mentioned in your brief but doesn't exist)
- No audio files in `/assets`
- `expo-speech` installed but not used for TTS
- Autoplay preferences stored in AsyncStorage but no playback wired

**Need to build:**
1. SoundPicker component (UI for selecting focus sounds)
2. Audio playback hook (expo-av or react-native-sound)
3. Sound files (brown noise, rain, cafe ambience, etc.)
4. Integration into Focus screen
5. Autoplay preference toggle

### **4. Notifications/Reminders**
**Current state:**
- ❌ Not implemented at all
- No notification permissions
- No scheduling
- No copy written

**Need to build:**
1. Notification permissions flow
2. Scheduling based on user timing preferences (from onboarding)
3. Gentle copy: "Still stuck? I can help." not "You missed your goal!"
4. Integration with `expo-notifications`

---

## 🔴 Critical Gaps (Blockers for MVP)

### **Voice Input - Stub Only**
**Status:** UI complete, no functionality
- Button animates, shows recording state
- No actual speech recognition wired up
- Needs `expo-speech-recognition` or Web Speech API
- **Requires dev build** (can't test in Expo Go)

**Your note:** "coming soon" — Sr Dev will handle this post-MVP.

### **Subscription Management**
**Status:** Paywall screen exists, no RevenueCat integration
- No actual subscription flow
- No trial logic
- No restore purchases
- Status stored in Zustand but never updated

**Your note:** This is Priority 2, backend work.

### **Analytics/Logging**
**Status:** Events defined in config, not tracked
- No analytics SDK installed
- Event names exist in config: `taskCreated`, `taskCompleted`, `focusSessionStarted`, etc.
- No error logging (Sentry/Bugsnag)

**Your note:** This is Priority 2.

---

## 📋 Proposed Next Steps (In Order)

### **Phase 1: Dopamine Hit (1-2 days)**
1. **Design decision call:** Single impact vs triple-tap haptic?
2. Wire up haptic to Complete screen
3. Add orb glow transition on completion (satisfied state)
4. Test feel on device
5. Add user preference toggle if needed

### **Phase 2: Focus Sounds (2-3 days)**
1. Create SoundPicker component UI
2. Source/create audio files (brown noise, rain, etc.)
3. Build audio playback hook with `expo-av`
4. Integrate into Focus screen
5. Wire up autoplay preferences
6. Add volume control if needed

### **Phase 3: Notifications (1-2 days)**
1. Add `expo-notifications` permissions flow
2. Write gentle reminder copy (aligned with app tone)
3. Schedule based on timing preferences
4. Test delivery + tapping behavior (open to home screen)
5. Add notification settings toggle

### **Phase 4: Orb Dynamism (Optional, 1 day)**
- Review orb animations in real use
- Identify specific improvements needed
- Smooth out any jarring transitions
- Add micro-interactions if missing

---

## 🚨 Before I Start

**Questions for you:**

1. **Dopamine hit:** Single medium impact or keep the triple-tap? Want orb glow or just haptic?
   
2. **Focus sounds:** Do you have audio files, or should I source/generate them? Preferred sound options?

3. **Notifications:** What timing should I use? Based on user's selected timing preferences from onboarding, or fixed intervals?

4. **Testing:** Do you have a dev build setup, or should I assume testing on physical device via Expo Go (limited for voice)?

5. **Priorities:** Confirm order: Dopamine → Sounds → Notifications → Orb improvements?

---

## 📦 Code Quality Notes

**Strengths:**
- ✅ Excellent config-driven architecture
- ✅ Clean component separation
- ✅ Comprehensive anti-patterns documentation
- ✅ Consistent design system
- ✅ Good TypeScript usage

**Concerns:**
- ⚠️ API key in environment variable (Anthropic) - okay for dev, needs secure handling for prod
- ⚠️ No error boundaries
- ⚠️ No loading states in AI calls (fallback is good though)
- ⚠️ Return screen exists but you said it was removed - should I delete it?

---

**Ready to proceed once you confirm the design decisions above.** 🚀
