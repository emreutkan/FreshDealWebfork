import React from 'react';
import { render, screen } from '@testing-library/react';
import Cart from '../../src/pages/Cart';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../../src/redux/slices/cartSlice';
import restaurantReducer from '../../src/redux/slices/restaurantSlice';

const createMockThunk = (typePrefix) => {
  const thunkFn = () => ({ type: `${typePrefix}` });
  thunkFn.pending = { type: `${typePrefix}/pending` };
  thunkFn.fulfilled = { type: `${typePrefix}/fulfilled` };
  thunkFn.rejected = { type: `${typePrefix}/rejected` };
  return thunkFn;
};

jest.mock('../../src/redux/thunks/cartThunks', () => ({
  fetchCart: createMockThunk('cart/fetchCart'),
  addItemToCart: createMockThunk('cart/addItemToCart'),
  updateCartItem: createMockThunk('cart/updateCartItem'),
  removeItemFromCart: createMockThunk('cart/removeItemFromCart'),
  resetCart: createMockThunk('cart/resetCart'),
}));

const renderWithProviders = (
  ui,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        cart: cartReducer,
        restaurant: restaurantReducer,
      },
      preloadedState,
    }),
  } = {}
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe('Cart Page', () => {
  it('displays empty cart message', () => {
    const preloadedState = {
      cart: { cartItems: [] },
      restaurant: {
        restaurantsProximity: [],
        selectedRestaurantListings: [],
        isPickup: true,
      },
    };

    renderWithProviders(<Cart />, { preloadedState });

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  it('renders cart items correctly', () => {
    const preloadedState = {
      cart: {
        cartItems: [
          {
            listing_id: 1,
            restaurant_id: 101,
            count: 2,
          },
        ],
      },
      restaurant: {
        restaurantsProximity: [
          { id: 101, restaurantName: 'Test Restaurant', pickup: true, delivery: true, deliveryFee: 10 },
        ],
        selectedRestaurantListings: [
          {
            id: 1,
            title: 'Test Dish',
            description: 'Desc',
            pick_up_price: 10,
            delivery_price: 12,
            original_price: 20,
            count: 5,
            image_url: '',
            fresh_score: 90,
          },
        ],
        isPickup: true,
      },
    };

    renderWithProviders(<Cart />, { preloadedState });

    expect(screen.getByText('Test Dish')).toBeInTheDocument();
    expect(screen.getAllByText(/Subtotal/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Proceed to Checkout/i)).toBeInTheDocument();
  });
});
