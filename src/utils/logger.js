export const logRequest = (functionName, endpoint, payload) => {
    console.log(`[REQUEST] [${functionName}] Endpoint: ${endpoint}`);
    console.log(`[REQUEST] [${functionName}] Payload:`, JSON.stringify(payload, null, 2));
};

export const logResponse = (functionName, endpoint, response) => {
    console.log(`[RESPONSE] [${functionName}] Endpoint: ${endpoint}`);
    console.log(`[RESPONSE] [${functionName}] Data:`, JSON.stringify(response, null, 2));
};

export const logError = (functionName, endpoint, error) => {
    console.error(`[ERROR] [${functionName}] Endpoint: ${endpoint}`);
    if (error.response) {
        console.error(`[ERROR] [${functionName}] Status: ${error.response.status}`);
        console.error(`[ERROR] [${functionName}] Data:`, error.response.data);
    } else {
        console.error(`[ERROR] [${functionName}] Message: ${error.message}`);
    }
};