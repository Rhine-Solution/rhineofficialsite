import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchModal from '../../components/SearchModal';

const renderSearchModal = (isOpen = true) => {
  return render(
    <BrowserRouter>
      <SearchModal isOpen={isOpen} onClose={vi.fn()} />
    </BrowserRouter>
  );
};

describe('SearchModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders search input when open', () => {
      renderSearchModal(true);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      renderSearchModal(false);
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    });
  });

  describe('Results Display', () => {
    it('displays search results when opened', () => {
      renderSearchModal();
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });
});
