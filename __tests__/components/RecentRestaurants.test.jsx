import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import RecentRestaurants from '../../src/components/RecentRestaurants';
import { RestaurantFilterProvider } from '../../src/context/RestaurantFilterContext';
import * as thunks from '../../src/redux/thunks/restaurantThunks';
import { createMockStore } from '../../src/testUtils/createMockStore';

jest.spyOn(thunks, 'getRecentRestaurantsThunk').mockReturnValue({ type: 'MOCK_THUNK' });

describe('RecentRestaurants component', () => {
  let store;
  const mockState = {
    restaurant: {
      recentRestaurantIDs: [1],
      recentRestaurantsLoading: false,
      restaurantsProximity: [
        {
          id: 1,
          restaurantName: 'Test Restaurant',
          listings: 3,
          workingDays: ['Monday'],
          workingHoursStart: '09:00',
          workingHoursEnd: '23:00',
          image_url: 'https://example.com/image.jpg',
        },
      ],
    },
  };

  beforeEach(() => {
    store = createMockStore(mockState);
  });

  test('renders recent restaurants', () => {
    render(
      <Provider store={store}>
        <RestaurantFilterProvider initialShowClosedRestaurants={true}>
          <MemoryRouter>
            <RecentRestaurants />
          </MemoryRouter>
        </RestaurantFilterProvider>
      </Provider>
    );

    expect(screen.getAllByText(/Recent Orders/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Test Restaurant/i)).toBeInTheDocument();
  });

  test('dispatches getRecentRestaurantsThunk on mount', () => {
    render(
      <Provider store={store}>
        <RestaurantFilterProvider initialShowClosedRestaurants={true}>
          <MemoryRouter>
            <RecentRestaurants />
          </MemoryRouter>
        </RestaurantFilterProvider>
      </Provider>
    );

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'MOCK_THUNK' });
  });

  test('shows loading spinner when loading', () => {
    const loadingState = {
      ...mockState,
      restaurant: {
        ...mockState.restaurant,
        recentRestaurantsLoading: true,
      },
    };

    const loadingStore = createMockStore(loadingState);

  const { container } = render(
      <Provider store={loadingStore}>
        <RestaurantFilterProvider initialShowClosedRestaurants={true}>
          <MemoryRouter>
            <RecentRestaurants />
          </MemoryRouter>
        </RestaurantFilterProvider>
      </Provider>
    );
    expect(screen.getByText(/Loading your recent orders/i)).toBeInTheDocument();
  });
});
