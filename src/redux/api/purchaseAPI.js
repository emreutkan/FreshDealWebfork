import {API_BASE_URL} from "@src/redux/api/API";
import {apiClient} from '@src/services/apiClient.js';

const PURCHASE_ENDPOINT = `${API_BASE_URL}/purchase`;


export const purchaseAPI = {
    // Create a purchase order
    async createPurchaseOrder(
        token,
        requestData
    ) {
        return apiClient.request({
            method: 'POST',
            url: PURCHASE_ENDPOINT,
            data: requestData,  // Send the data directly
            token,
        });
    },

    // Handle restaurant response to purchase (accept/reject)
    // Add completion image to purchase
    // Get restaurant purchases
    async getRestaurantPurchases(
        restaurantId,
        token
    ) {
        return apiClient.request({
            method: 'GET',
            url: `${API_BASE_URL}/restaurant/${restaurantId}/purchases`,
            token,
        });
    },

    // Accept purchase (shorthand method)
    // Reject purchase (shorthand method)
    // New endpoints based on Flask implementation

    // Get user's active orders
    async getUserActiveOrders(
        token
    ) {
        return apiClient.request({
            method: 'GET',
            url: `${API_BASE_URL}/user/orders/active`,
            token,
        });
    },

    // Get user's previous orders
    async getUserPreviousOrders(
        token,
        params
    ) {
        return apiClient.request({
            method: 'GET',
            url: `${API_BASE_URL}/user/orders/previous`,
            params: {
                page: params?.page || 1,
                per_page: params?.per_page || 10
            },
            token,
        });
    },

    // Get order details
    async getOrderDetails(
        purchaseId,
        token
    ) {
        return apiClient.request({
            method: 'GET',
            url: `${API_BASE_URL}/user/orders/${purchaseId}`,
            token,
        });
    },

    // Check if a purchase has a rating
    async checkPurchaseRating(
        purchaseId,
        token
    ) {
        return apiClient.request({
            method: 'GET',
            url: `${API_BASE_URL}/purchase/${purchaseId}/has-rating`,
            token,
        });
    },
};

