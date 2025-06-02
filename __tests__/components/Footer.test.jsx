import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../src/components/Footer';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Footer component', () => {
  test('renders FreshDeal logo', () => {
    renderWithRouter(<Footer />);
    const logo = screen.getByAltText(/FreshDeal Logo/i);
    expect(logo).toBeInTheDocument();
  });

  test('renders social media links', () => {
    renderWithRouter(<Footer />);
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
  });
});
