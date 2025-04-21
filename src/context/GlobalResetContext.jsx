import {createContext, useState} from "react";

const GlobalResetContext = createContext();

const GlobalResetProvider = ({ children }) => {
    const [resetKey, setResetKey] = useState(0);

    const globalReset = () => {
        setResetKey(prev => prev + 1);
    };

    return (
        <GlobalResetContext.Provider value={{ resetKey, globalReset }}>
          {children}
        </GlobalResetContext.Provider>
    );
}

export { GlobalResetProvider };
export default GlobalResetContext;