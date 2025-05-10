import {createAsyncThunk} from "@reduxjs/toolkit";
import {addToCartAPI, getUsersCartItemsAPI, removeFromCart, resetCartAPI, updateCartAPI} from "@src/redux/api/cartAPI";
import {tokenService} from "@src/services/tokenService.js";

/**
 * Thunk to fetch the user's cart items.
 */
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, {rejectWithValue}) => {
        const token = await tokenService.getToken();
        if (!token) {
            return rejectWithValue("Authentication token is missing.");
        }
        try {
            return await getUsersCartItemsAPI(token);
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
    async (_, {rejectWithValue}) => {
        const token = await tokenService.getToken();
        if (!token) {
            return rejectWithValue("Authentication token is missing.");
        }
        try {
            return await resetCartAPI(token);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);