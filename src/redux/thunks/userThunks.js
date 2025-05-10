import {createAsyncThunk} from "@reduxjs/toolkit";
import {tokenService} from "@src/services/tokenService.js";
import {userApi} from "@src/redux/api/userAPI";
import {authApi} from "@src/redux/api/authAPI";
import {setToken} from "@src/redux/slices/userSlice";

export const loginUserThunk = createAsyncThunk(
    "user/loginUser",
    async (payload, {dispatch, rejectWithValue}) => {
        try {
            const response = await authApi.login(payload);
            console.log(response)

            if (response.token) {
                dispatch(setToken(response.token));
                await dispatch(getUserDataThunk({token: response.token}));
            }

            console.log(response)
            return response;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data || "Login failed");
        }
    }
);


// Registration
export const registerUserThunk = createAsyncThunk(
    "user/registerUser",
    async (userData, {rejectWithValue}) => {
        try {
            const response = await authApi.register(userData);
            return {
                success: response.success,
                message: response.message,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Registration failed");
        }
    }
);

// Update username
export const updateUsernameThunk = createAsyncThunk(
    "user/updateUsername",
    async ({username}, {dispatch, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }
            const response = await userApi.updateUsername(username, token);
            await dispatch(getUserDataThunk({token}));
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update username");
        }
    }
);

// Update email
export const updateEmailThunk = createAsyncThunk(
    "user/updateEmail",
    async ({old_email, new_email}, {dispatch, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }
            const response = await userApi.updateEmail(old_email, new_email, token);
            await dispatch(getUserDataThunk({token}));
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update email");
        }
    }
);

// Update password
export const updatePasswordThunk = createAsyncThunk(
    "user/updatePassword",
    async ({old_password, new_password}, {dispatch, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }
            const response = await userApi.updatePassword(old_password, new_password, token);
            await dispatch(getUserDataThunk({token}));
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update password");
        }
    }
);

// Get user data
export const getUserDataThunk = createAsyncThunk(
    "user/getUserData",
    async ({token}, {rejectWithValue}) => {
        try {
            return await userApi.getUserData(token);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch user data");
        }
    }
);

// Add to favorites
export const addFavoriteThunk = createAsyncThunk(
    "favorites/addFavorite",
    async ({restaurant_id}, {dispatch, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }
            const response = await userApi.addToFavorites(restaurant_id, token);
            await dispatch(getFavoritesThunk()); // Refresh favorites
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add favorite");
        }
    }
);

// Remove from favorites
export const removeFavoriteThunk = createAsyncThunk(
    "favorites/removeFavorite",
    async ({restaurant_id}, {dispatch, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }
            const response = await userApi.removeFromFavorites(restaurant_id, token);
            await dispatch(getFavoritesThunk());
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to remove favorite");
        }
    }
);

export const getFavoritesThunk = createAsyncThunk(
    "favorites/getFavorites",
    async (_, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }
            const response = await userApi.getFavorites(token);
            return {favorites: response.favorites};
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch favorites"
            );
        }
    }
);

export const getUserRankThunk = createAsyncThunk(
    "user/getUserRank",
    async (userId, {getState, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }

            // Get userId from parameters or from state if not provided
            const actualUserId = userId || getState().user.userId;

            const response = await userApi.getUserRank(actualUserId, token);
            console.log("User rank response:", response);

            return response;
        } catch (error) {
            console.log("Error fetching user rank:", error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch user rank"
            );
        }
    }
);
// Get all user rankings
export const getUserRankingsThunk = createAsyncThunk(
    "user/getUserRankings",
    async (_, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }

            const response = await userApi.getUserRankings(token);


            if (!Array.isArray(response)) {
                return rejectWithValue("Invalid rankings response format");
            }

            return response;
        } catch (error) {
            console.log("Error fetching user rankings:", error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch user rankings"
            );
        }
    }
);