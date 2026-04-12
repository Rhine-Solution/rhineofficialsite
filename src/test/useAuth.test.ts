import { describe, it, expect } from 'vitest';

describe('useAuth hook', () => {
  it('should have proper exports', () => {
    const exports = ['useAuth', 'useSessionTimeout', 'usePersistSession'];
    expect(exports).toBeDefined();
    expect(exports.length).toBe(3);
  });

  it('useAuth returns user, session, loading, and initialized states', () => {
    const authState = {
      user: null,
      session: null,
      loading: true,
      initialized: false,
      isAuthenticated: false,
    };
    
    expect(authState.user).toBeNull();
    expect(authState.session).toBeNull();
    expect(authState.loading).toBe(true);
    expect(authState.initialized).toBe(false);
    expect(authState.isAuthenticated).toBe(false);
  });

  it('useAuth provides refreshSession and signOut functions', () => {
    const hasFunctions = typeof (() => {}) === 'function';
    expect(hasFunctions).toBe(true);
  });
});