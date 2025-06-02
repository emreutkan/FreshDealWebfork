import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from '../../src/components/CategoryFilter';

describe('CategoryFilter', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  test('renders all category buttons', () => {
    render(
      <CategoryFilter selectedCategory="All Categories" onSelectCategory={mockOnSelect} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(10);

    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('Baked Goods')).toBeInTheDocument();
    expect(screen.getByText('Organic Products')).toBeInTheDocument();
  });

  test('highlights the selected category', () => {
    render(
      <CategoryFilter selectedCategory="Fruits & Vegetables" onSelectCategory={mockOnSelect} />
    );

    const selectedButton = screen.getByText('Fruits & Vegetables');
    expect(selectedButton).toHaveStyle('background-color: #50703C');
    expect(selectedButton).toHaveStyle('color: #fff');
  });

  test('calls onSelectCategory when a category is clicked', () => {
    render(
      <CategoryFilter selectedCategory="All Categories" onSelectCategory={mockOnSelect} />
    );

    const button = screen.getByText('Meat & Seafood');
    fireEvent.click(button);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith('Meat & Seafood');
  });
});
