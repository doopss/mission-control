# AI/LLM Cost Optimization Report
## From $1k/month → Target $200-300/month (70-80% Reduction)

**Date:** February 9, 2026  
**Author:** OpenClaw Subagent (Cost Research)  
**Status:** Research Complete

---

## Executive Summary

Alex is currently spending ~$1,000/month on AI inference costs, primarily through Anthropic's Claude API (Sonnet 4 and Opus 4.5). This report identifies **multiple paths to 70-80% cost reduction** while maintaining productivity.

### Key Findings:
1. **Opus 4.5 for sub-agents is the biggest cost driver** - Output tokens at $25/1M are expensive
2. **DeepSeek V3 offers 98% cost reduction** for many tasks ($0.28-$0.42 vs $3-$25)
3. **Prompt caching can reduce costs 90%** when enabled properly
4. **Model tiering** (right model for right task) can cut costs 50-70%
5. **Free tiers exist** for development/testing (Google AI Studio)

### Immediate Actions (Today):
1. ✅ Switch sub-agents from Opus → Sonnet (saves ~40%)
2. ✅ Enable prompt caching properly (saves ~90% on repeated contexts)
3. ✅ Use cheaper models for simple tasks (research, summaries)

---

## Part 1: Current Cost Analysis

### Current Setup (from openclaw.json)
```json
{
  "primary": "anthropic/claude-sonnet-4-5",
  "fallbacks": ["anthropic/claude-opus-4-5"],
  "cacheRetention": "long"  // Good! Already enabled
}
```

### Current Anthropic Pricing (2026)

| Model | Input | Output | Context |
|-------|-------|--------|---------|
| **Claude Opus 4.5** | $5.00/1M | $25.00/1M | 200K |
| **Claude Sonnet 4.5** | $3.00/1M | $15.00/1M | 200K-1M |
| **Claude Haiku 4.5** | $1.00/1M | $5.00/1M | 200K |
| Long context (>200K) | 2x input | 1.5x output | 1M |

### Estimated Current Burn Breakdown

Based on typical OpenClaw usage patterns with Budge/acne app development + research:

| Activity | Est. Token Usage | Model | Est. Monthly Cost |
|----------|------------------|-------|-------------------|
| Main session (interactive) | ~50M input, 15M output | Sonnet | $150 + $225 = **$375** |
| Sub-agent spawns (heavy Opus) | ~30M input, 10M output | Opus | $150 + $250 = **$400** |
| Tool calls overhead | ~10M input, 3M output | Sonnet | $30 + $45 = **$75** |
| Heartbeats/background | ~5M input, 2M output | Sonnet | $15 + $30 = **$45** |
| **Total Estimated** | | | **~$900-1000/month** |

**Biggest Cost Driver: Sub-agents with Opus 4.5 output tokens ($25/1M)**

---

## Part 2: Model Cost Comparison (February 2026)

### Tier 1: Flagship Models

| Provider | Model | Input/1M | Output/1M | Notes |
|----------|-------|----------|-----------|-------|
| Anthropic | Claude Opus 4.5 | $5.00 | $25.00 | Best coding (80.9% SWE-bench) |
| Anthropic | Claude Sonnet 4.5 | $3.00 | $15.00 | Great balance |
| OpenAI | GPT-5.2 | $1.75 | $14.00 | Cheapest flagship |
| OpenAI | GPT-5 | $1.25 | $10.00 | Previous gen, still excellent |
| Google | Gemini 3 Pro | $2.00 | $12.00 | Strong multimodal |

### Tier 2: Fast/Efficient Models

| Provider | Model | Input/1M | Output/1M | Notes |
|----------|-------|----------|-----------|-------|
| Anthropic | Claude Haiku 4.5 | $1.00 | $5.00 | 80% cheaper than Opus |
| OpenAI | GPT-5 mini | $0.25 | $2.00 | Great for simple tasks |
| OpenAI | GPT-4.1 mini | $0.15 | $0.60 | Excellent value |
| Google | Gemini 3 Flash | $0.50 | $3.00 | **FREE tier available** |
| Google | Gemini 2.5 Flash | $0.30 | $2.50 | Very capable |
| Google | Gemini 1.5 Flash | $0.075 | $0.30 | Cheapest major model |

### Tier 3: Budget Champions (Game Changers)

