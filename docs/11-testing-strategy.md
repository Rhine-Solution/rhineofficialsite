# Testing Strategy

## Current State

- **Jest Configured**: Yes - jest.setup.js, jsdom environment
- **Test Files**: 0 (none exist yet)
- **Coverage**: 0%

## Test Infrastructure

```javascript
// jest.setup.js exists
// jsdom testEnvironment
// moduleNameMapper for @/ paths
// Transform ignore patterns for Stripe, Supabase
```

## What Should Be Tested

### Priority 1: Critical Paths
- [ ] User registration flow
- [ ] User login/logout
- [ ] Add to cart
- [ ] Checkout flow (mocked)
- [ ] Authentication redirect

### Priority 2: Core Features
- [ ] Search functionality
- [ ] Wishlist add/remove
- [ ] Order creation
- [ ] Profile update

### Priority 3: Edge Cases
- [ ] Empty cart handling
- [ ] Invalid form inputs
- [ ] Network error states
- [ ] Rate limiting behavior

## How to Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## Recommended Testing Roadmap

### Phase 1: Unit Tests
- Custom hooks (useDebounce, useRecentlyViewed)
- Utility functions (generate-invoice.js)
- Helper functions

### Phase 2: Component Tests
- Button component variants
- Card rendering
- Form input validation

### Phase 3: Integration Tests
- Auth flow (with mock Supabase)
- Cart operations
- Search functionality

## Testing Libraries Available

- jest (test runner)
- @testing-library/react (component testing)
- @testing-library/user-event (simulate user actions)
- @testing-library/jest-dom (DOM matchers)

## Mock Strategies

### Supabase
- Mock createClient and responses
- Use test database for integration tests

### Stripe
- Mock checkout session creation
- Test success/failure redirects

### Next.js
- Mock useRouter
- Mock usePathname