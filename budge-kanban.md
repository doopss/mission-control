# Budge - Development Kanban

**Updated:** 2026-02-07 10:34 PM EST  
**Priority Order:** Orb → Dopamine → Sounds → Notifications

---

## 🔴 Priority 1: Orb Improvements

### ✅ Done
- [x] **Orb dynamism enhancements** ⚡ **COMPLETED**
  - ✅ Organic breathing (Bezier easing instead of sine wave)
  - ✅ Phase offsets (layers breathe out of sync 15-70%)
  - ✅ Enhanced warmth progression in focus state
  - ✅ Smoother dimming transitions (600ms)
  - **Result:** Feels more alive and natural

---

## 🟡 Priority 2: Dopamine Hit

### ✅ Done
- [x] **Haptic feedback** - Single medium impact ✅
  - Wired to CompleteScreen (fires on mount)
  - Removed old triple-tap pattern
  - Rationale: Subconscious satisfaction, not celebratory
  
- [x] **Visual: Orb glow transition** ✅
  - Complete state already has higher glow/opacity
  - Breathing is slower and warmer
  - Smooth state transitions via improved Orb component

---

## 🟢 Priority 3: Focus Sounds

### ✅ Done
- [x] **SoundPicker component** ✅
  - UI complete with 6 sound options (silence, brown noise, rain, cafe, white noise, fireplace)
  - Autoplay toggle included
  - Selection state + icons
  
- [x] **Audio playback hook (useFocusSound)** ✅
  - expo-av integration
  - Loop playback with fade in/out
  - Volume control (0.6 default)
  - Pause/resume support
  - AsyncStorage persistence
  
- [x] **Storage keys added** ✅
  - selectedSound
  - autoplaySound

### ✅ Unblocked - Audio Files Generated!
- [x] **Audio files generated** ✅
  - brown-noise.mp3 (6.9MB, 10min)
  - rain.mp3 (6.9MB, 10min)
  - cafe.mp3 (6.9MB, 10min)
  - white-noise.mp3 (6.9MB, 10min)
  - fireplace.mp3 (6.9MB, 10min)
  - All files: Valid MP3, 96kbps, seamlessly loopable
  - Location: `assets/sounds/`
  
- [x] **expo-av installed** ✅
  
- [x] **Wire to Focus screen** ✅ **COMPLETE**
  - SoundPicker modal integrated
  - Auto-play on focus start (if enabled)
  - Sound picker button in top-right
  - Sound stops when leaving focus screen

**🎉 100% COMPLETE!**

---

## 🔵 Priority 4: Notifications

### ✅ Done
- [x] **useNotifications hook** ✅
  - Permission request flow
  - Enable/disable toggle
  - Schedule based on timing preferences
  - Cancel all notifications
  
- [x] **Gentle reminder copy** ✅
  - 5 rotating messages: "Still stuck? I can help.", "Ready when you are.", etc.
  - No nagging tone
  - Aligned with app philosophy
  
- [x] **Timing strategy** ✅
  - Maps to onboarding timing preferences (morning/afternoon/evening/always)
  - Morning: 9 AM, Afternoon: 2 PM, Evening: 7 PM
  - "Always": Every 4 hours
  - Fallback: Daily at 10 AM
  
- [x] **Storage key added** ✅
  - notificationsEnabled

### ✅ Integration Complete
- [x] **Wired to paywall screen** ✅
  - Notifications enabled automatically after subscription
  - scheduleReminders() called with user's timing preferences
  - expo-notifications installed

**🎉 100% COMPLETE!**

---

## 🗑️ Cleanup

### ✅ Done
- [x] **Delete return screen** ✅
  - app/(main)/return.tsx removed
  - Replaced by LastSessionHint component

### ✅ Done
- End-to-end UI (all screens)
- AI task breakdown (OpenAI integration)
- Core flow (orb → task → focus → complete)
- State management (Zustand)
- Persistence (AsyncStorage)
- Last session continuation
- "Make it smaller" loop

---

## 🟡 Priority 2: Backend & Analytics

### 🎯 To Do
- [ ] **Subscription management**
  - Platform: RevenueCat (recommended for cross-platform)
  - Paywall screen already built (needs wiring)
  - Plans: Free trial → $X.XX/month (pricing TBD)
  - Restore purchases flow

- [ ] **Analytics/logging**
  - Platform: TBD (PostHog? Mixpanel? Firebase?)
  - Key events to track:
    - Task creation
    - Task completion
    - "Make it smaller" usage
    - Focus session duration
    - Distraction taps
    - Retention (D1, D7, D30)
  - Privacy-first: no PII, anonymized data

- [ ] **Backend (optional for MVP)**
  - Currently all local (AsyncStorage)
  - Future: cloud sync, cross-device
  - Platform: Supabase? Firebase? Custom?

---

## 🟢 Priority 3: Post-MVP (Sr Dev)

### 🎯 Backlog
- [ ] **Voice input**
  - expo-speech-recognition
  - Requires dev build
  - Button UI already exists ("coming soon" state)

---

## 📝 Design Decisions Needed

### Dopamine Hit - Deep Dive Required
**Context:** Task completion feedback without being "cheery" (no 🎉)

**Options to explore:**
1. **Haptics**
   - Light tap on "Done" press
   - Subtle success pattern (not aggressive buzz)
   - iOS: UIImpactFeedbackGenerator (medium)
   - Android: Vibration API (short pattern)

2. **Visual**
   - Orb state change (satisfied breathing → calm glow)
   - Subtle color shift (warm transition)
   - Fade-in affirmation text with personality
   - Progress dots update animation

3. **Audio** (consider optional given focus sounds)
   - Gentle chime (not celebratory)
   - Or: silence = completion is its own reward

4. **Combination patterns**
   - Light haptic + orb glow shift
   - Haptic + text fade-in
   - Minimal but satisfying

**Key constraint:** Must feel like relief, not achievement pressure.

**Questions:**
- Should dopamine hit scale with task progression? (first step vs 5th step)
- Different feedback for "distracted" vs "completed"?
- User preference toggle for haptics/sound?

---

## Notes
- **Philosophy:** No guilt, no streaks, no tracking
- **Tone:** Warm but not cheery
- **Animations:** Calm, slow fades, no bouncing
- **Binary choices:** Present 2 options, not open-ended
- **ADHD-friendly:** Reduce cognitive load at every turn

---

Last updated: 2026-02-07 11:35 AM EST
