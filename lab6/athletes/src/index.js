
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ProductProvider } from './ProductContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ProductProvider>
    <App />
  </ProductProvider>
);

