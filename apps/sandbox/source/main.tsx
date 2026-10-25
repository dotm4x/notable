import React from 'react';
import ReactDOM from 'react-dom/client';
import '@dotm4x/notable/styles.css';
import { App } from './App.tsx';
import './app.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