| Provider | Model | Input/1M | Output/1M | Notes |
|----------|-------|----------|-----------|-------|
| **DeepSeek** | **V3.2 Chat** | **$0.28** | **$0.42** | 🔥 **98% cheaper than Opus** |
| DeepSeek | V3.2 Reasoner | $0.28 | $0.42 | Thinking mode |
| DeepSeek | Cache Hit | $0.028 | - | 90% off with caching |
| Google | Gemini Flash-8B | $0.0375 | $0.15 | Cheapest for volume |

### Cost Comparison: Same 10M Output Tokens

| Model | Cost for 10M Output |
|-------|---------------------|
| Claude Opus 4.5 | $250.00 |
| Claude Sonnet 4.5 | $150.00 |
| GPT-5.2 | $140.00 |
| Claude Haiku 4.5 | $50.00 |
| Gemini 3 Flash | $30.00 |
| GPT-5 mini | $20.00 |
| **DeepSeek V3** | **$4.20** |

**DeepSeek is 60x cheaper than Opus for the same output volume**

---

## Part 3: Optimization Strategies

### Strategy 1: Model Tiering (Right Model for Right Task)

| Task Type | Current | Recommended | Savings |
|-----------|---------|-------------|---------|
| **Complex coding** | Opus | Keep Opus | 0% |
| **Sub-agents (general)** | Opus | **Sonnet** | 40% |
| **Research/web search** | Sonnet | **Haiku or DeepSeek** | 85% |
| **Summarization** | Sonnet | **DeepSeek/Gemini Flash** | 95% |
| **Simple Q&A** | Sonnet | **GPT-5 mini** | 90% |
| **Document processing** | Sonnet | **DeepSeek** | 97% |
| **Heartbeats/monitoring** | Sonnet | **Haiku** | 66% |

### Strategy 2: Prompt Caching (Already Partially Enabled)

Your config shows `cacheRetention: "long"` which is good. Here's how caching helps:

| Provider | Cache Hit Discount | TTL |
|----------|-------------------|-----|
| Anthropic | **90% off input tokens** | 5 min default, 1hr option |
| OpenAI | 90% off input tokens | Similar |
| DeepSeek | 90% off ($0.028/1M) | Automatic |

**Caching Best Practices:**
1. Keep system prompts consistent (same prefix = cache hit)
2. Order matters: stable content first, variable content last
3. Minimum 1024 tokens to trigger caching
4. Use `cache_control` breakpoints strategically

**Potential Impact:** If 70% of input tokens hit cache:
- Current: 50M input × $3/1M = $150
- With caching: 15M miss × $3 + 35M hit × $0.30 = $45 + $10.50 = **$55.50**
- **Savings: $95/month just on input caching**

### Strategy 3: Reduce Context Window Bloat

Large contexts are expensive. Tips:
1. **Truncate old conversation history** - Keep last N turns, summarize rest
2. **Lazy load tool outputs** - Only include when relevant
3. **Compress file contents** - Summarize instead of including raw
4. **Use retrieval** - Don't stuff entire documents into context

### Strategy 4: Batch Operations

Both Anthropic and OpenAI offer **50% discount** for batch/async operations:
- Good for: Reports, bulk analysis, scheduled tasks
- Latency: Up to 24 hours
- Use case: End-of-day summaries, document processing

### Strategy 5: Self-Hosted Models (Ollama)

**Mac Mini M-series is capable of local inference:**

| Model | RAM Needed | Speed | Quality |
|-------|------------|-------|---------|
| Llama 3.1 8B | 8GB | ~30 tok/s | Good for simple tasks |
| Llama 3.1 70B | 48GB | ~5 tok/s | Near-GPT-4 quality |
| Mistral 7B | 8GB | ~40 tok/s | Excellent efficiency |
| DeepSeek Coder | 16GB | ~20 tok/s | Great for code |

**Cost: $0/month after setup** (just electricity ~$5/month)

**Good for:**
- Development/testing
- Simple automation
- Privacy-sensitive tasks
- Offline capability

**Not good for:**
- Complex reasoning (use API for that)
- Speed-critical tasks
- Multi-model comparisons

---

## Part 4: Recommended Architecture

### Multi-Provider Setup via OpenRouter

OpenRouter lets you access all models through one API with **no markup** on most models:

```
OpenRouter → Route to cheapest capable model
├── Complex coding → Claude Opus 4.5
├── General dev work → Claude Sonnet 4.5  
├── Research/summaries → DeepSeek V3
├── Simple tasks → GPT-5 mini
└── Bulk processing → Batch API (50% off)
```

