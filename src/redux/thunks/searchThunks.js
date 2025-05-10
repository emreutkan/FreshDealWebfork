import {createAsyncThunk} from "@reduxjs/toolkit";
import {searchApi} from "@src/redux/api/searchAPI";

export const SearchforRestaurantsThunk = createAsyncThunk(
    'search/searchForRestaurants',
    async (payload, {rejectWithValue}) => {
        try {
            return await searchApi.RestaurantSearch(payload);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Search failed");
        }
    }
);