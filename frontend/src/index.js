/**
 * This file only renders the root component and stores the URL of API
 * it has no other use
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

export const API_URL = 'http://localhost:5000';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);