# OpenCode Multi-Agent System

This project uses a 9-agent multi-agent system powered by the `opencode-sessions` plugin.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      LEADER (primary)                     │
│         Orchestrates workflow using session tool            │
└───────────────────────────────────┬─────────────────────┘
                                    │
        ┌───────────┬───────────────┬─┴────────┬──────────┐
        │           │             │         │          │         │
   ┌────▼────┐ ┌───▼────┐ ┌────▼▼┐ ┌───▼──┐ ┌───▼──┐
   │researcher│ │architect│ │frontend│ │backend│ │tester │
   └────────┘ └────────┘ └───────┘ └───────┘ └───────┘
        │           │       └──────┬──────┘         │
     ┌───▼───────────────▼──────────────▼──────────▼──────┐
   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
   │security│ │reviewer│ │ devops│
   └────────┘ └────────┘ └────────┘
```

## Agents

| Agent | Mode | Role | Key Tools |
|-------|------|------|---------|
| **leader** | primary | Orchestrator | session (all modes) |
| **researcher** | subagent | Investigation | Read, Glob, Grep |
| **architect** | subagent | Design | Read, Glob, Grep |
| **frontend** | subagent | UI Implementation | Write, Edit, Read, Glob, Grep |
| **backend** | subagent | API Implementation | Write, Edit, Read, Glob, Grep |
| **tester** | subagent | Testing | Write, Edit, Bash, Read, Glob |
| **security** | subagent | Security | Read, Grep, Glob |
| **devops** | subagent | Deployment | Write, Edit, Bash, Read, Glob |
| **reviewer** | subagent | Code Review | Read, Grep, Glob |

## Session Tool Modes

The **leader** agent (and other primary agents) get a `session` tool with 4 modes:

### 1. fork - Parallel Exploration
```javascript
session({ mode: "fork", agent: "frontend", text: "Design UI approach A" })
session({ mode: "fork", agent: "frontend", text: "Design UI approach B" })
```

### 2. message - Agent Handoff
```javascript
session({ mode: "message", agent: "researcher", text: "Investigate auth" })
```

### 3. new - Clean Phase
```javascript
session({ mode: "new", agent: "architect", text: "Design based on research" })
```

### 4. compact - Compress History
```javascript
session({ mode: "compact", agent: "leader", text: "Continue workflow" })
```

## Workflow Phases

```
research → design → implement → test → security → review → deploy
```

## Configuration

- **JSON Config**: `opencode.json` - Contains all 9 agent definitions
- **Markdown Agents**: `.opencode/agents/*.md` - Individual agent files
- **Commands**: `.opencode/commands/*.md` - Session tool documentation

## Usage

1. Start opencode in the project directory
2. The leader agent will be selected by default
3. Use session tool to delegate tasks to other agents:
   - `session({ mode: "message", agent: "researcher", text: "Investigate..." })`
4. Other agents will pick up tasks and use session to pass to next agents

## Files

- `opencode.json` - Main configuration (plugin + agents)
- `.opencode/agents/` - Individual agent markdown files
- `.opencode/commands/` - Session tool documentation
- `.opencode/prompts/` - This documentation