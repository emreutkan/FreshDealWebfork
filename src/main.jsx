import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AccountProvider } from './context/account';
import { AuthProvider } from './context/AuthContext';
import { Provider } from 'react-redux';
import { CartProvider } from './context/CartContext';
import { GlobalResetProvider } from './context/GlobalResetContext';
import {store} from "@src/redux/store.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
        <AuthProvider>
            <AccountProvider>
              <CartProvider>
                <GlobalResetProvider>
                  <App/>
                </GlobalResetProvider>
              </CartProvider>
            </AccountProvider>
        </AuthProvider>
      </Provider>
  </StrictMode>
)
