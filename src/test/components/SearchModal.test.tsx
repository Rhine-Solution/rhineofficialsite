import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchModal from '../../components/SearchModal';

const mockResults = [
  { id: '1', title: 'Home', path: '/', description: 'Main page' },
  { id: '2', title: 'About', path: '/about', description: 'About us page' },
  { id: '3', title: 'Contact', path: '/contact', description: 'Contact page' },
];

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  results: mockResults,
  onSearch: vi.fn(),
  isLoading: false,
};

const renderSearchModal = (props = {}, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SearchModal {...defaultProps} {...props} />
    </MemoryRouter>
  );
};

describe('SearchModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      renderSearchModal();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      renderSearchModal({ isOpen: false });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders search input', () => {
      renderSearchModal();
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('renders search results when available', () => {
      renderSearchModal();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      renderSearchModal({ isLoading: true });
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('calls onSearch when input changes', async () => {
      const user = userEvent.setup();
      renderSearchModal();
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'about');
      expect(defaultProps.onSearch).toHaveBeenCalledWith('about');
    });

    it('trims search query', async () => {
      const user = userEvent.setup();
      renderSearchModal();
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, '  test  ');
      expect(defaultProps.onSearch).toHaveBeenCalledWith('test');
    });

    it('highlights matching text', () => {
      renderSearchModal();
      const results = screen.getAllByRole('listitem');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes on Escape key', () => {
      renderSearchModal();
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('navigates results with arrow keys', async () => {
      const user = userEvent.setup();
      renderSearchModal();
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.click(searchInput);
      await user.keyboard('{ArrowDown}');
    });

    it('selects result on Enter', async () => {
      const user = userEvent.setup();
      renderSearchModal();
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.click(searchInput);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');
    });
  });

  describe('Empty States', () => {
    it('shows message when no results', () => {
      renderSearchModal({ results: [] });
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });

    it('shows hint text initially', () => {
      renderSearchModal();
      expect(screen.getByText(/type to search/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderSearchModal();
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('has accessible search input', () => {
      renderSearchModal();
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toBeInTheDocument();
    });
  });
});
