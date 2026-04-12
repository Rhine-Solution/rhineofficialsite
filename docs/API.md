# Rhine Solution API Documentation

## Supabase Authentication

### Login
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Register
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});
```

### OAuth Login (Google)
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/dashboard`
  }
});
```

### Reset Password
```typescript
const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`
});
```

### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

---

## Realtime Subscriptions

### Subscribe to Changes
```typescript
import { useRealtime } from './hooks/useRealtime';

const { subscribe } = useRealtime();

subscribe('notifications', (payload) => {
  console.log('Notification received:', payload);
});
```

### Presence
```typescript
const { track, untrack } = useRealtime();

track('online-users', { user_id: '123', name: 'John' });
untrack('online-users');
```

---

## Database Operations

### Fetch Projects
```typescript
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### Create Project
```typescript
const { data, error } = await supabase
  .from('projects')
  .insert({
    title: 'New Project',
    description: 'Project description',
    user_id: userId
  })
  .select()
  .single();
```

### Update Project
```typescript
const { data, error } = await supabase
  .from('projects')
  .update({ title: 'Updated Title' })
  .eq('id', projectId)
  .select()
  .single();
```

### Delete Project
```typescript
const { error } = await supabase
  .from('projects')
  .delete()
  .eq('id', projectId);
```

---

## File Storage

### Upload File
```typescript
const { data, error } = await supabase.storage
  .from('files')
  .upload(`uploads/${Date.now()}-filename`, file);
```

### Download File
```typescript
const { data, error } = await supabase.storage
  .from('files')
  .download('path/to/file');
```

### Delete File
```typescript
const { error } = await supabase.storage
  .from('files')
  .remove(['path/to/file']);
```

---

## Analytics Events

### Track Page View
```typescript
import { trackPageView } from './lib/analytics';

trackPageView('/about');
```

### Track Custom Event
```typescript
import { trackEvent } from './lib/analytics';

trackEvent('button_click', {
  button_name: 'Get Started',
  page: 'homepage'
});
```

---

## Security Functions

### Rate Limiting
```typescript
import { checkRateLimit } from './lib/security';

const allowed = checkRateLimit('user-123', {
  windowMs: 60000,    // 1 minute
  maxRequests: 10     // 10 requests per minute
});
```

### Input Sanitization
```typescript
import { sanitizeInput } from './lib/security';

const safe = sanitizeInput(userInput);
// Removes <script> tags, javascript: URLs, and event handlers
```

### CSRF Token
```typescript
import { generateCSRFToken, validateCSRFToken } from './lib/security';

const token = generateCSRFToken();
// Returns: "base64payload.signature"

const isValid = validateCSRFToken(token.split('.')[0], token);
```

---

## i18n Usage

### Translation Function
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

<h1>{t('welcome')}</h1>
<h2>{t('greeting', { name: 'John' })}</h2>
```

### Change Language
```typescript
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();

i18n.changeLanguage('de'); // Switch to German
```

---

## Web Vitals

### Track Core Web Vitals
```typescript
import { useWebVitals } from './hooks/useWebVitals';

const vitals = useWebVitals();
// vitals: { LCP, FID, CLS, FCP, TTFB }
```

---

## Error Handling

### Error Boundary
```typescript
import ErrorBoundary from './components/ErrorBoundary';

<ErrorBoundary fallback={<CustomErrorPage />}>
  <App />
</ErrorBoundary>
```

### Try-Catch Pattern
```typescript
try {
  const { data } = await someAsyncOperation();
} catch (error) {
  console.error('Operation failed:', error);
  // Handle error gracefully
}
```
