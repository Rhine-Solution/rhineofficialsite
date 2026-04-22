# Contributing Guide

## Code Style Guidelines

### JavaScript/React
- Use functional components with hooks
- Prefer arrow functions for simple functions
- Use async/await over .then() chains
- Avoid console.log in production code

### File Naming
- Components: PascalCase (e.g., Navbar.js, Button.js)
- Hooks: camelCase with "use" prefix (useDebounce.js)
- Utils: camelCase (supabase.js)
- Pages: kebab-case (page.js, my-page.js)

### Component Patterns

```javascript
// Prefer this pattern:
export default function ComponentName() {
  const [state, setState] = useState(initial)

  // Hooks first
  useEffect(() => {
    // side effects
  }, [])

  // Event handlers
  const handleClick = () => { }

  // Render
  return (
    <div>...</div>
  )
}

// Not: class components, this.setState
```

### Import Order
1. React/Next imports
2. Third-party components
3. Local components
4. Hooks/utils
5. Styles (if any)

```javascript
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { formatDate } from '../lib/utils'
```

## Git Workflow

### Branch Naming
- `feature/` - New features (feature/add-checkout)
- `fix/` - Bug fixes (fix/mobile-menu)
- `docs/` - Documentation (docs/api-reference)
- `chore/` - Maintenance (chore/update-deps)

### Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
refactor: Code refactoring
chore: Maintenance
```

### PR Process
1. Create branch from main
2. Make changes with clear commits
3. Test locally: npm run build
4. Push and create PR
5. Request review
6. Address feedback
7. Merge when approved

## PR Checklist

- [ ] Tests pass (if applicable)
- [ ] Build succeeds: `npm run build`
- [ ] No console.log statements
- [ ] No hardcoded credentials
- [ ] Environment variables documented
- [ ] Mobile responsive tested
- [ ] Works in both light and dark mode

## Component Development

### Creating New Component
1. Determine type: UI / Layout / Feature / Admin
2. Create in appropriate folder
3. Add JSDoc comments for props
4. Export as default or named
5. Add to documentation

### Props Documentation
```javascript
/**
 * Primary button component
 * @param {string} variant - 'primary' | 'secondary' | 'outline'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} disabled - Disable button
 * @param {string} children - Button content
 */
```

## Database Changes

### Adding New Table
1. Add to scripts/schema.sql
2. Add RLS policies
3. Create migration in Supabase
4. Update docs/04-database-schema.md

### Modifying Existing Table
1. Create migration in Supabase
2. Update schema.sql if needed
3. Test in development first
4. Backup production data

## API Route Development

### Pattern
```javascript
// app/api/endpoint/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    // Validate request
    const body = await request.json()

    // Process
    const result = await processData(body)

    // Respond
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

## Getting Help

- Check existing issues in GitHub
- Review documentation in docs/
- Ask in PR comments
- Reference lessons-learned.md for common problems