import { createSlice } from '@reduxjs/toolkit';
import { getRecommendationsThunk } from '../thunks/recommendationThunks';

const initialState = {
    recommendationIds: [],
    loading: false,
    error: null,
    status: 'idle'
};

const recommendationSlice = createSlice({
    name: 'recommendation',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRecommendationsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(getRecommendationsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.recommendationIds = action.payload.restaurants || [];
                state.status = 'succeeded';
            })
            .addCase(getRecommendationsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = 'failed';
            });
    }
});

export default recommendationSlice.reducer;