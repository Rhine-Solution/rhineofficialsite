---
name: workflow
description: Execute multi-agent workflow phases
---

# Workflow Command

Execute multi-agent workflow phases using session tool.

## Default Workflow Phases
research → design → implement → test → security → review → deploy

## Phase Execution

### Phase 1: Research
```javascript
session({ mode: "message", agent: "researcher", text: "Investigate [requirement]" })
```

### Phase 2: Design
```javascript
session({ mode: "message", agent: "architect", text: "Design based on research" })
```

### Phase 3: Implementation (parallel)
```javascript
session({ mode: "fork", agent: "frontend", text: "Implement UI" })
session({ mode: "fork", agent: "backend", text: "Implement APIs" })
```

### Phase 4: Testing
```javascript
session({ mode: "message", agent: "tester", text: "Test implementation" })
```

### Phase 5: Security
```javascript
session({ mode: "message", agent: "security", text: "Security review" })
```

### Phase 6: Review
```javascript
session({ mode: "message", agent: "reviewer", text: "Code review" })
```

### Phase 7: Deploy
```javascript
session({ mode: "message", agent: "devops", text: "Deploy to production" })
```

## Example: Full Feature Workflow
1. Researcher investigates requirements
2. Architect creates design
3. Frontend + Backend implement in parallel
4. Tester validates
5. Security scans
6. Reviewer reviews
7. DevOps deploys