import React from 'react';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import FavoriteRestaurantList from '../../src/components/FavoriteRestaurantList';
import { RestaurantFilterProvider } from '../../src/context/RestaurantFilterContext';

jest.mock("react-slick", () => {
  return ({ children }) => <div data-testid="mock-slider">{children}</div>;
});

const mockStore = configureStore([]);

const renderWithProviders = (ui, { initialState, showClosed = true } = {}) => {
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <RestaurantFilterProvider initialShowClosedRestaurants={showClosed}>
        <MemoryRouter>{ui}</MemoryRouter>
      </RestaurantFilterProvider>
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

    const { container } = renderWithProviders(<FavoriteRestaurantList />, { initialState });
    expect(container.innerHTML).toContain('Favorite Restaurants');
    expect(container.innerHTML).toContain('Testaurant');
  });

  test('shows explore message when no favorite restaurants', () => {
    const initialState = {
      restaurant: {
        favoriteRestaurantsIDs: [],
        restaurantsProximity: [],
      },
    };

    const { container } = renderWithProviders(<FavoriteRestaurantList />, { initialState, showClosed: false });
    expect(container.innerHTML.toLowerCase()).toContain("haven't added any favorite restaurants");
  });

  test('renders explore button', () => {
    const initialState = {
      restaurant: {
        favoriteRestaurantsIDs: [1],
        restaurantsProximity: [restaurantSample],
      },
    };

    renderWithProviders(<FavoriteRestaurantList />, { initialState });

    const link = document.querySelector('a');
    expect(link).not.toBeNull();
  });
});
