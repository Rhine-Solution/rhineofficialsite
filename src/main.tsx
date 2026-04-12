import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// Console signal for verifying app initialization after refresh
console.log('App initializing — main.tsx');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <div id="app">
        <App />
      </div>
    </HelmetProvider>
  </React.StrictMode>
);
