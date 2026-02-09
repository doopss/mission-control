# Prompt Caching - Key Insights

**Source:** https://claude.com/blog/prompt-caching

## What It Does
Caches frequently used context between API calls, reducing costs and latency for long prompts.

## Benefits
- **Cost reduction:** Up to 90% on cached content
- **Latency reduction:** Up to 85% (time to first token)
- **Available on:** Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku

## Pricing (Sonnet 4 Example)
- **Base input:** $3/MTok
- **Cache write:** $3.75/MTok (25% premium, one-time)
- **Cache read:** $0.30/MTok (90% discount!)

## Perfect For OpenClaw
OpenClaw is an ideal use case for prompt caching:
- **Long system prompts:** AGENTS.md, SOUL.md, USER.md, TOOLS.md loaded every session
- **Static context:** These files change infrequently
- **Multi-turn conversations:** Same context re-sent with every message
- **Memory files:** Can cache recent memory/*.md files that are referenced repeatedly

## Use Cases
1. **Conversational agents** - Long instructions, extended conversations
2. **Coding assistants** - Codebase context for autocomplete/Q&A
3. **Large document processing** - Full documents/images in prompt
4. **Detailed instructions** - Dozens of examples, procedures
5. **Agentic tool use** - Multiple rounds requiring new API calls
6. **Knowledge base chat** - Embed entire documents for Q&A

## Real-World Performance
| Use Case | Without Caching | With Caching | Cost Savings |
|----------|----------------|--------------|--------------|
| Chat with book (100K tokens) | 11.5s | 2.4s (-79%) | -90% |
| Many-shot prompting (10K) | 1.6s | 1.1s (-31%) | -86% |
| 10-turn conversation | ~10s | ~2.5s (-75%) | -53% |

## Strategy for HueleBicho
- Cache workspace bootstrap files (AGENTS.md, SOUL.md, etc.)
- Cache recent memory files during active sessions
- Massive savings on multi-turn conversations
- Faster response times (critical for UX)

## Action Items
- [ ] Check if OpenClaw supports prompt caching natively
- [ ] If not, investigate how to enable it via Anthropic API
- [ ] Consider caching strategy for long sessions
- [ ] Monitor token usage before/after to measure impact
