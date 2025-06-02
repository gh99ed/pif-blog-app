import React, { StrictMode } from 'react'; 
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { GoogleOAuthProvider } from '@react-oauth/google';


const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <ToastContainer />
          <App />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
