import React from 'react';
import ReactDOM from 'react-dom/client';
import '@notable/react/styles.css';
import { ToastProvider } from '@notable/react';
import { App } from './App.tsx';
import './app.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider position="bottom-right">
      <App />
    </ToastProvider>
  </React.StrictMode>,
);
