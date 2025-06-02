import {createAsyncThunk} from "@reduxjs/toolkit";
import {addToCartAPI, getUsersCartItemsAPI, removeFromCart, resetCartAPI, updateCartAPI} from "@src/redux/api/cartAPI";
import {tokenService} from "@src/services/tokenService.js";
import {setSelectedRestaurant} from "@src/redux/slices/restaurantSlice.js";
import {getListingsThunk, getRestaurantThunk} from "@src/redux/thunks/restaurantThunks.js";

/**
 * Thunk to fetch the user's cart items.
 */
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, {dispatch, getState, rejectWithValue}) => {
        const token = await tokenService.getToken();
        if (!token) {
            return rejectWithValue("Authentication token is missing.");
        }
        try {
            const cartItems = await getUsersCartItemsAPI(token);

            // Set selected restaurant if cart has items
            if (cartItems && cartItems.length > 0) {
                const restaurantId = cartItems[0].restaurant_id;
                const state = getState();
                const restaurantsProximity = state.restaurant.restaurantsProximity;

                // Find restaurant in proximity list
                const restaurant = restaurantsProximity.find(r => r.id === restaurantId);
                if (restaurant) {
                    // Set selected restaurant and fetch its details
                    dispatch(setSelectedRestaurant(restaurant));
                    dispatch(getRestaurantThunk(restaurant.id));

                    // Also fetch the restaurant's listings/menu items
                    dispatch(getListingsThunk({ restaurantId }));
                }
            }

            return cartItems;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Thunk to add an item to the cart.
 * Accepts a payload with listing_id and optionally a count (defaults to 1).
 */
export const addItemToCart = createAsyncThunk(
    "cart/addItemToCart",
    async ({payload}, {dispatch, rejectWithValue}) => {
        const token = await tokenService.getToken();
        if (!token) {
            return rejectWithValue("Authentication token is missing.");
        }
        try {
            const response = await addToCartAPI(payload, token);
            // Refresh the cart after adding
            await dispatch(fetchCart());
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Thunk to update the quantity of a cart item.
 */
export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({payload}, {dispatch, rejectWithValue}) => {
        const token = await tokenService.getToken();
        if (!token) {
            return rejectWithValue("Authentication token is missing.");
        }
        try {
            const response = await updateCartAPI(payload, token);
            // Refresh the cart after updating
            await dispatch(fetchCart());
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Thunk to remove an item from the cart.
 */
export const removeItemFromCart = createAsyncThunk(
    "cart/removeItemFromCart",
    async ({listing_id}, {dispatch, rejectWithValue}) => {
        const token = await tokenService.getToken();
        if (!token) {
            return rejectWithValue("Authentication token is missing.");
        }
        try {
            const response = await removeFromCart(listing_id, token);
            await dispatch(fetchCart());
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Thunk to reset (empty) the user's cart.
 */
export const resetCart = createAsyncThunk(
    "cart/resetCart",
    async (_, {dispatch, rejectWithValue}) => {
        const token = await tokenService.getToken();
        if (!token) {
            return rejectWithValue("Authentication token is missing.");
        }
        try {
            const response = await resetCartAPI(token);
            // Refresh the cart after resetting
            await dispatch(fetchCart());
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

