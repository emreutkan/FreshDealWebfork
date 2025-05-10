import axios from "axios";
import {logError, logRequest, logResponse} from "@src/utils/logger.js";
import {API_BASE_URL} from "@src/redux/api/API";

const REPORTS_ENDPOINT = `${API_BASE_URL}/report`;

// Create Report API Call
export const createReport = async (
    reportData,
    token
) => {
    const functionName = 'createReport';
    const endpoint = REPORTS_ENDPOINT;

    // Create FormData instance
    const formData = new FormData();
    formData.append('purchase_id', reportData.purchase_id.toString());
    formData.append('description', reportData.description);
    formData.append('image', reportData.image);

    // Log the request (excluding the file content for clarity)
    logRequest(functionName, endpoint, {
        purchase_id: reportData.purchase_id,
        description: reportData.description,
        image: reportData.image.name
    });

    try {
        const response = await axios.post(endpoint, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Changed content type
            },
        });
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error) {
        logError(functionName, endpoint, error);
        throw error;
    }
};