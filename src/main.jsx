import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './responsive.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { AccountProvider } from './context/account';
import { AuthProvider } from './context/AuthContext';
import { store } from '../store/store';
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <AuthProvider>
    <AccountProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AccountProvider>
    </AuthProvider>
    </Provider>
  </StrictMode>,
)
