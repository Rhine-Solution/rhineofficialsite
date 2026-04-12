---
name: message
description: Hand off work to another agent in the same conversation
---

# Message Command

Primary agents hand work to each other in the same conversation for collaboration.

## When to Use
- Research → Planning handoff
- Implementation → Review handoff
- Design → Implementation handoff

## Important Note
NOT recommended for agents using different providers.

## Usage
```javascript
session({ mode: "message", agent: "researcher", text: "Research API approaches" })
```

## Example Workflows

### Research → Plan
```javascript
session({ mode: "message", agent: "plan", text: "Design rate limiting based on this research" })
```

### Build → Review
```javascript
session({ mode: "message", agent: "reviewer", text: "Review this authentication implementation" })
```

### Implement → Test
```javascript
session({ mode: "message", agent: "tester", text: "Test the new feature" })
```

## Common Patterns
1. **implement → review**: Build agent implements, hands to reviewer for feedback
2. **research → plan**: Researcher gathers info, hands to planner for design
3. **test → security**: Tester validates, hands to security for review