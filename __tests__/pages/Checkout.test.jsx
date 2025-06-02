import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Checkout from '@src/pages/Checkout';
import cartReducer from '@src/redux/slices/cartSlice';
import restaurantReducer from '@src/redux/slices/restaurantSlice';
import addressReducer from '@src/redux/slices/addressSlice';
import { MemoryRouter } from 'react-router-dom';

describe('Checkout Page', () => {
  const renderWithProviders = (ui, {
    preloadedState = {},
    store = configureStore({
      reducer: {
        cart: cartReducer,
        restaurant: restaurantReducer,
        address: addressReducer
      },
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

  test('completes purchase successfully and shows success screen', async () => {
    const preloadedState = {
      cart: {
        cartItems: [
          { listing_id: 1, restaurant_id: 101, count: 2 }
        ]
      },
      restaurant: {
        selectedRestaurant: {
          id: 101,
          restaurantName: 'Test Restaurant',
          workingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          workingHoursStart: '00:00',
          workingHoursEnd: '23:59',
          deliveryFee: 10,
          flash_deals_available: true
        },
        selectedRestaurantListings: [
          {
            id: 1,
            title: 'Test Dish',
            pick_up_price: 10,
            delivery_price: 12
          }
        ],
        isPickup: true
      },
      address: {
        selectedAddressId: 1,
        addresses: [
          { id: 1, line: 'Example Street' }
        ]
      }
    };

    renderWithProviders(<Checkout />, { preloadedState });

    fireEvent.click(screen.getByText(/Pay Now/i));

    fireEvent.click(screen.getByRole('button', { name: /complete purchase/i }));

    await waitFor(() => {
      expect(screen.getByTestId('checkout-success-icon')).toBeInTheDocument();
    });
  });
});