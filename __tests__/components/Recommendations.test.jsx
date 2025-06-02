import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Recommendations from '../../src/components/Recommendations';

const createMockStore = (initialState) => ({
  getState: () => initialState,
  dispatch: jest.fn(),
  subscribe: jest.fn(),
});

describe('Recommendations component', () => {
  test('shows loading indicator while loading', () => {
    const store = createMockStore({
      recommendation: {
        recommendationIds: [],
        loading: true,
        error: null,
        status: 'loading',
      },
      restaurant: {
        restaurantsProximity: [],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Recommendations />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Recommended For You/i)).toBeInTheDocument();
    expect(screen.getByText(/Finding recommendations/i)).toBeInTheDocument();
  });

  test('renders nothing when there are no recommendations', () => {
    const store = createMockStore({
      recommendation: {
        recommendationIds: [],
        loading: false,
        error: null,
        status: 'succeeded',
      },
      restaurant: {
        restaurantsProximity: [],
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Recommendations />
        </MemoryRouter>
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  test('renders recommended restaurants if available', () => {
    const store = createMockStore({
      recommendation: {
        recommendationIds: [1],
        loading: false,
        error: null,
        status: 'succeeded',
      },
      restaurant: {
        restaurantsProximity: [
          {
            id: 1,
            restaurantName: 'Mock Restaurant',
            listings: 2,
            workingDays: ['Monday'],
            workingHoursStart: '09:00',
            workingHoursEnd: '22:00',
            image_url: '',
          },
        ],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Recommendations />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Mock Restaurant/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Recommended/i).length).toBeGreaterThan(0);
  });
});
