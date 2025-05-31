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

            // Updated to match mobile endpoint
            const response = await axios.get(`${API_BASE_URL}/api/recommendations/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Match mobile implementation's response handling
            if (response.data && response.data.success && Array.isArray(response.data.data)) {
                return { restaurants: response.data.data };
            } else {
                return rejectWithValue(response.data?.message || 'Invalid response format');
            }
        } catch (error) {
            console.error('Recommendations Error:', error);
            return rejectWithValue('Failed to fetch recommendations: ' + (error.message || 'Unknown error'));
        }
    }
);

