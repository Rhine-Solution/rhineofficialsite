---
name: new
description: Start a fresh session for clean phase transitions
---

# New Command

Start a fresh session for clean phase transitions with no context bleed.

## When to Use
- Moving from research to planning phase
- Starting implementation with fresh context
- Clean transitions between workflow phases

## Usage
```javascript
session({ mode: "new", agent: "architect", text: "Design based on research findings" })
```

## Workflow Phase Transitions

### Research → Design
```javascript
session({ mode: "new", agent: "architect", text: "Create design document" })
```

### Design → Implementation
```javascript
session({ mode: "new", agent: "frontend", text: "Implement the UI design" })
session({ mode: "new", agent: "backend", text: "Implement the API design" })
```

### Implementation → Testing
```javascript
session({ mode: "new", agent: "tester", text: "Test the implementation" })
```

## Why Use New Mode
- Prevents context bleed from previous phases
- Fresh start for new workflow stage
- Cleaner conversations per phase
- Easier to track progress