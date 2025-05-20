
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root and render app immediately
createRoot(document.getElementById("root")!).render(<App />);

// Track route changes for Google Analytics
// This will be triggered whenever the location changes in the app
if (typeof window !== 'undefined' && 'gtag' in window) {
  const handleRouteChange = (url: string) => {
    // @ts-ignore - gtag is defined in the script tag in index.html
    window.gtag('config', 'G-JLEKHH2W9H', {
      page_path: url,
    });
  };
  
  // Initial page load
  handleRouteChange(window.location.pathname);
  
  // Listen for history changes (this is a basic implementation)
  // A more robust implementation would use React Router's history
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    handleRouteChange(window.location.pathname);
  };
  
  window.addEventListener('popstate', () => {
    handleRouteChange(window.location.pathname);
  });
}
