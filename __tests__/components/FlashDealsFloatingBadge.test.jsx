import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FlashDealsFloatingBadge from '../../src/components/FlashDealsFloatingBadge';

describe('FlashDealsFloatingBadge', () => {
  test('renders with correct text and icon', () => {
    render(<FlashDealsFloatingBadge onClick={() => {}} />);
    
    expect(screen.getByText('Flash Deals')).toBeInTheDocument();
    expect(document.querySelector('.bi-lightning-fill')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<FlashDealsFloatingBadge onClick={handleClick} />);

    const badge = screen.getByText('Flash Deals').parentElement;
    fireEvent.click(badge);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
