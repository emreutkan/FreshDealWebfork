import {apiClient} from '@src/services/apiClient.js';
import {API_BASE_URL} from "@src/redux/api/API";
import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

/*
  Define constants for your authentication endpoints.
  You can adjust these to match your actual API routes.
*/
const LOGIN_ENDPOINT = `${API_BASE_URL}/login`;
const REGISTER_ENDPOINT = `${API_BASE_URL}/register`;
const VERIFY_EMAIL_ENDPOINT = `${API_BASE_URL}/verify_email`;
const FORGOT_PASSWORD_ENDPOINT = `${API_BASE_URL}/forgot-password`;

// Add these interfaces
export const authApi = {
    /*
      Logs in a user using a POST request.
      The payload uses the LoginPayload type from your types/api.ts.
      Adjust the ApiResponse generic parameter to match what your actual
      API returns (e.g., { token: string }).
    */
    async login(payload) {
        return apiClient.request({
            method: "POST",
            url: LOGIN_ENDPOINT,
            data: payload
        });
    },

    /*
      Registers a user. The payload uses the RegisterPayload type.
      You can adjust the return type to match your registration endpoint's response
      (e.g., { success: boolean; message: string; token?: string }).
    */
    async register(userData) {
        return apiClient.request({
            method: "POST",
            url: REGISTER_ENDPOINT,
            data: userData
        });
    },

};

export const verifyCode = createAsyncThunk(
    "user/verifyCode",
    async (payload, {rejectWithValue}) => {
        try {
            const response = await axios.post(VERIFY_EMAIL_ENDPOINT, payload);
            if (response.data.success) {
                return response.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.message || "Verification failed");
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "user/forgotPassword",
    async (payload, {rejectWithValue}) => {
        try {
            const response = await axios.post(FORGOT_PASSWORD_ENDPOINT, payload);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || {message: "Failed to reset password"});
        }
    }
);

