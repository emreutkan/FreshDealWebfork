import {createSlice} from '@reduxjs/toolkit';
import {addItemToCart, fetchCart, removeItemFromCart, resetCart, updateCartItem} from "@src/redux/thunks/cartThunks";

const initialState = {
    cartItems: [],
    isPickup: true,
    cartTotal: 0,
    count: 0,
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase('user/logout', () => {
                return initialState;
            })

            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
                console.log(state.cartItems)
                console.log(action.payload)
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(addItemToCart.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(removeItemFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(removeItemFromCart.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(resetCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetCart.fulfilled, (state) => {
                state.loading = false;
                state.cartItems = [];
            })
            .addCase(resetCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export default cartSlice.reducer;