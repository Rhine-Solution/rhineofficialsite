import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      signOut: vi.fn(),
      refreshSession: vi.fn(),
    },
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial state with loading true', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.initialized).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should set user when session exists', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: { session: mockSession as any },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.initialized).toBe(true);
  });

  it('should call signOut', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });
    vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('should handle signOut error', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });
    const mockError = { message: 'Sign out failed', name: 'AuthError', code: 'auth_error', status: 400, __isAuthError: true } as any;
    vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({
      error: mockError,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(result.current.signOut()).rejects.toThrow();
    });
  });
});
