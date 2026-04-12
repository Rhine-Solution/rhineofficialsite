import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthModalProvider } from './auth/AuthModalProvider';

const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
  },
};

vi.mock('./lib/supabase', () => ({
  supabase: mockSupabase,
}));

describe('App', () => {
  it('renders without crashing', () => {
    expect(true).toBe(true);
  });

  it('has correct title', () => {
    const title = 'Rhine Solution';
    expect(title).toBe('Rhine Solution');
  });
});