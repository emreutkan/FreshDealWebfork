import {createAsyncThunk} from '@reduxjs/toolkit';
import {purchaseAPI} from '@src/redux/api/purchaseAPI';
import {tokenService} from "@src/services/tokenService.js";

// Helper function to serialize address for delivery info
export const serializeAddressForDelivery = (address) => {
    const parts = [
        address.street,
        address.neighborhood,
        // address.district,
        // address.province,
        address.country,
    ].filter(Boolean);
    console.log("Apartment No: " + address.apartmentNo);

    if (address.apartmentNo) {
        parts.push(`Apt: ${address.apartmentNo}`);
    }
    if (address.doorNo) {
        parts.push(`Door: ${address.doorNo}`);
    }

    return parts.join(' ');
};

export const createPurchaseOrderAsync = createAsyncThunk(
    'purchase/createOrder',
    async ({isDelivery, notes, flashDealsActivated}, {getState, rejectWithValue}) => {
        try {
            const state = getState();
            const token = await tokenService.getToken();

            if (!token) {
                return rejectWithValue('Authentication token is missing');
            }

            const selectedAddressId = state.address.selectedAddressId;
            const selectedAddress = state.address.addresses.find(address => address.id === selectedAddressId);
            if (!selectedAddress) {
                return rejectWithValue('Delivery address is required for delivery orders');
            }

            const requestData = {
                is_delivery: isDelivery,
                delivery_notes: notes,
                ...(isDelivery ? {
                    delivery_address: serializeAddressForDelivery(selectedAddress)
                } : {}),
                flashdealsactivated: flashDealsActivated
            };
            if (isDelivery && !requestData.delivery_address) {
                console.log('Delivery address is required for delivery orders');
            }


            return await purchaseAPI.createPurchaseOrder(token, requestData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create purchase order');
        }
    }
);
export const fetchActiveOrdersAsync = createAsyncThunk(
    'purchase/fetchActiveOrders',
    async (_, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing');
            }
            return await purchaseAPI.getUserActiveOrders(token);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch active orders');
        }
    }
);

export const fetchPreviousOrdersAsync = createAsyncThunk(
    'purchase/fetchPreviousOrders',
    async ({page = 1, perPage = 10}, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing');
            }
            return await purchaseAPI.getUserPreviousOrders(token, {page, per_page: perPage});
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch previous orders');
        }
    }
);

export const fetchOrderDetailsAsync = createAsyncThunk(
    'purchase/fetchOrderDetails',
    async (purchaseId, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing');
            }
            return await purchaseAPI.getOrderDetails(purchaseId, token);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
        }
    }
);


export const fetchRestaurantPurchasesAsync = createAsyncThunk(
    'purchase/fetchRestaurantPurchases',
    async (restaurantId, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing');
            }
            return await purchaseAPI.getRestaurantPurchases(restaurantId, token);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurant purchases');
        }
    }
);