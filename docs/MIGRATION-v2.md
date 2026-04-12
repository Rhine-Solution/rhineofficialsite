# Migration Guide: v1.0 to v2.0

## Overview

This guide helps you migrate from the initial setup to the optimized version with all Phase 51-62 improvements.

## Breaking Changes

### 1. Component Imports
**Before:**
```typescript
import Skeleton from '../components/Skeleton';
```

**After:**
```typescript
import { Skeleton, SkeletonCard, SkeletonGrid } from '../components/ui/Skeleton';
```

### 2. Hook Names
**Before:**
```typescript
import useSearch from '../hooks/useSearch';
```

**After:**
```typescript
import { useSearch, useAdvancedSearch } from '../lib/search';
```

### 3. Auth Modal Import
**Before:**
```typescript
import AuthModal from './AuthModal';
```

**After:**
```typescript
import AuthModal from '../auth/AuthModal';
```

## New Features

### 1. Lazy Loading
Routes are now lazy-loaded by default. No changes needed.

### 2. Optimized Images
**Before:**
```html
<img src={src} alt={alt} />
```

**After:**
```tsx
import { OptimizedImage } from '../components/ui/OptimizedImage';

<OptimizedImage src={src} alt={alt} className="w-full" />
```

### 3. Skeleton Screens
**Before:**
```tsx
{isLoading ? <div>Loading...</div> : <Content />}
```

**After:**
```tsx
import { SkeletonGrid } from '../components/ui/Skeleton';

{isLoading ? <SkeletonGrid count={3} /> : <Content />}
```

### 4. Prefetch Routes
```tsx
import { usePrefetch } from '../hooks/usePrefetch';

const { prefetch } = usePrefetch();

<a 
  href="/about"
  onMouseEnter={() => prefetch('/about')}
>
  About
</a>
```

## API Changes

### Security Module
**Before:**
```typescript
import { sanitize } from '../utils/security';
sanitize(input);
```

**After:**
```typescript
import { sanitizeInput } from '../lib/security';
sanitizeInput(input);
```

### Analytics
**Before:**
```typescript
import { track } from '../utils/analytics';
track('event', { prop: value });
```

**After:**
```typescript
import { trackEvent } from '../lib/analytics';
trackEvent('event', { prop: value });
```

## Testing Changes

### Test File Locations
Tests moved from `src/__tests__` to `src/test/`:

```
src/
├── test/
│   ├── components/
│   │   └── *.test.tsx
│   ├── hooks/
│   │   └── *.test.ts
│   └── utils/
│       └── *.test.ts
```

## Performance Improvements

### Bundle Changes
- Three.js is now lazy-loaded
- Dashboard reduced by 55%
- New `three-scene` chunk for 3D code

### CSS Changes
- No breaking changes to styling
- Tailwind config unchanged

## Recommended Updates

### 1. Update imports
Search and replace:
- `from '../components/Skeleton'` → `from '../components/ui/Skeleton'`
- `from '../utils/security'` → `from '../lib/security'`

### 2. Update hook usage
```typescript
// Add setHue to useThemeHue destructuring
const { themeColor, hue, setHue } = useThemeHue();
```

### 3. Update test imports
```typescript
// Old pattern
import { render } from '@testing-library/react';

// New pattern (same)
import { render } from '@testing-library/react';
```

## Need Help?

- Check [docs/API.md](./API.md) for API documentation
- Check [PHASES-51-70.md](./PHASES-51-70.md) for feature details
- Run `npm run build` to verify changes
