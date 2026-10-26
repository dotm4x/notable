import React from 'react';
import ReactDOM from 'react-dom/client';
import '@dotm4x/notable/styles.css';
import { ToastProvider } from '@dotm4x/notable';
import { App } from './App.tsx';
import './app.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider position="bottom-right">
      <App />
    </ToastProvider>
  </React.StrictMode>,
);
