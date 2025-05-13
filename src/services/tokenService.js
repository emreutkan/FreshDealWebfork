const TOKEN_KEY = 'user_token';

let tokenManager = null;

export const initializeTokenService = (manager) => {
    tokenManager = manager;
};

export const tokenService = {
    async setToken(token) {
        // Store token in localStorage for persistence
        localStorage.setItem(TOKEN_KEY, token);
        console.log("Token stored in localStorage:", token);
    },

    async getToken() {
        try {
            // First check localStorage
            const storedToken = localStorage.getItem(TOKEN_KEY);
            console.log("Token retrieved from localStorage:", storedToken);

            if (storedToken) {
                return storedToken;
            }

            // If not in localStorage, try the tokenManager (Redux)
            if (tokenManager) {
                const stateToken = tokenManager.getStateToken();
                console.log("Token retrieved from state:", stateToken);
                if (stateToken) {
                    // If found in state, also save to localStorage for persistence
                    localStorage.setItem(TOKEN_KEY, stateToken);
                    return stateToken;
                }
            }

            console.warn('No token found and no token manager available');
            return null;
        } catch (error) {
            console.error("Error in getToken:", error);
            throw error;
        }
    },

    async clearToken() {
        localStorage.removeItem(TOKEN_KEY);
    }
};

export const validateToken = (token) => {
    if (!token) {
        throw new Error('Authentication token is missing.');
    }
    return token;
};

export default tokenService;