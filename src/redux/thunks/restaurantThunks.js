import {createAsyncThunk} from '@reduxjs/toolkit';
import {
    addRestaurantComment,
    createRestaurant,
    deleteRestaurant,
    getAllRestaurants,
    getFlashDeals,
    getRecentRestaurants,
    getRestaurant,
    getRestaurantBadges,
    getRestaurantCommentAnalysis,
    getRestaurantComments,
    getRestaurantsInProximity,
    updateRestaurant
} from "@src/redux/api/restaurantAPI";
import {tokenService} from "@src/services/tokenService.js";
import {getListingsAPI} from "@src/redux/api/listingsAPI";

export const getRecentRestaurantsThunk = createAsyncThunk(
    'restaurant/getRecentRestaurants',
    async (_, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            return await getRecentRestaurants(token);
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch recent restaurants');
        }
    }
);

export const getRestaurantsByProximity = createAsyncThunk(
    'restaurant/getRestaurantsByProximity',
    async (_, {rejectWithValue, getState}) => {
        try {
            const address = getState().address.addresses.find(
                (address) => address.is_primary
            );
            if (!address) {
                console.error('Primary address is missing.');
                return rejectWithValue('Primary address is missing.');
            }

            const token = await tokenService.getToken();
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }

            const radius = getState().restaurant.radius;
            const data = await getRestaurantsInProximity(
                address.latitude,
                address.longitude,
                radius,
                token
            );
            return data;
        } catch (error) {
            return rejectWithValue('Failed to fetch restaurants: ' + error.message);
        }
    }
);

export const getListingsThunk = createAsyncThunk(
    'listings/getListingsThunk',
    async (params, {rejectWithValue}) => {
        try {
            const data = await getListingsAPI(params);
            return {
                listings: data.data,
                pagination: data.pagination,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getRestaurantThunk = createAsyncThunk(
    'restaurant/getRestaurant',
    async (restaurantId, {rejectWithValue}) => {
        try {
            return await getRestaurant(restaurantId);
        } catch (error) {
            return rejectWithValue('Failed to fetch restaurant: ' + error.message);
        }
    }
);

export const getAllRestaurantsThunk = createAsyncThunk(
    'restaurant/getAllRestaurants',
    async (_, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            return await getAllRestaurants(token);
        } catch (error) {
            return rejectWithValue('Failed to fetch restaurants: ' + error.message);
        }
    }
);

export const createRestaurantThunk = createAsyncThunk(
    'restaurant/createRestaurant',
    async (formData, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            return await createRestaurant(formData, token);
        } catch (error) {
            return rejectWithValue('Failed to create restaurant: ' + error.message);
        }
    }
);

export const updateRestaurantThunk = createAsyncThunk(
    'restaurant/updateRestaurant',
    async ({restaurantId, formData}, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            return await updateRestaurant(restaurantId, formData, token);
        } catch (error) {
            return rejectWithValue('Failed to update restaurant: ' + error.message);
        }
    }
);

export const deleteRestaurantThunk = createAsyncThunk(
    'restaurant/deleteRestaurant',
    async (restaurantId, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            await deleteRestaurant(restaurantId, token);
        } catch (error) {
            return rejectWithValue('Failed to delete restaurant: ' + error.message);
        }
    }
);

export const addRestaurantCommentThunk = createAsyncThunk(
    'restaurant/addComment',
    async ({restaurantId, commentData}, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }

            const sanitizedData = {
                ...commentData,
                rating: parseInt(String(commentData.rating), 10),
                purchase_id: parseInt(String(commentData.purchase_id), 10)
            };

            await addRestaurantComment(restaurantId, sanitizedData, token);
        } catch (error) {
            console.error('[addRestaurantComment] Error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
        }
    }
);

export const getRestaurantBadgesThunk = createAsyncThunk(
    'restaurant/getBadges',
    async ({restaurantId}, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }

            const result = await getRestaurantBadges(restaurantId, token);
            console.log('Fetched restaurant badges:', result);
            return {badges: result};
        } catch (error) {
            return rejectWithValue('Failed to fetch restaurant badges: ' + error.message);
        }
    }
);

export const getRestaurantCommentAnalysisThunk = createAsyncThunk(
    'restaurant/getCommentAnalysis',
    async (restaurantId, {getState, rejectWithValue}) => {
        try {
            const {user} = getState();
            if (!user.token) {
                return rejectWithValue('Authentication required');
            }

            return await getRestaurantCommentAnalysis(restaurantId, user.token);
        } catch (error) {
            console.error('Error fetching restaurant comment analysis:', error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch restaurant comment analysis'
            );
        }
    }
);

export const getRestaurantCommentsThunk = createAsyncThunk(
    'restaurant/getRestaurantComments',
    async (restaurantId, {rejectWithValue}) => {
        try {
            return await getRestaurantComments(restaurantId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch restaurant comments'
            );
        }
    }
);

export const getFlashDealsThunk = createAsyncThunk(
    'restaurant/getFlashDeals',
    async (_, {rejectWithValue, getState}) => {
        try {
            const address = getState().address.addresses.find(
                (address) => address.is_primary
            );
            if (!address) {
                console.error('Primary address is missing.');
                return rejectWithValue('Primary address is missing.');
            }

            const token = await tokenService.getToken();
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }

            const radius = 30; // Default radius for flash deals
            const data = await getFlashDeals(
                address.latitude,
                address.longitude,
                radius,
                token
            );
            return data;
        } catch (error) {
            return rejectWithValue('Failed to fetch flash deals: ' + error.message);
        }
    }
);