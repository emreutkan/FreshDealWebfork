import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext';
import { Provider } from 'react-redux';
import { GlobalResetProvider } from './context/GlobalResetContext';
import {store} from "@src/redux/store.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
        <AuthProvider>
                <GlobalResetProvider>
                  <App/>
                </GlobalResetProvider>
        </AuthProvider>
      </Provider>
  </StrictMode>
)
