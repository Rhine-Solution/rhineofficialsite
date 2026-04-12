---
name: compact
description: Compress conversation history when hitting token limits
---

# Compact Command

Compress conversation history when hitting token limits, optionally hand off to a different agent.

## When to Use
- Long conversation is approaching token limits
- Want to keep the session going with summarized context
- Hand off to continue with a fresh agent

## Usage
```javascript
session({ mode: "compact", agent: "leader", text: "Continue workflow" })
```

## Without Agent Handoff
```javascript
session({ mode: "compact", text: "Continue where we left off" })
```

## Why Use Compact
- Extends session lifespan
- Maintains key context in compressed form
- Allows continuing work without losing progress
- Can optionally switch to different agent

## Best Practices
1. Use before completely hitting token limits
2. Summarize key decisions in the text parameter
3. Can switch agent during compression for fresh perspective