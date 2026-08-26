import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found.');

// This app owns scroll position end to end (lib/scroll.ts + useRouteScroll in
// App.tsx). Left on 'auto', the browser also restores scroll on reload and on
// Back, on its own async schedule, and fights our restore.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
