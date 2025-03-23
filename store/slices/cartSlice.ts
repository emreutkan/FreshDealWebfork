import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface CartItem {
    id: number;
    listing_id: number;
    title: string;
    price: number;
    count: number;
    added_at: string;
}

interface CartState {
    cartItems: CartItem[];
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cartItems: [],
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        
    }
})

export default cartSlice.reducer;