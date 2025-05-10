// Add Address API Call
import {API_BASE_URL} from "@src/redux/api/API";
import axios from "axios";
import {logError, logRequest, logResponse} from "@src/utils/logger.js";

const ADDRESS_ENDPOINT = `${API_BASE_URL}/addresses`;

export const addAddressAPI = async (address, token) => {
    const functionName = 'addAddress';
    const payload = address;
    logRequest(functionName, ADDRESS_ENDPOINT, payload);
    try {
        const response = await axios.post(ADDRESS_ENDPOINT, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        logResponse(functionName, ADDRESS_ENDPOINT, response.data);
        return response.data; // Now returns { success, message, address }
    } catch (error) {
        logError(functionName, ADDRESS_ENDPOINT, error);
        throw error;
    }
};


export const deleteAddressAPI = async (addressId, token) => {
    const functionName = 'deleteAddressAPI';
    const DELETE_ADDRESS_ENDPOINT = `${ADDRESS_ENDPOINT}/${addressId}`;
    const payload = {address_id: addressId};
    logRequest(functionName, DELETE_ADDRESS_ENDPOINT, payload);
    try {
        const response = await axios.delete(DELETE_ADDRESS_ENDPOINT, {
            headers: {Authorization: `Bearer ${token}`},
            data: payload
        });
        logResponse(functionName, DELETE_ADDRESS_ENDPOINT, response.data);
        return response.data;
    } catch (error) {
        logError(functionName, DELETE_ADDRESS_ENDPOINT, error);
        throw error;
    }
};


// Function to update an address
export const updateAddressAPI = async (
    addressId,
    updates,
    token
) => {
    const functionName = 'updateAddressAPI';
    const UPDATE_ADDRESS_ENDPOINT = `${ADDRESS_ENDPOINT}/${addressId}`;
    const payload = updates;

    logRequest(functionName, UPDATE_ADDRESS_ENDPOINT, payload);

    try {
        const response = await axios.put(UPDATE_ADDRESS_ENDPOINT, payload, {
            headers: {Authorization: `Bearer ${token}`},
        });
        logResponse(functionName, UPDATE_ADDRESS_ENDPOINT, response.data);
        return response.data;
    } catch (error) {
        logError(functionName, UPDATE_ADDRESS_ENDPOINT, error);
        throw error;
    }
};