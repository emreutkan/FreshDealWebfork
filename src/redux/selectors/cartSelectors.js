import { createSelector } from '@reduxjs/toolkit';

// Basic selectors
export const selectCartItems = state => state.cart.cartItems;
export const selectRestaurantsProximity = state => state.restaurant.restaurantsProximity;
export const selectSelectedRestaurantListings = state => state.restaurant.selectedRestaurantListings;
export const selectIsPickup = state => state.restaurant.isPickup;

// Memoized selector for cart data
export const selectCartData = createSelector(
  [selectCartItems, selectRestaurantsProximity, selectSelectedRestaurantListings, selectIsPickup],
  (cartItems, restaurantsProximity, selectedRestaurantListings, isPickup) => ({
    cartItems,
    restaurantsProximity,
    selectedRestaurantListings,
    isPickup
  })
);
