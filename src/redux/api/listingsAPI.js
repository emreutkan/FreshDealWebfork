import axios from "axios";
import {logError, logRequest, logResponse} from "@src/utils/logger.js";
import {API_BASE_URL} from "@src/redux/api/API";

const LISTINGS_ENDPOINT = `${API_BASE_URL}/listings`;

export const getListingsAPI = async (params) => {
    const functionName = "getListingsAPI";

    const queryParams = {
        restaurant_id: params.restaurantId,
        page: params.page,
        per_page: params.perPage,
    };

    logRequest(functionName, LISTINGS_ENDPOINT, queryParams);

    try {
        const response = await axios.get(LISTINGS_ENDPOINT, {params: queryParams});
        logResponse(functionName, LISTINGS_ENDPOINT, response.data);
        return response.data;
    } catch (error) {
        logError(functionName, LISTINGS_ENDPOINT, error);
        throw error;
    }
};