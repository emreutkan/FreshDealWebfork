const TOKEN_KEY = 'user_token';

let tokenManager = null;

export const initializeTokenService = (manager) => {
    tokenManager = manager;
};

export const tokenService = {
    async setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    async getToken() {
        // eslint-disable-next-line no-useless-catch
        try {
            const storedToken = localStorage.getItem(TOKEN_KEY);

            if (storedToken) {
                return validateToken(storedToken);
            }

            if (tokenManager) {
                const stateToken = tokenManager.getStateToken();
                return validateToken(stateToken);
            }

            console.warn('No token found and no token manager available');
        } catch (error) {
            throw error;
        }
    }
};

export const validateToken = (token) => {
    if (!token) {
        throw new Error('Authentication token is missing.');
    }
    return token;
};

export default tokenService;