import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { register as registerSW, setupInstallPrompt } from './utils/serviceWorker';
import './utils/offlineTest'; // Auto-run offline functionality tests

const root = createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Register service worker for offline functionality
registerSW({
  onSuccess: () => {
    console.log('App is ready for offline use');
  },
  onUpdate: () => {
    console.log('New content available, please refresh');
  }
});

// Setup PWA install prompt
setupInstallPrompt();
