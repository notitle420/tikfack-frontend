import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// index.html 内のルート要素を取得
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
