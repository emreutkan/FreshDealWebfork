import {createContext, useState, useEffect} from "react";
import { useDispatch } from 'react-redux';
import { tokenService, initializeTokenService } from '../services/tokenService';
import { getUserDataThunk } from '../redux/thunks/userThunks';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("user_token"));
    const dispatch = useDispatch();

    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem("user_token", token);
        dispatch({ type: 'user/setToken', payload: token });
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem("user_token");
        dispatch({ type: 'user/logout' });
    };

    useEffect(() => {
        // Initialize token manager
        initializeTokenService({
            getStateToken: () => authToken
        });

        // Check for token on page refresh
        const storedToken = localStorage.getItem("user_token");
        if (storedToken) {
            setAuthToken(storedToken);
            dispatch({ type: 'user/setToken', payload: storedToken });

            // Fetch user data on initialization when token exists
            dispatch(getUserDataThunk({ token: storedToken }));
        }
    }, [dispatch]);

    useEffect(() => {
        if (authToken) {
            dispatch({ type: 'user/setToken', payload: authToken });
        }
    }, [authToken, dispatch]);

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider };
export default AuthContext;