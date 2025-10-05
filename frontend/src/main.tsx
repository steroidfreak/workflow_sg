import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './index.css';
import { ThemeProvider } from './lib/theme';
import { DesignProvider } from './lib/design';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <DesignProvider>
        <App />
      </DesignProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
