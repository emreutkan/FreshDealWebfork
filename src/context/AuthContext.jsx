import {createContext, useState, useEffect} from "react";
import { useDispatch } from 'react-redux';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const dispatch = useDispatch();

    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem("authToken", token);
        dispatch({ type: 'user/setToken', payload: token });
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem("authToken");
        dispatch({ type: 'user/logout' });
    };

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