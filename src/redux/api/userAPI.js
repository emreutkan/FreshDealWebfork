import {API_BASE_URL} from "@src/redux/api/API";
import {apiClient} from '@src/services/apiClient.js';

const USER_ENDPOINT = `${API_BASE_URL}/user`;

export const userApi = {
    async updateUsername(newUsername, token) {
        return apiClient.request({
            method: 'PUT',
            url: `${USER_ENDPOINT}/username`,
            data: {username: newUsername},
            token,
        });
    },

    async updateEmail(oldEmail, newEmail, token) {
        return apiClient.request({
            method: 'PUT',
            url: `${USER_ENDPOINT}/email`,
            data: {old_email: oldEmail, new_email: newEmail},
            token,
        });
    },
    async updatePassword(oldPassword, newPassword, token) {
        return apiClient.request({
            method: 'PUT',
            url: `${USER_ENDPOINT}/password`,
            data: {old_password: oldPassword, new_password: newPassword},
            token,
        });
    },

    async getUserData(token) {
        return apiClient.request({
            method: 'GET',
            url: USER_ENDPOINT,
            token,
        });
    },

    async addToFavorites(restaurantId, token) {
        return apiClient.request({
            method: 'POST',
            url: `${USER_ENDPOINT}/favorites`,
            data: {restaurant_id: restaurantId},
            token,
        });
    },

    async removeFromFavorites(restaurantId, token) {
        return apiClient.request({
            method: 'DELETE',
            url: `${USER_ENDPOINT}/favorites`,
            data: {restaurant_id: restaurantId},
            token,
        });
    },

    async getFavorites(token) {
        return apiClient.request({
            method: 'GET',
            url: `${USER_ENDPOINT}/favorites`,
            token,
        });
    },

    async getUserRank(userId, token) {
        return apiClient.request({
            method: 'GET',
            url: `${API_BASE_URL}/user/rank/${userId}`,
            token,
        });
    },

    async getUserRankings(token) {
        return apiClient.request({
            method: 'GET',
            url: `${API_BASE_URL}/user/rankings`,
            token,
        });
    },
};