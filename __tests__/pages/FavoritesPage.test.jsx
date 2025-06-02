import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Favorites from '@src/pages/Favorites';
import restaurantReducer from '@src/redux/slices/restaurantSlice';

describe('Favorites Page', () => {
  const renderWithProviders = (ui, {
    preloadedState = {},
    store = configureStore({
      reducer: { restaurant: restaurantReducer },
      preloadedState
    })
  } = {}) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          {ui}
        </MemoryRouter>
      </Provider>
    );
  };

  test('shows loading spinner when loading is true', () => {
    const preloadedState = {
      restaurant: {
        favoriteRestaurantsIDs: [],
        restaurantsProximity: [],
        restaurantsProximityLoading: true
      }
    };

    renderWithProviders(<Favorites />, { preloadedState });
    expect(screen.getByText(/loading your favorites/i)).toBeInTheDocument();
  });

  test('shows empty message when there are no favorites', () => {
    const preloadedState = {
      restaurant: {
        favoriteRestaurantsIDs: [],
        restaurantsProximity: [],
        restaurantsProximityLoading: false
      }
    };

    renderWithProviders(<Favorites />, { preloadedState });
    expect(screen.getByText(/no favorites yet/i)).toBeInTheDocument();
  });

  test('renders favorite restaurants if available', () => {
    const preloadedState = {
      restaurant: {
        favoriteRestaurantsIDs: [1],
        restaurantsProximity: [
          {
            id: 1,
            restaurantName: 'Test Favorite',
            image_url: '',
            category: 'Fast Food',
            rating: 4.2,
            restaurantDescription: 'Tasty and quick meals.',
            distance_km: 2.5,
            delivery: true,
            pickup: true,
            deliveryFee: 5,
            minOrderAmount: 20
          }
        ],
        restaurantsProximityLoading: false
      }
    };

    renderWithProviders(<Favorites />, { preloadedState });
    expect(screen.getByText('Test Favorite')).toBeInTheDocument();
    expect(screen.getByText(/tasty and quick meals/i)).toBeInTheDocument();
  });
});
