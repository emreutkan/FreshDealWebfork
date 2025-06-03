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
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(addItemToCart.pending, (state, action) => {
                state.loading = true;
                state.error = null;

                // Optimistic update - add item to cart immediately
                const listingId = action.meta.arg.payload.listing_id;
                const existingItemIndex = state.cartItems.findIndex(item => item.listing_id === listingId);

                if (existingItemIndex >= 0) {
                    // Item exists, increment count
                    state.cartItems[existingItemIndex].count += 1;
                } else {
                    // Add new item with count 1
                    // We'll add minimal information that we know now, backend will update with complete info
                    state.cartItems.push({
                        listing_id: listingId,
                        count: 1,
                        _optimistic: true, // Flag to identify this is an optimistic update
                    });
                }
            })
            .addCase(addItemToCart.fulfilled, (state) => {
                state.loading = false;
                // The fetchCart will be called after this action and will update the cart with actual data
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

                // Revert optimistic update on failure
                const listingId = action.meta.arg.payload.listing_id;
                state.cartItems = state.cartItems.filter(item =>
                    !(item.listing_id === listingId && item._optimistic) // Remove optimistic items
                );

                // If it was an increment, decrement it back
                const existingItem = state.cartItems.find(item => item.listing_id === listingId && !item._optimistic);
                if (existingItem && existingItem.count > 1) {
                    existingItem.count -= 1;
                }
            })


            .addCase(updateCartItem.pending, (state, action) => {
                state.loading = true;
                state.error = null;

                // Optimistic update for item quantity
                const { listing_id, count } = action.meta.arg.payload;
                const existingItemIndex = state.cartItems.findIndex(item => item.listing_id === listing_id);

                if (existingItemIndex >= 0) {
                    // Store previous count for potential rollback
                    const previousCount = state.cartItems[existingItemIndex].count;
                    state.cartItems[existingItemIndex]._previousCount = previousCount;

                    // Update to new count
                    state.cartItems[existingItemIndex].count = count;
                }
            })
            .addCase(updateCartItem.fulfilled, (state) => {
                state.loading = false;
                // Remove temp data used for rollback
                state.cartItems.forEach(item => {
                    if (item._previousCount !== undefined) {
                        delete item._previousCount;
                    }
                });
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

                // Rollback on failure
                const { listing_id } = action.meta.arg.payload;
                const existingItemIndex = state.cartItems.findIndex(item => item.listing_id === listing_id);

                if (existingItemIndex >= 0 && state.cartItems[existingItemIndex]._previousCount !== undefined) {
                    // Restore previous count
                    state.cartItems[existingItemIndex].count = state.cartItems[existingItemIndex]._previousCount;
                    delete state.cartItems[existingItemIndex]._previousCount;
                }
            })


            .addCase(removeItemFromCart.pending, (state, action) => {
                state.loading = true;
                state.error = null;

                // Optimistic update - remove item immediately
                const listingId = action.meta.arg.listing_id;

                // Keep a copy of the removed item for potential rollback
                const removedItemIndex = state.cartItems.findIndex(item => item.listing_id === listingId);
                if (removedItemIndex >= 0) {
                    state._removedItem = {...state.cartItems[removedItemIndex]};
                    state.cartItems = state.cartItems.filter(item => item.listing_id !== listingId);
                }
            })
            .addCase(removeItemFromCart.fulfilled, (state) => {
                state.loading = false;
                // Clean up stored item on success
                if (state._removedItem) {
                    delete state._removedItem;
                }
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

                // Restore removed item on failure
                if (state._removedItem) {
                    state.cartItems.push(state._removedItem);
                    delete state._removedItem;
                }
            })


            .addCase(resetCart.pending, (state) => {
                state.loading = true;
                state.error = null;

                // Keep backup of current cart for potential rollback
                state._backupCartItems = [...state.cartItems];

                // Optimistic update - clear cart immediately
                state.cartItems = [];
            })
            .addCase(resetCart.fulfilled, (state) => {
                state.loading = false;
                // Clean up backup on success
                delete state._backupCartItems;
            })
            .addCase(resetCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

                // Restore cart items on failure
                if (state._backupCartItems) {
                    state.cartItems = state._backupCartItems;
                    delete state._backupCartItems;
                }
            });
    },
});


export default cartSlice.reducer;

