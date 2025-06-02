import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorPage from '@src/pages/ErrorPage';

describe('ErrorPage Component', () => {
  test('renders 404 page content', () => {
    render(<ErrorPage />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    expect(screen.getByText(/Oops!/i)).toBeInTheDocument();
    expect(screen.getByText(/The page you're looking for doesn't exist/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go Back/i })).toBeInTheDocument();
  });

  test('calls window.history.back on button click', () => {
    const mockBack = jest.fn();
    const originalBack = window.history.back;
    window.history.back = mockBack;

    render(<ErrorPage />);

    const button = screen.getByRole('button', { name: /Go Back/i });
    fireEvent.click(button);

    expect(mockBack).toHaveBeenCalled();

    window.history.back = originalBack;
  });
});
