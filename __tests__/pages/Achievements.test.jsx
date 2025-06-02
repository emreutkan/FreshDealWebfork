import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Achievements from '../../src/pages/Achievements';

jest.mock('../../src/redux/thunks/achievementThunks', () => ({
  fetchUserAchievementsThunk: jest.fn(() => ({ type: 'MOCK_ACTION' }))
}));


const reducer = () => ({
  user: {
    achievements: [
      {
        id: 1,
        name: 'İlk Alışveriş',
        description: 'İlk siparişini verdin!',
        earned_at: '2025-01-01T00:00:00.000Z',
        achievement_type: 'FIRST_PURCHASE'
      },
      {
        id: 2,
        name: 'Test Kilitli',
        description: 'Bu başarı kilitli.',
        earned_at: null,
        achievement_type: 'STREAK',
        threshold: 5
      }
    ],
    loading: false
  }
});

import { createStore } from 'redux';

const renderWithStore = (ui) => {
  const store = createStore(reducer);
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe('Achievements Component', () => {
  test('renders unlocked achievement', () => {
    renderWithStore(<Achievements />);
    expect(screen.getByText('İlk Alışveriş')).toBeInTheDocument();
    expect(screen.getByText('İlk siparişini verdin!')).toBeInTheDocument();
    expect(screen.getByText(/Earned on/i)).toBeInTheDocument();
  });

  test('renders locked achievement with threshold', () => {
    renderWithStore(<Achievements />);
    expect(screen.getByText('Test Kilitli')).toBeInTheDocument();
    expect(screen.getByText('Bu başarı kilitli.')).toBeInTheDocument();
    expect(screen.getByText(/Goal: 5/)).toBeInTheDocument();
  });
});
