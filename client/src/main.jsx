import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from './app/providers/AppProviders.jsx';
import App from './App.jsx';
import { registerServiceWorker } from './features/pwa/registerServiceWorker.js';
import './styles/tokens.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);

registerServiceWorker();
