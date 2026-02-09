# Truncation Protocol

## Purpose
Maintain continuity when hitting token limits or losing context mid-session.

---

## Checkpoint Format (memory/YYYY-MM-DD.md)

```markdown
## Checkpoint [HH:MM] — Message #XX

### Session Context
- **Topic:** What we're working on
- **Goal:** End state we're aiming for

### Decisions Made
- [ ] Decision 1 (rationale)
- [ ] Decision 2 (rationale)

### Action Items
- [ ] Pending task 1
- [ ] Pending task 2
- [x] Completed task

### Open Questions
- Unresolved question 1?
- Waiting on user input for X?

### Current Status
Where we left off. Specific enough to resume.

### Files Modified
- `path/to/file.ext` — what changed

### Message Count
**Messages this session:** XX
```

---

## Checkpoint Triggers

Write a checkpoint:
1. Every ~10 exchanges (proactive)
2. Before major decisions or destructive actions
3. At natural topic transitions
4. Before long-running tasks
5. When token count feels heavy (long outputs, many tool calls)

---

## Truncation Detection

### Signs of Truncation
- Confusion about what we were doing
- Missing context on recent decisions
- Message count resets or gaps
- "What were we working on?" feeling

### Detection Method
1. On each checkpoint, record message count
2. On next checkpoint, compare:
   - If `new_count < previous_count` → truncation likely
   - If context feels lost → check last checkpoint

---

## Recovery Protocol

When truncation detected:

1. **Announce it:**
   > "I may have lost some context. Let me recover..."

2. **Read last checkpoint:**
   ```
   read memory/YYYY-MM-DD.md
   ```

3. **Summarize recovery:**
   > "Recovered context: We were working on [X], last completed [Y], next step is [Z]."

4. **Confirm with user:**
   > "Does this match where we left off?"

5. **Resume work**

---

## Proactive Summarization

When approaching limits (session feels long/heavy):

1. Create a "session summary" checkpoint
2. Note: "This is a pre-truncation summary"
3. Include everything needed to cold-start

---

## Self-Check Habit

Start of each response in long sessions:
- Quick mental check: "Do I have full context?"
- If uncertain, read today's memory file
- If still lost, ask user for quick recap

---

## Example Checkpoint

```markdown
## Checkpoint [14:32] — Message #24

### Session Context
- **Topic:** Building truncation protocol for context recovery
- **Goal:** Create self-healing memory system

### Decisions Made
- [x] Store checkpoints in memory/YYYY-MM-DD.md
- [x] Use message count for detection
- [x] 10-exchange checkpoint interval

### Action Items
- [x] Write protocol doc
- [ ] Update AGENTS.md with protocol reference
- [ ] Test recovery flow

### Open Questions
- Should we add token estimation?

### Current Status
Protocol doc written. Need to integrate into workflow.

### Files Modified
- `memory/TRUNCATION-PROTOCOL.md` — created protocol

### Message Count
**Messages this session:** 24
```
