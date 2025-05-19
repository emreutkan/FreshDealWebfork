import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../api/API';
import { tokenService } from '@src/services/tokenService.js';

export const getRecommendationsThunk = createAsyncThunk(
    'recommendation/getRecommendations',
    async (_, { rejectWithValue }) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }

            const response = await axios.get(`${API_BASE_URL}/recommendations`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch recommendations: ' + error.message);
        }
    }
);