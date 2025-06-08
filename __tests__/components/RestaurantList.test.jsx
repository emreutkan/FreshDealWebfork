import React from 'react';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import RestaurantList from '../../src/components/RestaurantList';
import { RestaurantFilterProvider } from '../../src/context/RestaurantFilterContext';

const mockStore = configureStore([]);

describe('RestaurantList', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      restaurant: {
        restaurantsProximity: [],
        restaurantsProximityLoading: false,
        favoriteRestaurantsIDs: [],
      },
      user: {
        token: 'dummy-token',
      },
    });

    store.dispatch = jest.fn();
  });

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <RestaurantFilterProvider>
          <MemoryRouter>
            <RestaurantList />
          </MemoryRouter>
        </RestaurantFilterProvider>
      </Provider>
    );

    expect(screen.getByTestId('restaurant-list-root')).toBeInTheDocument();
  });
});
