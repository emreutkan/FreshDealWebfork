import {API_BASE_URL} from "@src/redux/api/API";
import {apiClient} from '@src/services/apiClient.js';

const SEARCH_API_ENDPOINT = `${API_BASE_URL}/search`;


export const searchApi = {

    async RestaurantSearch(searchParams) {
        return apiClient.request({
            method: 'GET',
            url: SEARCH_API_ENDPOINT,
            params: searchParams,
        });
    }
};