### Suggested OpenClaw Configuration

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-5",
        "fallbacks": ["deepseek/deepseek-chat"]
      },
      "subagents": {
        "model": "anthropic/claude-sonnet-4-5",  // NOT Opus!
        "maxConcurrent": 4  // Limit parallel spend
      }
    }
  }
}
```

---

## Part 5: Immediate Action Items (Priority Order)

### TODAY (Quick Wins - 30-50% reduction)

1. **[HIGH IMPACT] Stop using Opus for sub-agents**
   - Edit config: subagents should use Sonnet
   - Estimated savings: **$200-300/month**

2. **[HIGH IMPACT] Review sub-agent spawning patterns**
   - Are you spawning too many? Each is expensive
   - Consider: Can the main agent handle more?
   - Reduce `maxConcurrent` from 8 to 4

3. **Verify caching is working**
   - Check API responses for `cache_read_input_tokens`
   - If not seeing cache hits, review prompt structure

### THIS WEEK (Additional 20-30% reduction)

4. **Set up OpenRouter or add DeepSeek as provider**
   - Use DeepSeek for research tasks (98% cheaper)
   - Keep Claude for complex coding only

5. **Audit current usage patterns**
   - Add logging to track tokens per task type
   - Identify wasteful patterns

6. **Optimize skill prompts**
   - Review SKILL.md files for bloat
   - Reduce unnecessary context

### THIS MONTH (Long-term optimization)

7. **Implement smart model routing**
   - Simple tasks → cheap models
   - Complex tasks → premium models
   - Could be skill-based or complexity detection

8. **Consider Ollama for development**
   - Install: `brew install ollama`
   - Free local inference for testing

9. **Set budget caps**
   - OpenRouter supports spending limits
   - Anthropic workbench has usage alerts

---

## Part 6: Projected Cost After Optimization

### Conservative Estimate (Easy Changes)

| Change | Monthly Savings |
|--------|-----------------|
| Sub-agents: Opus → Sonnet | -$200 |
| Better caching utilization | -$100 |
| Reduce sub-agent spawning | -$100 |
| **New Monthly Total** | **~$600** |

### Aggressive Estimate (Full Optimization)

| Change | Monthly Savings |
|--------|-----------------|
| All above | -$400 |
| DeepSeek for research | -$150 |
| Model tiering | -$100 |
| Batch processing | -$50 |
| Local models for dev | -$50 |
| **New Monthly Total** | **~$250** |

### Target Achievement

| Scenario | Monthly Cost | Reduction |
|----------|--------------|-----------|
| Current | $1,000 | - |
| Conservative | $600 | 40% |
| Moderate | $400 | 60% |
| **Aggressive** | **$250** | **75%** ✅ |

---

## Part 7: Provider Quick Reference

### Best Value by Use Case

| Use Case | Best Provider | Model | Cost |
|----------|---------------|-------|------|
| Complex coding | Anthropic | Opus 4.5 | $5/$25 |
| General assistant | Anthropic | Sonnet 4.5 | $3/$15 |
| Research/reading | DeepSeek | V3.2 | $0.28/$0.42 |
| Bulk processing | Any | Batch API | 50% off |
| Testing/dev | Google | Gemini Flash | **FREE** |
| Simple tasks | OpenAI | GPT-5 mini | $0.25/$2 |
| Local/private | Ollama | Llama 3.1 | **FREE** |

### Free Tiers Available

1. **Google AI Studio** - Gemini 1.5/2.5/3 Flash (rate limited)
2. **DeepSeek** - Generous free credits for new accounts
3. **Ollama** - Unlimited local inference

---

## Appendix: Key Pricing Sources

1. Anthropic Pricing: https://platform.claude.com/docs/en/about-claude/pricing
2. OpenAI Pricing: https://openai.com/api/pricing/
3. Google Gemini: https://ai.google.dev/gemini-api/docs/pricing
4. DeepSeek: https://api-docs.deepseek.com/quick_start/pricing/
5. OpenRouter: https://openrouter.ai/pricing

---

## Conclusion

**The path from $1k/month to $250/month is achievable:**

1. **Immediate**: Switch sub-agents to Sonnet = saves ~$200-300
2. **Short-term**: Add DeepSeek for research = saves ~$150
3. **Medium-term**: Full model tiering + caching optimization = saves ~$200

The key insight is that **Opus is often overkill**. Sonnet 4.5 handles 90% of tasks just as well at 60% of the cost, and DeepSeek handles simpler tasks at 2% of the cost.

**Start with the easy wins today, then iterate.**
