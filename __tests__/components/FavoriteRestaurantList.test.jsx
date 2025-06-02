import React from 'react';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import FavoriteRestaurantList from '../../src/components/FavoriteRestaurantList';

jest.mock("react-slick", () => {
  return ({ children }) => <div data-testid="mock-slider">{children}</div>;
});

const mockStore = configureStore([]);

const renderWithProviders = (ui, { initialState }) => {
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe('FavoriteRestaurantList', () => {
  const restaurantSample = {
    id: 1,
    restaurantName: 'Testaurant',
    image_url: 'https://example.com/image.jpg',
    rating: 4.5,
    listings: 3,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHoursStart: '08:00',
    workingHoursEnd: '22:00'
  };

  test('renders favorite restaurants when available', () => {
    const initialState = {
      restaurant: {
        favoriteRestaurantsIDs: [1],
        restaurantsProximity: [restaurantSample],
      },
    };

    renderWithProviders(<FavoriteRestaurantList />, { initialState });

    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('Testaurant')).toBeInTheDocument();
    expect(screen.getByTestId('mock-slider')).toBeInTheDocument();
  });

  test('returns null when no favorite restaurants', () => {
    const initialState = {
      restaurant: {
        favoriteRestaurantsIDs: [],
        restaurantsProximity: [],
      },
    };

    const { container } = renderWithProviders(<FavoriteRestaurantList />, { initialState });
    expect(container.firstChild).toBeNull();
  });

  test('renders action buttons', () => {
    const initialState = {
      restaurant: {
        favoriteRestaurantsIDs: [1],
        restaurantsProximity: [restaurantSample],
      },
    };

    renderWithProviders(<FavoriteRestaurantList />, { initialState });

    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '' })).toHaveAttribute('href', '/favorites');
  });
});
