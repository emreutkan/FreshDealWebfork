// reportSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {createReportThunk} from "@src/redux/thunks/reportThunks.js";

const initialState = {
    error: null,
    loading: false,
};
const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createReportThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReportThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createReportThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});



export default reportSlice.reducer;