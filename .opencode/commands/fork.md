---
name: fork
description: Spawn parallel sessions to explore different approaches
---

# Fork Command

Spawns parallel sessions to explore different approaches with full conversational context.

## When to Use
- Architectural exploration (different designs in parallel)
- Multiple implementation approaches to evaluate
- Comparing solutions before deciding

## Usage
```javascript
session({ mode: "fork", agent: "frontend", text: "Design UI approach A" })
session({ mode: "fork", agent: "frontend", text: "Design UI approach B" })
session({ mode: "fork", agent: "frontend", text: "Design UI approach C" })
```

## Example
User: "I need to decide between microservices, monolith, and serverless for this project"

Agent calls fork 3 times:
```javascript
session({ mode: "fork", agent: "architect", text: "Design as microservices" })
session({ mode: "fork", agent: "architect", text: "Design as modular monolith" })
session({ mode: "fork", agent: "architect", text: "Design as serverless" })
```

Then user can switch between sessions, discuss trade-offs with each, and pick the best approach.